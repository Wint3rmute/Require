import { test, expect } from '@playwright/test';

test('home page loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check that the page has the correct title
  await expect(page).toHaveTitle(/Require/);

  // Check for navbar presence
  await expect(page.getByRole('banner')).toBeVisible();

  // Check for navigation links in navbar
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Subsystems' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Interfaces' })).toBeVisible();
});

test('navigation works correctly', async ({ page }) => {
  await page.goto('/');

  // Navigate to Subsystems page
  await page.getByRole('link', { name: 'Subsystems' }).click();
  await expect(page).toHaveURL('/subsystems');

  // Navigate to Interfaces page
  await page.getByRole('link', { name: 'Interfaces' }).click();
  await expect(page).toHaveURL('/interfaces');

  // Navigate back to Home
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
});
