// deflate + Base64 で埋め込まれた本文を復元する(vite.config.ts の content-encode と対)。
export async function inflateB64(b64: string): Promise<string> {
	const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
	return await new Response(stream).text();
}
