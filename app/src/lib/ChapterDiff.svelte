<script lang="ts">
	import type { Lang } from './manifest';
	import { chapterDiff } from './chapter-diff';
	import { localEditsCopy } from './local-edits-copy';
	let { before, after, lang }: { before: string; after: string; lang: Lang } = $props();
	const t = $derived(localEditsCopy[lang]);
	const diff = $derived(chapterDiff(before, after));
</script>

<section class="diff" data-testid="local-diff" aria-label={t.changes}>
	<p class="summary"><span class="added">+ {t.added} {diff.added} {t.lines}</span><span class="removed">− {t.removed} {diff.removed} {t.lines}</span></p>
	{#if diff.fallback}<p class="hint">{t.fallback}</p>{/if}
	{#if !diff.added && !diff.removed}<p>{t.noChanges}</p>{:else}
		{#each diff.parts as part, i (i)}
			{#if part.kind === 'same'}
				<details><summary>{t.same} · {part.count} {t.lines}</summary><pre>{part.text}</pre></details>
			{:else}
				<div class="change {part.kind}" data-kind={part.kind}>
					<p>{part.kind === 'added' ? `+ ${t.added}` : `− ${t.removed}`} · {part.count} {t.lines}</p>
					<pre>{part.text}</pre>
				</div>
			{/if}
		{/each}
	{/if}
</section>

<style>
	.diff { min-width: 0; font-size: calc(.88rem * var(--scale-body)); }
	.summary { display: flex; flex-wrap: wrap; gap: .6rem 1.2rem; font-weight: 600; }
	.change, details { border: 1px solid var(--border); border-radius: 8px; margin: .65rem 0; overflow: hidden; }
	.change > p { font-family: var(--font-sans); font-size: .82em; font-weight: 700; margin: 0; padding: .4rem .8rem; border-bottom: 1px solid currentColor; }
	.added { color: #225d3c; background: #e9f4ea; }
	.removed { color: #8b302e; background: #fbecea; }
	:global([data-theme='dark']) .added { color: #b6e4c7; background: #253b2d; }
	:global([data-theme='dark']) .removed { color: #f5c2ba; background: #452b29; }
	.summary span { padding: .2rem .6rem; border-radius: 5px; }
	pre { margin: 0; padding: .8rem; white-space: pre-wrap; overflow-wrap: anywhere; font: .92em/1.8 var(--font-mono); tab-size: 2; }
	summary { cursor: pointer; padding: .6rem .8rem; color: var(--text-muted); }
	.hint { color: var(--text-muted); }
</style>
