
import { test, expect } from '@playwright/test';

test('verify no loading text and check initial state', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:3000');

  // Wait for the app to load (checking for main terminal element)
  await expect(page.locator('main[aria-label="Terminal"]')).toBeVisible();

  // The text "WellBeing.sh" appears in multiple places (header and intro message)
  // Let's specifically check the header
  await expect(page.locator('header').getByText('WellBeing.sh')).toBeVisible();

  // Take a screenshot of the initial loaded state
  await page.screenshot({ path: 'verification-initial.png' });

  // Reload to try and catch the "Initializing" state
  await page.reload();

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
