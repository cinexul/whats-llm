/** Shared UI lifecycle for native IPC and WASM: an older edit must never replace a newer one. */
export function latestResult<T>() {
 let value=$state.raw<T|null>(null);
 let failed=$state(false);
 let revision=0;
 return {
  get value(){return value;}, get failed(){return failed;},
  async run(work:()=>Promise<T>){
   const current=++revision;value=null;failed=false;
   try{const result=await work();if(current===revision)value=result;}
   catch{if(current===revision){value=null;failed=true;}}
  },
  invalidate(){revision++;}
 };
}
