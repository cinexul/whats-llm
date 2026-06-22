// 章末の「小测验 / 小テスト」を構造化データへ変換する。
// 本文 Markdown から小テスト節を切り出し、設問・選択肢・正解・解説に分解して、
// インタラクティブな採点 UI (Quiz.svelte) で描画できるようにする。
import { Marked } from 'marked';

export interface QuizOption {
	letter: string; // A / B / C / D ...
	html: string; // 選択肢テキスト(インライン Markdown 済み)
}

export interface QuizQuestion {
	n: number; // 設問番号
	tag: string; // 種別タグ(例: 基础·概念题)
	promptHtml: string; // 設問文
	options: QuizOption[]; // 選択式でなければ空
	correct: string | null; // 正解のレター。観察問題など正解が無い場合 null
	explanationHtml: string; // 解説(正解マーカーは取り除いた残り)
}

export interface Quiz {
	introHtml: string; // 冒頭の案内文
	questions: QuizQuestion[];
}

const md = new Marked({ gfm: true });
const inline = (s: string): string => md.parseInline(s.trim()) as string;

// 設問を一意に識別する短いハッシュ(本文改訂を検知するため設問文から計算)。
// 採点の記録時と復習での照合で同じ値を使うので、両経路で必ずこの関数を通すこと。
// djb2(決定的・依存ゼロ)。
export function questionHash(promptHtml: string): string {
	let h = 5381;
	for (let i = 0; i < promptHtml.length; i++) {
		h = ((h << 5) + h + promptHtml.charCodeAt(i)) >>> 0;
	}
	return h.toString(36);
}

// 「## 小测验」または「## 小テスト」の見出し
const HEAD = /^##\s*(?:小测验|小テスト|Quiz)\s*$/m;
// 設問の開始行:  「1. **[基础·概念题]** 本文…」
const Q_START = /^(\d+)\.\s+(?:\*\*\[([^\]]+)\]\*\*)?\s*(.*)$/;
// 選択肢:  「   - A. 本文…」
const OPT = /^\s*[-*]\s+([A-Da-d])[.．、]\s*(.*)$/;
// 引用(解説)行
const QUOTE = /^\s*>\s?(.*)$/;
// 正解レターの抽出(答案 / 答え、全角コロン・空白を許容)
const CORRECT = /(?:答案|答え|Answer)[\s　：:]*([A-Da-d])/;

/** 本文を「小テスト前の本体」と「小テスト構造」に分割する。 */
export function splitQuiz(src: string): { body: string; quiz: Quiz | null } {
	const m = src.match(HEAD);
	if (!m || m.index === undefined) return { body: src, quiz: null };
	const body = src.slice(0, m.index).replace(/\s+$/, '') + '\n';
	const quiz = parseQuiz(src.slice(m.index + m[0].length));
	return { body, quiz: quiz && quiz.questions.length ? quiz : null };
}

function parseQuiz(s: string): Quiz {
	const lines = s.split('\n');
	const introLines: string[] = [];
	const questions: QuizQuestion[] = [];

	let i = 0;
	// 最初の設問より前にある引用/段落は案内文として集める
	while (i < lines.length && !Q_START.test(lines[i])) {
		const q = lines[i].match(QUOTE);
		if (q) introLines.push(q[1]);
		else if (lines[i].trim()) introLines.push(lines[i].trim());
		i++;
	}

	while (i < lines.length) {
		const start = lines[i].match(Q_START);
		if (!start) {
			i++;
			continue;
		}
		const n = parseInt(start[1], 10);
		const tag = (start[2] ?? '').trim();
		const promptParts: string[] = [start[3]];
		const options: QuizOption[] = [];
		const answerLines: string[] = [];
		i++;

		// この設問の本文・選択肢・解説を、次の設問が始まるまで読み取る
		for (; i < lines.length; i++) {
			if (Q_START.test(lines[i])) break;
			const opt = lines[i].match(OPT);
			const quote = lines[i].match(QUOTE);
			if (quote) {
				answerLines.push(quote[1]);
			} else if (opt && answerLines.length === 0) {
				options.push({ letter: opt[1].toUpperCase(), html: inline(opt[2]) });
			} else if (answerLines.length === 0 && options.length === 0 && lines[i].trim()) {
				// 設問文が複数行に渡る場合
				promptParts.push(lines[i].trim());
			}
		}

		const rawAnswer = answerLines.join(' ').trim();
		const correctMatch = rawAnswer.match(CORRECT);
		const correct = options.length > 0 && correctMatch ? correctMatch[1].toUpperCase() : null;
		// 先頭の「**答案 B。**」「**该观察到：**」等のマーカーを解説本文から取り除く
		const explanation = rawAnswer.replace(/^\*\*[^*]+\*\*[\s　：:。]*/, '').trim();

		questions.push({
			n,
			tag,
			promptHtml: inline(promptParts.join(' ')),
			options,
			correct,
			explanationHtml: inline(explanation)
		});
	}

	return { introHtml: inline(introLines.join(' ')), questions };
}
