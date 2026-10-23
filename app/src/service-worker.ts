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

// 不调用skipWaiting，也不在安装时大量下载；由读者主动下载并应用更新。
worker.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		try { await book.cleanup(); } catch { /* 存储支持情况通过BOOK_STATUS报告。 */ }
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
			// 仅在激活时清理；等待中的worker必须保留当前使用的书籍缓存。
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
