/** Shared transport only; decompression is not a tokenizer algorithm. */
export async function loadCompressedJsonText(url:string):Promise<string>{
 const response=await fetch(url);
 if(!response.ok)throw new Error(`Resource HTTP ${response.status}`);
 const bytes=new Uint8Array(await response.arrayBuffer());
 return bytes[0]===0x1f&&bytes[1]===0x8b
  ? new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
  : new TextDecoder().decode(bytes);
}
