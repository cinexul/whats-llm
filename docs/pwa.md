# Offline book and installation

The browser edition is an installable PWA. Open **Library → Offline reading and installation**, then choose **Download complete book**. Wait for the explicit ready message. The download includes all three language editions, every route, interactive lesson, font, and code-highlighting asset; visiting a chapter in advance is unnecessary. The current production bundle is approximately 60 MB before browser cache overhead. External links still require a connection.

Installation is a separate action. Chromium browsers show **Install this book** when their installation prompt is available. Otherwise use the browser's **Install app / Add to Home Screen** menu; on iPhone and iPad use Safari's Share menu. The panel provides instructions when no programmatic install prompt exists. Installation alone does not download the complete book.

The desktop Tauri edition already bundles these files. It does not register a service worker, and neither does the development server.

## Download and update behavior

- Downloads run only after a reader requests them. The progress bar counts files successfully saved, not estimated bytes. Keep the page open during the download.
- A version has its own scoped cache. The static adapter stamps the generated SPA shell with the same SvelteKit build version used by its service worker. The downloader checks that stamp from the shell response itself before downloading assets, so an old open tab cannot combine its old asset list with a newer deployment's shell. If the website has changed, the panel asks the reader to check for and download the update. The completion marker is written only after every listed build/static asset and `index.html` is saved. A failed or quota-limited download removes its staging cache and reports failure; it never declares the book ready.
- A waiting update is shown in Library. **Download update** saves the entire new version while the previous complete version stays usable. **Apply update and reload** explicitly activates the prepared worker, then reloads open reader tabs. An incomplete update cannot be activated through that action.
- The browser can also activate an installed worker naturally after all tabs close. If that version has not been downloaded, online requests work normally; an earlier complete cache remains available as a network-failure fallback. The panel correctly shows that the current version still needs downloading.
- Cleanup runs only when a worker activates, retaining its complete version and one preceding complete version. A waiting worker never deletes the active book. Other workers' unmarked staging caches are preserved because they may still be downloading; a failed or retried download removes its own staging cache. Cache names include this book's deployment path. Other apps' caches are untouched, and cross-origin resources are never cached.
- Ready status rechecks the cached asset list when opening Library or focusing the window. Browsers can evict website data; confirm readiness before travelling. Offline files do not back up annotations or study records: export those separately from Library.

## Static hosting

Build with `cd app && npm ci && npm run build`. Publish the **entire `app/build/` directory** atomically. Keep prior hashed assets available during rollout if the host supports it, since open tabs may still use them.

For a local production preview, run `npm run preview` and open `http://127.0.0.1:4173`. This command serves the actual adapter output with its version-stamped shell and SPA fallback. Do not substitute `vite preview`: its server-rendered fallback is not the stamped static shell and is deliberately rejected by the offline completeness check. Optional `-- --host 0.0.0.0 --port 4173` exposes the preview on your network, but a phone still needs HTTPS for service workers; an ordinary LAN HTTP address is not a secure context.

Use **HTTPS**, except for browser-trusted localhost/loopback testing. Provide the normal SPA fallback: URLs such as `/chapter/rag/`, `/learn/`, `/labs/` and `/library/` must return `index.html`. Serve real static files first. Missing JavaScript, font and other asset URLs should return an error rather than silently returning the SPA document; the downloader rejects HTML returned for assets.

Serve `service-worker.js` as JavaScript with `Cache-Control: no-cache` (or a similarly revalidating policy). Do not rewrite its URL to HTML. Serve `manifest.webmanifest` as `application/manifest+json`, and make the PNG icons reachable. The generated worker is placed next to `index.html`, giving it the correct application scope. Hashed `/_app/immutable/` assets may use long immutable cache headers; `index.html`, the manifest and `/_app/version.json` should revalidate. Deploy the worker together with the assets it names.

The default build is hosted at `/`. For a subdirectory deployment, configure SvelteKit `paths.base` before building, keep the generated worker in that directory, and apply the SPA fallback within that path. Registration and head links use SvelteKit's base path; manifest start URL, scope and icons use relative URLs. Do not change only the host directory after building.

Example Nginx locations for the default root deployment:

```nginx
location = /service-worker.js {
    add_header Cache-Control "no-cache";
    try_files $uri =404;
}
location /_app/ {
    try_files $uri =404;
}
location /icons/ {
    try_files $uri =404;
}
location / {
    try_files $uri $uri/ /index.html;
}
```

Keep the server's standard MIME table enabled and add the web manifest MIME type if needed. GitHub Pages does not supply the required arbitrary-route fallback automatically; use a host with SPA rewrites or explicitly configure an equivalent fallback.

## Verification

```sh
cd app
npm run check
npx vitest run src/lib/offline-cache.test.ts
npm run build
npx playwright test --config=playwright.pwa.config.ts
```

Install the Playwright Chromium browser first (`npx playwright install chromium`), or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an available compatible Chromium executable. The PWA suite uses a separate production-only static server on `127.0.0.1:4175`; no development server is reused. Its update endpoint changes the generated service worker's version, the shell's version stamp, and the actual app bootstrap module URL/content in memory while retaining historical bootstrap files. It never edits build files.

The unit suite checks deployment/shell mismatch rejection, concurrent worker staging safety, failed downloads, quota errors, partial-cache isolation, prior-version fallback, eviction recovery and scoped cleanup. The browser suite downloads the actual bundle, reads previously unopened chapters offline, changes languages, reloads without a network, and verifies the download-before-activation update flow with changed bootstrap modules. It also opens a tab before a new deployment, confirms that the old worker refuses to mark the newer shell ready, then downloads and applies the correct update offline. Browser installation menus, iOS behavior and storage eviction policy still vary by platform; the UI supplies manual installation instructions and storage-failure feedback.
