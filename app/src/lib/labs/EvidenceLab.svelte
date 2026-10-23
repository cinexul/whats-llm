<script lang="ts">
	import { lang } from '$lib/lang';
	import { labsCopy } from './copy';
	import { EVIDENCE, EVIDENCE_PRESETS, evaluateEvidence, type EvidenceId } from './scenarios';
	const t = $derived(labsCopy[$lang]);
	let selected = $state<EvidenceId[]>(['policy']);
	const result = $derived(evaluateEvidence(selected));
	const presets = Object.keys(EVIDENCE_PRESETS) as (keyof typeof EVIDENCE_PRESETS)[];
	function toggle(id: EvidenceId) { selected = selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]; }
	function isPreset(preset: keyof typeof EVIDENCE_PRESETS) { const ids = EVIDENCE_PRESETS[preset]; return ids.length === selected.length && ids.every((id) => selected.includes(id)); }
</script>

<blockquote class="lab-question">{t.ragQuestion}</blockquote>
<p class="lab-task"><strong>{t.try}</strong> {t.ragTry}</p>
<div class="lab-presets" role="group" aria-label={t.jump}>
	{#each presets as preset}<button class="lab-button" class:chosen={isPreset(preset)} aria-pressed={isPreset(preset)} onclick={() => selected = [...EVIDENCE_PRESETS[preset]]}>{t.presets[preset]}</button>{/each}
</div>
<fieldset class="source-fieldset"><legend>{t.chooseSources}</legend>
	<div class="evidence-items">
		{#each EVIDENCE as source (source.id)}
			<article id={`rag-source-${source.id}`} tabindex="-1" class="source-card" class:excluded={!selected.includes(source.id)}>
				<label class="source-select"><input type="checkbox" checked={selected.includes(source.id)} onchange={() => toggle(source.id)} /><strong>{t.sources[source.id].title}</strong></label>
				<p class="source-text">{t.sources[source.id].text}</p>
				<p class="small-meta">{t.activeFrom} {source.from} · {source.until ? `${t.activeUntil} ${source.until}` : t.current}</p>
			</article>
		{/each}
	</div>
</fieldset>
<div class="evidence-trace"><h3>{t.trace}</h3><ol>{#each result.trace as row}<li><strong>{t.sources[row.id].title}</strong><span>{t.reasons[row.reason]}</span></li>{:else}<li>{t.noSources}</li>{/each}</ol></div>
<div class="lab-result" data-testid="rag-result" role="status">
	<h3>{t.answer}</h3>
	<p>{result.status === 'answered' ? t.answerDays.replace('{days}', String(result.days)) : t.ragResults[result.status]}</p>
	{#if result.citations.length}<nav class="citation-links" aria-label={t.citations}>{#each result.citations as id}<a href={`#rag-source-${id}`}>{t.sources[id].title}</a>{/each}</nav>{/if}
</div>
<p class="lab-takeaway"><strong>{t.takeaway}</strong> {t.ragTakeaway}</p>
<button class="lab-button" onclick={() => selected = ['policy']}>{t.reset}</button>
