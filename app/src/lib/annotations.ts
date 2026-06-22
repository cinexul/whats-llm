// マーカー(蛍光ペン)とメモの管理。
// 保存先: Tauri 上では exe と同じフォルダの annotations.json、
// ブラウザプレビューでは localStorage(開発用フォールバック)。
import { writable, get } from 'svelte/store';

export type HighlightColor = 'yellow' | 'green' | 'pink';

export interface Annotation {
	id: string;
	chapter: string;
	exact: string; // 選択した本文そのもの
	prefix: string; // 直前の文脈(再特定用)
	suffix: string; // 直後の文脈(再特定用)
	color: HighlightColor;
	note: string;
	createdAt: string;
}

const CONTEXT_LEN = 30;
const LS_KEY = 'annotations';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const annotations = writable<Annotation[]>([]);

let loadedPromise: Promise<void> | null = null;

export function ensureLoaded(): Promise<void> {
	if (!loadedPromise) {
		loadedPromise = (async () => {
			let list: unknown = [];
			if (isTauri()) {
				try {
					const { invoke } = await import('@tauri-apps/api/core');
					list = JSON.parse(await invoke<string>('load_annotations'));
				} catch {
					// ファイルが壊れている・読めない場合は下のバックアップに任せる
				}
			}
			// ファイルが無い・空・読めないときは localStorage のバックアップを採用する。
			// (exe のフォルダに書き込めない環境では localStorage 側が本体になるため)
			if (!Array.isArray(list) || list.length === 0) {
				try {
					list = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
				} catch {
					list = [];
				}
			}
			if (Array.isArray(list)) annotations.set(list as Annotation[]);
		})();
	}
	return loadedPromise;
}

async function persist() {
	const json = JSON.stringify(get(annotations), null, '\t');
	// localStorage には常にバックアップを残す(ファイルに書き込めない環境への保険。
	// ファイルと常に同時更新するため、読み込み時の取り違えは起きない)
	try {
		localStorage.setItem(LS_KEY, json);
	} catch {
		/* 保存先なし */
	}
	if (isTauri()) {
		try {
			const { invoke } = await import('@tauri-apps/api/core');
			await invoke('save_annotations', { data: json });
		} catch {
			// ファイルに書けない場所(読み取り専用フォルダ等)では localStorage のみ
		}
	}
}

export function addAnnotation(a: Annotation) {
	annotations.update((list) => [...list, a]);
	void persist();
}

export function updateAnnotation(id: string, patch: Partial<Annotation>) {
	annotations.update((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
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

// exact の出現位置の中から、前後の文脈が最も一致するものを選ぶ
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
