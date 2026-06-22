// Markdown を HTML へ変換する。コードブロックは Shiki でハイライトし、
// h2 見出しには id を振って「このページ」用の目次を抽出する。
import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const LANGS = ['bash', 'typescript', 'javascript', 'json', 'yaml', 'markdown', 'diff', 'html'];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark'],
			langs: LANGS,
			engine: createJavaScriptRegexEngine()
		});
	}
	return highlighterPromise;
}

export interface TocItem {
	id: string;
	text: string;
}

export interface RenderedChapter {
	html: string;
	toc: TocItem[];
}

export async function renderMarkdown(src: string): Promise<RenderedChapter> {
	const highlighter = await getHighlighter();

	const marked = new Marked({
		gfm: true,
		walkTokens(token) {
			if (token.type === 'code') {
				const lang = LANGS.includes(token.lang ?? '') ? (token.lang as string) : 'text';
				const html = highlighter.codeToHtml(token.text, { lang, theme: 'github-dark' });
				Object.assign(token, { type: 'html', block: true, text: html + '\n' });
			}
		}
	});

	let html = marked.parse(src) as string;

	// h2 に id を付与し、目次を抽出する
	const toc: TocItem[] = [];
	const used = new Set<string>();
	html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
		const text = inner.replace(/<[^>]+>/g, '').trim();
		let id = text.replace(/[\s/\\?#&"'<>]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
		while (used.has(id)) id += '-';
		used.add(id);
		toc.push({ id, text });
		return `<h2 id="${id}">${inner}</h2>`;
	});

	return { html, toc };
}
