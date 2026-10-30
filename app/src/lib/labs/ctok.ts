// Local, lazy-loaded COMMUNITY count reconstruction. Never calls the Anthropic API.
import { base } from '$app/paths';
import { createCtokCounter, type CtokAsset, type CtokCount } from './ctok-engine';
export type { CtokCount } from './ctok-engine';

export const CTOK_SOURCE = 'https://github.com/sanderland/ctok';
export const CTOK_REVISION = '8c43ffd3c7be467622a540f025516e49ef78d8b1';
export const CTOK_FAMILY = 'v4.8';

let loading: Promise<(text: string) => CtokCount> | null = null;

export function loadCtokCounter(): Promise<(text: string) => CtokCount> {
	loading ??= (async () => {
		const response = await fetch(`${base}/tokenizers/ctok-v48.json.gz`);
		if (!response.ok) throw new Error(`Community tokenizer HTTP ${response.status}`);
		const bytes = new Uint8Array(await response.arrayBuffer());
		const gzipped = bytes[0] === 0x1f && bytes[1] === 0x8b;
		const asset: CtokAsset = gzipped
			? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json()
			: JSON.parse(new TextDecoder().decode(bytes));
		return createCtokCounter(asset);
	})().catch((error) => { loading = null; throw error; });
	return loading;
}
