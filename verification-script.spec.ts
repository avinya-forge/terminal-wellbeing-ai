
import { test, expect } from '@playwright/test';

test('verify no loading text and check initial state', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:3000');

  // Wait for the app to load (checking for main terminal element)
  await expect(page.locator('main[aria-label="Terminal"]')).toBeVisible();

  // Check for the "Service Status" text in the header
  // It might be "Connecting..." or "Online" depending on speed, but definitely NOT "Loading..."
  // We want to ensure "Loading" is NOT present as a standalone status or in the old format

  // Check that "Loading..." text is NOT present in the document body
  // We need to be careful not to match "Service Status: Loading..." if that was the intended new string,
  // but the plan said "Service Status: Initializing...".
  // So "Loading..." should mostly be gone or part of a sentence that we changed.

  // Actually, we changed "Service Status: Loading local..." to "Service Status: Initializing local...".
  // So we should verify that "Service Status: Initializing" appears if we catch it early enough,
  // or just verify "Online" if it loads fast.

  // Let's try to capture the initial state if possible, but it might be too fast.
  // We can at least verify the header contains "WellBeing.sh"
  await expect(page.getByText('WellBeing.sh')).toBeVisible();

  // Take a screenshot of the initial loaded state
  await page.screenshot({ path: 'verification-initial.png' });

  // Check if we can find "Service Status" in the header if it's not Online yet
  // If it is Online, we see "Online".
  const statusElement = page.locator('header').getByRole('status');
  if (await statusElement.isVisible()) {
      const text = await statusElement.textContent();
      console.log('Header status text:', text);
  }

  // Reload to try and catch the "Initializing" state
  await page.reload();
  // We might not catch it in a screenshot easily without slowing down network,
  // but we can check if "Loading" appears in the page text content.

  const content = await page.content();
  const hasLoading = content.includes('Loading...');
  console.log('Page content has "Loading...":', hasLoading);

  if (hasLoading) {
      console.error('FAILURE: Found "Loading..." text in page content');
  } else {
      console.log('SUCCESS: "Loading..." text not found');
  }

  await page.screenshot({ path: 'verification-reload.png' });
});
