// Count-only port of sanderland/ctok, revision 8c43ffd3c7be467622a540f025516e49ef78d8b1.
// MIT, Copyright (c) 2026 Sander Land. Full attribution: static/tokenizers/ctok-NOTICE.txt.
// This reconstructs the community implementation, NOT official Anthropic token IDs/boundaries.
import { nfc, rawHeadSpace, streamNorm } from './ctok-normalize';

export interface CtokAsset {
	schema: 1;
	family: 'v4.8';
	messageOverhead: 6;
	fold_quotes: false;
	allcaps_min: null;
	frame_bow: false;
	vocab: string[];
	unitPieces: string[];
	byteTokens: string[];
}

export interface CtokCount {
	/** Community single-user-message estimate minus its fixed six-token frame. */
	count: number;
	messageCount: number;
	messageOverhead: 6;
	family: 'v4.8';
}

interface TrieNode { children: Map<string, TrieNode>; terminal: boolean }
const node = (): TrieNode => ({ children: new Map(), terminal: false });
const markers = new Set(['\ufdd0', '\ufdd1', '\ufdd3', '\ufdd4']);
const literalEscapes: Record<string, string> = {
	'\ue000': '\ufdd0', '\ue001': '\ufdd1', '\ue002': '\ufdd2',
	'\ue003': '\ufdd3', '\ue004': '\ufdd4'
};
const utf8 = new TextEncoder();
const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

export function createCtokCounter(asset: CtokAsset): (text: string) => CtokCount {
	if (asset.schema !== 1 || asset.family !== 'v4.8' || asset.messageOverhead !== 6 ||
		asset.fold_quotes !== false || asset.allcaps_min !== null || asset.frame_bow !== false ||
		!Array.isArray(asset.vocab) || !Array.isArray(asset.unitPieces) || !Array.isArray(asset.byteTokens)) {
		throw new Error('Unsupported ctok community asset');
	}
	const root = node();
	for (const piece of asset.vocab) {
		let cursor = root;
		for (const ch of Array.from(piece).reverse()) {
			let next = cursor.children.get(ch);
			if (!next) { next = node(); cursor.children.set(ch, next); }
			cursor = next;
		}
		cursor.terminal = true;
	}
	const units = new Set(asset.unitPieces);
	const byteTokens = new Set([...asset.byteTokens, ...asset.unitPieces.map((p) => hex(utf8.encode(p)))]);
	const maxByteLength = Math.max(1, ...Array.from(byteTokens, (s) => s.length / 2));
	const costs = new Map<string, number>();
	function charCost(char: string): number {
		const ch = literalEscapes[char] ?? char;
		if (units.has(ch)) return 1;
		const hit = costs.get(ch);
		if (hit !== undefined) return hit;
		const bytes = utf8.encode(ch);
		const best = new Array<number>(bytes.length + 1).fill(Infinity);
		best[0] = 0;
		for (let end = 1; end <= bytes.length; end++) {
			for (let start = Math.max(0, end - maxByteLength); start < end; start++) {
				if (end - start === 1 || byteTokens.has(hex(bytes.subarray(start, end)))) {
					best[end] = Math.min(best[end], best[start] + 1);
				}
			}
		}
		const result = best[bytes.length];
		costs.set(ch, result);
		return result;
	}
	function minCost(text: string, byteFloor: boolean): number {
		const chars = Array.from(text);
		const best = new Array<number>(chars.length + 1).fill(0);
		for (let end = 1; end <= chars.length; end++) {
			let start = end - 1;
			let cursor = root.children.get(chars[start]);
			best[end] = best[start] + (cursor?.terminal || !byteFloor || markers.has(chars[start]) ? 1 : charCost(chars[start]));
			if (!cursor) continue;
			for (start = end - 2; start >= 0; start--) {
				cursor = cursor.children.get(chars[start]);
				if (!cursor) break;
				if (cursor.terminal) best[end] = Math.min(best[end], best[start] + 1);
			}
		}
		return best[chars.length];
	}
	return (text: string): CtokCount => {
		if (typeof text !== 'string') throw new TypeError('ctok text must be a string');
		const norm = nfc(text, asset.fold_quotes);
		const trailingNewlines = norm.match(/\n+$/)?.[0].length ?? 0;
		const stream = streamNorm(norm, asset, rawHeadSpace(text));
		// Upstream's frame appends two newlines and pays for its final tile itself.
		const tail = trailingNewlines ? minCost('\n'.repeat(trailingNewlines + 2), false) - 1 : 0;
		const count = minCost(stream, true) + tail;
		return { count, messageCount: count + 6, messageOverhead: 6, family: 'v4.8' };
	};
}
