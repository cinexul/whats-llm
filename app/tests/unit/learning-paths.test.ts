import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { allChapters, type Lang } from '$lib/manifest';
import { createLearningPathStore, learningPaths, LEARNING_PATHS_KEY, normalizeLearningPathProgress, pathProgress } from '$lib/learning-paths';

function memoryStorage(initial: string | null = null) {
	const data = new Map<string, string>();
	if (initial !== null) data.set(LEARNING_PATHS_KEY, initial);
	return {
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => { data.set(key, value); }
	};
}

describe('localized learning paths', () => {
	it('provides three complete paths with real localized chapter titles and focused steps', () => {
		for (const lang of ['zh', 'ja', 'en'] as Lang[]) {
			expect(learningPaths[lang]).toHaveLength(3);
			const chapters = allChapters(lang);
			for (const path of learningPaths[lang]) {
				expect(path.steps.length).toBeGreaterThanOrEqual(3);
				expect(path.steps.length).toBeLessThanOrEqual(4);
				for (const field of [path.title, path.summary, path.duration, path.prerequisite, path.result]) expect(field.length).toBeGreaterThan(5);
				for (const step of path.steps) {
					expect(step.chapters.length).toBeGreaterThan(0);
					for (const chapter of step.chapters) expect(chapters.find((candidate) => candidate.slug === chapter.slug)).toEqual(chapter);
					expect(step.checks.length).toBeGreaterThanOrEqual(2);
					for (const field of [step.title, step.action, step.deliverable, step.reading, ...step.checks]) expect(field.length).toBeGreaterThan(5);
				}
			}
		}
	});

	it('keeps checkpoint identity and reading order stable across translations', () => {
		const identities = (lang: Lang) => learningPaths[lang].map((path) => ({ id: path.id, steps: path.steps.map((step) => ({ id: step.id, slugs: step.chapters.map((chapter) => chapter.slug) })) }));
		expect(identities('zh')).toEqual(identities('en'));
		expect(identities('ja')).toEqual(identities('en'));
		const ids = learningPaths.en.flatMap((path) => path.steps.map((step) => step.id));
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('is candid about selected reading, timing, and optional paid tools', () => {
		expect(learningPaths.en[0].duration).toContain('selected reading');
		expect(learningPaths.en[0].duration).toContain('longer');
		expect(learningPaths.en[2].duration).toContain('plus tool setup');
		expect(learningPaths.en[1].prerequisite).toContain('no paid API');
		expect(learningPaths.en[2].prerequisite).toContain('no paid API');
	});
});

describe('checkpoint persistence', () => {
	it('begins empty and treats only deliberate checkpoints as completed', () => {
		const store = createLearningPathStore(memoryStorage());
		expect(get(store)).toEqual({ progress: {}, storageIssue: null });
		expect(pathProgress(learningPaths.en[0], get(store).progress)).toMatchObject({ count: 0, total: 3, next: { id: 'orientation-explain' } });
		expect(store.setCheckpoint('orientation', 'what-is-llm', true)).toBe(false);
		expect(get(store).progress).toEqual({});
	});

	it('persists the exact shared-language contract and restores across sessions', () => {
		const storage = memoryStorage();
		const store = createLearningPathStore(storage);
		store.setCheckpoint('orientation', 'orientation-explain', true);
		expect(JSON.parse(storage.getItem('learning-paths-v1')!)).toEqual({ orientation: ['orientation-explain'] });
		const restored = get(createLearningPathStore(storage));
		for (const lang of ['zh', 'ja', 'en'] as Lang[]) expect(pathProgress(learningPaths[lang][0], restored.progress)).toMatchObject({ count: 1, next: { id: 'orientation-context' } });
	});

	it('finds the earliest uncompleted step even when later steps were checked first', () => {
		const store = createLearningPathStore(memoryStorage());
		store.setCheckpoint('orientation', 'orientation-verify', true);
		expect(pathProgress(learningPaths.en[0], get(store).progress).next?.id).toBe('orientation-explain');
		store.setCheckpoint('orientation', 'orientation-explain', true);
		store.setCheckpoint('orientation', 'orientation-context', true);
		expect(pathProgress(learningPaths.en[0], get(store).progress)).toMatchObject({ count: 3, next: null });
	});

	it('supports unchecking and resets only the selected path', () => {
		const storage = memoryStorage();
		const store = createLearningPathStore(storage);
		store.setCheckpoint('orientation', 'orientation-explain', true);
		store.setCheckpoint('everyday-report', 'report-scope', true);
		store.setCheckpoint('orientation', 'orientation-explain', false);
		expect(get(store).progress.orientation).toEqual([]);
		store.setCheckpoint('orientation', 'orientation-explain', true);
		store.resetPath('orientation');
		expect(get(createLearningPathStore(storage)).progress).toEqual({ 'everyday-report': ['report-scope'] });
	});

	it('deduplicates known checkpoints and discards unknown or cross-path identities', () => {
		const result = normalizeLearningPathProgress({ orientation: ['orientation-explain', 'orientation-explain', 'report-scope', 42, 'removed'], 'future-path': ['future'], 'everyday-report': 'report-scope', 'first-project': ['project-plan'] });
		expect(result).toEqual({ repaired: true, progress: { orientation: ['orientation-explain'], 'first-project': ['project-plan'] } });
	});

	it('rejects malformed root values and prototype-like keys', () => {
		for (const value of [null, [], 'text', 1, false]) expect(normalizeLearningPathProgress(value)).toEqual({ progress: {}, repaired: true });
		expect(normalizeLearningPathProgress(JSON.parse('{"__proto__":["x"],"constructor":["x"]}'))).toEqual({ progress: {}, repaired: true });
	});

	it('reports corruption without overwriting the original until a deliberate change', () => {
		for (const raw of ['{bad', '{"orientation":["missing","orientation-context"]}']) {
			const storage = memoryStorage(raw);
			const store = createLearningPathStore(storage);
			expect(get(store).storageIssue).toBe('invalid');
			expect(storage.getItem(LEARNING_PATHS_KEY)).toBe(raw);
			store.setCheckpoint('orientation', 'orientation-explain', true);
			expect(get(store).storageIssue).toBeNull();
			expect(JSON.parse(storage.getItem(LEARNING_PATHS_KEY)!).orientation).toContain('orientation-explain');
		}
	});

	it('reports read/write failures while keeping current-session changes usable', () => {
		const store = createLearningPathStore({ getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } });
		expect(get(store).storageIssue).toBe('read');
		store.setCheckpoint('orientation', 'orientation-explain', true);
		expect(get(store)).toEqual({ progress: { orientation: ['orientation-explain'] }, storageIssue: 'write' });
		expect(get(createLearningPathStore(null)).storageIssue).toBe('read');
	});

	it('reloads externally imported progress and recovers when storage works again', () => {
		const storage = memoryStorage();
		const store = createLearningPathStore(storage);
		storage.setItem(LEARNING_PATHS_KEY, '{"first-project":["project-review"]}');
		store.reload();
		expect(get(store)).toEqual({ progress: { 'first-project': ['project-review'] }, storageIssue: null });
	});
});
