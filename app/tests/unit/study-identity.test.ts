// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { get } from 'svelte/store';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { splitQuiz, questionIdentity, assessmentFingerprint } from '$lib/quiz';
import registry from '$lib/question-registry.json';

const { chapterSource } = vi.hoisted(() => ({ chapterSource: vi.fn() }));
vi.mock('$lib/content', () => ({ loadChapterSource: chapterSource }));
const source = readFileSync('src/lib/content/en/what-is-llm.md', 'utf8');
// 改写第一题的题干或第一个选项，不依赖书里的具体措辞
const firstPrompt = /^(1\. .*?)( <!-- quiz: q01 revision: )(\d+)( -->)$/m;
const firstOption = /^(\s+- A\. ).*$/m;
const rewordPrompt = (text: string) => text.replace(firstPrompt, (_m, prompt: string, marker: string, revision: string, end: string) => `${prompt} Answer carefully.${marker}${Number(revision) + 1}${end}`);
const reviseOption = (text: string) => text.replace(firstOption, '$1A newly revised distractor');

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
	localStorage.setItem('study-migrated', '1');
	chapterSource.mockReset().mockResolvedValue(source);
});

afterEach(() => { vi.doUnmock('$lib/question-registry.json'); });

it('keeps an existing mastered legacy card active after a wording edit', async () => {
	const q = splitQuiz(source).quiz!.questions[0];
	// 旧版本按题干哈希存卡片。登记表记着这道题当初的哈希和选项指纹；
	// 这里把它登记成“选项没变过”，只看改题干时旧卡片是否还在
	const qhash = 'legacyq01';
	const entry = { ...registry.en['what-is-llm'].q01, legacyHash: qhash, legacyAssessment: assessmentFingerprint(q) };
	vi.doMock('$lib/question-registry.json', () => ({ default: { ...registry, en: { ...registry.en, 'what-is-llm': { ...registry.en['what-is-llm'], q01: entry } } } }));
	const id = `en:what-is-llm:${qhash}`;
	const card = { id, lang: 'en', slug: 'what-is-llm', qn: q.n, qhash, stability: 30, difficulty: 5, state: 2, due: 1, lastReview: 1, reps: 5, lapses: 0 };
	localStorage.setItem('study-v1', JSON.stringify({ cards: { [id]: card }, reviews: [], read: {} }));
	const reworded = rewordPrompt(source);
	expect(reworded).not.toBe(source);
	chapterSource.mockResolvedValue(reworded);
	const { reload, cardsStore } = await import('$lib/study');
	expect(await reload('en')).toBe(true);
	expect(get(cardsStore).en).toEqual([card]);
});

it('retires a changed assessment without deleting its history and starts its new card fresh', async () => {
	const q = splitQuiz(source).quiz!.questions[0];
	const { recordAnswer, reload, cardsStore, fetchReviews } = await import('$lib/study');
	await recordAnswer('en', 'what-is-llm', q.n, questionIdentity(q, 'en', 'what-is-llm'), true);
	const revised = reviseOption(source);
	expect(revised).not.toBe(source);
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
