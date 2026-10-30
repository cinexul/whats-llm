import {it, expect} from 'vitest';
import {TOKEN_SAMPLES} from '$lib/labs/token-samples';
import {ui, countText} from '$lib/ui';
import {allChapters} from '$lib/manifest';
it('shares the appendix everyday wording and retains all original lab examples',()=>{
 expect(TOKEN_SAMPLES.everyday.en).toContain('Please help me');
 expect(Object.keys(TOKEN_SAMPLES)).toEqual(expect.arrayContaining(['everydayOriginal','api','meeting','python','paragraph','technical','numbers','code']));
});
it('derives cover count using the same manifest count in every language',()=>{
 for(const lang of ['zh','ja','en'] as const) expect(countText(ui[lang].bookFacts, allChapters(lang).length,lang)).toContain('47');
});
