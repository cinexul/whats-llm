import {beforeEach,afterEach,expect,it,vi} from 'vitest';
const invoke=vi.hoisted(()=>vi.fn(async(command:string,args:Record<string,unknown>)=>command==='lab_community_count'?{count:1,messageCount:7,messageOverhead:6,family:'v4.8'}:{count:1,pieces:[{text:args.text,tokens:1}],ids:[1]}));
vi.mock('@tauri-apps/api/core',()=>({invoke}));
vi.mock('$app/paths',()=>({base:''}));
beforeEach(()=>{vi.resetModules();invoke.mockClear();vi.stubGlobal('window',{__TAURI_INTERNALS__:{}});vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Native computations must not fetch WASM or vocab');}));});
afterEach(()=>vi.unstubAllGlobals());
it('routes all text computation to the native Rust commands without fetching assets',async()=>{
 const {loadTokenizers}=await import('$lib/labs/tokenizers');const {loadCtokCounter}=await import('$lib/labs/ctok');
 const t=await loadTokenizers();await t.o200k('a');await t.qwen38('b');await(await loadCtokCounter())('c');
 expect(invoke.mock.calls).toEqual([['lab_tokenize',{kind:'o200k',text:'a'}],['lab_tokenize',{kind:'qwen38',text:'b'}],['lab_community_count',{text:'c'}]]);
 expect(fetch).not.toHaveBeenCalled();
});
