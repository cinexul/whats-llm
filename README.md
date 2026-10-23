# What's LLM

> 语言 / Language： **简体中文** · [日本語](README.ja.md) · [English](README.en.md)

面向**零编程基础读者**的大白话读物《What's LLM》的三语阅读与练习应用，支持网页、手机 PWA 和离线桌面阅读：带你看懂大语言模型，并用 AI 编程工具做出自己的项目。

本书**中日英三语**（中文 / 日本語 / English），可在应用内一键切换；40 个教学章节附有**可作答、自动评分的小测验**，关键术语附英文。

## 运行

推荐 Node.js 24.15+（兼容范围见 `app/package.json`）和 npm。Rust 核心测试使用 stable 工具链。

```bash
cd app
npm ci
npm run dev        # 打开 http://localhost:1420
```

- 静态构建：`npm run build`（产物在 `app/build/`）
- 正式预览：构建后执行 `npm run preview`（`http://127.0.0.1:4173`，可验证离线功能）
- 桌面应用：`npm run tauri -- build`（需要 Rust 与系统 WebView 库）

## 目录结构

- `app/` —— SvelteKit + Tauri 应用
- `app/src/lib/content/{zh,ja,en}/` —— 各章正文（中文、日文、英文）

## 技术栈

Tauri 2（Rust 外壳）+ SvelteKit（静态 SPA）；Markdown 用 `marked` + `shiki` 渲染。桌面版内置正文和字体；网页版可主动下载整本书，完成后离线阅读。

## 阅读与练习

- **学习路线**：概念入门、带来源的工作报告、首个网页项目，附实践成果要求和可保存的自检进度。
- **交互实验**：上下文预算与压缩、RAG 证据、Agent 权限，均为本地教学模拟，无需 API。
- **我的书包**：下载离线书包、安装 PWA、查看更新，以及导出/预览/合并导入学习数据。
- **本地编辑与差异对比**：修改章节正文、预览 Markdown、查看增删差异；目录标记和“我的修改”集中定位改过的章节，备份保留修改与原文。详见[使用说明](docs/local-chapter-edits.md)。
- **段落续读**：按语言保存阅读位置，适应字号和屏幕变化；章节链接中的指定位置优先。
- **错题复习**：按主题或章节练习，保留历史记录；题目身份与评分版本分开维护。
- **内容维护**：每章显示修订、复核和来源信息，自动检查正文变化及三语版本对齐。

入口位于首页和目录顶部。详细说明见[本轮功能与验证记录](docs/learning-book.md)、[PWA 部署指南](docs/pwa.md)和[内容维护指南](docs/content-maintenance.md)。

## 2026-10-22 内容修订

更新三语工具实操、产品选择、Skills/MCP、RAG、本地/云端数据流、计费与权限说明；纠正上下文、训练记忆和向量隐私的过度简化，并改善翻译及测验答案分布。相关章节附官方或研究原始来源及核对日期，详见[修订与维护记录](docs/content-review-2026-10-22.md)。

## 验证

在 `app/` 运行：

```bash
npm run check
npm run content:check
npm run check:quiz
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:e2e:pwa  # 使用上面的正式构建，验证下载、断网与更新
```

已有 Chromium 的环境可用 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 指定浏览器。Rust 核心测试不需要桌面 WebView 或嵌入模型：

```bash
cd app/src-tauri
cargo test --locked -p search-core -p study-core
```

浏览器版使用 localStorage 保存学习记录；桌面版的学习进度使用 SQLite/FSRS。两者的本地正文修改均使用 IndexedDB。当前桌面打包目标为 Windows NSIS，需要对应平台的 Tauri 前置依赖。语义搜索模型和索引不在仓库内，未配置时回退到全文搜索。网页测试不能替代桌面安装包验证。

## 手机版

纸感风格的手机阅读界面提供抽屉目录、底部导航、段落续读、触屏笔记及三语阅读设置。正式构建部署在 HTTPS 下后，可在“我的书包”下载离线内容，并通过浏览器添加到主屏幕；开发服务器不启用离线缓存。查看[实际预览与验证说明](docs/mobile-reader.md)。
