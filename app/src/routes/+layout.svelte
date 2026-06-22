<script lang="ts">
	import '../app.css';
	import '@fontsource/noto-sans-jp/400.css';
	import '@fontsource/noto-sans-jp/500.css';
	import '@fontsource/noto-sans-jp/700.css';
	import '@fontsource/noto-serif-jp/500.css';
	import '@fontsource/noto-serif-jp/600.css';
	import '@fontsource/noto-serif-jp/700.css';
	import '@fontsource/jetbrains-mono/400.css';
	import favicon from '$lib/assets/myself.jpg';
	import logo from '$lib/assets/myself.jpg';
	import { page } from '$app/state';
	import { goto, afterNavigate, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { manifests, allChapters, languages, type Lang } from '$lib/manifest';
	import { lang, setLang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import {
		cardsStore,
		readStore,
		ensureLoaded,
		dueCount,
		chapterSummary,
		type Mastery
	} from '$lib/study';
	import { fullTextSearch, ensureIndex, type SearchHit } from '$lib/search';
	import { semanticSearch, type SemanticHit } from '$lib/semantic';

	let { children } = $props();

	// 現在の言語に対応する目次・UI 文言
	const parts = $derived(manifests[$lang]);
	const t = $derived(ui[$lang]);

	// 間隔反復: 現在語のカードを読み込み、復習待ち数・章ごとの状態を導く
	const cards = $derived($cardsStore[$lang]);
	const totalDue = $derived(dueCount(cards));
	const progressActive = $derived(page.url.pathname.includes('/progress'));
	const reviewActive = $derived(page.url.pathname.includes('/review'));

	$effect(() => {
		ensureLoaded($lang);
	});

	function masteryTitle(m: Mastery): string {
		return m === 'mastered'
			? t.masteryMastered
			: m === 'reviewing'
				? t.masteryReviewing
				: m === 'learning'
					? t.masteryLearning
					: t.masteryNew;
	}

	// 言語を切り替える。現在の章が新言語に無ければ、その言語の最初の章へ移動する。
	async function switchLang(next: Lang) {
		if (next === $lang) return;
		setLang(next);
		const m = page.url.pathname.match(/\/chapter\/([^/]+)\//);
		if (m) {
			const slug = decodeURIComponent(m[1]);
			const exists = allChapters(next).some((c) => c.slug === slug);
			if (exists) {
				// 同じ slug が両言語にある場合は本文だけ再読み込みする
				await invalidate('app:lang');
			} else {
				// 無ければ新言語の最初の章へ
				const first = allChapters(next)[0];
				await goto(`${base}/chapter/${first.slug}/`);
			}
		}
		// トップページなどはストア更新で自動的に再描画される
	}

	let theme = $state('light');
	let scales = $state({ nav: 1, heading: 1, body: 1 });
	let settingsOpen = $state(false);
	let searchOpen = $state(false);
	let query = $state('');
	let searchInput: HTMLInputElement | undefined = $state();
	let mainEl: HTMLElement | undefined = $state();
	let loaded = $state(false);

	const scaleRows = $derived([
		{ key: 'nav' as const, label: t.fsNav },
		{ key: 'heading' as const, label: t.fsHeading },
		{ key: 'body' as const, label: t.fsBody }
	]);

	// 保存済みの表示設定を読み込む(初回のみ)
	$effect(() => {
		if (!browser || loaded) return;
		theme = localStorage.getItem('theme') ?? 'light';
		try {
			const saved = JSON.parse(localStorage.getItem('font-scales') ?? '{}');
			scales = { nav: 1, heading: 1, body: 1, ...saved };
		} catch {
			/* 既定値のまま */
		}
		loaded = true;
	});

	// テーマと文字サイズを反映・保存する
	$effect(() => {
		if (!browser || !loaded) return;
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
	});

	$effect(() => {
		if (!browser || !loaded) return;
		const root = document.documentElement.style;
		root.setProperty('--scale-nav', String(scales.nav));
		root.setProperty('--scale-heading', String(scales.heading));
		root.setProperty('--scale-body', String(scales.body));
		localStorage.setItem('font-scales', JSON.stringify(scales));
	});

	// 章を移動したら本文のスクロール位置を先頭へ戻す(ページ内アンカーへの移動は除く)
	afterNavigate((nav) => {
		if (!nav.to?.url.hash) mainEl?.scrollTo(0, 0);
	});

	function step(key: 'nav' | 'heading' | 'body', delta: number) {
		const next = Math.round((scales[key] + delta) * 10) / 10;
		scales[key] = Math.min(1.5, Math.max(0.8, next));
	}

	let hits: SearchHit[] = $state([]);
	let semHits: SemanticHit[] = $state([]);

	// 入力に応じて全文検索(キーワード一致)と意味検索を実行する。
	// 全文索引は初回検索時に構築。意味検索はモデル推論が走るので軽くデバウンスする。
	// 言語が変わったら、その言語で検索し直す。
	$effect(() => {
		const q = query;
		const l = $lang;
		let alive = true;
		fullTextSearch(l, q).then((r) => {
			if (alive) hits = r;
		});
		const timer = setTimeout(() => {
			semanticSearch(l, q).then((r) => {
				if (alive) semHits = r;
			});
		}, 200);
		return () => {
			alive = false;
			clearTimeout(timer);
		};
	});

	function openSearch() {
		searchOpen = true;
		settingsOpen = false;
		query = '';
		hits = [];
		semHits = [];
		void ensureIndex($lang); // 本文索引を先読みしておく
		setTimeout(() => searchInput?.focus(), 0);
	}

	// 外部リンクは WebView 内で遷移させず、OS の既定ブラウザで開く。
	// (Tauri のウィンドウで外部サイトへ遷移すると「戻る」手段がなくなるため)
	function onLinkClick(e: MouseEvent) {
		const a = (e.target as HTMLElement).closest?.('a[href]');
		if (!a) return;
		const href = a.getAttribute('href') ?? '';
		if (!href.startsWith('https://')) return;
		e.preventDefault();
		if ('__TAURI_INTERNALS__' in window) {
			import('@tauri-apps/api/core')
				.then(({ invoke }) => invoke('open_external', { url: href }))
				.catch(() => {
					/* 開けない場合は何もしない(アプリ内遷移よりは安全) */
				});
		} else {
			window.open(href, '_blank', 'noopener');
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			openSearch();
		} else if (e.key === 'Escape') {
			searchOpen = false;
			settingsOpen = false;
		}
	}

	function go(slug: string, anchor = '') {
		searchOpen = false;
		goto(`${base}/chapter/${slug}/${anchor ? `#${anchor}` : ''}`);
	}

	function isActive(slug: string): boolean {
		return page.url.pathname.includes(`/chapter/${slug}/`);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onkeydown={onKeydown} onclick={onLinkClick} />

<div class="shell">
	<header class="topbar">
		<a class="brand" href="{base}/">
			<span class="brand-logo"><img src={logo} alt="What's LLM" /></span>
			{t.appTitle}
		</a>
		<div class="topbar-right">
			<div class="lang-seg" role="group" aria-label={t.language}>
				{#each languages as l (l.code)}
					<button
						class:active={$lang === l.code}
						onclick={() => switchLang(l.code)}
						aria-pressed={$lang === l.code}>{l.label}</button
					>
				{/each}
			</div>
			<a class="bar-btn progress-link" class:active={reviewActive} href="{base}/review/">
				{t.reviewNav}{#if totalDue > 0}<span class="due-badge">{totalDue}</span>{/if}
			</a>
			<a class="bar-btn progress-link" class:active={progressActive} href="{base}/progress/">
				{t.progressLink}
			</a>
			<button class="bar-btn" onclick={openSearch}>{t.search}　<kbd>Ctrl K</kbd></button>
			<button
				class="bar-btn"
				class:open={settingsOpen}
				onclick={() => (settingsOpen = !settingsOpen)}
			>
				<span class="aa">Aa</span>　{t.display}
			</button>
		</div>
	</header>

	<div class="body">
		<aside class="sidebar">
			<nav>
				{#each parts as part (part.title)}
					<p class="part-title">{part.title}</p>
					<ul>
						{#each part.chapters as ch (ch.slug)}
							{@const sum = chapterSummary(cards, ch.slug)}
							<li>
								<a
									href="{base}/chapter/{ch.slug}/"
									class:active={isActive(ch.slug)}
									class:draft={ch.draft}
								>
									<span class="ch-title">{ch.title}</span>
									<span class="marks">
										{#if sum.due > 0}
											<span class="dot due" title={t.reviewDue}></span>
										{:else if sum.mastery}
											<span class="dot m-{sum.mastery}" title={masteryTitle(sum.mastery)}></span>
										{/if}
										{#if $readStore[$lang].has(ch.slug)}<span class="read-mark" title={t.readMark}>✓</span>{/if}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			</nav>
		</aside>

		<main class="content" bind:this={mainEl}>
			{@render children()}
		</main>
	</div>
</div>

{#if settingsOpen}
	<div class="pop-backdrop" onclick={() => (settingsOpen = false)} role="presentation"></div>
	<div class="settings-pop" role="dialog" aria-label={t.display}>
		<p class="set-label">{t.theme}</p>
		<div class="seg">
			<button class:active={theme === 'light'} onclick={() => (theme = 'light')}>{t.themeLight}</button>
			<button class:active={theme === 'dark'} onclick={() => (theme = 'dark')}>{t.themeDark}</button>
		</div>

		<p class="set-label">{t.fontSize}</p>
		{#each scaleRows as row (row.key)}
			<div class="scale-row">
				<span class="scale-name">{row.label}</span>
				<div class="stepper">
					<button onclick={() => step(row.key, -0.1)} aria-label="{row.label} {t.fsDecrease}">−</button>
					<span class="scale-val">{Math.round(scales[row.key] * 100)}%</span>
					<button onclick={() => step(row.key, 0.1)} aria-label="{row.label} {t.fsIncrease}">＋</button>
				</div>
			</div>
		{/each}

		<div class="set-footer">
			<button class="text-btn" onclick={() => (scales = { nav: 1, heading: 1, body: 1 })}>
				{t.fsReset}
			</button>
		</div>
	</div>
{/if}

{#if searchOpen}
	<div
		class="search-overlay"
		onclick={() => (searchOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (searchOpen = false)}
		role="presentation"
	>
		<div class="search-panel" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
			<input
				bind:this={searchInput}
				bind:value={query}
				placeholder={t.searchPlaceholder}
				onkeydown={(e) => {
					if (e.key !== 'Enter') return;
					if (semHits.length > 0) go(semHits[0].slug, semHits[0].anchor);
					else if (hits.length > 0) go(hits[0].slug);
				}}
			/>
			<div class="search-results">
				{#if semHits.length > 0}
					<p class="search-section-label">{t.searchSemantic}</p>
					<ul class="search-hits">
						{#each semHits as hit (hit.slug + '#' + hit.anchor)}
							<li>
								<button onclick={() => go(hit.slug, hit.anchor)}>
									<span class="hit-title"
										>{hit.title}{#if hit.heading}<span class="hit-heading">
												· {hit.heading}</span
											>{/if}</span
									>
									<span class="hit-snippet">{hit.snippet}</span>
								</button>
							</li>
						{/each}
					</ul>
					<p class="search-section-label">{t.searchFulltext}</p>
				{/if}
				<ul class="search-hits">
					{#each hits as hit (hit.slug)}
						<li>
							<button onclick={() => go(hit.slug)}>
								<span class="hit-title">{hit.title}</span>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<span class="hit-snippet">{@html hit.snippet}</span>
							</button>
						</li>
					{:else}
						<li class="no-hit">{query.trim() ? t.searchNoHit : t.searchEmpty}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}

<style>
	.shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.25rem;
		height: 52px;
		flex-shrink: 0;
		border-bottom: 1px solid var(--border);
		background: var(--bg-sidebar);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 0.98rem;
		color: var(--text);
	}

	.brand:hover {
		text-decoration: none;
	}

	.brand-logo {
		display: flex;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: 50%;
		overflow: hidden;
		padding: 0;
	}

	.brand-logo img {
		height: 24px;
		width: 24px;
		object-fit: cover;
		display: block;
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* 言語切替トグル(中文 / 日本語) */
	.lang-seg {
		display: flex;
		border: 1px solid var(--border);
		border-radius: 7px;
		overflow: hidden;
	}

	.lang-seg button {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--text-muted);
		background: var(--bg);
		border: none;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
	}

	.lang-seg button + button {
		border-left: 1px solid var(--border);
	}

	.lang-seg button:hover {
		color: var(--text);
	}

	.lang-seg button.active {
		background: var(--accent);
		color: #faf9f5;
	}

	.bar-btn {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--text-muted);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 7px;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
	}

	.bar-btn:hover,
	.bar-btn.open,
	.bar-btn.active {
		color: var(--text);
		border-color: var(--accent);
	}

	.progress-link {
		display: inline-flex;
		align-items: center;
	}

	.progress-link:hover {
		text-decoration: none;
	}

	.due-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.05rem;
		height: 1.05rem;
		padding: 0 0.3rem;
		margin-left: 0.35rem;
		border-radius: 999px;
		background: #c98a3a;
		color: #faf9f5;
		font-size: 0.68rem;
		font-weight: 700;
		line-height: 1;
	}

	.bar-btn kbd {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0 0.3rem;
		margin-left: 0.2rem;
	}

	.aa {
		font-family: var(--font-serif);
		font-weight: 600;
	}

	.body {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.sidebar {
		width: 270px;
		flex-shrink: 0;
		overflow-y: auto;
		background: var(--bg-sidebar);
		border-right: 1px solid var(--border);
		padding: 1.1rem 0.9rem 2rem;
	}

	.part-title {
		font-size: calc(0.72rem * var(--scale-nav));
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin: 1.2rem 0 0.35rem;
		padding-left: 0.55rem;
	}

	.sidebar nav > .part-title:first-child {
		margin-top: 0;
	}

	.sidebar ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.sidebar a {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem;
		font-size: calc(0.85rem * var(--scale-nav));
		line-height: 1.55;
		color: var(--text-muted);
		padding: 0.28rem 0.55rem;
		border-radius: 7px;
		margin-bottom: 1px;
	}

	.sidebar a:hover {
		background: var(--bg-hover);
		text-decoration: none;
	}

	.sidebar a.active {
		background: var(--accent);
		color: #faf9f5;
	}

	.sidebar a.draft .ch-title {
		opacity: 0.45;
	}

	.read-mark {
		font-size: calc(0.7rem * var(--scale-nav));
		color: var(--accent);
		flex-shrink: 0;
	}

	.sidebar a.active .read-mark {
		color: #faf9f5;
	}

	/* 章ごとの定着度 / 復習待ちドット */
	.marks {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		flex-shrink: 0;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--text-faint);
		flex-shrink: 0;
	}

	.dot.m-learning {
		background: #c98a3a;
	}

	.dot.m-reviewing {
		background: var(--accent);
	}

	.dot.m-mastered {
		background: #2e9e6b;
	}

	.dot.due {
		background: #c98a3a;
		box-shadow: 0 0 0 2px rgba(201, 138, 58, 0.25);
	}

	.sidebar a.active .dot {
		background: #faf9f5;
		box-shadow: none;
	}

	.content {
		flex: 1;
		min-width: 0;
		overflow-y: auto;
	}

	.pop-backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
	}

	.settings-pop {
		position: fixed;
		top: 58px;
		right: 16px;
		z-index: 41;
		width: 280px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.9rem 1rem 0.8rem;
		box-shadow: 0 8px 28px rgba(25, 25, 25, 0.12);
	}

	.set-label {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin: 0 0 0.45rem;
	}

	.seg + .set-label {
		margin-top: 1rem;
	}

	.seg {
		display: flex;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	.seg button {
		flex: 1;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		padding: 0.35rem 0;
		background: var(--bg);
		color: var(--text-muted);
		border: none;
		cursor: pointer;
	}

	.seg button + button {
		border-left: 1px solid var(--border);
	}

	.seg button.active {
		background: var(--accent);
		color: #faf9f5;
	}

	.scale-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.45rem;
	}

	.scale-name {
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.stepper button {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		line-height: 1;
		width: 26px;
		height: 26px;
		background: transparent;
		color: var(--text-muted);
		border: none;
		cursor: pointer;
	}

	.stepper button:hover {
		color: var(--accent);
	}

	.scale-val {
		font-size: 0.76rem;
		color: var(--text);
		width: 38px;
		text-align: center;
	}

	.set-footer {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		margin-top: 0.8rem;
		border-top: 1px solid var(--border);
		padding-top: 0.6rem;
	}

	.text-btn {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--text-faint);
		background: transparent;
		border: none;
		text-align: left;
		padding: 0.2rem 0;
		cursor: pointer;
	}

	.text-btn:hover {
		color: var(--accent);
	}

	.search-overlay {
		position: fixed;
		inset: 0;
		background: rgba(25, 25, 25, 0.35);
		display: flex;
		justify-content: center;
		padding-top: 12vh;
		z-index: 50;
	}

	.search-panel {
		width: min(560px, 90vw);
		max-height: 60vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
	}

	.search-panel input {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		color: var(--text);
		background: transparent;
		border: none;
		outline: none;
		border-bottom: 1px solid var(--border);
		padding: 0.85rem 1.1rem;
	}

	.search-results {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.search-section-label {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--text-faint);
		margin: 0;
		padding: 0.6rem 0.8rem 0.2rem;
	}

	.search-hits {
		list-style: none;
		margin: 0;
		padding: 0.4rem;
	}

	.hit-heading {
		color: var(--text-faint);
		font-weight: 400;
	}

	.search-hits button {
		display: block;
		width: 100%;
		text-align: left;
		font-family: var(--font-sans);
		background: transparent;
		border: none;
		border-radius: 7px;
		padding: 0.5rem 0.7rem;
		cursor: pointer;
	}

	.search-hits button:hover {
		background: var(--bg-hover);
	}

	.hit-title {
		display: block;
		font-size: 0.87rem;
		color: var(--text);
		margin-bottom: 0.15rem;
	}

	.hit-snippet {
		display: block;
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--text-faint);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hit-snippet :global(mark) {
		background: var(--hl-yellow);
		color: var(--text);
		border-radius: 2px;
		padding: 0 1px;
	}

	.no-hit {
		font-size: 0.85rem;
		color: var(--text-faint);
		padding: 0.6rem 0.7rem;
	}
</style>
