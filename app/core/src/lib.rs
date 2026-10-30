//! Pure Rust shared core. Native consumers and the browser WASM use identical algorithms.
mod normalize;
mod unicode;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Asset {
    schema: u8,
    family: String,
    message_overhead: u32,
    #[serde(rename = "fold_quotes")]
    fold_quotes: bool,
    #[serde(rename = "allcaps_min")]
    allcaps_min: Option<u32>,
    #[serde(rename = "frame_bow")]
    frame_bow: bool,
    vocab: Vec<String>,
    unit_pieces: Vec<String>,
    byte_tokens: Vec<String>,
}
#[derive(Default)]
struct Node {
    children: HashMap<char, usize>,
    terminal: bool,
}
#[derive(Serialize, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Count {
    pub count: usize,
    pub message_count: usize,
    pub message_overhead: usize,
    pub family: &'static str,
}
#[wasm_bindgen]
pub struct CommunityCounter {
    trie: Vec<Node>,
    units: HashSet<String>,
    bytes: HashSet<Vec<u8>>,
    max_byte_len: usize,
}
impl CommunityCounter {
    pub fn from_json(json: &str) -> Result<Self, String> {
        let a: Asset = serde_json::from_str(json).map_err(|e| e.to_string())?;
        if a.schema != 1
            || a.family != "v4.8"
            || a.message_overhead != 6
            || a.fold_quotes
            || a.allcaps_min.is_some()
            || a.frame_bow
        {
            return Err("Unsupported ctok community asset".into());
        }
        let mut trie = vec![Node::default()];
        for word in a.vocab {
            let mut cursor = 0;
            for c in word.chars().rev() {
                let next = if let Some(&n) = trie[cursor].children.get(&c) {
                    n
                } else {
                    let n = trie.len();
                    trie.push(Node::default());
                    trie[cursor].children.insert(c, n);
                    n
                };
                cursor = next;
            }
            trie[cursor].terminal = true;
        }
        let units: HashSet<String> = a.unit_pieces.into_iter().collect();
        let mut bytes: HashSet<Vec<u8>> = units.iter().map(|s| s.as_bytes().to_vec()).collect();
        for hex in a.byte_tokens {
            if hex.len() % 2 != 0 || !hex.is_ascii() {
                return Err("Invalid ctok byte vocabulary".into());
            }
            let b: Result<Vec<u8>, _> = (0..hex.len())
                .step_by(2)
                .map(|i| u8::from_str_radix(&hex[i..i + 2], 16))
                .collect();
            bytes.insert(b.map_err(|_| "Invalid ctok byte vocabulary")?);
        }
        let max_byte_len = bytes.iter().map(Vec::len).max().unwrap_or(1).max(1);
        Ok(Self {
            trie,
            units,
            bytes,
            max_byte_len,
        })
    }
    fn char_cost(&self, c: char) -> usize {
        let c = match c {
            '\u{e000}'..='\u{e004}' => char::from_u32(c as u32 - 0xe000 + 0xfdd0).unwrap(),
            _ => c,
        };
        let s = c.to_string();
        if self.units.contains(&s) {
            return 1;
        }
        let b = s.as_bytes();
        let mut best = vec![usize::MAX; b.len() + 1];
        best[0] = 0;
        for end in 1..=b.len() {
            for start in end.saturating_sub(self.max_byte_len)..end {
                if end - start == 1 || self.bytes.contains(&b[start..end]) {
                    best[end] = best[end].min(best[start] + 1);
                }
            }
        }
        best[b.len()]
    }
    fn min_cost(&self, s: &str, byte_floor: bool) -> usize {
        let chars: Vec<char> = s.chars().collect();
        let mut best = vec![0; chars.len() + 1];
        for end in 1..=chars.len() {
            let c = chars[end - 1];
            let cursor = self.trie[0].children.get(&c).copied();
            let terminal = cursor.is_some_and(|n| self.trie[n].terminal);
            best[end] = best[end - 1]
                + if terminal
                    || !byte_floor
                    || matches!(c, '\u{fdd0}' | '\u{fdd1}' | '\u{fdd3}' | '\u{fdd4}')
                {
                    1
                } else {
                    self.char_cost(c)
                };
            if let Some(mut cursor) = cursor {
                for start in (0..end - 1).rev() {
                    let Some(&next) = self.trie[cursor].children.get(&chars[start]) else {
                        break;
                    };
                    cursor = next;
                    if self.trie[cursor].terminal {
                        best[end] = best[end].min(best[start] + 1);
                    }
                }
            }
        }
        best[chars.len()]
    }
    pub fn estimate(&self, text: &str) -> Count {
        let norm = normalize::nfc(text);
        let trailing = norm.chars().rev().take_while(|&c| c == '\n').count();
        let tail = if trailing > 0 {
            self.min_cost(&"\n".repeat(trailing + 2), false) - 1
        } else {
            0
        };
        let count = self.min_cost(&normalize::stream(&norm), true) + tail;
        Count {
            count,
            message_count: count + 6,
            message_overhead: 6,
            family: "v4.8",
        }
    }
}
#[wasm_bindgen]
impl CommunityCounter {
    #[wasm_bindgen(constructor)]
    pub fn new(json: &str) -> Result<CommunityCounter, JsValue> {
        Self::from_json(json).map_err(|e| JsValue::from_str(&e))
    }
    #[wasm_bindgen(js_name=estimateJson)]
    pub fn estimate_json(&self, text: &str) -> Result<String, JsValue> {
        if text.len() > 100_000 {
            return Err(JsValue::from_str(
                "Text is too long for the teaching experiment",
            ));
        }
        Ok(serde_json::to_string(&self.estimate(text)).expect("count is serializable"))
    }
}

pub mod tokenizers;

#[cfg(not(target_arch = "wasm32"))]
pub mod native;
