import { afterAll, beforeAll, expect, it } from 'vitest';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';

let root: string;
let server: Server;
let origin: string;
const shell = '<html><head><meta name="offline-book-build" content="same-build"></head></html>';

beforeAll(async () => {
	root = await mkdtemp(join(tmpdir(), 'whats-llm-preview-'));
	await writeFile(join(root, 'index.html'), shell);
	await mkdir(join(root, '_app'));
	await writeFile(join(root, '_app/app.js'), 'export const value = 1;');
	await writeFile(join(root, 'service-worker.js'), 'self.addEventListener("fetch", () => {});');
	const moduleUrl = new URL('../../scripts/preview-static.mjs', import.meta.url).href;
	const { createPreviewServer } = await import(/* @vite-ignore */ moduleUrl);
	server = await createPreviewServer(root);
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	const address = server.address();
	if (!address || typeof address === 'string') throw new Error('No local test server');
	origin = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
	if (server) { server.closeAllConnections(); await new Promise<void>((resolve) => server.close(() => resolve())); }
	if (root) await rm(root, { recursive: true, force: true });
});

it('serves the exact stamped build shell for root, index and chapter navigation', async () => {
	for (const path of ['/', '/index.html', '/chapter/rag/', '/learn/?path=orientation']) {
		const response = await fetch(origin + path);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe(shell);
	}
});

it('serves JavaScript with the right type and HEAD without a body', async () => {
	const response = await fetch(origin + '/service-worker.js', { method: 'HEAD' });
	expect(response.status).toBe(200);
	expect(response.headers.get('content-type')).toContain('javascript');
	expect(response.headers.get('cache-control')).toBe('no-cache');
	expect(Number(response.headers.get('content-length'))).toBeGreaterThan(0);
	expect(await response.text()).toBe('');
});

it('never serves the shell as a missing build asset or accepts writes', async () => {
	for (const path of ['/_app/missing.js', '/icons/missing', '/manifest.webmanifest']) expect((await fetch(origin + path)).status).toBe(404);
	expect((await fetch(origin + '/', { method: 'POST' })).status).toBe(405);
});

it('rejects malformed paths and encoded directory traversal', async () => {
	for (const path of ['/%zz', '/..%2fsecret.txt', '/%5csecret.txt']) expect((await fetch(origin + path)).status).toBe(400);
});
