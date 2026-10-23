// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { get } from 'svelte/store';
import { beforeEach, expect, it, vi } from 'vitest';
import { splitQuiz, questionHash, questionIdentity } from './quiz';

const { chapterSource } = vi.hoisted(() => ({ chapterSource: vi.fn() }));
vi.mock('./content', () => ({ loadChapterSource: chapterSource }));
const source = readFileSync('src/lib/content/en/what-is-llm.md', 'utf8');

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
	localStorage.setItem('study-migrated', '1');
	chapterSource.mockReset().mockResolvedValue(source);
});

it('keeps an existing mastered legacy card active after a wording edit', async () => {
	const q = splitQuiz(source).quiz!.questions[0];
	const qhash = questionHash(q.promptHtml);
	const id = `en:what-is-llm:${qhash}`;
	const card = { id, lang: 'en', slug: 'what-is-llm', qn: q.n, qhash, stability: 30, difficulty: 5, state: 2, due: 1, lastReview: 1, reps: 5, lapses: 0 };
	localStorage.setItem('study-v1', JSON.stringify({ cards: { [id]: card }, reviews: [], read: {} }));
	chapterSource.mockResolvedValue(source.replace("What's the most fitting way", "Which is the clearest way").replace('q01 revision: 1', 'q01 revision: 2'));
	const { reload, cardsStore } = await import('./study');
	expect(await reload('en')).toBe(true);
	expect(get(cardsStore).en).toEqual([card]);
});

it('retires a changed assessment without deleting its history and starts its new card fresh', async () => {
	const q = splitQuiz(source).quiz!.questions[0];
	const { recordAnswer, reload, cardsStore, fetchReviews } = await import('./study');
	await recordAnswer('en', 'what-is-llm', q.n, questionIdentity(q, 'en', 'what-is-llm'), true);
	const revised = source.replace('The original-text records it stores, one by one', 'A newly revised distractor');
	chapterSource.mockResolvedValue(revised);
	await reload('en');
	expect(get(cardsStore).en).toHaveLength(0);
	expect(await fetchReviews('en')).toHaveLength(1);
	const revisedQ = splitQuiz(revised).quiz!.questions[0];
	await recordAnswer('en', 'what-is-llm', revisedQ.n, questionIdentity(revisedQ, 'en', 'what-is-llm'), true);
	expect(get(cardsStore).en).toHaveLength(1);
	expect(get(cardsStore).en[0].reps).toBe(1);
	const saved = JSON.parse(localStorage.getItem('study-v1')!);
	expect(Object.keys(saved.cards)).toHaveLength(2);
	expect(saved.reviews).toHaveLength(2);
});
