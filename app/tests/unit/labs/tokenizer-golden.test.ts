vi.mock('$lib/labs/rust-core',async()=>{const m=await import('$lib/generated/core/whats_llm_core');let loading:Promise<unknown>|undefined;return {...m,loadRustCore:()=>{loading??=m.default({module_or_path:readFileSync('src/lib/generated/core/whats_llm_core_bg.wasm')});return loading.then(()=>undefined);}};});
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { Tokenizer } from '@huggingface/tokenizers';
import { Tiktoken } from 'js-tiktoken/lite';
import ranks from 'js-tiktoken/ranks/o200k_base';
import golden from '../../fixtures/tokenizer-golden.json';
vi.mock('$app/paths', () => ({ base: '' }));
import { loadTokenizers } from '$lib/labs/tokenizers';
import { TOKEN_SAMPLES } from '$lib/labs/token-samples';
beforeAll(() => vi.stubGlobal('fetch', async (url: string) => new Response(readFileSync(`static${url}`))));
const qwen = new Tokenizer(JSON.parse(gunzipSync(readFileSync('static/tokenizers/qwen38.json.gz')).toString()), {});
const o200k = new Tiktoken(ranks);
describe('pinned official Python reference golden', () => {
 it('records complete parity and covers every canonical preset', () => {
  expect(golden.mismatches).toEqual([]);
  for (const [key, langs] of Object.entries(TOKEN_SAMPLES)) for (const [lang, text] of Object.entries(langs)) {
   expect(golden.rows.find(row => row.key === `${key}.${lang}`)?.text).toBe(text);
  }
 });
 for (const row of golden.rows) it(row.key, async () => {
  expect(qwen.encode(row.text, {add_special_tokens:false}).ids).toEqual(row.qwen38.ids);
  expect(o200k.encode(row.text, [], [])).toEqual(row.o200k.ids);
  const encoders = await loadTokenizers();
  for (const id of ['qwen38','o200k'] as const) {
   const actual = await encoders[id](row.text);
   expect(actual).toEqual({count:row[id].count,pieces:row[id].pieces});
   expect(actual.pieces.map(p=>p.text).join('')).toBe(id==='qwen38' ? row.text.normalize('NFC') : row.text);
  }
 });
});
