//! Offline index builder.
//!
//! Reads every chapter (zh / ja / en), splits it into passages, embeds them with
//! EmbeddingGemma, and writes one `<lang>.idx` per language. Run this once after
//! fetching the model (scripts/fetch-model.sh); the app loads the result at
//! runtime. Re-run it whenever the book text changes.
//!
//!   cargo run -p build-index --release

use std::fs;
use std::path::Path;

use anyhow::{bail, Context, Result};
use search_core::{chunk_chapter, save_index, Embedder, Passage, SearchIndex, DIM};

const LANGS: [&str; 3] = ["zh", "ja", "en"];

fn main() -> Result<()> {
    let manifest = Path::new(env!("CARGO_MANIFEST_DIR"));
    let src_tauri = manifest
        .parent()
        .and_then(Path::parent)
        .context("cannot locate src-tauri from CARGO_MANIFEST_DIR")?;
    let app_root = src_tauri.parent().context("cannot locate app root")?;

    let content_root = app_root.join("src/lib/content");
    let toc_path = app_root.join("src/lib/toc.json");
    let model_dir = src_tauri.join("resources/model");
    let out_dir = src_tauri.join("resources/search-index");

    if !model_dir.join("model_q4.onnx").exists() {
        bail!(
            "model not found in {}\n  run scripts/fetch-model.sh first to download EmbeddingGemma",
            model_dir.display()
        );
    }

    let toc: serde_json::Value = serde_json::from_str(
        &fs::read_to_string(&toc_path).with_context(|| format!("reading {}", toc_path.display()))?,
    )
    .context("parsing toc.json")?;

    println!("loading EmbeddingGemma from {} ...", model_dir.display());
    let mut embedder = Embedder::load(&model_dir)?;

    for lang in LANGS {
        build_language(lang, &toc, &content_root, &out_dir, &mut embedder)?;
    }

    println!("done. indices written to {}", out_dir.display());
    Ok(())
}

fn build_language(
    lang: &str,
    toc: &serde_json::Value,
    content_root: &Path,
    out_dir: &Path,
    embedder: &mut Embedder,
) -> Result<()> {
    let chapters = chapters_for(toc, lang);
    let lang_dir = content_root.join(lang);

    let mut passages: Vec<Passage> = Vec::new();
    for (slug, title) in &chapters {
        let path = lang_dir.join(format!("{slug}.md"));
        let md = match fs::read_to_string(&path) {
            Ok(s) => s,
            Err(_) => continue, // draft chapter with no body yet
        };
        passages.extend(chunk_chapter(slug, title, &md));
    }

    if passages.is_empty() {
        println!("[{lang}] no passages found, skipping");
        return Ok(());
    }

    let texts: Vec<String> = passages.iter().map(|p| p.text.clone()).collect();
    println!("[{lang}] embedding {} passages ...", texts.len());
    let vectors = embedder.embed_documents(&texts)?;

    let mut flat: Vec<f32> = Vec::with_capacity(vectors.len() * DIM);
    for v in &vectors {
        if v.len() != DIM {
            bail!("unexpected embedding dim {} (expected {DIM})", v.len());
        }
        flat.extend_from_slice(v);
    }

    let index = SearchIndex {
        dim: DIM,
        passages,
        vectors: flat,
    };
    let out_path = out_dir.join(format!("{lang}.idx"));
    save_index(&index, &out_path)?;
    println!(
        "[{lang}] wrote {} passages to {}",
        index.passages.len(),
        out_path.display()
    );
    Ok(())
}

/// Flatten toc.json into an ordered list of (slug, title) for one language.
fn chapters_for(toc: &serde_json::Value, lang: &str) -> Vec<(String, String)> {
    let mut out = Vec::new();
    let Some(parts) = toc.get(lang).and_then(|v| v.as_array()) else {
        return out;
    };
    for part in parts {
        let Some(chapters) = part.get("chapters").and_then(|v| v.as_array()) else {
            continue;
        };
        for ch in chapters {
            if let (Some(slug), Some(title)) = (
                ch.get("slug").and_then(|v| v.as_str()),
                ch.get("title").and_then(|v| v.as_str()),
            ) {
                out.push((slug.to_string(), title.to_string()));
            }
        }
    }
    out
}
