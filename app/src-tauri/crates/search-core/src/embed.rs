//! 通过fastembed运行EmbeddingGemma-300m（4位ONNX）推理。
//!
//! 构建时预先计算正文片段向量，Tauri应用运行时计算查询向量，
//! 两者使用同一套代码，确保向量可以直接比较。
//! 模型文件从本地目录加载，运行时不下载任何文件，
//! 使应用保持完全离线。
//!
//! `model_dir`需包含以下文件（来自`onnx-community/embeddinggemma-300m-ONNX`）：
//!   model_q4.onnx, model_q4.onnx_data,
//!   tokenizer.json, config.json, special_tokens_map.json, tokenizer_config.json

use std::path::Path;

use anyhow::{Context, Result};
use fastembed::{
    InitOptionsUserDefined, OutputKey, Pooling, QuantizationMode, TextEmbedding, TokenizerFiles,
    UserDefinedEmbeddingModel,
};

use crate::index::normalize;

/// EmbeddingGemma输出维度（完整的Matryoshka维度）。
pub const DIM: usize = 768;

// EmbeddingGemma按任务使用不同提示词；检索查询与文档的提示词不同。
const QUERY_PREFIX: &str = "task: search result | query: ";
const DOC_PREFIX: &str = "title: none | text: ";

// 4位ONNX模型及其外部权重文件。
const MODEL_FILE: &str = "model_q4.onnx";
const MODEL_DATA_FILE: &str = "model_q4.onnx_data";
// ONNX计算图引用外部权重时使用的名称。
const EXTERNAL_INITIALIZER: &str = "model_q4.onnx_data";
// ONNX计算图通过此输出提供经池化和投影后的句子向量。
const OUTPUT_NAME: &str = "sentence_embedding";

const MAX_LENGTH: usize = 1024;

pub struct Embedder {
    model: TextEmbedding,
}

impl Embedder {
    /// 从随应用打包的文件目录加载模型。
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

    /// 为正文片段（文档）生成嵌入，返回经L2归一化的向量。
    pub fn embed_documents(&mut self, texts: &[String]) -> Result<Vec<Vec<f32>>> {
        let prefixed: Vec<String> = texts.iter().map(|t| format!("{DOC_PREFIX}{t}")).collect();
        let mut vectors = self.model.embed(prefixed, None)?;
        for v in &mut vectors {
            normalize(v);
        }
        Ok(vectors)
    }

    /// 为单条查询生成嵌入，返回经L2归一化的向量。
    pub fn embed_query(&mut self, query: &str) -> Result<Vec<f32>> {
        let mut vectors = self.model.embed(vec![format!("{QUERY_PREFIX}{query}")], None)?;
        let mut v = vectors
            .pop()
            .context("embedding model returned no vector for the query")?;
        normalize(&mut v);
        Ok(v)
    }
}
