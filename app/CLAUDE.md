# What's LLM — project guide

An offline desktop e-book reader for the book *What's LLM*, a plain-language
introduction to large language models and to building your own projects with AI
coding tools, written for readers with no programming background. The book ships
as a trilingual edition (Chinese / Japanese / English) with one-click in-app
language switching.

## Stack
- Tauri 2 (Rust shell, minimal logic) + SvelteKit (adapter-static, prerendered SPA)
- Markdown rendered client-side with `marked` + `shiki` (github-dark theme)
- Fonts bundled via @fontsource (Noto Sans JP / Noto Serif JP / JetBrains Mono) — fully offline
- On-device semantic search: EmbeddingGemma-300m (4-bit ONNX) run in Rust via fastembed/ONNX Runtime — no network, no Ollama
- On-device spaced repetition: FSRS (Anki's algorithm, `fsrs` crate) over an embedded SQLite store (`rusqlite`, bundled) — runs in Rust, no network

## Layout
- `src/lib/manifest.ts` — table of contents for every chapter, per language (zh / ja / en); data lives in `toc.json`. Adding or renaming a chapter means updating that and `content/`.
- `src/lib/content/{zh,ja,en}/*.md` — chapter bodies (slug.md). A chapter marked `draft: true` shows a placeholder.
- `src/lib/markdown.ts` — Markdown→HTML conversion and h2 outline extraction (heading ids feed search anchors and deep-links)
- `src/lib/decode.ts` — restores chapter text embedded as deflate+Base64 (paired with the content-encode plugin in `vite.config.ts`)
- `src/lib/search.ts` — full-text (keyword) search (decodes & indexes all chapters on first search)
- `src/lib/semantic.ts` + `src-tauri/src/lib.rs` (`semantic_search`) — meaning-based search; calls into the Rust core, Tauri-only (falls back to keyword search in the browser)
- `src-tauri/crates/search-core/` — reusable Rust core: chunking, index format (bincode), cosine ranking, and embedding (behind the `embed` feature). Shared by the app and the index builder (and any future server).
- `src-tauri/crates/build-index/` — offline tool that chunks + embeds the book into `resources/search-index/<lang>.idx`.
- `src/routes/chapter/[slug]/` — chapter page (right-side "on this page" outline, prev/next nav, `#anchor` deep-link scroll)
- `src/lib/quiz.ts` + `src/lib/Quiz.svelte` — parse each chapter's quiz out of the Markdown and render it as an interactive, self-grading quiz. Each multiple-choice question is its own spaced-repetition card; `questionHash()` (a stable djb2 over the prompt) is the per-question id, used both when recording an answer and when matching due cards back to their question.
- `src/lib/content.ts` — shared chapter-source loader (`?enc` glob + decode), used by the chapter page and the review session.
- `src-tauri/crates/study-core/` — reusable Rust core for learning data: embedded SQLite schema (per-question `cards`, a `reviews` event log, `read_progress`, `kv`) + FSRS scheduling (correct→Good / wrong→Again) + queries/stats. Independent of the Tauri/ONNX tree, so it `cargo test`s on its own. Exposes an opaque `Store` so the shell never touches `rusqlite` types.
- `src/lib/study.ts` + `src-tauri/src/lib.rs` (`study_*` commands) — the frontend learning-data layer. Under Tauri it `invoke`s the Rust `Store` (SQLite + FSRS, the source of truth); in the browser preview it falls back to localStorage + a simple JS scheduler. Holds the reactive `cardsStore` / `readStore` and the helpers (`masteryOf`, `dueCards`, `chapterSummary`, `streakFromReviews`, …).
- `src/routes/review/` — Anki-style cross-chapter review session: pulls all due question-cards, loads + parses each chapter's quiz, matches by `qhash`, and presents them one flashcard at a time.
- `src/routes/progress/` — Insight dashboard (read / quizzed / mastered / retention / streak / due tiles, a review heatmap, a 14-day forecast, and per-chapter status). Linked from the topbar (Review carries the due-count badge); the sidebar shows a per-chapter mastery/due dot.
- `src/lib/annotations.ts` + `src-tauri/src/lib.rs` — highlight / note feature (saved to `annotations.json` next to the executable under Tauri, localStorage in the browser)
- `src/app.css` — light/dark palette via `data-theme`

## Persistence (where user data lives)
- **Learning data** (per-question cards, review log, read progress) lives in an
  **embedded SQLite DB** (`whatsllm.db`) managed by `study-core`. Location is chosen
  by a portable-mode sentinel in `study_db_path` (`src-tauri/src/lib.rs`):
  - **Portable / no-install build:** if a `data/` folder sits next to the exe, the DB
    goes in `data/whatsllm.db` — so all progress travels with the folder. Ship the
    portable zip with an empty `data/` to opt in automatically.
  - **Installed build:** otherwise the DB goes in the OS app-data dir
    (`app_data_dir()`, per identifier `com.whatsllm.reader`) — always writable, never
    exposed next to the app.
  - On first run, `study.ts` migrates the legacy `read-chapters` localStorage key into
    SQLite once (old per-chapter `quiz-srs` is not migrated — it can't map to
    per-question cards).
- **Annotations** still use `annotations.json` next to the exe (with a localStorage
  mirror) — same portable/installed behaviour as above via write-or-fallback.
- **UI settings** (language, theme, font scales) stay in **localStorage** — small,
  per-machine, and intentionally not part of the portable data set.
- **Browser preview** (`npm run dev`) has no Rust backend, so `study.ts` falls back to
  localStorage + a simple JS scheduler (degraded, like keyword-only search) — the
  shipped app always uses Rust FSRS + SQLite.

### Verifying the learning core
- `cargo test -p study-core` — schema, CRUD, FSRS interval growth/lapse, the full
  record→reschedule→log round-trip, and the `Store` facade. Run this after touching
  scheduling or the schema.
- The Tauri glue (`study_*` commands) is a thin pass-through over the tested `Store`;
  it only compiles as part of the full app (`cargo tauri dev/build`).
- `rusqlite` is pinned to 0.32 (newer pulls `libsqlite3-sys` whose build.rs uses the
  still-unstable `cfg_select!`, which won't build on stable). The `fsrs` crate is light
  (ndarray, not burn).

## Conventions
- Each chapter ends with a "summary" and an interactive 6-question quiz that grades itself and feeds the spaced-repetition scheduler; key terms get an English gloss on first use.
- Three accuracy rules run through the whole book: (1) the model has no built-in cross-conversation memory — any "memory" is product-layer context re-injected each turn; (2) "English uses fewer tokens than Chinese" is only a rough heuristic, not a law; (3) never hard-code where AI coding tools run (terminal / IDE / web / cloud) — defer product specifics to official docs.

## Commands
- `npm run dev` — dev server (http://localhost:1420)
- `npm run build` — static site to `build/`
- `npm run preview` — preview the build (http://localhost:4173)
- `cargo tauri dev` / `cargo tauri build` — run the app / build installers

## Semantic search setup (one-time)
The embedding model and the per-language indices are large and reproducible, so
they are not committed (see `.gitignore`). Before running the app with semantic
search:
1. `./scripts/fetch-model.sh` — download EmbeddingGemma into `src-tauri/resources/model/` (set `HF_ENDPOINT=https://hf-mirror.com` for a mirror).
2. `cargo run -p build-index --release` — chunk + embed the book into `src-tauri/resources/search-index/`.
3. `cargo tauri dev` — the `semantic_search` command loads both from bundled resources on first query.

Re-run step 2 whenever chapter text changes. The browser preview (`npm run dev`)
has no model, so it shows keyword search only.
