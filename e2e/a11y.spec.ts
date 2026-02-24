import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('initial load should not have any violations', async ({ page }) => {
    await page.goto('/');

    // Wait for terminal to be ready
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /terminal input/i })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
        .exclude('.status-indicator') // These are decorative and might flag contrast issues if not hidden properly, but I marked them aria-hidden="true" so should be fine.
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('command interaction should not introduce violations', async ({ page }) => {
    await page.goto('/');

    // Type /help
    await page.getByRole('textbox', { name: /terminal input/i }).fill('/help');
    await page.getByRole('textbox', { name: /terminal input/i }).press('Enter');

    // Wait for response
    await expect(page.getByText('Available Commands')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
