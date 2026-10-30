import { describe,it,expect } from 'vitest';
import { communityCounts } from '$lib/labs/community-counts';
describe('community count-only result safety',()=>{
 it('keeps failures per language, never returns stale or invalid counts',()=>{
  const text={zh:'good',ja:'unsupported',en:'bad'};
  expect(communityCounts(value=>{if(value==='unsupported')throw Error('unsupported');return value==='bad'?NaN:3;},text)).toEqual({zh:3,ja:null,en:null});
  expect(communityCounts(()=>2,text)).toEqual({zh:2,ja:2,en:2});
 });
 it('rejects negative, fractional and infinite estimates',()=>{
  for(const n of [-1,1.5,Infinity])expect(communityCounts(()=>n,{zh:'',ja:'',en:''})).toEqual({zh:null,ja:null,en:null});
 });
});
