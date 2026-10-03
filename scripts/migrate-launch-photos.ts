/* eslint-disable @typescript-eslint/no-explicit-any -- Read-only legacy document shapes are checked before mutation. */
import { createClient } from '@sanity/client';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import candidates from '../src/content/local/launch-photo-candidates.json' with { type: 'json' };
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
if (apply && !process.env.SANITY_AUTH_TOKEN)
  throw Error('Use authenticated Sanity CLI');
const docs = await client.fetch('*[_type in ["gallery","photographyService"]]');
await mkdir('.wrangler/launch-backups', { recursive: true });
if (apply)
  await writeFile(
    `.wrangler/launch-backups/gallery-before-${Date.now()}.json`,
    JSON.stringify(docs),
  );
const canonical = (url: string = '') => {
  try {
    return decodeURIComponent(new URL(url).pathname).replace(
      /-p-\d+(?=\.)/,
      '',
    );
  } catch {
    return url;
  }
};
const cache = new Map<
  string,
  {
    fingerprint: Buffer;
    ratio: number;
    sha1: string;
    source?: string;
    filename?: string;
  }
>();
async function assetInfo(id: string) {
  if (cache.has(id)) return cache.get(id)!;
  const a = await client.getDocument(id);
  if (!a) throw Error('Missing asset ' + id);
  const r = await fetch(a.url);
  if (!r.ok) throw Error('Cannot read current asset');
  const bytes = Buffer.from(await r.arrayBuffer());
  const meta = await sharp(bytes).metadata();
  const value = {
    fingerprint: await sharp(bytes)
      .rotate()
      .resize(16, 16, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer(),
    ratio: (meta.width || 1) / (meta.height || 1),
    sha1: a.sha1hash,
    source: a.source?.url,
    filename: a.originalFilename,
  };
  cache.set(id, value);
  return value;
}
const reports = [];
const snapshots = [];
for (const [slug, photos] of Object.entries(candidates)) {
  const service = docs.find(
    (d: any) =>
      d._type === 'photographyService' &&
      d.slug?.current === slug &&
      !d._id.startsWith('drafts.'),
  );
  const id = service?.gallery?._ref;
  if (!id) throw Error('No gallery for ' + slug);
  const gallery = docs.find((d: any) => d._id === id);
  if (!gallery) throw Error('Missing gallery ' + id);
  const report = {
    slug,
    existing: gallery.images?.length || 0,
    source: photos.length,
    added: 0,
    skipped: 0,
    blocked: false,
    ids: [] as string[],
  };
  if (docs.some((d: any) => d._id === 'drafts.' + id)) {
    report.blocked = true;
    reports.push(report);
    continue;
  }
  const current = gallery.images || [];
  const additions = [];
  const fingerprints = [];
  for (const img of current)
    if (img.asset?._ref) fingerprints.push(await assetInfo(img.asset._ref));
  for (const photo of photos) {
    const fp = Buffer.from(photo.fingerprint, 'base64');
    const ratio = photo.width / photo.height;
    const duplicate =
      current.some(
        (img: any) => canonical(img.sourceUrl) === canonical(photo.sourceUrl),
      ) ||
      fingerprints.some(
        (a) =>
          canonical(a.source) === canonical(photo.sourceUrl) ||
          (Math.abs(a.ratio - ratio) < 0.02 &&
            a.fingerprint.reduce((sum, v, i) => sum + Math.abs(v - fp[i]), 0) /
              256 <
              3),
      );
    if (duplicate) {
      report.skipped++;
      continue;
    }
    const bytes = await readFile('public' + photo.src);
    const sha1 = createHash('sha1').update(bytes).digest('hex');
    let asset = await client.fetch(
      '*[_type=="sanity.imageAsset" && (source.id==$id || sha1hash==$sha1)][0]',
      { id: photo.id, sha1 },
    );
    if (asset && current.some((img: any) => img.asset?._ref === asset._id)) {
      report.skipped++;
      continue;
    }
    if (!asset && apply)
      asset = await client.assets.upload('image', bytes, {
        filename: photo.id + '.webp',
        source: {
          id: photo.id,
          name: 'Webflow launch archive',
          url: photo.sourceUrl,
        },
      });
    additions.push({
      _type: 'photograph',
      _key: photo.id,
      asset: { _type: 'reference', _ref: asset?._id || 'dryrun' },
      alt: photo.alt,
      sourceUrl: photo.sourceUrl,
      sourcePage: photo.sourcePage,
    });
    fingerprints.push({ fingerprint: fp, ratio, sha1 });
    report.added++;
    report.ids.push(photo.id);
  }
  if (apply && additions.length) {
    if (await client.getDocument('drafts.' + id)) {
      report.blocked = true;
      report.added = 0;
    } else
      await client
        .patch(id)
        .ifRevisionId(gallery._rev)
        .setIfMissing({ images: [] })
        .append('images', additions)
        .commit();
  }
  reports.push(report);
  console.log(JSON.stringify({ ...report, ids: undefined }));
}
await writeFile(
  'docs/launch-photo-report.json',
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      at: new Date().toISOString(),
      galleries: reports,
    },
    null,
    2,
  ) + '\n',
);
if (apply) {
  await mkdir('public/images/current', { recursive: true });
  const galleries = await client.fetch(
    '*[_type=="gallery" && !(_id in path("drafts.**"))]{"id":_id,title,images[]{"id":_key,alt,caption,sourceUrl,sourcePage,crop,hotspot,"asset":asset->{_id,url,metadata}},"featuredImageIds":coalesce(featuredImages[].asset._ref,[])}',
  );
  for (const g of galleries) {
    const images = [];
    for (const p of g.images || []) {
      if (!p.asset) continue;
      const a = p.asset;
      const source = Object.values(candidates)
        .flat()
        .find((photo) => photo.id === p.id);
      const cropKey = createHash('sha1')
        .update(JSON.stringify(p.crop || {}))
        .digest('hex')
        .slice(0, 8);
      const src =
        source && !p.crop
          ? source.src
          : '/images/current/' + a._id + '-' + cropKey + '.webp';
      let data;
      try {
        data = await readFile('public' + src);
      } catch {
        const r = await fetch(a.url);
        if (!r.ok) throw Error('Snapshot image unavailable');
        const original = Buffer.from(await r.arrayBuffer());
        let transform = sharp(original).rotate();
        const { width, height } = await transform.metadata();
        if (p.crop && width && height) {
          const left = Math.round((p.crop.left || 0) * width),
            top = Math.round((p.crop.top || 0) * height);
          transform = transform.extract({
            left,
            top,
            width: Math.max(
              1,
              width - left - Math.round((p.crop.right || 0) * width),
            ),
            height: Math.max(
              1,
              height - top - Math.round((p.crop.bottom || 0) * height),
            ),
          });
        }
        data = await transform
          .resize({
            width: 1800,
            height: 2200,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 84 })
          .toBuffer();
        await writeFile('public' + src, data);
      }
      const meta = await sharp(data).metadata();
      images.push({
        id: p.id,
        src,
        width: meta.width,
        height: meta.height,
        alt: p.alt || '',
        caption: p.caption,
        sourceUrl: p.sourceUrl,
        sourcePage: p.sourcePage,
        position: {
          x: (p.hotspot?.x ?? 0.5) * 100,
          y: (p.hotspot?.y ?? 0.5) * 100,
        },
      });
    }
    snapshots.push({ ...g, images });
  }
  await writeFile(
    'src/content/local/gallery-snapshot.json',
    JSON.stringify(snapshots, null, 2) + '\n',
  );
}
