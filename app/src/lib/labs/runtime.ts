/** Shared host selection, not duplicated algorithm implementations. */
export const isNative = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
export async function invokeCore<T>(command:string,args:Record<string,unknown>):Promise<T>{
 const {invoke}=await import('@tauri-apps/api/core');
 return invoke<T>(command,args);
}
