import { test, expect } from '@playwright/test';

test('mobile section links keep the header and bottom navigation in the viewport', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/learn/');
	await page.locator('.path-choice').first().click();
	await expect(page.locator('#path-details')).toBeVisible();
	await expect.poll(() => page.evaluate(() => Math.round(document.querySelector('.topbar')!.getBoundingClientRect().top))).toBe(0);
	await page.locator('.next-link').click();
	await expect.poll(() => page.evaluate(() => Math.round(document.querySelector('.topbar')!.getBoundingClientRect().top))).toBe(0);
	const bottom = await page.locator('.mobile-nav').evaluate((el) => el.getBoundingClientRect().bottom);
	expect(bottom).toBeLessThanOrEqual(844);
	expect(bottom).toBeGreaterThan(820);
});
