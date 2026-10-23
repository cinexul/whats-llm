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
	import Icon from '$lib/Icon.svelte';
	import BookContents from '$lib/BookContents.svelte';
	import { tick, onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { allChapters, languages, type Lang } from '$lib/manifest';
	import { lang, setLang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { reloadReading } from '$lib/reading';
	import { startPwa } from '$lib/pwa';
	import { loadLocalEdits, LOCAL_EDITS_SIGNAL_KEY } from '$lib/local-edits';
	import {
		cardsStore,
		ensureLoaded,
		dueCount
	} from '$lib/study';
	import { fullTextSearch, ensureIndex, type SearchHit } from '$lib/search';
	import { semanticSearch, type SemanticHit } from '$lib/semantic';

	let { children } = $props();
	onMount(() => {
		void startPwa();
		void loadLocalEdits();
		const changed = (event: StorageEvent) => {
			if (event.storageArea !== localStorage || (event.key !== null && event.key !== LOCAL_EDITS_SIGNAL_KEY)) return;
			void loadLocalEdits();
			void invalidate('app:chapter-edits');
		};
		window.addEventListener('storage', changed);
		return () => window.removeEventListener('storage', changed);
	});

	// 現在の言語に対応する目次・UI 文言
	const t = $derived(ui[$lang]);

	// 間隔反復: 現在語のカードを読み込み、復習待ち数・章ごとの状態を導く
	const cards = $derived($cardsStore[$lang]);
	const totalDue = $derived(dueCount(cards));
	const progressActive = $derived(page.url.pathname.includes('/progress'));
	const chapterActive = $derived(page.url.pathname.includes('/chapter/'));
	const reviewActive = $derived(page.url.pathname.includes('/review'));
	const homeActive = $derived(page.url.pathname === `${base}/`);

	$effect(() => {
		ensureLoaded($lang);
		if (browser) document.documentElement.lang = $lang === 'zh' ? 'zh-CN' : $lang;
	});


	// 言語を切り替える。現在の章が新言語に無ければ、その言語の最初の章へ移動する。
	async function switchLang(next: Lang) {
		if (next === $lang) return;
		setLang(next);
		const m = page.url.pathname.match(/\/chapter\/([^/]+)\//);
		if (m) {
			const slug = decodeURIComponent(m[1]);
			const exists = allChapters(next).some((c) => c.slug === slug);
			if (exists) {
				if (page.url.searchParams.has('edition')) {
					const nextURL = new URL(page.url);
					nextURL.searchParams.set('edition', next);
					await goto(nextURL, { keepFocus: true });
					return;
				}
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
	let settingsDialog: HTMLDialogElement;
	let contentsDialog: HTMLDialogElement;
	let scrollProgress = $state(0);
	let searchOpen = $state(false);
	let query = $state('');
	let searchInput: HTMLInputElement | undefined = $state();
	let searchOpener: HTMLElement | null = null;
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
		loadPreferences();
		loaded = true;
	});

	function loadPreferences() {
		try {
			theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
			const saved = JSON.parse(localStorage.getItem('font-scales') ?? '{}');
			const scale = (key: string) => Number.isFinite(saved?.[key]) ? Math.min(1.5, Math.max(.8, saved[key])) : 1;
			scales = { nav: scale('nav'), heading: scale('heading'), body: scale('body') };
		} catch { /* Continue with current preferences if storage is unavailable. */ }
	}

	$effect(() => {
		const imported = () => {
			reloadReading();
			void loadLocalEdits();
			void invalidate('app:chapter-edits');
			loadPreferences();
			try {
				const value = localStorage.getItem('lang');
				if (value === 'zh' || value === 'en' || value === 'ja') void switchLang(value);
			} catch { /* Current language remains usable. */ }
		};
		window.addEventListener('learning-data-imported', imported);
		return () => window.removeEventListener('learning-data-imported', imported);
	});

	// テーマと文字サイズを反映・保存する
	$effect(() => {
		if (!browser || !loaded) return;
		document.documentElement.dataset.theme = theme;
		try { localStorage.setItem('theme', theme); } catch { /* Session preference still applies. */ }
	});

	$effect(() => {
		if (!browser || !loaded) return;
		const root = document.documentElement.style;
		root.setProperty('--scale-nav', String(scales.nav));
		root.setProperty('--scale-heading', String(scales.heading));
		root.setProperty('--scale-body', String(scales.body));
		try { localStorage.setItem('font-scales', JSON.stringify(scales)); } catch { /* Session preference still applies. */ }
	});

	// 章を移動したら本文のスクロール位置を先頭へ戻す(ページ内アンカーへの移動は除く)
	afterNavigate((nav) => {
		const displayedLang = page.data.lang;
		if (page.url.pathname.includes('/chapter/') && (displayedLang === 'zh' || displayedLang === 'ja' || displayedLang === 'en') && displayedLang !== $lang) setLang(displayedLang);
		contentsDialog?.close();
		settingsDialog?.close();
		if (!nav.to?.url.hash) {
			mainEl?.scrollTo(0, 0);
			scrollProgress = 0;
		}
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
		settingsDialog?.close();
		contentsDialog?.close();
		if (!searchOpen) searchOpener = document.activeElement as HTMLElement | null;
		searchOpen = true;
		settingsOpen = false;
		query = '';
		hits = [];
		semHits = [];
		void ensureIndex($lang); // 本文索引を先読みしておく
		setTimeout(() => searchInput?.focus(), 0);
	}

	async function closeSearch() {
		searchOpen = false;
		await tick();
		searchOpener?.focus();
	}

	function openSettings() {
		settingsOpen = true;
		settingsDialog.showModal();
	}

	function dismissBackdrop(event: MouseEvent) {
		const dialog = event.currentTarget as HTMLDialogElement;
		if (event.target !== dialog) return;
		const rect = dialog.getBoundingClientRect();
		if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
	}

	function onScroll(event: Event) {
		const el = event.currentTarget as HTMLElement;
		const distance = el.scrollHeight - el.clientHeight;
		scrollProgress = distance > 0 ? Math.min(100, 100 * el.scrollTop / distance) : 0;
	}

	function onSearchKeydown(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;
		const panel = e.currentTarget as HTMLElement;
		const controls = [...panel.querySelectorAll<HTMLElement>('input, button:not(:disabled)')];
		const first = controls[0];
		const last = controls.at(-1);
		if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
			e.preventDefault();
			last?.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first?.focus();
		}
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
			if (document.querySelector('dialog[open]')) return;
			openSearch();
		} else if (e.key === 'Escape') {
			if (searchOpen) closeSearch();
			settingsDialog?.close();
		}
	}

	function go(slug: string, anchor = '') {
		searchOpen = false;
		goto(`${base}/chapter/${slug}/${anchor ? `#${anchor}` : ''}`);
	}

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="{base}/manifest.webmanifest" />
	<link rel="apple-touch-icon" href="{base}/icons/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="What's LLM" />
	<meta name="theme-color" content={theme === 'dark' ? '#1f1e1b' : '#faf9f5'} />
</svelte:head>

<svelte:window onkeydown={onKeydown} onclick={onLinkClick} />

<div class="shell" inert={searchOpen}>
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
			<button class="bar-btn search-trigger" onclick={openSearch} aria-label={t.search}><span class="mobile-icon"><Icon name="search" /></span><span class="bar-label">{t.search} <kbd>Ctrl K</kbd></span></button>
			<button
				class="bar-btn"
				class:open={settingsOpen}
				onclick={openSettings}
				aria-label={t.display}
				aria-haspopup="dialog"
			>
				<span class="aa" aria-hidden="true">Aa</span><span class="bar-label"> {t.display}</span>
			</button>
		</div>
		{#if chapterActive}<progress class="reading-track" max="100" value={scrollProgress} aria-label={t.readingProgress}></progress>{/if}
	</header>

	<div class="body">
		<aside class="sidebar">
			<BookContents />
		</aside>

		<main class="content" bind:this={mainEl} onscroll={onScroll}>
			{@render children()}
		</main>
	</div>
	<nav class="mobile-nav" aria-label={t.appTitle}>
		<a href="{base}/" class:active={homeActive} aria-current={homeActive ? 'page' : undefined}><Icon name="home" /><span>{t.home}</span></a>
		<button onclick={() => contentsDialog.showModal()} class:active={chapterActive} aria-haspopup="dialog"><Icon name="book" /><span>{t.contents}</span></button>
		<a href="{base}/review/" class:active={reviewActive} aria-current={reviewActive ? 'page' : undefined}><span class="nav-icon"><Icon name="review" />{#if totalDue > 0}<span class="nav-count">{totalDue}</span>{/if}</span><span>{t.reviewNav}</span></a>
		<a href="{base}/progress/" class:active={progressActive} aria-current={progressActive ? 'page' : undefined}><Icon name="progress" /><span>{t.progressLink}</span></a>
	</nav>
</div>

<dialog bind:this={contentsDialog} class="contents-dialog" aria-label={t.contents} onclick={dismissBackdrop}>
	<div class="dialog-head"><div><p class="dialog-kicker">{t.appTitle}</p><h2>{t.contents}</h2></div><button class="icon-btn" onclick={() => contentsDialog.close()} aria-label={t.close}><Icon name="close" /></button></div>
	<div class="contents-scroll"><BookContents onNavigate={() => contentsDialog.close()} /></div>
</dialog>


<dialog bind:this={settingsDialog} class="settings-pop" aria-label={t.display} onclose={() => (settingsOpen = false)} onclick={dismissBackdrop}>
		<div class="dialog-head"><h2>{t.display}</h2><button class="icon-btn" onclick={() => settingsDialog.close()} aria-label={t.close}><Icon name="close" /></button></div>
		<div class="mobile-language">
			<p class="set-label">{t.language}</p>
			<div class="seg" role="group" aria-label={t.language}>{#each languages as l (l.code)}<button class:active={$lang === l.code} aria-pressed={$lang === l.code} onclick={() => switchLang(l.code)}>{l.label}</button>{/each}</div>
		</div>
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
	</dialog>

{#if searchOpen}
	<div
		class="search-overlay"
		onclick={closeSearch}
		role="presentation"
	>
		<div
			class="search-panel"
			onclick={(e) => e.stopPropagation()}
			onkeydown={onSearchKeydown}
			role="dialog"
			aria-modal="true"
			aria-label={t.search}
			tabindex="-1"
		>
			<div class="search-field">
			<input
				bind:this={searchInput}
				bind:value={query}
				placeholder={t.searchPlaceholder}
				aria-label={t.search}
				onkeydown={(e) => {
					if (e.key !== 'Enter') return;
					if (semHits.length > 0) go(semHits[0].slug, semHits[0].anchor);
					else if (hits.length > 0) go(hits[0].slug);
				}}
			/>
			<button class="icon-btn" onclick={closeSearch} aria-label={t.close}><Icon name="close" /></button>
			</div>
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
		isolation: isolate;
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.topbar {
		position: relative;
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
		white-space: nowrap;
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

	.content {
		flex: 1;
		min-width: 0;
		overflow-y: auto;
	}


	.settings-pop {
		position: fixed;
		top: 58px;
		right: 16px;
		z-index: 41;
		width: 320px;
		margin: 0 0 0 auto;
		color: var(--text);
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
		min-width: 0;
		width: 100%;
		flex: 1;
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

	.mobile-nav, .mobile-icon, .mobile-language {
		display: none;
	}
	.reading-track {
		display: none;
	}
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
	}
	.icon-btn:hover {
		background: var(--bg-hover);
		color: var(--text);
	}
	.dialog-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.dialog-head h2 {
		font: 600 1.35rem/1.4 var(--font-serif);
		margin: 0;
	}
	.dialog-kicker {
		font-size: .72rem;
		color: var(--accent);
		margin: 0 0 .3rem;
		letter-spacing: .08em;
	}
	dialog::backdrop {
		background: rgba(25, 25, 25, .38);
		backdrop-filter: blur(3px);
	}
	.contents-dialog {
		position: fixed;
		inset: 0 auto 0 0;
		margin: 0;
		padding: max(1.25rem, env(safe-area-inset-top)) 1.1rem 0;
		width: min(88vw, 380px);
		height: 100%;
		max-height: 100dvh;
		max-width: none;
		border: 0;
		border-right: 1px solid var(--border);
		border-radius: 0 22px 22px 0;
		background: var(--bg);
		color: var(--text);
	}
	.contents-dialog[open] {
		display: flex;
		flex-direction: column;
	}
	.contents-scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding-bottom: calc(2rem + env(safe-area-inset-bottom));
		overscroll-behavior: contain;
	}
	.search-field {
		display: flex;
		align-items: center;
		padding-right: .4rem;
		border-bottom: 1px solid var(--border);
	}
	.search-results {
		overscroll-behavior: contain;
	}
	@media (max-width: 960px) {
		.topbar {
			height: calc(56px + env(safe-area-inset-top));
			padding: env(safe-area-inset-top) max(1rem, env(safe-area-inset-right)) 0 max(1.25rem, env(safe-area-inset-left));
			background: var(--bg);
		}
		.brand {
			font-size: 1rem;
			gap: .55rem;
		}
		.brand-logo img {
			width: 26px;
			height: 26px;
		}
		.topbar-right {
			gap: .15rem;
		}
		.topbar-right .lang-seg, .topbar-right .progress-link, .bar-label, .sidebar {
			display: none;
		}
		.topbar-right button.bar-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 44px;
			height: 44px;
			padding: 0;
			border-color: transparent;
			background: transparent;
			font-size: 1.1rem;
		}
		.mobile-icon {
			display: inline-flex;
		}
		.mobile-language {
			display: block;
			margin-bottom: 1.4rem;
		}
		.content {
			overscroll-behavior-y: contain;
			scroll-padding-block: 1rem;
			padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
		}
		.mobile-nav {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			flex-shrink: 0;
			padding: .35rem max(.5rem, env(safe-area-inset-right)) calc(.35rem + env(safe-area-inset-bottom)) max(.5rem, env(safe-area-inset-left));
			border-top: 1px solid var(--border);
			background: var(--bg);
		}
		.mobile-nav a, .mobile-nav button {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: .3rem;
			min-height: 54px;
			min-width: 0;
			padding: .35rem .15rem;
			border: 0;
			border-radius: 12px;
			font: 500 .67rem/1.25 var(--font-sans);
			color: var(--text-muted);
			background: transparent;
			text-decoration: none;
			cursor: pointer;
		}
		.mobile-nav .active {
			color: var(--accent-text);
			background: var(--accent-bg);
		}
		.nav-icon {
			position: relative;
			display: flex;
		}
		.nav-count {
			position: absolute;
			top: -5px;
			left: 16px;
			min-width: 16px;
			padding: 1px 4px;
			border-radius: 20px;
			font-size: 10px;
			line-height: 1.4;
			background: var(--accent-text);
			color: var(--bg);
		}
		.reading-track {
			appearance: none;
			display: block;
			position: absolute;
			bottom: -1px;
			left: 0;
			width: 100%;
			height: 2px;
			border: 0;
			background: transparent;
			color: var(--accent);
		}
		.reading-track::-webkit-progress-bar {
			background: transparent;
		}
		.reading-track::-webkit-progress-value {
			background: var(--accent);
		}
		.reading-track::-moz-progress-bar {
			background: var(--accent);
		}
		.settings-pop {
			inset: auto 0 0;
			width: 100%;
			max-width: 540px;
			max-height: calc(100dvh - 1rem);
			margin: 0 auto;
			padding: 1.25rem 1.5rem calc(1.25rem + env(safe-area-inset-bottom));
			border-radius: 24px 24px 0 0;
			overflow-y: auto;
			overscroll-behavior: contain;
		}
		.set-label {
			font-size: .8rem;
			color: var(--text-muted);
		}
		.seg button {
			min-height: 44px;
			font-size: .9rem;
		}
		.scale-row {
			min-height: 48px;
			margin-top: .6rem;
		}
		.scale-name {
			font-size: .9rem;
		}
		.stepper button {
			width: 44px;
			height: 44px;
			font-size: 1.1rem;
		}
		.scale-val {
			width: 46px;
			font-size: .82rem;
		}
		.text-btn {
			min-height: 44px;
			font-size: .86rem;
		}
		.search-overlay {
			padding: max(12px, env(safe-area-inset-top)) max(.75rem, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(.75rem, env(safe-area-inset-left));
			align-items: flex-start;
		}
		.search-panel {
			width: 100%;
			max-width: 620px;
			max-height: calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
			border-radius: 18px;
			box-shadow: 0 12px 48px #0002;
		}
		.search-panel input {
			font-size: 16px;
			min-height: 58px;
			padding: .8rem;
		}
		.search-hits button {
			min-height: 60px;
			padding: .8rem;
		}
		.hit-title {
			font-size: .9rem;
			line-height: 1.6;
		}
		.hit-snippet {
			font-size: .8rem;
		}
		.no-hit {
			padding: 1rem;
			min-height: 80px;
		}
	}

</style>
