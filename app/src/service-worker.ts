/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';
import { OfflineBook, type OfflineSnapshot } from './lib/offline-cache';

const worker = self as unknown as ServiceWorkerGlobalScope;
const book = new OfflineBook({
	scope: worker.registration.scope,
	version,
	assets: [...build, ...files],
	storage: caches,
	fetch: fetch.bind(worker)
});

let lastReport = 0;
async function report(snapshot: OfflineSnapshot) {
	if (snapshot.phase === 'downloading' && snapshot.completed > 0 && snapshot.completed < snapshot.total && Date.now() - lastReport < 100) return;
	lastReport = Date.now();
	for (const client of await worker.clients.matchAll({ type: 'window', includeUncontrolled: true })) {
		client.postMessage({ type: 'BOOK_PROGRESS', snapshot });
	}
}

// No skipWaiting or large install download: readers explicitly download and apply updates.
worker.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		try { await book.cleanup(); } catch { /* Storage support is reported by BOOK_STATUS. */ }
		await worker.clients.claim();
	})());
});

worker.addEventListener('message', (event) => {
	if (!['BOOK_STATUS', 'BOOK_DOWNLOAD', 'BOOK_ACTIVATE'].includes(event.data?.type)) return;
	event.waitUntil((async () => {
		try {
			let snapshot = event.data.type === 'BOOK_DOWNLOAD'
				? await book.download((state) => { void report(state); })
				: await book.status();
			// Cleanup runs on activation only. A waiting worker must preserve the active book.
			if (event.data.type === 'BOOK_ACTIVATE') {
				if (snapshot.ready) await worker.skipWaiting();
				else snapshot = { ...snapshot, phase: 'error', error: 'incomplete' };
			}
			event.ports[0]?.postMessage(snapshot);
		} catch {
			event.ports[0]?.postMessage({ version, phase: 'error', ready: false, completed: 0, total: 0, error: 'storage' });
		}
	})());
});

worker.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== worker.location.origin || !url.href.startsWith(worker.registration.scope)) return;
	event.respondWith(book.respond(request));
});
