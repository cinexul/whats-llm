import registrations from './question-registry.json';
import type { Lang } from './manifest';

// The registry is checked against all three editions by check:quiz. Using its
// question entries avoids inventing a quiz for a preface, appendix, or draft.
const registry = registrations as Record<Lang, Record<string, Record<string, unknown>>>;
const readingOnly = { zh: '阅读材料 · 无测验', ja: '読み物 · テストなし', en: 'Reading only · No quiz' };

export function chapterPractice(lang: Lang, chapter: { slug: string; draft?: boolean }) {
	const hasQuiz = !chapter.draft && Object.keys(registry[lang][chapter.slug] ?? {}).length > 0;
	return { hasQuiz, anchor: hasQuiz ? '#quiz' : '', readingOnly: readingOnly[lang] };
}
