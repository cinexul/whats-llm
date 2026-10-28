import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/fsrs-schedule.json';
import { AGAIN, GOOD, replay, schedule, STATE_NEW } from '$lib/fsrs';
import type { StudyCard } from '$lib/study';

// 对照数据由桌面版的Rust调度器生成(crates/study-core/tests/fsrs_fixture.rs)。
// Rust用32位浮点计算，这里用64位，所以稳定度和难度只比较到相对误差1e-5；
// 复习日期、次数和状态必须完全一致。
const meta = { id: 'en:what-is-llm:q01', lang: 'en', slug: 'what-is-llm', qn: 1, qhash: 'q01' };
const fresh = (): StudyCard => ({ ...meta, stability: null, difficulty: null, state: STATE_NEW, due: null, lastReview: null, reps: 0, lapses: 0 });
const close = (actual: number | null, expected: number | null) => {
	expect(actual).not.toBeNull();
	expect(Math.abs(actual! - expected!) / Math.max(1, Math.abs(expected!))).toBeLessThan(1e-5);
};

describe('FSRS matches the desktop scheduler', () => {
	for (const c of fixture.cases) {
		it(c.name, () => {
			let card = fresh();
			for (const step of c.steps) {
				const result = schedule(card, step.correct ? GOOD : AGAIN, step.at);
				card = result.card;
				const e = step.expect;
				close(card.stability, e.stability);
				close(card.difficulty, e.difficulty);
				expect(result.intervalDays).toBe(e.intervalDays);
				expect({ due: card.due, lastReview: card.lastReview, reps: card.reps, lapses: card.lapses, state: card.state })
					.toEqual({ due: e.due, lastReview: e.lastReview, reps: e.reps, lapses: e.lapses, state: e.state });
			}
		});
	}

	it('replaying the review log gives the same card as answering step by step', () => {
		for (const c of fixture.cases) {
			const card = replay(meta, c.steps.map((s) => ({ ts: s.at, rating: s.correct ? GOOD : AGAIN })));
			const last = c.steps.at(-1)!.expect;
			expect({ due: card.due, reps: card.reps, lapses: card.lapses }).toEqual({ due: last.due, reps: last.reps, lapses: last.lapses });
		}
	});
});
