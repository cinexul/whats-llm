# Shared Rust text core (test branch)

This is an implementation refactor, not a language-statistics override. Version
1.1.0 and `main` are not changed by work on this branch. No storage schema changes.

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
npm run core:test
npm run check
npm test
npm run build
```

`predev`, `precheck`, `pretest`, and `prebuild` build the bindings, using the locked
core Cargo dependency graph. `src/lib/generated/core` and `core/target` are build
artifacts, not committed source. CI and Windows packaging install the same pinned
bindings generator. The desktop dependency has its own updated Tauri Cargo lock.
Do not change the bindings generator without matching the wasm-bindgen crate.

## Provenance and parity

- ctok remains **community Opus 4.8 count reconstruction**, not official Anthropic
  token IDs, segmentation, or billing. Original revision and notices unchanged.
- Rust native and real WASM are compared with the pinned Python golden corpus.
  A separate 38,174-case synthetic community sweep was checked, with zero mismatches.
- Both official-vocabulary encoders are compared against the existing 56-case
  golden corpus, including token IDs and displayed pieces. The JS engines remain
  dev-only independent oracles; they are not runtime fallbacks.
- Lone UTF-16 surrogates become U+FFFD at the UTF-8 boundary, matching the prior
  ctok normalization. `core/data/ctok-golden.json` preserves these sanitized inputs;
  the WASM tests additionally use the original JS strings without preprocessing.
- Native host routing has a test that rejects accidental vocabulary/WASM fetches.
  Rust tests cover native adapter, malformed assets and size limits.

Performance is not asserted from the language change: WASM has a first-load cost
(roughly 6 MB before transport compression in this build), and native IPC is async.
The frontend resource loaders cache successful initialization and retry failures.
All 569 community cases are now looped in a Rust/WASM corpus test rather than 569
separately named Vitest cases; a lower displayed test total does not drop coverage.
