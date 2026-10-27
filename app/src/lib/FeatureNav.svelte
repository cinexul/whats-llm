<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { lang } from './lang';
	import Icon from './Icon.svelte';
	let { compact = false, onNavigate = () => {} }: { compact?: boolean; onNavigate?: () => void } = $props();
	const copy = {
		zh: { title: '把知识用起来', learn: '学习路线', learnText: '从一个目标出发，读完、动手、检查成果。', labs: '交互实验', labsText: '亲手试试上下文、检索证据与Agent权限。', library: '我的书包', libraryText: '离线下载、备份笔记，带走学习记录。' },
		ja: { title: '学んだことを試す', learn: '学習コース', learnText: '目標に沿って読み、実践し、成果を確かめる。', labs: '体験ラボ', labsText: 'コンテキスト、検索の根拠、Agentの権限を体験。', library: 'マイライブラリ', libraryText: 'オフライン保存と、ノート・学習記録のバックアップ。' },
		en: { title: 'Put it into practice', learn: 'Learning paths', learnText: 'Start with a goal. Read, try it, then check your work.', labs: 'Interactive labs', labsText: 'Explore context, retrieval evidence and agent permissions.', library: 'My library', libraryText: 'Read offline and take your notes and learning records with you.' }
	};
	const t = $derived(copy[$lang]);
	const links = $derived([
		{ route: 'learn', label: t.learn, detail: t.learnText, icon: 'book' as const },
		{ route: 'labs', label: t.labs, detail: t.labsText, icon: 'progress' as const },
		{ route: 'library', label: t.library, detail: t.libraryText, icon: 'review' as const }
	]);
</script>

<nav class:compact aria-label={t.title}>
	{#if !compact}<h2>{t.title}</h2>{/if}
	<div class="tools">
		{#each links as link (link.route)}
			<a href="{base}/{link.route}/" class:active={page.url.pathname === `${base}/${link.route}/`} aria-current={page.url.pathname === `${base}/${link.route}/` ? 'page' : undefined} onclick={onNavigate}>
				<Icon name={link.icon} size={compact ? 18 : 22} />
				<span><strong>{link.label}</strong>{#if !compact}<span class="detail">{link.detail}</span>{/if}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	nav { margin: 2.5rem 0; }
	h2 { font-family: var(--font-serif); font-size: calc(1.15rem * var(--scale-heading)); margin: 0 0 1rem; }
	.tools { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
	a { display: flex; flex-direction: column; gap: .8rem; min-width: 0; padding: 1rem; border: 1px solid var(--border); border-radius: 12px; color: var(--text); background: var(--bg-sidebar); overflow-wrap: anywhere; }
	a:hover, a.active { border-color: var(--accent); background: var(--accent-bg); text-decoration: none; }
	strong { font-size: calc(.88rem * var(--scale-nav)); font-weight: 600; }
	.detail { display: block; color: var(--text-muted); font-size: calc(.78rem * var(--scale-body)); line-height: 1.7; margin-top: .4rem; }
	.compact { margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
	.compact .tools { grid-template-columns: 1fr; gap: .15rem; }
	.compact a { flex-direction: row; align-items: center; min-height: 44px; padding: .45rem .55rem; background: transparent; border: 0; }
	.compact a:hover, .compact a.active { background: var(--accent-bg); }
	.compact strong { font-size: calc(.85rem * var(--scale-nav)); }
	@media (max-width: 600px) {
		.tools { grid-template-columns: 1fr; }
		a { flex-direction: row; align-items: flex-start; padding: 1rem; }
		a :global(svg) { flex-shrink: 0; margin-top: .15rem; }
		.detail { margin-top: .2rem; }
	}
</style>
