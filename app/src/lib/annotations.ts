// マーカー(蛍光ペン)とメモの管理。
// 保存先: Tauri上では学習DBと同じフォルダのannotations.json、
// ブラウザプレビューではlocalStorage(開発用フォールバック)。
import { writable, get } from 'svelte/store';
import type { Lang } from './manifest';

export type HighlightColor = 'yellow' | 'green' | 'pink';

export interface Annotation {
	id: string;
	chapter: string;
	lang?: Lang; // 旧データは言語情報を持たないため、従来どおり本文で照合する
	exact: string; // 選択した本文そのもの
	prefix: string; // 直前の文脈(再特定用)
	suffix: string; // 直後の文脈(再特定用)
	color: HighlightColor;
	note: string;
	createdAt: string;
	updatedAt?: string; // 最近一次修改笔记或颜色的时间；旧批注使用createdAt。
}

const CONTEXT_LEN = 30;
const LS_KEY = 'annotations';
const PENDING_KEY = 'annotations-pending';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const annotations = writable<Annotation[]>([]);

export function annotationsForChapter(list: Annotation[], chapter: string, lang: Lang): Annotation[] {
	return list.filter((a) => a.chapter === chapter && (a.lang === undefined || a.lang === lang));
}

let loadedPromise: Promise<void> | null = null;
let pendingSave: Promise<void> = Promise.resolve();
let saveVersion = 0;

function isAnnotation(value: unknown): value is Annotation {
	if (!value || typeof value !== 'object') return false;
	const a = value as Partial<Annotation>;
	return (
		typeof a.id === 'string' &&
		typeof a.chapter === 'string' &&
		(a.lang === undefined || a.lang === 'zh' || a.lang === 'ja' || a.lang === 'en') &&
		typeof a.exact === 'string' &&
		a.exact.trim().length > 0 &&
		typeof a.prefix === 'string' &&
		typeof a.suffix === 'string' &&
		(a.color === 'yellow' || a.color === 'green' || a.color === 'pink') &&
		typeof a.note === 'string' &&
		typeof a.createdAt === 'string'
	);
}

function parseAnnotations(json: string | null): Annotation[] | null {
	try {
		const value: unknown = JSON.parse(json ?? 'null');
		if (!Array.isArray(value)) return null;
		const valid = value.filter(isAnnotation);
		// 空数组表示有效的删除；由损坏记录组成的非空数组则不算有效数据。
		return value.length === 0 || valid.length > 0 ? valid : null;
	} catch {
		return null;
	}
}

function localAnnotations(key: string): Annotation[] | null {
	try {
		return parseAnnotations(localStorage.getItem(key));
	} catch {
		return null;
	}
}

export function ensureLoaded(): Promise<void> {
	if (!loadedPromise) {
		loadedPromise = (async () => {
			if (saveVersion > 0) return; // 保留首次异步加载完成前已做出的编辑。
			let list: Annotation[] | null = null;
			if (isTauri()) {
				// 待恢复快照来自中断或失败的桌面端文件写入。
				// 即使快照为空也优先使用，确保已删除的笔记不会恢复。
				const pending = localAnnotations(PENDING_KEY);
				if (pending !== null) {
					annotations.set(pending);
					return;
				}
				try {
					const { invoke } = await import('@tauri-apps/api/core');
					list = parseAnnotations(await invoke<string>('load_annotations'));
				} catch {
					// ファイルが壊れている・読めない場合は下のバックアップに任せる
				}
			}
			// ファイルが無い・空・読めないときはlocalStorageのバックアップを採用する。
			// (ファイルに書き込めない環境ではlocalStorage側が本体になるため)
			if (!list?.length) list = localAnnotations(LS_KEY) ?? list;
			if (saveVersion === 0) annotations.set(list ?? []);
		})();
	}
	return loadedPromise;
}

async function persist() {
	const json = JSON.stringify(get(annotations), null, '\t');
	const native = isTauri();
	const version = ++saveVersion;
	if (native) {
		try {
			// 保留快照本身，确保备份写入失败时仍可恢复。
			localStorage.setItem(PENDING_KEY, json);
		} catch {
			/* localStorageが使えない場合でもファイル保存は試みる */
		}
	}
	// ファイルへの書き込みを待たず、localStorageに最新状態をバックアップする。
	try {
		localStorage.setItem(LS_KEY, json);
	} catch {
		/* 保存先なし */
	}
	if (native) {
		// 古い書き込みが新しい内容を上書きしないよう、呼び出し順に保存する。
		pendingSave = pendingSave.then(async () => {
			try {
				const { invoke } = await import('@tauri-apps/api/core');
				await invoke('save_annotations', { data: json });
				// 队列中较早的写入不能清除较新编辑的恢复数据。
				if (
					version === saveVersion &&
					localStorage.getItem(PENDING_KEY) === json &&
					localStorage.getItem(LS_KEY) === json
				) localStorage.removeItem(PENDING_KEY);
			} catch {
				// ファイルに書けない場所ではlocalStorageのみ。次の保存は続行する。
			}
		});
		await pendingSave;
	}
}

