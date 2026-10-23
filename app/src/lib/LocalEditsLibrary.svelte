<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { lang } from './lang';
	import { findChapter, languages } from './manifest';
	import { loadLocalEdits, localEdits, localEditsError } from './local-edits';
	import { editDate, localEditsCopy, localEditErrorText } from './local-edits-copy';
	const t = $derived(localEditsCopy[$lang]);
	const edits = $derived($localEdits.filter((edit) => edit.markdown !== null).sort((a, b) => b.updatedAt - a.updatedAt));
	onMount(() => { void loadLocalEdits(); });
</script>

<section id="local-edits" data-testid="local-edits-library" aria-labelledby="local-edits-heading">
	<h2 id="local-edits-heading">{t.library} <span>{edits.length}</span></h2>
	<p class="intro">{t.libraryIntro}</p>
	{#if $localEditsError}<p role="alert">{localEditErrorText($lang, $localEditsError)}</p>{/if}
	{#if edits.length === 0}<p class="empty">{t.empty}</p>{:else}
		<ul>
			{#each edits as edit (`${edit.lang}:${edit.slug}`)}
				<li>
					<div>
						<p class="meta"><span lang={edit.lang}>{languages.find((language) => language.code === edit.lang)?.label}</span> · {t.saved} {editDate($lang, edit.updatedAt)}</p>
						<a class="title" lang={edit.lang} href="{base}/chapter/{edit.slug}/?edition={edit.lang}">{findChapter(edit.lang, edit.slug)?.title}</a>
					</div>
					<div class="actions"><a href="{base}/chapter/{edit.slug}/?edition={edit.lang}&local=diff">{t.diff}</a><a href="{base}/chapter/{edit.slug}/?edition={edit.lang}&local=edit">{t.edit}</a></div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	section { margin: 2rem 0; padding: 1.4rem; border: 1px solid var(--border); border-radius: 14px; background: var(--bg-sidebar); scroll-margin-top: 1rem; }
	h2 { font-family: var(--font-serif); font-size: calc(1.25rem * var(--scale-heading)); margin: 0 0 .5rem; overflow-wrap: anywhere; }
	h2 span { font-family: var(--font-sans); font-size: .7em; color: var(--text-muted); }
	.intro, .empty, [role='alert'] { font-size: calc(.88rem * var(--scale-body)); overflow-wrap: anywhere; }
	.intro, .empty { color: var(--text-muted); }
	ul { padding: 0; margin: 1rem 0 0; list-style: none; }
	li { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .6rem 1.2rem; padding: 1rem 0; border-top: 1px solid var(--border); }
	li > div { min-width: 0; }
	.meta { color: var(--text-muted); font-size: calc(.75rem * var(--scale-nav)); margin: 0 0 .2rem; }
	.title { font-size: calc(.95rem * var(--scale-body)); overflow-wrap: anywhere; }
	.actions { display: flex; flex-wrap: wrap; gap: .3rem .9rem; }
	.actions a { display: inline-flex; align-items: center; min-height: 44px; font-size: calc(.85rem * var(--scale-nav)); }
	@media (max-width: 480px) { section { padding: 1rem; } }
</style>
