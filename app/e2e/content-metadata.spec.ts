import { test, expect } from '@playwright/test';
import metadata from '../src/lib/content-metadata.json' with { type: 'json' };

test.use({ viewport: { width: 390, height: 844 } });

const editions = [
	{ lang: 'zh', title: '本章版本与来源', unverified: '未记录单独核验日期', alignment: '中文原文' },
	{ lang: 'ja', title: 'この章の版と出典', unverified: '個別の検証日は未記録', alignment: `中国語 第 ${metadata.chapters['codex-handson'].editions.zh.revision} 版との対応を確認済み` },
	{ lang: 'en', title: 'Chapter edition and sources', unverified: 'No individual verification date recorded', alignment: `Translation checked against Chinese revision ${metadata.chapters['codex-handson'].editions.zh.revision}` }
] as const;

for (const edition of editions) {
	test(`${edition.lang}: chapter metadata opens with the keyboard at large mobile text size`, async ({ page }) => {
		await page.addInitScript((lang) => {
			localStorage.setItem('lang', lang);
			localStorage.setItem('font-scales', JSON.stringify({ nav: 1, heading: 1, body: 1.5 }));
		}, edition.lang);
		await page.goto('/chapter/codex-handson/');
		const panel = page.getByRole('complementary', { name: edition.title });
		const summary = panel.locator('summary');
		await summary.scrollIntoViewIfNeeded();
		await summary.focus();
		await page.keyboard.press('Enter');
		await expect(panel.locator('details')).toHaveAttribute('open', '');
		await expect(panel.getByText(edition.alignment, { exact: false })).toBeVisible();
		await expect(panel.getByText(edition.unverified, { exact: true })).toBeVisible();
		await expect(panel.locator('time').first()).toHaveAttribute('datetime', metadata.chapters['codex-handson'].editions[edition.lang].reviewedAt);
		await expect(panel.locator('a[href*="86e17e98c7f901277aeeb4649cf1b01462b082f2"]')).toHaveCount(1);
		const width = await panel.evaluate((el) => ({ content: el.scrollWidth, box: el.clientWidth, right: el.getBoundingClientRect().right }));
		expect(width.content).toBeLessThanOrEqual(width.box + 1);
		expect(width.right).toBeLessThanOrEqual(390);
		await summary.focus();
		await page.keyboard.press('Enter');
		await expect(panel.locator('details')).not.toHaveAttribute('open');
	});
}
