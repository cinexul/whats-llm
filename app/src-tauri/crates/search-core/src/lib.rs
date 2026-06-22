//! Reusable semantic-search core for What's LLM.
//!
//! Pure logic (chunking, index format, cosine ranking) has no heavy
//! dependencies, so it builds and unit-tests quickly. Embedding-model inference
//! (EmbeddingGemma via fastembed / ONNX Runtime) sits behind the `embed`
//! feature, letting the Tauri app, the offline index builder, and any future
//! server backend share one implementation.

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
