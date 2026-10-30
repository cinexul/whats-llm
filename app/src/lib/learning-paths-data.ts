import definitions from './learning-paths.json' with { type: 'json' };
import { findChapter, type Chapter, type Lang } from './manifest';

type Localized<T> = Record<Lang, T>;
export type LearningPathId = 'orientation' | 'everyday-report' | 'first-project';
export interface LearningStep {
	id: string;
	title: string;
	reading: string;
	chapters: Chapter[];
	action: string;
	deliverable: string;
	checks: string[];
}
export interface LearningPath {
	id: LearningPathId;
	title: string;
	summary: string;
	duration: string;
	prerequisite: string;
	result: string;
	steps: LearningStep[];
}

interface StepCopy extends Omit<LearningStep, 'id' | 'chapters'> {}
interface PathCopy extends Omit<LearningPath, 'id' | 'steps'> {}
interface PathDefinition {
	id: LearningPathId;
	copy: Localized<PathCopy>;
	steps: { id: string; slugs: string[]; copy: Localized<StepCopy> }[];
}

// 各语言版本共用标识和阅读顺序；标题取自书籍目录清单。
export const learningPathDefinitions = definitions as PathDefinition[];

export const learningPaths = Object.fromEntries((['zh', 'ja', 'en'] as Lang[]).map((lang) => [
	lang,
	learningPathDefinitions.map((definition): LearningPath => ({
		id: definition.id,
		...definition.copy[lang],
		steps: definition.steps.map((step) => ({
			id: step.id,
			...step.copy[lang],
			chapters: step.slugs.map((slug) => {
				const chapter = findChapter(lang, slug);
				if (!chapter) throw new Error(`Unknown learning-path chapter: ${lang}/${slug}`);
				return { slug: chapter.slug, title: chapter.title };
			})
		}))
	}))
])) as Record<Lang, LearningPath[]>;
