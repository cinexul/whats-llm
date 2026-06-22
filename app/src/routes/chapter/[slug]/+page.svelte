<script lang="ts">
	import { base } from '$app/paths';
	import { markRead } from '$lib/study';
	import { ui } from '$lib/ui';
	import Quiz from '$lib/Quiz.svelte';
	import type { Lang } from '$lib/manifest';
	import {
		annotations,
		ensureLoaded,
		addAnnotation,
		updateAnnotation,
		removeAnnotation,
		applyHighlights,
		captureSelection,
		type HighlightColor,
		type Annotation
	} from '$lib/annotations';

	let { data } = $props();
	// この章の言語に対応する UI 文言
	const t = $derived(ui[data.lang as Lang]);
	let article: HTMLElement | undefined = $state();
	// 本文コンテナは Svelte ではなく自前で管理する。
	// ({@html} + {#key} の DOM をマーカー処理が直接書き換えると、
	//  高速な章移動時に Svelte の DOM 参照が壊れて本文が消えるため)
	let proseEl: HTMLElement | undefined = $state();
	let endSentinel: HTMLElement | undefined = $state();

	// 選択中テキストに対するマーカー作成ツールバー
	let pending: { exact: string; prefix: string; suffix: string; x: number; y: number } | null =
		$state(null);
	// 既存マーカーのメモ編集ポップオーバー
	let editing: { id: string; x: number; y: number } | null = $state(null);
	let noteDraft = $state('');

	const COLORS: HighlightColor[] = ['yellow', 'green', 'pink'];

	$effect(() => {
		ensureLoaded();
	});

	// 章が変わったら開いている注釈 UI を閉じる
	$effect(() => {
		data.slug;
		pending = null;
		editing = null;
	});

	// 本文 HTML を流し込み、コピー用ボタンを付与する(本文が変わるたび)
	$effect(() => {
		const html = data.html;
		if (!proseEl) return;
		// 準備中(draft)の章は本文が無いため、流し込みもマーカー処理も行わない
		if (html == null) {
			proseEl.innerHTML = '';
			return;
		}
		proseEl.innerHTML = html;
		for (const pre of proseEl.querySelectorAll('pre.shiki')) {
			const btn = document.createElement('button');
			btn.className = 'copy-btn';
			btn.textContent = t.copyLabel;
			btn.setAttribute('aria-label', t.copyCode);
			btn.addEventListener('click', async () => {
				const code = pre.querySelector('code');
				const text = code ? (code as HTMLElement).innerText : '';
				let ok = false;
				try {
					await navigator.clipboard.writeText(text);
					ok = true;
				} catch {
					// クリップボード API が使えない環境(WebView の権限制限など)向けの代替手段
					const ta = document.createElement('textarea');
					ta.value = text;
					ta.style.position = 'fixed';
					ta.style.opacity = '0';
					document.body.appendChild(ta);
					ta.select();
					ok = document.execCommand('copy');
					ta.remove();
				}
				if (ok) {
					btn.classList.add('copied');
					btn.textContent = t.copiedLabel;
					setTimeout(() => {
						btn.classList.remove('copied');
						btn.textContent = t.copyLabel;
					}, 1500);
				}
			});
			pre.appendChild(btn);
		}
	});

	// 保存済みマーカーを本文へ反映する(本文流し込みの後に実行される)
	$effect(() => {
		data.html;
		const list = $annotations.filter((a) => a.chapter === data.slug);
		if (!proseEl) return;
		applyHighlights(proseEl, list);
	});

	// 章末まで実際にスクロールして読んだときだけ「読了」にする。
	// 前章のスクロール位置が残ったまま判定しないよう、先頭へ戻してから次フレームで監視を始める
	$effect(() => {
		const slug = data.slug;
		const lang = data.lang as Lang;
		if (!endSentinel) return;
		endSentinel.closest('main')?.scrollTo(0, 0);
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				markRead(lang, slug);
				observer.disconnect();
			}
		});
		const raf = requestAnimationFrame(() => observer.observe(endSentinel!));
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
		};
	});

	// 検索などから #見出し 付きで来たら、本文描画後にその節へスクロールする。
	// (本文は上の $effect が innerHTML で流し込むため、描画後に id を探す)
	$effect(() => {
		data.html;
		if (typeof window === 'undefined' || !proseEl) return;
		const hash = decodeURIComponent(window.location.hash.slice(1));
		if (!hash) return;
		requestAnimationFrame(() => {
			document.getElementById(hash)?.scrollIntoView({ block: 'start' });
		});
	});

	// スクロールしたら位置がずれるため、注釈 UI は閉じる
	$effect(() => {
		const close = () => {
			pending = null;
		};
		document.addEventListener('scroll', close, true);
		return () => document.removeEventListener('scroll', close, true);
	});

	function clampX(x: number): number {
		return Math.max(8, Math.min(window.innerWidth - 240, x));
	}

	function onMouseUp() {
		if (!proseEl) return;
		setTimeout(() => {
			const cap = captureSelection(proseEl!);
			if (!cap) {
				pending = null;
				return;
			}
			editing = null;
			pending = {
				exact: cap.exact,
				prefix: cap.prefix,
				suffix: cap.suffix,
				x: clampX(cap.rect.left + cap.rect.width / 2 - 110),
				y: Math.max(8, cap.rect.top - 48)
			};
		}, 0);
	}

	function createHighlight(color: HighlightColor, withNote: boolean) {
		if (!pending) return;
		const a: Annotation = {
			id: crypto.randomUUID(),
			chapter: data.slug,
			exact: pending.exact,
			prefix: pending.prefix,
			suffix: pending.suffix,
			color,
			note: '',
			createdAt: new Date().toISOString()
		};
		addAnnotation(a);
		const pos = { x: pending.x, y: pending.y };
		window.getSelection()?.removeAllRanges();
		pending = null;
		if (withNote) {
			noteDraft = '';
			editing = { id: a.id, ...pos };
		}
	}

	function onArticleClick(e: MouseEvent) {
		const mark = (e.target as HTMLElement).closest('mark.hl') as HTMLElement | null;
		if (!mark?.dataset.hlId) return;
		const a = $annotations.find((x) => x.id === mark.dataset.hlId);
		if (!a) return;
		const rect = mark.getBoundingClientRect();
		noteDraft = a.note;
		pending = null;
		editing = { id: a.id, x: clampX(rect.left), y: Math.min(window.innerHeight - 220, rect.bottom + 8) };
	}

	function closeEditor() {
		if (editing) updateAnnotation(editing.id, { note: noteDraft });
		editing = null;
	}

	const editingAnnotation = $derived(
		editing ? $annotations.find((a) => a.id === editing!.id) : undefined
	);
