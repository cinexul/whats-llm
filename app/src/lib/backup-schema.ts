import { BackupError, type BackupErrorCode } from './backup-errors';
import type { Annotation } from './annotations';
import { learningPathDefinitions } from './learning-paths-data';
import { validateLocalEdits, type LocalChapterEdit } from './local-edits-schema';
import { allChapters, type Lang } from './manifest';
import type { Review, StudyCard } from './study';

export const BACKUP_FORMAT = 'whats-llm-learning';
export const BACKUP_VERSION = 2;
export const MAX_BACKUP_BYTES = 32 * 1024 * 1024;
const MAX_TIMESTAMP = 8_640_000_000_000_000;
export const LANGS: Lang[] = ['zh', 'en', 'ja'];
export interface PortableReview extends Review { stability?: number | null; difficulty?: number | null }
export interface ReadEntry { lang: Lang; slug: string; ts: number }
export interface StudySnapshot {
	cards: StudyCard[];
	reviews: PortableReview[];
	read: ReadEntry[];
	kv: Record<string, string>;
}
export interface ReadingPosition { anchor: string; offset: number; progress: number; updatedAt: number }
export interface ReaderPreferences { lang?: Lang; theme?: 'light' | 'dark'; fontScales?: { nav: number; heading: number; body: number } }
interface LearningBackupContents {
	format: typeof BACKUP_FORMAT;
	exportedAt: string;
	annotations: Annotation[];
	study: StudySnapshot;
	readingChapter: Partial<Record<Lang, string>>;
	readingPositions: Partial<Record<Lang, Record<string, ReadingPosition>>>;
	learningPaths: Record<string, string[]>;
	preferences: ReaderPreferences;
}
export type CurrentLearningBackup = LearningBackupContents & { version: typeof BACKUP_VERSION; chapterEdits: LocalChapterEdit[] };
export type LearningBackup = CurrentLearningBackup | (LearningBackupContents & { version: 1; chapterEdits?: LocalChapterEdit[] });

function fail(path: string, code: BackupErrorCode = 'invalid-data'): never { throw new BackupError(code, `Invalid backup: ${path}`); }
function object(value: unknown, path: string): Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path);
	return value as Record<string, unknown>;
}
function fields(value: Record<string, unknown>, keys: string[], path: string) {
	if (Object.keys(value).some((k) => !keys.includes(k))) fail(`${path}: unknown field`);
}
function str(value: unknown, path: string, max = 512, nonempty = true): asserts value is string {
	if (typeof value !== 'string' || value.length > max || (nonempty && !value.trim())) fail(path);
}
function id(value: unknown, path: string) {
	str(value, path);
	if (/[:\u0000-\u001f]/.test(value) || ['__proto__', 'constructor', 'prototype'].includes(value)) fail(path);
}
function num(value: unknown, path: string, min = 0, max = Number.MAX_SAFE_INTEGER, integer = true) {
	if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isSafeInteger(value))) fail(path);
}
function nullable(value: unknown, path: string, min = 0, max = Number.MAX_SAFE_INTEGER, integer = true) {
	if (value !== null) num(value, path, min, max, integer);
}
function date(value: unknown, path: string) {
	str(value, path, 40);
	if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) fail(path);
}
function language(value: unknown, path: string): asserts value is Lang {
	if (!LANGS.includes(value as Lang)) fail(path);
}
function array(value: unknown, path: string, max: number): unknown[] {
	if (!Array.isArray(value) || value.length > max) fail(path);
	return value;
}
function unique(values: string[], path: string) {
	if (new Set(values).size !== values.length) fail(`${path}: duplicate ID`);
}

