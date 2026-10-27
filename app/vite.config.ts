import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// fontsource同时提供woff2和woff。现代浏览器和WebView只用woff2，
// 去掉woff引用，构建产物、离线书包和桌面程序都能小一半左右。
function woff2Only(): Plugin {
	return {
		name: 'woff2-only',
		enforce: 'pre',
		transform(code, id) {
			if (!/[\\/]@fontsource[\\/].+\.css(\?|$)/.test(id)) return null;
			return code.replace(/,\s*url\([^)]*\.woff\) format\('woff'\)/g, '');
		}
	};
}

// 让生成的SPA基础页面与$service-worker中的版本保持一致。
// 在实际响应中写入版本标记，避免把新部署的index.html与
// 仍在运行的旧worker保留的带哈希名称的资源混用。
function offlineAdapter() {
	const staticAdapter = adapter({ fallback: 'index.html' });
	return {
		...staticAdapter,
		async adapt(builder: Parameters<typeof staticAdapter.adapt>[0]) {
			await staticAdapter.adapt(builder);
			const shell = path.resolve('build/index.html');
			const stamp = `<meta name="offline-book-build" content="${encodeURIComponent(builder.config.kit.version.name)}">`;
			writeFileSync(shell, readFileSync(shell, 'utf8').replace('<head>', `<head>\n\t\t${stamp}`));
		}
	};
}

export default defineConfig({
	// devサーバーは固定ポート(他プロジェクトのVite既定5173との衝突を避ける)。
	// 変更時はtauri.conf.jsonのdevUrlも合わせること
	server: {
		port: 1420,
		strictPort: true
	},
	plugins: [
		woff2Only(),
		sveltekit({
			// 由代码主动注册，确保Tauri桌面端和开发环境不会注册service worker。
			serviceWorker: { register: false },
			compilerOptions: {
				// 除依赖库外，项目强制使用runes模式；Svelte 6中可移除此设置。
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// SPA構成: 全ページをクライアント側で描画し、本文をHTMLとして書き出さない
			adapter: offlineAdapter()
		})
	]
});
