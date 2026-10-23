// Production files only. Version changes are served in memory to test a waiting worker
// without rebuilding or changing artifacts while the browser uses the earlier version.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('build');
const version = JSON.parse(await readFile(resolve(root, '_app/version.json'), 'utf8')).version;
const originalShell = await readFile(resolve(root, 'index.html'), 'utf8');
const bootstrap = originalShell.match(/import\("([^"]*\/entry\/app\.[^"]+\.js)"\)/)?.[1];
if (!bootstrap) throw new Error('Generated shell has no app bootstrap module');
const revisedBootstrap = (revision) => bootstrap.replace(/\.js$/, `.pwa-test-${revision}.js`);
let revision = 1;
const mime = {
	'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
	'.json': 'application/json', '.webmanifest': 'application/manifest+json',
	'.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
	'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.txt': 'text/plain'
};
createServer(async (request, response) => {
	try {
		const path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1:4175').pathname);
		if (path === '/__pwa_test_version' && request.method === 'POST') {
			revision++;
			response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ revision }));
			return;
		}
		// Retain historical bootstrap assets, as a production CDN commonly does.
		const oldRevision = path.match(/\.pwa-test-(\d+)\.js$/)?.[1];
		const bootstrapRevision = oldRevision && path === revisedBootstrap(Number(oldRevision)) ? Number(oldRevision) : null;
		let file = resolve(root, `.${bootstrapRevision ? bootstrap : path}`);
		if (!file.startsWith(`${root}${sep}`) && file !== root) { response.writeHead(403).end(); return; }
		try { if (!(await stat(file)).isFile()) file = resolve(root, 'index.html'); }
		catch { file = resolve(root, 'index.html'); }
		let body = await readFile(file);
		if (path === '/service-worker.js') {
			const script = body.toString();
			if (!script.includes(version)) throw new Error('Generated service worker has no build version');
			body = Buffer.from(script.replaceAll(version, `${version}-pwa-test-${revision}`).replaceAll(bootstrap, revisedBootstrap(revision)));
		}
		if (file === resolve(root, 'index.html')) {
			body = Buffer.from(body.toString()
				.replace(`name="offline-book-build" content="${encodeURIComponent(version)}"`, `name="offline-book-build" content="${encodeURIComponent(`${version}-pwa-test-${revision}`)}"`)
				.replaceAll(bootstrap, revisedBootstrap(revision)));
		}
		if (bootstrapRevision) body = Buffer.from(`${body.toString()}\n;globalThis.__pwa_test_bootstrap__ = ${bootstrapRevision};\n`);
		response.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
	} catch (error) {
		response.writeHead(500, { 'content-type': 'text/plain' }).end(String(error));
	}
}).listen(4175, '127.0.0.1');
