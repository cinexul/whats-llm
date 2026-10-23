/** 结果固定的教学示例。这些数值使用自定单位，不是分词器输出。 */
export const CONTEXT_CAPACITY = 1600;
export const INSTRUCTION_TOKENS = 160;
export const CONTEXT_ITEMS = [
	{ id: 'request', tokens: 260, compactTokens: 100, facts: ['audience', 'deadline', 'budget'], retained: ['audience'] },
	{ id: 'brief', tokens: 480, compactTokens: 180, facts: ['tone', 'exclusion'], retained: ['tone'] },
	{ id: 'tool', tokens: 420, compactTokens: 140, facts: ['hours', 'access'], retained: ['hours'] }
] as const;
export type ContextId = (typeof CONTEXT_ITEMS)[number]['id'];
export type FactId = (typeof CONTEXT_ITEMS)[number]['facts'][number];

export function contextBudget(selected: readonly string[], compacted: readonly string[], reservation: number) {
	const reserved = Number.isFinite(reservation) ? Math.min(600, Math.max(200, Math.round(reservation / 200) * 200)) : 400;
	const items = CONTEXT_ITEMS.filter((item) => selected.includes(item.id));
	const input = items.reduce((sum, item) => sum + (compacted.includes(item.id) ? item.compactTokens : item.tokens), INSTRUCTION_TOKENS);
	const total = input + reserved;
	const presentFacts: FactId[] = items.flatMap((item) => [...(compacted.includes(item.id) ? item.retained : item.facts)]);
	return {
		input, reserved, total, overflow: Math.max(0, total - CONTEXT_CAPACITY),
		remaining: Math.max(0, CONTEXT_CAPACITY - total), canSubmit: total <= CONTEXT_CAPACITY,
		presentFacts,
		lostFacts: CONTEXT_ITEMS.flatMap((item) => [...item.facts]).filter((fact) => !presentFacts.includes(fact))
	};
}

/** 使用虚构店铺和固定提问日期，确保重复练习时结果一致。 */
export const EVIDENCE_DATE = '2026-10-01';
export const EVIDENCE = [
	{ id: 'policy', relevant: true, days: 30, from: '2026-09-01', until: null },
	{ id: 'shipping', relevant: false, days: null, from: '2026-09-01', until: null },
	{ id: 'faq', relevant: true, days: 7, from: '2026-09-01', until: null },
	{ id: 'archive', relevant: true, days: 14, from: '2025-01-01', until: '2026-08-31' }
] as const;
export type EvidenceId = (typeof EVIDENCE)[number]['id'];
export type EvidenceStatus = 'answered' | 'missing' | 'conflict' | 'outdated';
export type EvidenceReason = 'usable' | 'irrelevant' | 'outdated';
export const EVIDENCE_PRESETS: Record<'relevant' | 'missing' | 'conflicting' | 'outdated', EvidenceId[]> = {
	relevant: ['policy'], missing: ['shipping'], conflicting: ['policy', 'faq'], outdated: ['archive']
};
export function evaluateEvidence(selected: readonly string[]) {
	const trace = EVIDENCE.filter((item) => selected.includes(item.id)).map((item) => ({
		id: item.id,
		reason: (!item.relevant ? 'irrelevant' : item.from > EVIDENCE_DATE || (item.until && item.until < EVIDENCE_DATE) ? 'outdated' : 'usable') as EvidenceReason
	}));
	const usable = EVIDENCE.filter((item) => trace.some((row) => row.id === item.id && row.reason === 'usable'));
	const conflict = new Set(usable.map((item) => item.days)).size > 1;
	const status: EvidenceStatus = conflict ? 'conflict' : usable.length ? 'answered' : trace.some((row) => row.reason === 'outdated') ? 'outdated' : 'missing';
	return {
		status, days: status === 'answered' ? usable[0].days : null,
		citations: status === 'outdated' ? trace.filter((row) => row.reason === 'outdated').map((row) => row.id) : usable.map((item) => item.id),
		trace
	};
}

export const GRANTS = ['read-brief', 'write-draft', 'run-check'] as const;
export type Grant = (typeof GRANTS)[number];
export const ACTIONS = ['read-brief', 'write-draft', 'run-check', 'read-private', 'publish'] as const;
export type Action = (typeof ACTIONS)[number];
export type DraftState = 'original' | 'revised';
export type EventResult = 'permission-needed' | 'outside-scope' | 'brief-read' | 'draft-written' | 'draft-unchanged' | 'check-passed' | 'check-failed' | 'restored';
export interface SandboxEvent {
	id: number;
	action: Action | 'undo';
	status: 'allowed' | 'blocked' | 'undone';
	result: EventResult;
}
export interface Sandbox {
	files: { draft: DraftState };
	history: DraftState[];
	events: SandboxEvent[];
}
export function initialSandbox(): Sandbox { return { files: { draft: 'original' }, history: [], events: [] }; }
export function performAction(state: Sandbox, action: Action, grants: readonly Grant[]): Sandbox {
	const inScope = (GRANTS as readonly string[]).includes(action);
	const allowed = inScope && grants.includes(action as Grant);
	let draft = state.files.draft;
	let history = state.history;
	let result: EventResult = inScope ? 'permission-needed' : 'outside-scope';
	if (allowed) {
		if (action === 'read-brief') result = 'brief-read';
		if (action === 'run-check') result = draft === 'revised' ? 'check-passed' : 'check-failed';
		if (action === 'write-draft') {
			result = draft === 'revised' ? 'draft-unchanged' : 'draft-written';
			if (draft !== 'revised') history = [...history, draft];
			draft = 'revised';
		}
	}
	return {
		files: { draft }, history,
		events: [...state.events, { id: state.events.length + 1, action, status: allowed ? 'allowed' : 'blocked', result }]
	};
}
export function undoAction(state: Sandbox): Sandbox {
	const previous = state.history.at(-1);
	if (!previous) return state;
	return {
		files: { draft: previous }, history: state.history.slice(0, -1),
		events: [...state.events, { id: state.events.length + 1, action: 'undo', status: 'undone', result: 'restored' }]
	};
}
