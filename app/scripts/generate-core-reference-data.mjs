// Reproduce the fixed Unicode data extracted from the reviewed 1.1.0 implementation.
// No Python, host Unicode tables, network access, or execution of the old source.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const revision='cf43d3cae1534c397dd42a973b2242e8711f0fcf';
const source=execFileSync('git',['show',`${revision}:app/src/lib/labs/ctok-constants.ts`],{cwd:root,encoding:'utf8'});
const data={};
for(const name of ['CATEGORY_RANGES','COMBINING_RANGES','UPPER_RANGES','LOWER_RANGES','ALPHABETIC_RANGES','MARK_RANGES','LOWER_MAP']){
 const line=source.split('\n').find(line=>line.startsWith(`const ${name}`));
 if(!line)throw new Error(`Missing reference table ${name}`);
 data[name]=JSON.parse(line.slice(line.indexOf('=')+1).replace(/;\s*$/,''));
}
writeFileSync(new URL('../core/data/unicode-reference.json',import.meta.url),JSON.stringify(data)+'\n');
const golden=JSON.parse(readFileSync(new URL('../tests/fixtures/ctok-community-golden.json',import.meta.url),'utf8'));
for(const row of golden.cases)row.text=row.text.replace(/[\ud800-\udfff]/gu,'�');
writeFileSync(new URL('../core/data/ctok-golden.json',import.meta.url),JSON.stringify(golden));
