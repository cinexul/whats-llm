// @vitest-environment jsdom
import { get } from 'svelte/store';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import type { LocalChapterEdit } from './local-edits-schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { allChapters } from './manifest';

const KEY = 'chapter-edits-v1';
const SIGNAL_KEY = 'chapter-edits-updated-v1';
const edit = (patch: Record<string, unknown> = {}): LocalChapterEdit => ({
	lang: 'en', slug: 'what-is-llm', markdown: 'My explanation', original: 'Official explanation', updatedAt: 100, ...patch
});

function installLockQueue() {
	const queues = new Map<string, Promise<unknown>>();
	vi.stubGlobal('navigator', { locks: {
		request<T>(name: string, options: LockOptions, operation: () => T | Promise<T>): Promise<T> {
			if (options.mode !== 'exclusive') throw new Error('Only exclusive test locks are supported');
			const next = (queues.get(name) ?? Promise.resolve()).then(operation);
			queues.set(name, next.catch(() => undefined));
			return next;
		}
	} });
}

function deferred() {
	let resolve!: () => void;
	const promise = new Promise<void>((done) => { resolve = done; });
	return { promise, resolve };
}

async function openRawDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('whats-llm-chapter-edits', 1);
		request.onupgradeneeded = () => request.result.createObjectStore('chapters');
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function writeRawSnapshot(value: unknown): Promise<void> {
	const db = await openRawDatabase();
	try {
		await new Promise<void>((resolve, reject) => {
			const transaction = db.transaction('chapters', 'readwrite');
			transaction.oncomplete = () => resolve();
			transaction.onabort = () => reject(transaction.error);
			transaction.objectStore('chapters').put(value, 'snapshot');
		});
	} finally { db.close(); }
}

async function readRawSnapshot(): Promise<unknown> {
	const db = await openRawDatabase();
	try {
		return await new Promise((resolve, reject) => {
			const transaction = db.transaction('chapters', 'readonly');
			const request = transaction.objectStore('chapters').get('snapshot');
			transaction.oncomplete = () => resolve(request.result);
			transaction.onabort = () => reject(transaction.error);
		});
	} finally { db.close(); }
}

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
	installLockQueue();
	vi.stubGlobal('indexedDB', new IDBFactory());
});
afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('local chapter edit validation', () => {
	it('accepts active edits, empty bodies, and reset tombstones independently by language', async () => {
		const { validateLocalEdits } = await import('./local-edits-schema');
		expect(() => validateLocalEdits([edit(), edit({ lang: 'ja', markdown: '' }), edit({ lang: 'zh', markdown: null })])).not.toThrow();
	});

	it.each([
		null, {}, [null], [edit({ lang: 'fr' })], [edit({ slug: 'nonexistent' })],
		[edit({ markdown: 1 })], [edit({ original: null })], [edit({ updatedAt: Infinity })],
		[edit({ updatedAt: -1 })], [edit({ updatedAt: 1.5 })], [edit({ updatedAt: Number.MAX_VALUE })],
		[edit({ unexpected: true })], [edit(), edit({ markdown: null })]
	].map((value) => ({ value })))('rejects invalid or duplicate records: $value', async ({ value }) => {
		const { validateLocalEdits } = await import('./local-edits-schema');
		expect(() => validateLocalEdits(value)).toThrow(expect.objectContaining({ code: 'invalid-data' }));
	});

	it('rejects oversized text, record counts, and aggregate body size', async () => {
		const { validateLocalEdits } = await import('./local-edits-schema');
		for (const value of [
			[edit({ markdown: 'm'.repeat(200_001) })],
			[edit({ original: 'o'.repeat(200_001) })],
			Array.from({ length: 136 }, () => edit()),
			allChapters('en').slice(0, 6).map(({ slug }) => edit({ slug, markdown: 'm'.repeat(200_000), original: 'o'.repeat(200_000) }))
		]) expect(() => validateLocalEdits(value)).toThrow(expect.objectContaining({ code: 'too-large' }));
	});

	it('accepts the documented per-body and aggregate size boundaries', async () => {
		const { validateLocalEdits } = await import('./local-edits-schema');
		expect(() => validateLocalEdits(allChapters('en').slice(0, 5).map(({ slug }) =>
			edit({ slug, markdown: 'm'.repeat(200_000), original: 'o'.repeat(200_000) })
		))).not.toThrow();
	});
});

