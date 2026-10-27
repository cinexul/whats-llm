# LLM Learning Book app

The SvelteKit reader and Tauri desktop shell live here. See the [project README](../README.en.md) for setup, platform prerequisites, and content maintenance.

Project overviews: [简体中文](../README.md) · [日本語](../README.ja.md) · [English](../README.en.md). The [documentation index](../docs/README.md) separates current usage and maintenance guides from dated validation records.

```bash
npm ci
npm run dev
```

Run `npm run check`, `npm run content:check`, `npm run check:quiz`, and `npm run build` to validate changes. Rust tests run from `src-tauri/` with `cargo test --locked -p study-core`.

Chapter sources are in `src/lib/content/{zh,ja,en}/`. Preserve the quiz heading, stable question IDs, revision markers, A–D choice labels, and localized answer markers; the content and quiz commands validate the three editions together.

Use `npm run preview` after building to inspect reading, editing, backup, and offline behavior. Mobile layouts and dated screenshots are documented in [the mobile reader notes](../docs/mobile-reader.md).
