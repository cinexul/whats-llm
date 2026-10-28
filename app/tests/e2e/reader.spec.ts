import { test, expect } from '@playwright/test';

test('search keeps keyboard focus inside the dialog and returns it on Escape', async ({ page }) => {
	await page.goto('/');
	const searchButton = page.getByRole('button', { name: /搜索/ });
	await searchButton.click();
	const input = page.locator('.search-panel input');
	await expect(input).toBeFocused();
	await page.locator('.search-results').click();
	await page.keyboard.press('Shift+Tab');
	await expect(page.getByRole('button', { name: '关闭', exact: true })).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(input).toBeFocused();
	await input.fill('Token');
	const results = page.locator('.search-hits button');
	await expect(results.first()).toBeVisible();
	await page.keyboard.press('Shift+Tab');
	await expect(results.last()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(input).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(page.locator('.search-panel')).toHaveCount(0);
	await expect(searchButton).toBeFocused();
});

test('an upgrade retires old quiz cards from due counts without deleting study history', async ({ page }) => {
	await page.addInitScript(() => {
		if (localStorage.getItem('upgrade-fixture')) return;
		localStorage.setItem('upgrade-fixture', '1');
		localStorage.setItem('lang', 'zh');
		const id = 'zh:codex-handson:1n5w8vh';
		localStorage.setItem('study-v1', JSON.stringify({
			cards: { [id]: { id, lang: 'zh', slug: 'codex-handson', qn: 1, qhash: '1n5w8vh', stability: 3, difficulty: 5, state: 2, due: 1, lastReview: 1, reps: 2, lapses: 0 } },
			reviews: [{ cardId: id, ts: 1, rating: 3, elapsedMs: null, scheduledDays: 3 }],
			read: { zh: ['codex-handson'] }
		}));
	});
	await page.goto('/review/');
	await expect(page.locator('.review .empty')).toBeVisible();
	await expect(page.locator('.due-badge')).toHaveCount(0);
	await page.locator('a[href="/progress/"]').first().click();
	await expect(page.locator('.review-cta')).toHaveCount(0);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!));
	expect(saved.reviews).toHaveLength(1);
	expect(Object.keys(saved.cards)).toHaveLength(1);
	expect(saved.read.zh).toEqual(['codex-handson']);
});

test('reader loads all languages, persists quiz answers, and keeps new highlights in their language', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/chapter/what-is-llm/');
	await expect(page.locator('.prose')).toContainText('参数');
	await page.getByRole('button', { name: 'English', exact: true }).click();
	await expect(page.locator('.prose')).toContainText(/parameter/i);
	await page.getByRole('button', { name: '日本語', exact: true }).click();
	await expect(page.locator('.prose')).toContainText('パラメータ');
	await page.getByRole('button', { name: '中文', exact: true }).click();
	await expect(page.locator('.prose')).toContainText('参数');
	await page.locator('.quiz .q').first().locator('button.opt').first().click();
	await expect(page.locator('.quiz .q').first().locator('.verdict')).toBeVisible();
	await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!).reviews.length)).toBe(1);
	await page.reload();
	await expect(page.locator('.prose')).toContainText('参数');
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!).reviews.length)).toBe(1);
	await page.locator('a[href="/progress/"]').first().click();
	await expect(page.locator('.stats .stat-num').nth(1)).toHaveText('1');
	await page.goto('/chapter/what-is-llm/');
	await page.evaluate(() => localStorage.setItem('annotations', JSON.stringify([{
		id: 'english-only', chapter: 'what-is-llm', lang: 'en', exact: 'parameters',
		prefix: '', suffix: '', color: 'yellow', note: 'English note', createdAt: new Date().toISOString()
	}])));
	await page.reload();
	await expect(page.locator('.prose')).toContainText('参数');
	await expect(page.locator('mark.hl')).toHaveCount(0);
	await page.getByRole('button', { name: 'English', exact: true }).click();
	await expect(page.locator('mark.hl')).toHaveCount(1);
	await expect(page.locator('mark.hl')).toHaveAttribute('title', 'English note');
	await page.getByRole('button', { name: '日本語', exact: true }).click();
	await expect(page.locator('mark.hl')).toHaveCount(0);
	expect(errors).toEqual([]);
});
