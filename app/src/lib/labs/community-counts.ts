import type { Lang } from '$lib/manifest';
/** Keep unavailable community estimates separate from the official encoder results. */
export function communityCounts(count: (text: string) => number, texts: Record<Lang,string>): Record<Lang,number|null> {
 return Object.fromEntries((['zh','ja','en'] as Lang[]).map(lang=>{
  try { const value=count(texts[lang]); return [lang,Number.isSafeInteger(value)&&value>=0?value:null]; }
  catch { return [lang,null]; }
 })) as Record<Lang,number|null>;
}
