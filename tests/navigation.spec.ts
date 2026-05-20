import { test, expect } from '@playwright/test';

test('navigation from home to product detail works', async ({ page }) => {
  // Increase overall test timeout
  test.setTimeout(30000);

  await page.goto('http://localhost:3000/');

  // Wait for preloader to finish and Home to render
  console.log('Waiting for Home page h1...');
  await page.waitForSelector('h1', { timeout: 15000 });

  // Find first product card
  const firstProduct = page.locator('div.group.relative.flex.flex-col').first();
  await expect(firstProduct).toBeVisible();

  // Click it
  console.log('Clicking product...');
  await firstProduct.click();

  // Check if thread transition canvas appears
  console.log('Checking for canvas...');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Wait for navigation to happen
  console.log('Waiting for URL change...');
  await page.waitForURL(url => url.pathname === '/product/1', { timeout: 10000 });

  // Verify product page content
  console.log('Verifying product page content...');
  // Using regex for case-insensitive match or matching the actual source text
  await expect(page.locator('h1')).toContainText(/Crimson Rose Hoodie/i);
  await expect(page.locator('text=$85.00')).toBeVisible();

  // Click back button
  console.log('Clicking back to shop...');
  const backButton = page.locator('text=BACK TO SHOP');
  await backButton.click();

  // Check transition again
  await expect(canvas).toBeVisible();

  // Should return to home
  console.log('Waiting for return to home...');
  await page.waitForURL(url => url.pathname === '/', { timeout: 10000 });
});
