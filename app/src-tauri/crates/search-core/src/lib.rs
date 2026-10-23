//! What's LLM的可复用语义搜索核心。
//!
//! 纯逻辑部分（文本分块、索引格式、余弦排序）不依赖大型库，
//! 因此构建和单元测试都很快。嵌入模型推理通过`embed`功能开关启用，
//! 使用fastembed / ONNX Runtime运行EmbeddingGemma，
//! 让Tauri应用、离线索引构建工具以及未来的服务端
//! 共用同一套实现。

mod chunk;
mod index;
mod types;

pub use chunk::chunk_chapter;
pub use index::{cosine_topk, load_index, load_index_bytes, normalize, save_index};
pub use types::{Passage, SearchHit, SearchIndex};

#[cfg(feature = "embed")]
mod embed;
#[cfg(feature = "embed")]
pub use embed::{Embedder, DIM};
