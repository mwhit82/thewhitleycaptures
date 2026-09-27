import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

test('Studio translation namespaces can grow and shrink without hook errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  const { outputFiles } = await build({
    stdin: {
      resolveDir: process.cwd(),
      loader: 'tsx',
      contents: `
        import React, {useState} from 'react';
        import {createRoot} from 'react-dom/client';
        import i18next from 'i18next';
        import {useTranslation} from 'react-i18next';
        const i18n = i18next.createInstance();
        await i18n.init({lng: 'en', resources: {en: {studio: {label: 'Gallery actions'}, gallery: {label: 'Photos'}}}, react: {useSuspense: false}});
        function App() {
          const [namespaces, setNamespaces] = useState([]);
          const {t} = useTranslation(namespaces, {i18n});
          return <><button onClick={() => setNamespaces(['studio'])}>Load labels</button><button onClick={() => setNamespaces(['gallery', 'studio'])}>Change labels</button><button onClick={() => setNamespaces([])}>Clear labels</button><output>{t('label', {defaultValue: 'No labels'})}</output></>;
        }
        createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
      `,
    },
    bundle: true,
    write: false,
    format: 'esm',
    define: { 'process.env.NODE_ENV': '"development"' },
  });
  await page.route('http://studio-regression.test/', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }),
  );
  await page.goto('http://studio-regression.test/');
  await page.addScriptTag({ type: 'module', content: outputFiles[0].text });
  for (let pass = 0; pass < 2; pass++) {
    await page.getByRole('button', { name: 'Load labels' }).click();
    await expect(page.locator('output')).toHaveText('Gallery actions');
    await page.getByRole('button', { name: 'Change labels' }).click();
    await expect(page.locator('output')).toHaveText('Photos');
    await page.getByRole('button', { name: 'Clear labels' }).click();
  }
  expect(errors).toEqual([]);
});
