import { test, expect } from '@playwright/test';

test('menu dropdown contains theme toggle and categories', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for preloader to finish
  await page.waitForSelector('h1', { timeout: 15000 });

  // Open Menu
  const menuButton = page.locator('button:has-text("Menu")');
  await menuButton.click();

  // Verify Dropdown content
  await expect(page.locator('text=Collections')).toBeVisible();
  await expect(page.locator('text=Display Settings')).toBeVisible();
  await expect(page.locator('text=Theme')).toBeVisible();

  // Test Theme Toggle inside dropdown
  const themeButton = page.locator('button:has-text("Dark"), button:has-text("Light")');

  // Initial (Dark)
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

  // Switch to Light
  await themeButton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(themeButton).toContainText('Light');

  // Switch back to Dark
  await themeButton.click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
  await expect(themeButton).toContainText('Dark');

  // Verify navigation triggers transition
  const hoodieLink = page.locator('text=Hoodies & Sweats');

  // Check if thread canvas is hidden initially
  const canvas = page.locator('#threadTransition');
  await expect(canvas).not.toBeVisible();

  // Click a category
  await hoodieLink.click();

  // Thread transition should start (visible)
  await expect(canvas).toBeVisible();
});
