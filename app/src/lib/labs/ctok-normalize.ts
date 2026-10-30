/** Count-only port of sanderland/ctok normalize.py, revision
 * 8c43ffd3c7be467622a540f025516e49ef78d8b1. MIT; see tokenizer ctok NOTICE.
 * Internal markers and tilings are NOT official Anthropic token IDs/boundaries.
 */
import {
 BOW_G, EOW_G, SHIFT_G, CAPS_G, WORDY, HARD, DIGIT, PUNCT, SPACE,
 PUNCT_SYMS, IDEOGRAPHIC_SYMBOLS, SYMBOL_LETTERS, CONTRACTION_SUFFIXES,
 ESCAPED_MARKER_LITERALS, LITERAL_MARKER_ESCAPES,
 unicodeCategory, unicodeCombining, unicodeIsUpper, unicodeIsLower, unicodeLower,
 unicodeAlphabetic, unicodeMark
} from './ctok-constants';

export interface CtokStreamModel { fold_quotes: boolean; allcaps_min: number | null; frame_bow: boolean }
type Run = [string, string];
const STRAY_MARK = 'stray_mark';
const NEW_CASE_PAIRS: Record<string,string> = {'\u1c89':'\u1c8a','\ua7cb':'\u0264'};
const NEW_CASED = new Set([...Object.keys(NEW_CASE_PAIRS), ...Object.values(NEW_CASE_PAIRS)]);
const UNCASED = '\u03f4';
const chars = (s:string) => Array.from(s);
const first = (s:string) => chars(s)[0] ?? '';
const last = (s:string) => chars(s).at(-1) ?? '';
const cp = (s:string) => s.codePointAt(0)!;
function lower(text:string):string { return chars(text).map(c=>c===UNCASED?c:(NEW_CASE_PAIRS[c]??unicodeLower(c))).join(''); }
function isUpper(c:string):boolean { return !!c && c!==UNCASED && (c in NEW_CASE_PAIRS || (unicodeIsUpper(c)&&lower(c)!==c)); }
function isLower(c:string):boolean { return !!c && (Object.values(NEW_CASE_PAIRS).includes(c)||unicodeIsLower(c)); }
function spanIsUpper(text:string):boolean { const cased=chars(text).filter(c=>isUpper(c)||isLower(c));return cased.length>0&&cased.every(isUpper); }

/** Unicode normalization is stable for already-assigned codepoints. A codepoint
 * unassigned in the reference Unicode 15 table is a non-composing starter there;
 * isolate it so a newer browser's NFC cannot apply newly added combining rules.
 */
