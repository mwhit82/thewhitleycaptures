// Create the About singleton only when absent; preserve existing documents and drafts.
import { createClient } from '@sanity/client';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
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
const existing = await client.fetch(
  'count(*[_id in ["about-rachel", "drafts.about-rachel"]])',
);
if (existing) {
  console.log(
    'About Rachel already exists; preserving existing content and drafts.',
  );
} else {
  const home = await client.fetch('*[_id == "homepage"][0]');
  if (
    !home?.introduction?.image?.asset ||
    !home.introduction.paragraphs?.length
  )
    throw Error('Published introduction is incomplete; no changes made.');
  const doc = {
    _id: 'about-rachel',
    _type: 'aboutPage',
    heading: 'A little about me',
    paragraphs: home.introduction.paragraphs,
    portrait: home.introduction.image,
    closingHeading: 'Small moments. Lasting keepsakes.',
    cta: {
      _type: 'contentLink',
      label: 'Check availability',
      href: '/#enquire',
    },
    seo: {
      _type: 'seo',
      title: 'About Rachel',
      description:
        'Meet Rachel, the family photographer behind The Whitley Captures in Sherburn Hill, Durham.',
      image: home.introduction.image,
    },
  };
  if (apply) {
    if (!process.env.SANITY_AUTH_TOKEN)
      throw Error('Run with Sanity CLI --with-user-token.');
    await client.createIfNotExists(doc);
    console.log(
      'Created About Rachel from the existing published introduction; no other documents changed.',
    );
  } else
    console.log(
      'Dry run: create About Rachel only, using the published introduction and portrait.',
    );
}
