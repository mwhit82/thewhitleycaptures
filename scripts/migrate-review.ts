// Targeted, revision-guarded update. Never replaces documents or overwrites drafts.
import { createClient } from '@sanity/client';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import articles from '../src/content/local/articles.json' with { type: 'json' };
import portfolio from '../src/content/local/portfolio-images.json' with { type: 'json' };
import intros from '../src/content/local/review-introductions.json' with { type: 'json' };
import { originalServiceCopy } from '../src/content/local/services';
import { homepage } from '../src/content/local/homepage';
import images from '../src/content/local/images.json' with { type: 'json' };
import type { ContentImage } from '../src/content/types';
const { loadEnvConfig } = createRequire(resolve('package.json'))('@next/env');
loadEnvConfig(process.cwd());
const apply = process.argv.includes('--apply');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-09-27',
  useCdn: false,
  perspective: 'raw',
  token:
    process.env.SANITY_AUTH_TOKEN ||
    (apply
      ? process.env.SANITY_API_WRITE_TOKEN
      : process.env.SANITY_API_READ_TOKEN),
});
if (
  apply &&
  !process.env.SANITY_AUTH_TOKEN &&
  !process.env.SANITY_API_WRITE_TOKEN
)
  throw Error('Use Sanity CLI login with --with-user-token.');
type Doc = { _id: string; _rev: string; [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
const docs = await client.fetch<Doc[]>(
  '*[_type in ["homepage","gallery","photographyService","article"]]',
);
const byId = new Map(docs.map((d) => [d._id, d]));
if (apply) {
  await mkdir('.wrangler', { recursive: true });
  await writeFile(
    `.wrangler/review-backup-${Date.now()}.json`,
    JSON.stringify(docs, null, 2),
  );
}
const assetCache = new Map<string, string>();
async function photo(p: ContentImage) {
  let id = assetCache.get(p.src);
  if (!id) {
    // Reuse imported assets on every rerun, including partial failures.
    id =
      (await client.fetch<string | null>(
        '*[_type=="sanity.imageAsset" && source.id==$id][0]._id',
        { id: p.id },
      )) || undefined;
    if (!id && apply) {
      const a = await client.assets.upload(
        'image',
        await readFile('public' + p.src),
        {
          filename: p.src.split('/').pop(),
          source: {
            id: p.id,
            name: 'Rachel review update',
            url:
              p.sourceUrl ||
              p.sourcePage ||
              'https://www.thewhitleycaptures.com',
          },
        },
      );
      id = a._id;
    }
    id ||= `image-dryrun-${p.id}`;
    assetCache.set(p.src, id);
  }
  return {
    _type: 'photograph',
    _key: p.id,
    asset: { _type: 'reference', _ref: id },
    alt: p.alt,
    caption: p.caption,
    sourceUrl: p.sourceUrl,
    sourcePage: p.sourcePage,
    hotspot: {
      _type: 'sanity.imageHotspot',
      x: (p.position?.x ?? 50) / 100,
      y: (p.position?.y ?? 50) / 100,
      width: 0.1,
      height: 0.1,
    },
    crop: { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 },
  };
}
async function photos(items: ContentImage[]) {
  const result = [];
  for (const item of items) result.push(await photo(item));
  return result;
}
let changes = 0;
async function patch(id: string, set: Record<string, unknown>) {
  if (!Object.keys(set).length) return;
  const doc = byId.get(id);
  if (!doc) throw Error('Missing document ' + id);
  if (byId.has('drafts.' + id) || (await client.getDocument('drafts.' + id))) {
    console.log('SKIP unpublished edits:', id);
    return;
  }
  if (apply) await client.patch(id).ifRevisionId(doc._rev).set(set).commit();
  console.log(
    apply ? 'UPDATED' : 'WOULD UPDATE',
    id,
    Object.keys(set).join(', '),
  );
  changes++;
}
for (const a of articles) {
  if (byId.has(a.id) || byId.has('drafts.' + a.id)) {
    console.log('KEEP existing article:', a.id);
    continue;
  }
  const blocks = [];
  for (const b of a.blocks) {
    blocks.push({
      _type: 'articleBlock',
      _key: b.id,
      kind: b.kind,
      spans: ('spans' in b ? b.spans : [])?.map((s, n) => ({
        ...s,
        _type: 'articleSpan',
        _key: 'span-' + n,
      })),
      images: await photos('images' in b ? b.images || [] : []),
    });
  }
  const doc = {
    _id: a.id,
    _type: 'article',
    title: a.title,
    slug: { _type: 'slug', current: a.slug },
    summary: a.summary,
    kind: a.kind,
    sourceUrl: a.sourceUrl,
    reviewNote: a.reviewNote,
    blocks,
    seo: { _type: 'seo', ...a.seo, image: await photo(a.seo.image) },
  };
  if (apply) await client.createIfNotExists(doc);
  console.log(apply ? 'CREATED' : 'WOULD CREATE', a.id);
  changes++;
}
const home = byId.get('homepage')!;
const homeSet: Record<string, unknown> = {};
if (!home.hero.images?.length)
  homeSet['hero.images'] = [
    { ...home.hero.image, _key: 'hero-existing' },
    await photo(images.newborn0),
    await photo(images.maternity0),
  ];
if (!home.awards)
  homeSet.awards = {
    ...homepage.awards,
    articleSlug: undefined,
    article: { _type: 'reference', _ref: 'article-we-won-an-award' },
  };
else if (
  !home.awards.article &&
  home.awards.articleSlug === 'we-won-an-award'
) {
  homeSet.awards = {
    heading: home.awards.heading,
    copy: home.awards.copy,
    article: { _type: 'reference', _ref: 'article-we-won-an-award' },
  };
}
await patch('homepage', homeSet);
const featured = byId.get('gallery-featured');
if (featured?.images?.[1]?._key === 'woodland') {
  const replacement = await photo(images.gallery2);
  replacement._key = 'featured-newborn';
  await patch(featured._id, { 'images[1]': replacement });
}
for (const [slug, newPhotos] of Object.entries(portfolio)) {
  const doc = byId.get('gallery-' + slug);
  if (!doc) throw Error('Missing gallery ' + slug);
  if (byId.has('drafts.' + doc._id)) {
    console.log('SKIP unpublished edits:', doc._id);
    continue;
  }
  const extra = newPhotos.filter(
    (p) =>
      !doc.images.some(
        (x: { _key: string; sourceUrl?: string }) =>
          x._key === p.id || x.sourceUrl === p.sourceUrl,
      ),
  );
  if (extra.length)
    await patch(doc._id, {
      images: [...doc.images, ...(await photos(extra))],
    });
}
for (const original of originalServiceCopy) {
  const doc = byId.get(original.id);
  if (!doc) continue;
  const paragraphs = (sections: { paragraphs: string[] }[]) =>
    sections.flatMap((s) => s.paragraphs);
  if (
    doc.introduction === original.introduction &&
    JSON.stringify(paragraphs(doc.sections || [])) ===
      JSON.stringify(paragraphs(original.sections))
  )
    await patch(doc._id, {
      introduction: intros[original.id as keyof typeof intros],
      sections: [],
    });
  else console.log('KEEP existing service copy:', original.id);
}
console.log(JSON.stringify({ apply, changedDocuments: changes }));
