import type { Lang } from './manifest';

export const CONTENT_LANGUAGES: Lang[] = ['zh', 'ja', 'en'];
export const REVIEW_INTERVALS = { concept: 365, 'product-guide': 90 } as const;
export type ChapterKind = keyof typeof REVIEW_INTERVALS;
export interface ContentSource {
	url: string;
	titles: Record<Lang, string>;
	/** 已完成并有记录的来源检查；null表示没有单独检查记录。 */
	checkedAt: string | null;
	evidence: string | null;
	snapshot?: string;
}
export interface ContentEdition {
	revision: number;
	contentHash: string;
	reviewedAt: string;
	reviewScope: 'edition' | 'chapter';
	reviewEvidence: string;
	sources: string[];
	translatedFrom?: { lang: 'zh'; revision: number; contentHash: string; alignedAt: string };
	changes: { revision: number; date: string; summary: string }[];
}
export interface ChapterMetadataRecord {
	kind: ChapterKind;
	editions: Partial<Record<Lang, ContentEdition>>;
}
export interface ContentMetadata {
	schemaVersion: 1;
	sourceLanguage: 'zh';
	sources: Record<string, ContentSource>;
	chapters: Record<string, ChapterMetadataRecord>;
}
export type ContentInventory = Record<Lang, string[]>;
export interface MetadataProblem { code: string; path: string; message: string }

export function isReviewDate(date: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
	const value = new Date(`${date}T00:00:00Z`);
	return Number.isFinite(value.getTime()) && value.toISOString().slice(0, 10) === date;
}

export function isHttpsUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && !url.username && !url.password;
	} catch { return false; }
}

export function isReviewEvidence(value: string): boolean {
	return typeof value === 'string' && (isHttpsUrl(value) || /^docs\/[\w/-]+\.md$/.test(value));
}

export function reviewEvidenceUrl(evidence: string): string {
	return isHttpsUrl(evidence) ? evidence : `https://github.com/cinexul/whats-llm/blob/main/${evidence}`;
}

export function reviewDueAt(chapter: ChapterMetadataRecord, lang: Lang): string | null {
	const edition = chapter.editions[lang];
	if (!edition || !isReviewDate(edition.reviewedAt)) return null;
	const value = new Date(`${edition.reviewedAt}T00:00:00Z`);
	value.setUTCDate(value.getUTCDate() + REVIEW_INTERVALS[chapter.kind]);
	return value.toISOString().slice(0, 10);
}

export function reviewStatus(chapter: ChapterMetadataRecord, lang: Lang, asOf: string): 'current' | 'due' | 'unknown' {
	const due = reviewDueAt(chapter, lang);
	if (!due || !isReviewDate(asOf)) return 'unknown';
	return asOf >= due ? 'due' : 'current';
}

export function translationStatus(data: ContentMetadata, slug: string, lang: Lang): 'source' | 'aligned' | 'stale' | 'missing' {
	const chapter = data.chapters[slug];
	const edition = chapter?.editions[lang];
	const source = chapter?.editions.zh;
	if (!edition || !source) return 'missing';
	if (lang === 'zh') return 'source';
	const from = edition.translatedFrom;
	return from?.lang === 'zh' && from.revision === source.revision && from.contentHash === source.contentHash
		? 'aligned' : 'stale';
}

