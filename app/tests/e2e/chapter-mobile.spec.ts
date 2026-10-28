import { test, expect, type Page } from '@playwright/test';

async function selectProse(page: Page) {
	const paragraph = page.locator('.prose p').first();
	await paragraph.scrollIntoViewIfNeeded();
	return paragraph.evaluate((element) => {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		let node = walker.nextNode();
		while (node && (node.textContent?.trim().length ?? 0) < 8) node = walker.nextNode();
		if (!node) throw new Error('Expected selectable chapter text');
		const range = document.createRange();
		range.setStart(node, 0);
		range.setEnd(node, Math.min(12, node.textContent!.length));
		const selection = window.getSelection()!;
		selection.removeAllRanges();
		selection.addRange(range);
		document.dispatchEvent(new Event('selectionchange'));
		return selection.toString().trim();
	});
}

test.describe('mobile chapter', () => {
	test.use({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });

	test('section links close the native contents disclosure and remember the chapter', async ({ page }) => {
		await page.goto('/chapter/what-is-llm/');
		const contents = page.locator('details.mobile-toc');
		await contents.locator('summary').tap();
		await expect(contents).toHaveAttribute('open', '');
		const link = contents.locator('a').first();
		const hash = await link.getAttribute('href');
		await link.tap();
		await expect(contents).not.toHaveAttribute('open');
		await expect.poll(() => page.evaluate(() => decodeURIComponent(location.hash))).toBe(hash);
		await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('reading-chapter') ?? '{}').zh)).toBe('what-is-llm');
	});

	test('touch selection opens a usable note editor and persists the selected text', async ({ page }) => {
		await page.goto('/chapter/what-is-llm/');
		const exact = await selectProse(page);
		const toolbar = page.getByRole('toolbar');
		await expect(toolbar).toBeVisible({ timeout: 2000 });
		const targets = await toolbar.locator('button').evaluateAll((buttons) =>
			buttons.map((button) => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height }))
		);
		for (const target of targets) {
			expect(target.width).toBeGreaterThanOrEqual(44);
			expect(target.height).toBeGreaterThanOrEqual(44);
		}
		await toolbar.locator('.hl-note-btn').tap();
		const editor = page.locator('.hl-pop');
		await expect(editor).toBeVisible();
		const bounds = await editor.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: innerWidth, height: innerHeight };
		});
		expect(bounds.left).toBeGreaterThanOrEqual(0);
		expect(bounds.right).toBeLessThanOrEqual(bounds.width);
		expect(bounds.top).toBeGreaterThanOrEqual(0);
		expect(bounds.bottom).toBeLessThanOrEqual(bounds.height);
		expect(await editor.locator('textarea').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
		await editor.locator('textarea').fill('A note made by touch');
		await editor.locator('.hl-close').tap();
		await expect(editor).toHaveCount(0);
		await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('annotations') ?? '[]'))).toEqual([
			expect.objectContaining({ chapter: 'what-is-llm', lang: 'zh', exact, note: 'A note made by touch' })
		]);
		await page.reload();
		await expect(page.locator('mark.hl').first()).toHaveAttribute('title', 'A note made by touch');
	});

	test('a deferred scroll event repositions a visible text selection instead of cancelling its toolbar', async ({ page }) => {
		await page.goto('/chapter/what-is-llm/');
		await selectProse(page);
		await page.locator('main').evaluate((element) => element.dispatchEvent(new Event('scroll')));
		await expect(page.getByRole('toolbar')).toBeVisible();
		await page.locator('main').evaluate((element) => element.scrollTo(0, element.scrollHeight));
		await expect(page.getByRole('toolbar')).toHaveCount(0);
	});
});

test('desktop mouse selection still creates a highlight', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/chapter/what-is-llm/');
	const paragraph = page.locator('.prose p').first();
	await paragraph.scrollIntoViewIfNeeded();
	const drag = await paragraph.evaluate((element) => {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		let node = walker.nextNode();
		while (node && (node.textContent?.trim().length ?? 0) < 8) node = walker.nextNode();
		if (!node) throw new Error('Expected selectable chapter text');
		const range = document.createRange();
		range.setStart(node, 0);
		range.setEnd(node, 8);
		const rect = range.getBoundingClientRect();
		return { left: rect.left + 1, right: rect.right - 1, y: rect.top + rect.height / 2 };
	});
	await page.mouse.move(drag.left, drag.y);
	await page.mouse.down();
	await page.mouse.move(drag.right, drag.y, { steps: 8 });
	await page.mouse.up();
	await expect(page.getByRole('toolbar')).toBeVisible();
	const exact = await page.evaluate(() => window.getSelection()!.toString().trim());
	expect(exact.length).toBeGreaterThan(0);
	await page.locator('.hl-toolbar .hl-dot-green').click();
	await expect(page.locator('mark.hl').first()).toBeVisible();
	await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('annotations') ?? '[]'))).toEqual([
		expect.objectContaining({ exact, color: 'green', lang: 'zh', chapter: 'what-is-llm' })
	]);
});
