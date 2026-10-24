# What's LLM

> 语言 / Language： [简体中文](README.md) · [日本語](README.ja.md) · **English**

A trilingual reading and practice app for ***What's LLM***, available on the web, as a mobile PWA, and as an offline desktop reader — a plain-language guide to
large language models, and to building your own projects with AI coding tools,
written for people with **no programming background**.

The book is **trilingual (中文 / 日本語 / English)** with one-click in-app language switching.
The 40 instructional chapters include **interactive, self-scoring quizzes**, and key terms carry
an English gloss.

## Run it

Use Node.js 24.x, at least 24.15.0 (see `app/package.json` for other compatible versions), and npm. Rust core tests use the stable toolchain.

```bash
cd app
npm ci
npm run dev        # open http://localhost:1420
```

- Static build: `npm run build` (output in `app/build/`)
- Production preview: run `npm run preview` after building (`http://127.0.0.1:4173`, including offline features)
- Desktop app: `npm run tauri -- build` (requires Rust + system WebView libraries)

## Layout

- `app/src/routes/` and `app/src/lib/*.svelte` — Svelte pages and components
- `app/src/lib/` — TypeScript application logic, localized copy, and content metadata
- `app/src/lib/content/{zh,ja,en}/` — the book chapters, in Chinese, Japanese, and English
- `app/src-tauri/` — the Tauri desktop shell and Rust search/study cores
- `app/scripts/` — content checks, static preview, and optional model download tools
- `docs/` — usage guides, maintenance instructions, and dated validation records; start with the [documentation index](docs/README.md)
- `.github/workflows/` — GitHub checks and release configuration, explained below

Lockfiles and build configuration support reproducible installation. Local outputs such as `node_modules/`, `build/`, `.svelte-kit/`, and Rust `target/` are ignored by Git.

## Tech

Svelte 5 + SvelteKit (static SPA) + TypeScript, with a Tauri 2 / Rust desktop shell; Markdown rendered with `marked` +
`shiki`. Desktop builds bundle the book and fonts; web readers can explicitly download the complete book for offline use.

GitHub Languages counts source bytes, not framework usage or compiled output. TypeScript holds application logic and trilingual teaching data; Svelte provides pages and components. See [Linguist’s rules](https://github.com/github-linguist/linguist/blob/main/docs/how-linguist-works.md).

## GitHub automation

A workflow is a list of tasks GitHub runs on specified events. It is not required to launch the app:

| File | Trigger | Purpose |
| --- | --- | --- |
| [`check.yml`](.github/workflows/check.yml) | Pushes to `main` and pull requests | Type, content, and quiz-registry checks; production build and Rust core tests. Does not publish the app. |
| [`content-maintenance.yml`](.github/workflows/content-maintenance.yml) | Mondays at 07:17 UTC, or manually | Reports overdue editorial reviews and saves source-link diagnostics. Does not edit chapters or renew review dates. |
| [`release.yml`](.github/workflows/release.yml) | Pushing a `v*` tag, or manually supplying a version | Builds a Windows x64 portable ZIP, tests extracted startup, and uploads an Actions artifact and GitHub Release **draft** for manual review and publication. |

Ordinary `main` pushes do not trigger a release; no workflow currently deploys the website. Failed source-link checks need human review.

## Reading and practice

- **Learning paths:** a conceptual introduction, a sourced work report, and a first website project, with practical deliverables and saved self-checks.
- **Interactive labs:** context budgeting and compaction, RAG evidence, and agent permissions. Local teaching simulations; no API required.
- **My library:** offline downloads, PWA installation and updates, plus validated backup export, preview and merge import.
- **Local edits and diff:** edit chapter bodies, preview Markdown, and compare additions/deletions. Contents badges and My chapter edits make changes easy to find; backups preserve edits and original baselines. See the [editing guide](docs/local-chapter-edits.md).
- **Paragraph resume:** separate positions per language, resilient to font and screen changes. Explicit section links take priority.
- **Mistake practice:** review by topic or chapter while preserving history; stable question identity is separate from assessment revisions.
- **Content maintenance:** chapter revision, review and source information, with checks for unacknowledged changes and translation alignment.

Find these features on the home page and above the contents. Browse the [documentation index](docs/README.md), [PWA deployment guide](docs/pwa.md), and [content maintenance guide](docs/content-maintenance.md). The [feature and validation record](docs/learning-book.md) preserves screenshots and results for that revision.

## Content revision: 2026-10-22

Updated all three editions with practical tool guides, product selection, Skills/MCP, RAG, local/cloud data flows, billing, and permissions. Corrected oversimplifications about context, memorization, and embedding privacy; improved translations and quiz answer distribution. Revised chapters include primary sources and verification dates. See the [revision and maintenance record](docs/content-review-2026-10-22.md).

## Verification

From `app/`:

```bash
npm run check
npm run content:check
npm run check:quiz
npm run build
```

These commands validate types, content registrations, and the build; they do not replace interactive acceptance checks. The Rust core tests need neither a desktop WebView nor an embedding model. In a separate terminal, start from the repository root:

```bash
cd app/src-tauri
cargo test --locked -p search-core -p study-core
```

Browser mode stores study data in localStorage; desktop mode uses SQLite/FSRS. Both use IndexedDB for local chapter edits. GitHub releases build a [Windows x64 portable ZIP](docs/windows-portable.md) containing the executable, DLLs, and `data/` folder; Microsoft Edge WebView2 Runtime is required. Local `tauri build` can still create the configured NSIS installer. Semantic-search weights and indices are not committed; without them, search falls back to full-text matching. Web tests do not validate a desktop application.

## Mobile reading

A responsive mobile reader with a paper-inspired design, contents drawer, bottom navigation, paragraph resume, touch annotations, and trilingual reading settings. Deploy the production build over HTTPS, then use My library to download offline content and your browser to add the app to the home screen. Offline caching is disabled on the development server. See the [screenshots and validation notes](docs/mobile-reader.md).
