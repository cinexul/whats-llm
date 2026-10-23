import { dev } from '$app/environment';
import { base } from '$app/paths';
import { writable } from 'svelte/store';
import type { OfflineSnapshot } from './offline-cache';

interface InstallEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Availability = 'checking' | 'ready' | 'unsupported' | 'native' | 'development' | 'insecure';
export type PwaState = {
	availability: Availability;
	online: boolean;
	installed: boolean;
	canInstall: boolean;
	current: OfflineSnapshot | null;
	update: OfflineSnapshot | null;
	checkingUpdate: boolean;
	checkedUpdate: boolean;
	error: 'registration' | 'connection' | 'install' | null;
};

export const pwa = writable<PwaState>({
	availability: 'checking', online: true, installed: false, canInstall: false,
	current: null, update: null, checkingUpdate: false, checkedUpdate: false, error: null
});
let registration: ServiceWorkerRegistration | undefined;
let start: Promise<void> | undefined;
let installEvent: InstallEvent | undefined;

function patch(state: Partial<PwaState>) { pwa.update((old) => ({ ...old, ...state })); }

function message(worker: ServiceWorker, type: 'BOOK_STATUS' | 'BOOK_DOWNLOAD' | 'BOOK_ACTIVATE'): Promise<OfflineSnapshot> {
	return new Promise((resolve, reject) => {
		const channel = new MessageChannel();
		const timeout = window.setTimeout(() => {
			channel.port1.close();
			reject(new Error('Offline worker did not respond'));
		}, type === 'BOOK_DOWNLOAD' ? 30 * 60_000 : 20_000);
		channel.port1.onmessage = (event) => {
			clearTimeout(timeout);
			channel.port1.close();
			resolve(event.data as OfflineSnapshot);
		};
		worker.postMessage({ type }, [channel.port2]);
	});
}

async function refresh() {
	if (!registration) return;
	const [current, update] = await Promise.all([
		registration.active ? message(registration.active, 'BOOK_STATUS') : null,
		registration.waiting ? message(registration.waiting, 'BOOK_STATUS') : null
	]);
	patch({ current, update });
}

/** 在根布局调用一次；面板重复挂载时复用注册结果。 */
export function startPwa(): Promise<void> {
	if (typeof window === 'undefined') return Promise.resolve();
	if (start) return start.then(() => refresh()).catch(() => patch({ error: 'connection' }));
	return start = initialize();
}

async function initialize() {
	if ('__TAURI_INTERNALS__' in window) { patch({ availability: 'native' }); return; }
	if (dev) { patch({ availability: 'development' }); return; }
	if (!window.isSecureContext) { patch({ availability: 'insecure' }); return; }
	if (!('serviceWorker' in navigator) || !('caches' in window)) { patch({ availability: 'unsupported' }); return; }
	patch({ online: navigator.onLine, installed: window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone) });
	window.addEventListener('online', () => { patch({ online: true }); void refresh().catch(() => {}); });
	window.addEventListener('focus', () => { void refresh().catch(() => {}); });
	window.addEventListener('offline', () => patch({ online: false }));
	window.addEventListener('beforeinstallprompt', (event) => {
		event.preventDefault();
		installEvent = event as InstallEvent;
		patch({ canInstall: true });
	});
	window.addEventListener('appinstalled', () => {
		installEvent = undefined;
		patch({ installed: true, canInstall: false });
	});
	let hadController = Boolean(navigator.serviceWorker.controller);
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (hadController) window.location.reload();
		else { hadController = true; void refresh().catch(() => patch({ error: 'connection' })); }
	});
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data?.type !== 'BOOK_PROGRESS') return;
		const snapshot = event.data.snapshot as OfflineSnapshot;
		if (event.source === registration?.waiting || event.source === registration?.installing) patch({ update: snapshot });
		else if (event.source === registration?.active) patch({ current: snapshot });
	});
	try {
		registration = await navigator.serviceWorker.register(`${base}/service-worker.js`, { scope: `${base}/`, updateViaCache: 'none' });
		registration.addEventListener('updatefound', () => {
			registration?.installing?.addEventListener('statechange', () => {
				if (registration?.waiting || registration?.active) void refresh().catch(() => patch({ error: 'connection' }));
			});
		});
		await navigator.serviceWorker.ready;
		await refresh();
		patch({ availability: 'ready' });
	} catch {
		patch({ availability: 'unsupported', error: 'registration' });
	}
}

export async function downloadBook(update = false) {
	await startPwa();
	const worker = update ? registration?.waiting : registration?.active;
	if (!worker) return;
	patch({ error: null });
	try {
		const snapshot = await message(worker, 'BOOK_DOWNLOAD');
		patch(update ? { update: snapshot } : { current: snapshot });
	} catch {
		patch({ error: 'connection' });
	}
}

export async function checkForUpdate() {
	await startPwa();
	if (!registration) return;
	patch({ checkingUpdate: true, checkedUpdate: false, error: null });
	try {
		await registration.update();
		await refresh();
		patch({ checkedUpdate: true });
	} catch {
		patch({ error: 'connection' });
	} finally {
		patch({ checkingUpdate: false });
	}
}

export async function applyUpdate() {
	const worker = registration?.waiting;
	if (!worker) return;
	try {
		const snapshot = await message(worker, 'BOOK_ACTIVATE');
		if (!snapshot.ready) patch({ update: snapshot });
	} catch { patch({ error: 'connection' }); }
}

export async function installBook() {
	if (!installEvent) return;
	const event = installEvent;
	installEvent = undefined;
	patch({ canInstall: false, error: null });
	try {
		await event.prompt();
		await event.userChoice;
	} catch { patch({ error: 'install' }); }
}
