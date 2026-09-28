import { expect, test } from '@playwright/test';
import { services } from '../src/content/local/services';
import { homepage } from '../src/content/local/homepage';
import { galleries } from '../src/content/local/galleries';
import { testimonials } from '../src/content/local/testimonials';
import { existsSync } from 'node:fs';
import images from '../src/content/local/images.json' with { type: 'json' };

test('local references and image assets are complete', () => {
  expect(new Set(services.map((s) => s.slug)).size).toBe(7);
  for (const id of homepage.services.ids)
    expect(services.some((s) => s.id === id)).toBe(true);
  for (const id of homepage.testimonials.ids)
    expect(testimonials.some((t) => t.id === id)).toBe(true);
  for (const s of services) {
    expect(galleries.some((g) => g.id === s.galleryId)).toBe(true);
    for (const id of s.testimonialIds)
      expect(testimonials.some((t) => t.id === id)).toBe(true);
  }
  for (const image of Object.values(images)) {
    expect(existsSync(`public${image.src}`)).toBe(true);
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(image.alt).not.toBe('');
  }
});

test('all service routes render locally with distinct metadata and preview headers', async ({
  request,
}) => {
  for (const path of ['/', ...services.map((s) => `/prices/${s.slug}`)]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow');
    const html = await response.text();
    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:image"');
    expect(html.match(/<h1[ >]/g)?.length).toBe(1);
    if (path.includes('/prices/'))
      expect(html).toContain(
        services
          .find((s) => path === `/prices/${s.slug}`)!
          .seo.title.replace(/&/g, '&amp;'),
      );
  }
  expect((await request.get('/sitemap.xml')).status()).toBe(404);
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Disallow: /',
  );
  expect((await request.get('/prices/not-a-service')).status()).toBe(404);
});

for (const width of [320, 390, 768, 1440]) {
  test(`homepage is usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://embed.sessioncdn.com/**', (r) => r.abort());
    await page.goto('/');
    await expect(page.locator('.service-grid a')).toHaveCount(7);
    await expect(page.locator('.hero .button')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('.hero .button').click();
    await expect(page).toHaveURL(/#enquire/);
    await expect(
      page.getByText('The enquiry form is taking a little longer'),
    ).toBeVisible();
    await expect(page.locator('.form-alternative a')).toHaveAttribute(
      'href',
      'mailto:thewhitleycaptures@gmail.com',
    );
    if (width <= 800) {
      await page
        .getByRole('button', { name: 'Open menu', exact: true })
        .click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page
        .getByRole('button', { name: 'Close menu', exact: true })
        .press('Escape');
      await expect(page.locator('#mobile-menu')).toBeHidden();
      await expect(
        page.getByRole('button', { name: 'Open menu', exact: true }),
      ).toBeFocused();
      await page
        .getByRole('button', { name: 'Open menu', exact: true })
        .click();
      await page
        .locator('#mobile-menu')
        .getByRole('link', { name: 'Baby & Newborn' })
        .click();
    } else await page.locator('.service-grid a').first().click();
    await expect(
      page.getByRole('heading', {
        name: 'Baby & Newborn',
        exact: true,
        level: 1,
      }),
    ).toBeVisible();
    await page
      .locator('summary')
      .filter({ hasText: 'When should I book?' })
      .click();
    await expect(
      page.getByText('The best time to reserve your photo shoot'),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test('Session loads once, labels its iframe, and remounts without duplication', async ({
  page,
}) => {
  let scriptRequests = 0;
  await page.route(
    'https://embed.sessioncdn.com/v1/embed.js',
    async (route) => {
      scriptRequests++;
      await route.fulfill({
        contentType: 'application/javascript',
        body: `window.Session=(command,options)=>{const host=document.querySelector(options.selector);if(!host)throw Error('missing host');const frame=document.createElement('iframe');frame.src='/session-test';host.appendChild(frame);};`,
      });
    },
  );
  await page.route('**/session-test', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body><label>Full name<input name="name"></label></body></html>',
    }),
  );
  await page.goto('/');
  await page.locator('.hero .button').click();
  const iframe = page.locator('#session-embed-0Ll72MoGY iframe');
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute(
    'title',
    'Enquire with Rachel at The Whitley Captures',
  );
  await expect(page.getByText('Getting your enquiry form ready…')).toBeHidden();
  for (let i = 0; i < 2; i++) {
    await page.locator('.service-grid a').first().click();
    await expect(
      page.getByRole('heading', {
        name: 'Baby & Newborn',
        exact: true,
        level: 1,
      }),
    ).toBeVisible();
    await page.locator('.service-hero-copy .button').click();
    await expect(iframe).toHaveCount(1);
    await expect(
      page.getByText('Getting your enquiry form ready…'),
    ).toBeHidden();
  }
  expect(scriptRequests).toBe(1);
});
