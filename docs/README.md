# 文档索引 · Documentation · 文書一覧

项目入口：[简体中文](../README.md) · [English](../README.en.md) · [日本語](../README.ja.md)

`docs/`存放使用指南、维护约定和有日期的项目记录。应用实际加载的三语书稿在 [`app/src/lib/content/`](../app/src/lib/content/)，不在这里。

This directory contains usage guides, maintenance contracts, and dated project records. The three editions loaded by the app live in [`app/src/lib/content/`](../app/src/lib/content/).

ここには利用・保守ガイドと日付付きの記録を置きます。アプリが読み込む3言語の本文は [`app/src/lib/content/`](../app/src/lib/content/) にあります。

## 使用与维护 · Guides · ガイド

| 文档 / Document | 用途 / Purpose / 用途 |
| --- | --- |
| [Local chapter edits](local-chapter-edits.md) | 本地正文编辑、差异对比和冲突恢复 · Editing, diffs, and recovery · 本文編集・差分・復旧 |
| [Portable learning backups](portable-learning-data.md) | 备份格式、导入合并和恢复规则 · Backup format and merge rules · バックアップ形式・統合ルール |
| [Windows desktop edition](windows-portable.md) | 安装版和免安装版的下载、更新、数据位置与发布步骤 · Installer and portable ZIP: updates, data and publishing · インストーラーとポータブル版・更新・保存先・公開手順 |
| [Offline book and installation](pwa.md) | 离线下载、安装、更新和静态部署 · Offline use and hosting · オフライン利用・配信 |
| [Goal-oriented learning paths](learning-paths.md) | 学习路线、检查点身份与保存 · Paths and checkpoint persistence · 学習コース・進捗保存 |
| [Local interactive lessons](labs.md) | 实验规则、入口与测试 · Simulation rules and tests · ラボのルール・テスト |
| [Maintaining the three editions](content-maintenance.md) | 内容修订、来源、审核日期与翻译对齐 · Editorial review and translation alignment · 内容確認・翻訳の対応管理 |
| [Maintaining quiz identity](quiz-maintenance.md) | 稳定题号、评分版本与历史兼容 · Quiz identity and compatibility · 問題ID・履歴互換性 |

## 有日期的记录 · Dated records · 日付付きの記録

| 文档 / Document | 保留原因 / Why it is kept / 保持する理由 |
| --- | --- |
| [Content revision — 2026-10-27](content-review-2026-10-27.md) | 全书测验重写、章节口径统一、Git入门和项目步骤补全 · Quiz rewrite, consistency fixes, Git and project steps · 小テストの作り直し・表現の統一・Gitと実践手順の追加 |
| [Content revision — 2026-10-22](content-review-2026-10-22.md) | 章节元数据引用的审核依据和来源快照 · Review evidence referenced by chapter metadata · 章メタデータが参照する確認根拠 |
| [从阅读到实践](learning-book.md) | 学习功能的整合说明、当时的截图与验证 · Feature integration, screenshots, and validation at that revision · 学習機能の統合・当時の画面と検証 |
| [手机阅读版](mobile-reader.md) | 第一轮手机界面改版记录 · Initial mobile redesign record · 初回モバイル改修の記録 |

历史记录中的测试数量和功能描述对应当时版本，不代表当前检查结果。当前操作以使用指南和源码为准；需要当前验证结果时，运行项目README中的命令。`local-chapter-edits.md`也保留了该功能交付时的验证记录。

Historical test counts and feature descriptions apply to the recorded revision. Use the guides and source for current behavior, and run the project README commands for fresh validation. The editing guide also retains its delivery-time validation record.

過去のテスト件数や機能説明は記録時点のものです。現在の操作はガイドとソースを参照し、最新の検証にはプロジェクトREADMEのコマンドを使ってください。本文編集ガイドにも実装時の検証記録を残しています。

`learning/`、`local-edits/`、`mobile/`中的图片都被上述文档引用，是界面示例，不是构建产物。新增指南时在此登记；只有被其他说明完整取代且无引用的过程记录才适合移除。作为`reviewEvidence`使用的文件须继续保留。

Images in `learning/`, `local-edits/`, and `mobile/` are referenced screenshots, not build output. Add new guides to this index. Remove process records only when fully superseded and unreferenced; keep files used as `reviewEvidence`.

`learning/`、`local-edits/`、`mobile/`の画像は文書から参照する画面例です。新しいガイドはこの一覧に追加してください。完全に置き換えられ、参照もない作業記録は削除できますが、`reviewEvidence`に使うファイルは保持します。
