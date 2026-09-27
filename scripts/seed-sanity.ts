import { evaluate, parse } from 'groq-js';
import {
  homepageQuery,
  servicesQuery,
  settingsQuery,
} from '../src/content/sanity/queries';
import localImages from '../src/content/local/images.json';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { settings } from '../src/content/local/settings';
import { homepage } from '../src/content/local/homepage';
import { services } from '../src/content/local/services';
import { galleries } from '../src/content/local/galleries';
import { testimonials } from '../src/content/local/testimonials';
import type { ContentImage } from '../src/content/types';
const { loadEnvConfig } = createRequire(resolve('package.json'))(
  '@next/env',
) as typeof import('@next/env');
loadEnvConfig(process.cwd());
const apply = process.argv.includes('--apply');
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!projectId || !dataset)
  throw new Error('Copy .env.example to .env.local first.');
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
if (apply && !token)
  throw new Error(
    'Set SANITY_API_WRITE_TOKEN locally, or run npm run cms:seed:login after npx sanity login. Never paste tokens into chat.',
  );
const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || '2026-09-27',
  useCdn: false,
  token,
});
const assetCache = new Map<string, string>();
const ref = (id: string) => ({ _type: 'reference', _ref: id });
const refs = (ids: string[], prefix = '') =>
  ids.map((id, n) => ({ ...ref(prefix + id), _key: `ref-${n}` }));
