import { test, expect, type Page } from '@playwright/test';
import { savedChapterEdits } from './local-edit-data';

const editor = (page: Page) => page.getByTestId('local-editor');

async function prepareDraft(page: Page, slug: string, markdown: string) {
	await page.goto(`/chapter/${slug}/?edition=en`);
	await page.getByTestId('edit-chapter').click();
	await expect(editor(page)).toBeVisible();
	await page.getByTestId('local-markdown').fill(markdown);
}

/**
 * Expose the read/write gap without changing the stored data or importing app
 * internals. Another real tab can save while this tab is processing its read.
 */
async function delayNextChapterRead(page: Page) {
	await page.evaluate(() => {
		const original = IDBObjectStore.prototype.openCursor;
		let delayed = false;
		IDBObjectStore.prototype.openCursor = function (key, direction) {
			const result = original.call(this, key, direction);
			if (this.name === 'chapters' && key === 'snapshot' && !delayed) {
				delayed = true;
				result.addEventListener('success', () => {
					console.info('chapter-read-in-progress');
					const until = performance.now() + 700;
					while (performance.now() < until) { /* Hold this read while the other tab acts. */ }
				});
			}
			return result;
		};
	});
	return () => page.waitForEvent('console', { predicate: (message) => message.text() === 'chapter-read-in-progress' });
}

async function savedBodies(page: Page) {
	return (await savedChapterEdits(page)).map(({ slug, markdown }) => ({ slug, markdown })).sort((a, b) => a.slug.localeCompare(b.slug));
}

test('simultaneous saves in different tabs retain both edited chapters', async ({ page, context }) => {
	const second = await context.newPage();
	await prepareDraft(page, 'what-is-llm', 'First tab explanation.');
	await prepareDraft(second, 'rag', 'Second tab explanation.');
	const waitingForRead = await delayNextChapterRead(page);
	const reading = waitingForRead();
	const firstSave = page.getByTestId('save-local-edit').click();
	await reading;
	await second.getByTestId('save-local-edit').click();
	await firstSave;
	await expect(editor(page)).not.toBeVisible();
	await expect(editor(second)).not.toBeVisible();
	expect(await savedBodies(second)).toEqual([
		{ slug: 'rag', markdown: 'Second tab explanation.' },
		{ slug: 'what-is-llm', markdown: 'First tab explanation.' }
	]);
});

test('simultaneous saves of one chapter keep the losing draft and report a conflict', async ({ page, context }) => {
	const second = await context.newPage();
	await prepareDraft(page, 'what-is-llm', 'First tab accepted version.');
	await prepareDraft(second, 'what-is-llm', 'Second tab unsaved version.');
	const waitingForRead = await delayNextChapterRead(page);
	const reading = waitingForRead();
	const firstSave = page.getByTestId('save-local-edit').click();
	await reading;
	await second.getByTestId('save-local-edit').click();
	await firstSave;
	await expect(editor(page)).not.toBeVisible();
	await expect(editor(second)).toBeVisible();
	await expect(editor(second).getByRole('alert')).toContainText('another window');
	await expect(second.getByTestId('local-markdown')).toHaveValue('Second tab unsaved version.');
	expect(await savedBodies(second)).toEqual([{ slug: 'what-is-llm', markdown: 'First tab accepted version.' }]);
});

test('a chapter save during backup import preserves both the saved and imported edits', async ({ page, context }) => {
	const second = await context.newPage();
	await prepareDraft(second, 'what-is-llm', 'Draft saved while importing.');
	await page.goto('/library/');
	const incoming = {
		format: 'whats-llm-learning', version: 2, exportedAt: '2026-10-22T00:00:00.000Z',
		annotations: [], study: { cards: [], reviews: [], read: [], kv: {} },
		readingChapter: {}, readingPositions: {}, learningPaths: {}, preferences: { lang: 'en' },
		chapterEdits: [{ lang: 'en', slug: 'rag', markdown: 'Imported retrieval explanation.', original: 'Original retrieval explanation.', updatedAt: 1000 }]
	};
	await page.getByLabel('Choose a JSON backup').setInputFiles({ name: 'concurrent-import.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)) });
	const downloaded = page.waitForEvent('download');
	await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click();
	await downloaded;
	const waitingForRead = await delayNextChapterRead(page);
	const reading = waitingForRead();
	const importing = page.getByRole('button', { name: 'Merge this backup', exact: true }).click();
	await reading;
	await second.getByTestId('save-local-edit').click();
	await importing;
	await expect(page.getByRole('status').filter({ hasText: 'Your learning has been merged.' })).toBeVisible();
	await expect(editor(second)).not.toBeVisible();
	expect(await savedBodies(second)).toEqual([
		{ slug: 'rag', markdown: 'Imported retrieval explanation.' },
		{ slug: 'what-is-llm', markdown: 'Draft saved while importing.' }
	]);
});