describe('local chapter edit persistence', () => {
	it('persists a first edit before publishing it to subscribers', async () => {
		const { saveLocalEdit, localEdits, localEditsError } = await import('./local-edits');
		let committed = false;
		const observed: boolean[] = [];
		const put = IDBObjectStore.prototype.put;
		vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
			if (Array.isArray(value) && value.length) this.transaction.addEventListener('complete', () => { committed = true; });
			return put.call(this, value, key);
		});
		const unsubscribe = localEdits.subscribe((edits) => {
			if (edits.length) observed.push(committed);
		});
		vi.spyOn(Date, 'now').mockReturnValue(500);
		await saveLocalEdit('en', 'what-is-llm', 'My explanation', 'Official explanation', null);
		expect(observed).toEqual([true]);
		expect(get(localEdits)).toEqual([edit({ updatedAt: 500 })]);
		expect(await readRawSnapshot()).toEqual(get(localEdits));
		expect(get(localEditsError)).toBeNull();
		unsubscribe();
	});

	it('preserves the initial original and advances revisions when the clock does not', async () => {
		const { saveLocalEdit, readLocalEdits } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		vi.spyOn(Date, 'now').mockReturnValue(50);
		await saveLocalEdit('en', 'what-is-llm', 'Revised explanation', 'New official body', 100);
		expect(await readLocalEdits()).toEqual([edit({ markdown: 'Revised explanation', updatedAt: 101 })]);
	});

	it('reads current storage rather than relying on a stale in-memory snapshot', async () => {
		const { loadLocalEdits, getLocalEdit, readLocalEdits } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		await loadLocalEdits();
		const imported = edit({ markdown: 'Imported content', updatedAt: 200 });
		await writeRawSnapshot([imported]);
		expect(await getLocalEdit('en', 'what-is-llm')).toEqual(imported);
		expect(await readLocalEdits()).toEqual([imported]);
	});

	it('keeps edits and resets isolated by language', async () => {
		const { saveLocalEdit, resetLocalEdit, getLocalEdit, readLocalEdits } = await import('./local-edits');
		vi.spyOn(Date, 'now').mockReturnValue(500);
		await saveLocalEdit('en', 'what-is-llm', 'English draft', 'English original', null);
		await saveLocalEdit('ja', 'what-is-llm', 'Japanese draft', 'Japanese original', null);
		await resetLocalEdit('en', 'what-is-llm', 500);
		expect(await getLocalEdit('en', 'what-is-llm')).toBeUndefined();
		expect(await getLocalEdit('ja', 'what-is-llm')).toMatchObject({ markdown: 'Japanese draft', original: 'Japanese original' });
		expect(await readLocalEdits()).toHaveLength(2);
	});

	it('keeps a reset tombstone for backup merges and raw revision checks', async () => {
		const { resetLocalEdit, getLocalEdit, getLocalEditRecord, readLocalEdits } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		vi.spyOn(Date, 'now').mockReturnValue(100);
		await resetLocalEdit('en', 'what-is-llm', 100);
		const tombstone = edit({ markdown: null, updatedAt: 101 });
		expect(await getLocalEdit('en', 'what-is-llm')).toBeUndefined();
		expect(await getLocalEditRecord('en', 'what-is-llm')).toEqual(tombstone);
		expect(await readLocalEdits()).toEqual([tombstone]);
		await resetLocalEdit('en', 'what-is-llm', 101);
		expect((await getLocalEditRecord('en', 'what-is-llm'))?.updatedAt).toBe(102);
	});

	it('rejects stale saves and resets after a different tab or import changed the record', async () => {
		const { loadLocalEdits, saveLocalEdit, resetLocalEdit, localEditsError } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		await loadLocalEdits();
		const changed = [edit({ markdown: 'Changed elsewhere', updatedAt: 200 })];
		await writeRawSnapshot(changed);
		await expect(saveLocalEdit('en', 'what-is-llm', 'Stale draft', 'Official', 100)).rejects.toThrow(expect.objectContaining({ code: 'conflict' }));
		await expect(resetLocalEdit('en', 'what-is-llm', 100)).rejects.toThrow(expect.objectContaining({ code: 'conflict' }));
		expect(await readRawSnapshot()).toEqual(changed);
		expect(get(localEditsError)).toBe('conflict');
	});

	it('requires a tombstone revision to save after reset, including a stale first-edit draft', async () => {
		const { saveLocalEdit, getLocalEdit } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit({ markdown: null, updatedAt: 200 })]));
		await expect(saveLocalEdit('en', 'what-is-llm', 'Stale draft', 'Official', null)).rejects.toThrow(expect.objectContaining({ code: 'conflict' }));
		await expect(saveLocalEdit('en', 'what-is-llm', 'Stale draft', 'Official', 100)).rejects.toThrow(expect.objectContaining({ code: 'conflict' }));
		await saveLocalEdit('en', 'what-is-llm', 'Fresh draft', 'Official', 200);
		expect((await getLocalEdit('en', 'what-is-llm'))?.markdown).toBe('Fresh draft');
	});

	it('captures a new official baseline when editing again after reset', async () => {
		const { saveLocalEdit, getLocalEdit } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit({ markdown: null, updatedAt: 200 })]));
		await saveLocalEdit('en', 'what-is-llm', 'New local explanation', 'Updated official explanation', 200);
		expect(await getLocalEdit('en', 'what-is-llm')).toMatchObject({
			markdown: 'New local explanation', original: 'Updated official explanation'
		});
	});

	it('treats reset of a chapter without any edit as a no-op', async () => {
		const { resetLocalEdit, readLocalEdits } = await import('./local-edits');
		await resetLocalEdit('en', 'what-is-llm', null);
		expect(await readLocalEdits()).toEqual([]);
		expect(localStorage.getItem(KEY)).toBeNull();
	});

	it('preserves saved storage and the published edit when an IndexedDB write fails', async () => {
		const { loadLocalEdits, saveLocalEdit, localEdits, localEditsError } = await import('./local-edits');
		const stored = JSON.stringify([edit()]);
		localStorage.setItem(KEY, stored);
		await loadLocalEdits();
		vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(() => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); });
		await expect(saveLocalEdit('en', 'what-is-llm', 'Unsaved draft', 'Official', 100)).rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		expect(localStorage.getItem(KEY)).toBe(stored);
		expect(await readRawSnapshot()).toEqual([edit()]);
		expect(get(localEdits)).toEqual([edit()]);
		expect(get(localEditsError)).toBe('storage');
	});

	it('never overwrites invalid persisted data and keeps the last valid store on load failure', async () => {
		const { loadLocalEdits, readLocalEdits, getLocalEdit, saveLocalEdit, localEdits, localEditsError } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		await loadLocalEdits();
		await writeRawSnapshot([null]);
		await expect(loadLocalEdits()).resolves.toBeUndefined();
		expect(get(localEdits)).toEqual([edit()]);
		expect(get(localEditsError)).toBe('invalid-data');
		for (const read of [readLocalEdits, () => getLocalEdit('en', 'what-is-llm')]) {
			await expect(read()).rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		}
		await expect(saveLocalEdit('en', 'what-is-llm', 'Draft', 'Official', 100)).rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		expect(await readRawSnapshot()).toEqual([null]);
		await writeRawSnapshot([]);
		await loadLocalEdits();
		expect(get(localEdits)).toEqual([]);
		expect(get(localEditsError)).toBeNull();
	});

	it('reports unavailable storage without publishing or fabricating a saved edit', async () => {
		const { loadLocalEdits, readLocalEdits, saveLocalEdit, localEdits, localEditsError } = await import('./local-edits');
		vi.spyOn(indexedDB, 'open').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
		await loadLocalEdits();
		expect(get(localEditsError)).toBe('storage');
		await expect(readLocalEdits()).rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		await expect(saveLocalEdit('en', 'what-is-llm', 'Draft', 'Official', null)).rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		expect(get(localEdits)).toEqual([]);
	});

	it('rejects timestamp overflow without changing a record', async () => {
		const { saveLocalEdit } = await import('./local-edits');
		const stored = JSON.stringify([edit({ updatedAt: 8_640_000_000_000_000 })]);
		localStorage.setItem(KEY, stored);
		await expect(saveLocalEdit('en', 'what-is-llm', 'Draft', 'Official', 8_640_000_000_000_000)).rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		expect(localStorage.getItem(KEY)).toBe(stored);
	});
});

