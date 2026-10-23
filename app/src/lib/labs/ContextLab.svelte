<script lang="ts">
	import { lang } from '$lib/lang';
	import { labsCopy } from './copy';
	import { CONTEXT_CAPACITY, CONTEXT_ITEMS, INSTRUCTION_TOKENS, contextBudget, type ContextId } from './scenarios';
	const t = $derived(labsCopy[$lang]);
	let selected = $state<ContextId[]>(['request', 'brief']);
	let compacted = $state<ContextId[]>([]);
	let reservation = $state(400);
	const budget = $derived(contextBudget(selected, compacted, reservation));
	const number = (value: number) => value.toLocaleString('en-US');
	function toggle(id: ContextId) { selected = selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]; }
	function compact(id: ContextId) { compacted = compacted.includes(id) ? compacted.filter((value) => value !== id) : [...compacted, id]; }
	function reset() { selected = ['request', 'brief']; compacted = []; reservation = 400; }
</script>

<p class="lab-task"><strong>{t.try}</strong> {t.contextTry}</p>
<div class="budget-box">
	<div class="budget-heading"><span>{t.budget}</span><strong data-testid="context-total">{number(budget.total)} <span>/ {number(CONTEXT_CAPACITY)}</span></strong></div>
	<progress class:over-budget={!budget.canSubmit} max={CONTEXT_CAPACITY} value={Math.min(budget.total, CONTEXT_CAPACITY)} aria-label={t.budget}></progress>
	<div class="budget-details"><span>{t.instructions}: {INSTRUCTION_TOKENS}</span>{#each CONTEXT_ITEMS.filter((item) => selected.includes(item.id)) as item}<span>{t.contextItems[item.id].name}: {compacted.includes(item.id) ? item.compactTokens : item.tokens}</span>{/each}<span>{t.reserved}: {budget.reserved}</span></div>
	<p class="budget-state" role="status">{budget.canSubmit ? `${t.fits} · ${t.room}: ${budget.remaining}` : `${t.over}: ${budget.overflow}`} {t.tokens}</p>
	<label class="reserve-label" for="reply-reservation">{t.reservation}</label>
	<select id="reply-reservation" bind:value={reservation}>{#each [200, 400, 600] as count}<option value={count}>{count} {t.tokens}</option>{/each}</select>
</div>
<p class="lab-note">{t.contextLimit}</p>
<div class="context-items">
	{#each CONTEXT_ITEMS as item (item.id)}
		{@const copy = t.contextItems[item.id]}
		{@const isCompact = compacted.includes(item.id)}
		<article class="source-card" class:excluded={!selected.includes(item.id)}>
			<label class="source-select"><input type="checkbox" checked={selected.includes(item.id)} onchange={() => toggle(item.id)} aria-label={`${t.included}: ${copy.name}`} /><span><strong>{copy.name}</strong><span class="small-meta">{copy.kind} · {isCompact ? item.compactTokens : item.tokens} {t.tokens}</span></span></label>
			<p class="source-text">{isCompact ? copy.summary : copy.full}</p>
			<div class="card-footer"><span class="small-meta">{isCompact ? t.summary : t.original}</span><button class="lab-button quiet" disabled={!selected.includes(item.id)} onclick={() => compact(item.id)} aria-label={`${isCompact ? t.restore : t.compact}: ${copy.name}`}>{isCompact ? t.restore : t.compact}</button></div>
		</article>
	{/each}
</div>
<div class="fact-columns">
	<div><h3>{t.present}</h3><ul class="fact-list">{#each budget.presentFacts as fact}<li>{t.facts[fact]}</li>{/each}</ul></div>
	<div><h3>{t.lost}</h3><ul class="fact-list absent">{#each budget.lostFacts as fact}<li>{t.facts[fact]}</li>{:else}<li>{t.noLoss}</li>{/each}</ul></div>
</div>
<div class="lab-result" data-testid="context-result" role="status"><h3>{t.contextQuestion}</h3><p>{!budget.canSubmit ? t.contextBlocked : budget.presentFacts.includes('deadline') ? t.contextKnown : t.contextUnknown}</p></div>
<p class="lab-takeaway"><strong>{t.takeaway}</strong> {t.contextTakeaway}</p>
<button class="lab-button" onclick={reset}>{t.reset}</button>
