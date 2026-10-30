import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {describe,it,expect,beforeAll,vi} from 'vitest';
import init,{CommunityCounter} from '$lib/generated/core/whats_llm_core';
vi.mock('$lib/labs/rust-core',async()=>{const m=await import('$lib/generated/core/whats_llm_core');let loading:Promise<unknown>|undefined;return {...m,loadRustCore:()=>{loading??=m.default({module_or_path:readFileSync('src/lib/generated/core/whats_llm_core_bg.wasm')});return loading.then(()=>undefined);}};});
vi.mock('$app/paths',()=>({base:''}));
import {loadCtokCounter,CTOK_REVISION} from '$lib/labs/ctok';
const golden=JSON.parse(readFileSync('tests/fixtures/ctok-community-golden.json','utf8'));
const asset=gunzipSync(readFileSync('static/tokenizers/ctok-v48.json.gz')).toString();
beforeAll(async()=>{await init({module_or_path:readFileSync('src/lib/generated/core/whats_llm_core_bg.wasm')});vi.stubGlobal('fetch',async(url:string)=>new Response(readFileSync(`static${url}`)));});
describe('Rust WASM community reference parity (not official Anthropic accuracy)',()=>{
 it('pins the source and loads offline',async()=>{expect(CTOK_REVISION).toBe(golden.sourceRevision);expect((await(await loadCtokCounter())('')).messageCount).toBe(6);});
 it('rejects unsupported configuration',()=>expect(()=>new CommunityCounter(JSON.stringify({...JSON.parse(asset),messageOverhead:7}))).toThrow());
 it('matches every pinned Python case through the actual WASM transport',()=>{
  const counter=new CommunityCounter(asset);
  try{for(const c of golden.cases)expect(JSON.parse(counter.estimateJson(c.text)),c.key).toEqual({count:c.count,messageCount:c.messageCount,messageOverhead:6,family:'v4.8'});}finally{counter.free();}
 });
});
