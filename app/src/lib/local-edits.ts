import { writable } from 'svelte/store';
import type { Lang } from './manifest';
import {
	LOCAL_EDITS_KEY, LOCAL_EDITS_SIGNAL_KEY, LocalEditError, MAX_LOCAL_EDIT_TIMESTAMP,
	validateLocalEdits, type LocalChapterEdit
} from './local-edits-schema';

export { LOCAL_EDITS_KEY, LOCAL_EDITS_SIGNAL_KEY, LocalEditError, validateLocalEdits } from './local-edits-schema';
export type { LocalChapterEdit, LocalEditErrorCode } from './local-edits-schema';

export const localEdits = writable<LocalChapterEdit[]>([]);
/** Stable LocalEditError code for translated UI; diagnostic detail is on the thrown error. */
export const localEditsError = writable<string | null>(null);

const DATABASE = 'whats-llm-chapter-edits';
const CHAPTERS = 'chapters';
const SNAPSHOT = 'snapshot';

/**
 * One origin-wide lock covers each read/check/write transaction, including backup
 * imports. Callbacks must not call save/reset or acquire this same lock again.
 * Preserve callback errors so backup import can retain its own error contract.
 */
export async function withLocalEditLock<T>(operation: () => T | Promise<T>): Promise<T> {
	if (typeof navigator === 'undefined' || typeof navigator.locks?.request !== 'function') {
		throw new LocalEditError('unsupported', 'Saving local chapter edits requires Web Locks in a secure context');
	}
	return navigator.locks.request('whats-llm-chapter-edits', { mode: 'exclusive' }, operation);
}

function report(error: unknown): never {
	const failure = error instanceof LocalEditError
		? error
		: new LocalEditError('storage', 'Local chapter storage is unavailable', { cause: error });
	setError(failure.code);
	throw failure;
}

function setError(code: string | null): void {
	try { localEditsError.set(code); }
	catch { /* A failing UI subscriber must not change the persistence result. */ }
}

function publish(records: LocalChapterEdit[]): void {
	try { localEdits.set(records); }
	catch { /* The snapshot has already committed; a subscriber cannot undo it. */ }
	setError(null);
}

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE, 1);
		let blocked = false;
		request.onupgradeneeded = () => {
			if (!request.result.objectStoreNames.contains(CHAPTERS)) request.result.createObjectStore(CHAPTERS);
		};
		request.onblocked = () => {
			blocked = true;
			reject(new LocalEditError('storage', 'Another window is blocking local chapter storage'));
		};
		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			if (blocked) { request.result.close(); return; }
			request.result.onversionchange = () => request.result.close();
			resolve(request.result);
		};
	});
}

/** Requests may succeed before their transaction aborts. Only completion is a commit. */
async function snapshotTransaction<T>(
	operation: (store: IDBObjectStore, result: (value: T) => void, abort: (error: unknown) => void) => void
): Promise<T> {
	const db = await openDatabase();
	try {
		return await new Promise<T>((resolve, reject) => {
			const transaction = db.transaction(CHAPTERS, 'readwrite');
			let result!: T;
			let failure: unknown;
			transaction.oncomplete = () => resolve(result);
			transaction.onabort = () => reject(failure ?? transaction.error ?? new LocalEditError('storage', 'Local chapter transaction was aborted'));
			const abort = (error: unknown) => {
				failure = error;
				try { transaction.abort(); }
				catch { reject(error); }
			};
			try { operation(transaction.objectStore(CHAPTERS), (value) => { result = value; }, abort); }
			catch (error) { abort(error); }
		});
	} finally { db.close(); }
}

function readLegacyEdits(): LocalChapterEdit[] {
	const raw = localStorage.getItem(LOCAL_EDITS_KEY);
	let value: unknown = [];
	if (raw !== null) {
		try { value = JSON.parse(raw); }
		catch (cause) { throw new LocalEditError('invalid-data', 'Local chapter edits contain unreadable JSON', { cause }); }
	}
	validateLocalEdits(value);
	return value;
}

/**
 * IndexedDB is authoritative across windows. The first read migrates legacy
 * localStorage inside the same transaction that checks whether a snapshot exists.
 * Even an empty snapshot ends migration; legacy data is never consulted again.
 */
export async function readLocalEdits(): Promise<LocalChapterEdit[]> {
	try {
		const records = await snapshotTransaction<LocalChapterEdit[]>((store, result, abort) => {
			const request = store.openCursor(SNAPSHOT);
			request.onsuccess = () => {
				try {
					const cursor = request.result;
					const value: unknown = cursor ? cursor.value : readLegacyEdits();
					validateLocalEdits(value);
					if (!cursor) store.put(value, SNAPSHOT);
					result(value);
				} catch (error) { abort(error); }
			};
		});
		setError(null);
		return records;
	} catch (error) { return report(error); }
}

