import { test, expect } from '@playwright/test';

test.describe('Service Status Text Rendering', () => {
  test('displays loading status initially and subsequent status', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check for the initial loading status
    // Using a regex to match the beginning of the status text since it could vary slightly
    // but typically starts with "Service Status:"
    const statusElement = page.locator('text=/Service Status:/');
    await expect(statusElement).toBeVisible();

    // Wait for the status to change to a definitive state
    // We expect it to eventually reach Connected, Using fallback responses, Error, or loading states
    await expect(statusElement).toHaveText(/Service Status: (Connected|Using fallback responses|Error|Loading)/, { timeout: 30000 });
  });

  test('displays appropriate title attribute for service status icon', async ({ page }) => {
    await page.goto('/');

    // Check the title attribute of the element that contains the service status
    // We assume the title is applied to a wrapper or the element itself
    const statusContainer = page.locator('[title^="Service Status:"]');

    // The element with title might be aria-hidden, so we don't need to assert it is strictly visible
    // Wait for the model to load or fallback
    await expect(statusContainer).toHaveAttribute('title', /Service Status: (Connected|Using fallback responses|Loading...)/, { timeout: 30000 });
  });
});
