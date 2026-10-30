# LLM Learning Book · 大模型学习手册 · やさしいLLM入門

> 语言 / Language：[简体中文](README.md) · [日本語](README.ja.md) · **English**

I studied humanities and became a programmer after graduating, so I know firsthand where people without a technical background tend to get stuck. I wrote this book for people who have never programmed. If you've never written a line of code, that's fine.

The first half explains what large language models actually are: how they read a sentence, why they sometimes say wrong things with complete confidence, and how the AI products out there differ. The second half has you build six small projects with AI coding tools like Claude Code and Codex, starting with a personal website. The last chapter tells how this book and this app were made; I wrote most of the code together with AI.

The book comes in Chinese, Japanese and English, and you can switch any time while reading. Each chapter ends with a short quiz you answer on the spot, with explanations, and the questions you miss come back later for review.

This repository holds the manuscript and an app made for reading it.

## Download

The easiest way is to download a ready-made build; you don't need any developer tools. Open the latest version on [Releases](https://github.com/cinexul/whats-llm/releases) and pick one of these two files:

- The installer (the file ending in `-setup.exe`): double-click to install, then open it from the Start menu. This is the right choice for most people.
- The portable version (`.zip`): extract the whole thing into a folder, then double-click `whats-llm.exe` inside. Pick this if you'd rather not install anything, or want to carry it around on a USB stick.

Both have the same content, with the book and fonts built in, so they work without an internet connection. You'll need Windows 10 or 11 (64-bit). The [Windows desktop notes](docs/windows-portable.md) explain the difference and where your study data is kept.

Right now there's only a Windows build. On a Mac or Linux, the only way for now is to run it yourself with the steps under "Running from source", which means using the command line.

## What's inside

41 chapters in six parts: getting to know LLMs, using them day to day and at work, the map of tools, hands-on AI coding, building projects, and risks and responsible use. Then a closing chapter and five appendices: a trilingual glossary, prompt templates, a Claude Code / Codex feature reference, a pre-launch checklist, and the key numbers at a glance.

Besides the chapters, the app has:

- Learning paths: one for getting the concepts down, one for writing a work report with sources, and one for building your first web page. You tick off each step yourself.
- Labs: compare how many tokens the same sentence takes in Chinese, Japanese and English with two real tokenizers, plus three small simulations of context budgets, finding evidence with RAG, and agent permissions. Everything runs on your device, no API needed.
- Review and mistakes: questions come back for review just as you're about to forget them, and you can practise the ones you got wrong by topic or chapter.
- My library: export your study data as a backup and import it again on a new computer. On the web version, this is also where you download the whole book to read offline.
- Pick up where you left off: it remembers your paragraph, separately for each language.
- Edit the book yourself: change a chapter, preview it and see what changed, and go back to the original whenever you like. See the [editing guide](docs/local-chapter-edits.md).
- Every chapter lists its revision date and sources, and things that change, like product features and prices, say when they were checked.

## Running from source

This section and the next are for people who want to change things themselves, or who use a Mac or Linux. If you just want to read the book, the download above is all you need.

Install Node.js 24 (24.15.0 or later) and npm, then:

The text laboratory now shares a Rust core: WASM for the web, native Rust commands on desktop, with Svelte for the UI. Source development also needs Rust stable and the setup below. See [the test-branch architecture](docs/rust-core.md).

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.108 --locked
cd app
npm ci
npm run dev        # then open http://localhost:1420
```

For a production build:

- `npm run build` builds the web version into `app/build/`.
- After building, `npm run preview` serves it at `http://127.0.0.1:4173`, where you can try the offline features.
- `npm run tauri -- build` builds the desktop app. You'll need Rust and your system's WebView libraries first.

To read offline on a phone, put the production build on an HTTPS site, download the book from My library, then add it to your home screen from the browser. `npm run dev` doesn't turn on offline caching. Screenshots are in the [mobile reader notes](docs/mobile-reader.md).

## If you want to change the code or the book

Everything lives in `app/`: pages in `app/src/routes/`, the chapters in `app/src/lib/content/{zh,ja,en}/`, and the desktop shell and the Rust study-data module in `app/src-tauri/`. For maintenance notes, start at the [documentation index](docs/README.md).

When you're done, run these from `app/`:

```bash
npm run check          # type checks
npm test               # unit tests
npm run content:check  # do the three editions and their sources line up
npm run check:quiz     # quiz registration
npm run build
npx playwright install chromium   # once, before your first browser test run
npm run test:e2e       # browser tests
npm run test:e2e:pwa   # offline tests
```

For the Rust part, run `cargo test --locked -p study-core` in `app/src-tauri/`.

You don't have to remember to run them every time: GitHub runs all of them whenever something is pushed to `main` or a pull request is opened. Every Monday it also lists chapters due for review and checks that source links still work. It only reminds; it never edits the book. Pushing a `v*` tag builds the Windows version, actually installs and starts it on Windows, and puts it in a release draft that a person checks before publishing.

## Under the hood

The interface is Svelte 5 + SvelteKit (a static single-page app) with TypeScript; the desktop version uses Tauri 2 and Rust. Markdown is rendered with `marked` and `shiki`. Study data is kept in localStorage on the web and in SQLite on the desktop; your own chapter edits are stored in IndexedDB in both.

## License

- Code: [MIT](LICENSE)
- Book text (`app/src/lib/content/`) and the documents and screenshots in `docs/`: [CC BY-SA 4.0](LICENSE-CONTENT). If you share or adapt them, credit the author and release your version under the same license.
