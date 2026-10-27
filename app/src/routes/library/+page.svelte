<script lang="ts">
	import { lang } from '$lib/lang';
	import { ui } from '$lib/ui';
	import { BackupError, backupErrorMessage } from '$lib/backup-errors';
	import OfflinePanel from '$lib/OfflinePanel.svelte';
	import LocalEditsLibrary from '$lib/LocalEditsLibrary.svelte';
	import { exportBackup, parseBackup, importBackup, downloadBackup, backupCounts, MAX_BACKUP_BYTES, ImportError, type LearningBackup } from '$lib/backup';
	const copy = {
		en: { details: 'Technical details', eyebrow: 'YOUR LEARNING, WITH YOU', title: 'My library', intro: 'Keep the book and your learning close. No account needed.', backup: 'Carry your learning', detail: 'Save your chapter edits, notes, highlights, review history, reading positions, completed chapters, learning paths, and display settings in one JSON file.', export: 'Download my backup', import: 'Restore from a backup', file: 'Choose a JSON backup', preview: 'Ready to merge', policy: 'Newer chapter edits, resets, notes, reading positions, and card progress win. Equal timestamps keep this device’s version. Read chapters and checkpoints are combined; current display settings stay. Importing the same file again adds no duplicates.', confirm: 'Merge this backup', cancel: 'Cancel', recovery: 'Download pre-import backup', recoverDetail: 'Before merging, save a copy of this device’s data. It is also kept available here after import.', complete: 'Your learning has been merged.', reload: 'Reload to apply all settings', wait: 'Working…', exported: 'Backup download started.', failed: 'Could not complete this action.', local: 'Your backup stays on your device until you choose to share it. Keep it somewhere safe; it contains your chapter edits and notes.', selected: 'Selected file', counts: ['Notes & highlights', 'Study cards', 'Review events', 'Read chapters', 'Reading positions', 'Path checkpoints', 'Edited chapters'], conflict: 'Conflicting records resolved', ties: 'Equal timestamps kept on this device', size: 'Choose a JSON file smaller than 32 MB.', saved: 'Pre-import backup download started. You can now merge.', saveFirst: 'Save the pre-import backup to enable merging.', more: 'Exports version 2; accepts versions 1 and 2. Includes chapter edits, all three languages, and retired study cards. Version 1 imports preserve your existing chapter edits.' },
		zh: { details: '技术详情', eyebrow: '把学习带在身边', title: '我的书包', intro: '让书和学习记录随身而行，无需注册账号。', backup: '带走学习记录', detail: '将章节修改、笔记、高亮、复习历史、阅读位置、已读章节、学习路线和显示设置保存为一个JSON文件。', export: '下载我的备份', import: '从备份恢复', file: '选择JSON备份', preview: '准备合并', policy: '章节修改、重置、笔记、阅读位置和卡片进度以较新的记录为准；时间相同则保留本机版本。已读章节和路径检查点合并保留，显示设置保留本机值。重复导入同一文件不会产生重复记录。', confirm: '合并此备份', cancel: '取消', recovery: '下载导入前备份', recoverDetail: '合并前，请先保存本机数据的副本。导入后仍可在这里下载。', complete: '学习记录已合并。', reload: '重新加载以应用所有设置', wait: '处理中…', exported: '已开始下载备份。', failed: '未能完成此操作。', local: '备份由你保管，只有你选择分享时才会离开设备。其中包含你的章节修改和笔记，请妥善保存。', selected: '所选文件', counts: ['笔记与高亮', '学习卡片', '复习记录', '已读章节', '阅读位置', '路径检查点', '已修改章节'], conflict: '已处理冲突记录', ties: '时间相同，已保留本机版本', size: '请选择小于32 MB的JSON文件。', saved: '已开始下载导入前备份，现在可以合并。', saveFirst: '先保存导入前备份，即可开始合并。', more: '导出第2版，支持导入第1、2版。包含章节修改、三种语言的数据和旧版学习卡片。导入第1版会保留本机已有的章节修改。' },
		ja: { details: '技術的な詳細', eyebrow: '学びを、いつも手元に', title: 'マイライブラリ', intro: '本と学習記録を持ち歩きましょう。アカウントは不要です。', backup: '学習記録を持ち出す', detail: '章の編集、メモ、ハイライト、復習履歴、読書位置、読了章、学習コース、表示設定をひとつのJSONファイルに保存します。', export: 'バックアップをダウンロード', import: 'バックアップから復元', file: 'JSONバックアップを選択', preview: '統合の準備ができました', policy: '章の編集・リセット、メモ、読書位置、カードの進捗は新しい記録を優先し、同じ日時ならこの端末の記録を残します。読了章とチェック項目は統合し、表示設定はこの端末のものを使います。同じファイルを再度読み込んでも記録は重複しません。', confirm: 'このバックアップを統合', cancel: 'キャンセル', recovery: '読み込み前のバックアップを保存', recoverDetail: '統合する前に、この端末のデータを保存してください。読み込み後もここからダウンロードできます。', complete: '学習記録を統合しました。', reload: '再読み込みして設定を反映', wait: '処理中…', exported: 'バックアップのダウンロードを開始しました。', failed: 'この操作を完了できませんでした。', local: '共有するまでバックアップは手元にあります。章の編集やメモも含まれるので、大切に保管してください。', selected: '選択したファイル', counts: ['メモとハイライト', '学習カード', '復習記録', '読了した章', '読書位置', 'コースのチェック項目', '編集した章'], conflict: '解決した競合', ties: '同じ日時のためこの端末を優先', size: '32 MB未満のJSONファイルを選んでください。', saved: '読み込み前のバックアップの保存を開始しました。統合できます。', saveFirst: '読み込み前のバックアップを保存すると統合できます。', more: 'バージョン2で書き出し、1・2を読み込めます。章の編集、3言語すべて、旧版の学習カードを含みます。バージョン1の読み込みでも端末の章の編集は保持します。' }
	};
	const t = $derived(copy[$lang]);
	let candidate = $state<LearningBackup | null>(null);
	let recovery = $state<LearningBackup | null>(null);
	let savedRecovery = $state(false);
	let filename = $state('');
	let busy = $state(false);
	let error = $state('');
	let errorDetail = $state('');
	let status = $state('');
	let complete = $state(false);
	let conflicts = $state(0);
	let ties = $state(0);
	const counts = $derived(candidate ? Object.values(backupCounts(candidate)) : []);
	function failure(e: unknown) { error = backupErrorMessage(e, $lang); errorDetail = e instanceof Error ? e.message : String(e); }
	async function save() {
		busy = true; error = ''; status = '';
		try { downloadBackup(await exportBackup()); status = t.exported; } catch (e) { failure(e); } finally { busy = false; }
	}
	async function select(event: Event) {
		const input = event.currentTarget as HTMLInputElement; const file = input.files?.[0];
		if (!file) return;
		busy = true; error = ''; status = ''; candidate = null; savedRecovery = false; complete = false;
		try {
			if (file.size > MAX_BACKUP_BYTES) throw new BackupError('too-large', t.size);
			const parsed = parseBackup(await file.text());
			recovery = await exportBackup(); candidate = parsed; filename = file.name;
		} catch (e) { failure(e); } finally { busy = false; input.value = ''; }
	}
	async function saveRecovery() {
		busy = true; error = '';
		try {
			// 预览打开后若学习数据有变，重新生成安全副本。
			if (candidate) recovery = await exportBackup();
			if (recovery) { downloadBackup(recovery, 'whats-llm-before-import'); savedRecovery = true; status = t.saved; }
		} catch (e) { failure(e); } finally { busy = false; }
	}
	async function restore() {
		if (!candidate || !savedRecovery) return;
		busy = true; error = ''; status = '';
		try {
			const result = await importBackup(candidate);
			recovery = result.backup; conflicts = result.conflicts; ties = result.ties; candidate = null; complete = true; status = t.complete;
		} catch (e) {
			if (e instanceof ImportError) recovery = e.recovery;
			// 回滚失败可能只恢复部分数据；保留此前的安全副本，
			// 并关闭预览，避免下载恢复副本时重新导出不完整的数据。
			candidate = null; savedRecovery = false; failure(e);
		} finally { busy = false; }
	}
