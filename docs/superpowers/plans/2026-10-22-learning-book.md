# Portable Learning Book Implementation Plan

**Goal:** Deliver all six approved improvements while preserving existing reader data and three-language mobile usability.

**Architecture:** Independent feature modules and routes extend the static SvelteKit app. The primary agent integrates shared reader surfaces; feature agents own non-overlapping files. Native persistence extends the existing study-core abstraction.

**Tech Stack:** Svelte 5, SvelteKit static SPA, TypeScript, browser service workers/localStorage, Tauri 2, Rust SQLite, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-22-learning-book-design.md`

## Global constraints

- Preserve Chinese, Japanese, English, paper styling, desktop and mobile readability.
- Preserve existing data; validate imports before mutation; never claim a failed write succeeded.
- No required cloud/API service. PWA excludes native Tauri runtime.
- All agents share this checkout; do not edit another owner's files or commit/push.

## Review focus

- Old quiz IDs and content updates must not silently erase history or reuse changed answer mastery.
- Malformed, duplicated, future-version or oversized backup data must be rejected before mutation.
- Offline first navigation to an unread chapter and language switch must work after a complete download.
- Hash links override saved reading position; rapid navigation must not save the wrong chapter.
- Mobile large fonts, keyboard interaction, and empty learning data must remain usable.

## Tasks

- [x] Content metadata: structured revision/source data, localized chapter panel, drift checks and maintenance guide. Owner: content agent.
- [x] Offline PWA: worker, manifest/icons, install/download/update component, production browser coverage. Owner: PWA agent.
- [x] Portable backup: versioned schema, preview/merge, browser/native persistence, library page and meaningful tests. Owner: backup agent.
- [x] Quiz continuity and feedback: stable IDs/revisions, legacy compatibility, mistakes/topic practice, accurate metric copy and tests. Owner: quiz agent.
- [x] Interactive lessons: context, retrieval evidence and scoped-permission simulations, localized route and tests. Owner: labs agent.
- [x] Learning paths: three goal-oriented paths, chapter links, practical checkpoints, local completion and tests. Owner: paths agent.
- [x] Reader integration: paragraph position capture/restoration, shared navigation, chapter metadata/lab links, homepage entry points. Owner: primary.
- [x] Integration review: verify feature boundaries and all data paths, inspect browser screenshots and repair findings.
- [x] Release preparation: update documentation and run checks/unit/build/browser/Rust validation. The containing commit records the release; the final task response records the direct-main push and remote-SHA verification.

## Progress

Implementation starting from `400656a98dc41f779fade95d38b0a1d7ebfbff06`.

All six feature modules and shared reader integration are complete. Independent integration, backup and localization reviews were resolved, including mixed-version offline shells, concurrent cache cleanup, original recovery snapshots after rollback failure, pending annotation exports, unsupported resume records, and the quiz wording-revision regression. The local production preview now serves the exact stamped static artifact.

Final verification on 2026-10-22: 263 unit tests, 42 browser tests against the production preview, 3 real-build PWA tests, and 19 Rust core tests passed. Svelte reported 0 errors and 0 warnings; content and quiz registries passed. Production build and 21 trilingual 320px/150%-type layout checks passed. Six actual screenshots and platform-specific validation limits are recorded in `docs/learning-book.md`.
