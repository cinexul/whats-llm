use std::{env, fs};
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = env::args()
        .nth(1)
        .ok_or("pass synthetic reference JSON path")?;
    let cases: serde_json::Value = serde_json::from_str(&fs::read_to_string(path)?)?;
    let rows = cases.as_array().ok_or("expected array")?;
    let mut failures = 0;
    for row in rows {
        let text = row["text"].as_str().ok_or("missing text")?;
        let expected = row["count"].as_u64().ok_or("missing count")?;
        let result = whats_llm_core::native::community(text)?;
        if result.count as u64 != expected {
            failures += 1;
            if failures < 5 {
                eprintln!("Mismatch: {text:?}: {} vs {expected}", result.count);
            }
        }
    }
    println!("{} synthetic reference cases, {failures} mismatches (community reference, not official API)",rows.len());
    if failures > 0 {
        return Err("parity failed".into());
    }
    Ok(())
}
