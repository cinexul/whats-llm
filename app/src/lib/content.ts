// 各章正文的读取入口，章节页、复习和全文搜索共用。
import type { Lang } from './manifest';

const modules: Record<Lang, Record<string, () => Promise<unknown>>> = {
	zh: import.meta.glob('/src/lib/content/zh/*.md', { query: '?raw', import: 'default' }),
	ja: import.meta.glob('/src/lib/content/ja/*.md', { query: '?raw', import: 'default' }),
	en: import.meta.glob('/src/lib/content/en/*.md', { query: '?raw', import: 'default' })
};

/** 该语言是否有这一章的正文（draft章没有）。 */
export function hasChapterSource(lang: Lang, slug: string): boolean {
	return !!modules[lang][`/src/lib/content/${lang}/${slug}.md`];
}

/** 返回章节正文；draft章返回null。 */
export async function loadChapterSource(lang: Lang, slug: string): Promise<string | null> {
	const loader = modules[lang][`/src/lib/content/${lang}/${slug}.md`];
	if (!loader) return null;
	return (await loader()) as string;
}
