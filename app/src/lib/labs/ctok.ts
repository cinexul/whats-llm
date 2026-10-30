import { isNative, invokeCore } from './runtime';
// Thin browser resource adapter. All counting/normalization is in Rust core/.
import { loadCompressedJsonText } from './resources';
import { base } from '$app/paths';
import { loadRustCore, CommunityCounter } from './rust-core';
export interface CtokCount { count:number; messageCount:number; messageOverhead:6; family:'v4.8' }
export const CTOK_SOURCE='https://github.com/sanderland/ctok';
export const CTOK_REVISION='8c43ffd3c7be467622a540f025516e49ef78d8b1';
export const CTOK_FAMILY='v4.8';
let loading:Promise<(text:string)=>Promise<CtokCount>>|null=null;
export function loadCtokCounter():Promise<(text:string)=>Promise<CtokCount>>{
 loading??=(async()=>{
  if(isNative())return (text:string)=>invokeCore<CtokCount>('lab_community_count',{text});
  const [json]=await Promise.all([loadCompressedJsonText(`${base}/tokenizers/ctok-v48.json.gz`),loadRustCore()]);
  const counter=new CommunityCounter(json);
  return async (text:string)=>JSON.parse(counter.estimateJson(text)) as CtokCount;
 })().catch(error=>{loading=null;throw error;});
 return loading;
}
