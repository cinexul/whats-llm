# What's LLM

> 语言 / Language： [简体中文](README.md) · **日本語** · [English](README.en.md)

**プログラミング未経験の読者**に向けた、やさしい解説書『What's LLM』のオフライン・デスクトップ電子書籍リーダーです。大規模言語モデルの仕組みを理解し、AI コーディングツールで自分のプロジェクトを作れるようになることを目指します。

本書は**中国語・日本語・英語の3言語**に対応し、アプリ内でワンクリック切り替えができます。各章の最後には**その場で解けて自動採点される小テスト**があり、重要な用語には英語が併記されています。

## 実行

```bash
cd app
npm install
npm run dev        # http://localhost:1420 を開く
```

- 静的ビルド：`npm run build`（出力は `app/build/`）
- デスクトップアプリ：`cargo tauri build`（Rust とシステムの WebView ライブラリが必要）

## 構成

- `app/` —— SvelteKit + Tauri アプリケーション
- `app/src/lib/content/{zh,ja,en}/` —— 各章の本文（中国語・日本語・英語）

## 技術スタック

Tauri 2（Rust シェル）+ SvelteKit（静的 SPA）。Markdown は `marked` + `shiki` で描画。フォントを同梱し、完全オフラインで動作します。
