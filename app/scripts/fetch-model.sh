#!/usr/bin/env bash
# 下载EmbeddingGemma-300m（4位ONNX），用于离线语义搜索。
#
# 文件直接存放在src-tauri/resources/model/。构建索引
# （cargo run -p build-index --release）或应用之前，先运行一次本脚本。
#
# 来源仓库：https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX
# 网络访问受限时可使用镜像：HF_ENDPOINT=https://hf-mirror.com ./scripts/fetch-model.sh
set -euo pipefail

ENDPOINT="${HF_ENDPOINT:-https://huggingface.co}"
REPO="onnx-community/embeddinggemma-300m-ONNX"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/../src-tauri/resources/model"

if ! command -v curl >/dev/null 2>&1; then
  echo "error: curl is required" >&2
  exit 1
fi

mkdir -p "$DEST"

# "<path in repo>|<local filename>"
files=(
  "onnx/model_q4.onnx|model_q4.onnx"
  "onnx/model_q4.onnx_data|model_q4.onnx_data"
  "tokenizer.json|tokenizer.json"
  "config.json|config.json"
  "special_tokens_map.json|special_tokens_map.json"
  "tokenizer_config.json|tokenizer_config.json"
)

for entry in "${files[@]}"; do
  src="${entry%%|*}"
  dst="${entry##*|}"
  echo "==> $dst"
  curl -fL --retry 3 --progress-bar -o "$DEST/$dst" "$ENDPOINT/$REPO/resolve/main/$src"
done

echo
echo "Model ready in $DEST"
echo "Next: cargo run -p build-index --release"
