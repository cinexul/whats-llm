import { writable } from 'svelte/store';
import type { Lang } from './manifest';
import {
	LOCAL_EDITS_KEY, LOCAL_EDITS_SIGNAL_KEY, LocalEditError, MAX_LOCAL_EDIT_TIMESTAMP,
	validateLocalEdits, type LocalChapterEdit
} from './local-edits-schema';

export { LOCAL_EDITS_KEY, LOCAL_EDITS_SIGNAL_KEY, LocalEditError, validateLocalEdits } from './local-edits-schema';
export type { LocalChapterEdit, LocalEditErrorCode } from './local-edits-schema';

export const localEdits = writable<LocalChapterEdit[]>([]);
/** 为多语言UI提供固定的LocalEditError错误码；详细原因在抛出的异常中。 */
export const localEditsError = writable<string | null>(null);

const DATABASE = 'whats-llm-chapter-edits';
const CHAPTERS = 'chapters';
const SNAPSHOT = 'snapshot';

/**
 * 用同源下共用的一把锁保护整个读取、校验和写入过程，包括备份导入。
 * 回调不能调用保存、重置，也不能再次获取这把锁。
 * 原样保留回调抛出的错误，不改变备份导入的错误处理约定。
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
	catch { /* UI订阅者报错不能改变保存结果。 */ }
}

function publish(records: LocalChapterEdit[]): void {
	try { localEdits.set(records); }
	catch { /* 快照已提交，订阅者无法撤销。 */ }
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

/** 单个请求成功后，其所属事务仍可能中止；只有事务完成才算提交。 */
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
 * 各窗口统一以IndexedDB为准。首次读取在同一事务中检查快照，
 * 需要时迁移旧localStorage数据。
 * 即使快照为空，也不再迁移或读取旧数据。
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

/** 在挂载、导入或存储事件中主动加载；失败时保留上次有效的store状态。 */
export async function loadLocalEdits(): Promise<void> {
	try { publish(await readLocalEdits()); }
	catch { /* readLocalEdits已报告错误，绝不能用空快照覆盖损坏的存储。 */ }
}

/** 包含重置删除标记；打开编辑器时以updatedAt ?? null作为版本标记。 */
export async function getLocalEditRecord(lang: Lang, slug: string): Promise<LocalChapterEdit | undefined> {
	return (await readLocalEdits()).find((record) => record.lang === lang && record.slug === slug);
}

/** 仅将未重置的编辑用于阅读；调用方可捕获错误，改用官方正文。 */
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
 * 调用方在整个修改、导入和回滚期间持有withLocalEditLock。
 * 先校验并原子提交，再更新状态或通知其他窗口。
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
	// 下方操作即使失败（包括localStorage被禁用），也不能让已成功的提交报错。
	publish(snapshot);
	try {
		const signal = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}`;
		localStorage.setItem(LOCAL_EDITS_SIGNAL_KEY, signal);
	} catch { /* 尽力发送通知；仍以IndexedDB为准。 */ }
}

/**
 * expectedUpdatedAt是打开编辑器时读取的记录修订号；
 * null表示记录和删除标记均不存在。写入前在独占Web Lock内
 * 检查最新数据，防止其他标签页或备份导入覆盖并发修改。
 * 即使时钟回拨，修订号也仍要增大。每次保存都保留最初的原文；
 * 重置后首次保存则记录当前官方正文，作为新的原文。
 * 失败时抛出异常，不发布本次编辑，让调用方保留草稿。
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

/** 重置时保留原文并生成新修订号，用于合并备份和识别过期草稿。 */
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
