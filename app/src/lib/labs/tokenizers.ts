import { isNative, invokeCore } from './runtime';
// 分词实验用的两个真实分词器，进入实验页时才加载。
// o200k_base由Rust tiktoken-rs编码；Qwen3.8由Rust tokenizers编码（来源见NOTICE.txt）。
// 两者的切分结果都和官方Python库（tiktoken、tokenizers）逐个token对照过。
import { loadRustCore, TextTokenizer } from './rust-core';
import { loadCompressedJsonText } from './resources';
import type { Lang } from '$lib/manifest';
import { base } from '$app/paths';
import { TOKEN_SAMPLES, type TokenPreset } from './token-samples';

export { TOKEN_SAMPLES, type TokenPreset };

export type TokenizerId = 'o200k' | 'qwen38';
export const TOKENIZERS: TokenizerId[] = ['o200k', 'qwen38'];

/** 一个显示单位：通常是一个token；一个字被拆成几个token时合在一起，tokens记个数。 */
export interface Piece { text: string; tokens: number }
export interface Tokenized { count: number; pieces: Piece[] }
type Encoder = (text: string) => Promise<Tokenized>;

// Algorithms and piece grouping live in the shared Rust core; TS only adapts resources.
async function loadO200k(): Promise<Encoder> {
 if(isNative())return text=>invokeCore<Tokenized>('lab_tokenize',{kind:'o200k',text});
 await loadRustCore();
 const tokenizer=TextTokenizer.openai();
 return async text => { const {count,pieces}=JSON.parse(tokenizer.tokenizeJson(text)); return {count,pieces}; };
}
async function loadQwen38(): Promise<Encoder> {
 if(isNative())return text=>invokeCore<Tokenized>('lab_tokenize',{kind:'qwen38',text});
 const [json]=await Promise.all([loadCompressedJsonText(`${base}/tokenizers/qwen38.json.gz`),loadRustCore()]);
 const tokenizer=TextTokenizer.qwen(json);
 return async text => { const {count,pieces}=JSON.parse(tokenizer.tokenizeJson(text)); return {count,pieces}; };
}

let loading: Promise<Record<TokenizerId, Encoder>> | null = null;

export function loadTokenizers(): Promise<Record<TokenizerId, Encoder>> {
	loading ??= Promise.all([loadO200k(), loadQwen38()])
		.then(([o200k, qwen38]) => ({ o200k, qwen38 }))
		.catch((error) => { loading = null; throw error; });
	return loading;
}

/** A failed edit must clear every previous count and piece, never leave stale output. */
export async function tryTokenize(encoders:Record<TokenizerId,Encoder>,texts:Record<Lang,string>):Promise<{results:Record<Lang,Record<TokenizerId,Tokenized>>|null;failed:boolean}>{
 try {
  const entries=await Promise.all((['zh','ja','en'] as Lang[]).map(async lang=>[lang,Object.fromEntries(await Promise.all(TOKENIZERS.map(async id=>[id,await encoders[id](texts[lang])])))]));
  return {results:Object.fromEntries(entries) as Record<Lang,Record<TokenizerId,Tokenized>>,failed:false};
 }catch{return {results:null,failed:true};}
}
