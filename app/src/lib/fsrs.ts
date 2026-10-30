// FSRS-6记忆模型，逐行对应桌面版用的Rust库fsrs 6.6.1（src/model.rs、src/inference.rs）
// 和study-core的Scheduler::apply。网页版和桌面版因此按同一套规则安排复习；
import type { StudyCard } from './study';

export const DAY = 86_400_000;
export const DEFAULT_RETENTION = 0.9;
export const DEFAULT_PARAMETERS = [
	0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796,
	1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542
] as const;

export const STATE_NEW = 0;
export const STATE_REVIEW = 2;
export const STATE_RELEARNING = 3;
/** 选择题只用两档：答对=Good(3)，答错=Again(1)。 */
export const AGAIN = 1;
export const GOOD = 3;

const S_MIN = 0.001;
const S_MAX = 36500;
const D_MIN = 1;
const D_MAX = 10;

interface MemoryState { stability: number; difficulty: number }

const w = DEFAULT_PARAMETERS;
const clamp = (x: number, min: number, max: number) => Math.min(Math.max(x, min), max);

function decayFactor() {
	const decay = -w[20];
	return { decay, factor: Math.exp(Math.log(0.9) / decay) - 1 };
}

function forgettingCurve(t: number, s: number): number {
	const { decay, factor } = decayFactor();
	return Math.pow((t / s) * factor + 1, decay);
}

function nextInterval(stability: number, retention: number): number {
	const { decay, factor } = decayFactor();
	return (stability / factor) * (Math.pow(retention, 1 / decay) - 1);
}

const initStability = (rating: number) => w[Math.min(Math.max(rating - 1, 0), 3)];
const initDifficulty = (rating: number) => w[4] - Math.exp(w[5] * Math.max(rating - 1, 0)) + 1;

function nextDifficulty(d: number, rating: number): number {
	const delta = -w[6] * (rating - 3);
	return d + ((10 - d) * delta) / 9;
}

function step(deltaT: number, rating: number, state: MemoryState, nth: number): MemoryState {
	const lastS = clamp(state.stability, S_MIN, S_MAX);
	const lastD = clamp(state.difficulty, D_MIN, D_MAX);
	const r = forgettingCurve(deltaT, lastS);
	const afterSuccess = lastS * (Math.exp(w[8]) * (11 - lastD) * Math.pow(lastS, -w[9])
		* (Math.exp((1 - r) * w[10]) - 1) * (rating === 2 ? w[15] : 1) * (rating === 4 ? w[16] : 1) + 1);
	const afterFailure = Math.min(
		w[11] * Math.pow(lastD, -w[12]) * (Math.pow(lastS + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]),
		lastS / Math.exp(w[17] * w[18])
	);
	const sinc = Math.exp(w[17] * (rating - 3 + w[18])) * Math.pow(lastS, -w[19]);
	const shortTerm = lastS * (rating >= 2 ? Math.max(sinc, 1) : sinc);

	let s = rating === 1 ? afterFailure : afterSuccess;
	if (deltaT === 0) s = shortTerm;
	const nd = nextDifficulty(lastD, rating);
	let d = clamp(w[7] * (initDifficulty(4) - nd) + nd, D_MIN, D_MAX);
	if (nth === 0 && state.stability === 0) {
		s = initStability(rating);
		d = clamp(initDifficulty(rating), D_MIN, D_MAX);
	}
	return { stability: clamp(s, S_MIN, S_MAX), difficulty: d };
}

export interface Scheduled { card: StudyCard; rating: number; intervalDays: number }

/** 一次作答后的卡片状态，对应Rust的Scheduler::apply。 */
export function schedule(card: StudyCard, rating: number, now: number, retention = DEFAULT_RETENTION): Scheduled {
	const known = card.stability != null && card.difficulty != null;
	const memory = known ? { stability: card.stability!, difficulty: card.difficulty! } : { stability: 0, difficulty: 0 };
	const daysElapsed = card.lastReview != null ? Math.floor(Math.max(now - card.lastReview, 0) / DAY) : 0;
	const next = step(daysElapsed, rating, memory, known ? 1 : 0);
	const intervalDays = Math.max(Math.round(nextInterval(next.stability, retention)), 1);
	return {
		rating,
		intervalDays,
		card: {
			...card,
			stability: next.stability,
			difficulty: next.difficulty,
			state: rating === AGAIN ? STATE_RELEARNING : STATE_REVIEW,
			lastReview: now,
			due: now + intervalDays * DAY,
			reps: card.reps + 1,
			lapses: card.lapses + (rating === AGAIN && card.reps > 0 ? 1 : 0)
		}
	};
}

/** 从空白卡片开始依次重放答题记录。答题记录是唯一依据，卡片状态都能由它算出来。 */
export function replay(meta: Pick<StudyCard, 'id' | 'lang' | 'slug' | 'qn' | 'qhash'>, reviews: { ts: number; rating: number }[]): StudyCard {
	let card: StudyCard = { ...meta, stability: null, difficulty: null, state: STATE_NEW, due: null, lastReview: null, reps: 0, lapses: 0 };
	for (const review of [...reviews].sort((a, b) => a.ts - b.ts)) card = schedule(card, review.rating, review.ts).card;
	return card;
}
