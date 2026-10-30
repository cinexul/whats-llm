import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { savedChapterEdits } from './local-edit-data';

const chapter = '/chapter/what-is-llm/';
const body = (page: Page) => page.locator('article > .prose');
const editor = (page: Page) => page.getByTestId('local-editor');
async function open(page: Page) {
	await page.getByTestId('edit-chapter').click();
	await expect(editor(page)).toBeVisible();
	return page.getByTestId('local-markdown').inputValue();
}
async function save(page: Page, markdown: string) {
	await page.getByTestId('local-markdown').fill(markdown);
	await page.getByTestId('save-local-edit').click();
	await expect(editor(page)).not.toBeVisible();
	await expect(page.getByTestId('local-edited-badge')).toBeVisible();
}

test('edits stay discoverable in the chapter, contents, library, and diff while quizzes and other languages remain intact', async ({ page }) => {
	await page.goto(chapter);
	const quiz = await page.locator('#quiz').innerText();
	const original = await open(page);
	const modified = `## 一、Token：AI 切分文字的 &quot;颗粒&quot;\n\n我的独家例子，方便以后找回。\n`;
	await save(page, modified);
	await expect(body(page)).toContainText('我的独家例子');
	await expect(page.locator('#quiz')).toHaveText(quiz, { useInnerText: true });
	await expect(page.locator('aside.toc')).not.toContainText('&quot;');
	await expect(page.locator('aside.toc')).toContainText('一、Token：AI 切分文字的 "颗粒"');
	await expect(page.locator('aside.sidebar a[href="/chapter/what-is-llm/"] .local-edit-badge')).toContainText('本地修改');
	await page.getByTestId('view-local-diff').click();
	await expect(page.getByTestId('local-diff').locator('[data-kind="added"]').filter({ hasText: '我的独家例子' })).toBeVisible();
	await expect(page.getByTestId('local-diff').locator('[data-kind="removed"]').first()).toContainText(original.trim().split('\n')[0]);
	await editor(page).getByRole('button', { name: '关闭', exact: true }).click();
	await page.reload();
	await expect(body(page)).toContainText('我的独家例子');
	await page.getByRole('button', { name: 'English', exact: true }).click();
	await expect(body(page)).toContainText(/parameters/i);
	await expect(page.getByTestId('local-edited-badge')).toHaveCount(0);
	await page.goto('/library/');
	const list = page.getByTestId('local-edits-library');
	await expect(list.locator('li')).toHaveCount(1);
	await list.getByRole('link', { name: 'View changes', exact: true }).hover();
	// Hover prefetch must not change the selected edition until navigation commits.
	await expect(page.getByRole('heading', { name: 'My library', exact: true })).toBeVisible();
	expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('en');
	await list.getByRole('link', { name: 'View changes', exact: true }).click();
	await expect(editor(page)).toBeVisible();
	await expect(page.getByTestId('local-diff')).toContainText('我的独家例子');
	await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
	await editor(page).getByRole('button', { name: '关闭', exact: true }).click();
	// An explicit library language must not prevent a later manual language switch.
	await page.getByRole('button', { name: 'English', exact: true }).click();
	await expect(body(page)).toContainText(/parameters/i);
});

