import { get, writable } from 'svelte/store';
import { learningPathDefinitions, type LearningPath, type LearningPathId } from './learning-paths-data';

export { learningPaths } from './learning-paths-data';
export type { LearningPath, LearningPathId, LearningStep } from './learning-paths-data';
export const LEARNING_PATHS_KEY = 'learning-paths-v1';
export type LearningPathProgress = Partial<Record<LearningPathId, string[]>>;
export type LearningPathStorageIssue = 'read' | 'write' | 'invalid' | null;
export interface LearningPathState {
	progress: LearningPathProgress;
	storageIssue: LearningPathStorageIssue;
}
type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;

const checkpointIds = new Map(learningPathDefinitions.map((path) => [path.id, new Set(path.steps.map((step) => step.id))]));

/** 只接受已知的路径和检查点标识；恢复有效条目，不补填完成状态。 */
export function normalizeLearningPathProgress(value: unknown): { progress: LearningPathProgress; repaired: boolean } {
	const progress: LearningPathProgress = {};
	if (!value || typeof value !== 'object' || Array.isArray(value)) return { progress, repaired: true };
	let repaired = false;
	for (const [pathId, completed] of Object.entries(value)) {
		const knownIds = checkpointIds.get(pathId as LearningPathId);
		if (!knownIds || !Array.isArray(completed)) {
			repaired = true;
			continue;
		}
		const unique = new Set<string>();
		for (const checkpoint of completed) {
			if (typeof checkpoint !== 'string' || !knownIds.has(checkpoint) || unique.has(checkpoint)) repaired = true;
			else unique.add(checkpoint);
		}
		progress[pathId as LearningPathId] = [...unique];
	}
	return { progress, repaired };
}

export function pathProgress(path: LearningPath, progress: LearningPathProgress) {
	const completed = new Set(progress[path.id] ?? []);
	const count = path.steps.filter((step) => completed.has(step.id)).length;
	return { count, total: path.steps.length, next: path.steps.find((step) => !completed.has(step.id)) ?? null };
}

function browserStorage(): ProgressStorage | null {
	try { return typeof localStorage === 'undefined' ? null : localStorage; }
	catch { return null; }
}

/** 供固定条件下的存储测试调用，也用于备份导入后的刷新。 */
export function createLearningPathStore(storage: ProgressStorage | null = browserStorage()) {
	function read(): LearningPathState {
		if (!storage) return { progress: {}, storageIssue: 'read' };
		try {
			const raw = storage.getItem(LEARNING_PATHS_KEY);
			if (raw === null) return { progress: {}, storageIssue: null };
			const result = normalizeLearningPathProgress(JSON.parse(raw));
			return { progress: result.progress, storageIssue: result.repaired ? 'invalid' : null };
		} catch (error) {
			return { progress: {}, storageIssue: error instanceof SyntaxError ? 'invalid' : 'read' };
		}
	}
	const state = writable<LearningPathState>(read());
	function save(progress: LearningPathProgress) {
		let storageIssue: LearningPathStorageIssue = null;
		try {
			if (!storage) throw new Error('Storage unavailable');
			storage.setItem(LEARNING_PATHS_KEY, JSON.stringify(progress));
		} catch { storageIssue = 'write'; }
		// 保留当前会话的操作结果，明确报告保存失败。
		state.set({ progress, storageIssue });
	}
	return {
		subscribe: state.subscribe,
		reload() { state.set(read()); },
		setCheckpoint(pathId: LearningPathId, checkpointId: string, complete: boolean) {
			if (!checkpointIds.get(pathId)?.has(checkpointId)) return false;
			const current = get(state).progress;
			const completed = new Set(current[pathId] ?? []);
			if (complete) completed.add(checkpointId);
			else completed.delete(checkpointId);
			save({ ...current, [pathId]: [...completed] });
			return true;
		},
		resetPath(pathId: LearningPathId) {
			if (!checkpointIds.has(pathId)) return false;
			const progress = { ...get(state).progress };
			delete progress[pathId];
			save(progress);
			return true;
		}
	};
}

export const learningPathStore = createLearningPathStore();
