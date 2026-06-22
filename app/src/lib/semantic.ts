// セマンティック検索(章内 RAG)。Rust 側の semantic_search コマンドを呼ぶ。
// モデルと索引は Tauri アプリに同梱されるため、ブラウザプレビューでは使えない。
// その場合は常に空配列を返し、全文検索だけにフォールバックする。
import type { Lang } from './manifest';

export interface SemanticHit {
	slug: string;
	title: string;
	heading: string; // 該当する節の見出し(章の導入部などでは空)
	anchor: string; // 見出しのアンカー id(空なら章の先頭へ)
	snippet: string;
	score: number;
}

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

/** Tauri 上(=モデル同梱)でのみ意味検索が使える。 */
export function semanticAvailable(): boolean {
	return isTauri();
}

/** 意味の近い節を上位 k 件返す。使えない・失敗した場合は空配列。 */
export async function semanticSearch(lang: Lang, query: string, k = 8): Promise<SemanticHit[]> {
	const q = query.trim();
	if (!q || !isTauri()) return [];
	try {
		const { invoke } = await import('@tauri-apps/api/core');
		return await invoke<SemanticHit[]>('semantic_search', { query: q, lang, k });
	} catch {
		// 索引未生成・モデル未取得などはサイレントにフォールバック
		return [];
	}
}