test('drafts survive cancelled dismissal and failed saves, and can be downloaded before restoring the original', async ({ page }) => {
	await page.goto(`${chapter}?edition=en`);
	const original = await open(page);
	const draft = `${original}\n\n## Personal example\n\nKeep this draft.\n`;
	await page.getByTestId('local-markdown').fill(draft);
	page.once('dialog', (dialog) => dialog.dismiss());
	await editor(page).getByRole('button', { name: 'Close', exact: true }).click();
	await expect(page.getByTestId('local-markdown')).toHaveValue(draft);
	await page.evaluate(() => {
		const put = IDBObjectStore.prototype.put;
		IDBObjectStore.prototype.put = function (value, key) {
			if (this.name === 'chapters' && !(window as unknown as { permitSave: boolean }).permitSave) throw new DOMException('Full', 'QuotaExceededError');
			return put.call(this, value, key!);
		};
	});
	await page.getByTestId('save-local-edit').click();
	await expect(editor(page).getByRole('alert')).toContainText('draft remains');
	await expect(page.getByTestId('local-markdown')).toHaveValue(draft);
	expect(await savedChapterEdits(page)).toEqual([]);
	const downloadEvent = page.waitForEvent('download');
	await editor(page).getByRole('button', { name: 'Download Markdown', exact: true }).click();
	expect(await readFile((await (await downloadEvent).path())!, 'utf8')).toBe(draft);
	await page.evaluate(() => { (window as unknown as { permitSave: boolean }).permitSave = true; });
	await save(page, draft);
	page.once('dialog', (dialog) => dialog.dismiss());
	await page.getByTestId('restore-original').click();
	await expect(body(page)).toContainText('Keep this draft.');
	page.once('dialog', (dialog) => dialog.accept());
	await page.getByTestId('restore-original').click();
	await expect(page.getByTestId('local-edited-badge')).toHaveCount(0);
	await expect(body(page)).not.toContainText('Keep this draft.');
	expect((await savedChapterEdits(page))[0].markdown).toBeNull();
	await page.goto('/library/');
	await expect(page.getByTestId('local-edits-library').locator('li')).toHaveCount(0);
});

test('a second window cannot silently overwrite a newer saved chapter with a stale draft', async ({ page, context }) => {
	await page.goto(`${chapter}?edition=en`);
	const original = await open(page);
	const second = await context.newPage();
	await second.goto(`${chapter}?edition=en`);
	await open(second);
	await page.getByTestId('local-markdown').fill(`${original}\n\nMy older open draft.`);
	await save(second, `${original}\n\nThe newer saved version.`);
	await expect(body(page)).toContainText('The newer saved version.');
	await page.getByTestId('save-local-edit').click();
	await expect(editor(page).getByRole('alert')).toContainText('another window');
	await expect(page.getByTestId('local-markdown')).toHaveValue(`${original}\n\nMy older open draft.`);
	expect((await savedChapterEdits(page))[0].markdown).toContain('The newer saved version.');
});

test('the editor stays usable with a short viewport and keeps the global search shortcut out of its modal', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 360 });
	await page.addInitScript(() => localStorage.setItem('font-scales', JSON.stringify({ body: 1.5, heading: 1.5, nav: 1.5 })));
	await page.goto(`${chapter}?edition=ja`);
	const original = await open(page);
	const input = page.getByTestId('local-markdown');
	await input.fill(`${original}\n\n短い画面でも編集できます。`);
	await page.keyboard.press('Control+k');
	await expect(page.locator('.search-panel')).toHaveCount(0);
	await expect(input).toBeFocused();
	await input.scrollIntoViewIfNeeded();
	await expect(input).toBeInViewport();
	expect(await input.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(120);
	await page.getByTestId('save-local-edit').click();
	await expect(body(page)).toContainText('短い画面でも編集できます。');
});

