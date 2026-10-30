//! Desktop adapter: fixed local assets, identical core types to the WASM build.
use crate::{
    tokenizers::{TextTokenizer, Tokenized},
    CommunityCounter, Count,
};
use std::{io::Read, sync::OnceLock};
fn inflate(bytes: &[u8]) -> Result<String, String> {
    let mut s = String::new();
    flate2::read::GzDecoder::new(bytes)
        .read_to_string(&mut s)
        .map_err(|e| e.to_string())?;
    Ok(s)
}
fn check(text: &str) -> Result<(), String> {
    if text.len() > 100_000 {
        Err("Text is too long for the teaching experiment".into())
    } else {
        Ok(())
    }
}
pub fn tokenize(kind: &str, text: &str) -> Result<Tokenized, String> {
    check(text)?;
    static O: OnceLock<Result<TextTokenizer, String>> = OnceLock::new();
    static Q: OnceLock<Result<TextTokenizer, String>> = OnceLock::new();
    let engine = match kind {
        "o200k" => O.get_or_init(TextTokenizer::openai),
        "qwen38" => Q.get_or_init(|| {
            TextTokenizer::qwen(&inflate(include_bytes!(
                "../../static/tokenizers/qwen38.json.gz"
            ))?)
        }),
        _ => return Err("Unknown tokenizer".into()),
    };
    engine.as_ref().map_err(Clone::clone)?.tokenize(text)
}
pub fn community(text: &str) -> Result<Count, String> {
    check(text)?;
    static C: OnceLock<Result<CommunityCounter, String>> = OnceLock::new();
    Ok(C.get_or_init(|| {
        CommunityCounter::from_json(&inflate(include_bytes!(
            "../../static/tokenizers/ctok-v48.json.gz"
        ))?)
    })
    .as_ref()
    .map_err(Clone::clone)?
    .estimate(text))
}
