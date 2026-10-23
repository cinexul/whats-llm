<script lang="ts">
	import { lang } from '$lib/lang';
	import { labsCopy } from './copy';
	import { GRANTS, ACTIONS, initialSandbox, performAction, undoAction, type Grant } from './scenarios';
	const t = $derived(labsCopy[$lang]);
	let grants = $state<Grant[]>([]);
	let sandbox = $state(initialSandbox());
	function toggle(grant: Grant) { grants = grants.includes(grant) ? grants.filter((value) => value !== grant) : [...grants, grant]; }
	function reset() { grants = []; sandbox = initialSandbox(); }
</script>

<p class="lab-task"><strong>{t.try}</strong> {t.permissionsTry}</p>
<fieldset class="grant-fieldset"><legend>{t.grantsTitle}</legend>
	{#each GRANTS as grant}<label class="grant-row"><input type="checkbox" checked={grants.includes(grant)} onchange={() => toggle(grant)} /><span>{t.grants[grant]}</span></label>{/each}
	<p class="lab-note">{t.grantHint}</p>
</fieldset>
<div class="mock-files"><h3>{t.filesTitle}</h3>
	<dl>
		<div><dt>/project/brief.txt</dt><dd>{t.briefContent}</dd></div>
		<div class:modified={sandbox.files.draft === 'revised'}><dt>/project/invitation.txt</dt><dd data-testid="mock-draft">{t.drafts[sandbox.files.draft]}</dd></div>
		<div><dt>/private/guest-list.csv</dt><dd>{t.privateContent}</dd></div>
	</dl>
</div>
<h3>{t.actionsTitle}</h3>
<div class="action-grid">{#each ACTIONS as action}<div><button class="lab-button" onclick={() => sandbox = performAction(sandbox, action, grants)}>{t.actions[action]}</button><p class="lab-note">{t.actionHints[action]}</p></div>{/each}</div>
<div class="lab-actions"><button class="lab-button" disabled={!sandbox.history.length} onclick={() => sandbox = undoAction(sandbox)}>{t.undo}</button><button class="lab-button quiet" onclick={reset}>{t.reset}</button></div>
<div class="permission-log" data-testid="permission-log"><h3>{t.log}</h3>
	<ol aria-live="polite" aria-relevant="additions text" aria-label={t.log}>
		{#each sandbox.events as event (event.id)}<li><div class="event-title"><span class="event-badge" class:blocked={event.status === 'blocked'}>{t.eventStatus[event.status]}</span><strong>{t.actions[event.action]}</strong></div><p>{t.eventResults[event.result]}</p></li>{/each}
	</ol>
	{#if !sandbox.events.length}<p class="lab-note">{t.emptyLog}</p>{/if}
</div>
<p class="lab-takeaway"><strong>{t.takeaway}</strong> {t.permissionsTakeaway}</p>
