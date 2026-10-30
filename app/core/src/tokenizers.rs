//! Native Rust tokenizer implementations; WASM is only the transport boundary.
use serde::Serialize;
use wasm_bindgen::prelude::*;
#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct Piece {
    pub text: String,
    pub tokens: usize,
}
#[derive(Serialize, Debug)]
pub struct Tokenized {
    pub count: usize,
    pub pieces: Vec<Piece>,
    pub ids: Vec<u32>,
}
fn group(
    ids: &[u32],
    decode: impl Fn(&[u32]) -> Result<String, String>,
) -> Result<Vec<Piece>, String> {
    let mut pieces = Vec::new();
    let mut pending = Vec::new();
    for &id in ids {
        pending.push(id);
        let text = decode(&pending)?;
        if !text.ends_with('�') || pending.len() >= 4 {
            pieces.push(Piece {
                text,
                tokens: pending.len(),
            });
            pending.clear();
        }
    }
    if !pending.is_empty() {
        pieces.push(Piece {
            text: decode(&pending)?,
            tokens: pending.len(),
        });
    }
    Ok(pieces)
}
#[wasm_bindgen]
pub struct TextTokenizer {
    engine: Engine,
}
enum Engine {
    OpenAI(tiktoken_rs::CoreBPE),
    Qwen(Box<tokenizers::Tokenizer>),
}
impl TextTokenizer {
    pub fn openai() -> Result<Self, String> {
        Ok(Self {
            engine: Engine::OpenAI(tiktoken_rs::o200k_base().map_err(|e| e.to_string())?),
        })
    }
    pub fn qwen(json: &str) -> Result<Self, String> {
        tokenizers::utils::parallelism::set_parallelism(false);
        let mut tokenizer =
            tokenizers::Tokenizer::from_bytes(json.as_bytes()).map_err(|e| e.to_string())?;
        tokenizer.with_truncation(None).map_err(|e| e.to_string())?;
        tokenizer.with_padding(None);
        Ok(Self {
            engine: Engine::Qwen(Box::new(tokenizer)),
        })
    }
    pub fn tokenize(&self, text: &str) -> Result<Tokenized, String> {
        if text.len() > 100_000 {
            return Err("Text is too long for the teaching experiment".into());
        }
        match &self.engine {
            Engine::OpenAI(t) => {
                let ids = t.encode_ordinary(text);
                let pieces = group(&ids, |part| {
                    t.decode_bytes(part)
                        .map(|b| String::from_utf8_lossy(&b).into_owned())
                        .map_err(|e| e.to_string())
                })?;
                Ok(Tokenized {
                    count: ids.len(),
                    pieces,
                    ids,
                })
            }
            Engine::Qwen(t) => {
                let ids = t
                    .encode(text, false)
                    .map_err(|e| e.to_string())?
                    .get_ids()
                    .to_vec();
                let pieces = group(&ids, |part| {
                    t.decode(part, false).map_err(|e| e.to_string())
                })?;
                Ok(Tokenized {
                    count: ids.len(),
                    pieces,
                    ids,
                })
            }
        }
    }
}
#[wasm_bindgen]
impl TextTokenizer {
    #[wasm_bindgen(js_name=openai)]
    pub fn openai_js() -> Result<TextTokenizer, JsValue> {
        Self::openai().map_err(|e| JsValue::from_str(&e))
    }
    #[wasm_bindgen(js_name=qwen)]
    pub fn qwen_js(json: &str) -> Result<TextTokenizer, JsValue> {
        Self::qwen(json).map_err(|e| JsValue::from_str(&e))
    }
    #[wasm_bindgen(js_name=tokenizeJson)]
    pub fn tokenize_json(&self, text: &str) -> Result<String, JsValue> {
        self.tokenize(text)
            .map(|r| serde_json::to_string(&r).unwrap())
            .map_err(|e| JsValue::from_str(&e))
    }
}
