<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { lang } from '$lib/lang';
	import { LEARNING_PATHS_KEY, learningPaths, learningPathStore, pathProgress, type LearningPathId } from '$lib/learning-paths';
	import { learningPathUi } from '$lib/learning-paths-ui';

	const t = $derived(learningPathUi[$lang]);
	const paths = $derived(learningPaths[$lang]);
	const selected = $derived(paths.find((path) => path.id === page.url.searchParams.get('path')));
	const progress = $derived(selected ? pathProgress(selected, $learningPathStore.progress) : null);
	let resetFor = $state<LearningPathId | null>(null);
	let cancelButton: HTMLButtonElement | undefined = $state();
	let pathHeading: HTMLHeadingElement | undefined = $state();
	let message = $state<'saved' | 'unmarked' | 'resetDone' | null>(null);
	const storageMessage = $derived($learningPathStore.storageIssue === 'write' ? t.writeIssue : $learningPathStore.storageIssue === 'invalid' ? t.invalidIssue : $learningPathStore.storageIssue === 'read' ? t.readIssue : null);

	onMount(() => {
		learningPathStore.reload();
		const sync = (event: StorageEvent) => {
			if (event.key === LEARNING_PATHS_KEY || event.key === null) learningPathStore.reload();
		};
		window.addEventListener('storage', sync);
		window.addEventListener('learning-data-imported', learningPathStore.reload);
		return () => {
			window.removeEventListener('storage', sync);
			window.removeEventListener('learning-data-imported', learningPathStore.reload);
		};
	});

	$effect(() => {
		// 切换到其他学习路径后，不沿用此前的确认状态。
		if (resetFor && selected?.id !== resetFor) resetFor = null;
	});

	function checkpoint(pathId: LearningPathId, stepId: string, checked: boolean) {
		learningPathStore.setCheckpoint(pathId, stepId, checked);
		message = $learningPathStore.storageIssue ? null : checked ? 'saved' : 'unmarked';
	}

	async function requestReset(pathId: LearningPathId) {
		resetFor = pathId;
		await tick();
		cancelButton?.focus();
	}

	async function closeReset(clear: boolean) {
		if (clear && resetFor) {
			learningPathStore.resetPath(resetFor);
			message = $learningPathStore.storageIssue ? null : 'resetDone';
		}
		resetFor = null;
		await tick();
		pathHeading?.focus();
	}
</script>

<svelte:head><title>{t.title} · What's LLM</title><meta name="description" content={t.intro} /></svelte:head>

