# What's LLM

> 语言 / Language： **简体中文** · [日本語](README.ja.md) · [English](README.en.md)

面向**零编程基础读者**的大白话读物《What's LLM》的离线桌面阅读器：带你看懂大语言模型，并用 AI 编程工具做出自己的项目。

本书**中日英三语**（中文 / 日本語 / English），可在应用内一键切换；每章末尾都有**可作答、自动评分的小测验**，关键术语附英文。

## 运行

```bash
cd app
npm install
npm run dev        # 打开 http://localhost:1420
```

- 静态构建：`npm run build`（产物在 `app/build/`）
- 桌面应用：`cargo tauri build`（需要 Rust 与系统 WebView 库）

## 目录结构

- `app/` —— SvelteKit + Tauri 应用
- `app/src/lib/content/{zh,ja,en}/` —— 各章正文（中文、日文、英文）

## 技术栈

Tauri 2（Rust 外壳）+ SvelteKit（静态 SPA）；Markdown 用 `marked` + `shiki` 渲染；字体内置，完全离线。
