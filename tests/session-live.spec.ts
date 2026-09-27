import { expect, test } from '@playwright/test';
test('live Session loads and remains bounded across navigation', async ({
  page,
}) => {
  test.skip(
    process.env.LIVE_SESSION !== '1',
    'Opt-in external-service check; never submits a form.',
  );
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.hero .button').click();
  const frame = page.frameLocator('#session-embed-0Ll72MoGY iframe');
  await expect(
    frame.getByRole('button', { name: 'SUBMIT ENQUIRY' }),
  ).toBeVisible({ timeout: 30000 });
  for (let visit = 0; visit < 2; visit++) {
    // Wait for the vendor to report the rendered form height, not its initial 400px shell.
    await expect
      .poll(async () =>
        page
          .locator('#session-embed-0Ll72MoGY iframe')
          .evaluate((el) => el.getBoundingClientRect().height),
      )
      .toBeGreaterThan(500);
    await frame
      .getByRole('button', { name: 'SUBMIT ENQUIRY' })
      .scrollIntoViewIfNeeded();
    const buttonBox = await frame
      .getByRole('button', { name: 'SUBMIT ENQUIRY' })
      .boundingBox();
    const frameBox = await page
      .locator('#session-embed-0Ll72MoGY iframe')
      .boundingBox();
    expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(
      frameBox!.y + frameBox!.height + 1,
    );
    const heights = [];
    for (let sample = 0; sample < 3; sample++) {
      await expect(
        frame.getByRole('button', { name: 'SUBMIT ENQUIRY' }),
      ).toBeVisible();
      heights.push(
        await page
          .locator('#session-embed-0Ll72MoGY iframe')
          .evaluate((el) => el.getBoundingClientRect().height),
      );
    }
    console.log('Live Session heights', heights);
    expect(Math.max(...heights)).toBeLessThan(1600);
    if (visit === 0) {
      await page.locator('.service-grid a').first().click();
      await expect(
        page.getByRole('heading', { name: 'Baby & Newborn', level: 1 }),
      ).toBeVisible();
      await page.locator('.service-hero-copy .button').click();
    }
  }
  await expect(page.locator('#session-embed-0Ll72MoGY iframe')).toHaveCount(1);
});