<div class="learning-page">
	<header class="page-heading">
		<p class="eyebrow">What's LLM</p>
		<h1>{t.title}</h1>
		<p>{t.intro}</p>
	</header>
	<nav class="path-choices" aria-label={t.allPaths}>
		{#each paths as path, index (path.id)}
			{@const p = pathProgress(path, $learningPathStore.progress)}
			<a class="path-choice" class:selected={selected?.id === path.id} href="{base}/learn/?path={path.id}#path-details" aria-current={selected?.id === path.id ? 'page' : undefined}>
				<span class="path-number" aria-hidden="true">0{index + 1}</span>
				<span class="choice-content"><strong>{path.title}</strong><span>{path.summary}</span><small>{p.count} / {p.total} {t.progress}</small></span>
				<span aria-hidden="true">→</span>
			</a>
		{/each}
	</nav>
	<p class="storage-note">{t.shared}</p>
	{#if storageMessage}<p class="storage-alert" role="status">{storageMessage}</p>{/if}
	<p class="announcement" aria-live="polite" aria-atomic="true">{message ? t[message] : ''}</p>

	{#if selected && progress}
		<section id="path-details" class="path-details" aria-labelledby="path-title">
			<div class="path-heading">
				<h2 id="path-title" tabindex="-1" bind:this={pathHeading}>{selected.title}</h2>
				<p>{selected.duration}</p>
			</div>
			<dl class="path-brief">
				<div><dt>{t.prerequisites}</dt><dd>{selected.prerequisite}</dd></div>
				<div><dt>{t.result}</dt><dd>{selected.result}</dd></div>
			</dl>
			<div class="progress-summary">
				<p id="path-progress-label">{progress.count} / {progress.total} {t.progress}</p>
				<progress value={progress.count} max={progress.total} aria-labelledby="path-progress-label"></progress>
				{#if progress.next}
					{#if progress.count === 0}<p class="empty-hint">{t.empty}</p>{/if}
					<a class="next-link" href="#step-{progress.next.id}"><strong>{progress.count === 0 ? t.start : t.continue}</strong><span>{progress.next.title} <span aria-hidden="true">→</span></span></a>
				{:else}<p class="finished">{t.finished}</p>{/if}
			</div>

			<ol class="steps">
				{#each selected.steps as step, index (step.id)}
					{@const complete = ($learningPathStore.progress[selected.id] ?? []).includes(step.id)}
					<li id="step-{step.id}" class:complete>
						<div class="step-heading"><span class="step-number">{t.step} {index + 1}</span>{#if complete}<span class="complete-label">✓ {t.completed}</span>{:else if progress.next?.id === step.id}<span class="next-label">{t.next}</span>{/if}</div>
						<h3>{step.title}</h3>
						<h4>{t.read}</h4>
						<p>{step.reading}</p>
						<ul class="chapter-links">{#each step.chapters as chapter (chapter.slug)}<li><a href="{base}/chapter/{chapter.slug}/">{chapter.title} <span aria-hidden="true">↗</span></a></li>{/each}</ul>
						<h4>{t.action}</h4><p>{step.action}</p>
						<div class="deliverable"><h4>{t.deliverable}</h4><p>{step.deliverable}</p></div>
						<h4>{t.checks}</h4>
						<ul class="self-checks">{#each step.checks as check}<li>{check}</li>{/each}</ul>
						<label class="checkpoint"><input type="checkbox" checked={complete} onchange={(event) => checkpoint(selected.id, step.id, event.currentTarget.checked)} /><span>{t.checkpoint}</span></label>
					</li>
				{/each}
			</ol>

			<footer class="path-footer">
				<a class="back-link" href="{base}/learn/">← {t.back}</a>
				{#if progress.count > 0 && resetFor !== selected.id}<button class="reset-button" onclick={() => requestReset(selected.id)}>{t.reset}</button>{/if}
			</footer>
			{#if resetFor === selected.id}
				<div class="reset-confirmation" role="group" aria-labelledby="reset-question">
					<p id="reset-question">{t.resetQuestion}</p>
					<div class="reset-actions"><button bind:this={cancelButton} onclick={() => closeReset(false)}>{t.cancel}</button><button class="clear-button" onclick={() => closeReset(true)}>{t.confirmReset}</button></div>
				</div>
			{/if}
		</section>
	{/if}
</div>

<style>
	.learning-page { position: relative; max-width: 850px; margin: 0 auto; padding: 3rem 2.5rem 4rem; font-size: calc(1rem * var(--scale-body)); overflow-wrap: anywhere; }
	.page-heading > p:last-child, .storage-note, .path-heading > p { color: var(--text-muted); }
	.eyebrow { margin: 0 0 .5rem; color: var(--accent-text); font-size: .75em; letter-spacing: .08em; }
	h1, h2, h3 { font-family: var(--font-serif); line-height: 1.5; }
	h1 { font-size: calc(2rem * var(--scale-heading)); margin: 0 0 .7rem; }
	h2 { font-size: calc(1.55rem * var(--scale-heading)); margin: 0 0 .5rem; }
	h3 { font-size: calc(1.2rem * var(--scale-heading)); margin: .5rem 0 1rem; }
	h4 { font-size: 1em; margin: 1.25rem 0 .4rem; }
	p { margin: 0 0 .8rem; }
	.path-choices { display: grid; gap: .65rem; margin: 1.5rem 0 1rem; }
	.path-choice { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: .8rem; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 1rem; background: var(--bg-sidebar); color: var(--text); }
	.path-choice:hover, .path-choice.selected { border-color: var(--accent); text-decoration: none; }
	.path-choice.selected { background: var(--accent-bg); }
	.path-number { font: .8em var(--font-mono); color: var(--accent-text); }
	.choice-content { min-width: 0; }
	.choice-content strong { display: block; font: 600 1.05em/1.6 var(--font-serif); }
	.choice-content > span { display: block; color: var(--text-muted); font-size: .87em; margin: .3rem 0; }
	.choice-content small { display: block; font-size: .78em; color: var(--accent-text); }
	.storage-note { font-size: .8em; }
	.storage-alert { padding: 1rem; background: var(--accent-bg); color: var(--accent-text); border-left: 3px solid var(--accent); font-size: .87em; }
	.announcement { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }
	.path-details { border-top: 1px solid var(--border); margin-top: 2rem; padding-top: 2rem; scroll-margin-top: 1.5rem; }
	.path-heading > p { font-size: .87em; }
	.path-brief { margin: 1.5rem 0; padding: 1.2rem; background: var(--bg-sidebar); border: 1px solid var(--border); border-radius: 8px; }
	.path-brief div + div { margin-top: 1rem; }
	dt { font-weight: 700; font-size: .87em; margin-bottom: .3rem; }
	dd { margin: 0; color: var(--text-body); font-size: .9em; }
	.progress-summary > p:first-child { font-size: .85em; color: var(--accent-text); margin-bottom: .4rem; }
	progress { display: block; width: 100%; height: 5px; border: 0; border-radius: 4px; overflow: hidden; appearance: none; background: var(--border); color: var(--accent); }
	progress::-webkit-progress-bar { background: var(--border); }
	progress::-webkit-progress-value { background: var(--accent); }
	progress::-moz-progress-bar { background: var(--accent); }
	.empty-hint { margin: 1rem 0; font-size: .87em; color: var(--text-muted); }
	.next-link { display: flex; flex-direction: column; padding: 1rem 1.1rem; margin: 1rem 0; border: 1px solid var(--border); background: var(--accent-bg); color: var(--accent-text); border-radius: 8px; min-height: 44px; }
	.next-link strong { font-size: .85em; }
	.next-link span { font-size: .9em; }
	.finished { padding-top: 1rem; color: var(--accent-text); }
	.steps { margin: 2rem 0; padding: 0; list-style: none; }
	.steps > li { border-top: 1px solid var(--border); padding-top: 1.6rem; margin-top: 2rem; scroll-margin-top: 1rem; }
	.step-heading { display: flex; flex-wrap: wrap; gap: .5rem 1rem; justify-content: space-between; font-size: .78em; }
	.step-number { color: var(--text-muted); }
	.complete-label, .next-label { color: var(--accent-text); }
	.steps p, .self-checks { color: var(--text-body); font-size: .95em; }
	.chapter-links { list-style: none; padding: 0; margin: .6rem 0 1rem; }
	.chapter-links li + li { margin-top: .35rem; }
	.chapter-links a { display: block; padding: .6rem .8rem; min-height: 44px; border: 1px solid var(--border); border-radius: 6px; font-size: .87em; color: var(--accent-text); }
	.deliverable { border-left: 3px solid var(--accent); padding: .2rem 0 .2rem 1rem; margin: 1.2rem 0; }
	.deliverable h4 { margin-top: 0; }
	.deliverable p { margin-bottom: 0; }
	.self-checks { padding-left: 1.4em; margin: .5rem 0 1rem; }
	.self-checks li { margin-bottom: .6rem; }
	.checkpoint { display: flex; align-items: flex-start; gap: .7rem; min-height: 44px; padding: .9rem; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-size: .87em; }
	.complete .checkpoint { background: var(--accent-bg); border-color: var(--accent); }
	.checkpoint input { width: 22px; height: 22px; flex-shrink: 0; margin: .2em 0 0; accent-color: var(--accent-text); }
	.path-footer { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: space-between; align-items: center; }
	.back-link { display: inline-flex; align-items: center; min-height: 44px; font-size: .87em; }
	button { min-height: 44px; padding: .65rem .85rem; font: inherit; font-size: .85em; line-height: 1.6; border: 1px solid var(--border); border-radius: 7px; background: var(--bg-sidebar); color: var(--text); cursor: pointer; }
	button:hover { border-color: var(--accent); }
	.reset-confirmation { margin-top: 1rem; padding: 1rem; border: 1px solid var(--accent); border-radius: 8px; }
	.reset-confirmation p { font-size: .9em; }
	.reset-actions { display: flex; flex-wrap: wrap; gap: .65rem; }
	.clear-button { background: var(--accent-bg); color: var(--accent-text); }
	@media (max-width: 760px) { .learning-page { padding: 2rem 1.25rem 3rem; } .path-choice { gap: .6rem; padding: .9rem .75rem; } .path-brief { padding: 1rem; } }
	@media (max-width: 360px) { .learning-page { padding-inline: 1rem; } .path-choice { grid-template-columns: minmax(0, 1fr) auto; } .path-number { display: none; } }
</style>