// 本次会话编辑后，即使保存失败，也以store中的最新快照为准。
// 空数组表示主动删除了全部笔记，不能因此重新加载旧存储。
export function editedAnnotationSnapshot(): Annotation[] | null {
	return saveVersion > 0 ? get(annotations) : null;
}

export async function flushAnnotationWrites(): Promise<void> {
	await pendingSave;
}

export function addAnnotation(a: Annotation) {
	annotations.update((list) => [...list, a]);
	void persist();
}

export function updateAnnotation(id: string, patch: Partial<Annotation>) {
	annotations.update((list) => list.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a)));
	void persist();
}

export function removeAnnotation(id: string) {
	annotations.update((list) => list.filter((a) => a.id !== id));
	void persist();
}

/* ===== 本文への適用(テキスト位置の特定と <mark> ラップ) ===== */

interface TextPos {
	node: Text;
	start: number;
}

function collectTextNodes(root: HTMLElement): { nodes: TextPos[]; full: string } {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const nodes: TextPos[] = [];
	let pos = 0;
	let n: Node | null;
	while ((n = walker.nextNode())) {
		const t = n as Text;
		nodes.push({ node: t, start: pos });
		pos += t.data.length;
	}
	return { nodes, full: root.textContent ?? '' };
}

// exactの出現位置の中から、前後の文脈が最も一致するものを選ぶ
function locate(full: string, a: Annotation): number {
	let best = -1;
	let bestScore = -1;
	let idx = full.indexOf(a.exact);
	while (idx >= 0) {
		const pre = full.slice(Math.max(0, idx - a.prefix.length), idx);
		const post = full.slice(idx + a.exact.length, idx + a.exact.length + a.suffix.length);
		let score = 0;
		for (let i = 1; i <= Math.min(pre.length, a.prefix.length); i++) {
			if (pre[pre.length - i] === a.prefix[a.prefix.length - i]) score++;
			else break;
		}
		for (let i = 0; i < Math.min(post.length, a.suffix.length); i++) {
			if (post[i] === a.suffix[i]) score++;
			else break;
		}
		if (score > bestScore) {
			bestScore = score;
			best = idx;
		}
		idx = full.indexOf(a.exact, idx + 1);
	}
	return best;
}

export function removeHighlights(root: HTMLElement) {
	for (const mark of [...root.querySelectorAll('mark.hl')]) {
		const parent = mark.parentNode;
		if (!parent) continue;
		while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
		parent.removeChild(mark);
	}
	root.normalize();
}

export function applyHighlights(root: HTMLElement, list: Annotation[]) {
	removeHighlights(root);
	for (const a of list) {
		const { nodes, full } = collectTextNodes(root);
		const start = locate(full, a);
		if (start < 0) continue; // 本文改訂などで見つからない場合はスキップ(データは保持)
		const end = start + a.exact.length;
		// 影響するテキストノードと範囲を求め、後ろから分割・ラップする
		const targets: { node: Text; from: number; to: number }[] = [];
		for (const { node, start: ns } of nodes) {
			const ne = ns + node.data.length;
			if (ne <= start || ns >= end) continue;
			targets.push({ node, from: Math.max(0, start - ns), to: Math.min(node.data.length, end - ns) });
		}
		for (const t of targets.reverse()) {
			const segment = t.from > 0 ? t.node.splitText(t.from) : t.node;
			if (t.to - t.from < segment.data.length) segment.splitText(t.to - t.from);
			const mark = document.createElement('mark');
			mark.className = `hl hl-${a.color}` + (a.note ? ' has-note' : '');
			mark.dataset.hlId = a.id;
			if (a.note) mark.title = a.note;
			segment.parentNode?.insertBefore(mark, segment);
			mark.appendChild(segment);
		}
	}
}

// 現在の選択範囲から注釈の素材(位置情報)を取り出す
export function captureSelection(
	root: HTMLElement
): { exact: string; prefix: string; suffix: string; rect: DOMRect } | null {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
	const range = sel.getRangeAt(0);
	if (!root.contains(range.commonAncestorContainer)) return null;
	const exact = range.toString();
	if (!exact.trim()) return null;
	const pre = document.createRange();
	pre.selectNodeContents(root);
	pre.setEnd(range.startContainer, range.startOffset);
	const start = pre.toString().length;
	const full = root.textContent ?? '';
	return {
		exact,
		prefix: full.slice(Math.max(0, start - CONTEXT_LEN), start),
		suffix: full.slice(start + exact.length, start + exact.length + CONTEXT_LEN),
		rect: range.getBoundingClientRect()
	};
}
