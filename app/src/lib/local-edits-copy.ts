import type { Lang } from './manifest';

export const localEditsCopy = {
	zh: {
		badge: '本地修改', edit: '编辑本章', diff: '查看改动', restore: '恢复原文', saved: '保存于',
		library: '我的修改', libraryIntro: '三种语言中改过的章节都在这里。修改仅保存在当前浏览器或桌面应用中；请在下方导出备份。',
		empty: '还没有本地修改。在任一章节标题下选择“编辑本章”即可开始。', all: '查看全部修改',
		scope: '仅修改本章正文；章节标题、原书测验和全书搜索保持原书内容。修改不会上传。',
		metadata: '本地文字未经原书复核；章末修订日期和来源说明对应原书。',
		updated: '原书已更新。你的修改仍保留，并以首次编辑时的原文作对比；可切换对比当前原文。',
		editor: '本章的本地版本', writing: '编辑', preview: '预览', changes: '改动对比', close: '关闭', save: '保存修改', saving: '保存中…',
		markdown: '章节正文（Markdown）', draft: '有未保存的修改', clean: '草稿未改动', download: '下载Markdown',
		discard: '有尚未保存的修改。确定放弃这些草稿并关闭吗？',
		confirmRestore: '恢复当前原书正文？本章的本地修改将被移除。需要保留时，请先下载Markdown或导出备份。',
		baseline: '首次编辑时的原文', current: '当前原文', compare: '对比基准', added: '新增', removed: '删除', lines: '行', same: '未改动的内容',
		noChanges: '与所选原文完全一致。', fallback: '改动较多，已显示完整的删除和新增内容。', loading: '正在生成预览…',
		errors: {
			unsupported: '当前环境无法协调多个窗口的写入，尚未保存。请先下载Markdown，再使用新版浏览器通过HTTPS（或本机localhost）打开；桌面版请更新系统WebView。',
			storage: '无法保存或读取本地数据。草稿仍在编辑器里；可先下载Markdown，再检查存储空间或浏览器设置。',
			'invalid-data': '已有的本地修改数据无法读取，尚未覆盖。请保留现有数据，使用有效备份恢复。',
			conflict: '此章已在其他窗口或备份导入中发生变化。当前草稿未保存；请先下载草稿，关闭后重新打开并核对。',
			'too-large': '内容超出本地存储上限（每份正文20万字符，全部正文与原文合计200万字符）。请先下载草稿。',
			preview: '暂时无法生成预览。草稿仍在；可以返回编辑或下载Markdown。'
		}
	},
	en: {
		badge: 'Locally edited', edit: 'Edit chapter', diff: 'View changes', restore: 'Restore original', saved: 'Saved',
		library: 'My chapter edits', libraryIntro: 'Find edits across all three languages here. They stay in this browser or desktop app; export a backup below to keep a copy.',
		empty: 'No local edits yet. Choose “Edit chapter” below a chapter title to begin.', all: 'All chapter edits',
		scope: 'Edit this chapter’s body only. Chapter titles, official quizzes, and book search use the original book. Edits are not uploaded.',
		metadata: 'Local text has not been reviewed by the book’s editors. Revision dates and sources below refer to the original book.',
		updated: 'The original book has changed. Your edits are preserved and compared with the original from your first edit. You can also compare with the current original.',
		editor: 'Your local chapter', writing: 'Edit', preview: 'Preview', changes: 'Changes', close: 'Close', save: 'Save changes', saving: 'Saving…',
		markdown: 'Chapter body (Markdown)', draft: 'Unsaved changes', clean: 'No unsaved changes', download: 'Download Markdown',
		discard: 'You have unsaved changes. Discard this draft and close?',
		confirmRestore: 'Restore the current original chapter? This removes your local edit. Download its Markdown or export a backup first if you want to keep it.',
		baseline: 'Original at first edit', current: 'Current original', compare: 'Compare against', added: 'Added', removed: 'Removed', lines: 'lines', same: 'Unchanged content',
		noChanges: 'Identical to the selected original.', fallback: 'For this large change, the full removed and added content is shown.', loading: 'Preparing preview…',
		errors: {
			unsupported: 'This environment cannot coordinate writes across windows. Nothing was saved. Download the Markdown, then use a current browser over HTTPS (or localhost), or update the desktop system WebView.',
			storage: 'Local data could not be saved or read. Your draft remains in the editor. Download its Markdown, then check storage space or browser settings.',
			'invalid-data': 'Existing local edits could not be read and have not been overwritten. Keep the existing data and restore a valid backup.',
			conflict: 'This chapter changed in another window or a backup import. Your draft was not saved. Download it, then close and reopen the editor to compare.',
			'too-large': 'The local edit limit was reached: 200,000 characters per body and 2,000,000 across all bodies and originals. Download your draft first.',
			preview: 'The preview could not be generated. Your draft is still here; return to editing or download its Markdown.'
		}
	},
	ja: {
		badge: 'ローカル編集あり', edit: '本文を編集', diff: '変更を確認', restore: '原文に戻す', saved: '保存日時',
		library: '編集した章', libraryIntro: '3言語の編集済みの章をまとめて確認できます。変更はこのブラウザーまたはデスクトップアプリに保存されます。下のバックアップ機能で書き出しておきましょう。',
		empty: 'まだ編集した章はありません。章タイトルの下にある「本文を編集」から始められます。', all: '編集した章の一覧',
		scope: '編集できるのはこの章の本文だけです。章タイトル・原書の小テスト・全文検索は原書の内容を使用します。変更はアップロードされません。',
		metadata: 'ローカルの文章は原書の編集者による確認を受けていません。章末の改訂日や出典は原書に関する情報です。',
		updated: '原書が更新されています。編集内容は保持され、初回編集時の原文との差分を表示します。現在の原文との比較にも切り替えられます。',
		editor: 'この章のローカル版', writing: '編集', preview: 'プレビュー', changes: '変更点', close: '閉じる', save: '変更を保存', saving: '保存中…',
		markdown: '章の本文（Markdown）', draft: '未保存の変更があります', clean: '未保存の変更はありません', download: 'Markdownをダウンロード',
		discard: '未保存の変更があります。下書きを破棄して閉じますか？',
		confirmRestore: '現在の原文に戻しますか？この章のローカル編集は削除されます。残したい場合は、先にMarkdownまたはバックアップを書き出してください。',
		baseline: '初回編集時の原文', current: '現在の原文', compare: '比較対象', added: '追加', removed: '削除', lines: '行', same: '変更のない部分',
		noChanges: '選択した原文と同じです。', fallback: '変更量が多いため、削除・追加した内容を全文表示しています。', loading: 'プレビューを生成中…',
		errors: {
			unsupported: 'この環境ではウィンドウ間の書き込みを調整できないため、保存していません。Markdownをダウンロードし、最新のブラウザーでHTTPS（またはlocalhost）から開くか、デスクトップのシステムWebViewを更新してください。',
			storage: 'ローカルデータを保存または読み込みできませんでした。下書きは編集画面に残っています。Markdownをダウンロードし、空き容量やブラウザーの設定を確認してください。',
			'invalid-data': '既存のローカル編集を読み込めません。上書きはしていません。既存のデータを保管し、有効なバックアップから復元してください。',
			conflict: '別のウィンドウやバックアップの取り込みで、この章が変更されました。下書きは未保存です。ダウンロードしてから編集画面を開き直し、内容を確認してください。',
			'too-large': '保存上限に達しました。本文1件あたり20万文字、原文を含む全体で200万文字までです。先に下書きをダウンロードしてください。',
			preview: 'プレビューを生成できませんでした。下書きは残っています。編集に戻るかMarkdownをダウンロードしてください。'
		}
	}
} satisfies Record<Lang, unknown>;

export function localEditErrorText(lang: Lang, code: string): string {
	const errors = localEditsCopy[lang].errors;
	return errors[code as keyof typeof errors] ?? errors.storage;
}

export function editDate(lang: Lang, timestamp: number): string {
	return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : lang, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
}
