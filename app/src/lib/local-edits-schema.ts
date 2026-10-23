import { allChapters, languages, type Lang } from './manifest';

export const LOCAL_EDITS_KEY = 'chapter-edits-v1';
export const LOCAL_EDITS_SIGNAL_KEY = 'chapter-edits-updated-v1';
export const MAX_LOCAL_EDIT_CHARACTERS = 200_000;
export const MAX_LOCAL_EDITS_CHARACTERS = 2_000_000;
export const MAX_LOCAL_EDITS_RECORDS = 135;
export const MAX_LOCAL_EDIT_TIMESTAMP = 8_640_000_000_000_000;

export interface LocalChapterEdit {
	lang: Lang;
	slug: string;
	/** null is a reset tombstone, retained so an older backup cannot restore a deleted edit. */
	markdown: string | null;
	/** The official body captured on first save, or first save after a reset. */
	original: string;
	updatedAt: number;
}

export type LocalEditErrorCode = 'storage' | 'invalid-data' | 'conflict' | 'too-large' | 'unsupported';

export class LocalEditError extends Error {
	constructor(public readonly code: LocalEditErrorCode, message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'LocalEditError';
	}
}

const supportedChapters = new Set(languages.flatMap(({ code }) =>
	allChapters(code).map(({ slug }) => `${code}:${slug}`)
));
const fields = new Set(['lang', 'slug', 'markdown', 'original', 'updatedAt']);

function invalid(message: string): never {
	throw new LocalEditError('invalid-data', `Invalid local chapter edits: ${message}`);
}

/** Validate the entire snapshot without filtering out, coercing, or mutating user data. */
export function validateLocalEdits(value: unknown): asserts value is LocalChapterEdit[] {
	if (!Array.isArray(value)) invalid('expected an array');
	if (value.length > MAX_LOCAL_EDITS_RECORDS) throw new LocalEditError('too-large', 'Too many local chapter edits');
	const seen = new Set<string>();
	let characters = 0;
	for (const item of value) {
		if (item === null || typeof item !== 'object' || Array.isArray(item)) invalid('expected a chapter record');
		const record = item as Record<string, unknown>;
		if (Object.keys(record).some((field) => !fields.has(field))) invalid('unknown record field');
		if (typeof record.lang !== 'string' || typeof record.slug !== 'string') invalid('chapter identity');
		const identity = `${record.lang}:${record.slug}`;
		if (!supportedChapters.has(identity)) invalid('unsupported chapter or language');
		if (seen.has(identity)) invalid('duplicate chapter and language');
		seen.add(identity);
		if (record.markdown !== null && typeof record.markdown !== 'string') invalid('markdown');
		if (typeof record.original !== 'string') invalid('original');
		if ((record.markdown?.length ?? 0) > MAX_LOCAL_EDIT_CHARACTERS || record.original.length > MAX_LOCAL_EDIT_CHARACTERS) {
			throw new LocalEditError('too-large', 'Local chapter body exceeds 200,000 characters');
		}
		characters += (record.markdown?.length ?? 0) + record.original.length;
		if (characters > MAX_LOCAL_EDITS_CHARACTERS) throw new LocalEditError('too-large', 'Local chapter edits exceed 2,000,000 characters');
		if (typeof record.updatedAt !== 'number' || !Number.isSafeInteger(record.updatedAt) || record.updatedAt < 0 || record.updatedAt > MAX_LOCAL_EDIT_TIMESTAMP) {
			invalid('updatedAt');
		}
	}
}
