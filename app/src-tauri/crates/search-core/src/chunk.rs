//! Split a chapter's Markdown into plain-text passages for embedding.
//!
//! Passages never span an H2 boundary, so each one carries the heading it sits
//! under (and that heading's anchor id). The anchor is generated the same way as
//! `markdown.ts` in the frontend, so results can deep-link to the exact section.

use std::collections::HashSet;

use crate::types::Passage;

/// Flush a passage once the buffer reaches roughly this many characters.
const TARGET_CHARS: usize = 480;
/// Buffers shorter than this are folded into the previous passage rather than
/// kept as their own (avoids tiny, low-signal chunks).
const MIN_CHARS: usize = 60;

/// Turn one chapter into a list of passages.
pub fn chunk_chapter(slug: &str, title: &str, markdown: &str) -> Vec<Passage> {
    let body = cut_at_quiz(markdown);
    let body = strip_code_fences(body);

    let mut chunker = Chunker::new(slug, title);
    for raw in body.lines() {
        let line = raw.trim_end();
        let trimmed = line.trim_start();
        if let Some((level, text)) = heading(trimmed) {
            chunker.end_paragraph();
            match level {
                1 => {} // chapter title: skip
                2 => chunker.set_heading(&text),
                _ => chunker.add_line(&text), // H3+ reads as body within the section
            }
        } else if trimmed.is_empty() {
            chunker.end_paragraph();
        } else {
            chunker.add_line(trimmed);
        }
    }
    chunker.finish()
}

struct Chunker<'a> {
    slug: &'a str,
    title: &'a str,
    used: HashSet<String>,
    heading: String,
    anchor: String,
    para: String,
    buf: String,
    out: Vec<Passage>,
}

impl<'a> Chunker<'a> {
    fn new(slug: &'a str, title: &'a str) -> Self {
        Self {
            slug,
            title,
            used: HashSet::new(),
            heading: String::new(),
            anchor: String::new(),
            para: String::new(),
            buf: String::new(),
            out: Vec::new(),
        }
    }

    /// Append a body line to the current paragraph.
    fn add_line(&mut self, line: &str) {
        let s = inline_plain(line);
        let s = s.trim();
        if s.is_empty() {
            return;
        }
        if !self.para.is_empty() {
            self.para.push(' ');
        }
        self.para.push_str(s);
    }

    /// A blank line (or a heading/EOF) ends the current paragraph; once enough
    /// text has accumulated, the buffer becomes a passage.
    fn end_paragraph(&mut self) {
        let p = self.para.trim();
        if !p.is_empty() {
            if !self.buf.is_empty() {
                self.buf.push('\n');
            }
            self.buf.push_str(p);
        }
        self.para.clear();
        if self.buf.chars().count() >= TARGET_CHARS {
            self.flush();
        }
    }

    /// Finalize the buffered text into a passage. A short tail is folded into the
    /// previous passage of the same section to avoid tiny fragments; if there is
    /// no such passage it is still kept (never drop indexable content).
    fn flush(&mut self) {
        let text = self.buf.trim().to_string();
        self.buf.clear();
        if text.is_empty() {
            return;
        }
        if text.chars().count() < MIN_CHARS {
            if let Some(last) = self.out.last_mut() {
                if last.heading == self.heading {
                    last.text.push('\n');
                    last.text.push_str(&text);
                    return;
                }
            }
        }
        self.out.push(Passage {
            slug: self.slug.to_string(),
            title: self.title.to_string(),
            heading: self.heading.clone(),
            anchor: self.anchor.clone(),
            text,
        });
    }

    /// Start a new H2 section: the buffered text belonged to the previous one.
    fn set_heading(&mut self, raw: &str) {
        self.flush();
        self.heading = inline_plain(raw).trim().to_string();
        self.anchor = heading_anchor(&self.heading, &mut self.used);
    }

    fn finish(mut self) -> Vec<Passage> {
        self.end_paragraph();
        self.flush();
        self.out
    }
}

/// Drop everything from the end-of-chapter quiz onward (zh / ja / en headings).
fn cut_at_quiz(md: &str) -> &str {
    let mut offset = 0usize;
    for line in md.split_inclusive('\n') {
        let t = line.trim();
        if let Some(rest) = t.strip_prefix("##") {
            let rest = rest.trim();
            if rest == "小测验" || rest == "小テスト" || rest == "Quiz" {
                return &md[..offset];
            }
        }
        offset += line.len();
    }
    md
}

/// Remove fenced code blocks (```...```), keeping a blank line in their place.
fn strip_code_fences(md: &str) -> String {
    let mut out = String::new();
    let mut in_fence = false;
    for line in md.lines() {
        if line.trim_start().starts_with("```") {
            in_fence = !in_fence;
            out.push('\n');
            continue;
        }
        if !in_fence {
            out.push_str(line);
            out.push('\n');
        }
    }
    out
}

/// If a line is an ATX heading (`#`..`######` followed by a space), return its
/// level and the heading text.
fn heading(line: &str) -> Option<(usize, String)> {
    if !line.starts_with('#') {
        return None;
    }
    let level = line.chars().take_while(|&c| c == '#').count();
    if level == 0 || level > 6 {
        return None;
    }
    let rest = &line[level..];
    // Require a space after the hashes, otherwise it's not a heading (e.g. "#tag").
    if !rest.starts_with([' ', '\t']) {
        return None;
    }
    Some((level, rest.trim().to_string()))
}

