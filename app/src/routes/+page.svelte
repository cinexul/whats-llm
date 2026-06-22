<script lang="ts">
	import { base } from '$app/paths';
	import { manifests } from '$lib/manifest';
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';

	const parts = $derived(manifests[$lang]);
	const t = $derived(ui[$lang]);
</script>

<svelte:head>
	<title>{t.appTitle}</title>
</svelte:head>

<div class="cover">
	<p class="cover-label">{t.coverLabel}</p>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<h1>{@html t.coverTitleHtml}</h1>
	<p class="lead">{t.coverLead}</p>

	<div class="part-cards">
		{#each parts as part (part.title)}
			<a class="part-card" href="{base}/chapter/{part.chapters[0].slug}/">
				<p class="part-name">{part.title}</p>
				<p class="part-desc">
					{part.chapters.length === 1
						? part.chapters[0].title
						: t.allChaptersLabel.replace('{n}', String(part.chapters.length))}
				</p>
			</a>
		{/each}
	</div>

	<p class="note">
		{t.coverNote}
		(<a href="https://docs.claude.com" target="_blank" rel="noreferrer">docs.claude.com</a>)
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
		margin: 0 0 2.5rem;
	}

	.part-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 0.8rem;
	}

	.part-card {
		display: block;
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
</style>
