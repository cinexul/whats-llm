<script lang="ts">
	import type { Quiz } from '$lib/quiz';
	import { questionHash } from '$lib/quiz';
	import type { UiStrings } from '$lib/ui';
	import type { Lang } from '$lib/manifest';
	import { recordAnswer } from '$lib/study';

	let { quiz, t, lang, slug }: { quiz: Quiz; t: UiStrings; lang: Lang; slug: string } = $props();

	// 設問番号 → 選んだレター / 観察問題を開いたか / すでに記録したか
	let selected = $state<Record<number, string>>({});
	let opened = $state<Record<number, boolean>>({});
	let recordedQ = $state<Record<number, boolean>>({});

	// 章(quiz)が変わったら回答・記録状態をリセットする
	$effect(() => {
		quiz;
		slug;
		selected = {};
		opened = {};
		recordedQ = {};
	});

	const mc = $derived(quiz.questions.filter((q) => q.options.length > 0));
	const answered = $derived(mc.filter((q) => selected[q.n]).length);
	const correct = $derived(mc.filter((q) => selected[q.n] === q.correct).length);
	const allDone = $derived(mc.length > 0 && answered === mc.length);

	function choose(n: number, letter: string) {
		if (selected[n]) return; // 一度選んだら確定
		selected = { ...selected, [n]: letter };
		// 設問ごとに 1 度だけ間隔反復へ記録(「もう一度」での解き直しは再記録しない)
		const q = mc.find((x) => x.n === n);
		if (q && !recordedQ[n]) {
			recordedQ[n] = true;
			void recordAnswer(lang, slug, q.n, questionHash(q.promptHtml), letter === q.correct);
		}
	}
	function reset() {
		selected = {};
		opened = {};
	}
</script>

<section class="quiz" id="quiz">
	<h2>{t.quizTitle}</h2>
	<p class="quiz-intro">{t.quizIntro}</p>

	{#each quiz.questions as q (q.n)}
		<div class="q">
			<p class="q-prompt">
				<span class="q-num">{q.n}</span>
				{#if q.tag}<span class="q-tag">{q.tag}</span>{/if}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<span class="q-text">{@html q.promptHtml}</span>
			</p>

			{#if q.options.length > 0}
				<ul class="opts">
					{#each q.options as o (o.letter)}
						<li>
							<button
								type="button"
								class="opt"
								class:picked={selected[q.n] === o.letter}
								class:correct={!!selected[q.n] && o.letter === q.correct}
								class:wrong={selected[q.n] === o.letter && o.letter !== q.correct}
								disabled={!!selected[q.n]}
								onclick={() => choose(q.n, o.letter)}
							>
								<span class="opt-letter">{o.letter}</span>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<span class="opt-text">{@html o.html}</span>
							</button>
						</li>
					{/each}
				</ul>

				{#if selected[q.n]}
					<div class="explain" class:ok={selected[q.n] === q.correct}>
						<p class="verdict">
							{selected[q.n] === q.correct ? t.quizCorrect : t.quizWrong}
							<span class="answer-is">({t.quizAnswerIs} {q.correct})</span>
						</p>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div class="explain-body">{@html q.explanationHtml}</div>
					</div>
				{/if}
			{:else}
				<!-- 観察 / 実践問題: 標準解答なし。参考だけ開ける -->
				<p class="self-check">{t.quizSelfCheck}</p>
				{#if opened[q.n]}
					<div class="explain">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div class="explain-body">{@html q.explanationHtml}</div>
					</div>
				{:else}
					<button type="button" class="show-ref" onclick={() => (opened = { ...opened, [q.n]: true })}>
						{t.quizShowRef}
					</button>
				{/if}
			{/if}
		</div>
	{/each}

	{#if mc.length > 0}
		<div class="scorebar" class:done={allDone}>
			<span class="score">{t.quizScore} {correct} / {mc.length}</span>
			{#if answered > 0}
				<button type="button" class="retry" onclick={reset}>{t.quizRetry}</button>
			{/if}
		</div>
	{/if}
</section>

<style>
	.quiz {
		margin-top: 3rem;
		padding-top: 1.6rem;
		border-top: 1px solid var(--border);
	}
	.quiz h2 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: calc(1.3rem * var(--scale-heading));
		margin: 0 0 0.8rem;
	}
	.quiz-intro {
		font-size: calc(0.9rem * var(--scale-body));
		color: var(--text-muted);
		background: var(--bg-sidebar);
		border-left: 3px solid var(--border);
		padding: 0.6rem 0.9rem;
		border-radius: 0 8px 8px 0;
		margin: 0 0 1.6rem;
	}
	.q {
		margin-bottom: 1.9rem;
	}
	.q-prompt {
		font-size: calc(0.98rem * var(--scale-body));
		line-height: 1.7;
		margin: 0 0 0.7rem;
	}
	.q-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.4rem;
		margin-right: 0.5rem;
		border-radius: 50%;
		background: var(--accent);
		color: #faf9f5;
		font-size: 0.8rem;
		font-weight: 700;
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
		font-size: calc(0.92rem * var(--scale-body));
		line-height: 1.6;
		color: var(--text);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 9px;
		padding: 0.6rem 0.85rem;
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
	/* 選択後の配色 */
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
		margin-top: 0.7rem;
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
	.self-check {
		font-size: 0.82rem;
		color: var(--text-faint);
		margin: 0 0 0.6rem;
	}
	.show-ref {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 7px;
		padding: 0.35rem 0.8rem;
		cursor: pointer;
	}
	.show-ref:hover {
		color: var(--accent);
		border-color: var(--accent);
	}
	.scorebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.5rem;
		padding: 0.7rem 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-sidebar);
	}
	.scorebar.done {
		border-color: var(--accent);
	}
	.score {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--text);
	}
	.retry {
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 7px;
		padding: 0.3rem 0.8rem;
		cursor: pointer;
	}
	.retry:hover {
		color: var(--accent);
		border-color: var(--accent);
	}
</style>
