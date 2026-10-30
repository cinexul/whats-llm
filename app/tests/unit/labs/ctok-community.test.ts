import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe,it,expect,vi,beforeAll } from 'vitest';
const golden: {sourceRevision:string;cases:{key:string;text:string;count:number;messageCount:number}[]} = JSON.parse(readFileSync('tests/fixtures/ctok-community-golden.json','utf8'));
import { TOKEN_SAMPLES } from '$lib/labs/token-samples';
import { createCtokCounter } from '$lib/labs/ctok-engine';
vi.mock('$app/paths',()=>({base:''}));
import { loadCtokCounter, CTOK_REVISION } from '$lib/labs/ctok';
const asset=JSON.parse(gunzipSync(readFileSync('static/tokenizers/ctok-v48.json.gz')).toString());
const count=createCtokCounter(asset);
beforeAll(()=>vi.stubGlobal('fetch',async(url:string)=>new Response(readFileSync(`static${url}`))));
describe('pinned community ctok Python parity (not Anthropic API accuracy)',()=>{
 it('pins the tested source and covers all canonical examples',()=>{
  expect(CTOK_REVISION).toBe(golden.sourceRevision);
  for(const [key,langs] of Object.entries(TOKEN_SAMPLES))for(const [lang,text] of Object.entries(langs))expect(golden.cases.find(c=>c.key===`${key}.${lang}`)?.text).toBe(text);
 });
 it('loads entirely from the bundled asset',async()=>expect((await loadCtokCounter())('').messageCount).toBe(6));
 it('rejects an unsupported configuration instead of silently estimating another model',()=>expect(()=>createCtokCounter({...asset,messageOverhead:7})).toThrow());
 for(const c of golden.cases)it(c.key,()=>expect(count(c.text)).toEqual({count:c.count,messageCount:c.messageCount,messageOverhead:6,family:'v4.8'}));
});
