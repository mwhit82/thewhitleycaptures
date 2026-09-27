import { expect, test } from '@playwright/test';

test('homepage and all service pages render without application console errors', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !message.text().startsWith('Failed to load resource:')
    )
      errors.push(message.text());
    if (
      message.type() === 'warning' &&
      /Largest Contentful Paint|useMemo|unknown prop/.test(message.text())
    )
      errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const routes = await page
    .locator('a[href^="/prices/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => link.getAttribute('href')!)),
    ]);
  expect(routes).toHaveLength(7);
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }
  expect(errors).toEqual([]);
});
