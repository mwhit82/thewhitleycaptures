import { parse } from 'parse5';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = '.wrangler/launch-backups/webflow';
await mkdir(root + '/assets', { recursive: true });
await mkdir(root + '/pages', { recursive: true });
const origin = 'https://www.thewhitleycaptures.com';
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
await writeFile(root + '/sitemap.xml', sitemap);
const urls = [
  ...new Set(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    ),
  ),
];
const attrs = (n) =>
  Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
const walk = (n, fn) => {
  fn(n);
  for (const c of n.childNodes || []) walk(c, fn);
};
const assets = new Set();
const pages = [];
for (const path of urls) {
  const r = await fetch(origin + path);
  if (!r.ok) throw Error(path + ': ' + r.status);
  const html = await r.text();
  const file =
    'pages/' +
    (path === '/' ? 'home' : path.slice(1).replaceAll('/', '__')) +
    '.html';
  await writeFile(root + '/' + file, html);
  pages.push({
    path,
    file,
    sha256: createHash('sha256').update(html).digest('hex'),
  });
  walk(parse(html), (n) => {
    const a = attrs(n);
    for (const key of ['src', 'href', 'poster'])
      if (a[key]?.startsWith('https://cdn.prod.website-files.com/'))
        assets.add(a[key]);
    if (n.tagName === 'script' && a.type === 'application/json') {
      try {
        const value = JSON.parse(
          (n.childNodes || []).map((c) => c.value || '').join(''),
        );
        for (const item of value.items || [])
          if (item.url) assets.add(item.url);
      } catch {}
    }
  });
}
const records = [];
const queue = [...assets];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const id = createHash('sha256').update(url).digest('hex');
      const file = 'assets/' + id;
      let bytes;
      try {
        bytes = await readFile(root + '/' + file);
      } catch {
        const r = await fetch(url);
        if (!r.ok) throw Error(url + ': ' + r.status);
        bytes = Buffer.from(await r.arrayBuffer());
        await writeFile(root + '/' + file, bytes);
      }
      records.push({
        url,
        file,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    }
  }),
);
await writeFile(
  root + '/manifest.json',
  JSON.stringify(
    { archivedAt: new Date().toISOString(), origin, pages, assets: records },
    null,
    2,
  ),
);
console.log({
  pages: pages.length,
  assets: records.length,
  bytes: records.reduce((n, a) => n + a.bytes, 0),
  archive: root,
});
