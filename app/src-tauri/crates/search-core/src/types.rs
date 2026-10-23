use serde::{Deserialize, Serialize};

/// 一个索引条目：位于同一H2小节内的章节片段。
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Passage {
    /// 章节slug，与文件名及路由/chapter/<slug>对应。
    pub slug: String,
    /// 章节标题，取自toc.json，用于展示搜索结果。
    pub title: String,
    /// 片段所属的H2小节标题（章节开篇为""）。
    pub heading: String,
    /// 标题锚点ID，生成方式与markdown.ts一致，供前端
    /// 直接跳转到/chapter/<slug>#<anchor>（无锚点时为""）。
    pub anchor: String,
    /// 片段的纯文本，同时用于生成嵌入和展示搜索摘要。
    pub text: String,
}

/// 单种语言的索引：片段元数据，以及按行存储的
/// L2归一化嵌入向量矩阵（`passages.len() * dim`个浮点数）。
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchIndex {
    pub dim: usize,
    pub passages: Vec<Passage>,
    pub vectors: Vec<f32>,
}

/// 返回给UI的已排序搜索结果。
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchHit {
    pub slug: String,
    pub title: String,
    pub heading: String,
    pub anchor: String,
    pub snippet: String,
    pub score: f32,
}
