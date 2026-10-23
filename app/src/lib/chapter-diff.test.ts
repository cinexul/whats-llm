import { describe, expect, it } from 'vitest';
import { chapterDiff } from './chapter-diff';

describe('chapterDiff', () => {
	it('groups unchanged, removed, and added full lines with accurate totals', () => {
		expect(chapterDiff('Title\nold line\nlast', 'Title\nnew line\nextra line\nlast')).toEqual({
			parts: [
				{ kind: 'same', text: 'Title\n', count: 1 },
				{ kind: 'removed', text: 'old line\n', count: 1 },
				{ kind: 'added', text: 'new line\nextra line\n', count: 2 },
				{ kind: 'same', text: 'last', count: 1 }
			],
			added: 2,
			removed: 1,
			fallback: false
		});
	});

	it.each([
		['', ''],
		['', 'new\n\n'],
		['old\n', ''],
		['a\r\nb\r\n', 'a\r\nc\r\n'],
		['a\n', 'a'],
		['space  \n\tindent\n', 'space\n  indent\n'],
		['中文 📖\n<script>alert(1)</script>\n', '中文 📖\n<img onerror="alert(1)">\n'],
		['\n\nlast', '\nfirst\nlast\n']
	])('reconstructs both inputs exactly: %j to %j', (before, after) => {
		const result = chapterDiff(before, after);
		expect(result.parts.filter((part) => part.kind !== 'added').map((part) => part.text).join('')).toBe(before);
		expect(result.parts.filter((part) => part.kind !== 'removed').map((part) => part.text).join('')).toBe(after);
		expect(result.parts.every((part) => part.text.length > 0 && part.count > 0)).toBe(true);
		expect(result.added).toBe(result.parts.filter((part) => part.kind === 'added').reduce((count, part) => count + part.count, 0));
		expect(result.removed).toBe(result.parts.filter((part) => part.kind === 'removed').reduce((count, part) => count + part.count, 0));
	});

	it('counts a changed end-of-file newline as a full-line replacement', () => {
		expect(chapterDiff('line', 'line\n')).toEqual({
			parts: [
				{ kind: 'removed', text: 'line', count: 1 },
				{ kind: 'added', text: 'line\n', count: 1 }
			],
			added: 1,
			removed: 1,
			fallback: false
		});
	});

	it('does not count a phantom line after a trailing newline', () => {
		expect(chapterDiff('', '\n\n').added).toBe(2);
		expect(chapterDiff('one\ntwo\n', '').removed).toBe(2);
		expect(chapterDiff('', '').parts).toEqual([]);
	});

	it('falls back to complete removal/addition for a large disjoint diff', () => {
		const before = Array.from({ length: 4_000 }, (_, index) => `old ${index}\r\n`).join('');
		const after = Array.from({ length: 4_000 }, (_, index) => `new ${index}\n`).join('');
		expect(chapterDiff(before, after)).toEqual({
			parts: [
				{ kind: 'removed', text: before, count: 4_000 },
				{ kind: 'added', text: after, count: 4_000 }
			],
			added: 4_000,
			removed: 4_000,
			fallback: true
		});
	});

	it('bounds very large inputs before line tokenization', () => {
		const before = 'a'.repeat(1_000_000);
		const after = `${before}\n`;
		expect(chapterDiff(before, after)).toEqual({
			parts: [
				{ kind: 'removed', text: before, count: 1 },
				{ kind: 'added', text: after, count: 1 }
			],
			added: 1,
			removed: 1,
			fallback: true
		});
	});

	it('recognizes identical large input without entering the diff algorithm', () => {
		const text = 'unchanged\n'.repeat(100_000);
		expect(chapterDiff(text, text)).toEqual({
			parts: [{ kind: 'same', text, count: 100_000 }],
			added: 0,
			removed: 0,
			fallback: false
		});
	});
});
