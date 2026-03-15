import { test, expect } from '@playwright/test';

test.describe('NHS Routing Fallbacks', () => {
  test('gracefully falls back when API fails', async ({ page }) => {
    // Intercept NHS API calls and mock a failure
    await page.route('https://api.nhs.uk/mental-health/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');

    // Wait for the terminal to be ready by waiting for the service status to settle
    const statusElement = page.locator('text=/Service Status:/');
    await expect(statusElement).toHaveText(/Service Status: (Connected|Using fallback responses|Error)/, { timeout: 30000 });

    // Try finding the input
    const input = page.locator('#terminal-input');
    await expect(input).toBeVisible();

    // Type a command that would trigger NHS routing/resources
    await input.fill('/resources');
    await input.press('Enter');

    // It should either use cached data (if pre-populated, but we're fresh here)
    // or gracefully show an error response/fallback resources rather than crashing
    // Wait for a response from the bot
    // If it fails but doesn't crash, it should display some fallback or error message to user
    await expect(page.locator('.scanlines')).toContainText(/Sorry|error|fallback|resources/i, { timeout: 10000 });
  });

  test('handles rate limiting gracefully', async ({ page }) => {
    // We mock rate limiting with 429
    await page.route('https://api.nhs.uk/mental-health/**', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Too Many Requests' })
      });
    });

    await page.goto('/');

    // Wait for the terminal to be ready
    const statusElement = page.locator('text=/Service Status:/');
    await expect(statusElement).toHaveText(/Service Status: (Connected|Using fallback responses|Error)/, { timeout: 30000 });

    const input = page.locator('#terminal-input');
    await expect(input).toBeVisible();

    await input.fill('/resources');
    await input.press('Enter');

    // It should not crash the app, but display an appropriate fallback
    await expect(page.locator('.scanlines')).toContainText(/Sorry|error|fallback|resources/i, { timeout: 10000 });
  });
});
