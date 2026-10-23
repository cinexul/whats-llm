// Last chapter and paragraph positions stay local and are included in portable backups.
import { writable } from 'svelte/store';
import { allChapters, type Lang } from './manifest';

const KEY = 'reading-chapter';
const POSITIONS_KEY = 'reading-positions-v1';
const LANGUAGES: Lang[] = ['zh', 'ja', 'en'];
const validChapter = (lang: Lang, slug: string) => allChapters(lang).some((chapter) => chapter.slug === slug);

export interface ReadingPosition {
	anchor: string;
	offset: number;
	progress: number;
	updatedAt: number;
}

type ReadingPositions = Partial<Record<Lang, Record<string, ReadingPosition>>>;

function isPosition(value: unknown): value is ReadingPosition {
	if (!value || typeof value !== 'object') return false;
	const p = value as ReadingPosition;
	return typeof p.anchor === 'string' && p.anchor.length <= 256 &&
		Number.isFinite(p.offset) && p.offset >= 0 && p.offset <= 1 &&
		Number.isFinite(p.progress) && p.progress >= 0 && p.progress <= 1 &&
		Number.isFinite(p.updatedAt) && p.updatedAt >= 0;
}

function loadPositions(): ReadingPositions {
	try {
		const raw = JSON.parse(localStorage.getItem(POSITIONS_KEY) ?? '{}');
		if (!raw || typeof raw !== 'object') return {};
		const result: ReadingPositions = {};
		for (const lang of LANGUAGES) {
			if (!raw[lang] || typeof raw[lang] !== 'object') continue;
			result[lang] = Object.fromEntries(Object.entries(raw[lang]).filter(([slug, p]) => validChapter(lang, slug) && isPosition(p))) as Record<string, ReadingPosition>;
		}
		return result;
	} catch { return {}; }
}

let positions = loadPositions();
function load(): Partial<Record<Lang, string>> {
	try {
		const value = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		if (!value || typeof value !== 'object') return {};
		return Object.fromEntries((['zh', 'ja', 'en'] as Lang[]).flatMap((lang) =>
			allChapters(lang).some((chapter) => chapter.slug === value[lang]) ? [[lang, value[lang]]] : []
		));
	} catch { return {}; }
}
export const readingChapter = writable(load());
export function reloadReading() {
	readingChapter.set(load());
	positions = loadPositions();
}

export function rememberChapter(lang: Lang, slug: string) {
	if (!validChapter(lang, slug)) return;
	readingChapter.update((current) => {
		const next = { ...current, [lang]: slug };
		try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Reading still works without storage. */ }
		return next;
	});
}

export function getReadingPosition(lang: Lang, slug: string): ReadingPosition | undefined {
	return positions[lang]?.[slug];
}

export function saveReadingPosition(lang: Lang, slug: string, position: ReadingPosition) {
	if (!validChapter(lang, slug) || !isPosition(position)) return;
	positions = { ...positions, [lang]: { ...positions[lang], [slug]: position } };
	try { localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions)); } catch { /* Keep the current session usable. */ }
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const READING_INSET = 16;

/** Text-based anchors survive preceding content insertions and font/viewport changes. */
export function anchorReadingBlocks(root: HTMLElement) {
	const duplicates = new Map<string, number>();
	for (const block of Array.from(root.children)) {
		if (!(block instanceof HTMLElement) || !block.textContent?.trim()) continue;
		let hash = 2166136261;
		for (const char of block.textContent.replace(/\s+/g, ' ').trim()) {
			hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
		}
		const key = block.id ? `h-${block.id}` : `p-${hash.toString(36)}`;
		const duplicate = duplicates.get(key) ?? 0;
		duplicates.set(key, duplicate + 1);
		block.dataset.readingAnchor = `${key.slice(0, 230)}-${duplicate}`;
	}
}

export function captureReadingPosition(main: HTMLElement, root: HTMLElement, now = Date.now()): ReadingPosition {
	const distance = main.scrollHeight - main.clientHeight;
	const progress = distance > 0 ? clamp(main.scrollTop / distance) : 0;
	const line = main.getBoundingClientRect().top + READING_INSET;
	const blocks = Array.from(root.children).filter((el): el is HTMLElement => el instanceof HTMLElement && !!el.dataset.readingAnchor);
	const block = blocks.find((el) => el.getBoundingClientRect().bottom > line);
	if (!block || main.scrollTop < 8 || root.getBoundingClientRect().top > line) {
		return { anchor: '', offset: 0, progress, updatedAt: now };
	}
	const rect = block.getBoundingClientRect();
	return { anchor: block.dataset.readingAnchor!, offset: rect.height > 0 ? clamp((line - rect.top) / rect.height) : 0, progress, updatedAt: now };
}

export function restoreReadingPosition(main: HTMLElement, root: HTMLElement, position: ReadingPosition) {
	const block = Array.from(root.children).find((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.readingAnchor === position.anchor);
	const distance = Math.max(0, main.scrollHeight - main.clientHeight);
	const rect = block?.getBoundingClientRect();
	const top = rect
		? main.scrollTop + rect.top - main.getBoundingClientRect().top + rect.height * position.offset - READING_INSET
		: distance * position.progress;
	main.scrollTo({ top: Math.max(0, Math.min(distance, top)), behavior: 'instant' });
}
