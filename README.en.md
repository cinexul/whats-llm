# What's LLM

> 语言 / Language： [简体中文](README.md) · [日本語](README.ja.md) · **English**

An offline desktop e-book reader for ***What's LLM*** — a plain-language guide to
large language models, and to building your own projects with AI coding tools,
written for people with **no programming background**.

The book is **trilingual (中文 / 日本語 / English)** with one-click in-app language switching.
Every chapter ends with an **interactive, self-scoring quiz**, and key terms carry
an English gloss.

## Run it

```bash
cd app
npm install
npm run dev        # open http://localhost:1420
```

- Static build: `npm run build` (output in `app/build/`)
- Desktop app: `cargo tauri build` (requires Rust + system WebView libraries)

## Layout

- `app/` — the SvelteKit + Tauri application
- `app/src/lib/content/{zh,ja,en}/` — the book chapters, in Chinese, Japanese, and English

## Tech

Tauri 2 (Rust shell) + SvelteKit (static SPA); Markdown rendered with `marked` +
`shiki`; fonts bundled for fully offline use.
