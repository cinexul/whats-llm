<script lang="ts">
	import { onMount } from 'svelte';
	import { lang } from '$lib/lang';
	import { pwa, startPwa, downloadBook, checkForUpdate, applyUpdate, installBook } from '$lib/pwa';

	const copy = {
		zh: {
			title: '离线阅读与安装', intro: '下载完整书籍后，三种语言、代码示例和互动练习均可离线使用。下载包括字体与代码高亮文件，可能需要较多空间。外部链接仍需联网。',
			checking: '正在检查离线支持…', native: '桌面应用已包含完整书籍，无需另行下载或安装。', development: '离线下载与安装在正式构建中可用；开发服务器不启用服务工作线程。', insecure: '离线阅读需要HTTPS或localhost。', unsupported: '此浏览器无法启用离线存储。请使用支持服务工作线程的浏览器，并允许网站存储。',
			idle: '尚未下载完整书籍。', ready: '完整书籍已下载，可离线阅读。', download: '下载完整书籍', retry: '重新下载', downloading: '正在下载', files: '个文件', offline: '当前离线', online: '当前在线', keepOpen: '下载期间请保持此页面打开。全部文件保存成功后才会显示可离线阅读。',
			deployment: '网站已发布新版本。请检查更新，下载完整更新后再应用；本次下载未完成离线保存。', failed: '下载未完成。请恢复网络连接后重试；先前完整下载的版本会保留。', storage: '存储空间不足或浏览器禁止保存。请释放空间、允许网站存储后重试。', incomplete: '请先完整下载更新，再应用更新。',
			update: '发现新版本', updateDetail: '当前版本仍可使用。先下载完整更新，再应用更新并重新加载页面。', updateDownload: '下载更新', updateReady: '更新已完整下载。', apply: '应用更新并重新加载', check: '检查更新', checkingUpdate: '正在检查…', checked: '更新检查完成。', connection: '无法连接更新服务。请确认网络后重试。', registration: '离线功能启动失败。请检查HTTPS、网站存储设置和网络连接。', installFailed: '未能打开安装提示。可以使用浏览器菜单安装。',
			install: '安装此书', installed: '已作为应用打开或安装。', installHelp: '使用浏览器菜单中的“安装应用”或“添加到主屏幕”。在iPhone / iPad上，用Safari的分享菜单选择“添加到主屏幕”。安装与离线下载是两个独立步骤。', retention: '浏览器可能回收网站存储。出行前请在此确认下载状态；学习记录请另行导出备份。'
		},
		en: {
			title: 'Offline reading and installation', intro: 'Download the complete book to use all three languages, code examples and interactive lessons offline. Fonts and code highlighting are included, so the download needs storage space. External links still need a connection.',
			checking: 'Checking offline support…', native: 'The desktop app already includes the complete book. No extra download or installation is needed.', development: 'Offline download and installation are available in production builds. The development server does not register a service worker.', insecure: 'Offline reading requires HTTPS or localhost.', unsupported: 'This browser cannot enable offline storage. Use a browser with service worker support and allow website storage.',
			idle: 'The complete book has not been downloaded.', ready: 'The complete book is downloaded and ready offline.', download: 'Download complete book', retry: 'Retry download', downloading: 'Downloading', files: 'files', offline: 'You are offline', online: 'You are online', keepOpen: 'Keep this page open while downloading. Offline readiness appears only after every file is saved.',
			deployment: 'The website has a newer build. Check for updates, download the complete update, then apply it. This download was not saved for offline use.', failed: 'The download did not finish. Reconnect and retry; the previous complete download is retained.', storage: 'Storage is full or this browser prevents saving. Free some space and allow website storage, then retry.', incomplete: 'Download the complete update before applying it.',
			update: 'A new version is available', updateDetail: 'You can keep using this version. Download the complete update, then apply it and reload the page.', updateDownload: 'Download update', updateReady: 'The complete update is downloaded.', apply: 'Apply update and reload', check: 'Check for updates', checkingUpdate: 'Checking…', checked: 'Update check completed.', connection: 'Could not connect to the update service. Check your connection and try again.', registration: 'Offline support could not start. Check HTTPS, website storage settings and your connection.', installFailed: 'The installation prompt could not open. You can install from the browser menu.',
			install: 'Install this book', installed: 'Opened or installed as an app.', installHelp: 'Use “Install app” or “Add to Home Screen” in your browser menu. On iPhone / iPad, use Safari’s Share menu and choose “Add to Home Screen”. Installation and the offline download are separate steps.', retention: 'Browsers may reclaim website storage. Check download status here before travelling; export a separate backup of your learning records.'
		},
		ja: {
			title: 'オフライン閲覧とインストール', intro: '本全体をダウンロードすると、3言語の本文、コード例、体験レッスンをオフラインで利用できます。フォントやコードの色分け用ファイルも含むため、空き容量が必要です。外部リンクには通信が必要です。',
			checking: 'オフライン対応を確認中…', native: 'デスクトップアプリには本全体が含まれています。追加のダウンロードやインストールは不要です。', development: 'オフライン機能とインストールは本番ビルドで利用できます。開発サーバーではService Workerを登録しません。', insecure: 'オフライン閲覧にはHTTPSまたはlocalhostが必要です。', unsupported: 'このブラウザーではオフライン保存を有効にできません。Service Worker対応のブラウザーでサイトの保存を許可してください。',
			idle: '本全体はまだダウンロードされていません。', ready: '本全体を保存しました。オフラインで読めます。', download: '本全体をダウンロード', retry: 'もう一度ダウンロード', downloading: 'ダウンロード中', files: 'ファイル', offline: 'オフラインです', online: 'オンラインです', keepOpen: '完了するまでこのページを開いておいてください。全ファイルの保存に成功してから、オフラインで利用可能と表示します。',
			deployment: 'サイトが新しい版に更新されました。「更新を確認」から更新全体をダウンロードして適用してください。今回のダウンロードはオフライン保存されていません。', failed: 'ダウンロードが完了しませんでした。接続を確認して再試行してください。以前に完全保存した版は保持されます。', storage: '空き容量がないか、保存が制限されています。容量を確保し、サイトの保存を許可して再試行してください。', incomplete: '更新全体をダウンロードしてから適用してください。',
			update: '新しい版があります', updateDetail: '現在の版は引き続き使えます。更新全体をダウンロードしてから適用すると、ページが再読み込みされます。', updateDownload: '更新をダウンロード', updateReady: '更新全体を保存しました。', apply: '更新を適用して再読み込み', check: '更新を確認', checkingUpdate: '確認中…', checked: '更新の確認が完了しました。', connection: '更新サービスに接続できませんでした。接続を確認して再試行してください。', registration: 'オフライン機能を起動できませんでした。HTTPS、サイトの保存設定、接続を確認してください。', installFailed: 'インストール画面を開けませんでした。ブラウザーのメニューからインストールできます。',
			install: 'この本をインストール', installed: 'アプリとして開いているか、インストール済みです。', installHelp: 'ブラウザーのメニューから「アプリをインストール」または「ホーム画面に追加」を選びます。iPhone / iPadではSafariの共有メニューから「ホーム画面に追加」を選んでください。インストールとオフライン保存は別の操作です。', retention: 'ブラウザーがサイトの保存データを削除する場合があります。外出前にここで保存状態を確認し、学習記録は別途バックアップしてください。'
		}
	};
	const t = $derived(copy[$lang]);
	const current = $derived($pwa.current);
	const update = $derived($pwa.update);
	const downloading = $derived(current?.phase === 'downloading');
	onMount(() => { void startPwa(); });
