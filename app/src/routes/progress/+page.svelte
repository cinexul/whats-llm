<script lang="ts">
	import { base } from '$app/paths';
	import { manifests, allChapters } from '$lib/manifest';
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { quizCopy } from '$lib/quiz-copy';
	import {
		cardsStore,
		readStore,
		ensureLoaded,
		fetchReviews,
		resetProgress,
		masteryOf,
		dueCards,
		mistakeCards,
		historicalAccuracy,
		chapterSummary,
		streakFromReviews,
		dayKey,
		DAY,
		type Review,
		type Mastery
	} from '$lib/study';

	const now = Date.now();

	const t = $derived(ui[$lang]);
	const copy = $derived(quizCopy[$lang]);
	const parts = $derived(manifests[$lang]);
	const cards = $derived($cardsStore[$lang]);
	const read = $derived($readStore[$lang]);

	let reviews = $state<Review[]>([]);

	// 言語が変わったらカードを読み込み、復習ログを取り直す
	$effect(() => {
		const l = $lang;
		let active = true;
		reviews = [];
		void ensureLoaded(l);
		void fetchReviews(l).then((r) => { if (active) reviews = r; });
		return () => { active = false; };
	});

	const chapters = $derived(allChapters($lang).filter((c) => !c.draft));
	const titleOf = $derived(new Map(allChapters($lang).map((c) => [c.slug, c.title])));

	const readCount = $derived(chapters.filter((c) => read.has(c.slug)).length);
	const answeredQ = $derived(cards.length);
	const masteredQ = $derived(cards.filter((c) => masteryOf(c) === 'mastered').length);
	const due = $derived(dueCards(cards, now));
	const streakN = $derived(streakFromReviews(reviews, now));
	const accuracy = $derived(historicalAccuracy(reviews));
	const mistakes = $derived(mistakeCards(cards, reviews));

	// 復習ヒートマップ(直近119日)
	const HEAT_DAYS = 119;
	const heat = $derived.by(() => {
		const counts = new Map<string, number>();
		for (const r of reviews) {
			const k = dayKey(r.ts);
			counts.set(k, (counts.get(k) ?? 0) + 1);
		}
		const start = now - (HEAT_DAYS - 1) * DAY;
		const cells: { key: string; count: number }[] = [];
		for (let i = 0; i < HEAT_DAYS; i++) {
			const ts = start + i * DAY;
			const key = dayKey(ts);
			cells.push({ key, count: counts.get(key) ?? 0 });
		}
		return cells;
	});
	function heatLevel(c: number): number {
		if (c === 0) return 0;
		if (c <= 2) return 1;
		if (c <= 5) return 2;
		if (c <= 9) return 3;
		return 4;
	}

	// 今後14日の復習予定量
	const FC_DAYS = 14;
	const forecast = $derived.by(() => {
		const startDay = new Date(now);
		startDay.setHours(0, 0, 0, 0);
		const start = startDay.getTime();
		const counts = new Array(FC_DAYS).fill(0) as number[];
		for (const c of cards) {
			if (c.due == null) continue;
			const d = Math.floor((c.due - start) / DAY);
			if (d >= 0 && d < FC_DAYS) counts[d]++;
		}
		return counts;
	});
	const fcMax = $derived(Math.max(1, ...forecast));

	function masteryLabel(m: Mastery): string {
		if (m === 'mastered') return t.masteryMastered;
		if (m === 'reviewing') return t.masteryReviewing;
		if (m === 'learning') return t.masteryLearning;
		return t.masteryNew;
	}

	let confirming = $state(false);
	async function doReset() {
		await resetProgress();
		reviews = [];
		confirming = false;
	}
</script>

<svelte:head>
	<title>{t.progressTitle} | {t.appTitle}</title>
</svelte:head>

