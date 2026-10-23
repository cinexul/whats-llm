#!/usr/bin/env node
// Preview the adapter's actual output, including the version-stamped offline shell.
import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, sep, extname } from 'node:path';
import { parseArgs } from 'node:util';

const buildDirectory = fileURLToPath(new URL('../build/', import.meta.url));
const mime = {
	'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
	'.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.wasm': 'application/wasm',
	'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
	'.ico': 'image/x-icon', '.webp': 'image/webp', '.avif': 'image/avif', '.txt': 'text/plain; charset=utf-8'
};

export async function createPreviewServer(directory = buildDirectory) {
	const root = await realpath(directory);
	await stat(resolve(root, 'index.html'));
	const inside = (file) => file.startsWith(`${root}${sep}`);
	return createServer(async (request, response) => {
		const end = (status, message) => {
			response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
			response.end(request.method === 'HEAD' ? undefined : message);
		};
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.setHeader('allow', 'GET, HEAD'); end(405, 'Method not allowed'); return;
		}
		let pathname;
		try { pathname = decodeURIComponent((request.url ?? '/').split('?')[0]); }
		catch { end(400, 'Invalid path'); return; }
		if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some((part) => part === '..' || part === '.')) {
			end(400, 'Invalid path'); return;
		}
		try {
			let file = resolve(root, `.${pathname}`);
			if (file !== root && !inside(file)) { end(400, 'Invalid path'); return; }
			let exists = false;
			try { exists = (await stat(file)).isFile(); } catch { /* Resolve app navigation below. */ }
			if (!exists) {
				const reserved = /^\/(?:_app|icons)(?:\/|$)/.test(pathname);
				if (reserved || extname(pathname)) { end(404, 'Not found'); return; }
				file = resolve(root, 'index.html');
			}
			file = await realpath(file);
			if (!inside(file)) { end(403, 'Forbidden'); return; }
			const data = await readFile(file);
			response.writeHead(200, {
				'content-type': mime[extname(file)] ?? 'application/octet-stream',
				'content-length': data.length, 'cache-control': 'no-cache',
				'x-content-type-options': 'nosniff'
			});
			response.end(request.method === 'HEAD' ? undefined : data);
		} catch { end(500, 'Could not read the built site'); }
	});
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
	const { values } = parseArgs({ options: { host: { type: 'string', default: '127.0.0.1' }, port: { type: 'string', default: '4173' } } });
	const port = Number(values.port);
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port must be between 1 and 65535.');
	const server = await createPreviewServer();
	server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
	server.listen(port, values.host, () => console.log(`Built book: http://${values.host}:${port}`));
}
