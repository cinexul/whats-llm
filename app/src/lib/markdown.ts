// Markdown を HTML へ変換する。コードブロックは Shiki でハイライトし、
// h2 見出しには id を振って「このページ」用の目次を抽出する。
import { Marked } from 'marked';
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
	});

	let html = marked.parse(src) as string;

	// Preserve the encoded spelling of legacy anchors before DOM parsing decodes
	// entities. This also keeps saved links and semantic search indices valid.
	const generatedIds = new Set<string>();
	html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
		const id = headingId(inner.replace(/<[^>]+>/g, '').trim());
		generatedIds.add(id);
		return `<h2 id="${id}">${inner}</h2>`;
	});

	// Local edits and imported backups are untrusted. The HTML profile excludes
	// SVG/MathML, and DOMPurify removes executable tags, handlers, and unsafe URLs.
	// Styles and classes must match values emitted by the trusted Shiki theme,
	// read from its syntax tree rather than source text or user-supplied HTML.
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
		// Raw HTML cannot create global names or collide with application anchors.
		element.removeAttribute('id');
		element.removeAttribute('name');
	}

	const toc: TocItem[] = [];
	const used = new Set(['quiz', 'local-editor-title', 'local-markdown']);
	const form = document.createElement('form');
	for (const heading of fragment.querySelectorAll('h2')) {
		// DOM textContent decodes entities exactly once, including inline code.
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
