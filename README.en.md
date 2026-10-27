# LLM Learning Book · 大模型学习手册

> 语言 / Language：[简体中文](README.md) · [日本語](README.ja.md) · **English**

A plain-language book for people with **no programming background**: it explains how large language models work, then walks you through building your own projects with AI coding tools. This repository is the book's reading and practice app, which runs on the web, as a mobile PWA, and as an offline desktop reader.

The book comes in Chinese, Japanese and English, and you can switch languages at any time. Each of the 40 teaching chapters ends with a quiz you can answer right there and have scored, and key terms carry an English gloss.

## Run it

You need Node.js 24.x (24.15.0 or later; see `app/package.json` for other supported versions) and npm.

```bash
cd app
npm ci
npm run dev        # open http://localhost:1420
```

- Static build: `npm run build`, output in `app/build/`
- Preview the production build: `npm run preview` after building (`http://127.0.0.1:4173`, offline features included)
- Desktop app: `npm run tauri -- build`, which needs Rust and the system WebView libraries

## Layout

- `app/src/routes/`, `app/src/lib/*.svelte`: pages and components
- `app/src/lib/`: app logic, UI text in three languages, and content metadata
- `app/src/lib/content/{zh,ja,en}/`: the chapters
- `app/src-tauri/`: the Tauri desktop shell and the Rust study-data module
- `app/scripts/`: content checks and the static preview server
- `docs/`: usage and maintenance notes, starting from the [documentation index](docs/README.md)
- `.github/workflows/`: GitHub checks and releases

## Tech

Svelte 5 + SvelteKit (static SPA) + TypeScript, with a Tauri 2 / Rust desktop shell. Markdown is rendered with `marked` and `shiki`. The desktop app ships with the book and fonts; on the web you can download the whole book from My library and read offline.

## GitHub automation

| File | When it runs | What it does |
| --- | --- | --- |
| [`check.yml`](.github/workflows/check.yml) | Pushes to `main` and pull requests | Type, content and quiz-registry checks, production build, Rust tests |
| [`content-maintenance.yml`](.github/workflows/content-maintenance.yml) | Mondays 07:17 UTC, or manually | Lists chapters due for review and checks source links. It never edits chapters. |
| [`release.yml`](.github/workflows/release.yml) | Pushing a `v*` tag, or manually with a version | Builds a Windows x64 portable ZIP; the `installer` option also builds and tests an installer. Results go into a GitHub Release draft for you to check and publish. |

## Features

- **Learning paths:** a concepts primer, a sourced work report, and a first web page, each with a clear deliverable and saved self-checks.
- **Interactive labs:** context budgets and compaction, RAG evidence, and agent permissions. All local simulations; no API needed.
- **My library:** offline download, PWA install and updates, and exporting or merging your learning data.
- **Local edits and diffs:** edit a chapter, preview the Markdown, and see what changed. See the [editing guide](docs/local-chapter-edits.md).
- **Paragraph resume:** remembers where you stopped, separately for each language.
- **Review and mistakes:** spaced review of quiz questions, plus practice on the ones you got wrong, by topic or chapter.
- **Content maintenance:** every chapter shows its revision, review and sources, and checks keep the three editions aligned. Revision records are listed in the [documentation index](docs/README.md).

## Verification

From `app/`:

```bash
npm run check
npm run content:check
npm run check:quiz
npm run build
```

These only cover types, content registration and the build, so still click through the app to check the interface. The Rust study-data tests run from the repository root:

```bash
cd app/src-tauri
cargo test --locked -p study-core
```

The browser version keeps study data in localStorage and the desktop version uses SQLite; local chapter edits live in IndexedDB in both. The [Windows portable ZIP](docs/windows-portable.md) built by the release workflow contains the program, its DLLs and a `data/` folder, and needs Microsoft Edge WebView2 Runtime.

## Mobile

The mobile layout has a contents drawer, bottom navigation, paragraph resume, touch-friendly notes and reading settings for all three languages. Once the production build is served over HTTPS, download the offline book from My library and add the app to your home screen from the browser. The development server doesn't enable offline caching. Screenshots are in the [mobile reader notes](docs/mobile-reader.md).

## License

- Code: [MIT](LICENSE)
- Book text (`app/src/lib/content/`) and the documents and screenshots in `docs/`: [CC BY-SA 4.0](LICENSE-CONTENT). If you share or adapt them, credit the author and release your version under the same license.
