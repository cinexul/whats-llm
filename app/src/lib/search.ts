// 全文検索。各章の本文(deflate+Base64)を初回検索時に一括復元し、
// プレーンテキスト化した索引を作って、章タイトルと本文の両方を検索する。
// 索引は言語別に作る(中文検索で日本語の章を返さないため)。
import { allChapters, type Lang } from './manifest';
import { inflateB64 } from './decode';

const modules: Record<Lang, Record<string, () => Promise<unknown>>> = {
	zh: import.meta.glob('/src/lib/content/zh/*.md', { query: '?enc', import: 'default' }),
	ja: import.meta.glob('/src/lib/content/ja/*.md', { query: '?enc', import: 'default' }),
	en: import.meta.glob('/src/lib/content/en/*.md', { query: '?enc', import: 'default' })
};

export interface SearchHit {
	slug: string;
	title: string;
	snippet: string; // 一致箇所の前後を抜き出した断片(<mark> を含む HTML)
	inTitle: boolean;
}

interface IndexEntry {
	slug: string;
	title: string;
	plain: string;
}

// Markdown の記号を落として読みやすいプレーンテキストにする
function toPlain(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, ' ') // コードブロック
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^>\s?/gm, '')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^\s*[-*]\s+/gm, '')
		.replace(/\\\|/g, ' ') // 表セル内のエスケープ済みパイプ
		.replace(/\|/g, ' ')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // リンク
		.replace(/[ \t]+/g, ' ')
		.replace(/\n{2,}/g, '\n')
		.trim();
}

// 言語別に索引をキャッシュする
const indexPromises: Partial<Record<Lang, Promise<IndexEntry[]>>> = {};

export function ensureIndex(lang: Lang): Promise<IndexEntry[]> {
	if (!indexPromises[lang]) {
		indexPromises[lang] = Promise.all(
			allChapters(lang).map(async (ch) => {
				const loader = modules[lang][`/src/lib/content/${lang}/${ch.slug}.md`];
				let plain = '';
				if (loader) {
					try {
						plain = toPlain(await inflateB64((await loader()) as string));
					} catch {
						plain = '';
					}
				}
				return { slug: ch.slug, title: ch.title, plain };
			})
		);
	}
	return indexPromises[lang]!;
}

function escapeHtml(s: string): string {
	return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);
}

// 一致位置の前後を抜き出し、一致語を <mark> で囲んだ断片を作る
function makeSnippet(plain: string, lowerQuery: string): string {
	const idx = plain.toLowerCase().indexOf(lowerQuery);
	if (idx < 0) return '';
	const from = Math.max(0, idx - 24);
	const to = Math.min(plain.length, idx + lowerQuery.length + 40);
	const before = (from > 0 ? '…' : '') + plain.slice(from, idx);
	const hit = plain.slice(idx, idx + lowerQuery.length);
	const after = plain.slice(idx + lowerQuery.length, to) + (to < plain.length ? '…' : '');
	return escapeHtml(before) + '<mark>' + escapeHtml(hit) + '</mark>' + escapeHtml(after);
}

export async function fullTextSearch(lang: Lang, query: string): Promise<SearchHit[]> {
	const q = query.trim();
	if (!q) return [];
	const lower = q.toLowerCase();
	const index = await ensureIndex(lang);
	const hits: SearchHit[] = [];
	for (const e of index) {
		const inTitle = e.title.toLowerCase().includes(lower);
		const snippet = makeSnippet(e.plain, lower);
		if (inTitle || snippet) {
			hits.push({
				slug: e.slug,
				title: e.title,
				snippet: snippet || escapeHtml(e.plain.slice(0, 60)) + '…',
				inTitle
			});
		}
	}
	// タイトル一致を上位に
	hits.sort((a, b) => Number(b.inTitle) - Number(a.inTitle));
	return hits;
}
