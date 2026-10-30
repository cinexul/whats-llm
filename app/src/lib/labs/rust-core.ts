/** A single lazy WASM instance shared by every text algorithm. No algorithm fallback in TS. */
import init, { CommunityCounter, TextTokenizer } from '$lib/generated/core/whats_llm_core';
import wasmUrl from '$lib/generated/core/whats_llm_core_bg.wasm?url';
let loading:Promise<void>|null=null;
export function loadRustCore():Promise<void>{
 loading??=init({module_or_path:wasmUrl}).then(()=>undefined).catch(error=>{loading=null;throw error;});
 return loading;
}
export { CommunityCounter, TextTokenizer };
