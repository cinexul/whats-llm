// 学習データ(設問カード=間隔反復 / 読了 / 復習ログ)のフロント側入口。
// 実体は 2 系統:
//  - Tauri: invoke 経由で Rust(study-core)の埋め込み SQLite + FSRS を叩く(本番・正)。
//  - ブラウザ(npm run dev): localStorage + 簡易スケジューラ(プレビュー用フォールバック)。
// どちらも同じ非同期 API を出し、UI は実装差を意識しない。
import { writable } from 'svelte/store';
import type { Lang } from './manifest';

export const DAY = 86_400_000;
const LANGS: Lang[] = ['zh', 'ja', 'en'];

/** 1 設問のカード。Rust の Card と同形(serde camelCase)。 */
export interface StudyCard {
	id: string; // lang:slug:qhash
	lang: string;
	slug: string;
	qn: number;
	qhash: string;
	stability: number | null;
	difficulty: number | null;
	state: number; // 0 new / 2 review / 3 relearning
	due: number | null; // epoch ms
	lastReview: number | null;
	reps: number;
	lapses: number;
}

export interface Review {
	cardId: string;
	ts: number;
	rating: number; // 1 Again / 3 Good
	elapsedMs: number | null;
	scheduledDays: number | null;
}

export type Mastery = 'new' | 'learning' | 'reviewing' | 'mastered';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// ===== バックエンド抽象 =====
interface Backend {
	recordAnswer(
		lang: Lang,
		slug: string,
		qn: number,
		qhash: string,
		correct: boolean,
		elapsedMs: number | null
	): Promise<StudyCard>;
	allCards(lang: Lang): Promise<StudyCard[]>;
	allReviews(lang: Lang): Promise<Review[]>;
	markRead(lang: Lang, slug: string, ts: number): Promise<void>;
	readSlugs(lang: Lang): Promise<string[]>;
	resetProgress(): Promise<void>;
}

// ---- Tauri 実装 ----
const tauri: Backend = {
	async recordAnswer(lang, slug, qn, qhash, correct, elapsedMs) {
		const { invoke } = await import('@tauri-apps/api/core');
		return invoke<StudyCard>('study_record_answer', {
			lang,
			slug,
			qn,
			qhash,
			correct,
			elapsedMs,
			now: Date.now()
		});
	},
	async allCards(lang) {
		const { invoke } = await import('@tauri-apps/api/core');
		return invoke<StudyCard[]>('study_all_cards', { lang });
	},
	async allReviews(lang) {
		const { invoke } = await import('@tauri-apps/api/core');
		return invoke<Review[]>('study_all_reviews', { lang });
	},
	async markRead(lang, slug, ts) {
		const { invoke } = await import('@tauri-apps/api/core');
		await invoke('study_mark_read', { lang, slug, ts });
	},
	async readSlugs(lang) {
		const { invoke } = await import('@tauri-apps/api/core');
		return invoke<string[]>('study_read_slugs', { lang });
	},
	async resetProgress() {
		const { invoke } = await import('@tauri-apps/api/core');
		await invoke('study_reset');
	}
};

// ---- ブラウザ(localStorage)実装。dev プレビュー用なので簡易スケジューラ ----
const LS = 'study-v1';
interface LocalData {
	cards: Record<string, StudyCard>;
	reviews: Review[];
	read: Partial<Record<Lang, string[]>>;
}

function loadLocal(): LocalData {
	if (typeof localStorage === 'undefined') return { cards: {}, reviews: [], read: {} };
	try {
		const d = JSON.parse(localStorage.getItem(LS) ?? 'null');
		if (d && typeof d === 'object') {
			return { cards: d.cards ?? {}, reviews: d.reviews ?? [], read: d.read ?? {} };
		}
	} catch {
		/* 既定値 */
	}
	return { cards: {}, reviews: [], read: {} };
}

