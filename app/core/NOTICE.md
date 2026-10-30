# Text-core provenance

The community normalization/counting rules are a Rust port of sanderland/ctok,
revision 8c43ffd3c7be467622a540f025516e49ef78d8b1 (MIT, copyright Sander Land).
The original full MIT and Unicode license texts are retained in
`../static/tokenizers/ctok-NOTICE.txt` and distributed with the application.

Qwen uses the fixed official model vocabulary already distributed with 1.1.0,
under Apache-2.0, with its full notice at `../static/tokenizers/NOTICE.txt`.
The runtime now uses the upstream Rust tokenizers crate (Apache-2.0), tiktoken-rs
(MIT) and unicode-normalization (MIT OR Apache-2.0). Cargo.lock records exact
versions and checksums; see the package metadata for all transitive dependencies.
This port is not an official Anthropic tokenizer, and adds no Anthropic API access.
