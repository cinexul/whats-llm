import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const app=fileURLToPath(new URL('../',import.meta.url));
function run(cmd,args){const p=spawnSync(cmd,args,{cwd:app,stdio:'inherit',shell:false});if(p.error)throw p.error;if(p.status!==0)process.exit(p.status??1);}
run('cargo',['build','--manifest-path','core/Cargo.toml','--locked','--release','--target','wasm32-unknown-unknown']);
mkdirSync(new URL('../src/lib/generated/core/',import.meta.url),{recursive:true});
run('wasm-bindgen',['core/target/wasm32-unknown-unknown/release/whats_llm_core.wasm','--target','web','--out-dir','src/lib/generated/core','--out-name','whats_llm_core']);
