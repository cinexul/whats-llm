import { describe, expect, it, vi } from 'vitest';
import { OfflineBook } from '$lib/offline-cache';

function memoryStorage() {
	const stores = new Map<string, Map<string, Response>>();
	const key = (input: RequestInfo | URL) => typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
	const storage = {
		async keys() { return [...stores.keys()]; },
		async delete(name: string) { return stores.delete(name); },
		async open(name: string) {
			if (!stores.has(name)) stores.set(name, new Map());
			const entries = stores.get(name)!;
			return {
				async match(input: RequestInfo | URL) { return entries.get(key(input))?.clone(); },
				async put(input: RequestInfo | URL, response: Response) { entries.set(key(input), response.clone()); },
				async keys() { return [...entries.keys()].map((url) => new Request(url)); }
			} as unknown as Cache;
		}
	} as CacheStorage;
	return { storage, stores };
}
const scope = 'https://book.example/reader/';
const shell = (version: string, body = '') => `<meta name="offline-book-build" content="${encodeURIComponent(version)}">${body}`;
const assets = ['_app/zh.js', '_app/en.js', '_app/ja.js', 'font.woff2', 'syntax.js'];
function fixture(version = 'one', memory = memoryStorage(), fetcher: typeof fetch = vi.fn(async (input) => {
	const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
	return new Response(url.endsWith('index.html') ? shell(version, `book-${version}:${url}`) : `book-${version}:${url}`, { headers: { 'content-type': url.endsWith('index.html') ? 'text/html' : 'application/javascript' } });
})) {
	return { ...memory, fetcher, book: new OfflineBook({ scope, version, assets, storage: memory.storage, fetch: fetcher }) };
}
function navigation() {
	const request = new Request(`${scope}chapter/unread/`);
	Object.defineProperty(request, 'mode', { value: 'navigate' });
	return request;
}

