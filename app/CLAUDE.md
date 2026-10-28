# LLM Learning Book — project guide

A web/PWA and offline desktop reader for *LLM Learning Book · 大模型学习手册*, a plain-language
introduction to large language models and to building your own projects with AI
coding tools, written for readers with no programming background. The book ships
as a trilingual edition (Chinese / Japanese / English) with one-click in-app
language switching.

## Stack
- Svelte 5 + SvelteKit (adapter-static, client-rendered SPA) + TypeScript, with a Tauri 2 Rust desktop shell
- Markdown rendered client-side with `marked` + `shiki` (github-dark theme)
- Fonts: Japanese and English use bundled @fontsource fonts (Noto Sans JP / Noto Serif JP / JetBrains Mono, woff2 only); Chinese uses the system's Chinese fonts (`:root:lang(zh)` in `app.css`), because Noto Sans JP lacks many simplified characters and uses Japanese glyph shapes
- On-device spaced repetition: FSRS (Anki's algorithm, `fsrs` crate) over an embedded SQLite store (`rusqlite`, bundled) — runs in Rust, no network

## Layout
- `src/lib/manifest.ts` — table of contents for every chapter, per language (zh / ja / en); data lives in `toc.json`. Adding or renaming a chapter means updating that and `content/`.
- `src/lib/content/{zh,ja,en}/*.md` — chapter bodies (slug.md). A chapter marked `draft: true` shows a placeholder.
- `src/lib/markdown.ts` — Markdown→HTML conversion and h2 outline extraction (heading ids feed search anchors and deep-links)
- `src/lib/search.ts` — full-text (keyword) search (loads & indexes all chapters of the current language on first search)
- `src/routes/chapter/[slug]/` — chapter page (right-side "on this page" outline, prev/next nav, `#anchor` deep-link scroll)
- `src/lib/quiz.ts` + `src/lib/Quiz.svelte` — parse and render interactive quizzes. `questionIdentity()` combines stable question IDs with assessment fingerprints while preserving registered legacy identities. `questionHash()` remains a compatibility primitive, not the sole question identity. Follow [quiz maintenance](../docs/quiz-maintenance.md) before changing questions or the registry.
- `src/lib/content.ts` — shared chapter-source loader (`?raw` glob), used by the chapter page, the review session and search.
- `src/lib/content-metadata.json` + `scripts/content-maintenance.mjs` — chapter revisions, review evidence, source dates, translation alignment, and drift checks. Follow [content maintenance](../docs/content-maintenance.md); do not refresh hashes or review dates without the corresponding editorial work.
- `src/lib/local-edits.ts` + `ChapterLocalEditor.svelte` + `ChapterDiff.svelte` — local body edits, original snapshots, conflict detection, and diffs. Official quizzes and book-wide search continue to use bundled source.
- `src/routes/library/` + `src/lib/backup*.ts` — offline controls and validated, versioned backup export/import. See [backup rules](../docs/portable-learning-data.md).
- `src/routes/learn/` + `src/lib/learning-paths*.ts` and `src/routes/labs/` + `src/lib/labs/` — three-language paths and local teaching simulations.
- `src/lib/offline-cache.ts` + `src/service-worker.ts` — explicit full-book downloads and versioned offline caches for production web builds; disabled during development and in Tauri.
- `src-tauri/crates/study-core/` — reusable Rust core for learning data: embedded SQLite schema (per-question `cards`, a `reviews` event log, `read_progress`, `kv`) + FSRS scheduling (correct→Good / wrong→Again) + queries/stats. Independent of the Tauri tree, so it `cargo test`s on its own. Exposes an opaque `Store` so the shell never touches `rusqlite` types.
- `src/lib/study.ts` + `src-tauri/src/lib.rs` (`study_*` commands) — the frontend learning-data layer. Under Tauri it `invoke`s the Rust `Store` (SQLite + FSRS, the source of truth); in the browser preview it falls back to localStorage + a simple JS scheduler. Holds the reactive `cardsStore` / `readStore` and the helpers (`masteryOf`, `dueCards`, `chapterSummary`, `streakFromReviews`, …).
- `src/routes/review/` — Anki-style cross-chapter review session: pulls all due question-cards, loads + parses each chapter's quiz, matches by `qhash`, and presents them one flashcard at a time.
- `src/routes/progress/` — learning dashboard with reading, quiz, mastery, historical answer accuracy, streak, due cards, review heatmap, forecast, and per-chapter status. Historical answer accuracy is not predicted retention.
- `src/lib/annotations.ts` + `src-tauri/src/lib.rs` — highlight / note feature (saved to `annotations.json` beside the learning DB under Tauri, localStorage in the browser)
- `src/app.css` — light/dark palette via `data-theme`

## Persistence (where user data lives)
- **Learning data** (per-question cards, review log, read progress) lives in an
  **embedded SQLite DB** (`whatsllm.db`) managed by `study-core`. Location is chosen
  by a portable-mode sentinel in `data_dir` (`src-tauri/src/lib.rs`):
  - **Portable / no-install build:** if a `data/` folder sits next to the exe, the DB
    goes in `data/whatsllm.db` — so all progress travels with the folder. Ship the
    portable zip with an empty `data/` to opt in automatically.
  - **Installed build:** otherwise the DB goes in the OS app-data dir
    (`app_data_dir()`, per identifier `com.whatsllm.reader`) — always writable, never
    exposed next to the app.
  - On first run, `study.ts` migrates the legacy `read-chapters` localStorage key into
    SQLite once (old per-chapter `quiz-srs` is not migrated — it can't map to
    per-question cards).
- **Annotations** use `annotations.json` in the same folder as `whatsllm.db`
  (`data/` for the portable build, app-data for the installed build), with a
  localStorage mirror and recovery snapshot. Older builds wrote it next to the
  executable; that file is still read until the first save. File-write failures must
  remain visible.
- **Local chapter edits** use IndexedDB in both browser and Tauri. Saves, resets,
  and backup imports share a Web Lock. A stale editor must not overwrite a newer
  revision. See [local editing](../docs/local-chapter-edits.md).
- **UI settings** (language, theme, font scales) stay in **localStorage** — small,
  per-machine. Explicit learning backups include these preferences as well as
  reading positions, path checkpoints, and saved chapter edits.
- **Browser preview** (`npm run dev`) has no Rust backend, so `study.ts` falls back to
  localStorage + a simple JS scheduler (degraded) — the
  shipped app always uses Rust FSRS + SQLite.

### Verifying the learning core
- From `src-tauri/`, `cargo test --locked -p study-core` — schema, CRUD, FSRS interval growth/lapse, the full
  record→reschedule→log round-trip, and the `Store` facade. Run this after touching
  scheduling or the schema.
- The Tauri glue (`study_*` commands) is a thin pass-through over the tested `Store`;
  it only compiles as part of the full app (`npm run tauri -- dev` or `npm run tauri -- build`, from `app/`).
- `rusqlite` is pinned to 0.32 (newer pulls `libsqlite3-sys` whose build.rs uses the
  still-unstable `cfg_select!`, which won't build on stable). The `fsrs` crate is light
  (ndarray, not burn).

## Conventions
- Instructional chapters end with a summary and six quiz questions; only questions with a scored answer feed spaced repetition. Preserve localized quiz headings, stable IDs, revision markers, choices, and answer syntax. Key terms get an English gloss on first use.
- Chinese and Japanese text (book, UI strings, docs, comments): no spaces between CJK and English letters or digits (“用AI写代码”, “第27章”); full-width punctuation; Chinese uses “” quotes. Write naturally and plainly, without slogan-like or AI-sounding phrasing.
- Quizzes: options of similar length, no bold inside options, plausible distractors, varied answer letters.
- Three accuracy rules run through the whole book: (1) the model has no built-in cross-conversation memory — any "memory" is product-layer context re-injected each turn; (2) "English uses fewer tokens than Chinese" is only a rough heuristic, not a law; (3) never hard-code where AI coding tools run (terminal / IDE / web / cloud) — defer product specifics to official docs.

## Commands
Run from `app/` with a Node version supported by `package.json` (CI uses Node 24):

- `npm ci` — install locked dependencies
- `npm run dev` — dev server (http://localhost:1420)
- `npm run build` — static site to `build/`
- `npm run preview` — preview the build (http://localhost:4173)
- `npm run tauri -- dev` / `npm run tauri -- build` — run the desktop app / build its configured Windows NSIS installer with platform prerequisites
- GitHub `release.yml` builds both Windows x64 packages. It uses `tauri build --no-bundle`, packages the executable plus DLLs and `data/` as a portable ZIP and tests extracted startup, then runs `.github/scripts/windows-installer.ps1` to bundle the same runtime DLLs into an NSIS installer and verify silent installation and installed startup with the app-data SQLite path. With a version tag both go into a Release draft; a manual run with an empty tag only uploads Actions artifacts. See [Windows desktop edition](../docs/windows-portable.md); WebView-backed data still requires an explicit backup when moving computers.
- `npm run check`, `npm run content:check`, `npm run check:quiz` — type, content, and quiz-registry checks
- Build and preview to verify reading, editing, backup, and offline interactions; static checks alone do not verify these flows

See the [documentation index](../docs/README.md) for guides and dated validation records. Previous test counts are not evidence that a new change passes.

## Tests
Automated unit and browser tests are kept locally and are not part of the repository; `.gitignore` excludes `*.test.ts`, `e2e/` and the Vitest/Playwright configs.
