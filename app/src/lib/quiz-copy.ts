import type { Lang } from './manifest';

interface QuizCopy {
	due: string; mistakes: string; mistakeHint: string; topic: string; chapter: string;
	allTopics: string; allChapters: string; noMistakes: string; noMistakesBody: string;
	accuracy: string; accuracyHint: string; mistakeCount: string; backToChapter: string;
	saving: string; saved: string; practiceOnly: string; saveFailed: string; saveAgain: string; loadFailed: string;
}

export const quizCopy: Record<Lang, QuizCopy> = {
	en: {
		due: 'Due review', mistakes: 'Practice mistakes',
		mistakeHint: 'Practice questions whose latest answer was incorrect, even before their next review date. A correct answer clears that mistake.',
		topic: 'Topic', chapter: 'Chapter', allTopics: 'All topics', allChapters: 'All chapters',
		noMistakes: 'No mistakes to practice', noMistakesBody: 'There are no unresolved mistakes in this selection. Try a chapter quiz or choose another topic.',
		accuracy: 'Historical answer accuracy', accuracyHint: 'Correct answers as a share of all recorded answers in this language, including earlier question versions.',
		mistakeCount: '{n} questions to revisit', backToChapter: 'Read the chapter',
		saving: 'Saving answer…', saved: 'Answer saved', practiceOnly: 'Practice answer. Your first recorded answer sets the review schedule.', saveFailed: 'Could not save your answer. Your feedback is still available.',
		saveAgain: 'Try saving again', loadFailed: 'Could not load this review. Reload the page to try again.'
	},
	zh: {
		due: '到期复习', mistakes: '错题练习',
		mistakeHint: '练习最近一次答错的题目，无需等到复习日期。答对后，该题会移出错题列表。',
		topic: '主题', chapter: '章节', allTopics: '全部主题', allChapters: '全部章节',
		noMistakes: '暂无待练习的错题', noMistakesBody: '所选范围内没有尚未订正的错题。试试章末测验，或选择其他主题。',
		accuracy: '历史答题正确率', accuracyHint: '当前语言全部已记录答案中的正确比例，包含旧版本题目的记录。',
		mistakeCount: '{n} 道题需要回顾', backToChapter: '回看本章',
		saving: '正在保存答案…', saved: '答案已保存', practiceOnly: '本次为重新练习，复习安排以首次记录的答案为准。', saveFailed: '答案未能保存，仍可查看反馈。',
		saveAgain: '重试保存', loadFailed: '未能加载本次复习，请刷新页面重试。'
	},
	ja: {
		due: '期限の来た復習', mistakes: '間違えた問題を練習',
		mistakeHint: '直近の回答が不正解だった問題を、次の復習日を待たずに練習できます。正解すると間違い一覧から外れます。',
		topic: 'テーマ', chapter: '章', allTopics: 'すべてのテーマ', allChapters: 'すべての章',
		noMistakes: '練習する間違いはありません', noMistakesBody: '選んだ範囲に未訂正の間違いはありません。章末の小テストや別のテーマを試してみましょう。',
		accuracy: '過去の回答の正答率', accuracyHint: 'この言語で記録した全回答に占める正解の割合です。以前の問題バージョンの記録も含みます。',
		mistakeCount: '見直す問題が {n} 問あります', backToChapter: 'この章を読み直す',
		saving: '回答を保存しています…', saved: '回答を保存しました', practiceOnly: '練習の回答です。復習日程には最初に記録した回答を使います。', saveFailed: '回答を保存できませんでした。解説は引き続き確認できます。',
		saveAgain: '保存を再試行', loadFailed: '復習を読み込めませんでした。ページを再読み込みしてください。'
	}
};
