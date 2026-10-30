# Shared Rust text core

This is an implementation refactor, not a language-statistics override. The native and web builds share the same core. No storage schema changes.

## Responsibilities

- `app/core`: pure Rust Unicode compatibility rules, ctok minimum-cost counting,
  o200k BPE, Qwen3.8 encoding/decoding, and Unicode-safe piece grouping.
- Native desktop: Tauri `lab_tokenize` / `lab_community_count` call that same crate.
  Assets are embedded locally; no remote requests, filesystem paths or secrets are
  accepted from the frontend. The existing application CSP is unchanged.
- Web/PWA: `wasm-bindgen` builds the crate once; a lazy shared WASM instance serves
  all three counters. Bundled assets are covered by the existing offline cache.
- Svelte: presentation, input state, feedback and the shared `latestResult`
  lifecycle. A stale async completion cannot overwrite a newer edit.
- TypeScript: thin resource/IPC adapters and types; no second tokenizer engine.
- JSON: localized text, learning-path content and pinned generated Unicode tables.
  Moving data out of executable source is not a claim that it is handwritten Rust.

The existing FSRS/SQLite `study-core`, browser storage, backup/import and editor
persistence remain unchanged. Migrating those independently is not required to
share this calculation core, and would add migration risks unrelated to counting.

## Build

Install Rust stable and Node as documented in the READMEs. Within the developer's
normal toolchain (no global app security changes):

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.108 --locked
cd app
npm ci
npm run check
npm run build
```

`predev`, `precheck`, and `prebuild` build the bindings, using the locked
core Cargo dependency graph. `src/lib/generated/core` and `core/target` are build
artifacts, not committed source. CI and Windows packaging install the same pinned
bindings generator. The desktop dependency has its own updated Tauri Cargo lock.
Do not change the bindings generator without matching the wasm-bindgen crate.

## Provenance and parity

- ctok remains **community Opus 4.8 count reconstruction**, not official Anthropic
  token IDs, segmentation, or billing. Original revision and notices unchanged.
- During the Rust migration, native and WASM results were checked against fixed
  reference cases, including a 38,174-case community sweep with zero mismatches.
  These are historical results; the public source no longer includes the suites
  or independent JS reference engines.
- Lone UTF-16 surrogates become U+FFFD at the UTF-8 boundary, matching the prior
  ctok normalization.

Performance is not asserted from the language change: WASM has a first-load cost
(roughly 6 MB before transport compression in this build), and native IPC is async.
The frontend resource loaders cache successful initialization and retry failures.
