import { describe, expect, it } from 'vitest';
import { contextBudget, CONTEXT_ITEMS, evaluateEvidence, initialSandbox, performAction, undoAction } from '$lib/labs/scenarios';

describe('context budget lesson', () => {
	it('reserves instructions and output, and blocks a proposed input over the limit', () => {
		const result = contextBudget(['request', 'brief', 'tool'], [], 400);
		expect(result.total).toBe(1720);
		expect(result.overflow).toBe(120);
		expect(result.canSubmit).toBe(false);
	});
	it('compaction recovers space but loses the exact deadline and budget', () => {
		const result = contextBudget(['request', 'brief', 'tool'], ['request'], 400);
		expect(result.canSubmit).toBe(true);
		expect(result.presentFacts).toContain('audience');
		expect(result.presentFacts).not.toContain('deadline');
		expect(result.lostFacts).toContain('deadline');
		expect(result.lostFacts).toContain('budget');
	});
	it('removing an item removes its facts; restoring the original restores its details', () => {
		expect(contextBudget(['brief'], [], 400).presentFacts).not.toContain('deadline');
		expect(contextBudget(['request', 'brief'], [], 400).presentFacts).toContain('deadline');
		expect(CONTEXT_ITEMS.every((item) => item.compactTokens < item.tokens)).toBe(true);
	});
	it('counts each item once and clamps output reservation to the teaching options', () => {
		expect(contextBudget(['request', 'request'], [], 400).total).toBe(820);
		expect(contextBudget([], [], -100).reserved).toBe(200);
		expect(contextBudget([], [], Infinity).reserved).toBe(400);
	});
});

describe('RAG evidence lesson', () => {
	it('answers only from selected, current, relevant evidence with a traceable citation', () => {
		const result = evaluateEvidence(['policy', 'shipping']);
		expect(result.status).toBe('answered');
		expect(result.days).toBe(30);
		expect(result.citations).toEqual(['policy']);
		expect(result.trace.find((row) => row.id === 'shipping')?.reason).toBe('irrelevant');
	});
	it('abstains when evidence is absent or irrelevant', () => {
		expect(evaluateEvidence([]).status).toBe('missing');
		expect(evaluateEvidence(['shipping']).status).toBe('missing');
	});
	it('shows both conflicting sources instead of selecting a confident answer', () => {
		const result = evaluateEvidence(['policy', 'faq']);
		expect(result.status).toBe('conflict');
		expect(result.days).toBeNull();
		expect(result.citations).toEqual(['policy', 'faq']);
	});
	it('does not present an archived policy as current, but can use a current replacement', () => {
		expect(evaluateEvidence(['archive']).status).toBe('outdated');
		const result = evaluateEvidence(['archive', 'policy']);
		expect(result.days).toBe(30);
		expect(result.citations).toEqual(['policy']);
		expect(result.trace.find((row) => row.id === 'archive')?.reason).toBe('outdated');
	});
});

describe('scoped permissions lesson', () => {
	it('blocks all actions by default and leaves the mock files unchanged', () => {
		const state = initialSandbox();
		for (const action of ['read-brief', 'write-draft', 'run-check', 'read-private', 'publish'] as const) {
			const next = performAction(state, action, []);
			expect(next.events.at(-1)?.status).toBe('blocked');
			expect(next.files).toEqual(state.files);
		}
	});
	it('keeps write permission scoped to the draft and run permission scoped to a check', () => {
		const state = initialSandbox();
		const written = performAction(state, 'write-draft', ['write-draft']);
		expect(written.files.draft).toBe('revised');
		expect(performAction(written, 'read-private', ['read-brief', 'write-draft', 'run-check']).events.at(-1)?.status).toBe('blocked');
		expect(performAction(written, 'publish', ['read-brief', 'write-draft', 'run-check']).events.at(-1)?.status).toBe('blocked');
	});
	it('runs a deterministic check against the current mock draft', () => {
		const state = initialSandbox();
		expect(performAction(state, 'run-check', ['run-check']).events.at(-1)?.result).toBe('check-failed');
		const written = performAction(state, 'write-draft', ['write-draft']);
		expect(performAction(written, 'run-check', ['run-check']).events.at(-1)?.result).toBe('check-passed');
	});
	it('re-evaluates grants for every action and records permission revocation', () => {
		const read = performAction(initialSandbox(), 'read-brief', ['read-brief']);
		expect(read.events.at(-1)?.result).toBe('brief-read');
		expect(performAction(read, 'read-brief', []).events.at(-1)?.status).toBe('blocked');
	});
	it('undoes a file change without erasing the audit trail and reset starts clean', () => {
		const written = performAction(initialSandbox(), 'write-draft', ['write-draft']);
		const checked = performAction(written, 'run-check', ['run-check']);
		const undone = undoAction(checked);
		expect(undone.files.draft).toBe('original');
		expect(undone.events.map((event) => event.status)).toEqual(['allowed', 'allowed', 'undone']);
		expect(undoAction(undone)).toEqual(undone);
		expect(initialSandbox().events).toEqual([]);
	});
});
