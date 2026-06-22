//! EmbeddingGemma-300m (4-bit ONNX) inference via fastembed.
//!
//! The same code path runs at build time (to precompute passage vectors) and at
//! runtime in the Tauri app (to embed the query), so the two sets of vectors are
//! always comparable. Model files are loaded from a local directory — nothing is
//! downloaded at runtime, which keeps the app fully offline.
//!
//! Expected files in `model_dir` (from `onnx-community/embeddinggemma-300m-ONNX`):
//!   model_q4.onnx, model_q4.onnx_data,
//!   tokenizer.json, config.json, special_tokens_map.json, tokenizer_config.json

use std::path::Path;

use anyhow::{Context, Result};
use fastembed::{
    InitOptionsUserDefined, OutputKey, Pooling, QuantizationMode, TextEmbedding, TokenizerFiles,
    UserDefinedEmbeddingModel,
};

use crate::index::normalize;

/// EmbeddingGemma output dimension (full Matryoshka width).
pub const DIM: usize = 768;

// EmbeddingGemma uses task-specific prompts; retrieval query vs document differ.
const QUERY_PREFIX: &str = "task: search result | query: ";
const DOC_PREFIX: &str = "title: none | text: ";

// 4-bit ONNX model and its external weight file.
const MODEL_FILE: &str = "model_q4.onnx";
const MODEL_DATA_FILE: &str = "model_q4.onnx_data";
// The name the ONNX graph uses to reference its external weights.
const EXTERNAL_INITIALIZER: &str = "model_q4.onnx_data";
// The ONNX graph exposes a pooled+projected sentence vector under this output.
const OUTPUT_NAME: &str = "sentence_embedding";

const MAX_LENGTH: usize = 1024;

pub struct Embedder {
    model: TextEmbedding,
}

impl Embedder {
    /// Load the model from a directory of bundled files.
    pub fn load(model_dir: &Path) -> Result<Self> {
        let read = |name: &str| -> Result<Vec<u8>> {
            std::fs::read(model_dir.join(name))
                .with_context(|| format!("missing model file: {}", model_dir.join(name).display()))
        };

        let onnx = read(MODEL_FILE)?;
        let onnx_data = read(MODEL_DATA_FILE)?;
        let tokenizer_files = TokenizerFiles {
            tokenizer_file: read("tokenizer.json")?,
            config_file: read("config.json")?,
            special_tokens_map_file: read("special_tokens_map.json")?,
            tokenizer_config_file: read("tokenizer_config.json")?,
        };

        let mut user_model = UserDefinedEmbeddingModel::new(onnx, tokenizer_files)
            .with_pooling(Pooling::Mean)
            .with_quantization(QuantizationMode::None)
            .with_external_initializer(EXTERNAL_INITIALIZER.to_string(), onnx_data);
        user_model.output_key = Some(OutputKey::ByName(OUTPUT_NAME));

        let model = TextEmbedding::try_new_from_user_defined(
            user_model,
            InitOptionsUserDefined::new().with_max_length(MAX_LENGTH),
        )
        .context("failed to initialize EmbeddingGemma")?;

        Ok(Self { model })
    }

    /// Embed passages (documents) and return L2-normalized vectors.
    pub fn embed_documents(&mut self, texts: &[String]) -> Result<Vec<Vec<f32>>> {
        let prefixed: Vec<String> = texts.iter().map(|t| format!("{DOC_PREFIX}{t}")).collect();
        let mut vectors = self.model.embed(prefixed, None)?;
        for v in &mut vectors {
            normalize(v);
        }
        Ok(vectors)
    }

    /// Embed a single query and return its L2-normalized vector.
    pub fn embed_query(&mut self, query: &str) -> Result<Vec<f32>> {
        let mut vectors = self.model.embed(vec![format!("{QUERY_PREFIX}{query}")], None)?;
        let mut v = vectors
            .pop()
            .context("embedding model returned no vector for the query")?;
        normalize(&mut v);
        Ok(v)
    }
}
