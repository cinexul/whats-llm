import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import path from 'node:path';

// 章本文(.md)を deflate + Base64 で埋め込むプラグイン。
// ビルド成果物(=配布する exe)の中に本文の平文を残さないための簡易的な難読化で、
// 表示時にメモリ上で復元する。完全な秘匿ではない点に注意。
function contentEncode(): Plugin {
	let root = process.cwd();
	return {
		name: 'content-encode',
		enforce: 'pre',
		configResolved(config) {
			root = config.root;
		},
		load(id) {
			if (!id.includes('?enc')) return null;
			let file = id.split('?')[0];
			if (!file.endsWith('.md')) return null;
			// id がディスク上の絶対パスならそのまま、プロジェクト基準(/src/...)なら root と結合する。
			// (ツールチェーンによって glob の id が絶対パス/ルート相対のどちらにもなり得るため)
			if (!existsSync(file) && file.startsWith('/') && !/^[A-Za-z]:/.test(file)) {
				file = path.join(root, file);
			}
			const raw = readFileSync(file, 'utf8');
			const b64 = deflateSync(Buffer.from(raw, 'utf8')).toString('base64');
			return `export default ${JSON.stringify(b64)};`;
		}
	};
}

export default defineConfig({
	// dev サーバーは固定ポート(他プロジェクトの Vite 既定 5173 との衝突を避ける)。
	// 変更時は tauri.conf.json の devUrl も合わせること
	server: {
		port: 1420,
		strictPort: true
	},
	plugins: [
		contentEncode(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// SPA 構成: 全ページをクライアント側で描画し、本文を HTML として書き出さない
			adapter: adapter({ fallback: 'index.html' })
		})
	]
});
