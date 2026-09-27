import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
const problems: string[] = [];
if (process.env.SITE_MODE !== 'production')
  problems.push('SITE_MODE is preview: search engines will be blocked.');
if (
  !process.env.SITE_URL?.startsWith('https://') ||
  /localhost|127\.0\.0\.1/.test(process.env.SITE_URL || '')
)
  problems.push('SITE_URL must be the approved public HTTPS canonical origin.');
if (process.env.CONTENT_SOURCE !== 'sanity')
  problems.push('CONTENT_SOURCE must be sanity.');
if (
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_SANITY_DATASET
)
  problems.push('Sanity project configuration is missing.');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Launch environment checks pass. Still complete the migration checklist and separately approve DNS cutover.',
  );
