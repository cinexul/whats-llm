import type { Lang } from './manifest';

const en = {
	title: 'Learning paths',
	intro: 'Choose a result you want to produce. Read the selected chapters, do the exercise, then check your own work.',
	preview: 'Learn toward a useful result',
	previewIntro: 'Three guided routes through the book, with small tasks and a result you can check.',
	viewPath: 'View path',
	allPaths: 'All learning paths',
	prerequisites: 'Before you start',
	result: 'What you will make',
	progress: 'checkpoints complete',
	start: 'Start with the first step',
	continue: 'Continue with the next step',
	finished: 'Path complete. Keep your result and use the checks again on your next task.',
	empty: 'No checkpoints yet. Start with the first step and save a checkpoint when you have produced and checked its result.',
	shared: 'Checkpoints are saved on this device and shared across Chinese, Japanese, and English. Opening a chapter does not complete a step. Keep your written work in your own files.',
	step: 'Step',
	read: 'Selected reading',
	action: 'Try it',
	deliverable: 'Your deliverable',
	checks: 'Check your work',
	checkpoint: 'I produced the deliverable and checked every criterion',
	completed: 'Complete',
	next: 'Next step',
	reset: 'Reset this path',
	resetQuestion: 'Clear the checkpoints for this path? Your other paths and reading history will stay as they are.',
	confirmReset: 'Clear these checkpoints',
	cancel: 'Keep my progress',
	resetDone: 'Checkpoints for this path cleared.',
	readIssue: 'Device storage is unavailable. You can still practice, but checkpoints may only last for this session.',
	writeIssue: 'This change is available in this session, but could not be saved on this device. Keep a note before closing the page.',
	invalidIssue: 'Some saved checkpoints could not be read or were no longer recognized. Valid checkpoints were kept; no other steps were marked complete.',
	saved: 'Checkpoint saved on this device.',
	unmarked: 'Checkpoint marked incomplete.',
	back: 'Back to paths'
};

export const learningPathUi: Record<Lang, typeof en> = {
	en,
	zh: {
		title: '学习路线', intro: '选一个想完成的成果。按提示阅读，动手练习，再自己核对成果。',
		preview: '带着目标来学习', previewIntro: '三条精简路线，连接阅读、小练习和可检验的成果。', viewPath: '查看路径', allPaths: '全部学习路线',
		prerequisites: '开始前准备', result: '你将完成', progress: '个检查点已完成', start: '从第一步开始', continue: '继续下一步',
		finished: '这条路径已完成。保存你的成果，下次任务继续使用这些核查标准。', empty: '还没有检查点。从第一步开始，产出成果并检查后，再勾选完成。',
		shared: '检查点保存在此设备上，中日英三种语言共用。打开章节不会自动完成步骤。练习成果请保存在你自己的文件中。',
		step: '步骤', read: '选读章节', action: '动手练习', deliverable: '本步成果', checks: '自我检查', checkpoint: '我已完成成果，并逐项检查以上标准', completed: '已完成', next: '下一步',
		reset: '重置这条路径', resetQuestion: '清除此路径的检查点？其他路径和阅读记录将保留。', confirmReset: '清除这些检查点', cancel: '保留我的进度', resetDone: '此路径的检查点已清除。',
		readIssue: '无法使用设备存储。你仍可练习，但检查点可能只在本次会话中保留。', writeIssue: '本次变更仍在当前会话中，但未能保存到设备。关闭页面前请另行记录。',
		invalidIssue: '部分已保存检查点无法读取或无法识别。有效记录已保留，没有自动完成其他步骤。', saved: '检查点已保存到此设备。', unmarked: '检查点已标为未完成。', back: '返回路径列表'
	},
	ja: {
		title: '学習コース', intro: 'つくりたい成果を選び、指定の章を読み、練習して、自分で結果を確かめます。',
		preview: '成果を目指して学ぶ', previewIntro: '読書、小さな練習、確認できる成果をつなぐ3つの道筋です。', viewPath: 'パスを見る', allPaths: 'すべての学習コース',
		prerequisites: '始める前に', result: 'つくるもの', progress: 'チェックポイント完了', start: '最初のステップから始める', continue: '次のステップへ進む',
		finished: 'このパスは完了です。成果を保存し、次のタスクでも確認項目を使いましょう。', empty: 'チェックポイントはまだありません。最初のステップで成果をつくり、確認してから完了にします。',
		shared: 'チェックポイントはこの端末に保存され、中国語・日本語・英語で共通です。章を開いただけでは完了になりません。練習の成果は自分のファイルに保存してください。',
		step: 'ステップ', read: '選んで読む章', action: 'やってみる', deliverable: 'このステップの成果', checks: '自分で確認', checkpoint: '成果をつくり、すべての条件を確認しました', completed: '完了', next: '次のステップ',
		reset: 'このパスをリセット', resetQuestion: 'このパスのチェックポイントを消しますか？ほかのパスと読書の記録は残ります。', confirmReset: 'このチェックポイントを消す', cancel: '進捗を残す', resetDone: 'このパスのチェックポイントを消しました。',
		readIssue: '端末の保存領域を利用できません。練習は続けられますが、チェックポイントはこのセッションだけになる可能性があります。', writeIssue: '変更はこのセッションに残っていますが、端末に保存できませんでした。閉じる前に別途メモしてください。',
		invalidIssue: '一部の保存済みチェックポイントを読み取れないか、識別できませんでした。有効な記録を残し、ほかのステップを完了にはしていません。', saved: 'チェックポイントをこの端末に保存しました。', unmarked: 'チェックポイントを未完了にしました。', back: 'パス一覧に戻る'
	}
};