</script>

<svelte:head>
	<title>{data.title} | {t.appTitle}</title>
</svelte:head>

<div class="chapter" onmouseup={onMouseUp} onclick={onArticleClick} role="presentation">
	<article bind:this={article}>
		<p class="breadcrumb">{data.partTitle}</p>
		<h1>{data.title.replace(/^(第\d+章|付録\s*[A-D]?|附录\s*[A-D]|Appendix\s+[A-D]|\d+)[\s　.:：、]*/, '')}</h1>
		<div class="prose" bind:this={proseEl}></div>

		{#if data.quiz}
			<Quiz quiz={data.quiz} {t} lang={data.lang as Lang} slug={data.slug} />
		{/if}

		{#if data.draft}
			<div class="coming-soon">
				<p class="coming-soon-title">{t.comingSoon}</p>
				<p class="coming-soon-body">{t.comingSoonBody}</p>
			</div>
		{/if}

		<nav class="pager">
			{#if data.prev}
				<a class="pager-link prev" href="{base}/chapter/{data.prev.slug}/">
					<span class="pager-label">{t.prev}</span>
					<span class="pager-title">{data.prev.title}</span>
				</a>
			{:else}<span></span>{/if}
			{#if data.next}
				<a class="pager-link next" href="{base}/chapter/{data.next.slug}/">
					<span class="pager-label">{t.next}</span>
					<span class="pager-title">{data.next.title}</span>
				</a>
			{/if}
		</nav>
		<div class="end-sentinel" bind:this={endSentinel} aria-hidden="true"></div>
	</article>

	{#if data.toc.length > 0}
		<aside class="toc">
			<p class="toc-title">{t.thisPage}</p>
			<ul>
				{#each data.toc as item (item.id)}
					<li><a href="#{item.id}">{item.text}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>

{#if pending}
	<div class="hl-toolbar" style="left: {pending.x}px; top: {pending.y}px" role="toolbar">
		{#each COLORS as c (c)}
			<button
				class="hl-dot hl-dot-{c}"
				onclick={() => createHighlight(c, false)}
				aria-label="{t.marker}({c})"
			></button>
		{/each}
		<button class="hl-note-btn" onclick={() => createHighlight('yellow', true)}>{t.addNote}</button>
	</div>
{/if}

{#if editing && editingAnnotation}
	<div class="hl-pop" style="left: {editing.x}px; top: {editing.y}px" role="dialog">
		<div class="hl-pop-colors">
			{#each COLORS as c (c)}
				<button
					class="hl-dot hl-dot-{c}"
					class:selected={editingAnnotation.color === c}
					onclick={() => updateAnnotation(editing!.id, { color: c })}
					aria-label="{t.changeColor} {c}"
				></button>
			{/each}
			<button
				class="hl-delete"
				onclick={() => {
					removeAnnotation(editing!.id);
					editing = null;
				}}
			>
				{t.deleteNote}
			</button>
		</div>
		<textarea bind:value={noteDraft} placeholder={t.notePlaceholder} rows="4"></textarea>
		<button class="hl-close" onclick={closeEditor}>{t.saveClose}</button>
	</div>
{/if}

<style>
	.chapter {
		display: flex;
		gap: 2rem;
		padding: 2.6rem 2.5rem 4rem;
	}

	article {
		/* 本文は読みやすい幅を保ったまま、目次を除いた空間の中央に置く。
		   (auto マージンを本文の左右と目次の左に等配分 → 目次はウィンドウ右端へ) */
		flex: 0 1 768px;
		min-width: 0;
		margin: 0 auto;
	}

	.breadcrumb {
		font-size: 0.78rem;
		color: var(--text-faint);
		margin: 0 0 0.6rem;
	}

	h1 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: calc(1.9rem * var(--scale-heading));
		line-height: 1.45;
		margin: 0 0 1.4rem;
	}

	.end-sentinel {
		height: 1px;
	}

	/* 準備中(draft)章のプレースホルダ */
	.coming-soon {
		border: 1px dashed var(--border);
		border-radius: 12px;
		padding: 2.5rem 2rem;
		text-align: center;
		background: var(--bg-sidebar);
	}

	.coming-soon-title {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}

	.coming-soon-body {
		font-size: 0.86rem;
		color: var(--text-faint);
		margin: 0;
	}

	@media (max-width: 1000px) {
		.toc {
			display: none;
		}
	}

	.toc {
		width: 180px;
		flex-shrink: 0;
		margin-left: auto;
		position: sticky;
		top: 2.6rem;
		align-self: flex-start;
		border-left: 1px solid var(--border);
		padding-left: 1.1rem;
	}

	.toc-title {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin: 0 0 0.6rem;
	}

	.toc ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc li {
		margin-bottom: 0.45rem;
	}

	.toc a {
		font-size: calc(0.8rem * var(--scale-nav));
		line-height: 1.5;
		color: var(--text-muted);
	}

	.toc a:hover {
		color: var(--accent);
		text-decoration: none;
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3.5rem;
		border-top: 1px solid var(--border);
		padding-top: 1.5rem;
	}

	.pager-link {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		max-width: 46%;
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.7rem 1rem;
	}

	.pager-link:hover {
		border-color: var(--accent);
		text-decoration: none;
	}

	.pager-link.next {
		text-align: right;
		margin-left: auto;
	}

	.pager-label {
		font-size: 0.72rem;
		color: var(--text-faint);
	}

	.pager-title {
		font-size: 0.84rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	/* ===== マーカー作成ツールバー・メモ編集 ===== */
	.hl-toolbar {
		position: fixed;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.4rem 0.6rem;
		box-shadow: 0 6px 20px rgba(25, 25, 25, 0.14);
	}

	.hl-dot {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid rgba(25, 25, 25, 0.18);
		cursor: pointer;
		padding: 0;
	}

	.hl-dot-yellow {
		background: var(--hl-yellow);
	}

	.hl-dot-green {
		background: var(--hl-green);
	}

	.hl-dot-pink {
		background: var(--hl-pink);
	}

	.hl-dot.selected {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hl-note-btn {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 7px;
		padding: 0.2rem 0.55rem;
		cursor: pointer;
	}

	.hl-note-btn:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.hl-pop {
		position: fixed;
		z-index: 31;
		width: 260px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.7rem;
		box-shadow: 0 8px 28px rgba(25, 25, 25, 0.16);
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.hl-pop-colors {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.hl-delete {
		margin-left: auto;
		font-family: var(--font-sans);
		font-size: 0.76rem;
		color: var(--text-faint);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.hl-delete:hover {
		color: #c0392b;
	}

	.hl-pop textarea {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		line-height: 1.6;
		color: var(--text);
		background: var(--bg-sidebar);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.5rem 0.6rem;
		resize: vertical;
		outline: none;
	}

	.hl-pop textarea:focus {
		border-color: var(--accent);
	}

	.hl-close {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: #faf9f5;
		background: var(--accent);
		border: none;
		border-radius: 8px;
		padding: 0.4rem 0;
		cursor: pointer;
	}

	.hl-close:hover {
		background: var(--accent-strong);
	}
</style>
