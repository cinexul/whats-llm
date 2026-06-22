// 言語に依存する UI 文言。文字列データは ui.json に分離してある(本文ではなく画面ラベルのみ)。
import type { Lang } from './manifest';
import uiData from './ui.json';

export interface UiStrings {
	appTitle: string; // ヘッダー / タブのタイトル
	coverLabel: string; // トップページのラベル
	coverTitleHtml: string; // トップページの大見出し(改行込み)
	coverLead: string; // トップページのリード文
	allChaptersLabel: string; // 「全N章」相当(テンプレート、{n} を章数で置換)
	coverNote: string; // トップ下部の注記(公式ドキュメント案内)
	search: string;
	searchPlaceholder: string;
	searchEmpty: string;
	searchNoHit: string;
	searchSemantic: string; // 「関連する節(意味検索)」見出し
	searchFulltext: string; // 「キーワード一致」見出し
	display: string;
	prev: string;
	next: string;
	comingSoon: string;
	comingSoonBody: string;
	thisPage: string;
	language: string;
	readMark: string;
	theme: string;
	themeLight: string;
	themeDark: string;
	fontSize: string;
	fsNav: string;
	fsHeading: string;
	fsBody: string;
	fsDecrease: string;
	fsIncrease: string;
	fsReset: string;
	resetRead: string;
	copyCode: string;
	copyLabel: string;
	copiedLabel: string;
	marker: string;
	addNote: string;
	changeColor: string;
	deleteNote: string;
	notePlaceholder: string;
	saveClose: string;
	quizTitle: string;
	quizIntro: string;
	quizCorrect: string;
	quizWrong: string;
	quizAnswerIs: string;
	quizShowRef: string;
	quizScore: string;
	quizRetry: string;
	quizSelfCheck: string;
	// 間隔反復 (spaced repetition) + 学習進度
	srsDueRibbon: string; // 期限が来た章のクイズに付く案内
	srsRecorded: string; // 「学習進度に記録した」旨
	reviewInDays: string; // 「{n} 日後に復習」テンプレート({n} を日数で置換)
	masteryNew: string;
	masteryLearning: string;
	masteryReviewing: string;
	masteryMastered: string;
	progressLink: string; // トップバーのリンク / 進捗ページへの誘導
	progressTitle: string;
	progressSubtitle: string;
	statRead: string;
	statQuizzed: string;
	statMastered: string;
	statStreak: string;
	statDue: string;
	unitDays: string; // 連続学習日数の単位
	dueSectionTitle: string;
	dueEmpty: string; // 復習対象が無いとき
	reviewCta: string; // 「復習する」ボタン
	reviewDue: string; // 期限到来(バッジ)
	reviewDueToday: string;
	reviewOverdue: string; // 「{n} 日超過」テンプレート
	allChaptersTitle: string;
	notQuizzed: string; // 未受験の章
	resetSrs: string; // クイズ進捗のリセット
	// Insight ダッシュボード + 復習(クイズ抽出)セッション
	statRetention: string;
	duePrompt: string; // {n} を到期数で置換
	heatmapTitle: string;
	heatLess: string;
	heatMore: string;
	forecastTitle: string;
	today: string;
	reviewNav: string; // トップバーの「復習」
	reviewTitle: string;
	reviewLoading: string;
	reviewEmptyTitle: string;
	reviewDoneTitle: string;
	reviewDoneBody: string; // {c}=正解数 {n}=総数
	reviewNext: string;
	reviewFinish: string;
	resetAll: string;
	resetConfirm: string;
	resetYes: string;
	resetNo: string;
}

export const ui: Record<Lang, UiStrings> = uiData as Record<Lang, UiStrings>;