test('local HTML is sanitized in preview and reading, and changed originals have an explicit comparison choice', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('chapter-edits-v1', JSON.stringify([{ lang: 'en', slug: 'what-is-llm', original: 'Old original before a book update.', markdown: 'My retained local version.', updatedAt: 1000 }]));
	});
	await page.goto(`${chapter}?edition=en`);
	await expect(page.getByTestId('original-updated')).toBeVisible();
	await page.getByTestId('view-local-diff').click();
	await expect(page.getByTestId('local-diff')).toContainText('Old original before a book update.');
	await page.getByRole('combobox', { name: 'Compare against' }).selectOption({ label: 'Current original' });
	await expect(page.getByTestId('local-diff')).not.toContainText('Old original before a book update.');
	await page.getByTestId('editor-tab-edit').click();
	const payload = '## Safe heading\n\n<script>window.localAttack=1</script><img src="x" onerror="window.localAttack=2"><a href="javascript:window.localAttack=3">Unsafe link</a><div style="position:fixed;inset:0">Visible text</div>';
	await page.getByTestId('local-markdown').fill(payload);
	await page.getByTestId('editor-tab-preview').click();
	await expect(page.getByTestId('local-preview')).toContainText('Safe heading');
	await expect(page.getByTestId('local-preview').locator('script,[onerror],[style],a[href^="javascript:"]')).toHaveCount(0);
	await page.getByTestId('save-local-edit').click();
	await expect(body(page)).toContainText('Visible text');
	await expect(body(page).locator('script,[onerror],[style],a[href^="javascript:"]')).toHaveCount(0);
	expect(await page.evaluate(() => (window as unknown as { localAttack?: number }).localAttack)).toBeUndefined();
});

test('the editor follows the visual viewport when a mobile keyboard covers the layout viewport', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${chapter}?edition=en`);
	const original = await open(page);
	await page.getByTestId('local-markdown').fill(`${original}\n\nA note with the keyboard open.`);
	await page.evaluate(() => {
		Object.defineProperty(window.visualViewport!, 'height', { configurable: true, value: 330 });
		window.visualViewport!.dispatchEvent(new Event('resize'));
	});
	await expect.poll(() => editor(page).evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(331);
	await page.getByTestId('save-local-edit').click();
	await expect(body(page)).toContainText('A note with the keyboard open.');
});

for (const language of ['zh', 'ja', 'en']) {
	test(`editor and diff fit a 320px mobile screen with large text in ${language}`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.addInitScript(() => localStorage.setItem('font-scales', JSON.stringify({ body: 1.5, heading: 1.5, nav: 1.5 })));
		await page.goto(`${chapter}?edition=${language}`);
		const original = await open(page);
		await page.getByTestId('local-markdown').fill(`${original}\n\n## A long personal note\n\n${'unbroken'.repeat(80)}`);
		for (const tab of ['edit', 'preview', 'diff']) {
			await page.getByTestId(`editor-tab-${tab}`).click();
			if (tab === 'preview') await expect(page.getByTestId('local-preview')).toBeVisible();
			const geometry = await editor(page).evaluate((element) => {
				const content = element.querySelector('.editor-body')!;
				return { width: element.clientWidth, scroll: element.scrollWidth, contentWidth: content.clientWidth, contentScroll: content.scrollWidth, bottom: element.getBoundingClientRect().bottom, viewport: innerHeight };
			});
			expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1);
			expect(geometry.contentScroll).toBeLessThanOrEqual(geometry.contentWidth + 1);
			expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport + 1);
			await expect(page.getByTestId('save-local-edit')).toBeInViewport();
		}
		await page.getByTestId('save-local-edit').click();
		await expect(page.getByTestId('local-edited-badge')).toBeVisible();
	});
}

test('secondary chapter tools remain keyboard discoverable and return focus after closing', async ({ page }) => {
	await page.goto(chapter);
	await page.locator('aside.toc a[href="#chapter-tools"]').focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('#chapter-tools')).toBeFocused();
	await page.getByTestId('edit-chapter').focus();
	await page.keyboard.press('Enter');
	await expect(editor(page)).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(editor(page)).not.toBeVisible();
	await expect(page.getByTestId('edit-chapter')).toBeFocused();
	await page.setViewportSize({ width: 700, height: 760 });
	await page.goto(chapter);
	await page.locator('details.mobile-toc summary').click();
	await page.locator('details.mobile-toc a[href="#chapter-tools"]').click();
	await expect(page.locator('details.mobile-toc')).not.toHaveAttribute('open');
	await expect(page.locator('#chapter-tools')).toBeFocused();
});