</script>

<section class="offline-panel" aria-labelledby="offline-title" data-testid="offline-panel">
	<h2 id="offline-title">{t.title}</h2>
	<p>{t.intro}</p>
	{#if $pwa.availability !== 'ready'}
		<p role="status">{t[$pwa.availability]}</p>
	{:else}
		<p class="connection">{$pwa.online ? t.online : t.offline}</p>
		<div role="status" data-testid="offline-status">
			{#if current?.ready}<p class="ready">{t.ready}</p>
			{:else if downloading}<p>{t.downloading}: {current?.completed ?? 0} / {current?.total ?? 0} {t.files}</p>
			{:else if current?.phase === 'error'}<p class="error">{current.error === 'storage' ? t.storage : current.error === 'deployment' ? t.deployment : t.failed}</p>
			{:else}<p>{t.idle}</p>{/if}
		</div>
		{#if downloading}
			<progress max={current?.total || 1} value={current?.completed || 0} aria-label={t.downloading}></progress>
			<p class="help">{t.keepOpen}</p>
		{:else if !current?.ready}
			<button type="button" onclick={() => downloadBook()} disabled={!$pwa.online} data-testid="download-book">{current?.phase === 'error' ? t.retry : t.download}</button>
		{/if}
		{#if update}
			<div class="update" data-testid="offline-update">
				<h3>{t.update}</h3>
				<p>{t.updateDetail}</p>
				<div role="status">
					{#if update.ready}<p class="ready">{t.updateReady}</p>
					{:else if update.phase === 'downloading'}<p>{t.downloading}: {update.completed} / {update.total} {t.files}</p>
					{:else if update.phase === 'error'}<p class="error">{update.error === 'storage' ? t.storage : update.error === 'incomplete' ? t.incomplete : update.error === 'deployment' ? t.deployment : t.failed}</p>{/if}
				</div>
				{#if update.ready}<button type="button" onclick={applyUpdate} data-testid="apply-update">{t.apply}</button>
				{:else if update.phase === 'downloading'}<progress max={update.total || 1} value={update.completed} aria-label={t.downloading}></progress>
				{:else}<button type="button" onclick={() => downloadBook(true)} disabled={!$pwa.online} data-testid="download-update">{t.updateDownload}</button>{/if}
			</div>
		{/if}
		<div class="actions">
			<button type="button" class="secondary" onclick={checkForUpdate} disabled={!$pwa.online || $pwa.checkingUpdate}>{$pwa.checkingUpdate ? t.checkingUpdate : t.check}</button>
			{#if $pwa.canInstall && !$pwa.installed}<button type="button" onclick={installBook}>{t.install}</button>{/if}
		</div>
		{#if $pwa.checkedUpdate && !update}<p role="status" class="help">{t.checked}</p>{/if}
		{#if $pwa.installed}<p class="help">{t.installed}</p>{:else}<p class="help">{t.installHelp}</p>{/if}
		<p class="help">{t.retention}</p>
	{/if}
	{#if $pwa.error}<p role="alert" class="error">{$pwa.error === 'registration' ? t.registration : $pwa.error === 'install' ? t.installFailed : t.connection}</p>{/if}
</section>

<style>
	.offline-panel { border: 1px solid var(--border); border-radius: 12px; padding: clamp(1rem, 3vw, 1.6rem); background: var(--bg-sidebar); }
	h2 { margin: 0 0 .7rem; font: 600 calc(1.35rem * var(--scale-heading)) / 1.5 var(--font-serif); }
	h3 { margin: 0 0 .5rem; font-size: 1.05rem; }
	p { margin: .65rem 0; overflow-wrap: anywhere; }
	.connection, .help { font-size: .9em; color: var(--text-muted); }
	.ready { font-weight: 600; }
	.error { color: var(--accent-text); }
	button { min-height: 44px; padding: .65rem 1rem; border: 1px solid var(--accent-strong); border-radius: 8px; background: var(--accent-strong); color: var(--bg); font: inherit; font-weight: 600; cursor: pointer; white-space: normal; }
	button.secondary { color: var(--text); border-color: var(--border); background: var(--bg); }
	button:disabled { cursor: default; opacity: .55; }
	button:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
	.actions { display: flex; flex-wrap: wrap; gap: .65rem; margin: 1rem 0; }
	.update { border-top: 1px solid var(--border); margin-top: 1.25rem; padding-top: 1rem; }
	progress { width: 100%; accent-color: var(--accent); height: 12px; }
	@media (max-width: 420px) { button { width: 100%; } }
</style>