/** Load explicitly on mount/import/storage events. Failure retains the last valid store. */
export async function loadLocalEdits(): Promise<void> {
	try { publish(await readLocalEdits()); }
	catch { /* readLocalEdits has reported the error. Never replace damaged storage with an empty snapshot. */ }
}

/** Includes reset tombstones: use updatedAt ?? null as the token when opening an editor. */
export async function getLocalEditRecord(lang: Lang, slug: string): Promise<LocalChapterEdit | undefined> {
	return (await readLocalEdits()).find((record) => record.lang === lang && record.slug === slug);
}

/** Only active edits apply to reading. The caller can catch a failure and show the official body. */
export async function getLocalEdit(lang: Lang, slug: string): Promise<LocalChapterEdit | undefined> {
	const record = await getLocalEditRecord(lang, slug);
	return record?.markdown !== null ? record : undefined;
}

function checkRevision(current: LocalChapterEdit | undefined, expectedUpdatedAt: number | null): void {
	if ((current?.updatedAt ?? null) !== expectedUpdatedAt) {
		throw new LocalEditError('conflict', 'This chapter edit changed in another tab or backup import. Reload it before saving.');
	}
}

function nextTimestamp(current: LocalChapterEdit | undefined): number {
	const next = Math.max(Date.now(), (current?.updatedAt ?? -1) + 1);
	if (!Number.isSafeInteger(next) || next < 0 || next > MAX_LOCAL_EDIT_TIMESTAMP) {
		throw new LocalEditError('invalid-data', 'The local chapter edit timestamp cannot advance safely');
	}
	return next;
}

/**
 * The caller holds withLocalEditLock for the entire mutation/import/rollback.
 * Validate and commit atomically before publishing or notifying other windows.
 */
export async function writeLocalEditsSnapshot(records: LocalChapterEdit[]): Promise<void> {
	let snapshot: LocalChapterEdit[];
	try {
		validateLocalEdits(records);
		snapshot = records.map((record) => ({ ...record }));
		await snapshotTransaction<void>((store, result) => {
			store.put(snapshot, SNAPSHOT);
			result(undefined);
		});
	} catch (error) { return report(error); }
	// Nothing below may reject a successful commit, including blocked localStorage.
	publish(snapshot);
	try {
		const signal = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}`;
		localStorage.setItem(LOCAL_EDITS_SIGNAL_KEY, signal);
	} catch { /* Notification is best effort; IndexedDB remains authoritative. */ }
}

/**
 * expectedUpdatedAt is the raw record's revision captured when the editor opened;
 * null means no record exists, including no tombstone. Fresh storage is checked
 * inside the exclusive Web Lock immediately before writing, so other tabs and
 * backup imports cannot overwrite a competing change. Revisions increase monotonically
 * even if the clock moves backward. The first original is retained across saves;
 * a first save after reset captures the current official body as a new baseline.
 * Failures throw without publishing the attempted edit, so callers retain drafts.
 */
export async function saveLocalEdit(
	lang: Lang, slug: string, markdown: string, original: string, expectedUpdatedAt: number | null
): Promise<void> {
	try {
		await withLocalEditLock(async () => {
			const records = await readLocalEdits();
			const current = records.find((record) => record.lang === lang && record.slug === slug);
			checkRevision(current, expectedUpdatedAt);
			const next: LocalChapterEdit = {
				lang, slug, markdown,
				original: current && current.markdown !== null ? current.original : original,
				updatedAt: nextTimestamp(current)
			};
			await writeLocalEditsSnapshot([...records.filter((record) => record !== current), next]);
		});
	} catch (error) { report(error); }
}

/** A reset keeps its original and a new revision for backup merging and stale-draft detection. */
export async function resetLocalEdit(lang: Lang, slug: string, expectedUpdatedAt: number | null): Promise<void> {
	try {
		await withLocalEditLock(async () => {
			const records = await readLocalEdits();
			const current = records.find((record) => record.lang === lang && record.slug === slug);
			checkRevision(current, expectedUpdatedAt);
			if (!current) return;
			const next: LocalChapterEdit = { ...current, markdown: null, updatedAt: nextTimestamp(current) };
			await writeLocalEditsSnapshot(records.map((record) => record === current ? next : record));
		});
	} catch (error) { report(error); }
}
