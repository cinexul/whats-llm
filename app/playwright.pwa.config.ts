import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e-pwa',
	outputDir: './node_modules/.cache/playwright-pwa-results',
	workers: 1,
	timeout: 180_000,
	expect: { timeout: 15_000 },
	use: {
		baseURL: 'http://127.0.0.1:4175',
		viewport: { width: 390, height: 844 },
		launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'node e2e-pwa/server.mjs',
		url: 'http://127.0.0.1:4175',
		reuseExistingServer: false
	}
});
