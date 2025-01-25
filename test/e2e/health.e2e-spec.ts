import { test, expect } from '@playwright/test';

test('health check', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body).toHaveProperty('status', 'ok');
}); 