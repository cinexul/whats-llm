use flate2::read::GzDecoder;
use std::io::Read;
use whats_llm_core::CommunityCounter;
#[test]
fn community_python_golden_not_official_api() {
    let mut json = String::new();
    GzDecoder::new(&include_bytes!("../../static/tokenizers/ctok-v48.json.gz")[..])
        .read_to_string(&mut json)
        .unwrap();
    let counter = CommunityCounter::from_json(&json).unwrap();
    let golden: serde_json::Value =
        serde_json::from_str(include_str!("../data/ctok-golden.json")).unwrap();
    for c in golden["cases"].as_array().unwrap() {
        let text = c["text"].as_str().unwrap();
        let result = counter.estimate(text);
        assert_eq!(
            result.count,
            c["count"].as_u64().unwrap() as usize,
            "{} {:?}",
            c["key"],
            text
        );
        assert_eq!(
            result.message_count,
            c["messageCount"].as_u64().unwrap() as usize
        );
    }
}
#[test]
fn malformed_asset_is_rejected() {
    assert!(CommunityCounter::from_json("{}").is_err());
}
#[test]
fn official_tokenizer_golden() {
    let mut json = String::new();
    GzDecoder::new(&include_bytes!("../../static/tokenizers/qwen38.json.gz")[..])
        .read_to_string(&mut json)
        .unwrap();
    let qwen = whats_llm_core::tokenizers::TextTokenizer::qwen(&json).unwrap();
    let openai = whats_llm_core::tokenizers::TextTokenizer::openai().unwrap();
    let golden: serde_json::Value =
        serde_json::from_str(include_str!("../../tests/fixtures/tokenizer-golden.json")).unwrap();
    for c in golden["rows"].as_array().unwrap() {
        let text = c["text"].as_str().unwrap();
        for (name, t) in [("o200k", &openai), ("qwen38", &qwen)] {
            let result = t.tokenize(text).unwrap();
            assert_eq!(
                serde_json::to_value(&result.ids).unwrap(),
                c[name]["ids"],
                "{} {name}",
                c["key"]
            );
            assert_eq!(
                serde_json::to_value(&result.pieces).unwrap(),
                c[name]["pieces"],
                "{} {name} pieces",
                c["key"]
            );
        }
    }
}
#[test]
fn bound_untrusted_text_before_encoding() {
    let t = whats_llm_core::tokenizers::TextTokenizer::openai().unwrap();
    assert!(t.tokenize(&"x".repeat(100_001)).is_err());
}
