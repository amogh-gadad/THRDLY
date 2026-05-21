import { test, expect } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('http://localhost:3000');
  await page.waitForSelector('h1', { timeout: 20000 });
  await page.screenshot({ path: 'screenshots/final-home.png', fullPage: true });

  const firstProduct = page.locator('div.group.relative.flex.flex-col').first();
  await firstProduct.hover();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/final-hover.png' });

  await firstProduct.click();
  // Check if thread transition canvas appears
  await expect(page.locator('canvas')).toBeVisible();

  await page.waitForURL(url => url.pathname.startsWith('/product/'), { timeout: 15000 });

  // Wait for thread transition to clear
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/final-product.png', fullPage: true });
});
