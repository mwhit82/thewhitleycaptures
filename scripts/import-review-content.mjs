// Read-only Webflow import. Re-run explicitly to refresh the checked-in local fixtures.
import { parse } from 'parse5';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
const origin = 'https://www.thewhitleycaptures.com';
const attrs = (n) =>
  Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
const children = (n) => n.childNodes || [];
const text = (n) =>
  n.nodeName === '#text' ? n.value : children(n).map(text).join('');
const find = (n, predicate) => [
  ...(predicate(n) ? [n] : []),
  ...children(n).flatMap((c) => find(c, predicate)),
];
const clean = (s) =>
  s
    .replace(/\u200d/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const sources = [];
const cache = new Map();
async function image(n, page, fallback) {
  const a = attrs(n),
    url = a.src;
  if (!url) return null;
  if (cache.has(url))
    return { ...cache.get(url), alt: clean(a.alt || fallback) };
  const id =
    'review-' + createHash('sha256').update(url).digest('hex').slice(0, 14);
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  const result = await sharp(bytes)
    .rotate()
    .resize({
      width: 2000,
      height: 2400,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 88 })
    .toBuffer({ resolveWithObject: true });
  const photo = {
    id,
    src: `/images/review/${id}.webp`,
    width: result.info.width,
    height: result.info.height,
    alt: clean(a.alt || fallback),
    sourceUrl: url,
    sourcePage: page,
  };
  await writeFile('public' + photo.src, result.data);
  cache.set(url, photo);
  sources.push(photo);
  return photo;
}
function href(url) {
  if (!url) return undefined;
  try {
    const u = new URL(url, origin);
    if (!['https:', 'http:', 'mailto:'].includes(u.protocol)) return undefined;
    if (u.hostname.endsWith('thewhitleycaptures.com')) {
      if (u.pathname === '/contact') return '/#enquire';
      if (u.pathname === '/blog') return '/client-guides';
      return u.pathname + u.search + u.hash;
    }
    return u.href;
  } catch {
    return undefined;
  }
}
function spans(n, mark) {
  return children(n).flatMap((c) => {
    if (c.nodeName === '#text')
      return [
        {
          text: c.value.replace(/\u200d/g, ''),
          ...(mark ? { href: mark } : {}),
        },
      ];
    return spans(c, c.tagName === 'a' ? href(attrs(c).href) : mark);
  });
}
const defs = [
  [
    'we-won-an-award',
    'Awards',
    'Recognition for photographs made with care.',
    'awards',
  ],
  [
    'our-backdrop-library',
    'My backdrop library',
    'Explore the backgrounds available for your studio photo shoot.',
    'guide',
  ],
  [
    'our-baby-photo-shoot-beanbag-backdrop-library',
    'My baby photo shoot posing backdrop library',
    'Choose a fabric backdrop for your baby’s posed photographs.',
    'guide',
  ],
  [
    'a-guide-to-printing-your-images',
    'A guide to printing your images',
    'Make the most of your photographs when choosing prints and keepsakes.',
    'guide',
  ],
];
await mkdir('public/images/review', { recursive: true });
const articles = [];
for (const [slug, title, summary, kind] of defs) {
  const page = origin + '/post/' + slug,
    d = parse(await (await fetch(page)).text());
  const rich = find(d, (n) =>
    attrs(n).class?.split(' ').includes('w-richtext'),
  )[0];
  if (!rich) throw Error('Missing article ' + slug);
  const blocks = [];
  let no = 0;
  for (const n of children(rich)) {
    const imgs = find(n, (c) => c.tagName === 'img');
    if (imgs.length) {
      const images = [];
      for (const im of imgs)
        images.push(await image(im, page, `${title} — example ${++no}`));
      blocks.push({ id: `block-${blocks.length}`, kind: 'gallery', images });
      continue;
    }
    const value = clean(text(n));
    if (!value) continue;
    blocks.push({
      id: `block-${blocks.length}`,
      kind: /^h[1-6]$/.test(n.tagName) ? 'heading' : 'paragraph',
      spans: spans(n),
    });
  }
  const first = blocks.flatMap((b) => b.images || [])[0];
  articles.push({
    id: 'article-' + slug,
    slug,
    title,
    summary,
    kind,
    sourceUrl: page,
    reviewNote:
      kind === 'awards'
        ? 'Please confirm the award names and years before launch.'
        : 'Please review backdrop availability, package inclusions and any printing recommendations before launch.',
    blocks,
    seo: {
      title: title + ' | The Whitley Captures',
      description: summary,
      image: first,
    },
  });
  console.log(slug, blocks.length, 'blocks', no, 'images');
}
const doc = parse(await (await fetch(origin + '/portfolio')).text()),
  collections = {};
const tabs = {
  Newborn: 'baby-newborn',
  Portraits: 'portraits',
  Family: 'family-portraits',
  'On Location': 'on-location',
  'Cake Smash & Bath': 'cake-smash-bath',
  Sitter: 'sitter',
};
for (const [tab, slug] of Object.entries(tabs)) {
  const pane = find(
    doc,
    (n) =>
      attrs(n)['data-w-tab'] === tab && attrs(n).class?.includes('w-tab-pane'),
  )[0];
  const imgs = pane ? find(pane, (n) => n.tagName === 'img') : [];
  const selected = imgs.filter(
    (n, i) => imgs.findIndex((x) => attrs(x).src === attrs(n).src) === i,
  );
  const picks =
    selected.length <= 8
      ? selected
      : Array.from(
          { length: 8 },
          (_, i) => selected[Math.round((i * (selected.length - 1)) / 7)],
        );
  collections[slug] = [];
  for (const [i, n] of picks.entries())
    collections[slug].push(
      await image(
        n,
        origin + '/portfolio',
        `${tab} photography by Rachel Whitley — photograph ${i + 1}`,
      ),
    );
  console.log(slug, imgs.length, 'source photos;', picks.length, 'selected');
}
await writeFile(
  'src/content/local/articles.json',
  JSON.stringify(articles, null, 2) + '\n',
);
await writeFile(
  'src/content/local/portfolio-images.json',
  JSON.stringify(collections, null, 2) + '\n',
);
await writeFile(
  'docs/review-asset-sources.json',
  JSON.stringify(
    { importedAt: new Date().toISOString(), images: sources },
    null,
    2,
  ) + '\n',
);
