<script lang="ts">
	import { base } from '$app/paths';
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { labsCopy } from '$lib/labs/copy';
	import TokenLab from '$lib/labs/TokenLab.svelte';
	import ContextLab from '$lib/labs/ContextLab.svelte';
	import EvidenceLab from '$lib/labs/EvidenceLab.svelte';
	import PermissionLab from '$lib/labs/PermissionLab.svelte';
	import '$lib/labs/labs.css';
	const t = $derived(labsCopy[$lang]);
</script>

<svelte:head><title>{t.title} | {ui[$lang].appTitle}</title><meta name="description" content={t.intro} /></svelte:head>

<div class="labs">
	<header class="labs-header"><p class="lab-kicker">{t.kicker}</p><h1>{t.title}</h1><p class="labs-intro">{t.intro}</p></header>
	<aside class="simulation-note"><strong>{t.simulation}</strong><p>{t.disclaimer}</p></aside>
	<nav class="lab-jump" aria-label={t.jump}><a href="#tokens"><span>01</span>{t.tokenTitle}</a><a href="#context"><span>02</span>{t.contextTitle}</a><a href="#rag"><span>03</span>{t.ragTitle}</a><a href="#permissions"><span>04</span>{t.permissionsTitle}</a></nav>
	<section id="tokens" aria-labelledby="tokens-title" tabindex="-1" class="lab-section"><header class="lab-section-header"><span class="lab-number" aria-hidden="true">01</span><h2 id="tokens-title">{t.tokenTitle}</h2><p>{t.tokenIntro}</p><a href="{base}/chapter/token-and-context/">{t.chapter} ↗</a></header><TokenLab /></section>
	<section id="context" aria-labelledby="context-title" tabindex="-1" class="lab-section"><header class="lab-section-header"><span class="lab-number" aria-hidden="true">02</span><h2 id="context-title">{t.contextTitle}</h2><p>{t.contextIntro}</p><a href="{base}/chapter/token-and-context/">{t.chapter} ↗</a></header><ContextLab /></section>
	<section id="rag" aria-labelledby="rag-title" tabindex="-1" class="lab-section"><header class="lab-section-header"><span class="lab-number" aria-hidden="true">03</span><h2 id="rag-title">{t.ragTitle}</h2><p>{t.ragIntro}</p><a href="{base}/chapter/rag/">{t.chapter} ↗</a></header><EvidenceLab /></section>
	<section id="permissions" aria-labelledby="permissions-title" tabindex="-1" class="lab-section"><header class="lab-section-header"><span class="lab-number" aria-hidden="true">04</span><h2 id="permissions-title">{t.permissionsTitle}</h2><p>{t.permissionsIntro}</p><a href="{base}/chapter/permissions-and-rollback/">{t.chapter} ↗</a></header><PermissionLab /></section>
</div>
