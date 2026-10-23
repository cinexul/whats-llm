import { BackupError } from './backup-errors';
import { get } from 'svelte/store';
import { annotations, ensureLoaded, flushAnnotationWrites, editedAnnotationSnapshot } from './annotations';
import { reload } from './study';
import { loadLocalEdits, readLocalEdits, withLocalEditLock, writeLocalEditsSnapshot } from './local-edits';
import { LocalEditError } from './local-edits-schema';
import type { Lang } from './manifest';
import { BACKUP_FORMAT, BACKUP_VERSION, LANGS, validateBackup, serializeBackup, type CurrentLearningBackup, type LearningBackup, type PortableReview, type StudySnapshot } from './backup-schema';
export { parseBackup, backupCounts, MAX_BACKUP_BYTES } from './backup-schema';
export type { LearningBackup } from './backup-schema';

const native = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
function readJSON<T>(key: string, fallback: T): T {
	const raw = localStorage.getItem(key);
	if (raw === null) return fallback;
	try { return JSON.parse(raw) as T; } catch { throw new Error(`Cannot read existing ${key}; export or repair its stored data first.`); }
}
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** Include archived cards and all history; the visible study store intentionally filters them. */
async function collectBackup(): Promise<CurrentLearningBackup> {
	await ensureLoaded();
	await flushAnnotationWrites();
	let study: StudySnapshot;
	const edited = editedAnnotationSnapshot();
	let notes = edited ?? get(annotations);
	if (native()) {
		const { invoke } = await import('@tauri-apps/api/core');
		study = await invoke<StudySnapshot>('study_export_snapshot');
		if (edited === null) {
			const pending = localStorage.getItem('annotations-pending');
			const backup = localStorage.getItem('annotations');
			let json: string;
			if (pending !== null) json = pending;
			else {
				try { json = await invoke<string>('load_annotations'); }
				catch (error) { if (backup === null) throw error; json = backup; }
			}
			notes = JSON.parse(json);
			// Match annotation loading: a valid local recovery copy may predate the native file.
			if (pending === null && Array.isArray(notes) && notes.length === 0 && backup !== null) notes = JSON.parse(backup);
		}
	} else {
		const local = readJSON('study-v1', { cards: {}, reviews: [], read: {} }) as { cards: Record<string, StudySnapshot['cards'][number]>; reviews: PortableReview[]; read: Partial<Record<Lang, string[]>> };
		if (!local || !local.cards || !Array.isArray(local.reviews) || !local.read || Array.isArray(local.cards)) throw new Error('Cannot read existing study data');
		for (const [id, card] of Object.entries(local.cards)) if (card?.id !== id) throw new Error('Existing study card has an inconsistent ID');
		const meta = readJSON<{ read: StudySnapshot['read']; kv: StudySnapshot['kv'] }>('study-metadata-v1', { read: [], kv: {} });
		const stamps = new Map(meta.read.map((r) => [`${r.lang}:${r.slug}`, r.ts]));
		study = { cards: Object.values(local.cards), reviews: local.reviews,
			read: Object.entries(local.read).flatMap(([lang, slugs]) => slugs.map((slug) => ({ lang: lang as Lang, slug, ts: stamps.get(`${lang}:${slug}`) ?? 0 }))), kv: meta.kv };
		if (edited === null) notes = readJSON('annotations', notes);
	}
	const language = localStorage.getItem('lang'); const theme = localStorage.getItem('theme'); const scales = localStorage.getItem('font-scales');
	const backup = {
		format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), annotations: notes, chapterEdits: await readLocalEdits(), study,
		readingChapter: readJSON('reading-chapter', {}), readingPositions: readJSON('reading-positions-v1', {}), learningPaths: readJSON('learning-paths-v1', {}),
		preferences: { ...(language === null ? {} : { lang: language }), ...(theme === null ? {} : { theme }), ...(scales === null ? {} : { fontScales: JSON.parse(scales) }) }
	};
	validateBackup(backup);
	serializeBackup(backup);
	return clone(backup) as CurrentLearningBackup;
}

export async function exportBackup(): Promise<CurrentLearningBackup> {
	try { return await collectBackup(); }
	catch (error) {
		if (error instanceof BackupError && error.code === 'too-large') throw error;
		throw new BackupError('local-data', error instanceof Error ? error.message : String(error), { cause: error });
	}
}

