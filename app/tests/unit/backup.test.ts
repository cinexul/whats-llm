// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { IDBFactory, IDBObjectStore as FakeIDBObjectStore } from 'fake-indexeddb';
import { BACKUP_FORMAT, BACKUP_VERSION, backupCounts, parseBackup, validateBackup, serializeBackup, type LearningBackup } from '$lib/backup-schema';
import type { StudyCard } from '$lib/study';
import { LOCAL_EDITS_SIGNAL_KEY } from '$lib/local-edits-schema';
const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@tauri-apps/api/core', () => ({ invoke }));
const card = (patch: Partial<StudyCard> = {}): StudyCard => ({ id: 'en:rag:retired-q1', lang: 'en', slug: 'rag', qn: 1, qhash: 'retired-q1', stability: 3, difficulty: 5, state: 2, due: 3000, lastReview: 1000, reps: 2, lapses: 0, ...patch });
function sample(): LearningBackup {
	return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: '2026-10-22T00:00:00.000Z',
		annotations: [{ id: 'note-one', chapter: 'rag', lang: 'en', exact: 'evidence', prefix: '', suffix: '', color: 'yellow', note: 'My own words', createdAt: '2026-10-20T00:00:00.000Z' }],
		chapterEdits: [{ lang: 'en', slug: 'rag', markdown: '# My retrieval notes\n\nCheck the evidence.', original: '# Retrieval\n\nOriginal source.', updatedAt: 1000 }],
		study: { cards: [card()], reviews: [{ cardId: card().id, ts: 1000, rating: 3, elapsedMs: 300, scheduledDays: 3, stability: 3, difficulty: 5 }], read: [{ lang: 'en', slug: 'rag', ts: 1000 }], kv: { retention: '0.9' } },
		readingChapter: { en: 'rag' }, readingPositions: { en: { rag: { anchor: 'evidence', offset: 0.3, progress: 0.5, updatedAt: 1000 } } },
		learningPaths: { 'first-project': ['project-plan', 'project-review'] }, preferences: { lang: 'en', theme: 'dark', fontScales: { nav: 1, heading: 1.2, body: 1.5 } } };
}
function legacySample(): LearningBackup {
	const { chapterEdits: _edits, ...backup } = sample();
	return { ...backup, version: 1 };
}
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
async function storedEdits() { return (await import('$lib/local-edits')).readLocalEdits(); }
const learningStorage = () => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key !== LOCAL_EDITS_SIGNAL_KEY));
function deferred<T = void>() {
	let resolve!: (value: T | PromiseLike<T>) => void;
	let reject!: (reason: unknown) => void;
	const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
	return { promise, resolve, reject };
}
function mockLocks() {
	const queues = new Map<string, Promise<unknown>>();
	const request = vi.fn((name: string, options: LockOptions | LockGrantedCallback<unknown>, callback?: LockGrantedCallback<unknown>) => {
		const operation = typeof options === 'function' ? options : callback!;
		const running = (queues.get(name) ?? Promise.resolve()).then(() => operation({ name, mode: 'exclusive' } as Lock));
		queues.set(name, running.then(() => undefined, () => undefined));
		return running;
	});
	vi.stubGlobal('navigator', { locks: { request } });
	return request;
}
beforeEach(() => { vi.resetModules(); invoke.mockReset(); localStorage.clear(); mockLocks(); vi.stubGlobal('indexedDB', new IDBFactory()); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('portable backup validation', () => {
	it('round trips every section, including retired cards and native review snapshots', () => { const b = sample(); expect(parseBackup(JSON.stringify(b))).toEqual(b); });
	it('accepts legacy version 1 files without chapter edits', () => { const b = legacySample(); expect(parseBackup(JSON.stringify(b))).toEqual(b); });
	it('counts active chapter edits while retaining resets in the backup', () => {
		const b = sample(); expect(backupCounts(b).chapterEdits).toBe(1);
		b.chapterEdits![0].markdown = null;
		expect(backupCounts(b).chapterEdits).toBe(0); expect(parseBackup(JSON.stringify(b)).chapterEdits).toEqual(b.chapterEdits);
		expect(backupCounts(legacySample()).chapterEdits).toBe(0);
	});
	it.each([
		['future version', (b: any) => { b.version = 999; }],
		['missing chapter edits in version 2', (b: any) => { b.version = 2; delete b.chapterEdits; }],
		['duplicate chapter edits', (b: any) => { b.chapterEdits.push(clone(b.chapterEdits[0])); }],
		['unknown chapter edit field', (b: any) => { b.chapterEdits[0].unrecognized = true; }],
		['unsupported edited chapter', (b: any) => { b.chapterEdits[0].slug = 'retired-chapter'; }],
		['invalid chapter edit language', (b: any) => { b.chapterEdits[0].lang = 'fr'; }],
		['invalid chapter source', (b: any) => { b.chapterEdits[0].original = null; }],
		['invalid chapter Markdown', (b: any) => { b.chapterEdits[0].markdown = 123; }],
		['oversized chapter source', (b: any) => { b.chapterEdits[0].original = 'x'.repeat(200_001); }],
		['fractional chapter edit timestamp', (b: any) => { b.chapterEdits[0].updatedAt = 0.1; }],
		['missing section', (b: any) => { delete b.learningPaths; }],
		['unknown field', (b: any) => { b.unrecognized = true; }],
		['invalid language', (b: any) => { b.study.cards[0].lang = 'fr'; }],
		['inconsistent card ID', (b: any) => { b.study.cards[0].id = 'en:rag:other'; }],
		['orphan history', (b: any) => { b.study.reviews[0].cardId = 'en:rag:missing'; }],
		['duplicate card', (b: any) => { b.study.cards.push(clone(b.study.cards[0])); }],
		['negative scheduling value', (b: any) => { b.study.cards[0].reps = -1; }],
		['fractional timestamp', (b: any) => { b.study.reviews[0].ts = 0.1; }],
		['unsafe integer', (b: any) => { b.study.cards[0].due = Number.MAX_SAFE_INTEGER + 1; }],
		['infinite number', (b: any) => { b.study.cards[0].stability = Infinity; }],
		['out-of-bounds position', (b: any) => { b.readingPositions.en.rag.offset = 2; }],
		['invalid preference', (b: any) => { b.preferences.fontScales.body = 10; }],
		['unsupported resume chapter', (b: any) => { b.readingChapter.en = 'retired-chapter'; }],
		['unsupported position chapter', (b: any) => { b.readingPositions.en['retired-chapter'] = b.readingPositions.en.rag; }],
		['unknown path checkpoint', (b: any) => { b.learningPaths['first-project'] = ['made-up']; }],
		['checkpoint from another path', (b: any) => { b.learningPaths['first-project'] = ['orientation-context']; }],
		['invalid creation date', (b: any) => { b.annotations[0].createdAt = 'not a date'; }],
		['too much text', (b: any) => { b.annotations[0].note = 'x'.repeat(100_001); }],
		['dangerous map key', (b: any) => { b.learningPaths = JSON.parse('{"__proto__":["x"]}'); }]
	])('rejects %s before any write', (_label, mutate) => {
		const b = sample(); mutate(b); const write = vi.spyOn(Storage.prototype, 'setItem'); expect(() => validateBackup(b)).toThrow(/Invalid backup/); expect(write).not.toHaveBeenCalled();
	});
	it('refuses to create exports larger than the importer accepts', () => {
		const b = sample(); const note = 'x'.repeat(100_000);
		b.annotations = Array.from({ length: 336 }, (_, i) => ({ ...b.annotations[0], id: `note-${i}`, note }));
		expect(() => serializeBackup(b)).toThrow(/32 MB/);
	});
	it('rejects invalid JSON and oversized files', () => { expect(() => parseBackup('{')).toThrow(/unreadable JSON/); expect(() => parseBackup(' '.repeat(32 * 1024 * 1024 + 1))).toThrow(/32 MB/); });
});
describe('deterministic merge', () => {
	it('merges chapter edits by language and chapter, keeps timestamp ties local, and is idempotent', async () => {
		const { mergeBackups } = await import('$lib/backup'); const local = sample(); const remote = sample();
		remote.chapterEdits![0].markdown = '# Newer edit'; remote.chapterEdits![0].updatedAt = 2000;
		remote.chapterEdits!.push({ ...remote.chapterEdits![0], lang: 'zh', markdown: '# 中文笔记' });
		const result = mergeBackups(local, remote);
		expect(result.data.chapterEdits).toEqual(remote.chapterEdits); expect(result.conflicts).toBe(1);
		expect(mergeBackups(result.data, remote).data).toEqual(result.data);
		const tied = clone(result.data); tied.chapterEdits![0].markdown = '# Equal time, different edit';
		const tie = mergeBackups(result.data, tied); expect(tie.ties).toBe(1); expect(tie.data.chapterEdits).toEqual(result.data.chapterEdits);
	});
	it('keeps newer resets so an older backup cannot resurrect a custom chapter', async () => {
		const { mergeBackups } = await import('$lib/backup'); const local = sample(); const remote = sample();
		local.chapterEdits![0].markdown = null; local.chapterEdits![0].updatedAt = 2000;
		const result = mergeBackups(local, remote); expect(result.data.chapterEdits).toEqual(local.chapterEdits);
		expect(mergeBackups(result.data, remote).data).toEqual(result.data);
		expect(mergeBackups(remote, local).data.chapterEdits).toEqual(local.chapterEdits);
		remote.chapterEdits![0].updatedAt = 3000;
		expect(mergeBackups(local, remote).data.chapterEdits).toEqual(remote.chapterEdits);
	});
	it('upgrades legacy merges to version 2 without dropping existing edits or resets', async () => {
		const { mergeBackups } = await import('$lib/backup'); const local = sample(); const legacy = legacySample();
		local.chapterEdits![0].markdown = null;
		const result = mergeBackups(local, legacy).data;
		expect(result.version).toBe(2); expect(result.chapterEdits).toEqual(local.chapterEdits);
		expect(mergeBackups(legacy, sample()).data.chapterEdits).toEqual(sample().chapterEdits);
		expect(mergeBackups(legacy, legacy).data.chapterEdits).toEqual([]);
	});
	it('keeps newer records, preserves unrelated data, and unions checkpoints and reviews', async () => {
		const { mergeBackups } = await import('$lib/backup'); const local = sample(); const remote = sample();
		local.annotations[0].updatedAt = '2026-10-22T00:00:00.000Z'; local.annotations[0].note = 'new local note'; remote.study.cards[0].lastReview = 2000; remote.study.cards[0].reps = 3;
		remote.study.reviews.push({ ...remote.study.reviews[0], ts: 2000 }); remote.readingPositions.en!.rag.updatedAt = 2000; remote.readingPositions.en!.rag.progress = .8;
		remote.learningPaths['first-project'] = ['project-plan', 'project-build']; remote.preferences.theme = 'light';
		const { data, conflicts } = mergeBackups(local, remote);
		expect(data.annotations[0].note).toBe('new local note'); expect(data.study.cards[0].lastReview).toBe(2000); expect(data.study.reviews).toHaveLength(2); expect(data.readingPositions.en!.rag.progress).toBe(.8);
		expect(data.learningPaths['first-project']).toEqual(['project-build', 'project-plan', 'project-review']); expect(data.preferences.theme).toBe('dark'); expect(conflicts).toBe(3); expect(mergeBackups(data, remote).data).toEqual(data);
	});
	it('retains local values on equal timestamps and preserves identical real review events', async () => {
		const { mergeBackups } = await import('$lib/backup'); const local = sample(); const remote = sample(); remote.annotations[0].note = 'conflicting note'; remote.study.reviews.push(clone(remote.study.reviews[0]));
		const result = mergeBackups(local, remote); expect(result.ties).toBe(1); expect(result.data.annotations).toEqual(local.annotations); expect(result.data.study.reviews).toHaveLength(2); expect(mergeBackups(result.data, remote).data.study.reviews).toHaveLength(2);
	});
});
describe('browser persistence', () => {
	it('waits for the shared chapter-edit lock before taking its recovery snapshot', async () => {
		const entered = deferred(); const release = deferred();
		const edits = [{ ...sample().chapterEdits![0], markdown: '# Saved by another tab', updatedAt: 2000 }];
		const { writeLocalEditsSnapshot } = await import('$lib/local-edits');
		const holder = navigator.locks.request('whats-llm-chapter-edits', async () => {
			entered.resolve(); await release.promise;
			await writeLocalEditsSnapshot(edits);
		});
		await entered.promise;
		const { importBackup } = await import('$lib/backup');
		const pending = importBackup(legacySample());
		try {
			expect(navigator.locks.request).toHaveBeenCalledTimes(2);
			await expect(importBackup(sample())).rejects.toThrow('already in progress');
			expect(localStorage.length).toBe(0);
		} finally { release.resolve(); await holder; }
		const result = await pending;
		expect(result.backup.chapterEdits).toEqual(edits);
		expect(await storedEdits()).toEqual(edits);
	});
	it('rejects import without Web Locks before reading or writing and allows a later retry', async () => {
		vi.stubGlobal('navigator', {});
		const { importBackup } = await import('$lib/backup'); const read = vi.spyOn(Storage.prototype, 'getItem');
		await expect(importBackup(sample())).rejects.toMatchObject({ code: 'unsupported-lock' });
		expect(read).not.toHaveBeenCalled(); expect(localStorage.length).toBe(0);
		mockLocks(); await importBackup(sample());
		expect(await storedEdits()).toEqual(sample().chapterEdits);
	});
	it('imports legacy backups without losing local chapter edits and exports version 2', async () => {
		localStorage.setItem('chapter-edits-v1', JSON.stringify(sample().chapterEdits));
		const { importBackup, exportBackup } = await import('$lib/backup'); await importBackup(legacySample());
		// A delayed localStorage view cannot replace the authoritative migrated snapshot.
		localStorage.setItem('chapter-edits-v1', '[]');
		const exported = await exportBackup(); expect(exported.version).toBe(2); expect(exported.chapterEdits).toEqual(sample().chapterEdits);
	});
	it('imports and exports a complete snapshot and importing twice adds nothing', async () => {
		const { importBackup, exportBackup } = await import('$lib/backup'); const b = sample(); await importBackup(b); const exported = await exportBackup(); b.learningPaths['first-project'].sort();
		expect({ ...exported, exportedAt: b.exportedAt }).toEqual(b); await importBackup(b); expect((await exportBackup()).study).toEqual(b.study); expect(JSON.parse(localStorage.getItem('study-v1')!).cards[card().id]).toEqual(card());
	});
	it('refreshes chapter edits before notifying readers that an import completed', async () => {
		const { localEdits } = await import('$lib/local-edits'); const { importBackup } = await import('$lib/backup');
		let observed: unknown;
		window.addEventListener('learning-data-imported', () => { observed = get(localEdits); }, { once: true });
		await importBackup(sample()); expect(observed).toEqual(sample().chapterEdits);
	});
	it.each(['add', 'edit', 'delete'] as const)('exports the latest visible %s when annotation persistence fails', async (change) => {
		const b = sample(); const stored = change === 'add' ? [] : b.annotations;
		localStorage.setItem('annotations', JSON.stringify(stored));
		const notes = await import('$lib/annotations');
		if (change !== 'add') await notes.ensureLoaded();
		const original = Storage.prototype.setItem;
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
			if (key === 'annotations') throw new Error('Quota exceeded'); original.call(this, key, value);
		});
		if (change === 'add') notes.addAnnotation(b.annotations[0]);
		else if (change === 'edit') notes.updateAnnotation(b.annotations[0].id, { note: 'Visible unsaved edit' });
		else notes.removeAnnotation(b.annotations[0].id);
		const { exportBackup, importBackup, ImportError } = await import('$lib/backup');
		const exported = await exportBackup();
		if (change === 'add') expect(exported.annotations).toEqual(b.annotations);
		else if (change === 'edit') expect(exported.annotations[0].note).toBe('Visible unsaved edit');
		else expect(exported.annotations).toEqual([]);
		// The original storage remains stale, so only the edited snapshot can be correct.
		expect(JSON.parse(localStorage.getItem('annotations')!)).toEqual(stored);
		const incoming = sample(); incoming.annotations[0].id = 'new-other';
		try { await importBackup(incoming); expect.fail('must reject on blocked writes'); } catch (e) {
			expect(e).toBeInstanceOf(ImportError); expect((e as InstanceType<typeof ImportError>).recovery.annotations).toEqual(exported.annotations);
		}
	});
	it('rolls earlier writes back if a later localStorage key exceeds quota', async () => {
		const { importBackup } = await import('$lib/backup'); localStorage.setItem('theme', 'light'); localStorage.setItem('unrelated', 'keep');
		localStorage.setItem('chapter-edits-v1', JSON.stringify([{ ...sample().chapterEdits![0], markdown: '# Keep my edit', updatedAt: 500 }]));
		const before = { ...localStorage }; const original = Storage.prototype.setItem;
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) { if (key === 'study-v1') throw new DOMException('Quota exceeded', 'QuotaExceededError'); original.call(this, key, value); });
		await expect(importBackup(sample())).rejects.toThrow('Quota exceeded'); expect({ ...localStorage }).toEqual(before);
	});
	it.each([false, true])('restores prior writes when IndexedDB rejects chapter edits (native: %s)', async (nativeMode) => {
		if (nativeMode) {
			vi.stubGlobal('__TAURI_INTERNALS__', {});
			invoke.mockImplementation(async (command: string) => {
				if (command === 'load_annotations') return '[]';
				if (command === 'study_export_snapshot') return { cards: [], reviews: [], read: [], kv: {} };
				return [];
			});
		}
		const stored = [{ ...sample().chapterEdits![0], markdown: '# Preserve this edit', updatedAt: 500 }];
		localStorage.setItem('chapter-edits-v1', JSON.stringify(stored)); await storedEdits(); const before = { ...localStorage };
		const { importBackup, ImportError } = await import('$lib/backup');
		vi.spyOn(FakeIDBObjectStore.prototype, 'put').mockImplementation(() => { throw new Error('Chapter storage full'); });
		await expect(importBackup(sample())).rejects.toBeInstanceOf(ImportError);
		expect({ ...localStorage }).toEqual(before); expect(await storedEdits()).toEqual(stored);
		expect(invoke.mock.calls.some(([command]) => command === 'save_annotations' || command === 'study_import_snapshot')).toBe(false);
	});
	it('rejects corrupted local chapter edits instead of silently dropping them from exports', async () => {
		localStorage.setItem('chapter-edits-v1', JSON.stringify([{ ...sample().chapterEdits![0], original: null }]));
		const { exportBackup } = await import('$lib/backup'); await expect(exportBackup()).rejects.toMatchObject({ code: 'local-data' });
	});
	it('returns a recovery snapshot when a partial write and rollback both fail', async () => {
		const { importBackup, ImportError } = await import('$lib/backup'); localStorage.setItem('annotations', '[]'); const original = Storage.prototype.setItem; let fail = false;
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) { if (key === 'study-v1') fail = true; if (fail) throw new Error('Storage unavailable'); original.call(this, key, value); });
		try { await importBackup(sample()); expect.fail('must reject'); } catch (e) { expect(e).toBeInstanceOf(ImportError); expect((e as InstanceType<typeof ImportError>).recovery.annotations).toEqual([]); expect((e as Error).message).toMatch(/recovery is required/); }
	});
	it('does not mutate for a corrupt import or silently omit corrupt local records', async () => {
		const { importBackup, exportBackup } = await import('$lib/backup'); const bad = sample(); bad.study.cards[0].id = 'bad'; await expect(importBackup(bad)).rejects.toThrow(/integrity/); expect(localStorage.length).toBe(0);
		localStorage.setItem('annotations', '[null]'); await expect(exportBackup()).rejects.toThrow(/annotation/);
	});
});
describe('native orchestration', () => {
	it('holds the shared lock until native failure rollback finishes before allowing another edit', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		const original = sample(); const incoming = sample(); incoming.chapterEdits![0].markdown = '# Incoming edit'; incoming.chapterEdits![0].updatedAt = 2000;
		localStorage.setItem('chapter-edits-v1', JSON.stringify(original.chapterEdits));
		const transactionStarted = deferred(); const failTransaction = deferred(); const rollbackStarted = deferred(); const finishRollback = deferred();
		let writes = 0;
		invoke.mockImplementation(async (command: string) => {
			if (command === 'load_annotations') return JSON.stringify(original.annotations);
			if (command === 'study_export_snapshot') return clone(original.study);
			if (command === 'study_import_snapshot') { transactionStarted.resolve(); await failTransaction.promise; }
			if (command === 'save_annotations' && ++writes === 2) { rollbackStarted.resolve(); await finishRollback.promise; }
			return [];
		});
		const { importBackup, ImportError } = await import('$lib/backup'); const { saveLocalEdit } = await import('$lib/local-edits');
		const importing = importBackup(incoming).catch((error: unknown) => error);
		await transactionStarted.promise;
		let saveFinished = false;
		const saving = Promise.resolve(saveLocalEdit('en', 'rag', '# Saved after recovery', '# Original', 1000)).then(() => { saveFinished = true; }, (error: unknown) => error);
		failTransaction.reject(new Error('SQLite transaction failed'));
		await rollbackStarted.promise;
		try {
			expect(saveFinished).toBe(false);
			expect(await storedEdits()).toEqual(incoming.chapterEdits);
		} finally { finishRollback.resolve(); }
		const error = await importing; expect(error).toBeInstanceOf(ImportError);
		expect((error as InstanceType<typeof ImportError>).recovery.chapterEdits).toEqual(original.chapterEdits);
		expect(await saving).toBeUndefined(); expect(saveFinished).toBe(true);
		expect((await storedEdits())[0].markdown).toBe('# Saved after recovery');
	});
	it('persists chapter edits alongside a successful native import', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {});
		invoke.mockImplementation(async (command: string) => {
			if (command === 'load_annotations') return '[]';
			if (command === 'study_export_snapshot') return { cards: [], reviews: [], read: [], kv: {} };
			return [];
		});
		const { importBackup } = await import('$lib/backup'); await importBackup(sample());
		expect(await storedEdits()).toEqual(sample().chapterEdits);
		expect(invoke.mock.calls.some(([command]) => command === 'study_import_snapshot')).toBe(true);
	});
	it('uses the complete native snapshot and restores annotations/local keys on transaction failure', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {}); const original = sample(); const incoming = sample(); incoming.annotations[0].note = 'new'; incoming.annotations[0].updatedAt = '2026-10-22T01:00:00.000Z';
		let notes = JSON.stringify(original.annotations); const snapshot = clone(original.study);
		invoke.mockImplementation(async (command: string, args?: any) => { if (command === 'load_annotations') return notes; if (command === 'study_export_snapshot') return snapshot; if (command === 'save_annotations') { notes = args.data; return; } if (command === 'study_import_snapshot') throw new Error('SQLite transaction failed'); return []; });
		localStorage.setItem('theme', 'light'); localStorage.setItem('chapter-edits-v1', JSON.stringify(original.chapterEdits));
		incoming.chapterEdits![0].markdown = '# Incoming edit'; incoming.chapterEdits![0].updatedAt = 2000;
		const stored = learningStorage(); const { importBackup, exportBackup } = await import('$lib/backup'); expect((await exportBackup()).study).toEqual(original.study);
		await expect(importBackup(incoming)).rejects.toThrow(/SQLite/); expect(JSON.parse(notes)).toEqual(original.annotations); expect(snapshot).toEqual(original.study); expect(learningStorage()).toEqual(stored);
		expect(await storedEdits()).toEqual(original.chapterEdits);
	});
	it('retains the original recovery snapshot when native import and IndexedDB rollback both fail', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {}); const original = sample(); const incoming = sample();
		incoming.chapterEdits![0].markdown = '# Partially imported chapter'; incoming.chapterEdits![0].updatedAt = 2000;
		localStorage.setItem('chapter-edits-v1', JSON.stringify(original.chapterEdits)); await storedEdits();
		invoke.mockImplementation(async (command: string) => {
			if (command === 'load_annotations') return JSON.stringify(original.annotations);
			if (command === 'study_export_snapshot') return clone(original.study);
			if (command === 'study_import_snapshot') throw new Error('SQLite transaction failed');
			return [];
		});
		let writes = 0; const put = FakeIDBObjectStore.prototype.put;
		vi.spyOn(FakeIDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
			if (++writes === 2) throw new Error('Chapter recovery unavailable');
			return put.call(this, value, key);
		});
		const { importBackup, ImportError } = await import('$lib/backup');
		const error = await importBackup(incoming).catch((error: unknown) => error);
		expect(error).toBeInstanceOf(ImportError); expect((error as InstanceType<typeof ImportError>).code).toBe('recovery');
		expect((error as InstanceType<typeof ImportError>).recovery.chapterEdits).toEqual(original.chapterEdits);
		expect(await storedEdits()).toEqual(incoming.chapterEdits);
	});
	it('reports failed annotation writes without changing study or browser data', async () => {
		vi.stubGlobal('__TAURI_INTERNALS__', {}); invoke.mockImplementation(async (command: string) => { if (command === 'load_annotations') return '[]'; if (command === 'study_export_snapshot') return { cards: [], reviews: [], read: [], kv: {} }; if (command === 'save_annotations') throw new Error('Read-only disk'); });
		const { importBackup } = await import('$lib/backup'); await expect(importBackup(sample())).rejects.toThrow(/Read-only disk/); expect(learningStorage()).toEqual({}); expect(await storedEdits()).toEqual([]); expect(invoke.mock.calls.some(([cmd]) => cmd === 'study_import_snapshot')).toBe(false);
	});
});


describe('localized failure instructions', () => {
	it.each(['zh', 'en', 'ja'] as const)('explains unsupported write coordination in %s before an import starts', async (language) => {
		const { BackupError, backupErrorMessage } = await import('$lib/backup-errors');
		const message = backupErrorMessage(new BackupError('unsupported-lock', 'Missing Web Locks'), language);
		expect(message).toContain(language === 'zh' ? '尚未开始导入' : language === 'ja' ? '読み込みは開始していません' : 'Import has not started');
		expect(message).toContain('HTTPS'); expect(message).toContain('localhost'); expect(message).toContain('WebView');
	});
	it.each(['zh', 'ja'] as const)('localizes a failed rollback in %s while retaining original details', async (language) => {
		const { ImportError } = await import('$lib/backup'); const { backupErrorMessage } = await import('$lib/backup-errors');
		const error = new ImportError('Internal storage detail', sample(), { cause: new AggregateError([new Error('disk')]) });
		expect(error.code).toBe('recovery'); expect(error.message).toBe('Internal storage detail');
		expect(backupErrorMessage(error, language)).toContain(language === 'zh' ? '自动恢复未能完成' : '自動復元を完了できませんでした');
	});
});
