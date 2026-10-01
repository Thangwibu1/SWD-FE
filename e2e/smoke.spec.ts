import { expect, test } from '@playwright/test';

// Phase 0 smoke: the production build renders the shell and navigation.
// API calls are stubbed so the test needs no live backend.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":"ok"}' }),
  );
});

test('renders the dashboard shell with sidebar navigation', async ({ page }) => {
  await page.goto('/');
  for (const label of [
    'Dashboard',
    'New Experiment',
    'Experiments',
    'Comparison',
    'Architectures',
    'Settings',
  ]) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }
});
