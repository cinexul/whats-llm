# Search indices (generated, not committed)

`<lang>.idx` files here are produced from the book text by the offline builder:

```bash
cargo run -p build-index --release
```

Each file is a bincode-serialized `SearchIndex` (passage metadata + a matrix of
L2-normalized EmbeddingGemma vectors) for one language: `zh.idx`, `ja.idx`,
`en.idx`. Re-run the builder whenever the chapter text changes. They are not
committed because they are large and fully reproducible from the source text.
