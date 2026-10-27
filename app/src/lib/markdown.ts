// MarkdownをHTMLへ変換する。コードブロックはShikiでハイライトし、
// h2見出しにはidを振って「このページ」用の目次を抽出する。
import { Marked } from 'marked';
import markedCjkFriendly from 'marked-cjk-friendly';
import createDOMPurify from 'dompurify';
import { createHighlighter, type Highlighter, type ShikiTransformer } from 'shiki';
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

function headingId(text: string): string {
	return text.replace(/[\s/\\?#&"'<>]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
}

export async function renderMarkdown(src: string): Promise<RenderedChapter> {
	const highlighter = await getHighlighter();
	const highlightStyles = new Set<string>();
	const highlightClasses = new Set<string>();
	const recordHighlightAttributes: NonNullable<ShikiTransformer['pre']> = (node) => {
		if (typeof node.properties.style === 'string') highlightStyles.add(node.properties.style);
		const classValue = node.properties.class ?? node.properties.className;
		const classes = Array.isArray(classValue) ? classValue.join(' ') : typeof classValue === 'string' ? classValue : '';
		for (const className of classes.split(/\s+/)) {
			if (className) highlightClasses.add(className);
		}
	};

	const marked = new Marked({
		gfm: true,
		walkTokens(token) {
			if (token.type === 'code') {
				const lang = LANGS.includes(token.lang ?? '') ? (token.lang as string) : 'text';
				const html = highlighter.codeToHtml(token.text, {
					lang,
					theme: 'github-dark',
					transformers: [{
						pre: recordHighlightAttributes,
						code: recordHighlightAttributes,
						line: recordHighlightAttributes,
						span: recordHighlightAttributes
					}]
				});
				Object.assign(token, { type: 'html', block: true, text: html + '\n' });
			}
		}
	}).use(markedCjkFriendly());

	let html = marked.parse(src) as string;

	// 在DOM解析并解码实体前，保留旧锚点的编码形式，
	// 确保已保存的链接和语义搜索索引仍然有效。
	const generatedIds = new Set<string>();
	html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
		const id = headingId(inner.replace(/<[^>]+>/g, '').trim());
		generatedIds.add(id);
		return `<h2 id="${id}">${inner}</h2>`;
	});

	// 本地编辑和导入备份均不可信。HTML配置排除SVG/MathML，
	// DOMPurify则移除可执行标签、事件处理器和不安全的URL。
	// 样式和类名必须匹配可信Shiki主题生成的值；这些值取自其语法树，
	// 不能从源文本或用户提供的HTML中提取。
	const purifier = createDOMPurify(window);
	purifier.addHook('uponSanitizeAttribute', (_node, attribute) => {
		if (attribute.attrName === 'style' && !highlightStyles.has(attribute.attrValue)) {
			attribute.keepAttr = false;
		}
		if (attribute.attrName === 'class') {
			attribute.attrValue = attribute.attrValue.split(/\s+/).filter((name) => highlightClasses.has(name)).join(' ');
			if (!attribute.attrValue) attribute.keepAttr = false;
		}
	});
	const fragment = purifier.sanitize(html, {
		USE_PROFILES: { html: true },
		FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'option'],
		SANITIZE_NAMED_PROPS: true,
		RETURN_DOM_FRAGMENT: true
	});
	const legacyIds = new Map<Element, string>();
	for (const element of fragment.querySelectorAll('[id], [name]')) {
		if (element.tagName === 'H2' && element.id.startsWith('user-content-')) {
			const id = element.id.slice('user-content-'.length);
			if (generatedIds.has(id)) legacyIds.set(element, id);
		}
		// 原始HTML不能创建全局名称，也不能与应用锚点冲突。
		element.removeAttribute('id');
		element.removeAttribute('name');
	}

	const toc: TocItem[] = [];
	const used = new Set(['quiz', 'local-editor-title', 'local-markdown']);
	const form = document.createElement('form');
	for (const heading of fragment.querySelectorAll('h2')) {
		// DOM textContent对实体只解码一次，行内代码也一样。
		const text = heading.textContent?.trim() ?? '';
		let id = headingId(legacyIds.get(heading) ?? text);
		while (used.has(id) || id in document || id in form) id += '-';
		used.add(id);
		heading.id = id;
		toc.push({ id, text });
	}

	const template = document.createElement('template');
	template.content.append(fragment);
	return { html: template.innerHTML, toc };
}
