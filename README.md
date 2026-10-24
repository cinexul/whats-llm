# What's LLM

> 语言 / Language： **简体中文** · [日本語](README.ja.md) · [English](README.en.md)

面向**零编程基础读者**的大白话读物《What's LLM》的三语阅读与练习应用，支持网页、手机 PWA 和离线桌面阅读：带你看懂大语言模型，并用 AI 编程工具做出自己的项目。

本书**中日英三语**（中文 / 日本語 / English），可在应用内一键切换；40 个教学章节附有**可作答、自动评分的小测验**，关键术语附英文。

## 运行

推荐 Node.js 24.x（至少 24.15.0；其他兼容版本见 `app/package.json`）和 npm。Rust 核心测试使用 stable 工具链。

```bash
cd app
npm ci
npm run dev        # 打开 http://localhost:1420
```

- 静态构建：`npm run build`（产物在 `app/build/`）
- 正式预览：构建后执行 `npm run preview`（`http://127.0.0.1:4173`，可验证离线功能）
- 桌面应用：`npm run tauri -- build`（需要 Rust 与系统 WebView 库）

## 目录结构

- `app/src/routes/`、`app/src/lib/*.svelte` —— Svelte 页面与组件
- `app/src/lib/` —— TypeScript 应用逻辑、三语文案与内容元数据
- `app/src/lib/content/{zh,ja,en}/` —— 各章正文（中文、日文、英文）
- `app/src-tauri/` —— Tauri 桌面外壳、Rust 搜索与学习核心
- `app/scripts/` —— 内容检查、静态预览和可选模型下载工具
- `docs/` —— 使用指南、维护说明与有日期的验证记录，入口见[文档索引](docs/README.md)
- `.github/workflows/` —— GitHub 自动检查与发布配置，作用见下文

依赖锁文件和构建配置用于可重复安装。`node_modules/`、`build/`、`.svelte-kit/` 和 Rust `target/` 是被 Git 忽略的本地产物。

## 技术栈

Svelte 5 + SvelteKit（静态 SPA）+ TypeScript，桌面外壳使用 Tauri 2 / Rust；Markdown 用 `marked` + `shiki` 渲染。桌面版内置正文和字体；网页版可主动下载整本书，完成后离线阅读。

GitHub 的 Languages 按源文件字节数统计，不代表界面框架占比或编译结果。TypeScript 承载应用逻辑和三语教学数据，Svelte 负责页面与组件。参见 [Linguist 统计规则](https://github.com/github-linguist/linguist/blob/main/docs/how-linguist-works.md)。

## GitHub 自动化

Workflow 是 GitHub 在指定事件发生时执行的任务清单，不是应用启动所需文件：

| 文件 | 何时运行 | 作用 |
| --- | --- | --- |
| [`check.yml`](.github/workflows/check.yml) | 推送到 `main` 或提交 Pull Request | 类型、内容和测验登记检查、生产构建及 Rust 核心测试；不发布应用 |
| [`content-maintenance.yml`](.github/workflows/content-maintenance.yml) | 每周一 07:17 UTC，或手动运行 | 提醒到期的章节审核，检查来源链接并保存报告；不自动改正文或审核日期 |
| [`release.yml`](.github/workflows/release.yml) | 推送 `v*` 标签，或手动填写版本号运行 | 默认构建 Windows x64 免安装 ZIP；手动勾选 `installer` 可同时生成并验证 NSIS 安装包。产物上传 Actions 及 GitHub Release **草稿**，待人工确认和发布 |

普通 `main` 推送不会触发发布流程；当前没有网站部署 workflow。来源链接检查失败需要人工确认。

## 阅读与练习

- **学习路线**：概念入门、带来源的工作报告、首个网页项目，附实践成果要求和可保存的自检进度。
- **交互实验**：上下文预算与压缩、RAG 证据、Agent 权限，均为本地教学模拟，无需 API。
- **我的书包**：下载离线书包、安装 PWA、查看更新，以及导出/预览/合并导入学习数据。
- **本地编辑与差异对比**：修改章节正文、预览 Markdown、查看增删差异；目录标记和“我的修改”集中定位改过的章节，备份保留修改与原文。详见[使用说明](docs/local-chapter-edits.md)。
- **段落续读**：按语言保存阅读位置，适应字号和屏幕变化；章节链接中的指定位置优先。
- **错题复习**：按主题或章节练习，保留历史记录；题目身份与评分版本分开维护。
- **内容维护**：每章显示修订、复核和来源信息，自动检查正文变化及三语版本对齐。

入口位于首页和目录顶部。按用途查阅[文档索引](docs/README.md)、[PWA 部署指南](docs/pwa.md)和[内容维护指南](docs/content-maintenance.md)。[功能与验证记录](docs/learning-book.md)保留对应版本的截图和检查结果。

## 2026-10-22 内容修订

更新三语工具实操、产品选择、Skills/MCP、RAG、本地/云端数据流、计费与权限说明；纠正上下文、训练记忆和向量隐私的过度简化，并改善翻译及测验答案分布。相关章节附官方或研究原始来源及核对日期，详见[修订与维护记录](docs/content-review-2026-10-22.md)。

## 验证

在 `app/` 运行：

```bash
npm run check
npm run content:check
npm run check:quiz
npm run build
```

这些命令检查类型、内容登记和构建，不能替代交互验收。Rust 核心测试不需要桌面 WebView 或嵌入模型；另开终端，从仓库根目录执行：

```bash
cd app/src-tauri
cargo test --locked -p search-core -p study-core
```

浏览器版使用 localStorage 保存学习记录；桌面版的学习进度使用 SQLite/FSRS。两者的本地正文修改均使用 IndexedDB。GitHub 发布流程生成 [Windows x64 免安装 ZIP](docs/windows-portable.md)，包含程序、DLL 和 `data/` 文件夹；解压运行需要 Microsoft Edge WebView2 Runtime。本地 `tauri build` 仍可按配置生成 NSIS 安装包。语义搜索模型和索引不在仓库内，未配置时回退到全文搜索。网页测试不能替代桌面程序验证。

## 手机版

纸感风格的手机阅读界面提供抽屉目录、底部导航、段落续读、触屏笔记及三语阅读设置。正式构建部署在 HTTPS 下后，可在“我的书包”下载离线内容，并通过浏览器添加到主屏幕；开发服务器不启用离线缓存。查看[实际预览与验证说明](docs/mobile-reader.md)。
