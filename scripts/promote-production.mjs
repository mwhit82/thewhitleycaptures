// Promotion requires an explicit reviewed commit and a production build from that commit.
import { readFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
const approved = process.argv[2];
const head = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
if (!approved || !head.startsWith(approved))
  throw Error('Pass the reviewed current Git commit hash.');
if (execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim())
  throw Error('Commit reviewed changes before production promotion.');
const built = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
const stamp = JSON.parse(readFileSync('dist/production-build.json', 'utf8'));
if (stamp.commit !== head || stamp.dirty)
  throw Error(
    'Rebuild production from the clean reviewed commit before promotion.',
  );
if (
  built.name !== 'thewhitleycaptures-production' ||
  built.vars?.SITE_MODE !== 'production' ||
  built.vars?.SITE_URL !== 'https://www.thewhitleycaptures.com'
)
  throw Error('Run npm run build:production before promotion.');
const result = spawnSync(
  'npx',
  [
    'vinext-cloudflare',
    'deploy',
    '--config',
    'dist/server/wrangler.json',
    '--skip-build',
  ],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
