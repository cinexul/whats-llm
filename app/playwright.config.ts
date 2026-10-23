import { defineConfig } from '@playwright/test';

const previewURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
	testDir: './e2e',
	workers: 1,
	use: {
		baseURL: previewURL ?? 'http://127.0.0.1:1420',
		launchOptions: {
			executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
		}
	},
	webServer: previewURL ? undefined : {
		command: 'npm run dev -- --host 127.0.0.1',
		url: 'http://127.0.0.1:1420',
		reuseExistingServer: !process.env.CI
	}
});
