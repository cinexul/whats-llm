import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { marked } from 'marked';

describe.each(['zh', 'ja', 'en'])('%s tokenizer teaching material', (lang) => {
  const read = (slug: string) => readFileSync(new URL(`../../src/lib/content/${lang}/${slug}.md`, import.meta.url), 'utf8');
  it('uses the pinned Qwen3.8 tokenizer in the chapter and appendix', () => {
    for (const slug of ['token-and-context', 'appendix-numbers']) {
      expect(read(slug)).toContain('Qwen3.8');
      expect(slug === 'appendix-numbers' ? read(slug).split('## ')[1] : read(slug)).not.toMatch(/Qwen3(?!\.8)/);
    }
  });
  it('does not accidentally strike through numeric ranges', () => {
    expect(marked.parse(read('token-and-context'))).not.toContain('<del>');
  });
  it('updates the actual token diagram, not just its surrounding caption', () => {
    const svg = readFileSync(new URL(`../../static/figures/${lang}/tokens.svg`, import.meta.url), 'utf8');
    expect(svg).toContain('Qwen3.8');
    expect(svg).not.toMatch(/Qwen3(?!\.8)/);
  });
});

const samples = JSON.parse(readFileSync(new URL('../../src/lib/labs/token-samples.json', import.meta.url), 'utf8'));
const golden = JSON.parse(readFileSync(new URL('../fixtures/tokenizer-golden.json', import.meta.url), 'utf8'));
describe.each(['zh', 'ja', 'en'])('%s canonical appendix data', (lang) => {
  it('preserves every canonical sentence and matches all five official count rows', () => {
    const appendix = readFileSync(new URL(`../../src/lib/content/${lang}/appendix-numbers.md`, import.meta.url), 'utf8');
    const tableRows = appendix.split('\n').filter((line: string) => /^\|/.test(line)).slice(2, 7);
    for (const [i, key] of ['everyday', 'api', 'meeting', 'python', 'paragraph'].entries()) {
      for (const language of ['zh', 'ja', 'en']) expect(appendix).toContain(samples[key][language]);
      const expected = ['zh', 'ja', 'en'].map((language) => {
        const row = golden.rows.find((r: { key: string }) => r.key === `${key}.${language}`);
        return `${row.o200k.count}/${row.qwen38.count}`;
      });
      expect(tableRows[i].replace(/\s/g, '').replace(/／/g, '/').split('|').slice(2, 5)).toEqual(expected);
    }
    expect(appendix).toContain('/labs/#tokens');
  });
});

describe.each(['zh', 'ja', 'en'])('%s community estimate disclosure', (lang) => {
  it('keeps ctok separate from official tokenizer comparisons and limits its scope', () => {
    for (const slug of ['token-and-context', 'appendix-numbers']) {
      const content = readFileSync(new URL(`../../src/lib/content/${lang}/${slug}.md`, import.meta.url), 'utf8');
      expect(content).toContain('https://github.com/sanderland/ctok');
      expect(content).toContain('Opus 4.8');
      expect(content).toContain('Opus 5/5.5');
      expect(content).toContain('token ID');
    }
  });
});
