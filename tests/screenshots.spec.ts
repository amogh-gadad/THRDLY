import { test, expect } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Wait for preloader
  await page.waitForSelector('text=THRDLY', { timeout: 10000 });
  await page.screenshot({ path: 'screenshots/final-home.png', fullPage: true });

  // Hover over the first product
  const firstProduct = page.locator('.group').first();
  await firstProduct.hover();
  // Wait for hover animation
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/final-hover.png' });

  // Click product
  await firstProduct.click();
  // Wait for transition and navigation
  await page.waitForURL('**/product/*');
  // Wait for thread transition to clear
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/final-product.png', fullPage: true });
});
