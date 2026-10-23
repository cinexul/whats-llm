<script lang="ts">
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { quizCopy } from '$lib/quiz-copy';
	import { allChapters, manifests, type Lang } from '$lib/manifest';
	import { loadChapterSource } from '$lib/content';
	import { splitQuiz, questionIdentity, type QuizQuestion } from '$lib/quiz';
	import { cardsStore, ensureLoaded, dueCards, mistakeCards, fetchReviews, recordAnswer, type StudyCard } from '$lib/study';

	interface Item { card: StudyCard; q: QuizQuestion; title: string; lang: Lang }
	const t = $derived(ui[$lang]);
	const copy = $derived(quizCopy[$lang]);
	const mode = $derived(page.url.searchParams.get('mode') === 'mistakes' ? 'mistakes' : 'due');
	const topics = $derived(manifests[$lang]);
	let topic = $state('');
	let chapter = $state('');
	const chapters = $derived(topics.filter((part) => !topic || part.chapters[0]?.slug === topic).flatMap((part) => part.chapters).filter((ch) => !ch.draft));

	let loading = $state(true);
	let loadError = $state(false);
	let queue = $state<Item[]>([]);
	let idx = $state(0);
	let picked = $state<string | null>(null);
	let correctCount = $state(0);
	let shownAt = $state(0);
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let sessionGeneration = 0;
	const current = $derived(queue[idx]);
	const finished = $derived(!loading && queue.length > 0 && idx >= queue.length);

	// Freeze the queue for a session. A language/filter change invalidates every
	// pending read and save callback before it can mutate the newly visible session.
	$effect(() => {
		const l = $lang;
		const selection = mode === 'mistakes' ? new Set(chapters.filter((ch) => !chapter || ch.slug === chapter).map((ch) => ch.slug)) : undefined;
		const session = ++sessionGeneration;
		void buildSession(l, mode, selection, session);
		return () => { sessionGeneration++; };
	});

	async function buildSession(l: Lang, practice: 'due' | 'mistakes', selection: Set<string> | undefined, session: number) {
		loading = true;
		loadError = false;
		queue = [];
		idx = 0;
		picked = null;
		correctCount = 0;
		saveStatus = 'idle';
		try {
			await ensureLoaded(l);
			if (session !== sessionGeneration) return;
			const cards = get(cardsStore)[l];
			const candidates = practice === 'mistakes' ? mistakeCards(cards, await fetchReviews(l), selection) : dueCards(cards);
			if (session !== sessionGeneration) return;
			const titleOf = new Map(allChapters(l).map((c) => [c.slug, c.title]));
			const questionsBySlug = new Map<string, Map<string, QuizQuestion>>();
			await Promise.all([...new Set(candidates.map((c) => c.slug))].map(async (slug) => {
				const src = await loadChapterSource(l, slug);
				const questions = src ? splitQuiz(src).quiz?.questions ?? [] : [];
				questionsBySlug.set(slug, new Map(questions.filter((q) => q.correct).map((q) => [questionIdentity(q, l, slug), q])));
			}));
			if (session !== sessionGeneration) return;
			queue = candidates.flatMap((card) => {
				const q = questionsBySlug.get(card.slug)?.get(card.qhash);
				return q ? [{ card, q, title: titleOf.get(card.slug) ?? card.slug, lang: l }] : [];
			});
			shownAt = Date.now();
		} catch {
			if (session === sessionGeneration) loadError = true;
		} finally {
			if (session === sessionGeneration) loading = false;
		}
	}

	function choose(letter: string) {
		if (picked || !current || current.lang !== $lang) return;
		picked = letter;
		if (letter === current.q.correct) correctCount++;
		void saveAnswer();
	}

	async function saveAnswer() {
		if (!picked || !current || saveStatus === 'saving') return;
		const item = current;
		const session = sessionGeneration;
		const index = idx;
		saveStatus = 'saving';
		const saved = await recordAnswer(item.lang, item.card.slug, item.q.n, item.card.qhash, picked === item.q.correct, Date.now() - shownAt);
		if (session === sessionGeneration && index === idx) saveStatus = saved ? 'saved' : 'error';
	}

	function next() {
		idx++;
		picked = null;
		saveStatus = 'idle';
		shownAt = Date.now();
	}
