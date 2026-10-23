import { expect, test } from '@playwright/test';

test('checkpoints survive reload and translation changes; reset requires a deliberate confirmation', async ({ page }) => {
	await page.addInitScript(() => {
		if (localStorage.getItem('paths-fixture')) return;
		localStorage.setItem('paths-fixture', '1');
		localStorage.setItem('lang', 'en');
		localStorage.setItem('learning-paths-v1', JSON.stringify({ 'everyday-report': ['report-scope'] }));
	});
	await page.goto('/learn/?path=orientation');
	await expect(page.locator('#path-progress-label')).toContainText('0 / 3');
	await page.locator('.chapter-links a').first().click();
	await expect(page.locator('.prose')).toBeVisible();
	await page.goBack();
	await expect(page.locator('#path-progress-label')).toContainText('0 / 3');
	const first = page.getByRole('checkbox').first();
	await first.focus();
	await page.keyboard.press('Space');
	await expect(first).toBeChecked();
	await expect(page.locator('.next-link')).toHaveAttribute('href', '#step-orientation-context');
	await page.reload();
	await expect(first).toBeChecked();
	await expect(page.locator('#path-progress-label')).toContainText('1 / 3');
	await page.getByRole('button', { name: '日本語', exact: true }).click();
	await expect(page.locator('#path-title')).toHaveText('約30分で基本の見取り図をつくる');
	await expect(first).toBeChecked();
	await page.getByRole('button', { name: '中文', exact: true }).click();
	await expect(page.locator('#path-title')).toHaveText('约 30 分钟，建立正确直觉');
	await expect(first).toBeChecked();
	await page.getByRole('button', { name: 'English', exact: true }).click();
	await page.getByRole('button', { name: 'Reset this path', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Keep my progress', exact: true })).toBeFocused();
	await page.getByRole('button', { name: 'Keep my progress', exact: true }).click();
	await expect(first).toBeChecked();
	await page.getByRole('button', { name: 'Reset this path', exact: true }).click();
	await page.getByRole('button', { name: 'Clear these checkpoints', exact: true }).click();
	await expect(first).not.toBeChecked();
	await expect(page.locator('#path-title')).toBeFocused();
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('learning-paths-v1')!))).toEqual({ 'everyday-report': ['report-scope'] });
});

for (const lang of ['zh', 'ja', 'en']) {
	test(`${lang} paths fit a 320px screen at 150% type with touch targets`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 740 });
		await page.addInitScript((language) => {
			localStorage.setItem('lang', language);
			localStorage.setItem('font-scales', JSON.stringify({ nav: 1.5, heading: 1.5, body: 1.5 }));
		}, lang);
		await page.goto('/learn/');
		await expect(page.locator('.path-choice')).toHaveCount(3);
		for (const path of ['orientation', 'everyday-report', 'first-project']) {
			await page.locator(`.path-choice[href*="path=${path}"]`).click();
			await expect(page.locator('#path-details')).toBeVisible();
			await expect(page.locator('.steps > li')).toHaveCount(path === 'orientation' ? 3 : 4);
			const dimensions = await page.evaluate(() => {
				const main = document.querySelector('main')!;
				return {
					main: main.clientWidth,
					content: main.scrollWidth,
					viewport: innerWidth,
					documentHeight: document.documentElement.scrollHeight,
					viewportHeight: innerHeight,
					document: document.documentElement.scrollWidth,
					targets: [...document.querySelectorAll('.path-choice, .checkpoint, .chapter-links a, .next-link')].map((element) => element.getBoundingClientRect().height)
				};
			});
			expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
			expect(dimensions.documentHeight).toBeLessThanOrEqual(dimensions.viewportHeight + 1);
			expect(dimensions.content).toBeLessThanOrEqual(dimensions.main + 1);
			expect(dimensions.targets.every((height) => height >= 44)).toBe(true);
		}
	});
}

test('invalid saved IDs show a useful notice and imports refresh the selected path', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('lang', 'en');
		localStorage.setItem('learning-paths-v1', JSON.stringify({ orientation: ['orientation-explain', 'unknown'], missing: ['unknown'] }));
	});
	await page.goto('/learn/?path=orientation');
	await expect(page.locator('.storage-alert')).toContainText('Valid checkpoints were kept');
	await expect(page.locator('#path-progress-label')).toContainText('1 / 3');
	await page.evaluate(() => {
		localStorage.setItem('learning-paths-v1', JSON.stringify({ orientation: ['orientation-context', 'orientation-verify'] }));
		window.dispatchEvent(new Event('learning-data-imported'));
	});
	await expect(page.locator('.storage-alert')).toHaveCount(0);
	await expect(page.locator('#path-progress-label')).toContainText('2 / 3');
	await expect(page.locator('.next-link')).toHaveAttribute('href', '#step-orientation-explain');
});

test('a storage write failure is reported while the current exercise remains usable', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('lang', 'en');
		const original = Storage.prototype.setItem;
		Storage.prototype.setItem = function (key: string, value: string) {
			if (key === 'learning-paths-v1') throw new DOMException('Quota exceeded', 'QuotaExceededError');
			return original.call(this, key, value);
		};
	});
	await page.goto('/learn/?path=orientation');
	await page.getByRole('checkbox').first().check();
	await expect(page.locator('#path-progress-label')).toContainText('1 / 3');
	await expect(page.locator('.storage-alert')).toContainText('could not be saved');
	expect(await page.evaluate(() => localStorage.getItem('learning-paths-v1'))).toBeNull();
});
