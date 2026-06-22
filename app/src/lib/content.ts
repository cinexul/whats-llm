// 章本文(deflate+Base64 で埋め込み)の読み込み口。
// 章ページと「復習(クイズ抽出)」の両方から使えるよう、glob をここへ集約する。
import { inflateB64 } from './decode';
import type { Lang } from './manifest';

const modules: Record<Lang, Record<string, () => Promise<unknown>>> = {
	zh: import.meta.glob('/src/lib/content/zh/*.md', { query: '?enc', import: 'default' }),
	ja: import.meta.glob('/src/lib/content/ja/*.md', { query: '?enc', import: 'default' }),
	en: import.meta.glob('/src/lib/content/en/*.md', { query: '?enc', import: 'default' })
};

/** その言語にこの章の本文(=非 draft)があるか。 */
export function hasChapterSource(lang: Lang, slug: string): boolean {
	return !!modules[lang][`/src/lib/content/${lang}/${slug}.md`];
}

/** 章本文を復元して返す。draft(本文なし)の場合は null。 */
export async function loadChapterSource(lang: Lang, slug: string): Promise<string | null> {
	const loader = modules[lang][`/src/lib/content/${lang}/${slug}.md`];
	if (!loader) return null;
	return inflateB64((await loader()) as string);
}
