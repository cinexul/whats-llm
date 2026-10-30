import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allChapters } from '$lib/manifest';
import { splitQuiz } from '$lib/quiz';
import { chapterPractice } from '$lib/chapter-practice';

describe('progress links reflect actual quizzes', () => {
	for (const lang of ['zh', 'ja', 'en'] as const) {
		it(`${lang}: distinguishes reading-only material from every chapter with questions`, () => {
			for (const chapter of allChapters(lang)) {
				const source = readFileSync(new URL(`../../src/lib/content/${lang}/${chapter.slug}.md`, import.meta.url), 'utf8');
				const hasQuiz = !!splitQuiz(source).quiz?.questions.length;
				const result = chapterPractice(lang, chapter);
				expect(result.hasQuiz, chapter.slug).toBe(hasQuiz);
				expect(result.anchor, chapter.slug).toBe(hasQuiz ? '#quiz' : '');
			}
		});
	}
	it('does not offer a quiz for drafts or unknown chapters', () => {
		expect(chapterPractice('zh', { slug: 'token-and-context', draft: true }).hasQuiz).toBe(false);
		expect(chapterPractice('zh', { slug: 'missing' }).anchor).toBe('');
	});
});
