import { defineConfig } from '@playwright/test';

// 默认测正式构建（先运行npm run build）；设了PLAYWRIGHT_BASE_URL就测那个地址
const previewURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
	testDir: './tests/e2e',
	workers: 1,
	use: {
		baseURL: previewURL ?? 'http://127.0.0.1:4173',
		// 没选过语言时界面跟随浏览器语言；测试按中文读者来写
		locale: 'zh-CN',
		launchOptions: {
			executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
		}
	},
	webServer: previewURL ? undefined : {
		command: 'npm run preview',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI
	}
});
