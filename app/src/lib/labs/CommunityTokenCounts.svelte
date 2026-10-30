<script lang="ts">
 import { onMount } from 'svelte';
 import type { Lang } from '$lib/manifest';
 import { lang } from '$lib/lang';
 import { loadCtokCounter } from './ctok';
 import { communityCounts } from './community-counts';
 import { communityCopy } from './community-copy';
 let { texts }: {texts:Record<Lang,string>} = $props();
 const t=$derived(communityCopy[$lang]);
 const langs:Lang[]=['zh','ja','en'];
 let counter=$state.raw<Awaited<ReturnType<typeof loadCtokCounter>>|null>(null);
 let failed=$state(false);
 onMount(()=>{loadCtokCounter().then(value=>counter=value,()=>failed=true);});
 const counts=$derived(counter ? communityCounts(text=>counter!(text).count,texts) : null);
</script>
<section class="community-counter source-card" aria-labelledby="community-token-title" data-testid="community-counter">
 <h3 id="community-token-title">{t.title}</h3>
 <p class="small-meta">{t.model} · <a href="https://github.com/sanderland/ctok" target="_blank" rel="noopener noreferrer">{t.source} ↗</a></p>
 <p class="community-warning"><strong>{t.warning}</strong></p>
 {#if failed}<p role="alert">{t.failed}</p>
 {:else if !counts}<p role="status">{t.loading}</p>
 {:else}
 <div class="token-table-wrap"><table class="token-table">
 <thead><tr><th scope="col"></th><th scope="col">中文</th><th scope="col">日本語</th><th scope="col">English</th></tr></thead>
 <tbody>
 <tr><th scope="row">{t.content}</th>{#each langs as l}<td data-testid={`count-community-${l}`}>{counts[l]===null ? t.unavailable : `≈ ${counts[l]}`}</td>{/each}</tr>
 <tr><th scope="row">{t.message}</th>{#each langs as l}<td>{counts[l]===null ? t.unavailable : `≈ ${counts[l]!+6}`}</td>{/each}</tr>
 </tbody></table></div>
 {/if}
 <p class="lab-note">{t.policy}</p><p class="lab-note">{t.scope}</p>
</section>
