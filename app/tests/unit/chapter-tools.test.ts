import { readFileSync } from 'node:fs';
import { expect,it } from 'vitest';
import { localEditsCopy } from '$lib/local-edits-copy';
it('keeps the editing workspace after prose and metadata, not between title and body',()=>{
 const page=readFileSync('src/routes/chapter/[slug]/+page.svelte','utf8');
 const render=page.slice(page.indexOf('<article bind:this={article}>'));
 expect(render.indexOf('<ChapterLocalEditor')).toBeGreaterThan(render.indexOf('<ChapterMetadata'));
 expect(render).toContain('href="#chapter-tools"');
 expect(render).toContain('data-testid="local-edit-status"');
});
it.each(['zh','ja','en'] as const)('provides clear localized correction tools in %s',lang=>{
 expect(localEditsCopy[lang].tools).toBeTruthy();
 expect(localEditsCopy[lang].correction).toBeTruthy();
});
