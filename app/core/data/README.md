# Fixed reference data

`unicode-reference.json` contains the seven generated tables formerly embedded in
`src/lib/labs/ctok-constants.ts` at v1.1.0. They preserve the tested Python Unicode
15.0.0 / regex 2026.9.29 behavior, not the host OS or browser's Unicode version.
The data is data, not hand-written Rust. No language-statistics overrides are used.
The ctok and Unicode attribution is retained in `static/tokenizers/ctok-NOTICE.txt`.

To reproduce this file without executing the old implementation, run
`node scripts/generate-core-reference-data.mjs` from app/. It reads the fixed
v1.1.0 commit via `git show`, parses only its JSON table literals. It does not use
whatever Unicode version happens to be installed on the developer's machine.