<div class="progress">
	<h1>{t.progressTitle}</h1>
	<p class="subtitle">{t.progressSubtitle}</p>

	<div class="stats">
		<div class="stat">
			<span class="stat-num">{readCount}<span class="stat-of">/ {chapters.length}</span></span>
			<span class="stat-label">{t.statRead}</span>
		</div>
		<div class="stat">
			<span class="stat-num">{answeredQ}</span>
			<span class="stat-label">{t.statQuizzed}</span>
		</div>
		<div class="stat">
			<span class="stat-num">{masteredQ}</span>
			<span class="stat-label">{t.statMastered}</span>
		</div>
		<div class="stat">
			<span class="stat-num">{accuracy ?? '—'}{#if accuracy != null}<span class="stat-of">%</span>{/if}</span>
			<span class="stat-label" title={copy.accuracyHint}>{copy.accuracy}</span>
		</div>
		<div class="stat">
			<span class="stat-num">{streakN}<span class="stat-of">{t.unitDays}</span></span>
			<span class="stat-label">{t.statStreak}</span>
		</div>
		<div class="stat" class:alert={due.length > 0}>
			<span class="stat-num">{due.length}</span>
			<span class="stat-label">{t.statDue}</span>
		</div>
	</div>

	{#if due.length > 0}
		<a class="review-cta" href="{base}/review/">
			<span>{t.duePrompt.replace('{n}', String(due.length))}</span>
			<span class="review-cta-go">{t.reviewCta} →</span>
		</a>
	{/if}

	{#if mistakes.length > 0}
		<a class="mistakes-cta" href="{base}/review/?mode=mistakes">
			<span>{copy.mistakeCount.replace('{n}', String(mistakes.length))}</span>
			<span>{copy.mistakes} →</span>
		</a>
	{/if}

	<section>
		<h2>{t.heatmapTitle}</h2>
		<div class="heatmap" role="img" aria-label={t.heatmapTitle}>
			{#each heat as cell (cell.key)}
				<span class="cell lvl{heatLevel(cell.count)}" title="{cell.key}: {cell.count}"></span>
			{/each}
		</div>
		<div class="legend">
			<span>{t.heatLess}</span>
			<span class="cell lvl0"></span>
			<span class="cell lvl1"></span>
			<span class="cell lvl2"></span>
			<span class="cell lvl3"></span>
			<span class="cell lvl4"></span>
			<span>{t.heatMore}</span>
		</div>
	</section>

	<section>
		<h2>{t.forecastTitle}</h2>
		<div class="forecast">
			{#each forecast as n, i (i)}
				<div class="fc-col" title={t.reviewInDays.replace('{n}', String(i))}>
					<span class="fc-bar" style="height: {Math.round((n / fcMax) * 100)}%"></span>
					<span class="fc-x">{i === 0 ? t.today : i}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="all">
		<h2>{t.allChaptersTitle}</h2>
		{#each parts as part (part.title)}
			<p class="part-title">{part.title}</p>
			<ul class="ch-list">
				{#each part.chapters as ch (ch.slug)}
					{@const sum = chapterSummary(cards, ch.slug, now)}
					<li class:draft={ch.draft}>
						<a href="{base}/chapter/{ch.slug}/{ch.draft ? '' : '#quiz'}">
							<span class="row-title">{titleOf.get(ch.slug) ?? ch.title}</span>
							<span class="row-meta">
								{#if read.has(ch.slug)}<span class="chk" title={t.readMark}>✓</span>{/if}
								{#if sum.due > 0}
									<span class="badge due">{t.reviewDue} {sum.due}</span>
								{:else if sum.mastery}
									<span class="badge m-{sum.mastery}">{masteryLabel(sum.mastery)}</span>
								{:else if !ch.draft}
									<span class="badge m-none">{t.notQuizzed}</span>
								{/if}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</section>

	<div class="footer">
		{#if confirming}
			<span class="confirm-q">{t.resetConfirm}</span>
			<button class="text-btn danger" onclick={doReset}>{t.resetYes}</button>
			<button class="text-btn" onclick={() => (confirming = false)}>{t.resetNo}</button>
		{:else}
			<button class="text-btn" onclick={() => (confirming = true)}>{t.resetAll}</button>
		{/if}
	</div>
</div>

<style>
	.mistakes-cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 1rem;
		margin: 0 0 2rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 11px;
		line-height: 1.6;
	}
	.mistakes-cta:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

	.progress {
		max-width: 760px;
		margin: 0 auto;
		padding: 3.5rem 2.5rem 4rem;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: calc(2rem * var(--scale-heading));
		margin: 0 0 0.6rem;
	}
	.subtitle {
		color: var(--text-muted);
		font-size: calc(0.92rem * var(--scale-body));
		line-height: 1.7;
		margin: 0 0 2.2rem;
		max-width: 620px;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
		gap: 0.7rem;
		margin-bottom: 2rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border: 1px solid var(--border);
		border-radius: 11px;
		padding: 0.9rem 1rem;
		background: var(--bg-sidebar);
	}
	.stat.alert {
		border-color: #c98a3a;
		background: rgba(201, 138, 58, 0.08);
	}
	.stat-num {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.1;
		color: var(--text);
	}
	.stat-of {
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--text-faint);
		margin-left: 0.15rem;
	}
	.stat-label {
		font-size: 0.74rem;
		color: var(--text-faint);
	}

	.review-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid #c98a3a;
		background: rgba(201, 138, 58, 0.08);
		border-radius: 11px;
		padding: 0.85rem 1.1rem;
		margin-bottom: 2.4rem;
		color: var(--text);
		font-size: 0.95rem;
	}
	.review-cta:hover {
		text-decoration: none;
		border-color: var(--accent);
	}
	.review-cta-go {
		font-weight: 700;
		color: var(--accent);
		white-space: nowrap;
	}

	section {
		margin-bottom: 2.4rem;
	}
	h2 {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: calc(1.15rem * var(--scale-heading));
		margin: 0 0 0.9rem;
	}

	/* ヒートマップ */
	.heatmap {
		display: grid;
		grid-template-rows: repeat(7, 1fr);
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: 3px;
	}
	.cell {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 2px;
		background: var(--bg-hover);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 3px;
		margin-top: 0.5rem;
		font-size: 0.72rem;
		color: var(--text-faint);
	}
	.legend .cell {
		width: 11px;
		height: 11px;
		aspect-ratio: auto;
	}
	.legend span:first-child {
		margin-right: 0.3rem;
	}
	.legend span:last-child {
		margin-left: 0.3rem;
	}
	.lvl0 {
		background: var(--bg-hover);
	}
	.lvl1 {
		background: rgba(46, 158, 107, 0.35);
	}
	.lvl2 {
		background: rgba(46, 158, 107, 0.55);
	}
	.lvl3 {
		background: rgba(46, 158, 107, 0.78);
	}
	.lvl4 {
		background: #2e9e6b;
	}

	/* 予定量バー */
	.forecast {
		display: flex;
		align-items: flex-end;
		gap: 0.3rem;
		height: 90px;
	}
	.fc-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		gap: 0.25rem;
	}
	.fc-bar {
		width: 100%;
		max-width: 22px;
		min-height: 2px;
		background: var(--accent);
		border-radius: 3px 3px 0 0;
		opacity: 0.85;
	}
	.fc-x {
		font-size: 0.66rem;
		color: var(--text-faint);
	}

	/* 章リスト */
	.ch-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.part-title {
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin: 1.4rem 0 0.4rem;
	}
	.ch-list li {
		border-bottom: 1px solid var(--border);
	}
	.ch-list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem 0.2rem;
	}
	.ch-list a:hover {
		text-decoration: none;
	}
	.ch-list a:hover .row-title {
		color: var(--accent);
	}
	.ch-list li.draft .row-title {
		opacity: 0.45;
	}
	.row-title {
		font-size: 0.9rem;
		color: var(--text);
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.row-meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}
	.chk {
		color: var(--accent);
		font-size: 0.8rem;
	}
	.badge {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.08rem 0.45rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		color: var(--text-faint);
		white-space: nowrap;
	}
	.badge.m-mastered {
		color: #2e9e6b;
		border-color: #2e9e6b;
		background: rgba(46, 158, 107, 0.1);
	}
	.badge.m-reviewing {
		color: var(--accent);
		border-color: var(--accent);
	}
	.badge.m-learning {
		color: #c98a3a;
		border-color: #c98a3a;
	}
	.badge.due {
		color: #b9772a;
		border-color: #c98a3a;
		background: rgba(201, 138, 58, 0.12);
	}

	.footer {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 2.5rem;
		border-top: 1px solid var(--border);
		padding-top: 1.2rem;
	}
	.confirm-q {
		font-size: 0.82rem;
		color: var(--text-muted);
	}
	.text-btn {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--text-faint);
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
	}
	.text-btn:hover {
		color: var(--accent);
	}
	.text-btn.danger:hover {
		color: #c0392b;
	}

	@media (max-width: 760px) {
		.progress {
			max-width: 100%;
			min-width: 0;
			padding: 2rem clamp(20px, 5vw, 24px) 2.5rem;
		}
		h1 {
			font-size: calc(1.75rem * var(--scale-heading));
			line-height: 1.4;
			overflow-wrap: anywhere;
		}
		.subtitle {
			font-size: calc(0.95rem * var(--scale-body));
			margin-bottom: 1.75rem;
		}
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.65rem;
			margin-bottom: 1.5rem;
		}
		.stat {
			min-width: 0;
			min-height: 96px;
			gap: 0.5rem;
			padding: 1rem 0.875rem;
		}
		.stat-num {
			font-size: 1.8rem;
		}
		.stat-label {
			font-size: 0.8rem;
			line-height: 1.5;
			color: var(--text-muted);
			overflow-wrap: anywhere;
		}
		.review-cta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.45rem;
			padding: 1rem;
			line-height: 1.6;
			margin-bottom: 2rem;
		}
		.review-cta-go {
			white-space: normal;
		}
		section {
			margin-bottom: 2rem;
		}
		h2 {
			line-height: 1.5;
		}
		.heatmap {
			grid-template-columns: repeat(17, minmax(0, 1fr));
			width: 100%;
		}
		.cell {
			min-width: 0;
		}
		.legend {
			margin-top: 0.75rem;
			font-size: 0.75rem;
			color: var(--text-muted);
		}
		.forecast {
			gap: 0.2rem;
			height: 108px;
		}
		.fc-col {
			min-width: 0;
		}
		.fc-col:first-child {
			flex: 2;
		}
		.fc-x {
			font-size: 0.7rem;
			line-height: 1.4;
			white-space: nowrap;
			color: var(--text-muted);
		}
		.part-title {
			font-size: 0.8rem;
			line-height: 1.6;
			margin-top: 1.75rem;
			color: var(--text-muted);
		}
		.ch-list a {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.4rem;
			min-height: 64px;
			padding: 0.85rem 0;
		}
		.row-title {
			font-size: calc(0.95rem * var(--scale-body));
			line-height: 1.65;
			overflow: visible;
			white-space: normal;
			overflow-wrap: anywhere;
		}
		.row-meta {
			flex-wrap: wrap;
			max-width: 100%;
			gap: 0.5rem;
		}
		.badge {
			max-width: 100%;
			line-height: 1.5;
			white-space: normal;
		}
		.footer {
			flex-wrap: wrap;
			gap: 0.5rem 1rem;
			margin-top: 2rem;
		}
		.confirm-q {
			flex-basis: 100%;
			font-size: 0.875rem;
			line-height: 1.7;
		}
		.text-btn {
			min-width: 44px;
			min-height: 44px;
			padding: 0.5rem 0;
			font-size: 0.875rem;
			color: var(--text-muted);
		}
	}

	@media (min-width: 480px) and (max-width: 760px) {
		.stats {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
