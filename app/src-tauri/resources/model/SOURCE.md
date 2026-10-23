# Embedding model (not committed)

Semantic search runs **EmbeddingGemma-300m** (4-bit ONNX) fully on-device.

The weights are large and are **not** stored in git. Download them once with:

```bash
./scripts/fetch-model.sh
```

That places these files here (all flat in this directory):

| file | purpose |
| --- | --- |
| `model_q4.onnx` | 4-bit quantized graph |
| `model_q4.onnx_data` | external weights referenced by the graph |
| `tokenizer.json` | tokenizer |
| `config.json` | model config |
| `special_tokens_map.json` | tokenizer special tokens |
| `tokenizer_config.json` | tokenizer config |

Source: <https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX>
(Gemma Terms of Use apply to the model weights.)

After fetching, build the indices: `cargo run -p build-index --release`.
