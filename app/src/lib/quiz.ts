// 章末の「小测验 / 小テスト」を構造化データへ変換する。
// 本文Markdownから小テスト節を切り出し、設問・選択肢・正解・解説に分解して、
// インタラクティブな採点UI (Quiz.svelte) で描画できるようにする。
import { Marked } from 'marked';
import type { Lang } from './manifest';
import registrations from './question-registry.json' with { type: 'json' };

export interface QuizOption {
	letter: string; // A / B / C / D ...
	html: string; // 選択肢テキスト(インラインMarkdown済み)
}

export interface QuizQuestion {
	id: string | null; // 在同一章节内保持稳定，不受显示顺序和语言影响。
	revision: number; // 内容修订号，仅修改措辞时也需更新。
	n: number; // 設問番号
	tag: string; // 種別タグ(例: 基础·概念题)
	promptHtml: string; // 設問文
	options: QuizOption[]; // 選択式でなければ空
	correct: string | null; // 正解のレター。観察問題など正解が無い場合null
	explanationHtml: string; // 解説(正解マーカーは取り除いた残り)
}

export interface Quiz {
	introHtml: string; // 冒頭の案内文
	questions: QuizQuestion[];
}

const md = new Marked({ gfm: true });
const inline = (s: string): string => md.parseInline(s.trim()) as string;

// 旧版djb2哈希；保持不变，确保已有学习记录仍可读取。
export function questionHash(promptHtml: string): string {
	let h = 5381;
	for (let i = 0; i < promptHtml.length; i++) {
		h = ((h << 5) + h + promptHtml.charCodeAt(i)) >>> 0;
	}
	return h.toString(36);
}

interface QuestionRegistration {
	revision: number;
	content: string;
	legacyHash?: string;
	legacyAssessment?: string;
}
const registry = registrations as Record<string, Record<string, Record<string, QuestionRegistration>>>;

/** 选项与正确答案共同确定测评内容；仅修改题干措辞不重置掌握程度。 */
export function assessmentFingerprint(q: QuizQuestion): string {
	return questionHash(JSON.stringify([q.options, q.correct]));
}

/** 测验内容有任何变更，都要在维护检查中确认修订号。 */
export function contentFingerprint(q: QuizQuestion): string {
	return questionHash(JSON.stringify([q.tag, q.promptHtml, q.options, q.correct, q.explanationHtml]));
}

/**
 * SQLite和localStorage的存储API仍接受qhash字符串。
 * 旧测评ID不能更改。选项或答案变化时自动生成新标识，
 * 即使编辑者忘记提高内容修订号也一样。
 */
export function questionIdentity(q: QuizQuestion, lang: Lang, slug: string): string {
	const assessment = assessmentFingerprint(q);
	const registered = q.id ? registry[lang]?.[slug]?.[q.id] : undefined;
	if (registered?.legacyHash && assessment === registered.legacyAssessment) return registered.legacyHash;
	return `${q.id ?? questionHash(q.promptHtml)}~${assessment}`;
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
const IDENTITY = /\s*<!--\s*quiz:\s*([a-z][a-z0-9-]*)\s+revision:\s*([1-9]\d*)\s*-->\s*$/;

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
		const metadata = start[3].match(IDENTITY);
		const id = metadata?.[1] ?? null;
		const revision = metadata ? Number(metadata[2]) : 0;
		const promptParts: string[] = [start[3].replace(IDENTITY, '')];
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
		// 先頭の「**答案B。**」「**该观察到：**」等のマーカーを解説本文から取り除く
		const explanation = rawAnswer.replace(/^\*\*[^*]+\*\*[\s　：:。]*/, '').trim();

		questions.push({
			id,
			revision,
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
