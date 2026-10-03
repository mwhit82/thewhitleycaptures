import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig(({ command }) => {
  // Only non-secret Worker variables belong here. This also makes public Sanity
  // settings available to the client build in Git-connected Workers Builds.
  const configPath =
    process.env.WHITLEY_DEPLOY_TARGET === 'production'
      ? './wrangler.production.json'
      : './wrangler.json';
  const { vars } = JSON.parse(
    readFileSync(new URL(configPath, import.meta.url), 'utf8'),
  );
  for (const [key, value] of Object.entries(vars as Record<string, string>)) {
    if (command === 'build' || key.startsWith('NEXT_PUBLIC_'))
      process.env[key] = value;
  }
  return {
    plugins: [
      vinext(),
      cloudflare({
        configPath,
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
      }),
    ],
  };
});
