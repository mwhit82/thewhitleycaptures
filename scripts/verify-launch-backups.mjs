import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = '.wrangler/launch-backups/webflow';
const m = JSON.parse(await readFile(root + '/manifest.json', 'utf8'));
for (const a of [...m.pages, ...m.assets]) {
  const bytes = await readFile(root + '/' + a.file);
  if (createHash('sha256').update(bytes).digest('hex') !== a.sha256)
    throw Error('Invalid archive file ' + a.file);
}
const entries = execFileSync(
  'tar',
  ['-tzf', '.wrangler/launch-backups/sanity-prelaunch.tar.gz'],
  { encoding: 'utf8' },
).split('\n');
const report = {
  verifiedAt: new Date().toISOString(),
  webflowPages: m.pages.length,
  webflowAssets: m.assets.length,
  sanityArchiveHasDocuments: entries.some((n) => n.endsWith('/data.ndjson')),
  sanityArchiveImages: entries.filter((n) => /\/images\/.+/.test(n)).length,
};
if (!report.sanityArchiveHasDocuments) throw Error('Missing Sanity documents');
await writeFile(
  'docs/launch/BACKUP-VERIFICATION.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(report);