describe('cross-tab local chapter edit locks', () => {
	it('waits for an import transaction before reading storage and keeps both chapter changes', async () => {
		const { withLocalEditLock, writeLocalEditsSnapshot, saveLocalEdit, readLocalEdits } = await import('./local-edits');
		const entered = deferred();
		const finishImport = deferred();
		const incoming = edit({ lang: 'ja', markdown: 'Imported Japanese draft' });
		const importing = withLocalEditLock(async () => {
			const snapshot = await readLocalEdits();
			entered.resolve();
			await finishImport.promise;
			await writeLocalEditsSnapshot([...snapshot, incoming]);
		});
		await entered.promise;
		const saving = saveLocalEdit('en', 'what-is-llm', 'Concurrent English draft', 'English original', null);
		await Promise.resolve();
		expect(await readLocalEdits()).toEqual([]);
		finishImport.resolve();
		await Promise.all([importing, saving]);
		expect(await readLocalEdits()).toEqual([incoming, expect.objectContaining({ lang: 'en', markdown: 'Concurrent English draft' })]);
	});

	it.each(['save', 'reset'] as const)('rechecks a queued %s revision after a competing write commits', async (action) => {
		const { withLocalEditLock, writeLocalEditsSnapshot, saveLocalEdit, resetLocalEdit, readLocalEdits } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		const entered = deferred();
		const finishImport = deferred();
		const incoming = edit({ markdown: 'Newer imported draft', updatedAt: 200 });
		const importing = withLocalEditLock(async () => {
			entered.resolve();
			await finishImport.promise;
			await writeLocalEditsSnapshot([incoming]);
		});
		await entered.promise;
		const changing = action === 'save'
			? saveLocalEdit('en', 'what-is-llm', 'Stale draft', 'Official', 100)
			: resetLocalEdit('en', 'what-is-llm', 100);
		const rejected = expect(changing).rejects.toThrow(expect.objectContaining({ code: 'conflict' }));
		finishImport.resolve();
		await Promise.all([importing, rejected]);
		expect(await readLocalEdits()).toEqual([incoming]);
	});

	it('serializes simultaneous saves to the same chapter and rejects the stale draft', async () => {
		const { saveLocalEdit, readLocalEdits } = await import('./local-edits');
		const results = await Promise.allSettled([
			saveLocalEdit('en', 'what-is-llm', 'First draft', 'Official', null),
			saveLocalEdit('en', 'what-is-llm', 'Second draft', 'Official', null)
		]);
		expect(results).toEqual([
			{ status: 'fulfilled', value: undefined },
			{ status: 'rejected', reason: expect.objectContaining({ code: 'conflict' }) }
		]);
		expect(await readLocalEdits()).toEqual([expect.objectContaining({ markdown: 'First draft' })]);
	});

	it('preserves transaction results and error types and releases the lock after a failed operation', async () => {
		const { withLocalEditLock, saveLocalEdit, readLocalEdits } = await import('./local-edits');
		const failure = new Error('Backup transaction rolled back');
		await expect(withLocalEditLock(() => { throw failure; })).rejects.toBe(failure);
		await expect(withLocalEditLock(() => 'transaction result')).resolves.toBe('transaction result');
		await saveLocalEdit('en', 'what-is-llm', 'Draft after rollback', 'Official', null);
		expect(await readLocalEdits()).toEqual([expect.objectContaining({ markdown: 'Draft after rollback' })]);
	});

	it('rejects writes when Web Locks are unsupported without changing storage or the store', async () => {
		const { saveLocalEdit, resetLocalEdit, loadLocalEdits, localEdits, localEditsError } = await import('./local-edits');
		const stored = JSON.stringify([edit()]);
		localStorage.setItem(KEY, stored);
		await loadLocalEdits();
		vi.stubGlobal('navigator', {});
		await expect(saveLocalEdit('en', 'what-is-llm', 'Unsaved draft', 'Official', 100)).rejects.toThrow(expect.objectContaining({ code: 'unsupported' }));
		await expect(resetLocalEdit('en', 'what-is-llm', 100)).rejects.toThrow(expect.objectContaining({ code: 'unsupported' }));
		expect(localStorage.getItem(KEY)).toBe(stored);
		expect(get(localEdits)).toEqual([edit()]);
		expect(get(localEditsError)).toBe('unsupported');
	});

	it('reports a rejected lock request without writing the draft', async () => {
		const { saveLocalEdit, localEditsError } = await import('./local-edits');
		vi.stubGlobal('navigator', { locks: { request: () => Promise.reject(new DOMException('Blocked', 'SecurityError')) } });
		await expect(saveLocalEdit('en', 'what-is-llm', 'Unsaved draft', 'Official', null)).rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		expect(localStorage.getItem(KEY)).toBeNull();
		expect(get(localEditsError)).toBe('storage');
	});
});

