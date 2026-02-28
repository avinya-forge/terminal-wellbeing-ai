import { test, expect } from '@playwright/test';

test.describe('Terminal Status Texts', () => {
  test('should display proper loading and connected status texts', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Initially, it might show "Service Status: Loading..." or some initialization text
    // depending on how fast the app loads. We'll wait for the header to be visible.
    const statusRegion = page.locator('header').getByRole('status');
    await expect(statusRegion).toBeVisible();

    // Wait for the status to change to something other than Loading...
    // In CI/test environment without models, it might fall back, but it should have changed from the initial state
    await expect(statusRegion).not.toContainText('Service Status: Loading...', { timeout: 20000 });

    // We expect it to eventually settle on a known post-load state
    await expect(statusRegion).toContainText(/Service Status: (Connected|Using fallback responses|Error)/);
  });
});
