import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { findChapter } from '$lib/manifest';
import { renderMarkdown } from '$lib/markdown';
import { splitQuiz, type Quiz } from '$lib/quiz';
import { loadChapterSource } from '$lib/content';
import { lang } from '$lib/lang';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, depends }) => {
	// 言語切替時に再読み込みさせるための依存(レイアウト側で invalidate する)
	depends('app:lang');

	const currentLang = get(lang);
	const meta = findChapter(currentLang, params.slug);

	// 章自体が見つからない場合のみ 404。draft 章は本文が無くてもプレースホルダを返す。
	if (!meta) error(404, '章が見つかりません');

	const src = await loadChapterSource(currentLang, params.slug);
	if (src == null) {
		// 準備中(draft)の章: プレースホルダを表示する
		return {
			lang: currentLang,
			slug: meta.slug,
			title: meta.title,
			partTitle: meta.partTitle,
			prev: meta.prev,
			next: meta.next,
			html: null as string | null,
			toc: [],
			quiz: null as Quiz | null,
			draft: true
		};
	}
	// 章末の小テストは構造化して別途インタラクティブに描画する(本文からは切り出す)
	const { body, quiz } = splitQuiz(src);
	const { html, toc } = await renderMarkdown(body);
	if (quiz)
		toc.push({ id: 'quiz', text: { zh: '小测验', ja: '小テスト', en: 'Quiz' }[currentLang] });

	return {
		lang: currentLang,
		slug: meta.slug,
		title: meta.title,
		partTitle: meta.partTitle,
		prev: meta.prev,
		next: meta.next,
		html: html as string | null,
		toc,
		quiz,
		draft: false
	};
};
