# Windows桌面版 / Windows desktop edition / Windows版

## 简体中文

每次发布都有两种包，内容完全一样，任选一种：

| 文件 | 适合 | 学习记录和笔记存在哪 |
| --- | --- | --- |
| `LLM.Learning.Book_<版本号>_x64-setup.exe`（安装版） | 大多数人。双击安装，开始菜单里有图标 | `%APPDATA%\com.whatsllm.reader\` |
| `LLM.Learning.Book_<版本号>_windows-x64-portable.zip`（免安装版） | 不想安装、想放U盘或整个文件夹带走的人 | 解压后的`data/`文件夹 |

都需要Windows 10或11（64位）。正文和字体已包含在程序里，不联网也能读。每个文件旁边都有同名的`.sha256`校验文件。

### 安装版

- 双击`-setup.exe`，不需要管理员权限。安装界面会跟随系统语言（中文、日文，其他系统显示英文）。
- 电脑上缺少Microsoft Edge WebView2 Runtime时，安装程序会自动下载安装。
- 更新时直接运行新版本的安装包，学习记录不受影响。
- 卸载在Windows“设置→应用”里进行。卸载时如果勾选删除应用数据，学习记录和笔记会一起删掉。

### 免安装版

- **完整解压**到一个可以写入的文件夹，再双击`whats-llm.exe`。不要在ZIP里直接打开。
- 请保留同目录的DLL和`data/`文件夹。Visual C++运行库已随ZIP提供。
- 需要电脑上已有Microsoft Edge WebView2 Runtime（Windows 11自带，Windows 10一般也已随Edge装好）；ZIP里不包含它，缺少时请从[微软官网](https://developer.microsoft.com/microsoft-edge/webview2/)安装。
- 学习数据库是`data/whatsllm.db`，笔记是`data/annotations.json`。旧版本把笔记放在`whats-llm.exe`旁边，新版本会自动读取，第一次保存后改存到`data/`。
- 更新时先关闭程序，保留原来的`data/`，再用新版本的其余文件替换。

### 两种都要注意

界面设置、阅读位置和本地正文修改存在本机的WebView里，**复制文件夹或重装不等于转移全部数据**。换电脑、在安装版和免安装版之间切换、或更新前，请在“我的书包”导出学习备份，再到新的地方导入。

### 维护者：怎么发布

1. 把`app/src-tauri/tauri.conf.json`里的`version`改成新版本号（例如`0.2.0`），合并到`main`。
2. 在GitHub打开`Actions → release → Run workflow`，分支选`main`，版本号填`v0.2.0`，点运行。版本号必须和第1步一致，否则会立刻报错停下，免得打出版本号不对的包。
3. 等20分钟左右。流程会在Windows上打出安装版和免安装版，分别实际安装、解压、启动检查一遍，再放进一个Release草稿。
4. 打开仓库的Releases页面，下载草稿里的文件试一试，没问题就点`Publish release`。发布时GitHub会自动创建`v0.2.0`标签。

也可以直接推送`v*`标签触发，效果相同。版本号留空运行时只试打包，不建草稿，打好的文件在那次运行页面底部的Artifacts里下载。已公开的Release不会被修改；对同一个版本号重复运行，会更新草稿里的文件。

## English

Each release has two packages with the same content:

- `LLM.Learning.Book_<version>_x64-setup.exe`: the installer. No administrator rights needed; the installer follows the system language and downloads Microsoft Edge WebView2 Runtime if it is missing. Learning data and notes are stored in `%APPDATA%\com.whatsllm.reader\`. Uninstall from Windows Settings → Apps; choosing to delete app data also deletes your learning records.
- `LLM.Learning.Book_<version>_windows-x64-portable.zip`: the portable edition. Extract the whole ZIP to a writable folder and run `whats-llm.exe`. Keep the DLLs and the `data/` folder beside it. WebView2 must already be installed (Windows 11 includes it). The learning database is `data/whatsllm.db` and notes are `data/annotations.json`; notes saved by older builds next to the executable are read automatically until the first save. To update, close the app, keep `data/` and replace the other files.

Both need 64-bit Windows 10 or 11. Settings, reading positions and local chapter edits live in the WebView on this computer. Before moving to another computer, switching editions or updating, export a learning backup in **My library** and import it in the new place.

To publish: set `version` in `app/src-tauri/tauri.conf.json`, merge to `main`, then run `Actions → release → Run workflow` on `main` with the matching tag (for example `v0.2.0`), or push that tag. The workflow builds and tests both packages on Windows and puts them in a Release draft for you to check and publish. A run with an empty tag only uploads Actions artifacts.

## 日本語

リリースごとに中身が同じ2種類のパッケージがあります。

- `LLM.Learning.Book_<バージョン>_x64-setup.exe`：インストーラー。管理者権限は不要で、画面はシステムの言語に合わせて表示されます。Microsoft Edge WebView2 Runtimeが無ければ自動でダウンロードします。学習データとメモは`%APPDATA%\com.whatsllm.reader\`に保存されます。アンインストールはWindowsの「設定→アプリ」から行い、アプリデータの削除を選ぶと学習記録も消えます。
- `LLM.Learning.Book_<バージョン>_windows-x64-portable.zip`：ポータブル版。ZIP全体を書き込み可能なフォルダーに展開し、`whats-llm.exe`を開いてください。DLLと`data/`フォルダーは同じ場所に残します。WebView2はあらかじめ必要です（Windows 11には標準で入っています）。学習データベースは`data/whatsllm.db`、メモは`data/annotations.json`です。以前のビルドが実行ファイルの横に保存したメモは、最初に保存するまで自動で読み込みます。更新時はアプリを終了し、`data/`を残して他のファイルを置き換えます。

どちらも64ビット版のWindows 10または11が必要です。表示設定・読書位置・本文のローカル編集はこのパソコンのWebView内に保存されます。別のパソコンへの移行、版の切り替え、更新の前に「マイライブラリ」でバックアップを書き出し、移行先で読み込んでください。

公開手順：`app/src-tauri/tauri.conf.json`の`version`を変えて`main`にマージし、`main`で`Actions → release → Run workflow`を同じ番号のタグ（例：`v0.2.0`）で実行するか、そのタグをプッシュします。Windows上で両方のパッケージを作って動作確認し、Releaseの下書きに入れます。中身を確かめてから公開してください。タグを空欄にすると、Actionsの成果物だけを作ります。