</script>

<svelte:head><title>{t.title} | {ui[$lang].appTitle}</title></svelte:head>
<div class="library">
	<header><p class="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p class="intro">{t.intro}</p></header>
	<OfflinePanel />
	<LocalEditsLibrary />
	<section class="paper" aria-labelledby="backup-title">
		<h2 id="backup-title">{t.backup}</h2><p>{t.detail}</p>
		<button class="primary" disabled={busy} onclick={save}>{busy ? t.wait : t.export}</button>
		<p class="aside">{t.local}</p>
	</section>
	<section class="paper" aria-labelledby="import-title">
		<h2 id="import-title">{t.import}</h2>
		<label for="backup-file" class="file-label">{t.file}</label>
		<input id="backup-file" type="file" accept="application/json,.json" disabled={busy} onchange={select} aria-describedby="backup-format" />
		<p class="aside" id="backup-format">{t.more}</p>
		{#if candidate}
			<div class="preview"><h3>{t.preview}</h3><p class="filename">{t.selected}: {filename}</p>
				<dl>{#each counts as count, i}<div><dt>{t.counts[i]}</dt><dd>{count.toLocaleString($lang)}</dd></div>{/each}</dl>
				<p>{t.policy}</p><p>{t.recoverDetail}</p>
				<button disabled={busy} onclick={saveRecovery}>{t.recovery}</button>
				{#if !savedRecovery}<p class="aside">{t.saveFirst}</p>{/if}
				<div class="actions"><button class="primary" disabled={busy || !savedRecovery} onclick={restore}>{busy ? t.wait : t.confirm}</button><button disabled={busy} onclick={() => { candidate = null; status = ''; }}>{t.cancel}</button></div>
			</div>
		{/if}
	</section>
	{#if error}<p class="message error" role="alert">{error}</p><details><summary>{t.details}</summary><p class="aside">{errorDetail}</p></details>{/if}
	<p class="message" role="status" aria-live="polite">{status}</p>
	{#if complete}<p>{t.conflict}: {conflicts} · {t.ties}: {ties}</p><button onclick={() => window.location.reload()}>{t.reload}</button>{/if}
	{#if recovery && !candidate}<button disabled={busy} onclick={saveRecovery}>{t.recovery}</button>{/if}
</div>

<style>
	.library { max-width: 860px; margin: 0 auto; padding: clamp(1.25rem, 5vw, 3rem); color: var(--text); }
	header { margin-bottom: 2rem; } .eyebrow { color: var(--accent-text); font: 600 .7rem/1.5 var(--font-sans); letter-spacing: .13em; }
	h1 { font: 600 calc(2.1rem * var(--scale-heading, 1))/1.3 var(--font-serif); margin: .55rem 0; } .intro { color: var(--text-muted); }
	h2 { font: 600 calc(1.35rem * var(--scale-heading, 1))/1.4 var(--font-serif); margin: 0 0 .65rem; } h3 { font: 600 1.15rem/1.5 var(--font-serif); }
	p { font-size: calc(.95rem * var(--scale-body, 1)); line-height: 1.8; } .paper { border-top: 1px solid var(--border); padding: 1.75rem 0; margin-top: 1rem; }
	.aside { font-size: calc(.8rem * var(--scale-body, 1)); color: var(--text-muted); } button { min-height: 46px; padding: .7rem 1rem; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); color: var(--text); font: 500 .9rem/1.5 var(--font-sans); cursor: pointer; max-width: 100%; }
	button.primary { background: var(--accent); border-color: var(--accent); color: #faf9f5; } button:disabled { opacity: .5; cursor: default; } button:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
	.file-label { display: block; font-weight: 600; margin: 1rem 0 .7rem; } input { max-width: 100%; width: 100%; min-height: 44px; color: var(--text); font: .88rem/1.5 var(--font-sans); } input::file-selector-button { padding: .65rem; margin-right: .6rem; color: var(--text); background: var(--bg-sidebar); border: 1px solid var(--border); border-radius: 8px; }
	.preview { padding: clamp(1rem, 3vw, 1.5rem); margin-top: 1rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-sidebar); } .filename { overflow-wrap: anywhere; }
	dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem 1.5rem; margin: 1.2rem 0; } dl div { padding: .6rem 0; border-bottom: 1px solid var(--border); } dt { color: var(--text-muted); font-size: .82rem; line-height: 1.5; } dd { margin: .3rem 0 0; font: 600 1.3rem/1.4 var(--font-serif); }
	.actions { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: 1.2rem; } .message { overflow-wrap: anywhere; } .message:empty { display: none; } .error { color: var(--text); padding: 1rem; border-left: 3px solid #b04a37; background: var(--bg-sidebar); }
	details summary { display: flex; align-items: center; min-height: 44px; cursor: pointer; color: var(--text-muted); } details p { overflow-wrap: anywhere; }
	@media (max-width: 480px) { h1 { font-size: calc(1.8rem * var(--scale-heading, 1)); } .actions { flex-direction: column; } .actions button { width: 100%; } }
</style>
