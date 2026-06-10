import { test as setup, expect } from '@playwright/test';

const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:8080';
const resetSecret = process.env.E2E_RESET_SECRET;

setup('reset database', async ({ request }) => {
  expect(resetSecret, 'E2E_RESET_SECRET must be set').toBeTruthy();

  const response = await request.post(`${apiBaseUrl}/test/reset-db`, {
    headers: {
      'x-e2e-reset-secret': resetSecret!,
    },
  });

  expect(response.status()).toBe(204);
});