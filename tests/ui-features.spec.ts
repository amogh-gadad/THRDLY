import { test, expect } from '@playwright/test';

test('theme toggle and menu dropdown work', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for preloader to finish
  await page.waitForSelector('h1', { timeout: 15000 });

  // Test Theme Toggle
  const body = page.locator('body');
  const themeToggle = page.locator('button[aria-label="Toggle theme"]');

  // Initial theme (dark)
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

  // Toggle to light
  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: 'screenshots/light-theme.png' });

  // Toggle back to dark
  await themeToggle.click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: 'screenshots/dark-theme.png' });

  // Test Menu Dropdown
  const menuButton = page.locator('button:has-text("Menu")');
  await menuButton.click();

  // Check if categories are visible
  await expect(page.locator('text=Categories')).toBeVisible();
  await expect(page.locator('text=Hoodies & Sweats')).toBeVisible();
  await page.screenshot({ path: 'screenshots/menu-dropdown.png' });

  // Close menu
  await menuButton.click();
  await expect(page.locator('text=Categories')).not.toBeVisible();
});
