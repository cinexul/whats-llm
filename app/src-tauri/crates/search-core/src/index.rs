//! Index storage (bincode) and cosine top-k ranking.
//!
//! Vectors are stored already L2-normalized, so cosine similarity is just a dot
//! product. The corpus is small (a few thousand passages per language), so a
//! brute-force scan is sub-millisecond and there is no need for an ANN index.

use std::fs;
use std::io;
use std::path::Path;

use crate::types::{SearchHit, SearchIndex};

/// L2-normalize a vector in place. A zero vector is left untouched.
pub fn normalize(v: &mut [f32]) {
    let norm = v.iter().map(|x| x * x).sum::<f32>().sqrt();
    if norm > 0.0 {
        for x in v.iter_mut() {
            *x /= norm;
        }
    }
}

/// Serialize an index to disk (atomically: write to a temp file, then rename).
pub fn save_index(index: &SearchIndex, path: &Path) -> io::Result<()> {
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
    }
    let bytes =
        bincode::serialize(index).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;
    let tmp = path.with_extension("idx.tmp");
    fs::write(&tmp, &bytes)?;
    fs::rename(&tmp, path)
}

/// Load an index from a file.
pub fn load_index(path: &Path) -> io::Result<SearchIndex> {
    load_index_bytes(&fs::read(path)?)
}

/// Load an index from raw bytes (e.g. a bundled resource read into memory).
pub fn load_index_bytes(bytes: &[u8]) -> io::Result<SearchIndex> {
    bincode::deserialize(bytes).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

fn snippet(text: &str, max_chars: usize) -> String {
    let mut s: String = text.chars().take(max_chars).collect();
    if text.chars().count() > max_chars {
        s.push('…');
    }
    s
}

/// Rank all passages against an already-normalized query vector and return the
/// top `k` as [`SearchHit`]s (highest cosine first).
pub fn cosine_topk(index: &SearchIndex, query: &[f32], k: usize) -> Vec<SearchHit> {
    if index.dim == 0 || query.len() != index.dim || index.passages.is_empty() || k == 0 {
        return Vec::new();
    }

    let mut scored: Vec<(f32, usize)> = (0..index.passages.len())
        .map(|i| {
            let row = &index.vectors[i * index.dim..(i + 1) * index.dim];
            let dot = row.iter().zip(query).map(|(a, b)| a * b).sum::<f32>();
            (dot, i)
        })
        .collect();

    scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
    scored
        .into_iter()
        .take(k)
        .map(|(score, i)| {
            let p = &index.passages[i];
            SearchHit {
                slug: p.slug.clone(),
                title: p.title.clone(),
                heading: p.heading.clone(),
                anchor: p.anchor.clone(),
                snippet: snippet(&p.text, 120),
                score,
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::Passage;

    fn passage(slug: &str, text: &str) -> Passage {
        Passage {
            slug: slug.into(),
            title: slug.into(),
            heading: String::new(),
            anchor: String::new(),
            text: text.into(),
        }
    }

    #[test]
    fn normalize_unit_length() {
        let mut v = vec![3.0, 4.0];
        normalize(&mut v);
        let len = (v[0] * v[0] + v[1] * v[1]).sqrt();
        assert!((len - 1.0).abs() < 1e-6);
    }

    #[test]
    fn topk_orders_by_cosine_and_roundtrips() {
        // Two orthogonal-ish directions; query points at the first.
        let mut a = vec![1.0, 0.0];
        let mut b = vec![0.2, 1.0];
        normalize(&mut a);
        normalize(&mut b);
        let mut vectors = Vec::new();
        vectors.extend_from_slice(&a);
        vectors.extend_from_slice(&b);
        let index = SearchIndex {
            dim: 2,
            passages: vec![passage("a", "alpha"), passage("b", "beta")],
            vectors,
        };

        let mut q = vec![1.0, 0.05];
        normalize(&mut q);
        let hits = cosine_topk(&index, &q, 2);
        assert_eq!(hits.len(), 2);
        assert_eq!(hits[0].slug, "a");
        assert!(hits[0].score >= hits[1].score);

        // bincode round-trip preserves the index.
        let bytes = bincode::serialize(&index).unwrap();
        let back = load_index_bytes(&bytes).unwrap();
        assert_eq!(back.dim, 2);
        assert_eq!(back.passages.len(), 2);
        assert_eq!(back.vectors.len(), 4);
    }

    #[test]
    fn topk_rejects_dim_mismatch() {
        let index = SearchIndex {
            dim: 3,
            passages: vec![passage("a", "x")],
            vectors: vec![1.0, 0.0, 0.0],
        };
        assert!(cosine_topk(&index, &[1.0, 0.0], 5).is_empty());
    }
}
