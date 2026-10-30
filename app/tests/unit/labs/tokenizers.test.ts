vi.mock('$lib/labs/rust-core',async()=>{const m=await import('$lib/generated/core/whats_llm_core');let loading:Promise<unknown>|undefined;return {...m,loadRustCore:()=>{loading??=m.default({module_or_path:readFileSync('src/lib/generated/core/whats_llm_core_bg.wasm')});return loading.then(()=>undefined);}};});
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
vi.mock('$app/paths', () => ({ base: '' }));
import { loadTokenizers } from '$lib/labs/tokenizers';

beforeAll(() => {
 vi.stubGlobal('fetch', async (url: string) => new Response(readFileSync(`static${url}`)));
});
describe('ordinary text tokenizer input', () => {
 it('encodes reserved-looking literals without throwing and can encode the next input', async () => {
  const encoders = await loadTokenizers();
  await expect(encoders.o200k('<|endoftext|>')).resolves.toBeDefined();
  expect((await encoders.o200k('你好')).pieces.map(p=>p.text).join('')).toBe('你好');
 });
 it('replaces the old Qwen3 encoder with Qwen3.8', async () => {
  expect(Object.keys(await loadTokenizers())).toEqual(['o200k', 'qwen38']);
 });
});

it('clears all output on an encoding error rather than retaining prior results', async () => {
 const module = await import('$lib/labs/tokenizers');
 const encoders = await loadTokenizers();
 expect(module.tryTokenize).toBeTypeOf('function');
 const attempt = await module.tryTokenize({ ...encoders, o200k: () => { throw new Error('bad input'); } }, {zh:'x',ja:'x',en:'x'});
 expect(attempt).toEqual({ results: null, failed: true });
 expect((await module.tryTokenize(encoders, {zh:'你好',ja:'東京',en:'hello'})).failed).toBe(false);
});

it('preserves a literal BOM in displayed o200k pieces', async () => {
 const encoders = await loadTokenizers();
 const text = '\u200b\u200d\ufeff';
 expect((await encoders.o200k(text)).pieces.map(p => p.text).join('')).toBe(text);
});
