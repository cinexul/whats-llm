//! 将章节Markdown分割为纯文本片段，用于生成嵌入向量。
//!
//! 片段不跨越H2标题边界，每个片段都记录所属标题及其锚点ID。
//! 锚点的生成方式与前端`markdown.ts`保持一致，
//! 使搜索结果能够直接跳转到对应小节。

use std::collections::HashSet;

use crate::types::Passage;

/// 缓冲区达到大约此字符数时，输出一个片段。
const TARGET_CHARS: usize = 480;
/// 短于此长度的缓冲内容并入前一个片段，不单独保留，
/// 避免产生过短、信息量不足的片段。
const MIN_CHARS: usize = 60;

/// 将一个章节转换为片段列表。
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
                1 => {} // 跳过章节标题
                2 => chunker.set_heading(&text),
                _ => chunker.add_line(&text), // H3及以下标题按当前小节的正文处理
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

    /// 向当前段落追加一行正文。
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

    /// 空行、标题或文件结束表示当前段落结束；文本足够时，
    /// 将缓冲内容输出为片段。
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

    /// 将缓冲内容输出为片段。过短的尾部并入同一小节的前一个片段，
    /// 避免片段过短；若同一小节没有前一个片段，则单独保留，
    /// 不丢弃任何可索引的内容。
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

    /// 开始新的H2小节；当前缓冲内容属于前一个小节。
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

/// 移除章末测验及其后续内容（识别zh / ja / en标题）。
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

/// 移除围栏代码块（```...```），在原处保留一个空行。
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

/// 若该行是ATX标题（`#`..`######`后接空格），返回
/// 标题级别和标题文字。
fn heading(line: &str) -> Option<(usize, String)> {
    if !line.starts_with('#') {
        return None;
    }
    let level = line.chars().take_while(|&c| c == '#').count();
    if level == 0 || level > 6 {
        return None;
    }
    let rest = &line[level..];
    // 井号后必须有空格，否则不算标题（例如"#tag"）。
    if !rest.starts_with([' ', '\t']) {
        return None;
    }
    Some((level, rest.trim().to_string()))
}

/// 去除简单的行内Markdown标记，供嵌入计算和搜索摘要使用。
fn inline_plain(s: &str) -> String {
    let mut s = strip_leading_marker(s).to_string();
    s = strip_links(&s);
    s = s.replace("**", "").replace('*', "").replace('`', "");
    s = s.replace("\\|", " ").replace('|', " ");
    // 合并替换操作产生的连续空格
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

/// 移除正文行开头的引用或列表标记。
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
    // 有序列表：行首数字后接'.'或')'
    let digits = t.chars().take_while(|c| c.is_ascii_digit()).count();
    if digits > 0 {
        let after = &t[digits..];
        if let Some(rest) = after.strip_prefix(". ").or_else(|| after.strip_prefix(") ")) {
            return rest.trim_start();
        }
    }
    t
}

/// 将`[text](url)`替换为`text`。
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

/// 生成标题锚点ID，与`markdown.ts`的算法一致：
/// 连续的空白字符和``/\?#&"'<>``合并为一个`-`，
/// 去掉首尾的`-`，空值改为`section`；若发生重名，
/// 则在末尾追加`-`。
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
        // 重名时在末尾追加连字符
        let mut used = HashSet::new();
        assert_eq!(heading_anchor("小结", &mut used), "小结");
        assert_eq!(heading_anchor("小结", &mut used), "小结-");
        // 空值回退为"section"
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
> **答案A。** 解释。
";
        let passages = chunk_chapter("c1", "第1章 标题", md);
        assert!(!passages.is_empty());
        // 测验小节的内容不应混入片段
        assert!(passages.iter().all(|p| !p.text.contains("小测验题目")));
        assert!(passages.iter().all(|p| p.heading != "小测验"));
        // 小结及其锚点应一并收录
        assert!(passages.iter().any(|p| p.heading == "小结" && p.anchor == "小结"));
        // 开篇片段不属于任何小节标题
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
