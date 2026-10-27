<script lang="ts">
	import type { Lang } from './manifest';
	import {
		chapterMetadata, contentMetadata, REVIEW_INTERVALS, reviewDueAt, reviewEvidenceUrl,
		reviewStatus, translationStatus
	} from './content-metadata';

	let { slug, lang, asOf = new Date().toISOString().slice(0, 10) }: { slug: string; lang: Lang; asOf?: string } = $props();
	const copy = {
		zh: {
			title: '本章版本与来源', revision: '内容版本', reviewed: '编辑核对记录', next: '下次核对建议',
			concept: '基础概念', product: '产品与操作', interval: '核对间隔：{days}天',
			current: '在核对周期内', due: '建议重新核对', unknown: '核对记录不全',
			editionScope: '此日期来自全书编辑修订记录，不表示每个外部来源都在当日单独核验。来源的核对记录另列如下。',
			chapterScope: '此日期记录本章的编辑核对；外部来源是否经过核验，请查看各条来源的记录。',
			evidence: '查看核对依据', sourceEdition: '中文原文', aligned: '译文已核对中文第{revision}版',
			stale: '原文已变更，译文需要重新核对。', missing: '尚未登记翻译对应关系。', alignment: '翻译对应',
			sources: '资料来源', noSources: '本章未列出单独的外部来源；可查看全书编辑核对依据。',
			checked: '已记录来源核对', notChecked: '未记录单独核验日期', snapshot: '当时的固定快照',
			changes: '修订记录', version: '第{revision}版', missingMetadata: '本章尚无维护记录。'
		},
		ja: {
			title: 'この章の版と出典', revision: '内容の版', reviewed: '編集確認の記録', next: '次回確認の目安',
			concept: '基礎概念', product: '製品・操作ガイド', interval: '確認間隔：{days}日',
			current: '確認周期内', due: '再確認を推奨', unknown: '確認記録が不十分',
			editionScope: 'この日付は全書の編集記録に基づきます。すべての外部資料を当日個別に検証したという意味ではありません。資料ごとの確認記録は下記に示します。',
			chapterScope: 'この日付は本章の編集確認を示します。外部資料の検証については各資料の記録を参照してください。',
			evidence: '確認の根拠を見る', sourceEdition: '中国語原文', aligned: '中国語 第{revision}版との対応を確認済み',
			stale: '原文が変更されました。翻訳の再確認が必要です。', missing: '翻訳の対応関係は未登録です。', alignment: '翻訳の対応',
			sources: '出典', noSources: '本章には個別の外部資料が登録されていません。全書の編集確認記録を参照できます。',
			checked: '資料の確認記録', notChecked: '個別の検証日は未記録', snapshot: '確認時の固定スナップショット',
			changes: '改訂記録', version: '第{revision}版', missingMetadata: '本章の保守記録はまだありません。'
		},
		en: {
			title: 'Chapter edition and sources', revision: 'Content revision', reviewed: 'Editorial review record', next: 'Next review suggested',
			concept: 'Core concepts', product: 'Product guidance', interval: 'Review interval: {days} days',
			current: 'Within review interval', due: 'Review recommended', unknown: 'Review record incomplete',
			editionScope: 'This date comes from the book’s editorial review. It does not mean every external source was individually checked that day. Source checks are recorded separately below.',
			chapterScope: 'This date records the chapter’s editorial review. Consult each source’s record for its individual verification date.',
			evidence: 'Read review evidence', sourceEdition: 'Chinese source edition', aligned: 'Translation checked against Chinese revision {revision}',
			stale: 'The source has changed; this translation needs review.', missing: 'Translation alignment has not been recorded.', alignment: 'Translation alignment',
			sources: 'Sources', noSources: 'No separate external sources are registered for this chapter. The book’s editorial review record is available above.',
			checked: 'Recorded source check', notChecked: 'No individual verification date recorded', snapshot: 'Snapshot used in that review',
			changes: 'Revision history', version: 'Revision {revision}', missingMetadata: 'No maintenance record is available for this chapter yet.'
		}
	};
	const t = $derived(copy[lang]);
	const record = $derived(chapterMetadata(slug, lang));
	const status = $derived(record ? reviewStatus(record.chapter, lang, asOf) : 'unknown');
	const due = $derived(record ? reviewDueAt(record.chapter, lang) : null);
	const alignment = $derived(translationStatus(contentMetadata, slug, lang));
