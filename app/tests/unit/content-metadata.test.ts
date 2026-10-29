import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import metadata from '$lib/content-metadata.json';
import { manifests, type Lang } from '$lib/manifest';
import {
	acknowledgeEdition, reviewDueAt, reviewStatus, translationStatus, validateContentMetadata,
	type ContentMetadata, type ContentInventory
} from '$lib/content-metadata-rules';

const slugs = manifests.zh.flatMap((part) => part.chapters.map((chapter) => chapter.slug));
const langs: Lang[] = ['zh', 'ja', 'en'];
const hashes: Record<string, string> = {};
const inventory: ContentInventory = { zh: [...slugs], ja: [...slugs], en: [...slugs] };
for (const lang of langs) {
	for (const slug of slugs) {
		const body = readFileSync(new URL(`../../src/lib/content/${lang}/${slug}.md`, import.meta.url), 'utf8');
		hashes[`${lang}/${slug}`] = createHash('sha256').update(body.replace(/\r\n/g, '\n')).digest('hex');
	}
}
const fresh = () => structuredClone(metadata) as ContentMetadata;
// Freeze only the review dates/revisions in behavioral fixtures, so later real
// editorial updates don't turn a valid maintenance action into a test failure.
const baseline = () => {
	const data = fresh();
	for (const chapter of Object.values(data.chapters)) {
		for (const lang of langs) {
			const edition = chapter.editions[lang]!;
			edition.revision = 1;
			edition.reviewedAt = '2026-10-22';
			edition.changes = [{ revision: 1, date: '2026-10-22', summary: 'Test baseline.' }];
			if (lang !== 'zh') edition.translatedFrom = {
				lang: 'zh', revision: 1, contentHash: chapter.editions.zh!.contentHash, alignedAt: '2026-10-22'
			};
		}
	}
	return data;
};
const slug = 'what-is-llm';

describe('content maintenance', () => {
	it('covers all 47 chapters in all three editions with acknowledged content hashes', () => {
		expect(slugs).toHaveLength(47);
		expect(validateContentMetadata(fresh(), inventory, hashes)).toEqual([]);
	});

	it('catches a source edit even when the maintainer forgets to bump its revision', () => {
		const changed = { ...hashes, [`zh/${slug}`]: 'f'.repeat(64) };
		expect(validateContentMetadata(fresh(), inventory, changed)).toEqual(expect.arrayContaining([
			expect.objectContaining({ code: 'content-drift', path: `zh/${slug}` })
		]));
	});

	it('catches missing chapter files and missing translation metadata separately', () => {
		const data = fresh();
		delete data.chapters[slug].editions.ja;
		const files = { ...inventory, en: inventory.en.filter((value) => value !== slug) };
		const problems = validateContentMetadata(data, files, hashes);
		expect(problems).toEqual(expect.arrayContaining([
			expect.objectContaining({ code: 'missing-edition', path: `ja/${slug}` }),
			expect.objectContaining({ code: 'missing-content', path: `en/${slug}` })
		]));
	});

	it('rejects translation alignment to a changed source hash with the same revision', () => {
		const data = fresh();
		data.chapters[slug].editions.zh!.contentHash = 'f'.repeat(64);
		expect(translationStatus(data, slug, 'en')).toBe('stale');
		expect(validateContentMetadata(data, inventory, hashes)).toEqual(expect.arrayContaining([
			expect.objectContaining({ code: 'stale-translation', path: `en/${slug}` })
		]));
	});

	it('source acknowledgement increments revision and leaves translations needing review', () => {
		const data = baseline();
		const changed = { ...hashes, [`zh/${slug}`]: 'f'.repeat(64) };
		const updated = acknowledgeEdition(data, changed, {
			slug, lang: 'zh', date: '2026-10-23', evidence: 'docs/example-review.md',
			note: 'Clarify the memory example.', reviewed: true, translationReviewed: false
		});
		expect(updated.chapters[slug].editions.zh!.revision).toBe(2);
		expect(translationStatus(updated, slug, 'ja')).toBe('stale');
		expect(updated.chapters[slug].editions.ja).toEqual(data.chapters[slug].editions.ja);
		expect(data.chapters[slug].editions.zh!.revision).toBe(1);
	});

	it('requires an explicit translation acknowledgement and a reviewed source', () => {
		const request = {
			slug, lang: 'en' as const, date: '2026-10-23', evidence: 'docs/example-review.md',
			note: 'Check the English meaning.', reviewed: true, translationReviewed: false
		};
		expect(() => acknowledgeEdition(baseline(), hashes, request)).toThrow(/translation/i);
		expect(() => acknowledgeEdition(baseline(), { ...hashes, [`zh/${slug}`]: 'f'.repeat(64) }, {
			...request, translationReviewed: true
		})).toThrow(/source/i);
		const updated = acknowledgeEdition(baseline(), hashes, { ...request, translationReviewed: true });
		expect(translationStatus(updated, slug, 'en')).toBe('aligned');
		expect(updated.chapters[slug].editions.en!.changes.at(-1)?.summary).toBe(request.note);
	});

	it('rejects silently refreshing hashes without review and invalid or backdated dates', () => {
		const request = {
			slug, lang: 'zh' as const, date: '2026-10-23', evidence: 'docs/example-review.md',
			note: 'Review the example.', reviewed: false, translationReviewed: false
		};
		expect(() => acknowledgeEdition(baseline(), hashes, request)).toThrow(/review/i);
		expect(() => acknowledgeEdition(baseline(), hashes, { ...request, reviewed: true, date: '2026-02-30' })).toThrow(/date/i);
		expect(() => acknowledgeEdition(baseline(), hashes, { ...request, reviewed: true, date: '2026-10-01' })).toThrow(/date/i);
	});

	it('uses separate review intervals and deterministic, explicitly supplied dates', () => {
		const data = baseline();
		expect(reviewDueAt(data.chapters['codex-handson'], 'zh')).toBe('2027-01-20');
		expect(reviewDueAt(data.chapters[slug], 'zh')).toBe('2027-10-22');
		expect(reviewStatus(data.chapters['codex-handson'], 'zh', '2027-01-19')).toBe('current');
		expect(reviewStatus(data.chapters['codex-handson'], 'zh', '2027-01-20')).toBe('due');
	});

	it('rejects missing source evidence, unknown source references, and invalid revision histories', () => {
		const data = fresh();
		const edition = data.chapters[slug].editions.en!;
		edition.reviewEvidence = '';
		edition.sources.push('missing-source');
		edition.changes[0].revision = 99;
		const problems = validateContentMetadata(data, inventory, hashes);
		expect(problems).toEqual(expect.arrayContaining([
			expect.objectContaining({ code: 'invalid-review-evidence' }),
			expect.objectContaining({ code: 'unknown-source' }),
			expect.objectContaining({ code: 'invalid-history' })
		]));
	});
});
