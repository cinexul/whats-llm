// 本書の章構成(目次)。データは言語別に toc.json へ分離してある。
// サイドバー・前後ナビ・検索はすべてここを参照する。
import tocData from './toc.json';

export interface Chapter {
	slug: string;
	title: string;
	draft?: boolean;
}

export interface Part {
	title: string;
	chapters: Chapter[];
}

// 対応言語。zh = 中文版《What's LLM》, ja = 日本語版《What's LLM》
export type Lang = 'zh' | 'ja' | 'en';

export const languages: { code: Lang; label: string }[] = [
	{ code: 'zh', label: '中文' },
	{ code: 'ja', label: '日本語' },
	{ code: 'en', label: 'English' }
];

// 言語別の目次。サイドバー・トップページ・検索はこの言語別 parts を参照する。
export const manifests: Record<Lang, Part[]> = tocData as Record<Lang, Part[]>;

// 指定言語の全章をフラット化して返す
export function allChapters(lang: Lang): Chapter[] {
	return manifests[lang].flatMap((p) => p.chapters);
}

// 指定言語の中から slug の章を探し、所属部・前後章を付けて返す。前後章は同じ言語内に限る。
export function findChapter(lang: Lang, slug: string) {
	const parts = manifests[lang];
	const flat = allChapters(lang);
	for (const part of parts) {
		const idx = part.chapters.findIndex((c) => c.slug === slug);
		if (idx >= 0) {
			const flatIdx = flat.findIndex((c) => c.slug === slug);
			return {
				...part.chapters[idx],
				partTitle: part.title,
				prev: flatIdx > 0 ? flat[flatIdx - 1] : null,
				next: flatIdx < flat.length - 1 ? flat[flatIdx + 1] : null
			};
		}
	}
	return null;
}
