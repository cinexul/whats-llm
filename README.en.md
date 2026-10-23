# What's LLM

> 语言 / Language： [简体中文](README.md) · [日本語](README.ja.md) · **English**

A trilingual reading and practice app for ***What's LLM***, available on the web, as a mobile PWA, and as an offline desktop reader — a plain-language guide to
large language models, and to building your own projects with AI coding tools,
written for people with **no programming background**.

The book is **trilingual (中文 / 日本語 / English)** with one-click in-app language switching.
The 40 instructional chapters include **interactive, self-scoring quizzes**, and key terms carry
an English gloss.

## Run it

Use Node.js 24.15+ (see `app/package.json` for compatible versions) and npm. Rust core tests use the stable toolchain.

```bash
cd app
npm ci
npm run dev        # open http://localhost:1420
```

- Static build: `npm run build` (output in `app/build/`)
- Production preview: run `npm run preview` after building (`http://127.0.0.1:4173`, including offline features)
- Desktop app: `npm run tauri -- build` (requires Rust + system WebView libraries)

## Layout

- `app/` — the SvelteKit + Tauri application
- `app/src/lib/content/{zh,ja,en}/` — the book chapters, in Chinese, Japanese, and English

## Tech

Tauri 2 (Rust shell) + SvelteKit (static SPA); Markdown rendered with `marked` +
`shiki`. Desktop builds bundle the book and fonts; web readers can explicitly download the complete book for offline use.

## Reading and practice

- **Learning paths:** a conceptual introduction, a sourced work report, and a first website project, with practical deliverables and saved self-checks.
- **Interactive labs:** context budgeting and compaction, RAG evidence, and agent permissions. Local teaching simulations; no API required.
- **My library:** offline downloads, PWA installation and updates, plus validated backup export, preview and merge import.
- **Local edits and diff:** edit chapter bodies, preview Markdown, and compare additions/deletions. Contents badges and My chapter edits make changes easy to find; backups preserve edits and original baselines. See the [editing guide](docs/local-chapter-edits.md).
- **Paragraph resume:** separate positions per language, resilient to font and screen changes. Explicit section links take priority.
- **Mistake practice:** review by topic or chapter while preserving history; stable question identity is separate from assessment revisions.
- **Content maintenance:** chapter revision, review and source information, with checks for unacknowledged changes and translation alignment.

Find these features on the home page and above the contents. See the [feature and validation record](docs/learning-book.md), [PWA deployment guide](docs/pwa.md), and [content maintenance guide](docs/content-maintenance.md).

## Content revision: 2026-10-22

Updated all three editions with practical tool guides, product selection, Skills/MCP, RAG, local/cloud data flows, billing, and permissions. Corrected oversimplifications about context, memorization, and embedding privacy; improved translations and quiz answer distribution. Revised chapters include primary sources and verification dates. See the [revision and maintenance record](docs/content-review-2026-10-22.md).

## Verification

From `app/`:

```bash
npm run check
npm run content:check
npm run check:quiz
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:e2e:pwa  # uses the production build above to test download, offline use and updates
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use an existing Chromium installation. The Rust core tests need neither a desktop WebView nor an embedding model:

```bash
cd app/src-tauri
cargo test --locked -p search-core -p study-core
```

Browser mode stores study data in localStorage; desktop mode uses SQLite/FSRS. Both use IndexedDB for local chapter edits. The configured desktop package target is Windows NSIS and requires the appropriate Tauri prerequisites. Semantic-search weights and indices are not committed; without them, search falls back to full-text matching. Web tests do not validate a desktop installer.

## Mobile reading

A responsive mobile reader with a paper-inspired design, contents drawer, bottom navigation, paragraph resume, touch annotations, and trilingual reading settings. Deploy the production build over HTTPS, then use My library to download offline content and your browser to add the app to the home screen. Offline caching is disabled on the development server. See the [screenshots and validation notes](docs/mobile-reader.md).