/** 不读取时钟、文件系统或网络；由调用方提供准确的内容清单和哈希值。 */
export function validateContentMetadata(
	data: ContentMetadata, inventory: ContentInventory, hashes: Record<string, string>
): MetadataProblem[] {
	const problems: MetadataProblem[] = [];
	const issue = (code: string, path: string, message: string) => problems.push({ code, path, message });
	const hashValid = (value: string) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
	if (data?.schemaVersion !== 1 || data.sourceLanguage !== 'zh' || !data.chapters || !data.sources) {
		return [{ code: 'invalid-schema', path: 'metadata', message: 'Expected schema version 1, Chinese source, chapters and sources.' }];
	}
	for (const [id, source] of Object.entries(data.sources)) {
		if (!isHttpsUrl(source.url) || CONTENT_LANGUAGES.some((lang) => !source.titles?.[lang]?.trim())) {
			issue('invalid-source', id, 'Sources need an HTTPS URL and a title in every language.');
		}
		if (source.checkedAt !== null && (!isReviewDate(source.checkedAt) || !source.evidence || !isReviewEvidence(source.evidence))) {
			issue('invalid-source-evidence', id, 'A dated source check needs a valid date and review evidence.');
		}
		if (source.snapshot && !isHttpsUrl(source.snapshot)) issue('invalid-snapshot', id, 'Snapshot must be an HTTPS URL.');
	}
	const expected = new Set(inventory.zh);
	for (const slug of expected) {
		if (!data.chapters[slug]) issue('missing-chapter', slug, 'Chapter has no maintenance metadata.');
	}
	for (const lang of CONTENT_LANGUAGES) {
		for (const slug of inventory[lang]) {
			if (!expected.has(slug)) issue('unexpected-content', `${lang}/${slug}`, 'Chapter does not exist in the source edition.');
		}
	}
	for (const [slug, chapter] of Object.entries(data.chapters)) {
		if (!expected.has(slug)) issue('unexpected-chapter', slug, 'Metadata has no source chapter.');
		if (!(chapter.kind in REVIEW_INTERVALS)) issue('invalid-kind', slug, 'Use concept or product-guide.');
		for (const lang of CONTENT_LANGUAGES) {
			const path = `${lang}/${slug}`;
			if (!inventory[lang].includes(slug)) issue('missing-content', path, 'Chapter Markdown file is missing.');
			const edition = chapter.editions?.[lang];
			if (!edition) { issue('missing-edition', path, 'Edition metadata is missing.'); continue; }
			if (!Number.isInteger(edition.revision) || edition.revision < 1) issue('invalid-revision', path, 'Revision must be a positive integer.');
			if (!hashValid(edition.contentHash) || edition.contentHash !== hashes[path]) {
				issue('content-drift', path, 'Chapter changed without an explicit review acknowledgement.');
			}
			if (!isReviewDate(edition.reviewedAt)) issue('invalid-review-date', path, 'Review date must be a real YYYY-MM-DD date.');
			if (!isReviewEvidence(edition.reviewEvidence)) issue('invalid-review-evidence', path, 'Review needs an HTTPS reference or repository docs/*.md path.');
			if (!['edition', 'chapter'].includes(edition.reviewScope)) issue('invalid-review-scope', path, 'Review scope must be edition or chapter.');
			if (!Array.isArray(edition.sources)) issue('invalid-sources', path, 'Sources must be an array, including when empty.');
			else {
				if (new Set(edition.sources).size !== edition.sources.length) issue('duplicate-source', path, 'Source references must be unique.');
				for (const id of edition.sources) {
					if (!data.sources[id]) issue('unknown-source', path, `Unknown source: ${id}`);
				}
			}
			const changes = edition.changes;
			if (!Array.isArray(changes) || !changes.length || changes.at(-1)?.revision !== edition.revision ||
				changes.at(-1)?.date !== edition.reviewedAt || changes.some((change, index) =>
					!Number.isInteger(change.revision) || change.revision < 1 || !isReviewDate(change.date) || !change.summary?.trim() ||
					(index > 0 && (change.revision <= changes[index - 1].revision || change.date < changes[index - 1].date)))) {
				issue('invalid-history', path, 'Changes must be dated, ordered revisions ending at the current revision and review date.');
			}
			if (lang === 'zh') {
				if (edition.translatedFrom) issue('invalid-source-alignment', path, 'The Chinese source cannot be a translation.');
			} else {
				const from = edition.translatedFrom;
				if (translationStatus(data, slug, lang) !== 'aligned') issue('stale-translation', path, 'Translation must explicitly acknowledge the current source revision and hash.');
				if (!from || !isReviewDate(from.alignedAt) || from.alignedAt > edition.reviewedAt || from.alignedAt < (chapter.editions.zh?.reviewedAt ?? '')) {
					issue('invalid-alignment-date', path, 'Translation alignment needs a date between the source and translation reviews.');
				}
			}
		}
	}
	return problems;
}

export interface ReviewAcknowledgement {
	slug: string; lang: Lang; date: string; evidence: string; note: string;
	reviewed: boolean; translationReviewed: boolean;
}

/** 只确认一个语言版本；更新原文后，译文仍保持过期状态。 */
export function acknowledgeEdition(
	data: ContentMetadata, hashes: Record<string, string>, request: ReviewAcknowledgement
): ContentMetadata {
	const { slug, lang, date, evidence, note } = request;
	const current = data.chapters[slug]?.editions[lang];
	if (!current) throw new Error('Unknown chapter or edition.');
	if (!request.reviewed) throw new Error('Explicit review acknowledgement is required (--ack-reviewed).');
	if (!isReviewDate(date) || date < current.reviewedAt) throw new Error('Review date must be valid and cannot precede the last review.');
	if (!isReviewEvidence(evidence) || !note.trim()) throw new Error('A review evidence reference and change note are required.');
	const contentHash = hashes[`${lang}/${slug}`];
	if (!contentHash || !/^[a-f0-9]{64}$/.test(contentHash)) throw new Error('Content is missing or its hash is invalid.');
	if (lang !== 'zh') {
		if (!request.translationReviewed) throw new Error('Explicit translation acknowledgement is required (--ack-translation).');
		const source = data.chapters[slug].editions.zh;
		if (!source || source.contentHash !== hashes[`zh/${slug}`]) throw new Error('Acknowledge the source changes before reviewing a translation.');
		if (date < source.reviewedAt) throw new Error('Translation review date cannot precede the source review date.');
	}
	const updated = structuredClone(data);
	const edition = updated.chapters[slug].editions[lang]!;
	edition.revision += 1;
	edition.contentHash = contentHash;
	edition.reviewedAt = date;
	edition.reviewScope = 'chapter';
	edition.reviewEvidence = evidence;
	edition.changes.push({ revision: edition.revision, date, summary: note.trim() });
	if (lang !== 'zh') {
		const source = updated.chapters[slug].editions.zh!;
		edition.translatedFrom = { lang: 'zh', revision: source.revision, contentHash: source.contentHash, alignedAt: date };
	}
	return updated;
}
