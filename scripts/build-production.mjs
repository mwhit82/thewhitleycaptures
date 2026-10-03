import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const dirty = Boolean(
  execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(),
);
const nextEnv = readFileSync('next-env.d.ts');
const result = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, WHITLEY_DEPLOY_TARGET: 'production' },
});
// Both frameworks generate this file differently; preserve the checkout version.
writeFileSync('next-env.d.ts', nextEnv);
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync(
  'dist/production-build.json',
  JSON.stringify({ commit, dirty, builtAt: new Date().toISOString() }),
);