export interface MergeResult { data: CurrentLearningBackup; conflicts: number; ties: number }
/** A timestamp tie keeps the local value. Checkpoints/read chapters form a union. */
export function mergeBackups(existing: LearningBackup, incoming: LearningBackup): MergeResult {
	validateBackup(existing); validateBackup(incoming);
	const data: CurrentLearningBackup = { ...clone(existing), version: BACKUP_VERSION, chapterEdits: clone(existing.chapterEdits ?? []) }; let conflicts = 0; let ties = 0;
	function newer<T>(old: T, fresh: T, oldTime: number, newTime: number): T {
		if (same(old, fresh)) return old;
		conflicts++;
		if (newTime === oldTime) ties++;
		return newTime > oldTime ? clone(fresh) : old;
	}
	const notes = new Map(data.annotations.map((a) => [a.id, a]));
	for (const a of incoming.annotations) {
		const old = notes.get(a.id);
		notes.set(a.id, old ? newer(old, a, Date.parse(old.updatedAt ?? old.createdAt), Date.parse(a.updatedAt ?? a.createdAt)) : clone(a));
	}
	data.annotations = [...notes.values()].sort((a, b) => a.id.localeCompare(b.id));
	const edits = new Map(data.chapterEdits.map((edit) => [`${edit.lang}:${edit.slug}`, edit]));
	for (const edit of incoming.chapterEdits ?? []) {
		const key = `${edit.lang}:${edit.slug}`; const old = edits.get(key);
		edits.set(key, old ? newer(old, edit, old.updatedAt, edit.updatedAt) : clone(edit));
	}
	// Reset tombstones participate in the same merge so an old backup cannot revive an edit.
	data.chapterEdits = [...edits.values()].sort((a, b) => `${a.lang}:${a.slug}`.localeCompare(`${b.lang}:${b.slug}`));
	const cards = new Map(data.study.cards.map((c) => [c.id, c]));
	for (const c of incoming.study.cards) { const old = cards.get(c.id); cards.set(c.id, old ? newer(old, c, old.lastReview ?? 0, c.lastReview ?? 0) : clone(c)); }
	data.study.cards = [...cards.values()].sort((a, b) => a.id.localeCompare(b.id));
	// Multiset union preserves real repeated events with identical timestamps, while repeat imports add none.
	const reviewKey = (r: PortableReview) => JSON.stringify([r.cardId, r.ts, r.rating, r.elapsedMs, r.scheduledDays, r.stability ?? null, r.difficulty ?? null]);
	const reviewCounts = new Map<string, number>();
	for (const r of data.study.reviews) { const k = reviewKey(r); reviewCounts.set(k, (reviewCounts.get(k) ?? 0) + 1); }
	const incomingCounts = new Map<string, number>();
	for (const r of incoming.study.reviews) {
		const k = reviewKey(r); const count = (incomingCounts.get(k) ?? 0) + 1; incomingCounts.set(k, count);
		if (count > (reviewCounts.get(k) ?? 0)) data.study.reviews.push(clone(r));
	}
	data.study.reviews.sort((a, b) => a.ts - b.ts || reviewKey(a).localeCompare(reviewKey(b)));
	const read = new Map(data.study.read.map((r) => [`${r.lang}:${r.slug}`, r]));
	for (const r of incoming.study.read) { const k = `${r.lang}:${r.slug}`; const old = read.get(k); if (!old || r.ts > old.ts) read.set(k, clone(r)); }
	data.study.read = [...read.values()].sort((a, b) => `${a.lang}:${a.slug}`.localeCompare(`${b.lang}:${b.slug}`));
	data.study.kv = { ...incoming.study.kv, ...data.study.kv };
	for (const lang of LANGS) {
		if (incoming.readingPositions[lang]) {
			const positions = data.readingPositions[lang] ??= {};
			for (const [slug, position] of Object.entries(incoming.readingPositions[lang])) {
				positions[slug] = positions[slug] ? newer(positions[slug], position, positions[slug].updatedAt, position.updatedAt) : clone(position);
			}
		}
		// Prefer the chapter whose saved position is newer; absent timestamps keep this device's chapter.
		const next = incoming.readingChapter[lang]; const old = existing.readingChapter[lang];
		if (next && (!old || (incoming.readingPositions[lang]?.[next]?.updatedAt ?? 0) > (existing.readingPositions[lang]?.[old]?.updatedAt ?? 0))) data.readingChapter[lang] = next;
	}
	for (const [path, checkpoints] of Object.entries(incoming.learningPaths)) data.learningPaths[path] = [...new Set([...(data.learningPaths[path] ?? []), ...checkpoints])].sort();
	data.preferences = { ...incoming.preferences, ...data.preferences };
	serializeBackup(data); // Also enforces limits after combining two independently valid files.
	return { data, conflicts, ties };
}

/** Throws on write failures, and rolls earlier keys back before reporting the failure. */
export function writeStorageAtomically(storage: Storage, entries: [string, string | null][]): () => void {
	const previous = entries.map(([key]) => [key, storage.getItem(key)] as const);
	const written: number[] = [];
	const rollback = () => {
		const errors: unknown[] = [];
		for (const index of [...written].reverse()) {
			const [key, value] = previous[index];
			try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } catch (error) { errors.push(error); }
		}
		if (errors.length) throw new Error('Storage rollback failed; keep the recovery download and reload before continuing.');
	};
	try {
		for (let i = 0; i < entries.length; i++) {
			const [key, value] = entries[i];
			if (value === previous[i][1]) continue;
			if (value === null) storage.removeItem(key); else storage.setItem(key, value);
			written.push(i);
		}
	} catch (error) {
		try { rollback(); } catch (rollbackError) { throw new AggregateError([error, rollbackError], 'Import failed and storage recovery is required. Keep the pre-import download.'); }
		throw error;
	}
	return rollback;
}

