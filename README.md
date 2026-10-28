# 大模型学习手册 · LLM Learning Book

> 语言 / Language：**简体中文** · [日本語](README.ja.md) · [English](README.en.md)

写给**零编程基础读者**的大白话读物，带你看懂大语言模型，再用AI编程工具做出自己的项目。这个仓库是它的阅读与练习应用，可以在网页、手机（PWA）和桌面上离线阅读。

全书有中文、日文、英文三个版本，应用里随时切换。40个教学章节都配有能直接作答、自动评分的小测验，关键术语附英文。

## 下载

Windows用户到[Releases](https://github.com/cinexul/whats-llm/releases)下载：安装版（`-setup.exe`）双击安装，免安装版（`.zip`）解压就能用，区别见[Windows桌面版说明](docs/windows-portable.md)。其他系统请按下面的步骤自己构建。

## 运行

需要Node.js 24.x（至少24.15.0，其他可用版本见`app/package.json`）和npm。

```bash
cd app
npm ci
npm run dev        # 打开 http://localhost:1420
```

- 静态构建：`npm run build`，产物在`app/build/`
- 预览正式构建：构建后执行`npm run preview`（`http://127.0.0.1:4173`，可以试离线功能）
- 桌面应用：`npm run tauri -- build`，需要Rust和系统的WebView库

## 目录

- `app/src/routes/`、`app/src/lib/*.svelte`：页面与组件
- `app/src/lib/`：应用逻辑、三语界面文字和内容元数据
- `app/src/lib/content/{zh,ja,en}/`：各章正文
- `app/src-tauri/`：Tauri桌面外壳和Rust学习数据模块
- `app/scripts/`：内容检查和静态预览脚本
- `docs/`：使用和维护说明，入口是[文档索引](docs/README.md)
- `.github/workflows/`：GitHub自动检查和发布

## 技术栈

Svelte 5 + SvelteKit（静态SPA）+ TypeScript，桌面版用Tauri 2 / Rust。Markdown用`marked`和`shiki`渲染。桌面版自带正文和字体；网页版可以在“我的书包”里把整本书下载下来离线读。

## GitHub自动化

| 文件 | 什么时候运行 | 做什么 |
| --- | --- | --- |
| [`check.yml`](.github/workflows/check.yml) | 推送到`main`或提交Pull Request | 类型检查、单元测试、内容和测验登记检查、生产构建、浏览器测试（含离线功能），Rust格式、静态检查和测试 |
| [`content-maintenance.yml`](.github/workflows/content-maintenance.yml) | 每周一07:17 UTC，或手动 | 提醒到期该复核的章节，检查来源链接；不会自动改正文 |
| [`release.yml`](.github/workflows/release.yml) | 推送`v*`标签，或手动运行 | 构建Windows x64安装版和免安装版，并在Windows上实际安装、启动检查。填了版本号时放进GitHub Release草稿，人工确认后再发布；留空只试打包 |

## 功能

- **学习路线**：概念入门、带来源的工作报告、第一个网页项目，每条路线都有成果要求和自检进度。
- **交互实验**：上下文预算与压缩、RAG证据、Agent权限，全部是本地模拟，不需要API。
- **我的书包**：离线下载、安装PWA、检查更新，导出和合并导入学习数据。
- **本地编辑与对比**：改章节正文、预览Markdown、查看改动，详见[使用说明](docs/local-chapter-edits.md)。
- **段落续读**：每种语言分别记住读到哪里。
- **复习与错题**：按记忆规律安排复习，可以按主题或章节练错题。
- **内容维护**：每章显示修订、复核和来源信息，自动检查三种语言是否对齐。修订记录见[文档索引](docs/README.md)。

## 验证

在`app/`里运行：

```bash
npm run check          # 类型检查
npm test               # 单元测试
npm run content:check  # 章节登记
npm run check:quiz     # 测验登记
npm run build
npx playwright install chromium   # 第一次跑浏览器测试前安装浏览器
npm run test:e2e       # 浏览器测试，自动启动正式构建的预览
npm run test:e2e:pwa   # 离线功能测试
```

单元测试在`app/tests/unit/`，浏览器测试在`app/tests/e2e/`和`app/tests/e2e-pwa/`。Rust学习数据模块的测试：

```bash
cd app/src-tauri
cargo test --locked -p study-core
```

每次推送到`main`或提交Pull Request，GitHub都会自动跑以上全部检查。

浏览器版用localStorage保存学习记录，桌面版用SQLite；两者的本地正文修改都存在IndexedDB。[Windows桌面版](docs/windows-portable.md)有安装版和免安装版两种，下载、更新和数据位置见说明。

## 手机版

手机界面有抽屉目录、底部导航、段落续读、触屏笔记和三语阅读设置。正式构建部署到HTTPS后，可以在“我的书包”下载离线内容，再用浏览器添加到主屏幕。开发服务器不启用离线缓存。截图见[手机阅读版记录](docs/mobile-reader.md)。

## 许可

- 代码：[MIT](LICENSE)
- 书稿（`app/src/lib/content/`）和`docs/`里的文档与截图：[CC BY-SA 4.0](LICENSE-CONTENT)。转载或改编请署名，并以相同许可发布。
