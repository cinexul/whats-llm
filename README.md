# 大模型学习手册 · やさしいLLM入門 · LLM Learning Book

> 语言 / Language：**简体中文** · [日本語](README.ja.md) · [English](README.en.md)

我是文科毕业以后入行做程序员的，所以很清楚，没有专业背景的时候容易碰到哪些问题。这本书就是写给没学过编程的人的，一行代码都没写过也不要紧。

前半本讲大模型是怎么回事：它怎样读一句话，为什么有时会把错的说得像真的一样，市面上那些AI产品又有什么不同。后半本带你用Claude Code、Codex这类AI编程工具，从一个个人网站做起，一共做六个小项目。最后一章讲这本书和这个应用本身是怎么做出来的，大部分代码是我和AI一起写的。

书有中文、日文、英文三个版本，读的时候随时可以切换。每章后面有几道小测验，当场作答、当场看解析，答错的题以后还会拿出来让你复习。

这个仓库里放的是书稿，还有专门用来读这本书的应用。

## 下载

推荐直接下载做好的版本，不用装任何开发工具。到[Releases](https://github.com/cinexul/whats-llm/releases)打开最新的版本，从下面两个文件里挑一个：

- 安装版（文件名以`-setup.exe`结尾）：双击安装，以后从开始菜单打开。大多数人选这个就好。
- 免安装版（`.zip`）：先全部解压到一个文件夹里，再双击里面的`whats-llm.exe`。不想在电脑上装东西，或者想放在U盘里带着走，就选这个。

两种的内容完全一样，正文和字体都在程序里，不联网也能读。需要Windows 10或11（64位）。两种的区别、学习记录存在哪里，[Windows桌面版说明](docs/windows-portable.md)里都写着。

现在做好的只有Windows版。用Mac或Linux的话，暂时只能照后面“从源码运行”的步骤自己跑起来，要用到命令行。

## 书里有什么

正文41章，分六个部分：认识大模型、把它用在日常和工作里、看懂工具生态、AI编程实战、动手做项目、风险和负责任地使用。再加一章终章，五个附录（三语术语表、提示词模板、Claude Code / Codex功能参考、上线前检查清单、常用数字速查）。

应用里除了正文，还有这些：

- 学习路线：想先弄懂概念、想写一份带来源的工作报告、想做出第一个网页，各有一条路线，每一步都能自己打勾。
- 动手实验：拿两个真实的分词器，比一比同一句话在中日英三种语言里各要多少token。另外还有上下文预算、RAG找证据、Agent权限三个小模拟。都在你自己的设备上跑，不用API。
- 复习和错题：按遗忘规律安排复习，错题可以按主题或章节单独练。
- 我的书包：学习记录可以导出备份，换电脑以后再导入。网页版还可以在这里把全书下载下来离线读。
- 接着读：每种语言分开记住你读到哪一段。
- 自己改书：可以直接改章节正文，预览效果、看改了哪些地方，原文随时能恢复。用法见[本地编辑说明](docs/local-chapter-edits.md)。
- 每章都标着修订日期和参考来源，产品功能和价格这类会变的内容，写明是什么时候核对的。

## 从源码运行

这一段和下一段，是写给想自己动手改的人，或者用Mac、Linux的人。只想读书的话，用上面下载的版本就够了。

要先装Node.js 24（24.15.0或更新）和npm，然后：

实验分词核心已改为共享 Rust：网页版用 WASM，桌面版直接调用原生 Rust；Svelte 负责界面。源码开发也需要 Rust stable，并先执行下列准备。详见 [test 分支重构说明](docs/rust-core.md)。

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.108 --locked
cd app
npm ci
npm run dev        # 然后打开 http://localhost:1420
```

想要正式版本：

- `npm run build` 打包网页版，结果在`app/build/`。
- 打包以后`npm run preview`，在`http://127.0.0.1:4173`可以试离线功能。
- `npm run tauri -- build` 打包桌面版，这一步要先装好Rust和系统的WebView库。

想在手机上离线读，要把正式版本放到HTTPS网站上，在“我的书包”里下载全书，再用浏览器添加到主屏幕。开发时用的`npm run dev`不开离线缓存。手机界面的截图在[手机阅读版记录](docs/mobile-reader.md)。

## 想改代码或改书的话

代码都在`app/`里：页面在`app/src/routes/`，各章正文在`app/src/lib/content/{zh,ja,en}/`，桌面外壳和Rust写的学习数据模块在`app/src-tauri/`。维护方面的说明，从[文档索引](docs/README.md)看起。

改完以后，在`app/`里把这些检查跑一遍：

```bash
npm run check          # 类型检查
npm run content:check  # 三种语言的章节和来源对不对得上
npm run check:quiz     # 测验题登记
npm run build
```

Rust部分在`app/src-tauri/`里跑`cargo clippy --locked -p study-core -- -D warnings`。

这些检查不用每次都记着手动跑：推到`main`或者开Pull Request的时候，GitHub会自动全部跑一遍。另外每周一会自动列出该复查的章节、检查来源链接还在不在，只提醒，不会自己改书。打`v*`标签时会自动打包Windows版，在Windows上实际装一遍、打开一遍，再放进Release草稿，人看过以后才发布。

## 用到的技术

界面是Svelte 5 + SvelteKit（静态单页应用）和TypeScript，桌面版用Tauri 2和Rust，Markdown用`marked`和`shiki`渲染。学习记录在网页版存进localStorage，桌面版存进SQLite；自己改过的正文，两边都存在IndexedDB里。

## 许可

- 代码：[MIT](LICENSE)
- 书稿（`app/src/lib/content/`）和`docs/`里的文档与截图：[CC BY-SA 4.0](LICENSE-CONTENT)。转载或改编请署上作者，并用同样的许可发布。
