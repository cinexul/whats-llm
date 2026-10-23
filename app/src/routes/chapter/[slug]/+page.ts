import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { findChapter } from '$lib/manifest';
import { renderMarkdown } from '$lib/markdown';
import { splitQuiz, type Quiz } from '$lib/quiz';
import { loadChapterSource } from '$lib/content';
import { lang } from '$lib/lang';
import { getLocalEditRecord, LocalEditError, type LocalChapterEdit } from '$lib/local-edits';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, depends, url }) => {
	// 言語切替時に再読み込みさせるための依存(レイアウト側で invalidate する)
	depends('app:lang');
	depends('app:chapter-edits');
	// Library links identify the edited language, including when opened in a new tab.
	const edition = url.searchParams.get('edition');
	// Load also runs during hover prefetch: it must not change language preferences.
	const currentLang = edition === 'zh' || edition === 'ja' || edition === 'en' ? edition : get(lang);
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
			originalBody: '',
			localEdit: undefined as LocalChapterEdit | undefined,
			localEditError: null as string | null,
			toc: [],
			quiz: null as Quiz | null,
			draft: true
		};
	}
	// 章末の小テストは構造化して別途インタラクティブに描画する(本文からは切り出す)
	const { body, quiz } = splitQuiz(src);
	let localEdit: LocalChapterEdit | undefined;
	let localEditError: string | null = null;
	try { localEdit = await getLocalEditRecord(currentLang, params.slug); }
	catch (cause) { localEditError = cause instanceof LocalEditError ? cause.code : 'storage'; }
	const { html, toc } = await renderMarkdown(localEdit?.markdown ?? body);
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
		originalBody: body,
		localEdit,
		localEditError,
		toc,
		quiz,
		draft: false
	};
};
