// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

it('shows decoded heading text in the contents while preserving existing section links', async () => {
	const result = await renderMarkdown('## "AI" & **memory**\n\n## "AI" & **memory**\n\n## A &lt; B &#x1F4D6;');
	expect(result.toc.map((item) => item.text)).toEqual(['"AI" & memory', '"AI" & memory', 'A < B 📖']);
	expect(result.toc.slice(0, 2).map((item) => item.id)).toEqual(['quot;AI-quot;-amp;-memory', 'quot;AI-quot;-amp;-memory-']);
	for (const item of result.toc) expect(result.html).toContain(`id="${item.id}"`);
});

it('decodes the reported Token heading while keeping its legacy anchor', async () => {
	const result = await renderMarkdown('## 一、Token：AI 切分文字的 &quot;颗粒&quot;');
	expect(result.toc).toEqual([
		{ id: '一、Token：AI-切分文字的-quot;颗粒-quot;', text: '一、Token：AI 切分文字的 "颗粒"' }
	]);
});

it('decodes heading entities only once, including literal entities inside inline code', async () => {
	const result = await renderMarkdown('## &amp;quot;literal&amp;quot; and `&quot;code&quot;` and `<tag>`');
	expect(result.toc[0].text).toBe('&quot;literal&quot; and &quot;code&quot; and <tag>');
	expect(result.toc[0].id).toBe('amp;quot;literal-amp;quot;-and-amp;quot;code-amp;quot;-and-lt;tag-gt;');
});

function parseHtml(html: string): DocumentFragment {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content;
}

