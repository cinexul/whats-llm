# What’s LLM application

The SvelteKit reader and Tauri desktop shell live here. See the [project README](../README.en.md) for setup, platform prerequisites, and content maintenance.

```bash
npm ci
npm run dev
```

Run `npm run check`, `npm test`, and `npm run build` before committing. Browser regressions run with `npm run test:e2e` after installing Playwright Chromium. Rust core tests run from `src-tauri/` with `cargo test --locked -p search-core -p study-core`.

Chapter sources are in `src/lib/content/{zh,ja,en}/`. Preserve the quiz heading, question numbering, A–D choice labels, and localized answer markers; the content tests validate all three editions together.

Mobile layouts and actual screenshots are documented in [the mobile reader notes](../docs/mobile-reader.md). To run browser tests against an already running production preview, set `PLAYWRIGHT_BASE_URL` to its URL; otherwise Playwright starts or reuses the development server.
