/** Versioned, all-or-nothing storage for the complete static book. */
export type OfflineError = 'network' | 'storage' | 'incomplete' | 'deployment';
export type OfflineSnapshot = {
	version: string;
	phase: 'idle' | 'downloading' | 'ready' | 'error';
	ready: boolean;
	completed: number;
	total: number;
	error?: OfflineError;
};

type Options = {
	scope: string;
	version: string;
	assets: string[];
	storage: CacheStorage;
	fetch: typeof fetch;
};

export class OfflineBook {
	readonly prefix: string;
	readonly name: string;
	readonly assets: string[];
	readonly shell: string;
	private readonly marker: string;
	private snapshot: OfflineSnapshot;
	private downloading?: Promise<OfflineSnapshot>;

	constructor(private options: Options) {
		// Different books hosted on the same origin must never clean up each other's caches.
		this.prefix = `whats-llm-book:${new URL(options.scope).pathname}:`;
		this.name = `${this.prefix}${options.version}`;
		this.shell = new URL('index.html', options.scope).href;
		this.marker = new URL('__offline_book_complete__', options.scope).href;
		this.assets = [...new Set([...options.assets.map((asset) => new URL(asset, options.scope).href), this.shell])];
		if (this.assets.some((asset) => new URL(asset).origin !== new URL(options.scope).origin)) {
			throw new Error('Offline assets must be on the book origin');
		}
		this.snapshot = { version: options.version, phase: 'idle', ready: false, completed: 0, total: this.assets.length };
	}

	private async complete(cache: Cache, verifyEntries = false): Promise<boolean> {
		const marker = await cache.match(this.marker);
		if (!marker) return false;
		try {
			const record = await marker.json();
			if (record.version !== this.options.version || record.total !== this.assets.length) return false;
			if (verifyEntries) {
				const stored = new Set((await cache.keys()).map((request) => request.url));
				return this.assets.every((asset) => stored.has(asset));
			}
			return true;
		} catch {
			return false;
		}
	}

	async status(): Promise<OfflineSnapshot> {
		if (this.snapshot.phase === 'downloading') return { ...this.snapshot };
		const cache = await this.options.storage.open(this.name);
		const ready = await this.complete(cache, true);
		this.snapshot = {
			...this.snapshot, ready,
			phase: ready ? 'ready' : this.snapshot.phase === 'error' ? 'error' : 'idle',
			completed: ready ? this.assets.length : 0
		};
		return { ...this.snapshot };
	}

	download(report: (snapshot: OfflineSnapshot) => void = () => {}): Promise<OfflineSnapshot> {
		if (this.downloading) return this.downloading;
		this.downloading = this.runDownload(report).finally(() => { this.downloading = undefined; });
		return this.downloading;
	}

	private async runDownload(report: (snapshot: OfflineSnapshot) => void): Promise<OfflineSnapshot> {
		const emit = () => report({ ...this.snapshot });
		try {
			if ((await this.status()).ready) return { ...this.snapshot };
			await this.options.storage.delete(this.name);
			const cache = await this.options.storage.open(this.name);
			this.snapshot = { ...this.snapshot, phase: 'downloading', ready: false, completed: 0, error: undefined };
			emit();
			const save = async (asset: string) => {
				const response = await this.options.fetch(asset, { cache: 'reload', credentials: 'same-origin' });
				if (!response.ok || response.type === 'opaque' ||
					(response.url && new URL(response.url).origin !== new URL(asset).origin) ||
					(asset !== this.shell && response.headers.get('content-type')?.includes('text/html'))) {
					throw new Error('Asset unavailable; do not save an incomplete book');
				}
				if (asset === this.shell) {
					// Read the version from this response itself: a separate version.json check
					// can race a deployment between checking and fetching the mutable shell.
					const html = await response.clone().text();
					const stamp = html.match(/<meta name="offline-book-build" content="([^"]*)">/)?.[1];
					if (stamp !== encodeURIComponent(this.options.version)) {
						const error = new Error('The deployed shell belongs to a different build');
						error.name = 'DeploymentChangedError';
						throw error;
					}
				}
				await cache.put(asset, response);
				this.snapshot.completed++;
				emit();
			};
			// Reject a newer deployment before spending bandwidth on the older worker's assets.
			await save(this.shell);
			const remaining = this.assets.filter((asset) => asset !== this.shell);
			let next = 0;
			let failure: unknown;
			// Bound memory and connection use; settle all writers before removing a failed staging cache.
			await Promise.all(Array.from({ length: Math.min(8, remaining.length) }, async () => {
				while (!failure && next < remaining.length) {
					try { await save(remaining[next++]); }
					catch (error) { failure = error; }
				}
			}));
			if (failure) throw failure;
			// This is the commit point. Fetch never serves a staging cache as a complete book.
			await cache.put(this.marker, new Response(JSON.stringify({
				version: this.options.version, total: this.assets.length, savedAt: Date.now()
			}), { headers: { 'content-type': 'application/json' } }));
			if (!(await this.complete(cache, true))) throw new Error('Incomplete cache');
			this.snapshot = { ...this.snapshot, phase: 'ready', ready: true };
		} catch (error) {
			try { await this.options.storage.delete(this.name); } catch { /* Report storage failure below. */ }
			const name = error && typeof error === 'object' && 'name' in error ? error.name : '';
			this.snapshot = {
				...this.snapshot, phase: 'error', ready: false,
				error: name === 'DeploymentChangedError' ? 'deployment' : name === 'QuotaExceededError' || name === 'SecurityError' ? 'storage' : 'network'
			};
		}
		emit();
		return { ...this.snapshot };
	}

	/** Keep one previous complete version for open tabs and interrupted/automatic updates. */
	async cleanup(): Promise<void> {
		if (!(await this.status()).ready) return;
		const old: { name: string; savedAt: number }[] = [];
		for (const name of await this.options.storage.keys()) {
			if (!name.startsWith(this.prefix) || name === this.name) continue;
			const cache = await this.options.storage.open(name);
			const marker = await cache.match(this.marker);
			if (marker) {
				try { old.push({ name, savedAt: (await marker.json()).savedAt ?? 0 }); } catch { await this.options.storage.delete(name); }
			}
			// An unmarked cache may belong to another worker's in-flight download.
			// That worker alone removes its staging cache on failure/retry.
		}
		old.reverse().sort((a, b) => b.savedAt - a.savedAt);
		await Promise.all(old.slice(1).map(({ name }) => this.options.storage.delete(name)));
	}

	async respond(request: Request): Promise<Response> {
		const navigation = request.mode === 'navigate';
		try {
			const current = await this.options.storage.open(this.name);
			if (await this.complete(current)) {
				const cached = await current.match(navigation ? this.shell : request);
				if (cached) return cached;
			}
		} catch { /* A storage restriction must not break ordinary online reading. */ }
		try {
			const response = await this.options.fetch(request);
			if (response.ok) return response;
			const previous = await this.previousResponse(request, navigation);
			return previous ?? response;
		} catch (error) {
			const previous = await this.previousResponse(request, navigation);
			if (previous) return previous;
			throw error;
		}
	}

	private async previousResponse(request: Request, navigation: boolean): Promise<Response | undefined> {
		// Only this application's completed caches, never arbitrary same-origin/third-party resources.
		for (const name of (await this.options.storage.keys()).reverse()) {
			if (!name.startsWith(this.prefix) || name === this.name) continue;
			const cache = await this.options.storage.open(name);
			if (!(await cache.match(this.marker))) continue;
			const response = await cache.match(navigation ? this.shell : request);
			if (response) return response;
		}
	}
}
