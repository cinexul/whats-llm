import { findChapter, type Chapter, type Lang } from './manifest';

type Localized<T> = Record<Lang, T>;
export type LearningPathId = 'orientation' | 'everyday-report' | 'first-project';
export interface LearningStep {
	id: string;
	title: string;
	reading: string;
	chapters: Chapter[];
	action: string;
	deliverable: string;
	checks: string[];
}
export interface LearningPath {
	id: LearningPathId;
	title: string;
	summary: string;
	duration: string;
	prerequisite: string;
	result: string;
	steps: LearningStep[];
}

interface StepCopy extends Omit<LearningStep, 'id' | 'chapters'> {}
interface PathCopy extends Omit<LearningPath, 'id' | 'steps'> {}
interface PathDefinition {
	id: LearningPathId;
	copy: Localized<PathCopy>;
	steps: { id: string; slugs: string[]; copy: Localized<StepCopy> }[];
}

// 各语言版本共用标识和阅读顺序；标题取自书籍目录清单。
export const learningPathDefinitions: PathDefinition[] = [
	{
		id: 'orientation',
		copy: {
			zh: { title: '约 30 分钟，建立正确直觉', summary: '弄清模型怎么回答、上下文是什么，以及何时需要核查。', duration: '约 30 分钟：按提示选读并练习；通读章节会更久。', prerequisite: '无需基础、账号或编程工具；准备一张纸或笔记。', result: '一张你自己写的「模型、上下文、核查」说明卡。' },
			ja: { title: '約30分で基本の見取り図をつくる', summary: 'モデルの回答、コンテキスト、裏取りの関係をつかみます。', duration: '目安は約30分。指定箇所の選読と練習の時間です。章の通読にはさらに時間がかかります。', prerequisite: '予備知識・アカウント・開発ツールは不要。紙かメモを用意します。', result: '「モデル・コンテキスト・裏取り」を自分の言葉で説明した1枚のメモ。' },
			en: { title: 'Build the basics in about 30 minutes', summary: 'Understand how a model answers, what context means, and when to verify.', duration: 'About 30 minutes for selected reading and exercises; reading every chapter in full takes longer.', prerequisite: 'No background, account, or coding tools needed. Bring paper or a note editor.', result: 'Your own one-page explanation of models, context, and verification.' }
		},
		steps: [
			{
				id: 'orientation-explain', slugs: ['what-is-llm'],
				copy: {
					zh: { title: '解释模型如何生成回答', reading: '约 10 分钟。重点看「参数」和「不是数据库」两节及小结。', action: '用三句话向一个没用过 AI 的朋友解释参数、训练和生成回答；不要照抄原文。', deliverable: '三句话的说明，并举一个「流畅但可能错误」的例子。', checks: ['我能区分训练时调整参数和聊天时使用上下文。', '我没有把模型描述为完整、可靠的可搜索资料库。'] },
					ja: { title: '回答が生まれる仕組みを説明する', reading: '約10分。「パラメータ」「データベースではない」の節とまとめを選読します。', action: 'AIを使ったことのない友人に、パラメータ・学習・回答の生成を3文で説明します。本文を写さずに書きます。', deliverable: '3文の説明と、「流暢でも間違いうる」回答の例。', checks: ['学習でパラメータを変えることと、会話で文脈を使うことを区別できる。', 'モデルを完全で信頼できる検索用データベースとして説明していない。'] },
					en: { title: 'Explain how an answer is generated', reading: 'About 10 minutes. Focus on parameters, why a model is not a database, and the summary.', action: 'Explain parameters, training, and answer generation to a friend in three sentences, using your own words.', deliverable: 'Three sentences and one example of a fluent answer that could still be wrong.', checks: ['I can distinguish changing parameters during training from using context during a conversation.', 'I do not describe the model as a complete, reliable, searchable archive.'] }
				}
			},
			{
				id: 'orientation-context', slugs: ['token-and-context'],
				copy: {
					zh: { title: '画出模型的工作台', reading: '约 10 分钟。选读上下文窗口、上下文与训练知识的区别。', action: '画一张工作台：标出本次请求、提供的材料、历史对话和回答要占的位置。写下长对话中可能丢失的一条要求。', deliverable: '一张上下文草图，以及一个减少无关材料的办法。', checks: ['我知道 token 不一定是一个汉字或单词。', '我能说明对话上下文、训练知识和产品的记忆功能为什么不同。'] },
					ja: { title: 'モデルの作業台を描く', reading: '約10分。コンテキストウィンドウ、会話の文脈と学習済み知識の違いを選読します。', action: '作業台を描き、今回の依頼・資料・会話履歴・回答に必要な場所を書き込みます。長い会話で見失いそうな条件を1つ挙げます。', deliverable: '文脈の図と、不要な資料を減らす方法を1つ。', checks: ['1トークンが必ず1文字や1単語ではないと説明できる。', '会話の文脈、学習済み知識、製品のメモリ機能を区別できる。'] },
					en: { title: 'Sketch the model’s workbench', reading: 'About 10 minutes. Select the context-window section and the comparison with trained knowledge.', action: 'Draw a workbench with space for the request, supplied material, conversation history, and answer. Name one instruction a long conversation might lose track of.', deliverable: 'A context sketch and one way to remove irrelevant material.', checks: ['I can explain why one token is not always one character or word.', 'I can distinguish conversation context, trained knowledge, and a product’s memory feature.'] }
				}
			},
			{
				id: 'orientation-verify', slugs: ['hallucination-knowledge-memory'],
				copy: {
					zh: { title: '给答案加一道核查', reading: '约 10 分钟。选读幻觉的例子和小结。', action: '在说明卡上加一个例子：「AI 给出一条有作者和年份的引用。」写出你会如何核查，以及找不到原文时如何表述。', deliverable: '完成说明卡：模型的作用、上下文的边界、一条核查流程。', checks: ['我会打开原始来源，核对引用是否存在、是否支持结论。', '无法验证时，我会标出不确定或删去断言，不把自信语气当作证据。'] },
					ja: { title: '回答に裏取りの手順を添える', reading: '約10分。ハルシネーションの例とまとめを選読します。', action: '説明メモに「AIが著者名と年を添えた引用を出した」という例を追加。どう確かめ、原文が見つからないときにどう書くかを決めます。', deliverable: 'モデルの役割・文脈の限界・裏取りの手順がそろった説明メモ。', checks: ['一次資料を開き、引用の実在と主張を支える内容を確かめる。', '確認できない断定は削除するか不確実と明記し、自信のある口調を根拠にしない。'] },
					en: { title: 'Add a verification habit', reading: 'About 10 minutes. Read the hallucination examples and summary.', action: 'Add this example to your note: “AI supplied a quotation with an author and a year.” Write how you would check it and what you would say if you could not find the original.', deliverable: 'A finished note covering the model’s role, context limits, and a verification procedure.', checks: ['I would open the original source to check that the quotation exists and supports the claim.', 'I would label uncertainty or remove an unverified claim rather than treating confidence as evidence.'] }
				}
			}
		]
	},
	{
		id: 'everyday-report',
		copy: {
			zh: { title: '完成一份有依据的工作简报', summary: '从问题和原始材料出发，完成可追溯、经过核查的一页报告。', duration: '约 1–2 小时；取决于资料长度和核查难度，可分次完成。', prerequisite: '准备 2–3 份你有权使用的短资料，以及一个真实的小问题。可使用已有 AI 工具，也可手工练习；无需付费 API。', result: '一页简报：结论、证据、来源、限制和下一步建议。' },
			ja: { title: '根拠をたどれる仕事の報告をつくる', summary: '問いと原資料から、確認済みの1ページの報告まで進めます。', duration: '目安は1〜2時間。資料の長さと裏取りによって変わります。分けて進めても構いません。', prerequisite: '使用する権限のある短い資料を2〜3件と、小さな実務上の問いを用意。手持ちのAIツールか手作業で練習できます。有料APIは不要です。', result: '結論・根拠・出典・限界・次の行動をまとめた1ページの報告。' },
			en: { title: 'Finish an evidence-backed work brief', summary: 'Turn a real question and source material into a checked, traceable one-page report.', duration: 'Roughly 1–2 hours, depending on source length and verification. Work across several sessions if needed.', prerequisite: 'Bring 2–3 short sources you may use and one small work question. Use an AI tool you already have, or practice manually; no paid API is required.', result: 'A one-page brief with a conclusion, evidence, sources, limitations, and a proposed next action.' }
		},
		steps: [
			{
				id: 'report-scope', slugs: ['privacy-and-data-tiers', 'prompt-structure'],
				copy: {
						zh: { title: '界定问题和材料边界', reading: '选读数据分级和提示词的「背景、任务、约束、格式、验收标准」。', action: '选一个问题，例如「下周先改进哪一个客服流程？」写明读者、范围和需要支持的决定。检查材料权限，删去个人信息与凭据。', deliverable: '一份简短任务说明，以及依次标为 S1、S2 等的可用资料清单。', checks: ['我的问题能在一页报告中回答，目标读者和决定明确。', '每份材料都有标题、日期或版本、来源位置，并且适合交给所用工具。'] },
						ja: { title: '問いと資料の範囲を決める', reading: 'データ分類と、プロンプトの「背景・タスク・制約・形式・合格条件」を選読します。', action: '「来週、どのサポート手順を先に改善するか」などの問いを選び、読者・範囲・支える判断を書きます。資料の利用権限を確認し、個人情報と認証情報を除きます。', deliverable: '短い依頼文と、S1・S2などの識別子を順に付けた資料一覧。', checks: ['問いは1ページで答えられる大きさで、読者と判断が明確である。', '資料ごとに題名・日付または版・出典の場所があり、使うツールに渡せる。'] },
						en: { title: 'Define the question and source boundaries', reading: 'Select the data tiers and the prompt framework: context, task, constraints, format, success criteria.', action: 'Choose a question such as “Which support process should we improve first next week?” Name the reader, scope, and decision. Check source permissions and remove personal information and credentials.', deliverable: 'A short task brief and a source list labeled sequentially S1, S2, and so on.', checks: ['My question fits a one-page report and names its reader and decision.', 'Each source has a title, date or version, and location, and is suitable for the tool I will use.'] }
				}
			},
			{
				id: 'report-evidence', slugs: ['long-text-and-summary'],
				copy: {
					zh: { title: '先整理证据，再下结论', reading: '重点看分块提供资料、只依据材料回答和信息抽取。', action: '逐份处理资料。要求只提取与问题相关的信息，列出主张、来源编号、页码或段落和原文；没有证据就写「材料未提供」。', deliverable: '至少 3 行的证据表，并标出资料之间的矛盾或空缺。', checks: ['每一行都能在原文中定位，我已打开材料核对。', '原文事实、我的推断和材料缺失被分开标明。'] },
					ja: { title: '結論の前に根拠を整理する', reading: '資料の分割、資料だけに基づく回答、情報抽出を中心に読みます。', action: '資料を1件ずつ扱い、問いに関係する情報だけを抽出。主張・資料ID・ページまたは段落・原文を並べ、根拠がなければ「資料に記載なし」とします。', deliverable: '3行以上の根拠表。資料間の矛盾や不足も記します。', checks: ['各行の原文の位置をたどれ、資料を開いて確認した。', '資料の事実、自分の推論、欠けている情報を区別した。'] },
					en: { title: 'Collect evidence before conclusions', reading: 'Focus on chunking material, answering only from supplied sources, and extraction.', action: 'Process one source at a time. Extract only relevant information into columns for claim, source ID, page or paragraph, and original wording. Use “not provided in the sources” for missing evidence.', deliverable: 'An evidence table with at least three rows, including any conflicts or gaps.', checks: ['I can locate every row in the original and have opened the source to check it.', 'I distinguish source facts, my inferences, and missing information.'] }
				}
			},
			{
				id: 'report-draft', slugs: ['work-scenarios'],
				copy: {
					zh: { title: '写成读者可用的一页报告', reading: '选读文稿整理和表格应用，关注可检查的输出格式。', action: '依据证据表起草一页报告：一句话结论、三点依据、限制、一个下一步建议。给事实标注 S1/S2/S3；建议明确写成建议。', deliverable: '带逐项来源标注的报告初稿。', checks: ['初稿直接回答原来的问题，并适合目标读者。', '数字、引用和事实有来源编号；没有把建议写成已发生的事实。'] },
					ja: { title: '読者が使える1ページにする', reading: '文章の整理と表の活用を選読し、確認できる出力形式に注目します。', action: '根拠表から、結論1文・根拠3点・限界・次の行動案1つをまとめます。事実にS1/S2/S3を付け、提案は提案として書きます。', deliverable: '各主張に出典を付けた報告の下書き。', checks: ['最初の問いに直接答え、想定した読者に合っている。', '数値・引用・事実に資料IDがあり、提案を起きた事実として書いていない。'] },
					en: { title: 'Write a brief the reader can use', reading: 'Select the writing and table examples, focusing on an output format you can inspect.', action: 'Draft one page from the evidence table: one-sentence conclusion, three supporting points, limitations, and one proposed next action. Attach S1/S2/S3 to facts and label recommendations as recommendations.', deliverable: 'A draft with source references attached to individual claims.', checks: ['The draft directly answers the original question for its intended reader.', 'Numbers, quotations, and facts have source IDs; recommendations are not presented as events that happened.'] }
				}
			},
			{
				id: 'report-verify', slugs: ['learning-and-research', 'content-review-and-responsibility'],
				copy: {
					zh: { title: '核查并交付可追溯的版本', reading: '选读事实核查、原始来源和人工审核的责任。', action: '逐项回到原文核对数字、日期、引用和结论。修正矛盾，删除无依据的断言；补上来源列表、审核日期和未解决的问题。', deliverable: '最终一页简报、证据表和来源清单，存到你自己的文件中。', checks: ['所有关键事实都有支持它的原文，我能向别人展示核查过程。', '报告保留不确定性，建议的范围没有超出证据。', '我已亲自审核可分享的内容，并注明需要的署名或 AI 使用说明。'] },
					ja: { title: '裏取りして追跡可能な形で仕上げる', reading: '事実確認、一次資料、人によるレビューの責任を選読します。', action: '数値・日付・引用・結論を原文で一つずつ照合。矛盾を修正し、根拠のない断定を削除します。出典一覧、確認日、未解決の問いを添えます。', deliverable: '完成した1ページの報告、根拠表、出典一覧を自分のファイルに保存。', checks: ['重要な事実すべてに裏付けとなる原文があり、確認の過程を説明できる。', '不確実性を残し、提案が根拠の範囲を超えていない。', '共有できる内容を自分で確認し、必要なクレジットやAI利用の説明を付けた。'] },
					en: { title: 'Verify and deliver a traceable version', reading: 'Select fact-checking, original sources, and responsibility for human review.', action: 'Check each number, date, quotation, and conclusion against the original. Resolve conflicts and remove unsupported assertions. Add a source list, review date, and unanswered questions.', deliverable: 'The final one-page brief, evidence table, and source list saved in your own files.', checks: ['Every key fact has supporting original text, and I can show how I checked it.', 'The report preserves uncertainty and its recommendation stays within the evidence.', 'I personally reviewed what may be shared and added any required credit or AI-use disclosure.'] }
				}
			}
		]
	},
	{
		id: 'first-project',
		copy: {
			zh: { title: '做出第一个小项目', summary: '做一个能在本地打开的个人页面，练习计划、预览、修改和验收。', duration: '约 2–3 小时，工具安装另计；可以拆成几次小练习。', prerequisite: '需要电脑、浏览器、编辑器和空文件夹。可用已有编程助手或手工编辑 HTML；无需付费 API。使用助手时先按其官方说明完成安装。', result: '一个经过检查的本地个人页面、一份验收记录，以及能恢复的已知良好版本。' },
			ja: { title: '最初の小さなプロジェクトを完成させる', summary: 'ローカルで開ける個人ページで、計画・プレビュー・変更・確認を練習します。', duration: '目安は2〜3時間。ツールの導入時間は別です。数回の小さな練習に分けられます。', prerequisite: 'PC、ブラウザ、エディタ、空のフォルダを用意。手持ちのコーディング支援ツールかHTMLの手編集で進められます。有料APIは不要。支援ツールは公式手順で先に導入します。', result: '確認済みのローカル個人ページ、確認記録、戻せる動作済みの版。' },
			en: { title: 'Finish your first small project', summary: 'Build a local personal page and practice planning, previewing, changing, and checking.', duration: 'Roughly 2–3 hours, plus tool setup. Split it into small sessions as needed.', prerequisite: 'Bring a computer, browser, editor, and empty folder. Use a coding assistant you have or edit HTML manually; no paid API is needed. Set up an assistant using its official instructions first if you use one.', result: 'A checked local personal page, a short acceptance record, and a working version you can restore.' }
		},
		steps: [
			{
				id: 'project-plan', slugs: ['claude-code-codex-workflow', 'plan-first-task-breakdown'],
				copy: {
					zh: { title: '把第一版缩小到可验收', reading: '选读调查 → 计划 → 动手 → 验收的循环，以及小步拆分。', action: '写下第一版只需姓名、简介和两个链接。把任务拆成骨架、内容、样式、验收四步；明确暂不发布、不接登录和后端。', deliverable: '四步计划和三条可以在浏览器中验证的验收标准。', checks: ['每一步只有一个可以看见的结果。', '验收标准写清页面应该出现什么、链接应该做什么。'] },
					ja: { title: '最初の版を確認できる大きさにする', reading: '調査→計画→実行→確認のループと、小さなタスクへの分割を選読します。', action: '最初の版は名前・自己紹介・リンク2つに絞ります。骨組み・内容・見た目・確認の4段階に分け、公開・ログイン・バックエンドを今回の範囲から外します。', deliverable: '4段階の計画と、ブラウザで確かめられる合格条件3つ。', checks: ['各段階に目で見える結果が1つある。', 'ページに何が表示され、リンクがどう動くべきかを合格条件に書いた。'] },
					en: { title: 'Make the first version small enough to check', reading: 'Select the investigate → plan → act → review loop and the small-task breakdown.', action: 'Limit version one to a name, introduction, and two links. Plan four steps: skeleton, content, styling, and review. Leave publishing, login, and a backend outside this exercise.', deliverable: 'A four-step plan and three acceptance criteria observable in a browser.', checks: ['Each step has one visible result.', 'The criteria state what should appear and what the links should do.'] }
				}
			},
			{
				id: 'project-boundaries', slugs: ['permissions-and-rollback'],
				copy: {
					zh: { title: '准备可恢复的工作范围', reading: '重点看授权范围、Git 的边界和恢复方式。', action: '在独立空文件夹工作，用虚构姓名和示例链接。保存起点副本或 Git 提交；向助手明确仅在项目文件夹内改文件，安装、联网和发布先说明。', deliverable: '项目文件夹、一份起点快照和一句明确的工作范围说明。', checks: ['我知道修改会写到哪里，并能找到起点副本或提交。', '我知道 Git 分支不是隔离环境，也不能撤回已发送的数据。'] },
					ja: { title: '戻せる作業範囲を用意する', reading: '許可の範囲、Gitの限界、復元の方法を中心に読みます。', action: '独立した空フォルダで、架空の名前と例示リンクを使います。開始時のコピーかGitコミットを保存。支援ツールにはこのフォルダ内だけの変更を依頼し、導入・通信・公開は先に説明するよう伝えます。', deliverable: 'プロジェクト用フォルダ、開始時のスナップショット、明確な作業範囲の説明。', checks: ['変更先を把握し、開始時のコピーかコミットを見つけられる。', 'Gitのブランチは隔離環境ではなく、送信済みのデータを取り消せないと理解した。'] },
					en: { title: 'Prepare a scope you can recover', reading: 'Focus on authorization boundaries, Git’s limits, and recovery.', action: 'Work in a separate empty folder with a fictional name and example links. Save a starting copy or Git commit. Tell the assistant to modify only this project and explain installations, network access, or publishing first.', deliverable: 'A project folder, starting snapshot, and a clear statement of allowed work.', checks: ['I know where changes will be written and can locate the starting copy or commit.', 'I know a Git branch is not isolation and cannot recall data already sent elsewhere.'] }
				}
			},
			{
				id: 'project-build', slugs: ['project-personal-website'],
				copy: {
					zh: { title: '跑通预览、反馈、修改', reading: '按个人网站项目的最小骨架和逐步填写内容练习。', action: '先生成或手写一个只有标题的 index.html，打开预览。将标题改为虚构姓名，刷新确认；再加简介和两个明确的示例链接，一次只改一块。', deliverable: '可以本地打开的页面，含标题、简介、两个链接。', checks: ['我亲自打开了正确的文件，刷新后能看到标题变化。', '内容与计划一致，没有编造经历、真实隐私或不明外部脚本。'] },
					ja: { title: 'プレビュー・フィードバック・変更を回す', reading: '個人サイトの章に沿って、最小の骨組みから順に内容を加えます。', action: '見出しだけのindex.htmlを生成するか手書きし、開いて確認。架空の名前に変えて再読み込みし、自己紹介と例示リンク2つを1か所ずつ追加します。', deliverable: '見出し・自己紹介・リンク2つを持つ、ローカルで開けるページ。', checks: ['正しいファイルを自分で開き、再読み込み後の見出しの変更を確認した。', '内容が計画と一致し、架空の経歴の追加、実際の個人情報、不明な外部スクリプトがない。'] },
					en: { title: 'Run the preview, feedback, change loop', reading: 'Follow the personal-website chapter’s minimal skeleton and incremental content steps.', action: 'Generate or hand-write an index.html with just a heading and open it. Change the heading to a fictional name and refresh to verify. Add an introduction and two clearly labeled example links, one change at a time.', deliverable: 'A locally viewable page containing a heading, introduction, and two links.', checks: ['I opened the correct file myself and saw the heading change after refreshing.', 'The content matches the plan, with no invented biography, real private data, or unexplained external scripts.'] }
				}
			},
			{
				id: 'project-review', slugs: ['diff-test-rollback-review'],
				copy: {
					zh: { title: '验收，并练习恢复一次', reading: '选读检查 diff、验收问题和回滚的范围。', action: '对照计划检查改动文件、两个链接、窄屏布局和键盘操作。保存满意版本，再只改一下标题并用副本或 Git 恢复，刷新验证。记录操作和结果。', deliverable: '本地页面、三条验收结果，以及恢复演练记录。', checks: ['我检查了差异，并在手机宽度和键盘操作下验证了页面与链接。', '我实际恢复过一个小改动，能指出可恢复的文件版本。', '我保存了启动和复查步骤，且知道页面仍只是本地作品。'] },
					ja: { title: '確認し、一度戻す練習をする', reading: '差分の確認、合格の判断、巻き戻せる範囲を選読します。', action: '計画に照らし、変更ファイル・リンク2つ・狭い画面・キーボード操作を確認。良い版を保存し、見出しだけを変えてからコピーやGitで復元して再読み込みします。手順と結果を記録します。', deliverable: 'ローカルページ、合格条件3つの結果、復元の練習記録。', checks: ['差分を確認し、スマートフォン幅とキーボードでページとリンクを確かめた。', '小さな変更を実際に戻し、復元できるファイルの版を示せる。', '開き方と再確認の手順を保存し、まだローカルの作品であると把握している。'] },
					en: { title: 'Review it and practice restoring once', reading: 'Select diff review, acceptance questions, and the scope of rollback.', action: 'Check changed files, both links, a narrow viewport, and keyboard operation against your plan. Save the good version, change only the heading, then restore with your copy or Git and refresh. Record the steps and results.', deliverable: 'The local page, results for three acceptance criteria, and a restore rehearsal record.', checks: ['I reviewed the diff and checked the page and links at phone width and using the keyboard.', 'I actually restored a small change and can identify the recoverable file version.', 'I saved instructions for opening and checking the page and understand it is still a local project.'] }
				}
			}
		]
	}
];

export const learningPaths = Object.fromEntries((['zh', 'ja', 'en'] as Lang[]).map((lang) => [
	lang,
	learningPathDefinitions.map((definition): LearningPath => ({
		id: definition.id,
		...definition.copy[lang],
		steps: definition.steps.map((step) => ({
			id: step.id,
			...step.copy[lang],
			chapters: step.slugs.map((slug) => {
				const chapter = findChapter(lang, slug);
				if (!chapter) throw new Error(`Unknown learning-path chapter: ${lang}/${slug}`);
				return { slug: chapter.slug, title: chapter.title };
			})
		}))
	}))
])) as Record<Lang, LearningPath[]>;
