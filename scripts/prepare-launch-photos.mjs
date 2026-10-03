import { parse } from 'parse5';
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = '.wrangler/launch-backups/webflow';
const archive = JSON.parse(await readFile(root + '/manifest.json', 'utf8'));
const asset = new Map(archive.assets.map((a) => [a.url, a]));
const attrs = (n) =>
  Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
const walk = (n, p) => [
  ...(p(n) ? [n] : []),
  ...(n.childNodes || []).flatMap((c) => walk(c, p)),
];
const doc = parse(await readFile(root + '/pages/portfolio.html', 'utf8'));
const tabs = {
  Newborn: 'baby-newborn',
  Portraits: 'portraits',
  Family: 'family-portraits',
  'On Location': 'on-location',
  'Cake Smash & Bath': 'cake-smash-bath',
  Sitter: 'sitter',
};
const out = {};
await mkdir('public/images/launch', { recursive: true });
const groups = Object.entries(tabs).map(([tab, slug]) => ({
  slug,
  nodes: walk(
    walk(
      doc,
      (n) =>
        attrs(n)['data-w-tab'] === tab &&
        attrs(n).class?.includes('w-tab-pane'),
    )[0],
    (n) => n.tagName === 'img',
  ),
}));
const mat = parse(
  await readFile(root + '/pages/prices__maternity.html', 'utf8'),
);
groups.push({
  slug: 'maternity',
  nodes: walk(mat, (n) => n.tagName === 'img' && attrs(n).alt === 'Maternity'),
});
for (const { slug, nodes } of groups) {
  const seen = new Set();
  out[slug] = [];
  for (const n of nodes) {
    const a = attrs(n);
    if (!a.src || seen.has(a.src)) continue;
    seen.add(a.src);
    const record = asset.get(a.src);
    if (!record) throw Error('Missing archived original ' + a.src);
    const bytes = await readFile(root + '/' + record.file);
    const id = 'launch-' + record.sha256.slice(0, 16);
    const result = await sharp(bytes)
      .rotate()
      .resize({
        width: 1800,
        height: 2200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
    await writeFile('public/images/launch/' + id + '.webp', result.data);
    const fingerprint = (
      await sharp(bytes)
        .rotate()
        .resize(16, 16, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer()
    ).toString('base64');
    out[slug].push({
      id,
      src: '/images/launch/' + id + '.webp',
      width: result.info.width,
      height: result.info.height,
      alt:
        a.alt?.trim() ||
        `${slug.replaceAll('-', ' ')} photograph by Rachel Whitley`,
      sourceUrl: a.src,
      sourcePage:
        archive.origin +
        (slug === 'maternity' ? '/prices/maternity' : '/portfolio'),
      originalSha256: record.sha256,
      fingerprint,
    });
  }
  console.log(slug, out[slug].length);
}
await writeFile(
  'src/content/local/launch-photo-candidates.json',
  JSON.stringify(out, null, 2) + '\n',
);
