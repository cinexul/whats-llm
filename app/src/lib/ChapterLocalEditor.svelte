<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { beforeNavigate, invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import type { Lang } from './manifest';
	import { getLocalEditRecord, LocalEditError, resetLocalEdit, saveLocalEdit, type LocalChapterEdit } from './local-edits';
	import { localEditsCopy, localEditErrorText, editDate } from './local-edits-copy';
	import { renderMarkdown } from './markdown';
	import ChapterDiff from './ChapterDiff.svelte';

	let { lang, slug, originalBody, record, errorCode = null }: {
		lang: Lang; slug: string; originalBody: string; record?: LocalChapterEdit; errorCode?: string | null;
	} = $props();
	const t = $derived(localEditsCopy[lang]);
	const active = $derived(record != null && record.markdown !== null);
	const originalUpdated = $derived(active && record?.original !== originalBody);
	let dialog: HTMLDialogElement;
	let editButton: HTMLButtonElement;
	let returnFocus: HTMLElement | null = null;
	let opened = $state(false);
	let opening = $state(false);
	let disposed = false;
	let visibleHeight = $state(0);
	let visibleTop = $state(0);
	let tab = $state<'edit' | 'preview' | 'diff'>('edit');
	let draft = $state('');
	let initialDraft = $state('');
	let firstOriginal = $state('');
	let expectedRevision: number | null = null;
	let compareCurrent = $state(false);
	let error = $state<string | null>(null);
	let saving = $state(false);
	let preview = $state('');
	let previewBusy = $state(false);
	let previewError = $state(false);
	const dirty = $derived(draft !== initialDraft);
	const baselineChanged = $derived(firstOriginal !== originalBody);

	async function openEditor(nextTab: typeof tab) {
		if (saving || opening || opened) return;
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		opening = true;
		try {
			// 每次打开编辑器时获取一次最新修订号，绝不覆盖已打开的草稿。
			const latest = await getLocalEditRecord(lang, slug);
			if (disposed) return;
			expectedRevision = latest?.updatedAt ?? null;
			draft = latest?.markdown ?? originalBody;
			initialDraft = draft;
			firstOriginal = latest?.markdown != null ? latest.original : originalBody;
			compareCurrent = false;
			tab = nextTab;
			error = null;
			opened = true;
			await tick();
			dialog.showModal();
		} catch (cause) { error = cause instanceof LocalEditError ? cause.code : 'storage'; }
		finally { opening = false; }
	}

	async function restoreFocus() {
		await tick();
		const target = returnFocus?.isConnected && returnFocus !== document.body ? returnFocus : editButton;
		target?.focus();
	}

	function closeEditor() {
		if (saving) return;
		if (dirty && !window.confirm(t.discard)) return;
		opened = false;
		dialog.close();
		void restoreFocus();
	}

	async function save() {
		if (saving || !dirty) return;
		saving = true;
		error = null;
		try {
			if (draft === originalBody) await resetLocalEdit(lang, slug, expectedRevision);
			else await saveLocalEdit(lang, slug, draft, originalBody, expectedRevision);
		} catch (cause) {
			error = cause instanceof LocalEditError ? cause.code : 'storage';
			saving = false;
			return;
		}
		initialDraft = draft;
		opened = false;
		dialog.close();
		try { await invalidate('app:chapter-edits'); } finally { saving = false; void restoreFocus(); }
	}

	async function restore() {
		if (saving || !record || !window.confirm(t.confirmRestore)) return;
		saving = true;
		try {
			await resetLocalEdit(lang, slug, record.updatedAt);
			error = null;
			await invalidate('app:chapter-edits');
		} catch (cause) { error = cause instanceof LocalEditError ? cause.code : 'storage'; }
		finally { saving = false; }
	}

	function downloadDraft() {
		const url = URL.createObjectURL(new Blob([draft], { type: 'text/markdown;charset=utf-8' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = `whats-llm-${lang}-${slug}.md`;
		document.body.append(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	$effect(() => {
		if (!opened || tab !== 'preview') return;
		const source = draft;
		let cancelled = false;
		previewBusy = true;
		previewError = false;
		void renderMarkdown(source).then((result) => {
			if (cancelled) return;
			// 预览不提供小节导航；移除ID，避免与阅读正文的ID重复。
			const template = document.createElement('template');
			template.innerHTML = result.html;
			for (const element of template.content.querySelectorAll('[id]')) element.removeAttribute('id');
			preview = template.innerHTML;
		}).catch(() => {
			if (!cancelled) previewError = true;
		}).finally(() => {
			if (!cancelled) previewBusy = false;
		});
		return () => { cancelled = true; };
	});

	beforeNavigate((navigation) => {
		if (saving && !navigation.willUnload) { navigation.cancel(); return; }
		if (opened && dirty && !navigation.willUnload && !window.confirm(t.discard)) navigation.cancel();
	});

	onMount(() => {
		const viewport = window.visualViewport;
		const resize = () => {
			visibleHeight = viewport?.height ?? innerHeight;
			visibleTop = viewport?.offsetTop ?? 0;
		};
		resize();
		viewport?.addEventListener('resize', resize);
		viewport?.addEventListener('scroll', resize);
		window.addEventListener('resize', resize);
		const unload = (event: BeforeUnloadEvent) => {
			if (!opened || !dirty) return;
			event.preventDefault();
			event.returnValue = '';
		};
		window.addEventListener('beforeunload', unload);
		const action = page.url.searchParams.get('local');
		if (action === 'diff' || action === 'edit') void openEditor(action);
		return () => {
			disposed = true;
			window.removeEventListener('beforeunload', unload);
			window.removeEventListener('resize', resize);
			viewport?.removeEventListener('resize', resize);
			viewport?.removeEventListener('scroll', resize);
		};
	});
</script>

<section id="chapter-tools" tabindex="-1" class="edit-panel" class:modified={active} data-testid="local-edit-panel" aria-label={t.tools}>
	<h2 class="workspace-title">{t.tools}</h2>
	<p class="scope">{t.correction}</p>
	<div class="panel-row">
		{#if active && record}
			<div class="saved"><strong data-testid="local-edited-badge">✎ {t.badge}</strong><span>{t.saved} {editDate(lang, record.updatedAt)}</span></div>
		{/if}
		<div class="actions">
			<button bind:this={editButton} data-testid="edit-chapter" disabled={saving || opening} onclick={() => openEditor('edit')}>{t.edit}</button>
			{#if active}
				<button data-testid="view-local-diff" disabled={saving || opening} onclick={() => openEditor('diff')}>{t.diff}</button>
				<button class="subtle" data-testid="restore-original" disabled={saving} onclick={restore}>{t.restore}</button>
			{/if}
		</div>
	</div>
	{#if active}<p class="scope">{t.metadata} <a href="{base}/library/#local-edits">{t.all} →</a></p>{/if}
	{#if originalUpdated}<p class="notice" data-testid="original-updated">{t.updated}</p>{/if}
	{#if (error || errorCode) && !opened}<p role="alert">{localEditErrorText(lang, (error || errorCode)!)}</p>{/if}
</section>

<dialog bind:this={dialog} class:compact={visibleHeight > 0 && visibleHeight <= 520} style:--editor-height={visibleHeight ? `${visibleHeight}px` : '100dvh'} style:--editor-top={`${visibleTop}px`} data-testid="local-editor" aria-labelledby="local-editor-title" oncancel={(event) => { event.preventDefault(); closeEditor(); }}>
	<header>
		<div><p class="eyebrow">{t.badge}</p><h2 id="local-editor-title">{t.editor}</h2></div>
		<button class="close" disabled={saving} onclick={closeEditor}>{t.close}</button>
	</header>
	<div class="tabs" role="group" aria-label={t.editor}>
		{#each [{ id: 'edit', text: t.writing }, { id: 'preview', text: t.preview }, { id: 'diff', text: t.changes }] as item}
			<button data-testid="editor-tab-{item.id}" aria-pressed={tab === item.id} onclick={() => tab = item.id as typeof tab}>{item.text}</button>
		{/each}
	</div>
	<div class="editor-body">
		<p class="scope">{t.scope}</p>
		{#if baselineChanged}<p class="notice">{t.updated}</p>{/if}
		{#if error}<p role="alert" class="notice">{localEditErrorText(lang, error)}</p>{/if}
		{#if tab === 'edit'}
			<label for="local-markdown">{t.markdown}</label>
			<textarea id="local-markdown" data-testid="local-markdown" bind:value={draft} readonly={saving} spellcheck="false"></textarea>
		{:else if tab === 'preview'}
			{#if previewBusy}<p role="status">{t.loading}</p>{:else if previewError}<p role="alert">{t.errors.preview}</p>{:else}<div class="prose preview" data-testid="local-preview">{@html preview}</div>{/if}
		{:else}
			<p class="comparison">{t.compare}: {#if baselineChanged}<select aria-label={t.compare} bind:value={compareCurrent}><option value={false}>{t.baseline}</option><option value={true}>{t.current}</option></select>{:else}{t.baseline}{/if}</p>
			<ChapterDiff before={compareCurrent ? originalBody : firstOriginal} after={draft} {lang} />
		{/if}
	</div>
	<footer>
		<p role="status" class:dirty>{dirty ? t.draft : t.clean}</p>
		<div class="actions"><button onclick={downloadDraft}>{t.download}</button><button class="primary" data-testid="save-local-edit" disabled={!dirty || saving} onclick={save}>{saving ? t.saving : t.save}</button></div>
	</footer>
</dialog>

<style>
	.edit-panel { margin: 1.5rem 0; padding: 1rem 0; scroll-margin-top: 1rem; border-top: 1px solid var(--border); font-size: calc(.8rem * var(--scale-nav)); }
	.workspace-title { font-size: 1rem; margin: 0; color: var(--text-muted); }
	.edit-panel.modified { border-left: 3px solid var(--accent); padding: 1rem; background: var(--bg-sidebar); border-radius: 0 10px 10px 0; }
	.panel-row, .actions { display: flex; align-items: center; flex-wrap: wrap; gap: .45rem .75rem; }
	.panel-row { justify-content: space-between; }
	.saved { display: flex; flex-direction: column; gap: .2rem; }
	.saved strong { color: var(--accent-text); }
	.saved span { color: var(--text-muted); font-size: .9em; }
	button, select { font: inherit; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 7px; padding: .45rem .8rem; min-height: 44px; cursor: pointer; max-width: 100%; overflow-wrap: anywhere; }
	button:hover { background: var(--bg-hover); }
	button:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
	button:disabled { opacity: .5; cursor: default; }
	.subtle { color: var(--text-muted); background: transparent; }
	.scope { color: var(--text-muted); font-size: .9em; margin: .7rem 0; overflow-wrap: anywhere; }
	.scope a { display: inline-block; }
	.notice { background: var(--accent-bg); color: var(--accent-text); padding: .8rem; border-radius: 8px; overflow-wrap: anywhere; }
	dialog { color: var(--text); background: var(--bg); padding: 0; width: min(960px, calc(100vw - 3rem)); max-width: 100%; max-height: calc(var(--editor-height, 100dvh) - 3rem); border: 1px solid var(--border); border-radius: 18px; box-shadow: 0 24px 100px #0004; font-size: calc(.9rem * var(--scale-nav)); }
	dialog[open] { display: flex; flex-direction: column; }
	dialog::backdrop { background: #19171388; backdrop-filter: blur(3px); }
	header { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; padding: 1.2rem 1.5rem .8rem; }
	header > div { min-width: 0; }
	.eyebrow { margin: 0; color: var(--accent-text); font-size: .8em; }
	h2 { margin: .2rem 0 0; font-family: var(--font-serif); font-size: calc(1.2rem * var(--scale-heading)); line-height: 1.5; overflow-wrap: anywhere; }
	.close { flex-shrink: 0; }
	.tabs { display: flex; flex-wrap: wrap; gap: .4rem; padding: .5rem 1.5rem .8rem; border-bottom: 1px solid var(--border); }
	.tabs button[aria-pressed='true'] { color: var(--accent-text); border-color: var(--accent); background: var(--accent-bg); }
	.editor-body { overflow-y: auto; min-height: 0; padding: .5rem 1.5rem 1.5rem; overscroll-behavior: contain; }
	label { display: block; margin: 1rem 0 .4rem; }
	textarea { display: block; width: 100%; min-height: 34dvh; resize: vertical; font: calc(.9rem * var(--scale-body))/1.85 var(--font-mono); color: var(--text); background: var(--bg-sidebar); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; tab-size: 2; }
	.preview { overflow-wrap: anywhere; }
	.comparison { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; color: var(--text-muted); }
	footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem 1rem; border-top: 1px solid var(--border); padding: .8rem 1.5rem; }
	footer > p { margin: 0; font-size: .85em; color: var(--text-muted); }
	footer > p.dirty { color: var(--accent-text); }
	.primary { background: var(--accent); border-color: var(--accent); color: var(--bg); }
	.primary:hover { background: var(--accent-strong); }
	@media (max-width: 640px) {
		dialog { margin: 0; top: var(--editor-top, 0px); bottom: auto; width: 100%; height: var(--editor-height, 100dvh); max-height: var(--editor-height, 100dvh); border: 0; border-radius: 0; padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
		header { padding: 1rem 1rem .6rem; }
		.tabs { padding: .4rem 1rem .6rem; }
		.editor-body { padding: .3rem 1rem 1rem; flex: 1; }
		footer { padding: .7rem 1rem; }
		footer .actions { width: 100%; }
		footer .actions button { flex: 1 1 110px; }
		textarea { padding: .7rem; }
	}
	dialog.compact[open] { display: block; overflow-y: auto; }
	dialog.compact .editor-body { overflow: visible; }
	dialog.compact textarea { min-height: calc(var(--editor-height, 100dvh) * .45); }
	dialog.compact .eyebrow { display: none; }
	dialog.compact header { padding-top: .6rem; }
	/* 弹出键盘或横屏视口较矮时，让整个编辑器可滚动，
	   避免固定的页头和页脚将文本区挤到零高度。 */
	@media (max-height: 520px) {
		dialog[open] { display: block; overflow-y: auto; }
		.editor-body { overflow: visible; }
		textarea { min-height: 45dvh; }
		.eyebrow { display: none; }
		header { padding-top: .6rem; }
	}
</style>