describe('complete offline book storage', () => {
	it('saves every language, lazy asset and SPA shell before reporting ready', async () => {
		const { book, fetcher } = fixture();
		expect((await book.status()).ready).toBe(false);
		const progress: number[] = [];
		const state = await book.download((snapshot) => progress.push(snapshot.completed));
		expect(state).toMatchObject({ phase: 'ready', ready: true, completed: 6, total: 6 });
		expect(fetcher).toHaveBeenCalledTimes(6);
		expect(progress).toContain(3);
		expect((await book.status()).ready).toBe(true);
		expect(await (await book.respond(navigation())).text()).toContain('index.html');
		await book.download();
		expect(fetcher).toHaveBeenCalledTimes(6);
	});

	it('rejects a host SPA fallback returned for a missing JavaScript asset', async () => {
		const { book, stores } = fixture('broken', memoryStorage(), vi.fn(async (input) => new Response(String(input).endsWith('index.html') ? shell('broken') : '<html>fallback</html>', { headers: { 'content-type': 'text/html' } })));
		expect(await book.download()).toMatchObject({ phase: 'error', ready: false, error: 'network' });
		expect(stores.has(book.name)).toBe(false);
	});

	it('rejects a newer deployed shell even when the old hashed assets are still available', async () => {
		const previous = fixture('previous');
		await previous.book.download();
		const next = fixture('one', previous, vi.fn(async (input) => {
			const url = String(input);
			return new Response(url.endsWith('index.html')
				? shell('two', '<script src="new-v2.js"></script>') : 'retained-v1-asset', {
				headers: { 'content-type': url.endsWith('index.html') ? 'text/html' : 'text/javascript' }
			});
		}));
		expect(await next.book.download()).toMatchObject({ phase: 'error', ready: false, error: 'deployment' });
		expect(next.stores.has(next.book.name)).toBe(false);
		expect(next.fetcher).toHaveBeenCalledTimes(1);
		expect((await previous.book.status()).ready).toBe(true);
	});

	it('rejects an unstamped shell and accepts encoded custom build identifiers', async () => {
		const unstamped = fixture('one', memoryStorage(), vi.fn(async () => new Response('<script src="new.js"></script>')));
		expect(await unstamped.book.download()).toMatchObject({ ready: false, error: 'deployment' });
		const custom = fixture('release / 日本語 & "quoted"');
		expect((await custom.book.download()).ready).toBe(true);
	});

	it('preserves another worker staging cache during concurrent update cleanup', async () => {
		const memory = memoryStorage();
		let finish!: () => void;
		const blocked = new Promise<void>((resolve) => { finish = resolve; });
		const first = fixture('one', memory, vi.fn(async (input) => {
			const url = String(input);
			if (url.endsWith('syntax.js')) await blocked;
			return new Response(url.endsWith('index.html') ? shell('one') : 'v1');
		}));
		const downloading = first.book.download();
		await vi.waitFor(async () => { expect((await first.book.status()).completed).toBe(5); });
		const second = fixture('two', memory);
		await second.book.download();
		await second.book.cleanup();
		const firstStillStored = memory.stores.has(first.book.name);
		finish();
		expect((await downloading).ready).toBe(true);
		expect(firstStillStored).toBe(true);
		expect((await first.book.status()).ready).toBe(true);
	});

	it('retains the previous complete book when an update download fails', async () => {
		const previous = fixture();
		await previous.book.download();
		const next = fixture('two', previous, vi.fn(async () => { throw new TypeError('Offline'); }));
		expect(await next.book.download()).toMatchObject({ ready: false, phase: 'error' });
		expect(previous.stores.has(previous.book.name)).toBe(true);
		expect(await (await next.book.respond(navigation())).text()).toContain('book-one:');
		expect(await (await next.book.respond(new Request(`${scope}_app/ja.js`))).text()).toContain('book-one:');
	});

	it('never serves a partially downloaded cache as the complete book', async () => {
		let finish!: () => void;
		const blocked = new Promise<void>((resolve) => { finish = resolve; });
		const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
			if (url.endsWith('syntax.js') && init?.cache === 'reload') await blocked;
			return new Response(url.endsWith('index.html') ? shell('staging', 'saved') : init?.cache === 'reload' ? 'saved' : 'live');
		});
		const { book } = fixture('staging', memoryStorage(), fetcher);
		const running = book.download();
		await vi.waitFor(async () => { expect((await book.status()).completed).toBe(5); });
		expect((await book.status()).ready).toBe(false);
		expect(await (await book.respond(new Request(`${scope}_app/zh.js`))).text()).toBe('live');
		finish();
		expect((await running).ready).toBe(true);
		expect(await (await book.respond(new Request(`${scope}_app/zh.js`))).text()).toBe('saved');
	});

	it('reports quota failure and removes the failed staging version', async () => {
		const memory = memoryStorage();
		const originalOpen = memory.storage.open.bind(memory.storage);
		memory.storage.open = async (name) => {
			const cache = await originalOpen(name);
			cache.put = async () => { throw new DOMException('Full', 'QuotaExceededError'); };
			return cache;
		};
		const { book } = fixture('quota', memory);
		expect(await book.download()).toMatchObject({ ready: false, phase: 'error', error: 'storage' });
		expect(memory.stores.has(book.name)).toBe(false);
	});

	it('keeps online reading available when the browser denies cache access', async () => {
		const memory = memoryStorage();
		memory.storage.open = async () => { throw new DOMException('Denied', 'SecurityError'); };
		const { book } = fixture('restricted', memory);
		expect(await book.download()).toMatchObject({ phase: 'error', ready: false, error: 'storage' });
		expect(await (await book.respond(navigation())).text()).toContain('book-restricted:');
	});

	it('detects eviction and can restore a missing cached asset', async () => {
		const { book, stores } = fixture();
		await book.download();
		stores.get(book.name)!.delete(`${scope}_app/ja.js`);
		expect((await book.status()).ready).toBe(false);
		expect((await book.download()).ready).toBe(true);
	});

	it('cleans only this scope and retains one previous complete version', async () => {
		const memory = memoryStorage();
		const first = fixture('one', memory), second = fixture('two', memory), third = fixture('three', memory);
		await first.book.download();
		await second.book.download();
		await third.book.download();
		await memory.storage.open('another-app');
		await memory.storage.open('whats-llm-book:/different/:one');
		await memory.storage.open(`${third.book.prefix}incomplete`);
		await third.book.cleanup();
		const names = await memory.storage.keys();
		expect(names).toContain(third.book.name);
		expect(names.filter((name) => name.startsWith(third.book.prefix) && !name.endsWith('incomplete'))).toHaveLength(2);
		expect(names).toContain(`${third.book.prefix}incomplete`);
		expect(names).toContain('another-app');
		expect(names).toContain('whats-llm-book:/different/:one');
	});

	it('shares concurrent downloads and rejects cross-origin manifests', async () => {
		const { book } = fixture();
		const first = book.download(), second = book.download();
		expect(first).toBe(second);
		await first;
		expect(() => new OfflineBook({ scope, version: 'bad', assets: ['https://elsewhere.example/code.js'], storage: memoryStorage().storage, fetch })).toThrow('book origin');
	});
});
