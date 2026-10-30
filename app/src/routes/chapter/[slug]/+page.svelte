<script lang="ts">
	import { base } from '$app/paths';
	import { markRead } from '$lib/study';
	import { rememberChapter, anchorReadingBlocks, captureReadingPosition, restoreReadingPosition, getReadingPosition, saveReadingPosition, type ReadingPosition } from '$lib/reading';
	import { ui } from '$lib/ui';
	import Quiz from '$lib/Quiz.svelte';
	import Icon from '$lib/Icon.svelte';
	import ChapterPractice from '$lib/ChapterPractice.svelte';
	import ChapterMetadata from '$lib/ChapterMetadata.svelte';
	import ChapterLocalEditor from '$lib/ChapterLocalEditor.svelte';
	import { localEditsCopy, localEditErrorText } from '$lib/local-edits-copy';
	import type { Lang } from '$lib/manifest';
	import {
		annotations,
		annotationsForChapter,
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
	// この章の言語に対応するUI文言
	const t = $derived(ui[data.lang as Lang]);
	let article: HTMLElement | undefined = $state();
	// 本文コンテナはSvelteではなく自前で管理する。
	// ({@html} + {#key} のDOMをマーカー処理が直接書き換えると、
	//  高速な章移動時にSvelteのDOM参照が壊れて本文が消えるため)
	let proseEl: HTMLElement | undefined = $state();
	let endSentinel: HTMLElement | undefined = $state();
	let mobileTocOpen = $state(false);
	let toolbarEl: HTMLDivElement | undefined = $state();
	let editorEl: HTMLDivElement | undefined = $state();
	let noteInput: HTMLTextAreaElement | undefined = $state();
	let selectionTimer: ReturnType<typeof setTimeout> | undefined;
	let mouseSelecting = false;

	// 選択中テキストに対するマーカー作成ツールバー
	let pending: { exact: string; prefix: string; suffix: string; x: number; y: number } | null =
		$state(null);
	// 既存マーカーのメモ編集ポップオーバー
	let editing: { id: string; x: number; y: number } | null = $state(null);
	let noteDraft = $state('');

	const COLORS: HighlightColor[] = ['yellow', 'green', 'pink'];
	const colorNames: Record<Lang, Record<HighlightColor, string>> = {
		zh: { yellow: '黄色', green: '绿色', pink: '粉色' },
		ja: { yellow: '黄色', green: '緑', pink: 'ピンク' },
		en: { yellow: 'Yellow', green: 'Green', pink: 'Pink' }
	};

	$effect(() => {
		ensureLoaded();
	});

	$effect(() => {
		if (!data.draft && data.html != null) rememberChapter(data.lang as Lang, data.slug);
	});

	// 章または言語が変わったら開いている注釈UIを閉じる
	$effect(() => {
		data.slug;
		data.lang;
		pending = null;
		editing = null;
		mobileTocOpen = false;
		clearTimeout(selectionTimer);
	});

	// 本文HTMLを流し込み、コピー用ボタンを付与する(本文が変わるたび)
	$effect(() => {
		const html = data.html;
		if (!proseEl) return;
		// 準備中(draft)の章は本文が無いため、流し込みもマーカー処理も行わない
		if (html == null) {
			proseEl.innerHTML = '';
			return;
		}
		proseEl.innerHTML = html;
		anchorReadingBlocks(proseEl);
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
					// クリップボードAPIが使えない環境(WebViewの権限制限など)向けの代替手段
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
		const list = annotationsForChapter($annotations, data.slug, data.lang as Lang);
		if (!proseEl) return;
		applyHighlights(proseEl, list);
	});

	// 每个监听器记录所属章节标识；清理时写入最后一次快照，
	// 不得读取可能已经属于下一章的DOM树。
	$effect(() => {
		const slug = data.slug;
		const lang = data.lang as Lang;
		const html = data.html;
		const root = proseEl;
		const sentinel = endSentinel;
		const main = sentinel?.closest('main');
		if (!root || !sentinel || !main || html == null) return;
		let disposed = false;
		let ready = false;
		let raf = 0;
		let timer: ReturnType<typeof setTimeout>;
		let snapshot: ReadingPosition | undefined;
		const flush = () => {
			clearTimeout(timer);
			if (snapshot) saveReadingPosition(lang, slug, snapshot);
		};
		const capture = () => {
			if (!ready || disposed) return;
			snapshot = captureReadingPosition(main, root);
			clearTimeout(timer);
			timer = setTimeout(flush, 200);
		};
		const persistOnHide = () => { capture(); flush(); };
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				markRead(lang, slug);
				observer.disconnect();
			}
		});
		main.addEventListener('scroll', capture, { passive: true });
		window.addEventListener('pagehide', persistOnHide);
		document.addEventListener('visibilitychange', persistOnHide);
		// 等待字体尺寸确定，并等待SvelteKit完成导航后的滚动重置。
		void document.fonts.ready.then(() => {
			if (disposed) return;
			raf = requestAnimationFrame(() => {
				raf = requestAnimationFrame(() => {
					if (disposed) return;
					let hash = '';
					try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { /* 链接格式错误 */ }
					const target = hash ? document.getElementById(hash) : null;
					const saved = getReadingPosition(lang, slug);
					// 字体加载完成时，读者可能已在选择文本。
					if (!captureSelection(root)) {
						if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
						else if (!hash && saved) restoreReadingPosition(main, root, saved);
						else main.scrollTo({ top: 0, behavior: 'instant' });
					}
					ready = true;
					observer.observe(sentinel);
				});
			});
		});
		return () => {
			disposed = true;
			flush();
			cancelAnimationFrame(raf);
			observer.disconnect();
			main.removeEventListener('scroll', capture);
			window.removeEventListener('pagehide', persistOnHide);
			document.removeEventListener('visibilitychange', persistOnHide);
		};
	});

	// スクロールしたら位置がずれるため、注釈UIは閉じる
	$effect(() => {
		const close = () => {
			pending = null;
			clearTimeout(selectionTimer);
			// 延迟的scroll事件可能晚于selectionchange到达；滚动停止后
			// 重新定位，避免取消选区后不再恢复。
			if (!window.getSelection()?.isCollapsed) scheduleSelection();
		};
		document.addEventListener('scroll', close, true);
		return () => document.removeEventListener('scroll', close, true);
	});

	// 触摸选区的拖动手柄和键盘选择不一定触发mouseup。
	$effect(() => {
		document.addEventListener('selectionchange', scheduleSelection);
		return () => {
			document.removeEventListener('selectionchange', scheduleSelection);
			clearTimeout(selectionTimer);
		};
	});

	$effect(() => {
		if (toolbarEl && pending) return positionOverlay(toolbarEl, pending.x, pending.y);
	});

	$effect(() => {
		if (!editorEl || !editing) return;
		noteInput?.focus({ preventScroll: true });
		return positionOverlay(editorEl, editing.x, editing.y, true);
	});

	// 按面板实测尺寸和当前可见区域定位，并考虑屏幕键盘占用的空间。
	function positionOverlay(element: HTMLElement, x: number, y: number, note = false) {
		const viewport = window.visualViewport;
		const place = () => {
			const left = viewport?.offsetLeft ?? 0;
			const top = viewport?.offsetTop ?? 0;
			const width = viewport?.width ?? window.innerWidth;
			const height = viewport?.height ?? window.innerHeight;
			element.style.maxWidth = `${Math.max(0, width - 16)}px`;
			element.style.maxHeight = `${Math.max(0, height - 16)}px`;
			const rect = element.getBoundingClientRect();
			const bottomSheet = note && window.matchMedia('(max-width: 760px)').matches;
			const desiredX = bottomSheet ? left + (width - rect.width) / 2 : x;
			const desiredY = bottomSheet ? top + height - rect.height - 8 : y;
			element.style.left = `${Math.max(left + 8, Math.min(left + width - rect.width - 8, desiredX))}px`;
			element.style.top = `${Math.max(top + 8, Math.min(top + height - rect.height - 8, desiredY))}px`;
		};
		place();
		const observer = new ResizeObserver(place);
		observer.observe(element);
		window.addEventListener('resize', place);
		viewport?.addEventListener('resize', place);
		viewport?.addEventListener('scroll', place);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', place);
			viewport?.removeEventListener('resize', place);
			viewport?.removeEventListener('scroll', place);
		};
	}

	function scheduleSelection() {
		clearTimeout(selectionTimer);
		selectionTimer = setTimeout(() => {
			if (!proseEl || editing || mouseSelecting) return;
			const cap = captureSelection(proseEl);
			const viewport = proseEl.closest('main')?.getBoundingClientRect();
			if (!cap || (viewport && (cap.rect.bottom <= viewport.top || cap.rect.top >= viewport.bottom))) {
				pending = null;
				return;
			}
			pending = {
				exact: cap.exact,
				prefix: cap.prefix,
				suffix: cap.suffix,
				x: cap.rect.left + cap.rect.width / 2 - 128,
				y: window.matchMedia('(pointer: coarse)').matches ? cap.rect.bottom + 8 : cap.rect.top - 68
			};
		}, 120);
	}

	function finishSelection() {
		mouseSelecting = false;
		scheduleSelection();
	}

	function preserveSelection(event: PointerEvent) {
		// 鼠标或手指按下标记操作按钮时，保留已选中的文本。
		event.preventDefault();
		clearTimeout(selectionTimer);
	}

	function createHighlight(color: HighlightColor, withNote: boolean) {
		if (!pending) return;
		const a: Annotation = {
			id: crypto.randomUUID(),
			chapter: data.slug,
			lang: data.lang as Lang,
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
		if (!window.getSelection()?.isCollapsed) return;
		const mark = (e.target as HTMLElement).closest('mark.hl') as HTMLElement | null;
		if (!mark?.dataset.hlId) return;
		const a = $annotations.find((x) => x.id === mark.dataset.hlId);
		if (!a) return;
		const rect = mark.getBoundingClientRect();
		noteDraft = a.note;
		pending = null;
		editing = { id: a.id, x: rect.left, y: rect.bottom + 8 };
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

<svelte:window
	onpointerup={finishSelection}
	onpointercancel={() => { mouseSelecting = false; }}
	onkeydown={(event) => {
		if (event.key === 'Escape') {
			if (editing) closeEditor();
			pending = null;
			clearTimeout(selectionTimer);
		}
	}}
/>

<div
	class="chapter"
	onpointerdown={(event) => { if (event.pointerType === 'mouse') mouseSelecting = true; }}
	onclick={onArticleClick}
	role="presentation"
>
	<article bind:this={article}>
		<p class="breadcrumb">{data.partTitle}</p>
		<h1>{data.title.replace(/^(第\d+章|付録\s*[A-D]?|附录\s*[A-D]|Appendix\s+[A-D]|\d+)[\s　.:：、]*/, '')}</h1>
		{#if data.localEdit?.markdown != null}
			<p class="local-edit-status" data-testid="local-edit-status"><a href="#chapter-tools">✎ {localEditsCopy[data.lang as Lang].badge}</a></p>
		{/if}
		{#if data.localEditError}<p class="local-edit-status" role="alert">{localEditErrorText(data.lang as Lang, data.localEditError)}</p>{/if}
		{#if data.toc.length > 0 || !data.draft}
			<details class="mobile-toc" bind:open={mobileTocOpen}>
				<summary><Icon name="book" size={19} /><span>{t.chapterSections}</span><span class="toc-chevron"><Icon name="chevron" size={18} /></span></summary>
				<nav aria-label={t.chapterSections}>
					{#each data.toc as item (item.id)}
						<a href="#{item.id}" onclick={() => { mobileTocOpen = false; }}>{item.text}</a>
					{/each}
					{#if !data.draft}<a href="#chapter-tools" onclick={() => { mobileTocOpen = false; }}>{localEditsCopy[data.lang as Lang].tools}</a>{/if}
				</nav>
			</details>
		{/if}
		<div class="prose" bind:this={proseEl}></div>
		<ChapterPractice slug={data.slug} lang={data.lang as Lang} />

		{#if data.quiz}
			<Quiz quiz={data.quiz} {t} lang={data.lang as Lang} slug={data.slug} />
		{/if}

		{#if data.draft}
			<div class="coming-soon">
				<p class="coming-soon-title">{t.comingSoon}</p>
				<p class="coming-soon-body">{t.comingSoonBody}</p>
			</div>
		{/if}

		<ChapterMetadata slug={data.slug} lang={data.lang as Lang} />
		{#if !data.draft}
			{#key `${data.lang}:${data.slug}`}
				<ChapterLocalEditor lang={data.lang} slug={data.slug} originalBody={data.originalBody} record={data.localEdit} errorCode={data.localEditError} />
			{/key}
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

	{#if data.toc.length > 0 || !data.draft}
		<aside class="toc">
			<p class="toc-title">{t.thisPage}</p>
			<ul>
				{#each data.toc as item (item.id)}
					<li><a href="#{item.id}">{item.text}</a></li>
				{/each}
			</ul>
			{#if !data.draft}<p class="tools-link"><a href="#chapter-tools">{localEditsCopy[data.lang as Lang].tools}</a></p>{/if}
		</aside>
	{/if}
</div>

{#if pending}
	<div class="hl-toolbar" bind:this={toolbarEl} style="left: {pending.x}px; top: {pending.y}px" role="toolbar" aria-label={t.marker}>
		{#each COLORS as c (c)}
			<button
				class="hl-dot hl-dot-{c}"
				onpointerdown={preserveSelection}
				onclick={() => createHighlight(c, false)}
				aria-label="{t.marker} ({colorNames[data.lang as Lang][c]})"
			></button>
		{/each}
		<button class="hl-note-btn" onpointerdown={preserveSelection} onclick={() => createHighlight('yellow', true)}>{t.addNote}</button>
	</div>
{/if}

{#if editing && editingAnnotation}
	<div class="hl-pop" bind:this={editorEl} style="left: {editing.x}px; top: {editing.y}px" role="dialog" aria-label={t.addNote}>
		<div class="hl-pop-header"><span>{t.addNote}</span><button class="hl-dismiss" aria-label={t.close} onclick={closeEditor}><Icon name="close" size={20} /></button></div>
		<div class="hl-pop-colors">
			{#each COLORS as c (c)}
				<button
					class="hl-dot hl-dot-{c}"
					class:selected={editingAnnotation.color === c}
					onclick={() => updateAnnotation(editing!.id, { color: c })}
					aria-label="{t.changeColor} {colorNames[data.lang as Lang][c]}"
					aria-pressed={editingAnnotation.color === c}
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
		<textarea bind:this={noteInput} bind:value={noteDraft} aria-label={t.notePlaceholder} placeholder={t.notePlaceholder} rows="4"></textarea>
		<button class="hl-close" onclick={closeEditor}>{t.saveClose}</button>
	</div>
{/if}

<style>
	.local-edit-status { font-size: .8rem; color: var(--text-muted); margin: -.3rem 0 1rem; }
	.tools-link { border-top: 1px solid var(--border); padding-top: .7rem; margin-top: 1rem; }
	.tools-link a { display: flex; align-items: center; min-height: 44px; overflow-wrap: anywhere; }
	.chapter {
		display: flex;
		gap: 2rem;
		padding: 2.6rem 2.5rem 4rem;
	}

	article {
		/* 本文は読みやすい幅を保ったまま、目次を除いた空間の中央に置く。
		   (autoマージンを本文の左右と目次の左に等配分 → 目次はウィンドウ右端へ) */
		flex: 0 1 768px;
		min-width: 0;
		margin: 0 auto;
	}

	.breadcrumb {
		font-size: calc(0.78rem * var(--scale-nav));
		color: var(--text-muted);
		margin: 0 0 0.6rem;
	}

	h1 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: calc(1.9rem * var(--scale-heading));
		line-height: 1.45;
		margin: 0 0 1.4rem;
		overflow-wrap: anywhere;
	}

	.mobile-toc {
		display: none;
		margin: 1.6rem 0 2rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		font-size: calc(0.88rem * var(--scale-nav));
	}

	.mobile-toc summary {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-height: 48px;
		padding: 0.65rem 0;
		color: var(--text-muted);
		cursor: pointer;
		list-style: none;
	}

	.mobile-toc summary::-webkit-details-marker {
		display: none;
	}

	.toc-chevron {
		margin-left: auto;
		display: flex;
	}

	.mobile-toc[open] .toc-chevron {
		transform: rotate(90deg);
	}

	.mobile-toc nav {
		display: grid;
		padding-bottom: 0.6rem;
	}

	.mobile-toc a {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0.55rem 0;
		line-height: 1.6;
		color: var(--text-muted);
		overflow-wrap: anywhere;
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
		.mobile-toc {
			display: block;
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
		font-size: calc(0.78rem * var(--scale-nav));
		color: var(--text-muted);
	}

	.pager-title {
		font-size: calc(0.9rem * var(--scale-nav));
		color: var(--text-muted);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	/* ===== マーカー作成ツールバー・メモ編集 ===== */
	.hl-toolbar {
		position: fixed;
		z-index: 70;
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
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		border-radius: 50%;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
	}

	.hl-dot::before {
		content: '';
		width: 22px;
		height: 22px;
		border: 1px solid rgba(25, 25, 25, 0.18);
		border-radius: 50%;
		background: var(--dot-color);
	}

	.hl-dot-yellow {
		--dot-color: var(--hl-yellow);
	}

	.hl-dot-green {
		--dot-color: var(--hl-green);
	}

	.hl-dot-pink {
		--dot-color: var(--hl-pink);
	}

	.hl-dot.selected::before {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hl-note-btn {
		min-width: 44px;
		min-height: 44px;
		font-family: var(--font-sans);
		font-size: calc(0.88rem * var(--scale-nav));
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
		z-index: 71;
		width: 320px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.7rem;
		box-shadow: 0 8px 28px rgba(25, 25, 25, 0.16);
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		overflow: auto;
		overscroll-behavior: contain;
	}

	.hl-pop-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: calc(0.9rem * var(--scale-nav));
		color: var(--text-muted);
	}

	.hl-dismiss {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
	}

	.hl-pop-colors {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.hl-delete {
		margin-left: auto;
		min-width: 44px;
		min-height: 44px;
		font-family: var(--font-sans);
		font-size: calc(0.88rem * var(--scale-nav));
		color: var(--text-muted);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.hl-delete:hover {
		color: #c0392b;
	}

	.hl-pop textarea {
		font-family: var(--font-sans);
		font-size: max(16px, calc(1rem * var(--scale-body)));
		line-height: 1.6;
		width: 100%;
		min-height: 96px;
		flex-shrink: 0;
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
		min-height: 44px;
		flex-shrink: 0;
		font-family: var(--font-sans);
		font-size: calc(0.9rem * var(--scale-nav));
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

	@media (max-width: 760px) {
		.chapter {
			padding: 1.8rem clamp(20px, 5vw, 24px) 3rem;
		}
		article {
			flex-basis: auto;
			width: 100%;
		}
		h1 {
			font-size: calc(clamp(1.65rem, 6vw, 2rem) * var(--scale-heading));
			line-height: 1.5;
		}
		.pager {
			flex-direction: column;
			gap: 0.8rem;
			margin-top: 2.5rem;
		}
		.pager-link,
		.pager-link.next {
			max-width: none;
			width: 100%;
			margin-left: 0;
			text-align: left;
		}
		.pager > span {
			display: none;
		}
		.hl-pop {
			width: calc(100vw - 16px);
			padding: 0.8rem;
			padding-bottom: max(0.8rem, env(safe-area-inset-bottom));
			border-radius: 16px;
		}
	}
</style>
