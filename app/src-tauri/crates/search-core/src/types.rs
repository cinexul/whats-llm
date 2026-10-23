use serde::{Deserialize, Serialize};

/// One indexed unit: a chunk of a chapter that lives under a single H2 section.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Passage {
    /// Chapter slug (matches the file name and the route /chapter/<slug>).
    pub slug: String,
    /// Chapter title, taken from toc.json (shown in results).
    pub title: String,
    /// The H2 section heading this chunk falls under ("" for the chapter intro).
    pub heading: String,
    /// Anchor id of that heading, generated the same way as markdown.ts so the
    /// frontend can deep-link to /chapter/<slug>#<anchor> ("" when none).
    pub anchor: String,
    /// Plain text of the chunk, used both for embedding and for the result snippet.
    pub text: String,
}

/// A per-language index: passage metadata plus a row-major matrix of
/// L2-normalized embedding vectors (`passages.len() * dim` floats).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchIndex {
    pub dim: usize,
    pub passages: Vec<Passage>,
    pub vectors: Vec<f32>,
}

/// A ranked search result handed back to the UI.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchHit {
    pub slug: String,
    pub title: String,
    pub heading: String,
    pub anchor: String,
    pub snippet: String,
    pub score: f32,
}
