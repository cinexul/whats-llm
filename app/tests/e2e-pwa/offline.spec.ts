import { expect, test } from '@playwright/test';

async function english(page: import('@playwright/test').Page) {
	await page.addInitScript(() => !localStorage.getItem('lang') && localStorage.setItem('lang', 'en'));
}

test('complete download supports unread chapters, language changes and full offline reloads', async ({ page, context, request }) => {
	await english(page);
	await page.goto('/library/');
	await expect(page.getByTestId('download-book')).toBeVisible();
	await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
	const manifestResponse = await request.get('/manifest.webmanifest');
	const manifest = await manifestResponse.json();
	expect(manifest.display).toBe('standalone');
	expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(true);
	await page.getByTestId('download-book').click();
	await expect(page.getByTestId('offline-status')).toContainText('ready offline', { timeout: 120_000 });
	await context.setOffline(true);
	// This chapter and its Japanese translation have never been visited by this browser.
	await page.goto('/chapter/project-doc-note-tool/');
	await expect(page.locator('main h1')).toBeVisible();
	await expect(page.locator('.prose')).toContainText('document');
	await page.reload();
	await expect(page.locator('main h1')).toBeVisible();
	await page.getByRole('button', { name: 'Display', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: '日本語', exact: true }).click();
	await page.keyboard.press('Escape');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await expect(page.locator('.prose')).toContainText('文書');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await expect(page.locator('.prose')).toContainText('文書');
	await page.goto('/chapter/token-and-context/');
	await expect(page.locator('main h1')).toBeVisible();
	await page.getByRole('button', { name: '表示設定', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: '中文', exact: true }).click();
	await page.keyboard.press('Escape');
	await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
	await expect(page.locator('.prose')).toContainText('上下文');
	// Local editing and its diff must remain usable after a full offline reload.
	await page.getByTestId('edit-chapter').click();
	const original = await page.getByTestId('local-markdown').inputValue();
	await page.getByTestId('local-markdown').fill(`${original}\n\n我的离线例子也要保留下来。`);
	await page.getByTestId('save-local-edit').click();
	await expect(page.getByTestId('local-edited-badge')).toBeVisible();
	await page.reload();
	await expect(page.locator('article > .prose')).toContainText('我的离线例子也要保留下来。');
	await page.getByTestId('view-local-diff').click();
	await expect(page.getByTestId('local-diff')).toContainText('我的离线例子也要保留下来。');
	await page.getByTestId('local-editor').getByRole('button', { name: '关闭', exact: true }).click();
	await page.goto('/library/');
	await expect(page.getByTestId('offline-status')).toContainText('完整书籍已下载');
	await expect(page.getByTestId('local-edits-library').locator('li')).toHaveCount(1);
});

test('an update is downloaded before explicit activation and remains available offline', async ({ page, context, request }) => {
	await english(page);
	await page.goto('/library/');
	await page.getByTestId('download-book').click();
	await expect(page.getByTestId('offline-status')).toContainText('ready offline', { timeout: 120_000 });
	const firstVersion = await page.evaluate(async () => {
		const names = await caches.keys();
		return names.find((name) => name.startsWith('whats-llm-book:'));
	});
	const revision = (await (await request.post('/__pwa_test_version')).json()).revision;
	await page.getByRole('button', { name: 'Check for updates', exact: true }).click();
	await expect(page.getByTestId('download-update')).toBeVisible();
	await expect(page.getByTestId('apply-update')).toHaveCount(0);
	// A waiting worker cannot be activated with an incomplete book.
	const refused = await page.evaluate(async () => {
		const registration = await navigator.serviceWorker.getRegistration();
		return new Promise<{ ready: boolean; error: string }>((resolve) => {
			const channel = new MessageChannel();
			channel.port1.onmessage = (event) => resolve(event.data);
			registration!.waiting!.postMessage({ type: 'BOOK_ACTIVATE' }, [channel.port2]);
		});
	});
	expect(refused).toMatchObject({ ready: false, error: 'incomplete' });
	await page.getByTestId('download-update').click();
	await expect(page.getByTestId('apply-update')).toBeVisible({ timeout: 120_000 });
	await expect(page.getByTestId('offline-status')).toContainText('ready offline');
	await context.setOffline(true);
	await page.getByTestId('apply-update').click();
	await expect(page.getByTestId('offline-update')).toHaveCount(0);
	await expect(page.getByTestId('offline-status')).toContainText('ready offline');
	await expect.poll(() => page.evaluate(() => (globalThis as typeof globalThis & { __pwa_test_bootstrap__?: number }).__pwa_test_bootstrap__)).toBe(revision);
	const names = await page.evaluate(() => caches.keys());
	expect(names).toContain(firstVersion);
	expect(names.filter((name) => name.startsWith('whats-llm-book:'))).toHaveLength(2);
	await page.goto('/chapter/rag/');
	await expect(page.locator('.prose')).toContainText('RAG');
	await page.reload();
	await expect(page.locator('.prose')).toContainText('RAG');
});


test('an old open tab rejects a new deployment shell while historical assets remain served', async ({ page, context, request }) => {
	await english(page);
	await page.goto('/library/');
	await expect(page.getByTestId('download-book')).toBeVisible();
	const oldBootstrap = await page.evaluate(() => (globalThis as typeof globalThis & { __pwa_test_bootstrap__?: number }).__pwa_test_bootstrap__);
	const revision = (await (await request.post('/__pwa_test_version')).json()).revision;
	expect(revision).not.toBe(oldBootstrap);
	// The old controller lists old hashed paths, but /index.html now boots a different module.
	await page.getByTestId('download-book').click();
	await expect(page.getByTestId('offline-status')).toContainText('website has a newer build');
	await expect(page.getByTestId('offline-status')).not.toContainText('ready offline');
	const markedReady = await page.evaluate(async () => {
		for (const name of await caches.keys()) {
			const cache = await caches.open(name);
			if (await cache.match('/__offline_book_complete__')) return true;
		}
		return false;
	});
	expect(markedReady).toBe(false);
	await page.getByRole('button', { name: 'Check for updates', exact: true }).click();
	await page.getByTestId('download-update').click();
	await expect(page.getByTestId('apply-update')).toBeVisible({ timeout: 120_000 });
	await context.setOffline(true);
	await page.getByTestId('apply-update').click();
	await expect(page.getByTestId('offline-status')).toContainText('ready offline');
	await expect.poll(() => page.evaluate(() => (globalThis as typeof globalThis & { __pwa_test_bootstrap__?: number }).__pwa_test_bootstrap__)).toBe(revision);
	await page.goto('/chapter/token-and-context/');
	await expect(page.locator('.prose')).toContainText('token');
	await page.reload();
	await expect(page.locator('.prose')).toContainText('token');
});
