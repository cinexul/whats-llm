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

it('all concurrent callers wait until saved study data has loaded', async () => {
	let finish!: (slugs: string[]) => void;
	const reads = new Promise<string[]>((resolve) => (finish = resolve));
	invoke.mockImplementation((command: string) =>
		command === 'study_read_slugs' ? reads : Promise.resolve([])
	);
	const { ensureLoaded, readStore } = await import('./study');
	const first = ensureLoaded('en');
	await vi.waitFor(() => expect(invoke).toHaveBeenCalledTimes(2));
	let secondFinished = false;
	const second = ensureLoaded('en').then(() => { secondFinished = true; });
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(secondFinished).toBe(false);
	finish(['what-is-llm']);
	await Promise.all([first, second]);
	expect(get(readStore).en.has('what-is-llm')).toBe(true);
	expect(invoke).toHaveBeenCalledTimes(2);
});

it('retries a failed load instead of permanently treating empty data as loaded', async () => {
	invoke.mockRejectedValue(new Error('temporarily unavailable'));
	const { ensureLoaded, readStore } = await import('./study');
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
	const { ensureLoaded, resetProgress, readStore } = await import('./study');
	const oldLoad = ensureLoaded('en');
	await vi.waitFor(() => expect(invoke).toHaveBeenCalledTimes(2));
	await resetProgress();
	finish(['what-is-llm']);
	await oldLoad;
	await ensureLoaded('en');
	expect([...get(readStore).en]).toEqual([]);
	expect(invoke.mock.calls.filter(([command]) => command === 'study_all_cards')).toHaveLength(2);
});

it('selects unresolved mistakes independently of due dates and supports chapter/topic scopes', async () => {
	const { mistakeCards } = await import('./study');
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
	const { historicalAccuracy } = await import('./study');
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
	const { reload, readStore } = await import('./study');
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
	const { ensureLoaded, readStore } = await import('./study');
	const first = ensureLoaded('en');
	await ensureLoaded('ja');
	finish(['what-is-llm']);
	await first;
	expect([...get(readStore).en]).toEqual(['what-is-llm']);
	expect([...get(readStore).ja]).toEqual(['rag']);
});
