// Only populate the new optional field; preserve every existing field and draft.
import { createClient } from '@sanity/client';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
createRequire(resolve('package.json'))('@next/env').loadEnvConfig(
  process.cwd(),
);
const apply = process.argv.includes('--apply');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-09-27',
  useCdn: false,
  perspective: 'raw',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_READ_TOKEN,
});
const home = await client.fetch('*[_id == "homepage"][0]');
const draft = await client.fetch('count(*[_id == "drafts.homepage"])');
if (!home || draft || home.awards?.image) {
  console.log(
    'No changes: homepage missing, has a draft, or already has an awards image.',
  );
} else {
  const image = await client.fetch(
    '*[_id == "article-we-won-an-award"][0].blocks[].images[_key == "review-ef61c81e4fb716"][0]',
  );
  const selected = image?.find(
    (item: { asset?: unknown } | null) => item?.asset,
  );
  if (!selected)
    throw Error('Existing certificate image not found; no changes made.');
  selected.alt =
    'Legacy Photography Awards Excellence distinction, newborn category, February 2026 — sleeping baby in blue, photographed by Rachel Whitley';
  console.log(
    apply
      ? 'Applying awards image only.'
      : 'Dry run: would add existing certificate to homepage awards.',
  );
  if (apply) {
    if (!process.env.SANITY_AUTH_TOKEN)
      throw Error('Run with Sanity CLI --with-user-token.');
    await mkdir('.wrangler', { recursive: true });
    await writeFile(
      `.wrangler/awards-backup-${Date.now()}.json`,
      JSON.stringify(home),
    );
    await client
      .patch(home._id)
      .ifRevisionId(home._rev)
      .setIfMissing({ 'awards.image': selected })
      .commit();
    console.log('Added awards image.');
  }
}