</script>

<svelte:head>
	<title>{t.reviewNav} | {t.appTitle}</title>
</svelte:head>

<div class="review">
	<h1>{t.reviewTitle}</h1>
	<nav class="modes" aria-label={t.reviewTitle}>
		<a href="{base}/review/" aria-current={mode === 'due' ? 'page' : undefined}>{copy.due}</a>
		<a href="{base}/review/?mode=mistakes" aria-current={mode === 'mistakes' ? 'page' : undefined}>{copy.mistakes}</a>
	</nav>
	{#if mode === 'mistakes'}
		<p class="practice-hint">{copy.mistakeHint}</p>
		<div class="filters">
			<div class="filter">
				<label for="mistake-topic">{copy.topic}</label>
				<select id="mistake-topic" bind:value={topic} onchange={() => { chapter = ''; }}>
					<option value="">{copy.allTopics}</option>
					{#each topics as part (part.title)}<option value={part.chapters[0]?.slug}>{part.title}</option>{/each}
				</select>
			</div>
			<div class="filter">
				<label for="mistake-chapter">{copy.chapter}</label>
				<select id="mistake-chapter" bind:value={chapter}>
					<option value="">{copy.allChapters}</option>
					{#each chapters as ch (ch.slug)}<option value={ch.slug}>{ch.title}</option>{/each}
				</select>
			</div>
		</div>
	{/if}

	{#if loading}
		<p class="msg">{t.reviewLoading}</p>
	{:else if loadError}
		<p class="msg" role="alert">{copy.loadFailed}</p>
	{:else if queue.length === 0}
		<div class="empty">
			<p class="empty-title">{mode === 'mistakes' ? copy.noMistakes : t.reviewEmptyTitle}</p>
			<p class="empty-body">{mode === 'mistakes' ? copy.noMistakesBody : t.dueEmpty}</p>
			<a class="btn" href="{base}/progress/">{t.progressLink} →</a>
		</div>
	{:else if finished}
		<div class="empty">
			<p class="empty-title">{t.reviewDoneTitle}</p>
			<p class="empty-body">
				{t.reviewDoneBody.replace('{c}', String(correctCount)).replace('{n}', String(queue.length))}
			</p>
			<a class="btn" href="{base}/progress/">{t.progressLink} →</a>
		</div>
	{:else if current}
		<div class="bar">
			<span class="counter">{idx + 1} / {queue.length}</span>
			<span class="from">{current.title}</span>
		</div>

		<div class="card">
			<p class="q-prompt">
				{#if current.q.tag}<span class="q-tag">{current.q.tag}</span>{/if}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<span class="q-text">{@html current.q.promptHtml}</span>
			</p>

			<ul class="opts">
				{#each current.q.options as o (o.letter)}
					<li>
						<button
							type="button"
							class="opt"
							class:correct={!!picked && o.letter === current.q.correct}
							class:wrong={picked === o.letter && o.letter !== current.q.correct}
							disabled={!!picked}
							onclick={() => choose(o.letter)}
						>
							<span class="opt-letter">{o.letter}</span>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							<span class="opt-text">{@html o.html}</span>
						</button>
					</li>
				{/each}
			</ul>

			{#if picked}
				<div class="explain" class:ok={picked === current.q.correct}>
					<p class="verdict" role="status">
						{picked === current.q.correct ? t.quizCorrect : t.quizWrong}
						<span class="answer-is">({t.quizAnswerIs} {current.q.correct})</span>
					</p>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="explain-body">{@html current.q.explanationHtml}</div>
					<a class="chapter-link" href="{base}/chapter/{current.card.slug}/#quiz">{copy.backToChapter} →</a>
				</div>
				<p class="save-status" role="status">{saveStatus === 'error' ? copy.saveFailed : saveStatus === 'saving' ? copy.saving : copy.saved}</p>
				{#if saveStatus === 'error'}<button class="save-again" onclick={saveAnswer}>{copy.saveAgain}</button>{/if}
				<button class="next" onclick={next} disabled={saveStatus === 'saving'}>
					{idx + 1 < queue.length ? t.reviewNext : t.reviewFinish}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.modes { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
	.modes a { display: inline-flex; align-items: center; min-height: 44px; padding: 0.5rem 0.85rem; border: 1px solid var(--border); border-radius: 8px; font-size: calc(0.9rem * var(--scale-body)); }
	.modes a[aria-current] { border-color: var(--accent); background: var(--bg-sidebar); font-weight: 600; }
	.practice-hint, .save-status { color: var(--text-muted); font-size: calc(0.85rem * var(--scale-body)); line-height: 1.7; }
	.filters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0 1.5rem; }
	.filters .filter { display: flex; min-width: 0; flex-direction: column; gap: 0.4rem; color: var(--text-muted); font-size: calc(0.85rem * var(--scale-body)); }
	.filters select { min-width: 0; width: 100%; min-height: 44px; padding: 0.5rem; background: var(--bg); color: var(--text); font: inherit; border: 1px solid var(--border); border-radius: 7px; }
	.chapter-link { display: inline-block; margin-top: 0.75rem; }
	.save-again { min-height: 44px; background: var(--bg); color: var(--accent); border: 1px solid var(--accent); border-radius: 8px; padding: 0.5rem 0.75rem; font: inherit; }
	.next:disabled { opacity: 0.6; cursor: wait; }
	.modes a:focus-visible, .filters select:focus-visible, .save-again:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
	@media (max-width: 480px) { .filters { grid-template-columns: minmax(0, 1fr); } }

	.review {
		max-width: 680px;
		margin: 0 auto;
		padding: 3.5rem 2.5rem 4rem;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: calc(1.8rem * var(--scale-heading));
		margin: 0 0 1.6rem;
	}
	.msg {
		color: var(--text-faint);
	}
	.empty {
		text-align: center;
		border: 1px dashed var(--border);
		border-radius: 12px;
		padding: 3rem 2rem;
		background: var(--bg-sidebar);
	}
	.empty-title {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 1.15rem;
		margin: 0 0 0.5rem;
	}
	.empty-body {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0 0 1.4rem;
	}
	.btn {
		display: inline-block;
		font-size: 0.85rem;
		color: var(--accent);
		border: 1px solid var(--accent);
		border-radius: 8px;
		padding: 0.4rem 0.9rem;
	}
	.btn:hover {
		text-decoration: none;
		background: var(--bg-hover);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: var(--text-faint);
	}
	.counter {
		font-weight: 700;
		color: var(--text-muted);
	}
	.card {
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.5rem 1.5rem 1.3rem;
		background: var(--bg);
	}
	.q-prompt {
		font-size: calc(1.05rem * var(--scale-body));
		line-height: 1.7;
		margin: 0 0 1.2rem;
	}
	.q-tag {
		font-size: 0.74rem;
		color: var(--text-faint);
		border: 1px solid var(--border);
		border-radius: 5px;
		padding: 0.05rem 0.4rem;
		margin-right: 0.45rem;
		white-space: nowrap;
	}
	.opts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.opt {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		width: 100%;
		text-align: left;
		font-family: var(--font-sans);
		font-size: calc(0.95rem * var(--scale-body));
		line-height: 1.6;
		color: var(--text);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 9px;
		padding: 0.65rem 0.9rem;
		cursor: pointer;
		transition:
			border-color 0.12s,
			background 0.12s;
	}
	.opt:hover:not(:disabled) {
		border-color: var(--accent);
	}
	.opt:disabled {
		cursor: default;
	}
	.opt-letter {
		flex-shrink: 0;
		font-weight: 700;
		color: var(--text-muted);
	}
	.opt.correct {
		border-color: #2e9e6b;
		background: rgba(46, 158, 107, 0.1);
	}
	.opt.correct .opt-letter {
		color: #2e9e6b;
	}
	.opt.wrong {
		border-color: #d05a4e;
		background: rgba(208, 90, 78, 0.1);
	}
	.opt.wrong .opt-letter {
		color: #d05a4e;
	}
	.explain {
		margin-top: 1rem;
		font-size: calc(0.9rem * var(--scale-body));
		line-height: 1.75;
		background: var(--bg-sidebar);
		border: 1px solid var(--border);
		border-radius: 9px;
		padding: 0.7rem 0.95rem;
	}
	.verdict {
		font-weight: 700;
		margin: 0 0 0.4rem;
		color: #d05a4e;
	}
	.explain.ok .verdict {
		color: #2e9e6b;
	}
	.answer-is {
		font-weight: 400;
		color: var(--text-faint);
		font-size: 0.85em;
	}
	.explain-body {
		color: var(--text-muted);
	}
	.next {
		display: block;
		width: 100%;
		margin-top: 1.1rem;
		font-family: var(--font-sans);
		font-size: 0.92rem;
		font-weight: 600;
		color: #faf9f5;
		background: var(--accent);
		border: none;
		border-radius: 9px;
		padding: 0.7rem 0;
		cursor: pointer;
	}
	.next:hover {
		background: var(--accent-strong);
	}

	@media (max-width: 760px) {
		.review {
			max-width: 100%;
			min-width: 0;
			padding: 2rem clamp(20px, 5vw, 24px) 2.5rem;
		}
		h1 {
			font-size: calc(1.75rem * var(--scale-heading));
			line-height: 1.4;
			margin-bottom: 1.5rem;
			overflow-wrap: anywhere;
		}
		.empty {
			padding: 2rem 1.25rem;
		}
		.empty-title {
			font-size: 1.2rem;
			line-height: 1.5;
		}
		.empty-body {
			font-size: 0.95rem;
			line-height: 1.8;
		}
		.btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: 48px;
			max-width: 100%;
			padding: 0.65rem 1rem;
			font-size: 0.95rem;
			line-height: 1.6;
		}
		.bar {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.3rem;
			line-height: 1.6;
		}
		.counter {
			font-size: 0.875rem;
		}
		.from {
			max-width: 100%;
			overflow-wrap: anywhere;
			color: var(--text-muted);
		}
		.card {
			padding: 1.25rem 1rem;
			border-radius: 12px;
		}
		.q-prompt {
			font-size: calc(1rem * var(--scale-body));
			line-height: 1.8;
			margin-bottom: 1.25rem;
		}
		.q-tag {
			display: inline-block;
			margin: 0 0 0.6rem;
			white-space: normal;
		}
		.q-text {
			display: block;
			overflow-wrap: anywhere;
		}
		.opts {
			gap: 0.75rem;
		}
		.opt {
			min-height: 52px;
			padding: 0.85rem 0.75rem;
			font-size: calc(1rem * var(--scale-body));
			line-height: 1.75;
		}
		.opt-text {
			min-width: 0;
			overflow-wrap: anywhere;
		}
		.explain {
			margin-top: 1.25rem;
			padding: 0.9rem 0.8rem;
			font-size: calc(0.95rem * var(--scale-body));
			line-height: 1.8;
			overflow-wrap: anywhere;
		}
		.verdict {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: 0.2rem 0.5rem;
		}
		.next {
			min-height: 48px;
			padding: 0.875rem 1rem;
			font-size: 1rem;
		}
		.opt:focus-visible,
		.btn:focus-visible,
		.next:focus-visible {
			outline: 2px solid var(--accent);
			outline-offset: 3px;
		}
	}
</style>
