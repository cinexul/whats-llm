import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { savedChapterEdits } from './local-edit-data';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
function backup() {
	return { format: 'whats-llm-learning', version: 1, exportedAt: '2026-10-22T00:00:00.000Z',
		annotations: [{ id: 'portable-note', chapter: 'rag', lang: 'en', exact: 'retrieval', prefix: '', suffix: '', color: 'yellow', note: 'Evidence comes first', createdAt: '2026-10-22T00:00:00.000Z' }],
		study: { cards: [{ id: 'en:rag:retired-v1', lang: 'en', slug: 'rag', qn: 1, qhash: 'retired-v1', stability: 3, difficulty: 5, state: 2, due: 3000, lastReview: 1000, reps: 2, lapses: 0 }], reviews: [{ cardId: 'en:rag:retired-v1', ts: 1000, rating: 3, elapsedMs: 200, scheduledDays: 3 }], read: [{ lang: 'en', slug: 'rag', ts: 1000 }], kv: {} },
		readingChapter: { en: 'rag' }, readingPositions: { en: { rag: { anchor: 'evidence', offset: .5, progress: .4, updatedAt: 1000 } } },
		learningPaths: { 'first-project': ['project-plan'] }, preferences: { lang: 'en' } };
}

test('preview, safety download, merge, and export preserve archived learning without duplicate imports', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('lang', 'en'));
	await page.goto('/library/');
	const file = { name: 'my-learning.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup())) };
	for (let i = 0; i < 2; i++) {
		await page.getByLabel('Choose a JSON backup').setInputFiles(file);
		await expect(page.getByRole('heading', { name: 'Ready to merge' })).toBeVisible();
		const merge = page.getByRole('button', { name: 'Merge this backup', exact: true });
		await expect(merge).toBeDisabled();
		const safetyDownload = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click();
		const safety = await safetyDownload; expect(safety.suggestedFilename()).toContain('before-import');
		await expect(merge).toBeEnabled(); await merge.click();
		await expect(page.getByRole('status').filter({ hasText: 'Your learning has been merged.' })).toBeVisible();
	}
	const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download my backup', exact: true }).click();
	const download = await downloadEvent; const data = JSON.parse(await readFile((await download.path())!, 'utf8'));
	expect(data.annotations).toEqual(backup().annotations); expect(data.study).toEqual(backup().study); expect(data.readingPositions).toEqual(backup().readingPositions);
	expect(data.learningPaths).toEqual(backup().learningPaths);
	expect(data.version).toBe(2); expect(data.chapterEdits).toEqual([]);
});

test('version 2 previews and exports chapter edits while legacy imports preserve them', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('lang', 'en'));
	await page.goto('/library/');
	const chapterEdits = [{ lang: 'en', slug: 'rag', markdown: '# My portable chapter\n\nBring my explanation.', original: '# Original chapter', updatedAt: 2000 }];
	const file = { ...backup(), version: 2, chapterEdits };
	for (const data of [file, backup()]) {
		await page.getByLabel('Choose a JSON backup').setInputFiles({ name: 'chapter-learning.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
		await expect(page.getByRole('heading', { name: 'Ready to merge' })).toBeVisible();
		await expect(page.locator('dl > div').filter({ has: page.locator('dt', { hasText: 'Edited chapters' }) }).locator('dd')).toHaveText(data.version === 2 ? '1' : '0');
		const download = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click(); await download;
		await page.getByRole('button', { name: 'Merge this backup', exact: true }).click();
		await expect(page.getByRole('status').filter({ hasText: 'Your learning has been merged.' })).toBeVisible();
		expect(await savedChapterEdits(page)).toEqual(chapterEdits);
	}
	const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download my backup', exact: true }).click();
	const exported = JSON.parse(await readFile((await (await downloadEvent).path())!, 'utf8'));
	expect(exported.version).toBe(2); expect(exported.chapterEdits).toEqual(chapterEdits);
});

