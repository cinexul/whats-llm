import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('continues at the saved paragraph after returning home and changing font size', async ({ page }) => {
	await page.goto('/chapter/token-and-context/');
	await expect(page.locator('.prose p').nth(8)).toBeAttached();
	await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
	await page.locator('.prose p').nth(8).evaluate((el) => { el.scrollIntoView(); el.closest('main')!.scrollBy(0, 35); });
	await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('reading-positions-v1') ?? '{}').zh?.['token-and-context']?.anchor)).toBeTruthy();
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('reading-positions-v1')!).zh['token-and-context']);
	await page.locator('.brand').click();
	await expect(page.locator('.reading-start')).toBeVisible();
	await page.evaluate(() => localStorage.setItem('font-scales', JSON.stringify({ nav: 1, heading: 1, body: 1.5 })));
	await page.reload();
	await page.locator('.reading-start').click();
	await expect(page.locator('.prose p').nth(8)).toBeAttached();
	await expect.poll(() => page.evaluate(({ anchor, offset }) => {
		const main = document.querySelector('main')!;
		const block = [...document.querySelectorAll<HTMLElement>('[data-reading-anchor]')].find((el) => el.dataset.readingAnchor === anchor);
		if (!block) return 999;
		const rect = block.getBoundingClientRect();
		return Math.abs(rect.top + rect.height * offset - main.getBoundingClientRect().top - 16);
	}, saved)).toBeLessThan(3);
});

test('explicit section links override the saved paragraph', async ({ page }) => {
	await page.goto('/chapter/token-and-context/');
	await expect(page.locator('.prose h2').last()).toBeAttached();
	await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
	await page.locator('.prose p').nth(8).evaluate((el) => el.scrollIntoView());
	await expect.poll(() => page.evaluate(() => localStorage.getItem('reading-positions-v1'))).not.toBeNull();
	const heading = await page.locator('.prose h2').last().getAttribute('id');
	await page.goto(`/chapter/token-and-context/#${encodeURIComponent(heading!)}`);
	await expect.poll(() => page.evaluate((id) => {
		const target = document.getElementById(id!);
		return target ? Math.abs(target.getBoundingClientRect().top - document.querySelector('main')!.getBoundingClientRect().top) : 999;
	}, heading)).toBeLessThan(60);
});

test('a language without a saved position starts at the beginning and preserves the old language', async ({ page }) => {
	await page.goto('/chapter/token-and-context/');
	await expect(page.locator('.prose p').nth(8)).toBeAttached();
	await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
	await page.locator('.prose p').nth(8).evaluate((el) => el.scrollIntoView());
	await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('reading-positions-v1') ?? '{}').zh?.['token-and-context']?.anchor)).toBeTruthy();
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('reading-positions-v1')!).zh['token-and-context']);
	await page.getByRole('button', { name: '显示设置', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'English', exact: true }).click();
	await page.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(page.locator('.prose')).toContainText('context');
	await expect.poll(() => page.locator('main').evaluate((el) => el.scrollTop)).toBe(0);
	const retained = await page.evaluate(() => JSON.parse(localStorage.getItem('reading-positions-v1')!).zh['token-and-context']);
	expect(retained.anchor).toBe(saved.anchor);
	// 滚动停稳前可能再存一次，位置只差零点几个像素
	expect(retained.offset).toBeCloseTo(saved.offset, 2);
});