/** Reject the entire file before writing anything. No partial filtering of user data. */
export function validateBackup(value: unknown): asserts value is LearningBackup {
	const b = object(value, 'root');
	fields(b, ['format', 'version', 'exportedAt', 'annotations', 'chapterEdits', 'study', 'readingChapter', 'readingPositions', 'learningPaths', 'preferences'], 'root');
	if (b.format !== BACKUP_FORMAT) fail('format');
	if (b.version !== 1 && b.version !== BACKUP_VERSION) fail('version (this app supports versions 1 and 2)', 'unsupported-version');
	date(b.exportedAt, 'exportedAt');
	if (b.version === BACKUP_VERSION || b.chapterEdits !== undefined) {
		try { validateLocalEdits(b.chapterEdits); }
		catch (error) { fail(`chapterEdits: ${error instanceof Error ? error.message : 'invalid data'}`); }
	}
	const annotations = array(b.annotations, 'annotations', 20_000);
	for (const value of annotations) {
		const a = object(value, 'annotation');
		fields(a, ['id', 'chapter', 'lang', 'exact', 'prefix', 'suffix', 'color', 'note', 'createdAt', 'updatedAt'], 'annotation');
		id(a.id, 'annotation.id'); id(a.chapter, 'annotation.chapter');
		if (a.lang !== undefined) language(a.lang, 'annotation.lang');
		str(a.exact, 'annotation.exact', 100_000); str(a.prefix, 'annotation.prefix', 10_000, false); str(a.suffix, 'annotation.suffix', 10_000, false);
		str(a.note, 'annotation.note', 100_000, false);
		if (!['yellow', 'green', 'pink'].includes(a.color as string)) fail('annotation.color');
		date(a.createdAt, 'annotation.createdAt');
		if (a.updatedAt !== undefined) date(a.updatedAt, 'annotation.updatedAt');
	}
	unique(annotations.map((a) => (a as Annotation).id), 'annotations');
	const s = object(b.study, 'study'); fields(s, ['cards', 'reviews', 'read', 'kv'], 'study');
	const cards = array(s.cards, 'study.cards', 50_000);
	for (const value of cards) {
		const c = object(value, 'card');
		fields(c, ['id', 'lang', 'slug', 'qn', 'qhash', 'stability', 'difficulty', 'state', 'due', 'lastReview', 'reps', 'lapses'], 'card');
		language(c.lang, 'card.lang'); id(c.slug, 'card.slug'); str(c.qhash, 'card.qhash', 512);
		str(c.id, 'card.id', 1100);
		if (c.id !== `${c.lang}:${c.slug}:${c.qhash}`) fail('card.id integrity');
		num(c.qn, 'card.qn', 0, 100_000); num(c.state, 'card.state', 0, 3); num(c.reps, 'card.reps'); num(c.lapses, 'card.lapses');
		nullable(c.stability, 'card.stability', 0, 1e9, false); nullable(c.difficulty, 'card.difficulty', 0, 10, false);
		nullable(c.due, 'card.due', 0, MAX_TIMESTAMP); nullable(c.lastReview, 'card.lastReview', 0, MAX_TIMESTAMP);
	}
	const ids = cards.map((c) => (c as StudyCard).id); unique(ids, 'cards'); const cardIds = new Set(ids);
	for (const value of array(s.reviews, 'study.reviews', 200_000)) {
		const r = object(value, 'review'); fields(r, ['cardId', 'ts', 'rating', 'elapsedMs', 'scheduledDays', 'stability', 'difficulty'], 'review');
		if (!cardIds.has(r.cardId as string)) fail('review.cardId references missing card');
		num(r.ts, 'review.ts', 0, MAX_TIMESTAMP); num(r.rating, 'review.rating', 1, 4); nullable(r.elapsedMs, 'review.elapsedMs'); nullable(r.scheduledDays, 'review.scheduledDays');
		if (r.stability !== undefined) nullable(r.stability, 'review.stability', 0, 1e9, false);
		if (r.difficulty !== undefined) nullable(r.difficulty, 'review.difficulty', 0, 10, false);
	}
	const read = array(s.read, 'study.read', 20_000);
	for (const value of read) {
		const r = object(value, 'read'); fields(r, ['lang', 'slug', 'ts'], 'read'); language(r.lang, 'read.lang'); id(r.slug, 'read.slug'); num(r.ts, 'read.ts', 0, MAX_TIMESTAMP);
	}
	unique(read.map((r) => `${(r as ReadEntry).lang}:${(r as ReadEntry).slug}`), 'read');
	const kv = object(s.kv, 'study.kv'); if (Object.keys(kv).length > 200) fail('study.kv');
	for (const [k, v] of Object.entries(kv)) { id(k, 'study.kv key'); str(v, 'study.kv value', 100_000, false); }
	const chapters = object(b.readingChapter, 'readingChapter');
	for (const [k, v] of Object.entries(chapters)) {
		language(k, 'readingChapter language'); id(v, 'readingChapter slug');
		if (!allChapters(k).some((chapter) => chapter.slug === v)) fail('readingChapter: unsupported chapter', 'unsupported-chapter');
	}
	const positions = object(b.readingPositions, 'readingPositions');
	for (const [k, v] of Object.entries(positions)) {
		language(k, 'readingPositions language'); const chapters = object(v, 'readingPositions chapters');
		if (Object.keys(chapters).length > 5000) fail('readingPositions count');
		for (const [slug, value] of Object.entries(chapters)) {
			id(slug, 'readingPosition slug');
			if (!allChapters(k).some((chapter) => chapter.slug === slug)) fail('readingPosition: unsupported chapter', 'unsupported-chapter');
			const p = object(value, 'readingPosition'); fields(p, ['anchor', 'offset', 'progress', 'updatedAt'], 'readingPosition');
			str(p.anchor, 'readingPosition.anchor', 256, false); num(p.offset, 'readingPosition.offset', 0, 1, false); num(p.progress, 'readingPosition.progress', 0, 1, false); num(p.updatedAt, 'readingPosition.updatedAt', 0, MAX_TIMESTAMP);
		}
	}
	const paths = object(b.learningPaths, 'learningPaths'); if (Object.keys(paths).length > 1000) fail('learningPaths count');
	for (const [k, v] of Object.entries(paths)) {
		id(k, 'learningPath ID'); const checkpoints = array(v, 'learningPath checkpoints', 1000);
		const definition = learningPathDefinitions.find((path) => path.id === k);
		if (!definition) fail('learningPath: unsupported path ID', 'unsupported-path');
		checkpoints.forEach((c) => {
			id(c, 'learningPath checkpoint');
			if (!definition.steps.some((step) => step.id === c)) fail('learningPath: checkpoint does not belong to this path', 'unsupported-path');
		});
		unique(checkpoints as string[], 'learningPath checkpoints');
	}
	const prefs = object(b.preferences, 'preferences'); fields(prefs, ['lang', 'theme', 'fontScales'], 'preferences');
	if (prefs.lang !== undefined) language(prefs.lang, 'preferences.lang');
	if (prefs.theme !== undefined && !['light', 'dark'].includes(prefs.theme as string)) fail('preferences.theme');
	if (prefs.fontScales !== undefined) {
		const scales = object(prefs.fontScales, 'fontScales'); fields(scales, ['nav', 'heading', 'body'], 'fontScales');
		for (const key of ['nav', 'heading', 'body']) num(scales[key], `fontScales.${key}`, 0.8, 1.5, false);
	}
}

export function parseBackup(text: string): LearningBackup {
	if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new BackupError('too-large', 'Backup exceeds the 32 MB limit');
	let value: unknown;
	try { value = JSON.parse(text); } catch { throw new BackupError('invalid-json', 'Invalid backup: unreadable JSON'); }
	validateBackup(value); return value;
}

export function backupCounts(b: LearningBackup) {
	return { annotations: b.annotations.length, cards: b.study.cards.length, reviews: b.study.reviews.length, read: b.study.read.length,
		positions: Object.values(b.readingPositions).reduce((n, p) => n + Object.keys(p).length, 0),
		checkpoints: Object.values(b.learningPaths).reduce((n, p) => n + p.length, 0),
		chapterEdits: (b.chapterEdits ?? []).filter((edit) => edit.markdown !== null).length };
}

/** Export files must fit the same size limit accepted by the importer. */
export function serializeBackup(backup: LearningBackup): string {
	validateBackup(backup);
	const text = JSON.stringify(backup, null, 2);
	if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new BackupError('too-large', 'Backup exceeds the 32 MB limit');
	return text;
}
