import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { allChapters, type Lang } from '$lib/manifest';
import { splitQuiz, questionHash, questionIdentity, assessmentFingerprint, contentFingerprint, type QuizQuestion } from '$lib/quiz';
import registry from '$lib/question-registry.json';

const languages: Lang[] = ['zh', 'ja', 'en'];
const source = (lang: Lang, slug: string) => readFileSync(new URL(`../../src/lib/content/${lang}/${slug}.md`, import.meta.url), 'utf8');
const questions = (src: string) => splitQuiz(src).quiz!.questions;
const first = () => questions(source('en', 'what-is-llm'))[0];
type Registration = { revision: number; content: string; legacyHash?: string; legacyAssessment?: string };
const registrations = registry as Record<Lang, Record<string, Record<string, Registration>>>;
function expectRegisteredIdentity(q: QuizQuestion, lang: Lang, slug: string, registered: Registration) {
	const assessment = assessmentFingerprint(q);
	const expected = registered.legacyHash && assessment === registered.legacyAssessment
		? registered.legacyHash
		: `${q.id}~${assessment}`;
	expect(questionIdentity(q, lang, slug)).toBe(expected);
}


describe('stable quiz identity', () => {
	it.each(languages)('retains the immutable inventory of 205 legacy scored identities in %s', (lang) => {
		const observationAssessment = questionHash(JSON.stringify([[], null]));
		const legacyScored = Object.values(registrations[lang]).flatMap(Object.values)
			.filter((entry) => entry.legacyHash && entry.legacyAssessment !== observationAssessment);
		expect(legacyScored).toHaveLength(205);
	});

	it.each(languages)('validates current content and compatible assessment identities in %s', (lang) => {
		for (const { slug } of allChapters(lang)) {
			const qs = splitQuiz(source(lang, slug)).quiz?.questions ?? [];
			expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
			for (const q of qs) {
				expect(q.id).toMatch(/^[a-z][a-z0-9-]*$/);
				expect(q.revision).toBeGreaterThanOrEqual(1);
				const registered = registrations[lang][slug][q.id!];
				expect(registered.revision).toBe(q.revision);
				expect(registered.content).toBe(contentFingerprint(q));
				if (q.correct) {
					expectRegisteredIdentity(q, lang, slug, registered);
				}
			}
		}
	});

	it('accepts a prompt edit after the actual registry acknowledgment workflow without replacing the legacy identity', () => {
		const temporary = mkdtempSync(join(tmpdir(), 'quiz-maintenance-'));
		try {
			mkdirSync(join(temporary, 'scripts'), { recursive: true });
			for (const l of languages) mkdirSync(join(temporary, 'src/lib/content', l), { recursive: true });
			writeFileSync(join(temporary, 'package.json'), '{"type":"module"}');
			symlinkSync(fileURLToPath(new URL('../../node_modules', import.meta.url)), join(temporary, 'node_modules'), 'dir');
			copyFileSync(new URL('../../scripts/check-quiz-registry.mjs', import.meta.url), join(temporary, 'scripts/check-quiz-registry.mjs'));
			copyFileSync(new URL('../../src/lib/quiz.ts', import.meta.url), join(temporary, 'src/lib/quiz.ts'));
			copyFileSync(new URL('../../src/lib/question-registry.json', import.meta.url), join(temporary, 'src/lib/question-registry.json'));
			const original = source('en', 'what-is-llm');
			const target = questions(original)[0];
			const targetRegistration = registrations.en['what-is-llm'][target.id!];
			const promptLine = new RegExp(`^(${target.n}\\. .*?)( <!-- quiz: ${target.id} revision: )\\d+( -->)$`, 'm');
			const revised = original.replace(promptLine,
				(_match, prompt: string, marker: string, end: string) => `${prompt} Consider this carefully.${marker}${target.revision + 1}${end}`);
			const revisedQ = questions(revised).find((q) => q.id === target.id)!;
			expect(revisedQ.promptHtml).not.toBe(target.promptHtml);
			writeFileSync(join(temporary, 'src/lib/content/en/what-is-llm.md'), revised);
			const run = (...args: string[]) => execFileSync(process.execPath, ['scripts/check-quiz-registry.mjs', ...args], { cwd: temporary, encoding: 'utf8', stdio: 'pipe' });
			expect(() => run()).toThrow();
			run('--write');
			expect(run()).toContain(`${questions(revised).length} quiz questions verified`);
			const updated = JSON.parse(readFileSync(join(temporary, 'src/lib/question-registry.json'), 'utf8')).en['what-is-llm'][target.id!];
			expect(updated).toEqual({ ...targetRegistration, revision: revisedQ.revision, content: contentFingerprint(revisedQ) });
			expectRegisteredIdentity(revisedQ, 'en', 'what-is-llm', updated);
			const identityAfterReload = execFileSync(process.execPath, ['--input-type=module', '--eval', `
				import { readFileSync } from 'node:fs';
				import { splitQuiz, questionIdentity } from './src/lib/quiz.ts';
				const q = splitQuiz(readFileSync('./src/lib/content/en/what-is-llm.md', 'utf8')).quiz.questions.find((q) => q.id === ${JSON.stringify(target.id)});
				console.log(questionIdentity(q, 'en', 'what-is-llm'));
			`], { cwd: temporary, encoding: 'utf8', stdio: 'pipe' }).trim();
			expect(identityAfterReload).toBe(questionIdentity(target, 'en', 'what-is-llm'));
		} finally {
			rmSync(temporary, { recursive: true, force: true });
		}
	});

	it('keeps mastery through wording edits, content revision bumps and renumbering', () => {
		const original = first();
		const revised = { ...original, n: 7, revision: original.revision + 1, promptHtml: 'A clearer way to ask this question?', explanationHtml: 'A fuller explanation.' };
		expect(questionIdentity(revised, 'en', 'what-is-llm')).toBe(questionIdentity(original, 'en', 'what-is-llm'));
		expect(contentFingerprint(revised)).not.toBe(contentFingerprint(original));
	});

	it('creates a fresh assessment identity when an option changes even without a revision bump', () => {
		const original = first();
		const revised = { ...original, options: original.options.map((o, i) => i ? o : { ...o, html: 'A changed option' }) };
		expect(questionIdentity(revised, 'en', 'what-is-llm')).not.toBe(questionIdentity(original, 'en', 'what-is-llm'));
		expect(questionIdentity({ ...revised, promptHtml: 'Reworded again', revision: 3 }, 'en', 'what-is-llm')).toBe(questionIdentity(revised, 'en', 'what-is-llm'));
	});

	it('creates a fresh assessment identity when the answer key changes', () => {
		const original = first();
		const revised = { ...original, correct: original.options.find((o) => o.letter !== original.correct)!.letter };
		expect(assessmentFingerprint(revised)).not.toBe(assessmentFingerprint(original));
		expect(questionIdentity(revised, 'en', 'what-is-llm')).not.toBe(questionIdentity(original, 'en', 'what-is-llm'));
	});

	it('removes identity metadata from rendered prompts and aligns IDs across editions', () => {
		for (const { slug } of allChapters('zh')) {
			const editions = languages.map((l) => splitQuiz(source(l, slug)).quiz?.questions ?? []);
			for (const qs of editions) {
				expect(qs.map((q) => q.id)).toEqual(editions[0].map((q) => q.id));
				for (const q of qs) expect(q.promptHtml).not.toContain('<!-- quiz:');
			}
		}
	});
});

describe('count text', () => {
	it('picks the English singular or plural and leaves Chinese and Japanese alone', async () => {
		const { countText, ui } = await import('$lib/ui');
		expect(countText(ui.en.duePrompt, 1, 'en')).toBe("1 question is due — let's review");
		expect(countText(ui.en.duePrompt, 3, 'en')).toBe("3 questions are due — let's review");
		expect(`1${countText(ui.en.unitDays, 1, 'en')}`).toBe('1 day');
		expect(`2${countText(ui.en.unitDays, 2, 'en')}`).toBe('2 days');
		expect(countText(ui.zh.duePrompt, 1, 'zh')).toBe('有1道题到期，去复习吧');
		expect(`5${countText(ui.ja.unitDays, 5, 'ja')}`).toBe('5日');
	});
});