function referenceNfc(text:string):string {
 let result='',pending='';
 for(const c of text){if(unicodeCategory(c)==='Cn'){result+=pending.normalize('NFC')+c;pending='';}else pending+=c;}
 return result+pending.normalize('NFC');
}
export function nfc(text:string,foldQuotes=false):string {
 // /u ensures a valid surrogate pair is one astral codepoint; only lone surrogates are folded.
 text=referenceNfc(text.replace(/[\ud800-\udfff]/gu,'�'))
  .replace(/[\x01-\x08\x0b-\x1f\x7f-\x9f]/g,'').replace(/\x00/g,' ')
  .replace(/\u0e4d\u0e32/g,'\u0e33').replace(/[\ue000-\uf8ff]/g,'');
 if(foldQuotes) text=text.replace(/[‘’“”]/g,c=>c==='‘'||c==='’'?"'":'"');
 return text.replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f]/g,' ');
}
function isHardCp(o:number):boolean {return o>=0x10000||(o>=0x4e00&&o<=0x9fff)||(o>=0x3400&&o<=0x4dbf)||(o>=0xf900&&o<=0xfaff)||(o>=0xac00&&o<=0xd7a3)||[0x3005,0x3006,0x3031,0x3032,0x3033,0x3034,0x3035,0x303b,0x303c].includes(o);}
const classCache = new Map<string,string>();
export function classify(c:string):string {
 const cached=classCache.get(c);if(cached!==undefined)return cached;
 const o=cp(c),cat=unicodeCategory(c);let result:string=HARD;
 if(NEW_CASED.has(c))result=WORDY;
 else if(cat[0]==='Z'||'\t\n\r\f\v'.includes(c))result=SPACE;
 else if(SYMBOL_LETTERS.some(([lo,hi])=>o>=lo&&o<=hi))result=WORDY;
 else if(cat==='Nd'&&(o<0x80||(o>=0x0660&&o<=0x0669)||(o>=0x06f0&&o<=0x06f9)))result=DIGIT;
 else if(o<0x80&&(cat[0]==='P'||cat[0]==='S'))result=PUNCT;
 else if(PUNCT_SYMS.has(c))result=PUNCT;
 else if(isSelector(c))result=HARD;
 else if(unicodeMark(c))result=o<0x10000&&unicodeAlphabetic(c)?WORDY:HARD;
 else if(cat[0]==='L'&&!isHardCp(o))result=WORDY;
 classCache.set(c,result);return result;
}
export function markCase(span:string,allcapsMin:number|null=4,headMark=false):string {
 if(headMark||span.includes('ẞ'))return span;
 const cs=chars(span),head=cs[0]??'',tail=cs.slice(1);
 if(span.includes('İ')) {
  if(isUpper(head)&&head!=='İ'&&!tail.some(c=>c!=='İ'&&isUpper(c)))return SHIFT_G+lower(head)+tail.map(c=>c==='İ'?c:lower(c)).join('');
  return span;
 }
 const unlowerable=cs.some(c=>(NEW_CASED.has(c)||['L','M'].includes(unicodeCategory(c)[0]))&&!isLower(c)&&(!isUpper(c)||lower(c)===c));
 if(allcapsMin!==null&&spanIsUpper(span)&&cs.length>=allcapsMin&&!unlowerable)return CAPS_G+lower(span).replace(/ς/g,'σ');
 if(lower(head)===head)return span;
 if(isUpper(head)&&!tail.some(isUpper))return SHIFT_G+lower(span);
 return span;
}
function isSelector(ch:string):boolean {const n=cp(ch);return n>=0xfe00&&n<=0xfe0f;}
function hardBow(body:string):boolean {return !!body&&(isSelector(first(body))||marksLikePunct(first(body)));}
function hardEow(body:string):boolean {return !!body&&(isSelector(last(body))||marksLikePunct(last(body)));}
function opensWord(runs:Run[],i:number):boolean {return runs[i][1]==="'"&&i+1<runs.length&&[WORDY,STRAY_MARK].includes(runs[i+1][0]);}
function takesRightBorder(cls:string,body:string):boolean {return cls===PUNCT||hardEow(body)||([DIGIT,HARD].includes(cls)&&digitRun(body)&&digitEow(body));}
function contractionSeam(runs:Run[],i:number):boolean {
 if(!CONTRACTION_SUFFIXES.has(runs[i][1])||i===0)return false;
 const [prevCls,prevBody]=runs[i-1];if(prevCls!==PUNCT||prevBody!=="'")return false;
 return i<2||!takesRightBorder(...runs[i-2]);
}
function digitBorder(ch:string):boolean {const cat=unicodeCategory(ch),o=cp(ch);return(cat==='No'||(cat==='Nd'&&o>=0x80))&&o<0x10000;}
function digitRun(body:string):boolean {if(!body)return false;const cs=chars(body),category=unicodeCategory(cs[0]);return ['Nd','No'].includes(category)&&cs.slice(1).every(ch=>unicodeCategory(ch)===category);}
function digitBow(body:string):boolean {return digitRun(body)&&digitBorder(first(body));}
function digitEow(body:string):boolean {return digitRun(body)&&digitBorder(last(body));}
export function isSeparator(c:string):boolean {return cp(c)<0x10000&&unicodeMark(c)&&!isSelector(c)&&!unicodeAlphabetic(c);}
function syriacVowel(c:string):boolean {const o=cp(c);return o===0x0711||(o>=0x0730&&o<=0x073f);}
function strayMark(c:string):boolean {return !syriacVowel(c)&&unicodeCombining(c)!==0&&!isSeparator(c);}
function hardKind(ch:string):string {if(marksLikePunct(ch))return 'punct';if(digitBorder(ch))return 'number';return 'letter';}
function marksLikePunct(ch:string):boolean {
 ch=ESCAPED_MARKER_LITERALS[ch]??ch;const o=cp(ch);if(o>=0x10000)return false;if(isSeparator(ch))return true;
 const cat=unicodeCategory(ch),ideographicPunct=o>=0x3001&&o<=0x303f&&(cat.startsWith('P')||IDEOGRAPHIC_SYMBOLS.has(ch));
 return(['P','S'].includes(cat[0])||['Cf','Cn'].includes(cat))&&!ideographicPunct;
}
function runsOf(norm:string):Run[] {
 const cs=chars(norm);if(!cs.length)return[];
 const out:Run[]=[];let cur=cs[0],curCls=classify(cs[0]);if(curCls===WORDY&&strayMark(cs[0]))curCls=STRAY_MARK;
 for(const ch of cs.slice(1)){
  const c=classify(ch);
  if(curCls===STRAY_MARK&&c===WORDY&&strayMark(ch))cur+=ch;
  else if(c===curCls)cur+=ch;
  else if(c===WORDY&&strayMark(ch)&&curCls!==WORDY){out.push([curCls,cur]);cur=ch;curCls=STRAY_MARK;}
  else {out.push([curCls,cur]);cur=ch;curCls=c;}
 }
 out.push([curCls,cur]);const split:Run[]=[];
 for(const [cls,body] of out){const bs=chars(body);if(cls!==HARD||bs.length===1){split.push([cls,body]);continue;}
  cur=bs[0];let curKind=hardKind(cur);
  for(const ch of bs.slice(1)){if(isSelector(ch)||hardKind(ch)===curKind)cur+=ch;else{split.push([cls,cur]);cur=ch;curKind=hardKind(ch);}}
  split.push([cls,cur]);
 }
 return split;
}
export function rawHeadSpace(text:string):boolean {return text.startsWith(' ');}
export function stream(text:string,model:CtokStreamModel):string {return streamNorm(nfc(text,model.fold_quotes),model,rawHeadSpace(text));}
export function streamNorm(norm:string,model:CtokStreamModel,rawHead=true):string {
 norm=chars(norm).map(c=>LITERAL_MARKER_ESCAPES[c]??c).join('').replace(/\n+$/g,'');
 if(model.frame_bow&&rawHead&&norm.startsWith(' ')&&!norm.startsWith('  '))norm=norm.slice(1);
 const runs=runsOf(norm);if(!runs.length)return model.frame_bow?BOW_G:'';
 const bordersSpace=(i:number,side:number):boolean=>{
  const j=i+side;if(j<0)return model.frame_bow;if(j>=runs.length||runs[j][0]!==SPACE)return false;
  return side<0?runs[j][1].endsWith(' '):runs[j][1].startsWith(' ')&&!runs[j][1].startsWith('  ');
 };
 const headQuote=opensWord(runs,0),firstRun=runs[0];
 const hasOwnBow=!headQuote&&([WORDY,PUNCT,STRAY_MARK].includes(firstRun[0])||hardBow(firstRun[1])||([DIGIT,HARD].includes(firstRun[0])&&digitBow(firstRun[1]))||(firstRun[0]===SPACE&&firstRun[1].startsWith(' ')));
 const out:string[]=hasOwnBow||!model.frame_bow?[]:[headQuote?' ':BOW_G];
 for(let i=0;i<runs.length;i++){
  const [cls,body]=runs[i];
  if(cls===WORDY){
   const fused=i>0&&runs[i-1][0]===STRAY_MARK;let n=markCase(body,model.allcaps_min,fused),pre='';
   while([SHIFT_G,CAPS_G].includes(n.slice(0,1))){pre+=n[0];n=n.slice(1);}
   const bow=fused||contractionSeam(runs,i)?'':BOW_G;out.push(pre+bow+n+EOW_G);
  }else if(cls===STRAY_MARK){const letterFollows=i+1<runs.length&&runs[i+1][0]===WORDY;out.push(BOW_G+body+(letterFollows?'':EOW_G));}
  else if(cls===PUNCT||hardBow(body)||hardEow(body)){
   const takesBow=bordersSpace(i,-1)&&!opensWord(runs,i)&&(cls===PUNCT||hardBow(body));
   out.push((takesBow?BOW_G:'')+body+(bordersSpace(i,1)&&(cls===PUNCT||hardEow(body))?EOW_G:''));
  }else if(digitRun(body)&&[DIGIT,HARD].includes(cls))out.push((digitBow(body)&&bordersSpace(i,-1)?BOW_G:'')+body+(digitEow(body)&&bordersSpace(i,1)?EOW_G:''));
  else out.push(body);
 }
 // Python dot excludes LF only, unlike JS dot which also excludes CR/U+2028/U+2029.
 return out.join('').replace(new RegExp(`([^\\n])${EOW_G} ([${SHIFT_G}${CAPS_G}]*)${BOW_G}`,'gu'),`$1${EOW_G}$2${BOW_G}`);
}