</script>

<aside class="chapter-metadata" aria-label={t.title}>
	<details>
		<summary><span>{t.title}</span><span class="status" class:needs-review={status !== 'current' || alignment === 'stale'}>{t[status]}</span></summary>
		<div class="metadata-body">
			{#if record}
				<dl>
					<div><dt>{t.revision}</dt><dd>{record.edition.revision}</dd></div>
					<div><dt>{t.reviewed}</dt><dd><time datetime={record.edition.reviewedAt}>{record.edition.reviewedAt}</time></dd></div>
					{#if due}<div><dt>{t.next}</dt><dd><time datetime={due}>{due}</time></dd></div>{/if}
				</dl>
				<p>{record.chapter.kind === 'concept' ? t.concept : t.product} · {t.interval.replace('{days}', String(REVIEW_INTERVALS[record.chapter.kind]))}</p>
				<p>{record.edition.reviewScope === 'edition' ? t.editionScope : t.chapterScope}</p>
				<p><a href={reviewEvidenceUrl(record.edition.reviewEvidence)}>{t.evidence}</a></p>
				<p class="alignment" class:needs-review={alignment === 'stale'}>
					<strong>{t.alignment}:</strong>
					{#if alignment === 'source'}{t.sourceEdition}
					{:else if alignment === 'aligned'}{t.aligned.replace('{revision}', String(record.edition.translatedFrom?.revision))}
					{:else if alignment === 'stale'}{t.stale}
					{:else}{t.missing}{/if}
				</p>
				<h2>{t.sources}</h2>
				{#if record.edition.sources.length}
					<ul class="sources">
						{#each record.edition.sources as id (id)}
							{@const source = contentMetadata.sources[id]}
							<li>
								<a href={source.url}>{source.titles[lang]}</a>
								<span class="source-detail">
									{#if source.checkedAt}
										{t.checked}: <time datetime={source.checkedAt}>{source.checkedAt}</time>
										{#if source.evidence} · <a href={reviewEvidenceUrl(source.evidence)}>{t.evidence}</a>{/if}
									{:else}{t.notChecked}{/if}
									{#if source.snapshot}<br /><a href={source.snapshot}>{t.snapshot}</a>{/if}
								</span>
								</li>
						{/each}
					</ul>
				{:else}<p>{t.noSources}</p>{/if}
				<h2>{t.changes}</h2>
				<ol class="changes">
					{#each [...record.edition.changes].reverse() as change (change.revision)}
						<li><strong>{t.version.replace('{revision}', String(change.revision))}</strong> · <time datetime={change.date}>{change.date}</time><p>{change.summary}</p></li>
					{/each}
				</ol>
			{:else}<p>{t.missingMetadata}</p>{/if}
		</div>
	</details>
</aside>

<style>
	.chapter-metadata { margin: 1.8rem 0; border-block: 1px solid var(--border); font-size: calc(.84rem * var(--scale-body, 1)); line-height: 1.7; color: var(--text-muted); }
	summary { cursor: pointer; padding: .85rem .1rem; min-height: 48px; color: var(--text); }
	summary > span:first-child { font-weight: 600; }
	summary:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 3px; }
	.status { display: inline-block; margin-inline-start: .65em; font-size: .88em; color: var(--text-muted); }
	.needs-review { color: var(--accent-text, var(--text)); font-weight: 600; }
	.metadata-body { padding: 0 .15rem 1rem; min-width: 0; }
	p { margin: .7rem 0; }
	dl { margin: .3rem 0 1rem; }
	dl > div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .3rem 1rem; padding: .25rem 0; }
	dt { color: var(--text-muted); }
	dd { margin: 0; color: var(--text); }
	h2 { font-size: 1em; margin: 1.35rem 0 .6rem; color: var(--text); }
	a { color: var(--accent-text, var(--accent)); text-underline-offset: .2em; overflow-wrap: anywhere; }
	ul, ol { padding-inline-start: 1.25rem; margin: .5rem 0; }
	li { padding-inline-start: .15rem; margin-block: .75rem; }
	.source-detail { display: block; font-size: .92em; }
	.changes p { margin-top: .2rem; }
	@media (max-width: 480px) { dl > div { grid-template-columns: 1fr; gap: 0; } summary .status { display: block; margin-inline-start: 1.3em; } }
</style>
