// 分词实验用的两个真实分词器，进入实验页时才加载。
// o200k_base来自js-tiktoken，Qwen3.8来自static/tokenizers/qwen38.json.gz（Apache-2.0，见同目录NOTICE.txt）。
// 两者的切分结果都和官方Python库（tiktoken、tokenizers）逐个token对照过。
import type { Lang } from '$lib/manifest';
import { base } from '$app/paths';
import { TOKEN_SAMPLES, type TokenPreset } from './token-samples';

export { TOKEN_SAMPLES, type TokenPreset };

export type TokenizerId = 'o200k' | 'qwen38';
export const TOKENIZERS: TokenizerId[] = ['o200k', 'qwen38'];

/** 一个显示单位：通常是一个token；一个字被拆成几个token时合在一起，tokens记个数。 */
export interface Piece { text: string; tokens: number }
export interface Tokenized { count: number; pieces: Piece[] }
type Encoder = (text: string) => Tokenized;

/** 字节级分词器可能把一个汉字拆成几个token，单独解码会得到“�”。把这样的token合成一块显示。 */
export function groupPieces(ids: number[], decode: (ids: number[]) => string): Piece[] {
	const pieces: Piece[] = [];
	let pending: number[] = [];
	for (const id of ids) {
		pending.push(id);
		const text = decode(pending);
		if (!text.endsWith('�') || pending.length >= 4) {
			pieces.push({ text, tokens: pending.length });
			pending = [];
		}
	}
	if (pending.length) pieces.push({ text: decode(pending), tokens: pending.length });
	return pieces;
}

async function loadO200k(): Promise<Encoder> {
	const [{ Tiktoken }, { default: ranks }] = await Promise.all([import('js-tiktoken/lite'), import('js-tiktoken/ranks/o200k_base')]);
	const tokenizer = new Tiktoken(ranks);
	// js-tiktoken strips a leading BOM during decode. An ASCII prefix preserves literal U+FEFF.
	const prefix = tokenizer.encode("a", [], []);
	return (text) => {
		const ids = tokenizer.encode(text, [], []);
		return { count: ids.length, pieces: groupPieces(ids, (part) => tokenizer.decode([...prefix, ...part]).slice(1)) };
	};
}

async function loadQwen38(): Promise<Encoder> {
	const [{ Tokenizer }, response] = await Promise.all([import('@huggingface/tokenizers'), fetch(`${base}/tokenizers/qwen38.json.gz`)]);
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const bytes = new Uint8Array(await response.arrayBuffer());
	// 有的服务器会替浏览器先解压，所以看文件头再决定要不要自己解压
	const gzipped = bytes[0] === 0x1f && bytes[1] === 0x8b;
	const json = gzipped
		? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json()
		: JSON.parse(new TextDecoder().decode(bytes));
	const tokenizer = new Tokenizer(json, {});
	return (text) => {
		const ids = tokenizer.encode(text, { add_special_tokens: false }).ids;
		return { count: ids.length, pieces: groupPieces(ids, (part) => tokenizer.decode(part, { skip_special_tokens: false, clean_up_tokenization_spaces: false })) };
	};
}

let loading: Promise<Record<TokenizerId, Encoder>> | null = null;

export function loadTokenizers(): Promise<Record<TokenizerId, Encoder>> {
	loading ??= Promise.all([loadO200k(), loadQwen38()])
		.then(([o200k, qwen38]) => ({ o200k, qwen38 }))
		.catch((error) => { loading = null; throw error; });
	return loading;
}

/** A failed edit must clear every previous count and piece, never leave stale output. */
export function tryTokenize(encoders: Record<TokenizerId, Encoder>, texts: Record<Lang, string>): { results: Record<Lang, Record<TokenizerId, Tokenized>> | null; failed: boolean } {
 try {
  const results = Object.fromEntries((['zh', 'ja', 'en'] as Lang[]).map((lang) => [lang, Object.fromEntries(TOKENIZERS.map((id) => [id, encoders[id](texts[lang])]))])) as Record<Lang, Record<TokenizerId, Tokenized>>;
  return { results, failed: false };
 } catch { return { results: null, failed: true }; }
}