async function photo(image: ContentImage) {
  let assetId = assetCache.get(image.src);
  if (!assetId) {
    if (apply) {
      const asset = await client.assets.upload(
        'image',
        await readFile(`public${image.src}`),
        {
          filename: image.src.split('/').pop(),
          source: {
            id: image.id,
            name: 'Approved Webflow migration; see docs/asset-sources.json',
          },
        },
      );
      assetId = asset._id;
    } else assetId = `image-dryrun-${image.id}`;
    assetCache.set(image.src, assetId);
  }
  return {
    _type: 'photograph',
    asset: ref(assetId),
    alt: image.alt,
    caption: image.caption,
    hotspot: {
      _type: 'sanity.imageHotspot',
      x: (image.position?.x ?? 50) / 100,
      y: (image.position?.y ?? 50) / 100,
      width: 0.1,
      height: 0.1,
    },
    crop: { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 },
  };
}
// Sanity arrays of objects need stable keys; typed nested objects retain their schema type.
async function convert(value: unknown, field = ''): Promise<unknown> {
  if (Array.isArray(value))
    return Promise.all(
      value.map(async (v, n) => {
        const result = await convert(v, field);
        return result && typeof result === 'object'
          ? { ...result, _key: (v as { id?: string }).id || `${field}-${n}` }
          : result;
      }),
    );
  if (!value || typeof value !== 'object') return value;
  const v = value as Record<string, unknown>;
  if (typeof v.src === 'string') return photo(v as ContentImage);
  const types: Record<string, string> = {
    seo: 'seo',
    cta: 'contentLink',
    secondaryCta: 'contentLink',
    link: 'contentLink',
    navigation: 'contentLink',
    socials: 'contentLink',
    sections: 'contentSection',
    packages: 'package',
    faqs: 'faq',
  };
  const result: Record<string, unknown> = types[field]
    ? { _type: types[field] }
    : {};
  for (const [key, item] of Object.entries(v))
    if (key !== 'id' && item !== undefined)
      result[key] = await convert(item, key);
  return result;
}
async function seed() {
  const docs: Array<{ _id: string; _type: string; [key: string]: unknown }> =
    [];
  const object = async (value: unknown) =>
    (await convert(value)) as Record<string, unknown>;
  docs.push({
    _id: 'site-settings',
    _type: 'siteSettings',
    ...(await object(settings)),
  });
  const home = await object(homepage);
  home.services = {
    ...homepage.services,
    ids: undefined,
    items: refs(homepage.services.ids),
  };
  home.featured = {
    ...(await object(homepage.featured)),
    galleryId: undefined,
    gallery: ref('gallery-' + homepage.featured.galleryId),
  };
  home.testimonials = {
    ...homepage.testimonials,
    ids: undefined,
    items: refs(homepage.testimonials.ids, 'testimonial-'),
  };
  // CTA at homepage level is a section, not a contentLink object.
  delete (home.cta as Record<string, unknown>)._type;
  docs.push({ _id: 'homepage', _type: 'homepage', ...home });
  for (const service of services) {
    const data = await object(service);
    delete data.galleryId;
    delete data.testimonialIds;
    docs.push({
      ...data,
      _id: service.id,
      _type: 'photographyService',
      slug: { _type: 'slug', current: service.slug },
      gallery: ref('gallery-' + service.galleryId),
      testimonials: refs(service.testimonialIds, 'testimonial-'),
    });
  }
  for (const gallery of galleries)
    docs.push({
      _id: 'gallery-' + gallery.id,
      _type: 'gallery',
      title: gallery.title,
      images: await convert(gallery.images, 'images'),
      featuredImages: await convert(
        gallery.images.filter((i) => gallery.featuredImageIds.includes(i.id)),
        'featuredImages',
      ),
    });
  for (const testimonial of testimonials)
    docs.push({
      _id: 'testimonial-' + testimonial.id,
      _type: 'testimonial',
      name: testimonial.name,
      quote: testimonial.quote,
      services: refs(
        testimonial.serviceIds ||
          (testimonial.serviceId ? [testimonial.serviceId] : []),
      ),
      featured: homepage.testimonials.ids.includes(testimonial.id),
    });
  const ids = new Set(docs.map((doc) => doc._id));
  function checkReferences(value: unknown) {
    if (!value || typeof value !== 'object') return;
    const item = value as Record<string, unknown>;
    if (
      item._type === 'reference' &&
      typeof item._ref === 'string' &&
      !item._ref.startsWith('image-') &&
      !ids.has(item._ref)
    )
      throw new Error(`Unresolved migration reference: ${item._ref}`);
    Object.values(item).forEach(checkReferences);
  }
  docs.forEach(checkReferences);
  // Exercise real GROQ projections against the prepared documents before writing content.
  const imageDocs = Object.values(localImages).map((image) => ({
    _id: assetCache.get(image.src),
    _type: 'sanity.imageAsset',
    url: `https://cdn.sanity.io/images/${projectId}/${dataset}/${image.id}-${image.width}x${image.height}.jpg`,
    metadata: { dimensions: { width: image.width, height: image.height } },
  }));
  const projectedHome = await (
    await evaluate(parse(homepageQuery), { dataset: [...docs, ...imageDocs] })
  ).get();
  const projectedServices = await (
    await evaluate(parse(servicesQuery), { dataset: docs })
  ).get();
  const projectedSettings = await (
    await evaluate(parse(settingsQuery), { dataset: [...docs, ...imageDocs] })
  ).get();
  if (
    projectedHome?.services?.items?.length !== 7 ||
    projectedServices.length !== 7 ||
    !projectedSettings?.logo?.src ||
    !projectedHome?.hero?.image?.width
  )
    throw new Error('Migration query contract failed. No content written.');
  console.log('Preflight: references and UI query projections passed.');
  console.log(
    `${apply ? 'Seeding' : 'Dry run'} ${docs.length} documents and ${assetCache.size} images to ${projectId}/${dataset}.`,
  );
  if (apply) {
    // One transaction allows cross-document references. Never overwrite Rachel's edits on rerun.
    let transaction = client.transaction();
    for (const doc of docs) transaction = transaction.createIfNotExists(doc);
    await transaction.commit();
    console.log(
      'Initial content published. Existing document IDs were preserved.',
    );
  } else
    console.log(
      'No data written. Use npm run cms:seed -- --apply after checking the destination.',
    );
}
seed().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
