import { expect, test } from '@playwright/test';

test('Studio and nested editor URLs load without server or browser errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/studio', '/studio/structure/homepage']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    await expect(page.getByText('Choose login provider')).toBeVisible({
      timeout: 30000,
    });
  }
  expect(errors).toEqual([]);
});
