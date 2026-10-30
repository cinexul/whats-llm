//! Count-only ctok v4.8 normalization, ported from the pinned MIT reference.
//! These internal markers are not Anthropic token IDs or token boundaries.
use crate::unicode as u;
use unicode_normalization::UnicodeNormalization;
pub const BOW: char = '\u{fdd0}';
pub const EOW: char = '\u{fdd1}';
pub const SHIFT: char = '\u{fdd3}';
pub const CAPS: char = '\u{fdd4}';
#[derive(Clone, Copy, PartialEq, Eq)]
enum Class {
    Word,
    Hard,
    Digit,
    Punct,
    Space,
    Stray,
}
type Run = (Class, String);
fn new_cased(c: char) -> bool {
    matches!(c, '\u{1c89}' | '\u{1c8a}' | '\u{a7cb}' | '\u{0264}')
}
fn lower(s: &str) -> String {
    s.chars().map(u::lowercase).collect()
}
fn upper(c: char) -> bool {
    c != '\u{03f4}'
        && (matches!(c, '\u{1c89}' | '\u{a7cb}')
            || (u::upper(c) && u::lowercase(c) != c.to_string()))
}
fn selector(c: char) -> bool {
    ('\u{fe00}'..='\u{fe0f}').contains(&c)
}
fn hard_cp(c: char) -> bool {
    let n = c as u32;
    n >= 0x10000
        || (0x4e00..=0x9fff).contains(&n)
        || (0x3400..=0x4dbf).contains(&n)
        || (0xf900..=0xfaff).contains(&n)
        || (0xac00..=0xd7a3).contains(&n)
        || [
            0x3005, 0x3006, 0x3031, 0x3032, 0x3033, 0x3034, 0x3035, 0x303b, 0x303c,
        ]
        .contains(&n)
}
fn classify(c: char) -> Class {
    let n = c as u32;
    let cat = u::category(c);
    if new_cased(c) {
        Class::Word
    } else if cat.starts_with('Z') || "\t\n\r\u{c}\u{b}".contains(c) {
        Class::Space
    } else if [
        (0x16ee, 0x16f0),
        (0x2160, 0x2188),
        (0x24b6, 0x24e9),
        (0xa6e6, 0xa6ef),
    ]
    .iter()
    .any(|&(a, b)| n >= a && n <= b)
    {
        Class::Word
    } else if cat == "Nd"
        && (n < 0x80 || (0x660..=0x669).contains(&n) || (0x6f0..=0x6f9).contains(&n))
    {
        Class::Digit
    } else if (n < 0x80 && (cat.starts_with('P') || cat.starts_with('S')))
        || "—»«•°„–−£§€…√→（№†└│།·─═█".contains(c)
    {
        Class::Punct
    } else if selector(c) {
        Class::Hard
    } else if u::mark(c) {
        if n < 0x10000 && u::alphabetic(c) {
            Class::Word
        } else {
            Class::Hard
        }
    } else if cat.starts_with('L') && !hard_cp(c) {
        Class::Word
    } else {
        Class::Hard
    }
}
pub fn nfc(text: &str) -> String {
    // Isolate codepoints unassigned in the reference so newer NFC tables do not compose them.
    let mut composed = String::new();
    let mut pending = String::new();
    for c in text.chars() {
        if u::category(c) == "Cn" {
            composed.extend(pending.nfc());
            pending.clear();
            composed.push(c);
        } else {
            pending.push(c);
        }
    }
    composed.extend(pending.nfc());
    composed.chars().filter(|&c|!matches!(c,'\u{1}'..='\u{8}'|'\u{b}'..='\u{1f}'|'\u{7f}'..='\u{9f}'|'\u{e000}'..='\u{f8ff}'))
 .map(|c|match c {'\0'|'\u{a0}'|'\u{1680}'|'\u{2000}'..='\u{200a}'|'\u{2028}'|'\u{2029}'|'\u{202f}'|'\u{205f}'=>' ',_=>c}).collect::<String>().replace("\u{e4d}\u{e32}","\u{e33}")
}
fn mark_case(s: &str, head_mark: bool) -> String {
    if head_mark || s.contains('ẞ') {
        return s.into();
    }
    let mut it = s.chars();
    let Some(head) = it.next() else {
        return String::new();
    };
    let tail: Vec<char> = it.collect();
    if s.contains('İ') {
        if upper(head) && head != 'İ' && !tail.iter().any(|&c| c != 'İ' && upper(c)) {
            return format!(
                "{SHIFT}{}{}",
                u::lowercase(head),
                tail.iter()
                    .map(|&c| if c == 'İ' {
                        c.to_string()
                    } else {
                        u::lowercase(c)
                    })
                    .collect::<String>()
            );
        }
        return s.into();
    }
    // v4.8 has allcaps_min=None: no all-caps folding.
    if u::lowercase(head) == head.to_string() {
        return s.into();
    }
    if upper(head) && !tail.iter().any(|&c| upper(c)) {
        return format!("{SHIFT}{}", lower(s));
    }
    s.into()
}
fn separator(c: char) -> bool {
    (c as u32) < 0x10000 && u::mark(c) && !selector(c) && !u::alphabetic(c)
}
fn stray(c: char) -> bool {
    !matches!(c, '\u{711}' | '\u{730}'..='\u{73f}') && u::combining(c) != 0 && !separator(c)
}
fn literal(c: char) -> char {
    match c {
        '\u{e000}'..='\u{e004}' => char::from_u32(c as u32 - 0xe000 + 0xfdd0).unwrap(),
        _ => c,
    }
}
fn punct_mark(c: char) -> bool {
    let c = literal(c);
    let n = c as u32;
    if n >= 0x10000 {
        return false;
    }
    if separator(c) {
        return true;
    }
    let cat = u::category(c);
    let ideographic =
        (0x3001..=0x303f).contains(&n) && (cat.starts_with('P') || "〄〒〓〠〶〷〾〿".contains(c));
    (cat.starts_with('P') || cat.starts_with('S') || matches!(cat, "Cf" | "Cn")) && !ideographic
}
fn digit_border(c: char) -> bool {
    let cat = u::category(c);
    let n = c as u32;
    (cat == "No" || (cat == "Nd" && n >= 0x80)) && n < 0x10000
}
fn digit_run(s: &str) -> bool {
    let mut it = s.chars();
    let Some(c) = it.next() else { return false };
    let cat = u::category(c);
    matches!(cat, "Nd" | "No") && it.all(|c| u::category(c) == cat)
}
fn hard_kind(c: char) -> u8 {
    if punct_mark(c) {
        0
    } else if digit_border(c) {
        1
    } else {
        2
    }
}
fn hard_bow(s: &str) -> bool {
    s.chars()
        .next()
        .is_some_and(|c| selector(c) || punct_mark(c))
}
fn hard_eow(s: &str) -> bool {
    s.chars()
        .last()
        .is_some_and(|c| selector(c) || punct_mark(c))
}
fn digit_bow(s: &str) -> bool {
    digit_run(s) && s.chars().next().is_some_and(digit_border)
}
fn digit_eow(s: &str) -> bool {
    digit_run(s) && s.chars().last().is_some_and(digit_border)
}
fn runs_of(s: &str) -> Vec<Run> {
    let mut runs: Vec<Run> = Vec::new();
    for c in s.chars() {
        let class = classify(c);
        let prev = runs.last().map(|r| r.0);
        if prev == Some(Class::Stray) && class == Class::Word && stray(c) || prev == Some(class) {
            runs.last_mut().unwrap().1.push(c);
        } else {
            let cls = if class == Class::Word && stray(c) && prev != Some(Class::Word) {
                Class::Stray
            } else {
                class
            };
            runs.push((cls, c.to_string()));
        }
    }
    let mut split = Vec::new();
    for (cls, body) in runs {
        if cls != Class::Hard {
            split.push((cls, body));
            continue;
        }
        let mut cur = String::new();
        let mut kind = 0;
        for c in body.chars() {
            if cur.is_empty() {
                kind = hard_kind(c);
                cur.push(c);
            } else if selector(c) || hard_kind(c) == kind {
                cur.push(c);
            } else {
                split.push((cls, std::mem::take(&mut cur)));
                kind = hard_kind(c);
                cur.push(c);
            }
        }
        if !cur.is_empty() {
            split.push((cls, cur));
        }
    }
    split
}
fn opens_word(r: &[Run], i: usize) -> bool {
    r[i].1 == "'"
        && r.get(i + 1)
            .is_some_and(|r| matches!(r.0, Class::Word | Class::Stray))
}
fn right_border(r: &Run) -> bool {
    r.0 == Class::Punct
        || hard_eow(&r.1)
        || (matches!(r.0, Class::Digit | Class::Hard) && digit_run(&r.1) && digit_eow(&r.1))
}
fn contraction(r: &[Run], i: usize) -> bool {
    i > 0
        && ["s", "t", "d", "m", "ll", "re", "ve"].contains(&r[i].1.as_str())
        && r[i - 1].0 == Class::Punct
        && r[i - 1].1 == "'"
        && (i < 2 || !right_border(&r[i - 2]))
}
pub fn stream(norm: &str) -> String {
    let escaped: String = norm
        .chars()
        .map(|c| match c {
            '\u{fdd0}'..='\u{fdd4}' => char::from_u32(c as u32 - 0xfdd0 + 0xe000).unwrap(),
            _ => c,
        })
        .collect();
    let runs = runs_of(escaped.trim_end_matches('\n'));
    let mut out = String::new();
    let borders = |i: usize, left: bool| -> bool {
        let next = if left { i.checked_sub(1) } else { Some(i + 1) };
        next.and_then(|j| runs.get(j)).is_some_and(|(cls, s)| {
            *cls == Class::Space
                && if left {
                    s.ends_with(' ')
                } else {
                    s.starts_with(' ') && !s.starts_with("  ")
                }
        })
    };
    for (i, (cls, body)) in runs.iter().enumerate() {
        match cls {
            Class::Word => {
                let fused = i > 0 && runs[i - 1].0 == Class::Stray;
                let n = mark_case(body, fused);
                let mut it = n.chars().peekable();
                while it.peek().is_some_and(|&c| c == SHIFT || c == CAPS) {
                    out.push(it.next().unwrap());
                }
                if !fused && !contraction(&runs, i) {
                    out.push(BOW);
                }
                out.extend(it);
                out.push(EOW);
            }
            Class::Stray => {
                out.push(BOW);
                out.push_str(body);
                if !runs.get(i + 1).is_some_and(|r| r.0 == Class::Word) {
                    out.push(EOW);
                }
            }
            _ => {
                if *cls == Class::Punct || hard_bow(body) || hard_eow(body) {
                    if borders(i, true)
                        && !opens_word(&runs, i)
                        && (*cls == Class::Punct || hard_bow(body))
                    {
                        out.push(BOW);
                    }
                    out.push_str(body);
                    if borders(i, false) && (*cls == Class::Punct || hard_eow(body)) {
                        out.push(EOW);
                    }
                } else if digit_run(body) && matches!(cls, Class::Digit | Class::Hard) {
                    if digit_bow(body) && borders(i, true) {
                        out.push(BOW);
                    }
                    out.push_str(body);
                    if digit_eow(body) && borders(i, false) {
                        out.push(EOW);
                    }
                } else {
                    out.push_str(body);
                }
            }
        }
    }
    // Absorb exactly one inter-word space; retain EOW and any case prefix.
    let c: Vec<char> = out.chars().collect();
    let mut result = String::new();
    let mut i = 0;
    while i < c.len() {
        if i > 0 && c[i] == EOW && c[i - 1] != '\n' && c.get(i + 1) == Some(&' ') {
            let mut j = i + 2;
            while c.get(j).is_some_and(|&v| v == SHIFT || v == CAPS) {
                j += 1;
            }
            if c.get(j) == Some(&BOW) {
                result.push(EOW);
                result.extend(c[i + 2..j].iter());
                result.push(BOW);
                i = j + 1;
                continue;
            }
        }
        result.push(c[i]);
        i += 1;
    }
    result
}