function saveLocal(d: LocalData) {
	if (typeof localStorage !== 'undefined') localStorage.setItem(LS, JSON.stringify(d));
}

// 簡易 SM-2 風スケジューラ(ブラウザ・フォールバック専用。本番は Rust の FSRS)。
function localGrade(
	prev: StudyCard | undefined,
	base: Pick<StudyCard, 'id' | 'lang' | 'slug' | 'qn' | 'qhash'>,
	correct: boolean,
	now: number
): StudyCard {
	const prevInterval =
		prev && prev.due != null && prev.lastReview != null
			? Math.max(1, Math.round((prev.due - prev.lastReview) / DAY))
			: 0;
	let reps = prev?.reps ?? 0;
	let lapses = prev?.lapses ?? 0;
	let interval: number;
	if (!correct) {
		if (reps > 0) lapses++;
		reps = 0;
		interval = 1;
	} else {
		interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(1, Math.round((prevInterval || 1) * 2.3));
		reps++;
	}
	return {
		...base,
		stability: interval,
		difficulty: prev?.difficulty ?? 5,
		state: correct ? 2 : 3,
		due: now + interval * DAY,
		lastReview: now,
		reps,
		lapses
	};
}

const local: Backend = {
	async recordAnswer(lang, slug, qn, qhash, correct, elapsedMs) {
		const d = loadLocal();
		const id = `${lang}:${slug}:${qhash}`;
		const card = localGrade(d.cards[id], { id, lang, slug, qn, qhash }, correct, Date.now());
		d.cards[id] = card;
		d.reviews.push({
			cardId: id,
			ts: Date.now(),
			rating: correct ? 3 : 1,
			elapsedMs,
			scheduledDays: card.stability
		});
		saveLocal(d);
		return card;
	},
	async allCards(lang) {
		const d = loadLocal();
		return Object.values(d.cards)
			.filter((c) => c.lang === lang)
			.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : a.qn - b.qn));
	},
	async allReviews(lang) {
		const d = loadLocal();
		const ids = new Set(
			Object.values(d.cards)
				.filter((c) => c.lang === lang)
				.map((c) => c.id)
		);
		return d.reviews.filter((r) => ids.has(r.cardId));
	},
	async markRead(lang, slug) {
		const d = loadLocal();
		const arr = new Set(d.read[lang] ?? []);
		arr.add(slug);
		d.read[lang] = [...arr];
		saveLocal(d);
	},
	async readSlugs(lang) {
		return loadLocal().read[lang] ?? [];
	},
	async resetProgress() {
		saveLocal({ cards: {}, reviews: [], read: {} });
	}
};

const backend: Backend = isTauri() ? tauri : local;

// ===== リアクティブなストア(現在語のカード / 読了)=====
function emptyCards(): Record<Lang, StudyCard[]> {
	return { zh: [], ja: [], en: [] };
}
function emptyRead(): Record<Lang, Set<string>> {
	return { zh: new Set(), ja: new Set(), en: new Set() };
}

export const cardsStore = writable<Record<Lang, StudyCard[]>>(emptyCards());
export const readStore = writable<Record<Lang, Set<string>>>(emptyRead());

const loadedLangs = new Set<Lang>();
const loadingLangs = new Map<Lang, Promise<void>>();
const loadRequests = new Map<Lang, number>();
let progressGeneration = 0;
let migratePromise: Promise<void> | null = null;

// 旧 localStorage(read-chapters)の読了を一度だけ新ストアへ取り込む。
// 旧 quiz-srs(章単位 SM-2)は設問粒度へ写せないので移行しない。
async function migrateLegacy() {
	if (typeof localStorage === 'undefined') return;
	if (localStorage.getItem('study-migrated')) return;
	try {
		const raw = JSON.parse(localStorage.getItem('read-chapters') ?? 'null');
		if (Array.isArray(raw)) {
			for (const slug of raw) await backend.markRead('ja', slug, Date.now());
		} else if (raw && typeof raw === 'object') {
			for (const l of LANGS) {
				if (Array.isArray(raw[l])) for (const slug of raw[l]) await backend.markRead(l, slug, Date.now());
			}
		}
	} catch {
		/* 取り込めなくても続行 */
	}
	localStorage.setItem('study-migrated', '1');
}

