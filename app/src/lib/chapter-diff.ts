import { diffLines } from 'diff';

export interface ChapterDiffPart {
	kind: 'same' | 'added' | 'removed';
	text: string;
	count: number;
}

export interface ChapterDiff {
	parts: ChapterDiffPart[];
	added: number;
	removed: number;
	fallback: boolean;
}

// Bound tokenization as well as the diff search so imported chapters cannot
// monopolize the UI. The fallback still retains both complete original texts.
const MAX_INPUT_CHARACTERS = 500_000;
const MAX_EDIT_LENGTH = 1_000;
const DIFF_TIMEOUT_MS = 50;

function countLines(text: string): number {
	if (!text) return 0;
	let count = text.endsWith('\n') ? 0 : 1;
	for (let index = 0; index < text.length; index++) {
		if (text[index] === '\n') count++;
	}
	return count;
}

export function chapterDiff(before: string, after: string): ChapterDiff {
	if (before === after) {
		return {
			parts: before ? [{ kind: 'same', text: before, count: countLines(before) }] : [],
			added: 0,
			removed: 0,
			fallback: false
		};
	}

	const changes = before.length + after.length <= MAX_INPUT_CHARACTERS
		? diffLines(before, after, {
			maxEditLength: MAX_EDIT_LENGTH,
			timeout: DIFF_TIMEOUT_MS,
			ignoreWhitespace: false,
			stripTrailingCr: false,
			newlineIsToken: false,
			ignoreNewlineAtEof: false
		})
		: undefined;

	if (!changes) {
		const removed = countLines(before);
		const added = countLines(after);
		const parts: ChapterDiffPart[] = [];
		if (before) parts.push({ kind: 'removed', text: before, count: removed });
		if (after) parts.push({ kind: 'added', text: after, count: added });
		return { parts, added, removed, fallback: true };
	}

	const parts: ChapterDiffPart[] = changes.filter((change) => change.value.length > 0).map((change) => ({
		kind: change.added ? 'added' : change.removed ? 'removed' : 'same',
		text: change.value,
		count: change.count
	}));
	return {
		parts,
		added: parts.reduce((count, part) => count + (part.kind === 'added' ? part.count : 0), 0),
		removed: parts.reduce((count, part) => count + (part.kind === 'removed' ? part.count : 0), 0),
		fallback: false
	};
}
