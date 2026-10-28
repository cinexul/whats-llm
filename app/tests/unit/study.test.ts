// @vitest-environment jsdom
import { get } from 'svelte/store';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';

const invoke = vi.fn();

beforeEach(() => {
	vi.resetModules();
	invoke.mockReset();
	localStorage.clear();
	localStorage.setItem('study-migrated', '1');
	vi.stubGlobal('__TAURI_INTERNALS__', { invoke });
});

afterEach(() => { vi.unstubAllGlobals(); });
// 只数读取学习数据的调用；启动时还会问一次数据库是否打开成功
const loadCalls = () => invoke.mock.calls.filter(([command]) => command === 'study_all_cards' || command === 'study_read_slugs').length;

it('all concurrent callers wait until saved study data has loaded', async () => {
	let finish!: (slugs: string[]) => void;
	const reads = new Promise<string[]>((resolve) => (finish = resolve));
	invoke.mockImplementation((command: string) =>
		command === 'study_read_slugs' ? reads : Promise.resolve([])
	);
	const { ensureLoaded, readStore } = await import('$lib/study');
	const first = ensureLoaded('en');
	await vi.waitFor(() => expect(loadCalls()).toBe(2));
	let secondFinished = false;
	const second = ensureLoaded('en').then(() => { secondFinished = true; });
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(secondFinished).toBe(false);
	finish(['what-is-llm']);
	await Promise.all([first, second]);
	expect(get(readStore).en.has('what-is-llm')).toBe(true);
	expect(loadCalls()).toBe(2);
});

it('retries a failed load instead of permanently treating empty data as loaded', async () => {
	invoke.mockRejectedValue(new Error('temporarily unavailable'));
	const { ensureLoaded, readStore } = await import('$lib/study');
	await ensureLoaded('zh');
	invoke.mockImplementation((command: string) =>
		Promise.resolve(command === 'study_read_slugs' ? ['rag'] : [])
	);
	await ensureLoaded('zh');
	expect(get(readStore).zh.has('rag')).toBe(true);
});

it('does not restore or cache a stale load after the user resets progress', async () => {
	let finish!: (slugs: string[]) => void;
	const reads = new Promise<string[]>((resolve) => (finish = resolve));
	let reset = false;
	invoke.mockImplementation((command: string) => {
		if (command === 'study_reset') { reset = true; return Promise.resolve(); }
		return command === 'study_read_slugs' && !reset ? reads : Promise.resolve([]);
	});
	const { ensureLoaded, resetProgress, readStore } = await import('$lib/study');
	const oldLoad = ensureLoaded('en');
	await vi.waitFor(() => expect(loadCalls()).toBe(2));
	await resetProgress();
	finish(['what-is-llm']);
	await oldLoad;
	await ensureLoaded('en');
	expect([...get(readStore).en]).toEqual([]);
	expect(invoke.mock.calls.filter(([command]) => command === 'study_all_cards')).toHaveLength(2);
});

it('selects unresolved mistakes independently of due dates and supports chapter/topic scopes', async () => {
	const { mistakeCards } = await import('$lib/study');
	const card = (id: string, slug: string, state = 2) => ({ id, slug, lang: 'en', qn: 1, qhash: id, state, reps: 1, lapses: 0, stability: 1, difficulty: 5, due: Date.now() + 86400000, lastReview: 1 });
	const cards = [card('fixed', 'rag', 3), card('wrong', 'rag'), card('other', 'tokens'), card('legacy', 'tokens', 3)];
	const reviews = [
		{ cardId: 'fixed', ts: 20, rating: 3, elapsedMs: null, scheduledDays: 1 },
		{ cardId: 'wrong', ts: 10, rating: 1, elapsedMs: null, scheduledDays: 1 },
		{ cardId: 'fixed', ts: 10, rating: 1, elapsedMs: null, scheduledDays: 1 },
		{ cardId: 'other', ts: 10, rating: 1, elapsedMs: null, scheduledDays: 1 }
	];
	expect(mistakeCards(cards, reviews).map((c) => c.id)).toEqual(['wrong', 'other', 'legacy']);
	expect(mistakeCards(cards, reviews, new Set(['rag'])).map((c) => c.id)).toEqual(['wrong']);
	expect(mistakeCards(cards, reviews, new Set(['rag', 'tokens']))).toHaveLength(3);
});

it('reports historical answer accuracy from all review records, including retired assessments', async () => {
	const { historicalAccuracy } = await import('$lib/study');
	const reviews = [1, 3, 3, 1].map((rating, ts) => ({ cardId: 'retired', ts, rating, elapsedMs: null, scheduledDays: 1 }));
	expect(historicalAccuracy(reviews)).toBe(50);
	expect(historicalAccuracy([])).toBeNull();
});

it('does not let an older same-language reload overwrite a newer snapshot', async () => {
	let finish!: (slugs: string[]) => void;
	const slow = new Promise<string[]>((resolve) => (finish = resolve));
	let readRequests = 0;
	invoke.mockImplementation((command: string) => {
		if (command === 'study_read_slugs') return ++readRequests === 1 ? slow : Promise.resolve(['rag']);
		return Promise.resolve([]);
	});
	const { reload, readStore } = await import('$lib/study');
	const first = reload('en');
	await reload('en');
	finish(['what-is-llm']);
	await first;
	expect([...get(readStore).en]).toEqual(['rag']);
});

it('keeps concurrent language loads in their own editions', async () => {
	let finish!: (slugs: string[]) => void;
	const slow = new Promise<string[]>((resolve) => (finish = resolve));
	invoke.mockImplementation((command: string, args: { lang: string }) => {
		if (command === 'study_read_slugs') return args.lang === 'en' ? slow : Promise.resolve(['rag']);
		return Promise.resolve([]);
	});
	const { ensureLoaded, readStore } = await import('$lib/study');
	const first = ensureLoaded('en');
	await ensureLoaded('ja');
	finish(['what-is-llm']);
	await first;
	expect([...get(readStore).en]).toEqual(['what-is-llm']);
	expect([...get(readStore).ja]).toEqual(['rag']);
});

it('rebuilds cards scheduled by the old web rule from the review log once, with FSRS', async () => {
	vi.unstubAllGlobals(); // 网页版
	localStorage.clear();
	localStorage.setItem('study-migrated', '1');
	const id = 'en:what-is-llm:q01~old';
	// 旧规则下的卡片：答对两次，间隔记成3天
	const old = { id, lang: 'en', slug: 'what-is-llm', qn: 1, qhash: 'q01~old', stability: 3, difficulty: 5, state: 2, due: 1000 + 3 * 86400000, lastReview: 1000, reps: 2, lapses: 0 };
	const reviews = [{ cardId: id, ts: 500, rating: 3, elapsedMs: null, scheduledDays: 1 }, { cardId: id, ts: 1000, rating: 3, elapsedMs: null, scheduledDays: 3 }];
	localStorage.setItem('study-v1', JSON.stringify({ cards: { [id]: old }, reviews, read: {} }));
	vi.resetModules();
	const { ensureLoaded } = await import('$lib/study');
	const { replay } = await import('$lib/fsrs');
	await ensureLoaded('en');
	const saved = JSON.parse(localStorage.getItem('study-v1')!);
	expect(saved.cards[id]).toEqual(replay(old, reviews));
	expect(saved.reviews).toEqual(reviews);
	expect(localStorage.getItem('study-scheduler')).toBe('fsrs-6');
});
