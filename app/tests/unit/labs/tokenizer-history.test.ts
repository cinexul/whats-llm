import { readFileSync } from 'node:fs';
import { getEncoding } from 'js-tiktoken';
import { expect, it } from 'vitest';
import { TOKEN_SAMPLES } from '$lib/labs/token-samples';
it('reproduces the scoped historical Chinese and Japanese examples', () => {
 const rows = [TOKEN_SAMPLES.everyday.zh, 'お誕生日おめでとう'].map(text => (['r50k_base','cl100k_base','o200k_base'] as const).map(name => getEncoding(name).encode(text,[],[]).length));
 expect(rows).toEqual([[50,28,21],[14,9,8]]);
});
it.each(['zh','ja','en'])('includes the historical comparison and primary sources in %s',lang=>{
 const text=readFileSync(`src/lib/content/${lang}/token-and-context.md`,'utf8');
 expect(text).toContain('50 → 28 → 21');
 expect(text).toContain('14 → 9 → 8');
 expect(text).toContain('https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken');
 expect(text).toContain('https://openai.com/index/hello-gpt-4o/');
});
