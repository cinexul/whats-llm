<script lang="ts">
	import { onMount } from 'svelte';
	import { lang } from '$lib/lang';
	import type { Lang } from '$lib/manifest';
	import { labsCopy } from './copy';
	import { loadTokenizers, TOKEN_SAMPLES, TOKENIZERS, type Tokenized, type TokenizerId, type TokenPreset } from './tokenizers';
	const t = $derived(labsCopy[$lang]);
	const LANGS: Lang[] = ['zh', 'ja', 'en'];
	const PRESETS = Object.keys(TOKEN_SAMPLES) as TokenPreset[];
	let preset = $state<TokenPreset | null>('everyday');
	let texts = $state<Record<Lang, string>>({ ...TOKEN_SAMPLES.everyday });
	let view = $state<TokenizerId>('o200k');
	let encoders = $state.raw<Awaited<ReturnType<typeof loadTokenizers>> | null>(null);
	let failed = $state(false);
	onMount(() => { loadTokenizers().then((loaded) => (encoders = loaded), () => (failed = true)); });
	const results = $derived(encoders
		? Object.fromEntries(LANGS.map((l) => [l, Object.fromEntries(TOKENIZERS.map((id) => [id, encoders![id](texts[l])]))])) as Record<Lang, Record<TokenizerId, Tokenized>>
		: null);
	const fewest = (id: TokenizerId) => results ? Math.min(...LANGS.map((l) => results[l][id].count)) : 0;
	const shown = (text: string) => text.replaceAll('\n', '↵');
	function choose(next: TokenPreset) { preset = next; texts = { ...TOKEN_SAMPLES[next] }; }
	function edit(l: Lang, value: string) { texts = { ...texts, [l]: value }; preset = null; }
	function reset() { choose('everyday'); view = 'o200k'; }
</script>

<p class="lab-task"><strong>{t.try}</strong> {t.tokenTry}</p>
<div class="lab-presets" role="group" aria-label={t.tokenTitle}>
	{#each PRESETS as p}<button class="lab-button" class:chosen={preset === p} aria-pressed={preset === p} onclick={() => choose(p)}>{t.tokenPresets[p]}</button>{/each}
</div>
{#if failed}
	<p class="lab-result" role="alert">{t.tokenFailed}</p>
{:else if !results}
	<p class="lab-note" role="status">{t.tokenLoading}</p>
{:else}
	<div class="token-table-wrap">
		<table class="token-table" data-testid="token-table">
			<thead><tr><th scope="col"></th>{#each LANGS as l}<th scope="col" lang={l}>{t.languageNames[l]}</th>{/each}</tr></thead>
			<tbody>
				{#each TOKENIZERS as id}
					<tr><th scope="row">{t.tokenizers[id]}</th>{#each LANGS as l}<td class:fewest={results[l][id].count === fewest(id)} data-testid={`count-${id}-${l}`}>{results[l][id].count}</td>{/each}</tr>
				{/each}
				<tr class="chars"><th scope="row">{t.characters}</th>{#each LANGS as l}<td>{[...texts[l]].length}</td>{/each}</tr>
			</tbody>
		</table>
	</div>
	<ul class="token-notes">{#each TOKENIZERS as id}<li><strong>{t.tokenizers[id]}</strong>{t.colon}{t.tokenizerNotes[id]}</li>{/each}</ul>
{/if}
<div class="lab-presets" role="group" aria-label={t.showPieces}>
	<span class="small-meta">{t.showPieces}</span>
	{#each TOKENIZERS as id}<button class="lab-button quiet" class:chosen={view === id} aria-pressed={view === id} onclick={() => (view = id)}>{t.tokenizers[id]}</button>{/each}
</div>
<div class="token-inputs">
	{#each LANGS as l}
		<div class="source-card">
			<label class="small-meta" for={`token-text-${l}`}>{t.languageNames[l]}{#if results}{t.colon}{results[l][view].count} {t.tokens}{/if}</label>
			<textarea id={`token-text-${l}`} class="token-text" lang={l} rows="2" maxlength="600" value={texts[l]} oninput={(event) => edit(l, event.currentTarget.value)}></textarea>
			{#if results}
				<p class="token-pieces" lang={l} aria-hidden="true">{#each results[l][view].pieces as piece, i}<span class="token-piece" class:alt={i % 2 === 1}>{shown(piece.text)}{#if piece.tokens > 1}<sub>×{piece.tokens}</sub>{/if}</span>{/each}</p>
			{/if}
		</div>
	{/each}
</div>
<p class="lab-note">{t.pieceHint}</p>
<p class="lab-note">{t.tokenNote}</p>
<p class="lab-takeaway"><strong>{t.takeaway}</strong> {t.tokenTakeaway}</p>
<button class="lab-button" onclick={reset}>{t.reset}</button>