/// Strip light inline Markdown so the text reads cleanly for embedding/snippets.
fn inline_plain(s: &str) -> String {
    let mut s = strip_leading_marker(s).to_string();
    s = strip_links(&s);
    s = s.replace("**", "").replace('*', "").replace('`', "");
    s = s.replace("\\|", " ").replace('|', " ");
    // collapse runs of spaces created by the replacements
    let mut out = String::with_capacity(s.len());
    let mut prev_space = false;
    for ch in s.chars() {
        if ch == ' ' || ch == '\t' {
            if !prev_space {
                out.push(' ');
            }
            prev_space = true;
        } else {
            out.push(ch);
            prev_space = false;
        }
    }
    out.trim().to_string()
}

/// Drop a leading blockquote / list marker from a body line.
fn strip_leading_marker(s: &str) -> &str {
    let t = s.trim_start();
    if let Some(rest) = t.strip_prefix('>') {
        return rest.trim_start();
    }
    for m in ["- ", "* ", "+ "] {
        if let Some(rest) = t.strip_prefix(m) {
            return rest.trim_start();
        }
    }
    // ordered list: leading digits followed by '.' or ')'
    let digits = t.chars().take_while(|c| c.is_ascii_digit()).count();
    if digits > 0 {
        let after = &t[digits..];
        if let Some(rest) = after.strip_prefix(". ").or_else(|| after.strip_prefix(") ")) {
            return rest.trim_start();
        }
    }
    t
}

/// Replace `[text](url)` with just `text`.
fn strip_links(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let bytes = s.as_bytes();
    let mut i = 0;
    while i < s.len() {
        if bytes[i] == b'[' {
            if let Some(close) = s[i + 1..].find(']') {
                let text = &s[i + 1..i + 1 + close];
                let after = i + 1 + close + 1;
                if s[after..].starts_with('(') {
                    if let Some(end) = s[after..].find(')') {
                        out.push_str(text);
                        i = after + end + 1;
                        continue;
                    }
                }
            }
        }
        let ch = s[i..].chars().next().unwrap();
        out.push(ch);
        i += ch.len_utf8();
    }
    out
}

/// Generate a heading anchor id. Mirrors the algorithm in `markdown.ts`:
/// runs of whitespace and ``/\?#&"'<>`` collapse to a single `-`, leading and
/// trailing `-` are trimmed, empty becomes `section`, and collisions get a
/// trailing `-` appended.
fn heading_anchor(text: &str, used: &mut HashSet<String>) -> String {
    let mut s = String::new();
    let mut prev_dash = false;
    for ch in text.chars() {
        if ch.is_whitespace() || "/\\?#&\"'<>".contains(ch) {
            if !prev_dash {
                s.push('-');
                prev_dash = true;
            }
        } else {
            s.push(ch);
            prev_dash = false;
        }
    }
    let trimmed = s.trim_matches('-');
    let mut id = if trimmed.is_empty() {
        "section".to_string()
    } else {
        trimmed.to_string()
    };
    while used.contains(&id) {
        id.push('-');
    }
    used.insert(id.clone());
    id
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn anchor_matches_markdown_ts_rules() {
        let mut used = HashSet::new();
        assert_eq!(heading_anchor("小结", &mut used), "小结");
        assert_eq!(heading_anchor("Tokens and the window", &mut used), "Tokens-and-the-window");
        // collisions get a trailing dash
        let mut used = HashSet::new();
        assert_eq!(heading_anchor("小结", &mut used), "小结");
        assert_eq!(heading_anchor("小结", &mut used), "小结-");
        // empty falls back to "section"
        let mut used = HashSet::new();
        assert_eq!(heading_anchor("###", &mut used), "section");
    }

    #[test]
    fn headings_split_passages_and_quiz_is_dropped() {
        let md = "\
# 第1章 标题

这是引言部分的第一段，内容需要足够长，这样才能形成一个独立的段落用于嵌入检索的测试目的。再补充一句让它更长一些。

## 小结

这是小结这一节的正文，同样需要足够的长度，所以这里继续写一些说明文字来凑足最小长度阈值的要求。

## 小测验

1. **[概念题]** 这是一道不应被索引的小测验题目。
- A. 选项一
- B. 选项二
> **答案 A。** 解释。
";
        let passages = chunk_chapter("c1", "第1章 标题", md);
        assert!(!passages.is_empty());
        // nothing from the quiz section leaks in
        assert!(passages.iter().all(|p| !p.text.contains("小测验题目")));
        assert!(passages.iter().all(|p| p.heading != "小测验"));
        // the summary section is captured with its anchor
        assert!(passages.iter().any(|p| p.heading == "小结" && p.anchor == "小结"));
        // intro passage sits under no heading
        assert!(passages.iter().any(|p| p.heading.is_empty() && p.text.contains("引言")));
    }

    #[test]
    fn inline_markup_and_code_are_cleaned() {
        let md = "\
## Code section

Here is `inline code` and a [link](https://example.com) and **bold** text that should be long enough to pass the minimum length filter for a passage.

```rust
fn hidden() {}
```
";
        let passages = chunk_chapter("c2", "C2", md);
        let joined: String = passages.iter().map(|p| p.text.clone()).collect();
        assert!(joined.contains("inline code"));
        assert!(joined.contains("link"));
        assert!(joined.contains("bold"));
        assert!(!joined.contains("hidden"));
        assert!(!joined.contains("https://example.com"));
        assert!(!joined.contains('`'));
    }
}
