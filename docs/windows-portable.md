# Windows 免安装版 / Portable edition / ポータブル版

## 简体中文

下载 `Whats.LLM_<版本号>_windows-x64-portable.zip`，**完整解压**到可写的文件夹，再双击 `whats-llm.exe`。本应用无需安装；请保留同目录的 DLL 和 `data/` 文件夹，不要在 ZIP 内直接启动程序。

- 适用于 Windows x64，需要已安装 Microsoft Edge WebView2 Runtime；运行环境说明见 [Microsoft 官方文档](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)。ZIP 不包含 WebView2 安装程序或固定版本运行时。
- 学习数据库位于 `data/whatsllm.db`，批注位于程序旁的 `annotations.json`。
- 界面设置、阅读位置和本地正文修改仍由本机 WebView 的浏览器存储保存，**复制文件夹不等于转移全部数据**。更换电脑或更新版本前，请在“我的书包”导出学习备份，再在目标版本中导入。
- 更新前先导出备份并关闭程序，保留原来的 `data/` 和 `annotations.json`，再替换程序和 DLL。
- 正文和字体已包含在程序中；ZIP 不包含语义检索模型，缺少模型时使用关键词搜索。
- 同名 `.zip.sha256` 文件提供 ZIP 的 SHA-256 校验值。

维护者可在 GitHub 的 `Actions → release → Run workflow` 中选择 `main` 并填写以 `v` 开头的标签，或推送 `v*` 标签触发构建。标签不会自动修改 `tauri.conf.json` 中的应用版本。工作流跳过安装包构建，打包 ZIP，在 Windows 上解压启动并检查学习数据库的创建，再上传 Actions 构建产物和 GitHub Release 草稿。已有草稿的其他附件会保留；已公开的 Release 不会被修改。

## English

Extract the entire ZIP to a writable folder, then run `whats-llm.exe`. Keep the DLLs and `data/` directory beside it. Windows x64 and Microsoft Edge WebView2 Runtime are required; the runtime is not included.

The learning database lives in `data/whatsllm.db`; annotations live in `annotations.json` beside the executable. Browser-backed settings, reading positions, and local chapter edits remain on this computer. Export a learning backup in **My library** before updating or moving to another computer, and import it there. When updating, close the app and preserve `data/` and `annotations.json`. Semantic-search models are not included; keyword search remains available.

## 日本語

ZIP全体を書き込み可能なフォルダーに展開し、`whats-llm.exe` を開いてください。DLLと `data/` フォルダーは削除せず、実行ファイルと同じ場所に置いてください。Windows x64とMicrosoft Edge WebView2 Runtimeが必要です。ランタイムは同梱していません。

学習データベースは `data/whatsllm.db`、注釈は実行ファイルの横の `annotations.json` に保存されます。表示設定・読書位置・本文のローカル編集は、そのパソコンのWebView内に保存されます。更新や別のパソコンへの移行前に「マイライブラリ」でバックアップを書き出し、移行先で読み込んでください。更新時はアプリを終了し、`data/` と `annotations.json` を残してプログラムとDLLを置き換えます。意味検索用のモデルは同梱していません。モデルがない場合はキーワード検索を使用します。
