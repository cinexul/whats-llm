import type { Lang } from './manifest';

export type BackupErrorCode = 'invalid-json' | 'invalid-data' | 'unsupported-version' | 'unsupported-chapter' | 'unsupported-path' | 'unsupported-lock' | 'too-large' | 'local-data' | 'storage' | 'recovery';
export class BackupError extends Error {
	constructor(public code: BackupErrorCode, detail: string, options?: ErrorOptions) { super(detail, options); }
}
const messages: Record<Lang, Record<BackupErrorCode, string>> = {
	en: {
		'invalid-json': 'This file is not readable JSON. Choose an unmodified backup exported by this app.',
		'invalid-data': 'This backup contains invalid or unsupported data. Choose an unmodified backup exported by this app.',
		'unsupported-version': 'This backup uses an unsupported version. Update the app before importing it.',
		'unsupported-chapter': 'This backup contains a reading position or resume chapter that this book does not support. Update the app before importing it.',
		'unsupported-path': 'This backup contains a learning path or checkpoint that this book does not support. Update the app before importing it.',
		'unsupported-lock': 'Import has not started because this environment cannot coordinate writes between tabs. Use a current browser over HTTPS or localhost, or update your system WebView for the desktop app.',
		'too-large': 'The backup is too large. Choose a file smaller than 32 MB; the combined data must also fit this limit.',
		'local-data': 'This device’s learning data could not be read completely. No import has started. Check the saved data and available storage before trying again.',
		'storage': 'The data could not be saved. Storage may be full or unavailable. Keep the pre-import backup and try again when storage is available.',
		'recovery': 'Import failed and automatic recovery could not finish. Keep the pre-import backup and reload the page before continuing.'
	},
	zh: {
		'invalid-json': '此文件不是有效的JSON。请选择由本应用导出的、未经修改的备份。',
		'invalid-data': '此备份包含无效或不受支持的数据。请选择由本应用导出的、未经修改的备份。',
		'unsupported-version': '此备份使用了当前不支持的版本，请先更新应用再导入。',
		'unsupported-chapter': '此备份的阅读位置或续读章节不受当前书籍支持，请先更新应用再导入。',
		'unsupported-path': '此备份的学习路径或检查点不受当前书籍支持，请先更新应用再导入。',
		'unsupported-lock': '当前环境无法协调多个标签页的写入，尚未开始导入。请使用新版浏览器通过HTTPS或localhost打开应用；桌面应用请更新系统WebView。',
		'too-large': '备份过大。请选择小于32 MB的文件，合并后的数据也不能超过此限制。',
		'local-data': '无法完整读取本机学习数据，尚未开始导入。请检查已保存的数据及可用存储空间后重试。',
		'storage': '无法保存数据，存储空间可能已满或不可用。请保留导入前备份，待存储恢复可用后重试。',
		'recovery': '导入失败，自动恢复未能完成。请保留导入前备份，并在继续操作前重新加载页面。'
	},
	ja: {
		'invalid-json': 'このファイルは有効なJSONではありません。このアプリから書き出した、編集していないバックアップを選んでください。',
		'invalid-data': 'このバックアップには無効なデータ、または未対応のデータが含まれています。このアプリから書き出した、編集していないバックアップを選んでください。',
		'unsupported-version': 'このバックアップのバージョンには対応していません。アプリを更新してから読み込んでください。',
		'unsupported-chapter': 'このバックアップの読書位置、または続きから読む章は現在の本に対応していません。アプリを更新してから読み込んでください。',
		'unsupported-path': 'このバックアップの学習コース、またはチェック項目は現在の本に対応していません。アプリを更新してから読み込んでください。',
		'unsupported-lock': 'この環境ではタブ間の書き込みを調整できないため、読み込みは開始していません。最新のブラウザーでHTTPSまたはlocalhostを使用するか、デスクトップアプリ用のシステムWebViewを更新してください。',
		'too-large': 'バックアップが大きすぎます。32 MB未満のファイルを選んでください。統合後のデータもこの上限以内である必要があります。',
		'local-data': 'この端末の学習データを完全に読み取れませんでした。読み込みは開始していません。保存データと空き容量を確認してから再試行してください。',
		'storage': 'データを保存できませんでした。空き容量が不足しているか、保存先を利用できません。読み込み前のバックアップを保管し、保存先が利用できるようになってから再試行してください。',
		'recovery': '読み込みに失敗し、自動復元を完了できませんでした。読み込み前のバックアップを保管し、続ける前にページを再読み込みしてください。'
	}
};
export function backupErrorMessage(error: unknown, lang: Lang): string {
	const code = error instanceof BackupError ? error.code : 'storage';
	return messages[lang][code];
}
