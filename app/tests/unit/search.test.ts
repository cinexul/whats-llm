import { describe, expect, it } from 'vitest';
import { fullTextSearch } from '$lib/search';

describe('visible book text search', () => {
	it('finds commands inside fenced code blocks', async () => {
		const hits = await fullTextSearch('zh', 'practice/codex-first-task');
		expect(hits.some((hit) => hit.slug === 'codex-handson')).toBe(true);
		expect(hits.find((hit) => hit.slug === 'codex-handson')?.snippet).toContain('<mark>practice/codex-first-task</mark>');
	});
	it('does not index hidden quiz maintenance comments in any edition', async () => {
		for (const lang of ['zh', 'ja', 'en'] as const) {
			expect(await fullTextSearch(lang, 'quiz: q01 revision:')).toEqual([]);
		}
	});
	it('still finds regular prose and escapes snippets', async () => {
		const hits = await fullTextSearch('zh', 'token');
		expect(hits[0].slug).toBe('token-and-context');
		expect(hits.some((hit) => hit.snippet.includes('<!--'))).toBe(false);
	});
});
