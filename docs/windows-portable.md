# Windows 免安装版 / Portable edition / ポータブル版

## 简体中文

下载 `Whats.LLM_<版本号>_windows-x64-portable.zip`，**完整解压**到可写的文件夹，再双击 `whats-llm.exe`。本应用无需安装；请保留同目录的 DLL 和 `data/` 文件夹，不要在 ZIP 内直接启动程序。

- 适用于 Windows 10（2004 或更新版本）及 Windows 11 x64，需要已安装 Microsoft Edge WebView2 Runtime；运行环境说明见 [Microsoft 官方文档](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)。程序引用系统 DirectML 的 `DMLCreateDevice1`，因此要求 Windows 10 2004 起提供的 DirectML 1.1，版本对应见 [Microsoft 版本表](https://learn.microsoft.com/windows/ai/directml/dml-version-history)。ZIP 不包含 WebView2 安装程序或固定版本运行时。
- Visual C++ 运行库 DLL 随 ZIP 提供，无需单独安装该运行库；请保留同目录的所有 DLL。
- 学习数据库位于 `data/whatsllm.db`，批注位于程序旁的 `annotations.json`。
- 界面设置、阅读位置和本地正文修改仍由本机 WebView 的浏览器存储保存，**复制文件夹不等于转移全部数据**。更换电脑或更新版本前，请在“我的书包”导出学习备份，再在目标版本中导入。
- 更新前先导出备份并关闭程序，保留原来的 `data/` 和 `annotations.json`，再替换程序和 DLL。
- 正文和字体已包含在程序中；ZIP 不包含语义检索模型，缺少模型时使用关键词搜索。
- 同名 `.zip.sha256` 文件提供 ZIP 的 SHA-256 校验值。

维护者可在 GitHub 的 `Actions → release → Run workflow` 中选择 `main` 并填写以 `v` 开头的新标签，或推送 `v*` 标签触发构建。复用已有标签时，必须选择该标签所指向的提交；流程会拒绝标签与构建源码不一致的情况。标签不会自动修改 `tauri.conf.json` 中的应用版本。工作流跳过安装包构建，打包 ZIP，在 Windows 上解压启动并检查学习数据库的创建，再上传 Actions 构建产物和 GitHub Release 草稿。已有草稿的其他附件会保留；已公开的 Release 不会被修改。

手动运行 `release` 时勾选 `installer`，会同时生成 `Whats.LLM_<版本号>_x64-setup.exe` 安装包及其校验文件。安装包包含同一套 Visual C++ 运行库；缺少 WebView2 时会下载其引导程序。安装版不带 `data/` 文件夹，学习数据库使用用户应用数据目录。工作流会执行静默安装和安装后的启动检查；免安装 ZIP 仍会保留。

## English

Extract the entire ZIP to a writable folder, then run `whats-llm.exe`. Keep the DLLs and `data/` directory beside it. Windows 10 (2004 or newer) or Windows 11 x64 and Microsoft Edge WebView2 Runtime are required. Visual C++ runtime DLLs are included; WebView2 is not.

The learning database lives in `data/whatsllm.db`; annotations live in `annotations.json` beside the executable. Browser-backed settings, reading positions, and local chapter edits remain on this computer. Export a learning backup in **My library** before updating or moving to another computer, and import it there. When updating, close the app and preserve `data/` and `annotations.json`. Semantic-search models are not included; keyword search remains available.

The manual `installer` option also creates and tests an NSIS `-setup.exe` installer, including the runtime DLLs. Installed builds use the user's app-data directory for the learning database. The portable ZIP remains available.

## 日本語

ZIP全体を書き込み可能なフォルダーに展開し、`whats-llm.exe` を開いてください。DLLと `data/` フォルダーは削除せず、実行ファイルと同じ場所に置いてください。Windows 10（2004以降）またはWindows 11のx64版と、Microsoft Edge WebView2 Runtimeが必要です。Visual C++のランタイムDLLは同梱していますが、WebView2は同梱していません。

学習データベースは `data/whatsllm.db`、注釈は実行ファイルの横の `annotations.json` に保存されます。表示設定・読書位置・本文のローカル編集は、そのパソコンのWebView内に保存されます。更新や別のパソコンへの移行前に「マイライブラリ」でバックアップを書き出し、移行先で読み込んでください。更新時はアプリを終了し、`data/` と `annotations.json` を残してプログラムとDLLを置き換えます。意味検索用のモデルは同梱していません。モデルがない場合はキーワード検索を使用します。

手動実行で `installer` を有効にすると、ランタイムDLLを含むNSISインストーラー（`-setup.exe`）も作成し、インストール後の起動を確認します。インストール版の学習データベースは、ユーザーのアプリデータフォルダーに保存されます。ポータブルZIPも引き続き作成します。
