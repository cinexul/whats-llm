<script lang="ts">
	import { base } from '$app/paths';
	import { manifests, allChapters } from '$lib/manifest';
	import { lang } from '$lib/lang';
	import { ui, countText } from '$lib/ui';
	import Icon from '$lib/Icon.svelte';
	import FeatureNav from '$lib/FeatureNav.svelte';
	import { readingChapter } from '$lib/reading';
	import { readStore } from '$lib/study';

	const parts = $derived(manifests[$lang]);
	const t = $derived(ui[$lang]);
	const chapters = $derived(allChapters($lang));
	const resume = $derived(chapters.find((chapter) => chapter.slug === $readingChapter[$lang]));
	const destination = $derived(resume ?? chapters[0]);
	const readCount = $derived(chapters.filter((chapter) => $readStore[$lang].has(chapter.slug)).length);
</script>

<svelte:head>
	<title>{t.appTitle}</title>
</svelte:head>

<div class="cover">
	<p class="cover-label">{t.coverLabel}</p>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<h1>{@html t.coverTitleHtml}</h1>
	<p class="book-facts">{countText(t.bookFacts, chapters.length, $lang)}</p>
	<p class="lead">{t.coverLead}</p>

	<a class="reading-start" href="{base}/chapter/{destination.slug}/">
		<span><strong>{resume ? t.continueReading : t.startReading}</strong>{#if resume}<span class="resume-title">{resume.title}</span>{/if}</span><Icon name="arrow" />
	</a>
	<div class="reading-summary"><span>{t.readingHint}</span>{#if readCount > 0}<span>{t.statRead} {readCount}/{chapters.length}</span>{/if}</div>
	{#if readCount > 0}<div class="book-progress" role="meter" aria-label={t.statRead} aria-valuenow={readCount} aria-valuemin="0" aria-valuemax={chapters.length}><span style="width: {100 * readCount / chapters.length}%"></span></div>{/if}

	<FeatureNav />
	<div class="section-heading"><h2>{t.bookOverview}</h2><span>{countText(t.allChaptersLabel, chapters.length, $lang)}</span></div>

	<div class="part-cards">
		{#each parts as part, index (part.title)}
			<a class="part-card" href="{base}/chapter/{part.chapters[0].slug}/">
				<span class="part-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
				<div><p class="part-name">{part.title}</p>
				<p class="part-desc">
					{part.chapters.length === 1
						? part.chapters[0].title
						: countText(t.allChaptersLabel, part.chapters.length, $lang)}
				</p></div>
				<Icon name="chevron" size={18} />
			</a>
		{/each}
	</div>

	<p class="note">
		{t.coverNote}
	</p>
</div>

<style>
	.cover {
		max-width: 760px;
		margin: 0 auto;
		padding: 4.5rem 2.5rem 4rem;
	}

	.cover-label {
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		color: var(--accent);
		margin: 0 0 0.8rem;
	}

	h1 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 2.6rem;
		line-height: 1.35;
		margin: 0 0 1.2rem;
	}

	.lead {
		color: var(--text-muted);
		max-width: 620px;
		margin: 0 0 1.75rem;
	}

	.part-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 0.8rem;
	}

	.part-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: .8rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1rem 1.15rem;
		background: var(--bg-sidebar);
		transition: border-color 0.15s;
	}

	.part-card:hover {
		border-color: var(--accent);
		text-decoration: none;
	}

	.part-name {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--text);
		margin: 0 0 0.25rem;
	}

	.part-desc {
		font-size: 0.8rem;
		color: var(--text-faint);
		margin: 0;
	}

	.note {
		font-size: 0.8rem;
		color: var(--text-faint);
		margin-top: 3rem;
	}

	.book-facts {
		font-size: .74rem;
		color: var(--text-muted);
		letter-spacing: .03em;
		margin: -.5rem 0 1.5rem;
	}
	.reading-start {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 56px;
		padding: .9rem 1.1rem;
		border-radius: 12px;
		color: var(--bg);
		background: var(--text);
		text-decoration: none;
	}
	.reading-start > span {
		min-width: 0;
	}
	.reading-start strong {
		font-size: .94rem;
		font-weight: 500;
	}
	.reading-start:hover {
		background: var(--accent-text);
	}
	.resume-title {
		display: block;
		margin-top: .25rem;
		font-size: .73rem;
		line-height: 1.55;
		opacity: .8;
	}
	.reading-summary {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: .3rem 1rem;
		margin-top: .8rem;
		color: var(--text-muted);
		font-size: .72rem;
	}
	.book-progress {
		height: 3px;
		margin-top: .6rem;
		border-radius: 4px;
		background: var(--border);
		overflow: hidden;
	}
	.book-progress span {
		display: block;
		height: 100%;
		background: var(--accent);
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin: 2.5rem 0 1rem;
	}
	.section-heading h2 {
		font: 600 1.15rem/1.5 var(--font-serif);
		margin: 0;
	}
	.section-heading > span {
		color: var(--text-muted);
		font-size: .73rem;
		white-space: nowrap;
	}
	.part-number {
		color: var(--accent);
		font: 400 .85rem var(--font-mono);
	}
	@media (max-width: 760px) {
		.cover {
			padding: 2.25rem 1.5rem 2rem;
		}
		.cover-label {
			display: flex;
			align-items: center;
			gap: .6rem;
			font-size: .7rem;
			letter-spacing: .14em;
			margin-bottom: 1rem;
		}
		.cover-label::before {
			content: '';
			width: 24px;
			height: 1px;
			background: var(--accent);
		}
		h1 {
			font-size: clamp(3.4rem, 16vw, 4.75rem);
			font-weight: 600;
			letter-spacing: -.055em;
			line-height: 1.08;
			margin-bottom: 1.3rem;
		}
		.book-facts {
			font-size: .7rem;
			margin: 0 0 1.5rem;
		}
		.lead {
			font-size: .9rem;
			line-height: 1.9;
			margin-bottom: 1.6rem;
		}
		.reading-start {
			border-radius: 12px;
			padding: 1rem 1.15rem;
			min-height: 58px;
		}
		.reading-summary {
			font-size: .68rem;
		}
		.section-heading {
			margin: 2.25rem 0 .6rem;
		}
		.section-heading h2 {
			font-size: 1.1rem;
		}
		.part-cards {
			display: block;
		}
		.part-card {
			padding: 1.1rem 0;
			border: 0;
			border-bottom: 1px solid var(--border);
			border-radius: 0;
			background: transparent;
			gap: .9rem;
		}
		.part-number {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 34px;
			height: 38px;
			background: var(--bg-sidebar);
			border: 1px solid var(--border);
			border-radius: 7px;
			font-size: .72rem;
		}
		.part-name {
			font-size: .9rem;
			line-height: 1.6;
		}
		.part-desc {
			font-size: .72rem;
			color: var(--text-muted);
		}
		.note {
			font-size: .73rem;
			line-height: 1.8;
			color: var(--text-muted);
			margin: 2rem 0 0;
		}
	}
	@media (max-width: 360px) { .cover { padding-inline: 1.25rem; } }
</style>
