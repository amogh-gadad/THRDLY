import { test, expect } from '@playwright/test';

test('theme toggle and menu dropdown work', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for preloader to finish
  await page.waitForSelector('h1', { timeout: 15000 });

  // Test Menu Dropdown
  const menuButton = page.locator('button:has-text("Menu")');
  await menuButton.click();

  // Check if categories are visible (we use "Collections" now)
  await expect(page.locator('text=Collections')).toBeVisible();
  await expect(page.locator('text=Hoodies & Sweats')).toBeVisible();
  await page.screenshot({ path: 'screenshots/menu-dropdown.png' });

  // Test Theme Toggle inside menu
  const themeToggle = page.locator('button:has-text("Dark"), button:has-text("Light")');

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

  // Close menu
  await menuButton.click();
  await expect(page.locator('text=Collections')).not.toBeVisible();
});
