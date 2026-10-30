//! Pinned Unicode tables from the v1.1.0 ctok port; see data/README.md.
use serde::Deserialize;
use std::{collections::HashMap, sync::OnceLock};
#[derive(Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
struct Tables {
    category_ranges: Vec<(u32, u32, String)>,
    combining_ranges: Vec<(u32, u32, u32)>,
    upper_ranges: Vec<(u32, u32)>,
    alphabetic_ranges: Vec<(u32, u32)>,
    mark_ranges: Vec<(u32, u32)>,
    lower_map: HashMap<String, String>,
}
fn tables() -> &'static Tables {
    static T: OnceLock<Tables> = OnceLock::new();
    T.get_or_init(|| {
        serde_json::from_str(include_str!("../data/unicode-reference.json"))
            .expect("embedded Unicode tables")
    })
}
fn contains(ranges: &[(u32, u32)], c: char) -> bool {
    let n = c as u32;
    let i = ranges.partition_point(|r| r.1 < n);
    ranges.get(i).is_some_and(|r| r.0 <= n)
}
pub fn category(c: char) -> &'static str {
    let r = &tables().category_ranges;
    let n = c as u32;
    let i = r.partition_point(|r| r.1 < n);
    r.get(i).filter(|r| r.0 <= n).map_or("Cn", |r| r.2.as_str())
}
pub fn combining(c: char) -> u32 {
    let r = &tables().combining_ranges;
    let n = c as u32;
    let i = r.partition_point(|r| r.1 < n);
    r.get(i).filter(|r| r.0 <= n).map_or(0, |r| r.2)
}
pub fn upper(c: char) -> bool {
    contains(&tables().upper_ranges, c)
}
pub fn alphabetic(c: char) -> bool {
    contains(&tables().alphabetic_ranges, c)
}
pub fn mark(c: char) -> bool {
    contains(&tables().mark_ranges, c)
}
pub fn lowercase(c: char) -> String {
    match c {
        '\u{03f4}' => c.to_string(),
        '\u{1c89}' => "\u{1c8a}".into(),
        '\u{a7cb}' => "\u{0264}".into(),
        _ => tables()
            .lower_map
            .get(&c.to_string())
            .cloned()
            .unwrap_or_else(|| c.to_string()),
    }
}