function ensureMigrated(): Promise<void> {
	if (!migratePromise) migratePromise = migrateLegacy();
	return migratePromise;
}

/** その言語のカード・読了をストアへ読み込む(初回のみ)。 */
export async function ensureLoaded(lang: Lang): Promise<void> {
	await ensureMigrated();
	if (loadedLangs.has(lang)) return;
	let loading = loadingLangs.get(lang);
	if (!loading) {
		const generation = progressGeneration;
		loading = reload(lang)
			.then((loaded) => {
				if (loaded && generation === progressGeneration) loadedLangs.add(lang);
			})
			.finally(() => {
				if (loadingLangs.get(lang) === loading) loadingLangs.delete(lang);
			});
		loadingLangs.set(lang, loading);
	}
	await loading;
}

// Retire revised/deleted questions from active counts, retaining their stored history.
// Load through the same encoded source and parser used by the reader and review page.
async function currentCards(lang: Lang, cards: StudyCard[]): Promise<StudyCard[]> {
	if (cards.length === 0) return cards;
	const [{ loadChapterSource }, { splitQuiz, questionIdentity }] = await Promise.all([
		import('./content'), import('./quiz')
	]);
	const hashes = new Map<string, Set<string>>();
	await Promise.all([...new Set(cards.map((card) => card.slug))].map(async (slug) => {
		const source = await loadChapterSource(lang, slug);
		const questions = source === null ? [] : splitQuiz(source).quiz?.questions ?? [];
		hashes.set(slug, new Set(questions.filter((q) => q.correct).map((q) => questionIdentity(q, lang, slug))));
	}));
	return cards.filter((card) => hashes.get(card.slug)?.has(card.qhash));
}

export async function reload(lang: Lang): Promise<boolean> {
	const generation = progressGeneration;
	const request = (loadRequests.get(lang) ?? 0) + 1;
	loadRequests.set(lang, request);
	try {
		const [cards, reads] = await Promise.all([backend.allCards(lang), backend.readSlugs(lang)]);
		const activeCards = await currentCards(lang, cards);
		if (generation !== progressGeneration || loadRequests.get(lang) !== request) return false;
		cardsStore.update((m) => ({ ...m, [lang]: activeCards }));
		readStore.update((m) => ({ ...m, [lang]: new Set(reads) }));
		return true;
	} catch {
		// Keep existing data and allow a later caller to retry transient failures.
		return false;
	}
}

/** 1 設問への作答を記録し、ストアの該当カードを差し替える。 */
export async function recordAnswer(
	lang: Lang,
	slug: string,
	qn: number,
	qhash: string,
	correct: boolean,
	elapsedMs: number | null = null
): Promise<StudyCard | null> {
	const generation = progressGeneration;
	try {
		const card = await backend.recordAnswer(lang, slug, qn, qhash, correct, elapsedMs);
		if (generation !== progressGeneration) return null;
		// An older in-flight snapshot must not hide the answer that just saved.
		loadRequests.set(lang, (loadRequests.get(lang) ?? 0) + 1);
		cardsStore.update((m) => {
			const list = (m[lang] ?? []).filter((c) => c.id !== card.id);
			list.push(card);
			return { ...m, [lang]: list };
		});
		return card;
	} catch {
		return null;
	}
}

export async function markRead(lang: Lang, slug: string): Promise<void> {
	try {
		await backend.markRead(lang, slug, Date.now());
		readStore.update((m) => {
			const s = new Set(m[lang] ?? []);
			s.add(slug);
			return { ...m, [lang]: s };
		});
	} catch {
		/* 記録できなくても閲覧は続けられる */
	}
}

