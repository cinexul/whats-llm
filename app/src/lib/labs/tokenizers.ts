// 分词实验用的两个真实分词器，进入实验页时才加载。
// o200k_base来自js-tiktoken，Qwen3来自static/tokenizers/qwen3.json.gz（Apache-2.0，见同目录NOTICE.txt）。
// 两者的切分结果都和官方Python库（tiktoken、tokenizers）逐个token对照过。
import { base } from '$app/paths';
import { TOKEN_SAMPLES, type TokenPreset } from './token-samples';

export { TOKEN_SAMPLES, type TokenPreset };

export type TokenizerId = 'o200k' | 'qwen3';
export const TOKENIZERS: TokenizerId[] = ['o200k', 'qwen3'];

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
	return (text) => {
		const ids = tokenizer.encode(text);
		return { count: ids.length, pieces: groupPieces(ids, (part) => tokenizer.decode(part)) };
	};
}

async function loadQwen3(): Promise<Encoder> {
	const [{ Tokenizer }, response] = await Promise.all([import('@huggingface/tokenizers'), fetch(`${base}/tokenizers/qwen3.json.gz`)]);
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
		return { count: ids.length, pieces: groupPieces(ids, (part) => tokenizer.decode(part, { skip_special_tokens: false })) };
	};
}

let loading: Promise<Record<TokenizerId, Encoder>> | null = null;

export function loadTokenizers(): Promise<Record<TokenizerId, Encoder>> {
	loading ??= Promise.all([loadO200k(), loadQwen3()])
		.then(([o200k, qwen3]) => ({ o200k, qwen3 }))
		.catch((error) => { loading = null; throw error; });
	return loading;
}
