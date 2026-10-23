<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { manifests } from './manifest';
	import { lang } from './lang';
	import { ui } from './ui';
	import FeatureNav from './FeatureNav.svelte';
	import { localEdits } from './local-edits';
	import { localEditsCopy } from './local-edits-copy';
	import { cardsStore, readStore, chapterSummary, type Mastery } from './study';
	let { onNavigate = () => {} }: { onNavigate?: () => void } = $props();
	const parts = $derived(manifests[$lang]);
	const t = $derived(ui[$lang]);
	const cards = $derived($cardsStore[$lang]);
	const edited = $derived(new Set($localEdits.filter((edit) => edit.lang === $lang && edit.markdown !== null).map((edit) => edit.slug)));
	function masteryTitle(m: Mastery): string {
		return m === 'mastered'
			? t.masteryMastered
			: m === 'reviewing'
				? t.masteryReviewing
				: m === 'learning'
					? t.masteryLearning
					: t.masteryNew;
	}
</script>

<FeatureNav compact {onNavigate} />
<nav aria-label={t.contents}>
	{#each parts as part (part.title)}
		<p class="part-title">{part.title}</p>
		<ul>
			{#each part.chapters as ch (ch.slug)}
				{@const sum = chapterSummary(cards, ch.slug)}
				<li>
					<a
						href="{base}/chapter/{ch.slug}/"
						class:active={page.url.pathname.includes(`/chapter/${ch.slug}/`)}
						onclick={onNavigate}
						class:draft={ch.draft}
					>
						<span class="ch-title">{ch.title}{#if edited.has(ch.slug)} <span class="local-edit-badge">{localEditsCopy[$lang].badge}</span>{/if}</span>
						<span class="marks">
							{#if sum.due > 0}
								<span class="dot due" title={t.reviewDue}></span>
							{:else if sum.mastery}
								<span class="dot m-{sum.mastery}" title={masteryTitle(sum.mastery)}></span>
							{/if}
							{#if $readStore[$lang].has(ch.slug)}<span class="read-mark" title={t.readMark}>✓</span>{/if}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
</nav>

<style>
	.ch-title { min-width: 0; overflow-wrap: anywhere; }
	.local-edit-badge { display: inline-block; border: 1px solid currentColor; border-radius: 4px; font-size: .75em; line-height: 1.5; padding: .05rem .3rem; margin: .15rem 0; }
	.part-title {
		font-size: calc(0.72rem * var(--scale-nav));
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin: 1.2rem 0 0.35rem;
		padding-left: 0.55rem;
	}

	nav > .part-title:first-child {
		margin-top: 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem;
		font-size: calc(0.85rem * var(--scale-nav));
		line-height: 1.55;
		color: var(--text-muted);
		padding: 0.28rem 0.55rem;
		border-radius: 7px;
		margin-bottom: 1px;
	}

	a:hover {
		background: var(--bg-hover);
		text-decoration: none;
	}

	a.active {
		background: var(--accent);
		color: #faf9f5;
	}

	a.draft .ch-title {
		opacity: 0.45;
	}

	.read-mark {
		font-size: calc(0.7rem * var(--scale-nav));
		color: var(--accent);
		flex-shrink: 0;
	}

	a.active .read-mark {
		color: #faf9f5;
	}

	/* 章ごとの定着度 / 復習待ちドット */
	.marks {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		flex-shrink: 0;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--text-faint);
		flex-shrink: 0;
	}

	.dot.m-learning {
		background: #c98a3a;
	}

	.dot.m-reviewing {
		background: var(--accent);
	}

	.dot.m-mastered {
		background: #2e9e6b;
	}

	.dot.due {
		background: #c98a3a;
		box-shadow: 0 0 0 2px rgba(201, 138, 58, 0.25);
	}

	a.active .dot {
		background: #faf9f5;
		box-shadow: none;
	}


	@media (max-width: 960px) {
		.part-title {
			color: var(--text-muted);
			font-size: calc(.72rem * var(--scale-nav));
			margin-top: 1.75rem;
		}
		a {
			min-height: 46px;
			align-items: center;
			padding: .65rem .7rem;
			font-size: calc(.88rem * var(--scale-nav));
			border-radius: 10px;
		}
		a.active {
			background: var(--accent-bg);
			color: var(--accent-text);
		}
		a.active .dot, a.active .read-mark {
			color: var(--accent-text);
		}
	}
</style>