export function fetchReviews(lang: Lang): Promise<Review[]> {
	return backend.allReviews(lang).catch(() => []);
}

export async function resetProgress(): Promise<void> {
	await ensureMigrated();
	await backend.resetProgress();
	progressGeneration++;
	loadingLangs.clear();
	cardsStore.set(emptyCards());
	readStore.set(emptyRead());
	loadedLangs.clear();
}

// ===== 導出ヘルパー =====
export function isDue(c: StudyCard, now = Date.now()): boolean {
	return c.due != null && c.due <= now;
}

export function masteryOf(c: StudyCard | undefined | null): Mastery {
	if (!c || c.reps === 0) return 'new';
	const s = c.stability ?? 0;
	if (c.reps >= 3 && s >= 21) return 'mastered';
	if (c.reps >= 2) return 'reviewing';
	return 'learning';
}

export function dueCards(cards: StudyCard[], now = Date.now()): StudyCard[] {
	return cards.filter((c) => isDue(c, now)).sort((a, b) => (a.due ?? 0) - (b.due ?? 0));
}

export function dueCount(cards: StudyCard[], now = Date.now()): number {
	return cards.reduce((n, c) => n + (isDue(c, now) ? 1 : 0), 0);
}

/** Practice the latest unsuccessful attempt, including cards scheduled for later.
 * The active-card input excludes obsolete assessments; history stays untouched.
 */
export function mistakeCards(cards: StudyCard[], reviews: Review[], slugs?: Set<string>): StudyCard[] {
	const latest = new Map<string, Review>();
	for (const review of reviews) {
		const previous = latest.get(review.cardId);
		if (!previous || review.ts >= previous.ts) latest.set(review.cardId, review);
	}
	return cards.filter((card) => {
		if (slugs && !slugs.has(card.slug)) return false;
		const last = latest.get(card.id);
		return last ? last.rating < 3 : card.state === 3;
	});
}

/** Observed accuracy over saved answers, not an estimate of future retention. */
export function historicalAccuracy(reviews: Review[]): number | null {
	return reviews.length
		? Math.round((100 * reviews.filter((review) => review.rating >= 3).length) / reviews.length)
		: null;
}

const MASTERY_ORDER: Mastery[] = ['new', 'learning', 'reviewing', 'mastered'];

export interface ChapterSummary {
	answered: number;
	due: number;
	mastery: Mastery | null; // その章の最弱カードの定着度(未着手なら null)
}

export function chapterSummary(cards: StudyCard[], slug: string, now = Date.now()): ChapterSummary {
	const cs = cards.filter((c) => c.slug === slug);
	if (cs.length === 0) return { answered: 0, due: 0, mastery: null };
	let weakest: Mastery = 'mastered';
	let due = 0;
	for (const c of cs) {
		if (isDue(c, now)) due++;
		const m = masteryOf(c);
		if (MASTERY_ORDER.indexOf(m) < MASTERY_ORDER.indexOf(weakest)) weakest = m;
	}
	return { answered: cs.length, due, mastery: weakest };
}

export function dayKey(ts: number): string {
	const d = new Date(ts);
	const m = `${d.getMonth() + 1}`.padStart(2, '0');
	const day = `${d.getDate()}`.padStart(2, '0');
	return `${d.getFullYear()}-${m}-${day}`;
}

/** 連続学習日数。今日(なければ昨日)を起点に途切れるまで遡る。 */
export function streakFromReviews(reviews: Review[], now = Date.now()): number {
	if (reviews.length === 0) return 0;
	const days = new Set(reviews.map((r) => dayKey(r.ts)));
	let count = 0;
	let cursor = now;
	if (!days.has(dayKey(cursor))) cursor -= DAY;
	while (days.has(dayKey(cursor))) {
		count++;
		cursor -= DAY;
	}
	return count;
}
