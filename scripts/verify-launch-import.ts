/* eslint-disable @typescript-eslint/no-explicit-any -- Compare archived Sanity documents without reshaping their fields. */
import { createClient } from '@sanity/client';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import candidates from '../src/content/local/launch-photo-candidates.json' with { type: 'json' };
createRequire(resolve('package.json'))('@next/env').loadEnvConfig(
  process.cwd(),
);
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-09-27',
  useCdn: false,
  perspective: 'raw',
  token: process.env.SANITY_AUTH_TOKEN,
});
const root = '.wrangler/launch-backups/sanity';
const folder = (await readdir(root)).find((n) =>
  n.startsWith('production-export-'),
)!;
// Portable exports replace asset references with file links; compare restored IDs.
function restoreAssets(value: any): any {
  if (Array.isArray(value)) return value.map(restoreAssets);
  if (!value || typeof value !== 'object') return value;
  const result: any = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== '_sanityAsset')
      .map(([key, entry]) => [key, restoreAssets(entry)]),
  );
  if (value._sanityAsset) {
    const [kind, path] = value._sanityAsset.split('@');
    result.asset = {
      _type: 'reference',
      _ref: `${kind}-${path
        .split('/')
        .pop()
        .replace(/\.([^.]+)$/, '-$1')}`,
    };
  }
  return result;
}
const before = (await readFile(`${root}/${folder}/data.ndjson`, 'utf8'))
  .trim()
  .split('\n')
  .map((s) => restoreAssets(JSON.parse(s)))
  .filter((d) => !d._type.startsWith('sanity.'));
const after = await client.fetch('*[!(_type match "sanity.*")]');
const unchangedFields = (d: any) =>
  Object.fromEntries(
    Object.entries(d).filter(([key]) => !['_rev', '_updatedAt'].includes(key)),
  );
const reports = [];
for (const old of before) {
  const current = after.find((d: any) => d._id === old._id);
  if (!current) throw Error(`Missing original document ${old._id}`);
  if (old._type === 'gallery' && !old._id.startsWith('drafts.')) {
    if (
      !isDeepStrictEqual(old.images, current.images.slice(0, old.images.length))
    )
      throw Error(`Existing photograph changes detected: ${old._id}`);
    if (
      !isDeepStrictEqual(
        unchangedFields({ ...old, images: [] }),
        unchangedFields({ ...current, images: [] }),
      )
    )
      throw Error(`Gallery fields changed: ${old._id}`);
  } else if (!isDeepStrictEqual(unchangedFields(old), unchangedFields(current)))
    throw Error(`Review changed document: ${old._id}`);
}
for (const [slug, photos] of Object.entries(candidates)) {
  const id = `gallery-${slug}`;
  const original = before.find((d) => d._id === id);
  const current = after.find((d: any) => d._id === id);
  const additions = current.images.slice(original.images.length);
  const keys = current.images.map((p: any) => p._key);
  if (new Set(keys).size !== keys.length)
    throw Error(`Duplicate image IDs in ${slug}`);
  for (const p of additions)
    if (!p.alt || !p.sourceUrl || !p.sourcePage)
      throw Error(`Missing source/alt in ${slug}`);
  reports.push({
    slug,
    existing: original.images.length,
    source: photos.length,
    added: additions.length,
    skipped: photos.length - additions.length,
    total: current.images.length,
    blocked: Boolean(after.find((d: any) => d._id === `drafts.${id}`)),
    ids: additions.map((p: any) => p._key),
  });
}
const report = {
  mode: 'applied-and-verified',
  at: new Date().toISOString(),
  originalDocumentsPreserved: before.length,
  galleries: reports,
};
await writeFile(
  'docs/launch-photo-report.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    { ...report, galleries: reports.map((r) => ({ ...r, ids: undefined })) },
    null,
    2,
  ),
);
