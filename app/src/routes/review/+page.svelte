<script lang="ts">
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { allChapters, type Lang } from '$lib/manifest';
	import { loadChapterSource } from '$lib/content';
	import { splitQuiz, questionHash, type QuizQuestion } from '$lib/quiz';
	import {
		cardsStore,
		ensureLoaded,
		dueCards,
		recordAnswer,
		type StudyCard
	} from '$lib/study';

	interface Item {
		card: StudyCard;
		q: QuizQuestion;
		title: string;
	}

	const t = $derived(ui[$lang]);

	let loading = $state(true);
	let queue = $state<Item[]>([]);
	let idx = $state(0);
	let picked = $state<string | null>(null);
	let correctCount = $state(0);
	let shownAt = $state(0);

	const current = $derived(queue[idx]);
	const finished = $derived(!loading && queue.length > 0 && idx >= queue.length);

	// 期限の来た設問を集めてセッションを組む。語が変わるたびに作り直す。
	// (cardsStore は get で読み、解答での更新がこの効果を再実行しないようにする)
	$effect(() => {
		const l = $lang;
		void buildSession(l);
	});

	async function buildSession(l: Lang) {
		loading = true;
		queue = [];
		idx = 0;
		picked = null;
		correctCount = 0;
		await ensureLoaded(l);
		const due = dueCards(get(cardsStore)[l], Date.now());

		const bySlug = new Map<string, StudyCard[]>();
		for (const c of due) {
			const arr = bySlug.get(c.slug);
			if (arr) arr.push(c);
			else bySlug.set(c.slug, [c]);
		}
		const titleOf = new Map(allChapters(l).map((c) => [c.slug, c.title]));

		const items: Item[] = [];
		for (const [slug, cs] of bySlug) {
			const src = await loadChapterSource(l, slug);
			if (!src) continue;
			const { quiz } = splitQuiz(src);
			if (!quiz) continue;
			const byHash = new Map(
				quiz.questions
					.filter((q) => q.options.length > 0)
					.map((q) => [questionHash(q.promptHtml), q])
			);
			for (const c of cs) {
				const q = byHash.get(c.qhash);
				if (q) items.push({ card: c, q, title: titleOf.get(slug) ?? slug });
			}
		}
		queue = items;
		shownAt = Date.now();
		loading = false;
	}

	function choose(letter: string) {
		if (picked || !current) return;
		picked = letter;
		const correct = letter === current.q.correct;
		if (correct) correctCount++;
		void recordAnswer(
			$lang,
			current.card.slug,
			current.q.n,
			current.card.qhash,
			correct,
			Date.now() - shownAt
		);
	}

	function next() {
		idx++;
		picked = null;
		shownAt = Date.now();
	}
</script>

<svelte:head>
	<title>{t.reviewNav} | {t.appTitle}</title>
</svelte:head>

<div class="review">
	<h1>{t.reviewTitle}</h1>

	{#if loading}
		<p class="msg">{t.reviewLoading}</p>
	{:else if queue.length === 0}
		<div class="empty">
			<p class="empty-title">{t.reviewEmptyTitle}</p>
			<p class="empty-body">{t.dueEmpty}</p>
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
					<p class="verdict">
						{picked === current.q.correct ? t.quizCorrect : t.quizWrong}
						<span class="answer-is">({t.quizAnswerIs} {current.q.correct})</span>
					</p>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="explain-body">{@html current.q.explanationHtml}</div>
				</div>
				<button class="next" onclick={next}>
					{idx + 1 < queue.length ? t.reviewNext : t.reviewFinish}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
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
</style>