export class ImportError extends BackupError {
	constructor(message: string, public recovery: LearningBackup, options?: ErrorOptions) {
		const cause = options?.cause;
		super(cause instanceof BackupError ? cause.code : cause instanceof AggregateError ? 'recovery' : 'storage', message, options);
	}
}
let importing = false;
export async function importBackup(incoming: LearningBackup): Promise<{ backup: LearningBackup; conflicts: number; ties: number }> {
	validateBackup(incoming);
	if (importing) throw new Error('An import is already in progress');
	importing = true;
	try { return await withLocalEditLock(() => importBackupLocked(incoming)); }
	catch (error) {
		if (error instanceof LocalEditError && error.code === 'unsupported') {
			throw new BackupError('unsupported-lock', error.message, { cause: error });
		}
		throw error;
	} finally { importing = false; }
}

/** The caller holds the shared chapter-edit lock through snapshot, commit, rollback, and refresh. */
async function importBackupLocked(incoming: LearningBackup) {
	let before: LearningBackup | undefined;
	try {
		before = await exportBackup();
		const { data, conflicts, ties } = mergeBackups(before, incoming);
		const nativeMode = native();
		const nativeInvoke = nativeMode ? (await import('@tauri-apps/api/core')).invoke : null;
		const entries: [string, string | null][] = [
			['annotations', JSON.stringify(data.annotations)], ['reading-chapter', JSON.stringify(data.readingChapter)],
			['reading-positions-v1', JSON.stringify(data.readingPositions)], ['learning-paths-v1', JSON.stringify(data.learningPaths)]
		];
		for (const [key, value] of [['lang', data.preferences.lang], ['theme', data.preferences.theme], ['font-scales', data.preferences.fontScales && JSON.stringify(data.preferences.fontScales)]] as const) if (value !== undefined) entries.push([key, value]);
		if (!nativeMode) {
			const read = Object.fromEntries(LANGS.map((lang) => [lang, data.study.read.filter((r) => r.lang === lang).map((r) => r.slug)]));
			entries.push(['study-v1', JSON.stringify({ cards: Object.fromEntries(data.study.cards.map((c) => [c.id, c])), reviews: data.study.reviews, read })]);
			entries.push(['study-metadata-v1', JSON.stringify({ read: data.study.read, kv: data.study.kv })]);
		} else entries.push(['annotations-pending', null]);
		// Capture before writing: later IndexedDB/native failures restore these exact values.
		const rollback = writeStorageAtomically(localStorage, entries);
		let editsWritten = false; let notesWritten = false;
		try {
			await writeLocalEditsSnapshot(data.chapterEdits); editsWritten = true;
			if (nativeInvoke) {
				await nativeInvoke('save_annotations', { data: JSON.stringify(data.annotations) }); notesWritten = true;
				// Last fallible persistence step. SQLite merges all tables in one transaction.
				await nativeInvoke('study_import_snapshot', { snapshot: data.study });
			}
		} catch (error) {
			const failures: unknown[] = [error];
			if (nativeInvoke && notesWritten) {
				try { await nativeInvoke('save_annotations', { data: JSON.stringify(before.annotations) }); }
				catch (restoreError) {
					failures.push(restoreError);
					// Pending recovery takes precedence on the next startup, even for an empty list.
					try { localStorage.setItem('annotations-pending', JSON.stringify(before.annotations)); } catch (pendingError) { failures.push(pendingError); }
				}
			}
			if (editsWritten) {
				try { await writeLocalEditsSnapshot(before.chapterEdits ?? []); } catch (restoreError) { failures.push(restoreError); }
			}
			try { rollback(); } catch (restoreError) { failures.push(restoreError); }
			// Preserve pending native recovery even if rollback restored the previous marker.
			if (failures.length > 1) {
				if (nativeInvoke && notesWritten) {
					try { localStorage.setItem('annotations-pending', JSON.stringify(before.annotations)); } catch { /* Recovery snapshot is returned in ImportError. */ }
				}
				throw new AggregateError(failures, 'Import failed; recovery is required. Keep the pre-import download.');
			}
			throw error;
		}
		annotations.set(data.annotations);
		await loadLocalEdits();
		// A refresh failure must not misreport an already committed import as a failed write.
		await Promise.allSettled(LANGS.map((lang) => reload(lang)));
		window.dispatchEvent(new Event('learning-data-imported'));
		return { backup: before, conflicts, ties };
	} catch (error) {
		if (before) throw new ImportError(error instanceof Error ? error.message : String(error), before, { cause: error });
		throw error;
	}
}

export function downloadBackup(backup: LearningBackup, prefix = 'whats-llm-backup') {
	const url = URL.createObjectURL(new Blob([serializeBackup(backup)], { type: 'application/json' }));
	const link = document.createElement('a'); link.href = url; link.download = `${prefix}-${new Date().toISOString().slice(0, 10)}.json`;
	document.body.append(link); link.click(); link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
