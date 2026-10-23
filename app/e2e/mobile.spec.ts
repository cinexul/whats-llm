import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

async function fitsScreen(page: import('@playwright/test').Page) {
	const widths = await page.evaluate(() => ({
		viewport: innerWidth,
		document: document.documentElement.scrollWidth,
		main: document.querySelector('main')!.getBoundingClientRect().width,
		content: document.querySelector('main')!.scrollWidth
	}));
	expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
	expect(widths.main).toBeGreaterThan(widths.viewport * 0.9);
	expect(widths.content).toBeLessThanOrEqual(widths.main + 1);
}

test('mobile contents opens, navigates, and keeps a return path to the current chapter', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.mobile-nav')).toBeVisible();
	await fitsScreen(page);
	await expect(page.locator('.topbar a[href="/review/"]')).toBeHidden();
	await expect(page.locator('.topbar a[href="/progress/"]')).toBeHidden();
	const contentsButton = page.getByRole('button', { name: '目录', exact: true });
	await contentsButton.tap();
	const contents = page.getByRole('dialog', { name: '目录', exact: true });
	await expect(contents).toBeVisible();
	await contents.locator('a[href="/chapter/what-is-llm/"]').tap();
	await expect(contents).not.toBeVisible();
	await expect(page.locator('.prose')).toContainText('参数');
	await fitsScreen(page);
	await expect(page.locator('.mobile-toc')).toBeVisible();
	await page.getByRole('link', { name: '首页', exact: true }).tap();
	await expect(page.locator('.reading-start')).toContainText('继续阅读');
	await expect(page.locator('.reading-start')).toHaveAttribute('href', '/chapter/what-is-llm/');
	await page.reload();
	await expect(page.locator('.reading-start')).toHaveAttribute('href', '/chapter/what-is-llm/');
	await contentsButton.tap();
	await page.keyboard.press('Escape');
	await expect(contents).not.toBeVisible();
	await expect(contentsButton).toBeFocused();
});

test('touch search and reading settings work in three languages at 320px', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 740 });
	await page.goto('/chapter/skills-and-mcp/');
	await expect(page.locator('.prose')).toBeVisible();
	await page.getByRole('button', { name: '显示设置', exact: true }).tap();
	const settings = page.getByRole('dialog', { name: '显示设置', exact: true });
	await settings.getByRole('button', { name: '正文 调大' }).tap();
	await settings.getByRole('button', { name: '深色', exact: true }).tap();
	await settings.getByRole('button', { name: 'English', exact: true }).tap();
	await page.getByRole('button', { name: 'Close', exact: true }).tap();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await fitsScreen(page);
	await page.getByRole('button', { name: 'Search', exact: true }).tap();
	await page.locator('.search-panel input').fill('MCP');
	await expect(page.locator('.search-hits button').first()).toBeVisible();
	await page.getByRole('button', { name: 'Close', exact: true }).tap();
	await expect(page.locator('.search-panel')).toHaveCount(0);
	await page.getByRole('button', { name: 'Display', exact: true }).tap();
	await page.getByRole('dialog').getByRole('button', { name: '日本語', exact: true }).tap();
	await page.getByRole('button', { name: '閉じる', exact: true }).tap();
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await fitsScreen(page);
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await fitsScreen(page);
});
