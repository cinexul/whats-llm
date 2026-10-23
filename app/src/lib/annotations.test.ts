// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import type { Annotation } from './annotations';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@tauri-apps/api/core', () => ({ invoke }));

function annotation(patch: Partial<Annotation> = {}): Annotation {
	return {
		id: 'one',
		chapter: 'introduction',
		exact: 'LLM',
		prefix: '',
		suffix: '',
		color: 'yellow',
		note: '',
		createdAt: '2026-10-22T00:00:00.000Z',
		...patch
	};
}

beforeEach(() => {
	vi.resetModules();
	invoke.mockReset();
	localStorage.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('loading annotations', () => {
	it('skips corrupt records while preserving valid legacy highlights and notes', async () => {
		const saved = annotation({ note: 'Keep this note' });
		localStorage.setItem(
			'annotations',
			JSON.stringify([saved, null, { ...saved, id: 'empty', exact: '' }, { ...saved, prefix: null }])
		);
		const { annotations, ensureLoaded, applyHighlights } = await import('./annotations');
		await ensureLoaded();
		expect(get(annotations)).toEqual([saved]);

		const article = document.createElement('article');
		article.textContent = 'An LLM can help.';
		applyHighlights(article, get(annotations));
		expect(article.querySelector('mark')?.title).toBe('Keep this note');
		expect(article.textContent).toBe('An LLM can help.');
	});
});

describe('annotation edit timestamps', () => {
	it('records an edit timestamp without changing the original creation date', async () => {
		const { addAnnotation, updateAnnotation, annotations } = await import('./annotations');
		const original = annotation();
		addAnnotation(original);
		const before = Date.now();
		updateAnnotation(original.id, { note: 'Revised thought' });
		const edited = get(annotations)[0];
		expect(edited.createdAt).toBe(original.createdAt);
		expect(Date.parse(edited.updatedAt!)).toBeGreaterThanOrEqual(before);
		expect(JSON.parse(localStorage.getItem('annotations')!)[0]).toEqual(edited);
	});
});

describe('language-specific highlights', () => {
	it('keeps a shared term highlighted only in the language where it was saved', async () => {
		const { annotationsForChapter, applyHighlights } = await import('./annotations');
		const saved = annotation({ lang: 'en' });
		const article = document.createElement('article');
		article.textContent = 'LLM';
		applyHighlights(article, annotationsForChapter([saved], 'introduction', 'en'));
		expect(article.querySelector('mark')?.textContent).toBe('LLM');

		applyHighlights(article, annotationsForChapter([saved], 'introduction', 'ja'));
		expect(article.querySelector('mark')).toBeNull();
		expect(article.textContent).toBe('LLM');
	});

	it('retains unscoped legacy annotations without showing annotations from other chapters', async () => {
		const { annotationsForChapter } = await import('./annotations');
		const legacy = annotation();
		const other = annotation({ id: 'other', chapter: 'tokens' });
		expect(annotationsForChapter([legacy, other], 'introduction', 'ja')).toEqual([legacy]);
	});
});

describe('native persistence', () => {
	it.each(['edit', 'delete'] as const)('recovers a failed %s from backup after restarting', async (change) => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		const saved = annotation({ note: 'Old note' });
		let writes = 0;
		invoke.mockImplementation(async (command: string) => {
			if (command === 'load_annotations') return JSON.stringify([saved]);
			writes++;
			throw new Error('Disk is read-only');
		});
		const initial = await import('./annotations');
		await initial.ensureLoaded();
		if (change === 'edit') initial.updateAnnotation(saved.id, { note: 'Latest note' });
		else initial.removeAnnotation(saved.id);
		await vi.waitFor(() => expect(writes).toBe(1));
		await vi.dynamicImportSettled();

		vi.resetModules();
		const restarted = await import('./annotations');
		await restarted.ensureLoaded();
		expect(get(restarted.annotations)).toMatchObject(change === 'edit' ? [{ ...saved, note: 'Latest note' }] : []);
	});

	it('recovers valid backup records when the disk array contains only invalid records', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		const saved = annotation({ note: 'Recover this note' });
		localStorage.setItem('annotations', JSON.stringify([saved]));
		invoke.mockResolvedValue('[null, {"exact":""}]');
		const { annotations, ensureLoaded } = await import('./annotations');
		await ensureLoaded();
		expect(get(annotations)).toEqual([saved]);
	});

	it('keeps the latest failed save recoverable when an older queued save succeeds', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		let releaseFirst!: () => void;
		const firstWrite = new Promise<void>((resolve) => { releaseFirst = resolve; });
		let disk = '[]';
		let writes = 0;
		invoke.mockImplementation(async (command: string, args?: { data: string }) => {
			if (command === 'load_annotations') return disk;
			if (++writes === 1) {
				await firstWrite;
				disk = args!.data;
			} else throw new Error('Second write failed');
		});
		const initial = await import('./annotations');
		initial.addAnnotation(annotation({ note: 'Original note' }));
		await vi.waitFor(() => expect(writes).toBe(1));
		initial.updateAnnotation('one', { note: 'Latest note' });
		releaseFirst();
		await vi.waitFor(() => expect(writes).toBe(2));
		await vi.dynamicImportSettled();

		vi.resetModules();
		const restarted = await import('./annotations');
		await restarted.ensureLoaded();
		expect(get(restarted.annotations)).toMatchObject([annotation({ note: 'Latest note' })]);
	});

	it('uses the native file again after a successful save clears pending recovery', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		let disk = '[]';
		invoke.mockImplementation(async (command: string, args?: { data: string }) => {
			if (command === 'load_annotations') return disk;
			disk = args!.data;
		});
		const initial = await import('./annotations');
		initial.addAnnotation(annotation({ note: 'Saved note' }));
		await vi.waitFor(() => expect(JSON.parse(disk)).toHaveLength(1));
		await vi.dynamicImportSettled();
		const movedFile = annotation({ note: 'Updated portable file' });
		disk = JSON.stringify([movedFile]);

		vi.resetModules();
		const restarted = await import('./annotations');
		await restarted.ensureLoaded();
		expect(get(restarted.annotations)).toEqual([movedFile]);
	});

	it('preserves the newest edit when the first disk write is delayed', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		let releaseFirst!: () => void;
		const firstWrite = new Promise<void>((resolve) => {
			releaseFirst = resolve;
		});
		let disk = '[]';
		let writes = 0;
		invoke.mockImplementation(async (_command: string, { data }: { data: string }) => {
			const write = ++writes;
			if (write === 1) await firstWrite;
			disk = data;
		});
		const { addAnnotation, updateAnnotation } = await import('./annotations');
		addAnnotation(annotation({ note: 'Original note' }));
		await vi.waitFor(() => expect(writes).toBe(1));
		updateAnnotation('one', { note: 'Latest note' });
		await vi.dynamicImportSettled();
		expect(JSON.parse(localStorage.getItem('annotations')!)[0].note).toBe('Latest note');
		releaseFirst();
		await vi.waitFor(() => expect(writes).toBe(2));
		await vi.dynamicImportSettled();
		expect(JSON.parse(disk)[0].note).toBe('Latest note');
	});

	it('continues saving after a failed disk write and retains the browser backup', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		let disk = '[]';
		let writes = 0;
		invoke.mockImplementation(async (_command: string, { data }: { data: string }) => {
			if (++writes === 1) throw new Error('Disk is temporarily unavailable');
			disk = data;
		});
		const { addAnnotation, updateAnnotation } = await import('./annotations');
		addAnnotation(annotation());
		await vi.waitFor(() => expect(writes).toBe(1));
		updateAnnotation('one', { note: 'Saved after retry' });
		await vi.waitFor(() => expect(writes).toBe(2));
		expect(JSON.parse(disk)[0].note).toBe('Saved after retry');
		expect(JSON.parse(localStorage.getItem('annotations')!)).toEqual(JSON.parse(disk));
	});
});
