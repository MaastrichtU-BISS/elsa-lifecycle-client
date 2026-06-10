import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {
  const username = 'user1@example.com';
  const password = 'password';

  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');

  await page.getByTestId('login-email').fill(username);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  await page.waitForURL(/\/$/);

  await expect(page).toHaveURL(/\/$/);

  await page.context().storageState({
    path: authFile,
  });
});