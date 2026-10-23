import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { splitQuiz } from './quiz';
import { manifests, type Lang } from './manifest';

const languages: Lang[] = ['zh', 'ja', 'en'];
const source = (lang: Lang, slug: string) =>
	readFileSync(new URL(`./content/${lang}/${slug}.md`, import.meta.url), 'utf8');

describe.each(languages)('%s book integrity', (lang) => {
	const chapters = manifests[lang].flatMap((part) => part.chapters);
	it('has exactly one source for every chapter and matching chapter order across editions', () => {
		const slugs = chapters.map((chapter) => chapter.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).toEqual(manifests.zh.flatMap((part) => part.chapters.map((c) => c.slug)));
		const files = readdirSync(fileURLToPath(new URL(`./content/${lang}/`, import.meta.url)))
			.filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
		expect(files.sort()).toEqual([...slugs].sort());
	});

	for (const { slug } of chapters) {
		it(`${slug}: renders a complete body and valid, aligned quiz`, () => {
			const { body, quiz } = splitQuiz(source(lang, slug));
			expect(body.trim().length).toBeGreaterThan(100);
			if (slug === 'how-to-use-this-book' || slug.startsWith('appendix-')) return;
			expect(quiz?.questions).toHaveLength(6);
			const reference = splitQuiz(source('zh', slug)).quiz!;
			for (const [index, q] of quiz!.questions.entries()) {
				expect(q.n).toBe(index + 1);
				expect(q.promptHtml.trim()).not.toBe('');
				expect(q.explanationHtml.length).toBeGreaterThan(10);
				expect(q.options.length).toBe(reference.questions[index].options.length);
				if (q.options.length) {
					expect(q.options.map((o) => o.letter)).toEqual(['A', 'B', 'C', 'D']);
					expect(q.options.map((o) => o.letter)).toContain(q.correct);
					expect(q.correct).toBe(reference.questions[index].correct);
				}
			}
		});
	}

	it('cannot be passed by always choosing the same letter', () => {
		const answers = chapters.flatMap(({ slug }) =>
			splitQuiz(source(lang, slug)).quiz?.questions.flatMap((q) => q.correct ? [q.correct] : []) ?? []
		);
		expect(answers.length).toBeGreaterThan(100);
		for (const letter of ['A', 'B', 'C', 'D']) {
			const share = answers.filter((answer) => answer === letter).length / answers.length;
			expect(share).toBeGreaterThan(0.1);
			expect(share).toBeLessThan(0.5);
		}
	});
});