describe('authoritative IndexedDB snapshots', () => {
	it('migrates a valid legacy snapshot once and keeps the legacy archive unchanged', async () => {
		const { readLocalEdits, saveLocalEdit } = await import('./local-edits');
		const legacy = JSON.stringify([edit()]);
		localStorage.setItem(KEY, legacy);
		expect(await readLocalEdits()).toEqual([edit()]);
		expect(await readRawSnapshot()).toEqual([edit()]);
		await saveLocalEdit('en', 'what-is-llm', 'Newer draft', 'Official', 100);
		expect(localStorage.getItem(KEY)).toBe(legacy);
		localStorage.setItem(KEY, 'corrupt stale legacy cache');
		expect(await readLocalEdits()).toEqual([expect.objectContaining({ markdown: 'Newer draft' })]);
	});

	it('preserves a previous tab save when the next lock holder has a stale empty localStorage cache', async () => {
		const firstTab = await import('./local-edits');
		await firstTab.saveLocalEdit('en', 'what-is-llm', 'First tab draft', 'Official', null);
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
		vi.resetModules();
		const secondTab = await import('./local-edits');
		await secondTab.saveLocalEdit('ja', 'what-is-llm', 'Second tab draft', 'Official', null);
		expect(await secondTab.readLocalEdits()).toEqual([
			expect.objectContaining({ lang: 'en', markdown: 'First tab draft' }),
			expect.objectContaining({ lang: 'ja', markdown: 'Second tab draft' })
		]);
	});

	it('serializes initial migration and never replaces the first committed snapshot with later legacy data', async () => {
		const { readLocalEdits } = await import('./local-edits');
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		expect(await Promise.all([readLocalEdits(), readLocalEdits()])).toEqual([[edit()], [edit()]]);
		localStorage.setItem(KEY, JSON.stringify([edit({ lang: 'ja', markdown: 'Stale tab data' })]));
		expect(await readLocalEdits()).toEqual([edit()]);
	});

	it('stores an empty migration marker so legacy data cannot reappear later', async () => {
		const { readLocalEdits } = await import('./local-edits');
		expect(await readLocalEdits()).toEqual([]);
		expect(await readRawSnapshot()).toEqual([]);
		localStorage.setItem(KEY, JSON.stringify([edit()]));
		expect(await readLocalEdits()).toEqual([]);
	});

	it('rejects invalid legacy data without initializing or overwriting either source', async () => {
		const { readLocalEdits, saveLocalEdit } = await import('./local-edits');
		localStorage.setItem(KEY, '{bad json');
		await expect(readLocalEdits()).rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		await expect(saveLocalEdit('en', 'what-is-llm', 'Draft', 'Official', null)).rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		expect(localStorage.getItem(KEY)).toBe('{bad json');
		expect(await readRawSnapshot()).toBeUndefined();
	});

	it('rejects unavailable legacy storage before migration rather than discarding possible edits', async () => {
		const { readLocalEdits } = await import('./local-edits');
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
		await expect(readLocalEdits()).rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		expect(await readRawSnapshot()).toBeUndefined();
	});

	it('rejects invalid snapshot imports without changing existing storage', async () => {
		const { writeLocalEditsSnapshot, withLocalEditLock } = await import('./local-edits');
		await writeRawSnapshot([edit()]);
		await expect(withLocalEditLock(() => writeLocalEditsSnapshot([edit({ slug: 'unknown' })])))
			.rejects.toThrow(expect.objectContaining({ code: 'invalid-data' }));
		expect(await readRawSnapshot()).toEqual([edit()]);
	});

	it('does not publish a successful put request if its transaction later aborts', async () => {
		const { loadLocalEdits, saveLocalEdit, localEdits, localEditsError } = await import('./local-edits');
		await writeRawSnapshot([edit()]);
		await loadLocalEdits();
		const put = IDBObjectStore.prototype.put;
		vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
			const request = put.call(this, value, key);
			request.addEventListener('success', () => this.transaction.abort());
			return request;
		});
		await expect(saveLocalEdit('en', 'what-is-llm', 'Uncommitted draft', 'Official', 100))
			.rejects.toThrow(expect.objectContaining({ code: 'storage' }));
		expect(await readRawSnapshot()).toEqual([edit()]);
		expect(get(localEdits)).toEqual([edit()]);
		expect(get(localEditsError)).toBe('storage');
		expect(localStorage.getItem(SIGNAL_KEY)).toBeNull();
	});

	it('broadcasts a fresh signal after each successful snapshot without rewriting legacy bodies', async () => {
		const { saveLocalEdit, resetLocalEdit, getLocalEditRecord, LOCAL_EDITS_SIGNAL_KEY } = await import('./local-edits');
		expect(LOCAL_EDITS_SIGNAL_KEY).toBe(SIGNAL_KEY);
		await saveLocalEdit('en', 'what-is-llm', 'Draft', 'Official', null);
		const firstSignal = localStorage.getItem(SIGNAL_KEY);
		expect(firstSignal).toBeTruthy();
		const revision = (await getLocalEditRecord('en', 'what-is-llm'))!.updatedAt;
		await resetLocalEdit('en', 'what-is-llm', revision);
		expect(localStorage.getItem(SIGNAL_KEY)).not.toBe(firstSignal);
		expect(localStorage.getItem(KEY)).toBeNull();
	});

	it('keeps a committed snapshot successful when the cross-window signal cannot be written', async () => {
		const { saveLocalEdit, readLocalEdits, localEdits, localEditsError } = await import('./local-edits');
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); });
		await expect(saveLocalEdit('en', 'what-is-llm', 'Committed draft', 'Official', null)).resolves.toBeUndefined();
		expect(await readLocalEdits()).toEqual([expect.objectContaining({ markdown: 'Committed draft' })]);
		expect(get(localEdits)).toEqual(await readRawSnapshot());
		expect(get(localEditsError)).toBeNull();
	});
});
