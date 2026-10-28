# LLM Learning Book · 大模型学习手册

> 言語 / Language：[简体中文](README.md) · **日本語** · [English](README.en.md)

**プログラミング未経験の人**に向けて、大規模言語モデルの仕組みをやさしく説明し、AIコーディングツールで自分のプロジェクトを作るところまで案内する本です。このリポジトリはその読書・練習アプリで、Web、スマートフォン（PWA）、デスクトップでオフラインでも読めます。

中国語・日本語・英語の3版があり、アプリ内でいつでも切り替えられます。40の学習章にはその場で解けて自動採点される小テストがあり、重要な用語には英語を併記しています。

## ダウンロード

Windowsの方は[Releases](https://github.com/cinexul/whats-llm/releases)からダウンロードできます。インストーラー（`-setup.exe`）はダブルクリックでインストール、ポータブル版（`.zip`）は展開するだけで使えます。違いは[Windows版の説明](docs/windows-portable.md)を見てください。ほかのOSでは、下の手順で自分でビルドしてください。

## 実行

Node.js 24.x（24.15.0以上。ほかの対応バージョンは`app/package.json`）とnpmが必要です。

```bash
cd app
npm ci
npm run dev        # http://localhost:1420 を開く
```

- 静的ビルド：`npm run build`。出力は`app/build/`
- 本番ビルドのプレビュー：ビルド後に`npm run preview`（`http://127.0.0.1:4173`。オフライン機能も試せます）
- デスクトップアプリ：`npm run tauri -- build`。RustとシステムのWebViewライブラリが必要です

## 構成

- `app/src/routes/`、`app/src/lib/*.svelte`：ページとコンポーネント
- `app/src/lib/`：アプリのロジック、3言語の画面文言、内容のメタデータ
- `app/src/lib/content/{zh,ja,en}/`：各章の本文
- `app/src-tauri/`：Tauriのデスクトップシェルと、Rustの学習データモジュール
- `app/scripts/`：内容チェックと静的プレビューのスクリプト
- `docs/`：利用・保守の説明。入口は[文書一覧](docs/README.md)
- `.github/workflows/`：GitHubの自動チェックとリリース

## 技術スタック

Svelte 5 + SvelteKit（静的SPA）+ TypeScript、デスクトップ版はTauri 2 / Rustです。Markdownは`marked`と`shiki`で描画します。デスクトップ版は本文とフォントを同梱し、Web版は「マイライブラリ」から本全体をダウンロードしてオフラインで読めます。

## GitHubの自動処理

| ファイル | 実行のタイミング | 役割 |
| --- | --- | --- |
| [`check.yml`](.github/workflows/check.yml) | `main`へのプッシュ、Pull Request | 型チェック、単体テスト、内容・小テスト登録のチェック、本番ビルド、ブラウザテスト（オフライン機能を含む）、Rustの整形・静的チェック・テスト |
| [`content-maintenance.yml`](.github/workflows/content-maintenance.yml) | 毎週月曜07:17 UTC、または手動 | 見直し時期が来た章の通知と出典リンクの確認。本文は自動で変えません |
| [`release.yml`](.github/workflows/release.yml) | `v*`タグのプッシュ、または手動実行 | Windows x64のインストーラーとポータブル版を作り、Windows上でインストール・起動を確認します。バージョンを指定するとGitHub Releaseの下書きに置き、確認してから公開します。空欄なら試しに作るだけです |

## 機能

- **学習コース**：概念の入門、出典付きの業務レポート、初めてのWebページ作り。成果物の目安と自己チェックの進捗があります。
- **体験ラボ**：本物のトークナイザー2つで、同じ内容の中国語・日本語・英語のトークン数を比べられます。ほかにコンテキストの予算と圧縮、RAGの根拠、Agentの権限の3つのシミュレーション。すべて端末の中で動き、APIは不要です。
- **マイライブラリ**：オフライン保存、PWAのインストールと更新、学習データの書き出しと統合読み込み。
- **本文の編集と差分**：章の本文を編集し、Markdownのプレビューと変更点を確認できます。[利用ガイド](docs/local-chapter-edits.md)を参照してください。
- **段落から再開**：言語ごとに読んだ位置を覚えます。
- **復習と間違えた問題**：記憶のタイミングに合わせて復習を並べ、テーマや章ごとに間違えた問題を練習できます。
- **内容の保守**：各章の改訂・確認・出典を表示し、3言語の対応を自動でチェックします。改訂記録は[文書一覧](docs/README.md)にあります。

## 検証

`app/`で実行します。

```bash
npm run check          # 型チェック
npm test               # 単体テスト
npm run content:check  # 章の登録
npm run check:quiz     # 小テストの登録
npm run build
npx playwright install chromium   # 初回だけブラウザをインストール
npm run test:e2e       # ブラウザテスト（本番ビルドのプレビューを自動で起動）
npm run test:e2e:pwa   # オフライン機能のテスト
```

単体テストは`app/tests/unit/`、ブラウザテストは`app/tests/e2e/`と`app/tests/e2e-pwa/`にあります。Rustの学習データモジュールのテスト：

```bash
cd app/src-tauri
cargo test --locked -p study-core
```

`main`へのプッシュやPull Requestのたびに、GitHubが上のチェックをすべて自動で実行します。

ブラウザ版は学習記録をlocalStorageに、デスクトップ版はSQLiteに保存します。本文のローカル編集はどちらもIndexedDBです。[Windows版](docs/windows-portable.md)にはインストーラーとポータブル版があります。ダウンロード・更新・保存先は説明を見てください。

## スマートフォン

目次ドロワー、下部ナビゲーション、段落からの再開、タッチでのメモ、3言語の読書設定に対応しています。本番ビルドをHTTPSで配信すると、「マイライブラリ」からオフライン用データを保存し、ブラウザからホーム画面に追加できます。開発サーバーではオフラインキャッシュを使いません。画面例は[モバイル版の記録](docs/mobile-reader.md)にあります。

## ライセンス

- コード：[MIT](LICENSE)
- 本文（`app/src/lib/content/`）と`docs/`の文書・スクリーンショット：[CC BY-SA 4.0](LICENSE-CONTENT)。転載・改変するときは著作者を表示し、同じライセンスで公開してください。
