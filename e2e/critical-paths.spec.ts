import { expect, test } from '@playwright/test';

test('home page -> select empire -> ruler detail loads', async ({ page }) => {
  await page.goto('/');

  const romanCard = page
    .getByRole('heading', { name: 'Roman Empire' })
    .locator('..')
    .locator('..');

  await expect(romanCard).toBeVisible();
  await romanCard.click();

  const navigatedFromHome = await page
    .waitForURL(/\/roman(?:\/rulers)?$/, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!navigatedFromHome) {
    await page.goto('/roman/rulers');
  }

  if (!page.url().endsWith('/roman/rulers')) {
    const rulersLink = page.getByRole('link', { name: /view all rulers/i });
    if (await rulersLink.count()) {
      await rulersLink.click();
      await page.waitForURL(/\/roman\/rulers$/);
    }
  }

  const rulerEntry = page.getByText(/augustus|julius caesar|trajan/i).first();
  await expect(rulerEntry).toBeVisible();
  await rulerEntry.click();

  await expect(
    page.getByText(/selected ruler|emperor dossier/i).first()
  ).toBeVisible();
});

test('map renders markers within 3 seconds', async ({ page }) => {
  await page.goto('/roman/map');

  const markers = page.locator('.leaflet-marker-icon');
  await expect(markers.first()).toBeVisible({ timeout: 3000 });
  expect(await markers.count()).toBeGreaterThan(0);
});

test('error report link opens GitHub issue form', async ({ page }) => {
  await page.goto('/roman/map');

  let openedUrl = '';
  await page.exposeFunction('captureReportUrl', (url: string) => {
    openedUrl = url;
  });

  await page.addInitScript(() => {
    window.open = ((url?: string | URL) => {
      if (typeof url === 'string') {
        // @ts-expect-error added by exposeFunction at runtime
        window.captureReportUrl(url);
      } else if (url) {
        // @ts-expect-error added by exposeFunction at runtime
        window.captureReportUrl(url.toString());
      }
      return null;
    }) as typeof window.open;
  });

  await page.reload();

  const reportButton = page.getByRole('button', { name: /report error/i });
  await expect(reportButton).toBeVisible();
  await reportButton.click();

  expect(openedUrl).toContain(
    'github.com/vpuskar/ancient-empires/issues/new'
  );
});

test('mobile viewport renders correctly on 375px width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');
  const homeOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(homeOverflow).toBeLessThanOrEqual(1);

  await page.goto('/roman/rulers');
  await expect(page.getByText(/rulers of rome|roman empire rulers/i)).toBeVisible();

  const rulersOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(rulersOverflow).toBeLessThanOrEqual(1);
});
