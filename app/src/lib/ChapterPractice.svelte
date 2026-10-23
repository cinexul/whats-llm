<script lang="ts">
	import { base } from '$app/paths';
	import type { Lang } from './manifest';
	import Icon from './Icon.svelte';
	let { slug, lang }: { slug: string; lang: Lang } = $props();
	const labByChapter: Record<string, 'context' | 'rag' | 'permissions'> = {
		'token-and-context': 'context', 'multi-turn-and-context': 'context', 'cost-quota-context': 'context',
		rag: 'rag', 'hallucination-knowledge-memory': 'rag',
		'permissions-and-rollback': 'permissions', 'what-is-agent': 'permissions', 'safe-use-and-team-rules': 'permissions'
	};
	const text = {
		zh: { label: '动手试一试', context: '装满一个上下文窗口，看看压缩后留下了什么。', rag: '调整检索证据，观察答案何时有依据、何时该暂缓判断。', permissions: '逐项开放 Agent 权限，观察哪些操作被允许或阻止。', link: '打开交互实验', note: '本地教学模拟，无需 API。' },
		ja: { label: '実際に試す', context: 'コンテキストを埋めて、圧縮後に残る情報を確かめます。', rag: '検索する資料を変え、回答を支える根拠と判断を保留すべき場面を確認します。', permissions: 'Agent の権限を一つずつ許可し、実行できる操作を確認します。', link: '体験ラボを開く', note: 'ローカルの学習用シミュレーションです。API は不要です。' },
		en: { label: 'Try it yourself', context: 'Fill a context window and see which details survive compaction.', rag: 'Change the retrieved evidence and see when it supports an answer or calls for caution.', permissions: 'Grant agent permissions one at a time and see which actions are allowed or blocked.', link: 'Open the interactive lab', note: 'A local teaching simulation. No API needed.' }
	};
	const lab = $derived(labByChapter[slug]);
	const t = $derived(text[lang]);
</script>

{#if lab}
	<aside class="practice" aria-label={t.label}>
		<p class="label">{t.label}</p>
		<p>{t[lab]}</p>
		<a href="{base}/labs/#{lab}">{t.link}<Icon name="arrow" size={18} /></a>
		<small>{t.note}</small>
	</aside>
{/if}

<style>
	.practice { border: 1px solid var(--border); border-left: 3px solid var(--accent); background: var(--bg-sidebar); border-radius: 0 12px 12px 0; padding: 1.2rem 1.4rem; margin: 2rem 0; overflow-wrap: anywhere; }
	p { margin: 0 0 .7rem; font-size: calc(.9rem * var(--scale-body)); line-height: 1.85; }
	p.label { color: var(--accent-text); font-size: calc(.75rem * var(--scale-nav)); font-weight: 600; }
	a { display: inline-flex; align-items: center; gap: .5rem; min-height: 44px; font-size: calc(.9rem * var(--scale-nav)); }
	a :global(svg) { flex-shrink: 0; }
	small { display: block; font-size: calc(.74rem * var(--scale-body)); color: var(--text-muted); }
	@media (max-width: 600px) { .practice { padding: 1rem; } }
</style>