test('rejects future files before mutation and restores earlier writes when storage fails', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('lang', 'en');
		const original = Storage.prototype.setItem;
		Storage.prototype.setItem = function (key, value) { if (key === 'study-v1') throw new DOMException('Quota exceeded', 'QuotaExceededError'); original.call(this, key, value); };
	});
	await page.goto('/library/');
	await expect.poll(() => page.evaluate(() => localStorage.getItem('study-migrated'))).toBe('1');
	await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
	const before = await page.evaluate(() => ({ ...localStorage }));
	await page.getByLabel('Choose a JSON backup').setInputFiles({ name: 'future.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...backup(), version: 99 })) });
	await expect(page.getByRole('alert')).toContainText('version'); expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(before);
	await page.getByLabel('Choose a JSON backup').setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup())) });
	const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click(); await download;
	await page.getByRole('button', { name: 'Merge this backup', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('could not be saved'); expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(before);
});

test('recovery download retains the original snapshot after both import and rollback fail', async ({ page }) => {
	const originalNote = { ...backup().annotations[0], id: 'local-note', note: 'Keep this original' };
	await page.addInitScript((note) => { localStorage.setItem('lang', 'en'); localStorage.setItem('annotations', JSON.stringify([note])); }, originalNote);
	await page.goto('/library/');
	await page.getByLabel('Choose a JSON backup').setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup())) });
	let downloadEvent = page.waitForEvent('download');
	await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click(); await downloadEvent;
	await page.evaluate(() => {
		const original = Storage.prototype.setItem; let failing = false;
		Storage.prototype.setItem = function (key, value) {
			if (key === 'study-v1') failing = true;
			if (failing && (key === 'study-v1' || key === 'annotations')) throw new Error('Disk unavailable');
			original.call(this, key, value);
		};
	});
	await page.getByRole('button', { name: 'Merge this backup', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('automatic recovery could not finish');
	// The failure really left a partial union, making a fresh export the wrong recovery data.
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('annotations')!).length)).toBe(2);
	await expect(page.getByRole('heading', { name: 'Ready to merge' })).not.toBeVisible();
	downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download pre-import backup', exact: true }).click();
	const recovery = JSON.parse(await readFile((await (await downloadEvent).path())!, 'utf8'));
	expect(recovery.annotations).toEqual([originalNote]); expect(recovery.study.cards).toEqual([]);
});

for (const [language, title] of [['zh', '我的书包'], ['en', 'My library'], ['ja', 'マイライブラリ']] as const) {
	test(`library remains readable on mobile with large type in ${language}`, async ({ page }) => {
		await page.addInitScript((language) => { localStorage.setItem('lang', language); localStorage.setItem('font-scales', JSON.stringify({ nav: 1.5, body: 1.5, heading: 1.5 })); }, language);
		await page.goto('/library/'); await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
		const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, main: document.querySelector('main')!.clientWidth, content: document.querySelector('main')!.scrollWidth }));
		expect(geometry.document).toBeLessThanOrEqual(geometry.viewport + 1); expect(geometry.content).toBeLessThanOrEqual(geometry.main + 1);
	});
}

for (const [language, jsonMessage, versionMessage, chapterMessage] of [
	['zh', '此文件不是有效的 JSON', '当前不支持的版本', '阅读位置或续读章节不受'],
	['ja', '有効な JSON ではありません', 'バージョンには対応していません', '読書位置、または続きから読む章']
] as const) {
	test(`invalid file, version, and unsupported reading chapter errors are localized in ${language}`, async ({ page }) => {
		await page.addInitScript((language) => localStorage.setItem('lang', language), language);
		await page.goto('/library/');
		const upload = async (content: string) => page.locator('#backup-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(content) });
		await upload('{'); await expect(page.getByRole('alert')).toContainText(jsonMessage);
		await upload(JSON.stringify({ ...backup(), version: 999 })); await expect(page.getByRole('alert')).toContainText(versionMessage);
		await upload(JSON.stringify({ ...backup(), readingChapter: { en: 'retired-chapter' } })); await expect(page.getByRole('alert')).toContainText(chapterMessage);
		expect(await page.evaluate(() => localStorage.getItem('annotations'))).toBeNull();
	});
}
