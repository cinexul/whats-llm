// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

beforeEach(() => { localStorage.clear(); vi.resetModules(); });

it('keeps legacy last-chapter data while storing separate positions per language', async () => {
	localStorage.setItem('reading-chapter', JSON.stringify({ zh: 'rag', en: 'unknown' }));
	const reading = await import('$lib/reading');
	expect(get(reading.readingChapter)).toEqual({ zh: 'rag' });
	const position = { anchor: 'p-example', offset: .25, progress: .4, updatedAt: 100 };
	reading.saveReadingPosition('zh', 'rag', position);
	expect(reading.getReadingPosition('zh', 'rag')).toEqual(position);
	expect(reading.getReadingPosition('en', 'rag')).toBeUndefined();
	vi.resetModules();
	expect((await import('$lib/reading')).getReadingPosition('zh', 'rag')).toEqual(position);
});

it('ignores corrupt positions and reloads imported last-chapter data', async () => {
	localStorage.setItem('reading-positions-v1', JSON.stringify({ zh: {
		rag: { anchor: 'p-x', offset: -1, progress: .5, updatedAt: 100 },
		'what-is-llm': { anchor: 'p-y', offset: .4, progress: 2, updatedAt: 100 }
	} }));
	const reading = await import('$lib/reading');
	expect(reading.getReadingPosition('zh', 'rag')).toBeUndefined();
	expect(reading.getReadingPosition('zh', 'what-is-llm')).toBeUndefined();
	localStorage.setItem('reading-chapter', JSON.stringify({ ja: 'rag' }));
	reading.reloadReading();
	expect(get(reading.readingChapter)).toEqual({ ja: 'rag' });
});

it('uses paragraph text anchors that survive inserting a preceding paragraph', async () => {
	const { anchorReadingBlocks } = await import('$lib/reading');
	const root = document.createElement('div');
	root.innerHTML = '<h2 id="intro">Intro</h2><p>Keep this place.</p><p>Same</p><p>Same</p>';
	anchorReadingBlocks(root);
	const anchor = (root.children[1] as HTMLElement).dataset.readingAnchor;
	expect(anchor).toBeTruthy();
	expect((root.children[2] as HTMLElement).dataset.readingAnchor).not.toBe((root.children[3] as HTMLElement).dataset.readingAnchor);
	root.insertAdjacentHTML('afterbegin', '<p>A new introduction.</p>');
	anchorReadingBlocks(root);
	expect((root.children[2] as HTMLElement).dataset.readingAnchor).toBe(anchor);
});

it('restores a paragraph fraction after text reflows, falling back to progress if removed', async () => {
	const { captureReadingPosition, restoreReadingPosition, anchorReadingBlocks } = await import('$lib/reading');
	const main = document.createElement('main');
	const root = document.createElement('div');
	main.append(root);
	root.innerHTML = '<p>A long paragraph</p>';
	anchorReadingBlocks(root);
	Object.defineProperties(main, { scrollHeight: { value: 2000 }, clientHeight: { value: 500 } });
	main.scrollTop = 400;
	main.getBoundingClientRect = () => ({ top: 100 } as DOMRect);
	const block = root.firstElementChild as HTMLElement;
	block.getBoundingClientRect = () => ({ top: 66, bottom: 266, height: 200 } as DOMRect);
	root.getBoundingClientRect = () => ({ top: 66, bottom: 266 } as DOMRect);
	const position = captureReadingPosition(main, root, 1000);
	expect(position.offset).toBe(.25);
	main.scrollTo = vi.fn((options?: ScrollToOptions | number) => { if (typeof options === 'object') main.scrollTop = options.top ?? 0; });
	// After a wider paragraph wraps into more lines, its height is 400px.
	block.getBoundingClientRect = () => ({ top: 66, bottom: 466, height: 400 } as DOMRect);
	restoreReadingPosition(main, root, position);
	expect(main.scrollTop).toBe(450);
	root.innerHTML = '';
	restoreReadingPosition(main, root, position);
	expect(main.scrollTop).toBe(400);
});