describe('untrusted chapter Markdown', () => {
	it('keeps user headings distinct from editor labels and the official quiz', async () => {
		const result = await renderMarkdown('## local-editor-title\n\n## local-markdown\n\n## quiz');
		expect(result.toc.map(({ id }) => id)).toEqual(['local-editor-title-', 'local-markdown-', 'quiz-']);
	});
	it('removes executable HTML, event handlers, and dangerous link URLs', async () => {
		const result = await renderMarkdown(`## Safe <script>alert('heading')</script> heading

<script>alert('body')</script>
<img src="missing.png" onerror="alert(1)">
<a href="java&#x73;cript:alert(1)" onclick="alert(1)">unsafe</a>
<a href="https://example.com" title="safe">safe</a>
<iframe srcdoc="<script>alert(1)</script>"></iframe>
<object data="javascript:alert(1)"></object>
<embed src="javascript:alert(1)">
<svg><a xlink:href="javascript:alert(1)">svg</a></svg>
<math><mtext>math</mtext></math>
<style>body { display: none; }</style>`);
		const fragment = parseHtml(result.html);
		expect(fragment.querySelector('script, iframe, object, embed, svg, math, style')).toBeNull();
		for (const element of fragment.querySelectorAll('*')) {
			for (const attribute of element.attributes) {
				expect(attribute.name).not.toMatch(/^on/i);
				if (['href', 'src', 'xlink:href'].includes(attribute.name)) {
					expect(attribute.value).not.toMatch(/^\s*javascript:/i);
				}
			}
		}
		expect(fragment.querySelector('a[href="https://example.com"]')?.textContent).toBe('safe');
		expect(result.toc[0].text).toBe('Safe  heading');
	});

	it('removes user IDs and names and keeps generated headings away from DOM properties and quiz', async () => {
		const result = await renderMarkdown(`<form id="app"><input name="innerHTML"></form>
<a id="quiz" name="location">link</a>
<p id="untrusted-name">text</p>

## quiz

## quiz

## constructor

## location`);
		const fragment = parseHtml(result.html);
		expect(fragment.querySelector('[name], form, input')).toBeNull();
		expect(fragment.querySelector('a')?.hasAttribute('id')).toBe(false);
		expect(fragment.querySelector('p[id]')).toBeNull();
		expect(result.toc.map((item) => item.id)).toEqual(['quiz-', 'quiz--', 'constructor-', 'location-']);
		expect(Array.from(fragment.querySelectorAll('[id]'), (element) => element.id)).toEqual(result.toc.map((item) => item.id));
	});

	it('derives raw HTML heading anchors from their labels instead of accepting supplied IDs', async () => {
		const result = await renderMarkdown('<h2 id="app-settings" name="configuration">Custom heading</h2>');
		expect(result.toc).toEqual([{ id: 'Custom-heading', text: 'Custom heading' }]);
		expect(result.html).not.toContain('app-settings');
		expect(result.html).not.toContain('name=');
	});

	it('removes user CSS that hides or overlays the page while retaining Shiki styles', async () => {
		const result = await renderMarkdown(`<div style="position:fixed;inset:0;z-index:999999">Overlay text</div>
<p style="display:none">Hidden text</p>
<pre class="shiki" style="position:fixed;inset:0">Fake highlighted block</pre>
<span style="background-image:url(https://example.com/tracker)">Remote CSS</span>

\`\`\`html
<div style="position:fixed;display:none">Literal example</div>
\`\`\`

\`\`\`typescript
const answer: number = 42;
\`\`\``);
		const fragment = parseHtml(result.html);
		expect(fragment.querySelector('div')?.getAttribute('style')).toBeNull();
		expect(fragment.querySelector('p')?.getAttribute('style')).toBeNull();
		expect(fragment.querySelector('div')?.textContent).toBe('Overlay text');
		expect(fragment.querySelector('p')?.textContent).toBe('Hidden text');
		expect(fragment.querySelector('pre.shiki')?.getAttribute('style')).toBeNull();
		for (const element of fragment.querySelectorAll('[style]')) {
			expect(element.getAttribute('style')).not.toMatch(/position|display|inset|z-index|url\(/i);
		}
		expect(fragment.querySelectorAll('pre.shiki[style*="background-color"]')).toHaveLength(2);
		expect(fragment.querySelector('pre.shiki span[style*="color"]')).not.toBeNull();
		expect(fragment.querySelector('pre.shiki code')?.textContent).toBe('<div style="position:fixed;display:none">Literal example</div>');
	});

	it('removes application classes and retains only classes emitted by Shiki', async () => {
		const result = await renderMarkdown(`<div class="dialog-overlay svelte-app">Visible text</div>
<span class="line editor-dialog svelte-app">Mixed classes</span>

\`\`\`typescript
const answer = 42;
\`\`\``);
		const fragment = parseHtml(result.html);
		expect(fragment.querySelector('div')?.getAttribute('class')).toBeNull();
		expect(fragment.querySelector('div')?.textContent).toBe('Visible text');
		expect(fragment.querySelector('span')?.getAttribute('class')).toBe('line');
		expect(fragment.querySelector('pre.shiki.github-dark code span.line')).not.toBeNull();
		for (const element of fragment.querySelectorAll('[class]')) {
			for (const className of element.classList) {
				expect(['shiki', 'github-dark', 'line']).toContain(className);
			}
		}
		const withoutCode = await renderMarkdown('<div class="shiki github-dark line">Plain text</div>');
		expect(parseHtml(withoutCode.html).querySelector('[class]')).toBeNull();
	});

	it('preserves highlighted code, literal attack examples, and ordinary Markdown', async () => {
		const result = await renderMarkdown(`## Examples

**Bold** and *emphasis* with [a link](https://example.com).

| A | B |
| - | - |
| 1 | 2 |

\`\`\`html
<img src=x onerror="alert(1)">
\`\`\`

\`\`\`typescript
const answer: number = 42;
\`\`\``);
		const fragment = parseHtml(result.html);
		expect(fragment.querySelector('strong')?.textContent).toBe('Bold');
		expect(fragment.querySelector('em')?.textContent).toBe('emphasis');
		expect(fragment.querySelectorAll('table tr')).toHaveLength(2);
		expect(fragment.querySelector('pre.shiki code')?.textContent).toBe('<img src=x onerror="alert(1)">');
		expect(fragment.querySelector('img')).toBeNull();
		expect(fragment.querySelectorAll('pre.shiki')).toHaveLength(2);
		expect(fragment.querySelector('pre.shiki span[style*="color"]')).not.toBeNull();
	});
});
