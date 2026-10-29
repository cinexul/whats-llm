この付録では、本書の各章で触れる具体的な数字を一か所にまとめます。同じ文のトークン数、主なモデルのコンテキストウィンドウと出力の上限、APIの料金、オープンウェイトモデルのパラメータ数、自分のパソコンでモデルを動かすのに必要なメモリの目安、チャット製品のサブスクリプション料金です。第一節のトークン数は実際のトークナイザーで測ったもので、それ以外の数字はすべて2026年10月28日に各社の公式ページで確認しました。各節の終わりに出典を書き、リンクは末尾にまとめています。料金、モデル名、上限はすぐに変わります。数か月後に見るときは、第七節の方法で確かめ直してください。

## 一、同じ文でもトークン数は違う

次の五組の文は、それぞれ中国語・日本語・英語で同じ内容を表しています（コードの組はコメントだけを変えています）。公開されている二つのトークナイザー（文章をトークンに区切るプログラム）で、トークン数を数えました。

- o200k_base：OpenAIが公開しているトークナイザーです。OpenAIのtiktokenリポジトリにあるモデル対応表では、GPT-4o、GPT-4.1、GPT-5シリーズ、o1、o3、o4-miniなどがこれを使います。この表には2026年のGPT-6シリーズが載っていないため、最新モデルも同じだとは言えません。
- Qwen3：AlibabaのQwen3シリーズ（2025年4月公開）のトークナイザーで、語彙（区別できるトークンの種類の数）は151,936です。新しいQwen3.8は語彙を248,320に広げたので、同じ文でも数が変わる可能性があります。

1. 日常の依頼
   - 中国語：请帮我写一封邮件，告诉同事明天的会议改到下午三点。
   - 日本語：同僚に、明日の会議が午後3時に変わったと伝えるメールを書いてください。
   - 英語：Please help me write an email telling my colleagues that tomorrow's meeting has moved to 3 p.m.
2. 英語の専門用語まじり
   - 中国語：这个API返回的JSON里缺少timestamp字段。
   - 日本語：このAPIが返すJSONにはtimestampフィールドがありません。
   - 英語：The JSON returned by this API is missing the timestamp field.
3. 数字入り
   - 中国語：会议定在2026年10月28日14:30，已有128人报名。
   - 日本語：会議は2026年10月28日14:30からで、すでに128人が申し込んでいます。
   - 英語：The meeting is at 14:30 on October 28, 2026, and 128 people have signed up.
4. コード1行
   - 中国語のコメント：`total = price * quantity # 计算总价`
   - 日本語のコメント：`total = price * quantity # 合計金額を計算`
   - 英語のコメント：`total = price * quantity # compute the total price`
5. 短い段落
   - 中国語：模型本身不会记住上一次对话。产品里的“记忆”，是把保存下来的文字重新放进这次的上下文。没有这些文字，新对话里它并不知道你以前说过什么。
   - 日本語：モデル自体は前回の会話を覚えていません。製品の「メモリ」は、保存しておいた文章を今回のコンテキストに入れ直す仕組みです。その文章がなければ、新しい会話では以前の発言を知りません。
   - 英語：The model itself does not remember your last conversation. A product's "memory" puts saved text back into the current context. Without that text, a new conversation knows nothing of what you said before.

読み方：各マスは「o200k_base／Qwen3」のトークン数で、文そのものだけを数えています。APIで送るときは、メッセージの形式のために数トークン増えます。

| 例文 | 中国語 | 日本語 | 英語 |
| --- | --- | --- | --- |
| 日常の依頼 | 21／16 | 25／23 | 21／21 |
| 英語の専門用語まじり | 11／10 | 13／14 | 12／12 |
| 数字入り | 19／27 | 28／31 | 25／32 |
| コード1行 | 10／10 | 13／13 | 10／10 |
| 短い段落 | 48／40 | 65／61 | 40／40 |

細かく見ると、Qwen3は数字を1桁ずつ区切るので「2026」が4トークンになり、o200k_baseは最大3桁を1トークンにまとめます。そのため数字入りの文はQwen3のほうがはっきり多くなります。日本語は五組すべてで最も多く、短い段落はo200k_baseでは英語が最も少なく、Qwen3では中国語と英語が同じ数でした。

まとめ：言語ごとの差はトークナイザーによって変わり、英語がいつも少ないわけではありません。同じ中国語の依頼文は、Qwen3では16トークンで、英語版の21より少なくなります。

自分の文章で数えてみたいときは、本書の「体験ラボ」ページを開いてください。トークナイザーの実験が追加される予定です。

出典：2026年10月28日に、o200k_base（js-tiktoken）とQwen3のトークナイザーファイルを使って手元で数えました。どのモデルがo200k_baseを使うかはtiktokenリポジトリの対応表、語彙の数は二つのQwenモデルの設定ファイルによります。トークナイザーはモデルの世代交代で変わるので、モデルが変わったら数え直してください。

## 二、コンテキストウィンドウと最大出力

コンテキストウィンドウは、モデルが一度に扱えるトークンの総量で、質問、資料、回答のすべてがこの中に収まる必要があります（第3章）。最大出力は、1回の回答で生成できるトークン数の上限です。

読み方：Kはおよそ千、Mはおよそ百万です。書き方は会社ごとに違うので、表には公式の表記をそのまま載せています。1M、1,000,000、1,048,576はほぼ同じ大きさと考えてかまいません。

| 会社 | モデル | コンテキストウィンドウ | 最大出力 |
| --- | --- | --- | --- |
| Anthropic | Claude Opus 5.5 | 1M | 128K |
| Anthropic | Claude Sonnet 5.5 | 1M | 128K |
| Anthropic | Claude Haiku 5.5 | 1M | 128K |
| OpenAI | GPT-6 Astra | 1,050,000 | 128,000 |
| OpenAI | GPT-6.1 Sol | 1,050,000 | 128,000 |
| OpenAI | GPT-6 Luna | 1,050,000 | 128,000 |
| Google | Gemini 4 Argon | 1,048,576 | 65,536（長い出力のモードでは最大1,048,576） |
| Google | Gemini 3.8 Flash | 1,048,576 | 65,536 |
| DeepSeek | DeepSeek V4 Pro | 1M | 384K |
| DeepSeek | DeepSeek V4.1 Flash | 1M | 384K |
| Alibaba | Qwen3.8-Max | 1,000,000 | 131,072 |
| Alibaba | Qwen3.8-Flash | 1,000,000 | 131,072 |
| Moonshot AI | Kimi K3.1 Pro | 1,048,576 | 初期値131,072、最大1,048,576まで設定可能 |

ウィンドウはふつう入力と出力で共有するため、入れられる入力はウィンドウより少し小さくなります。たとえばQwen3.8-Maxの入力上限は991,808です。GoogleがGemini 3.8 Flashに示しているのは「入力の上限」です。

まとめ：2026年10月時点で、各社の主力モデルのウィンドウはおおむね100万トークン前後、初期設定の1回あたりの出力上限は約6.5万から38.4万までと幅があります。収まることと、どの部分も同じように丁寧に読まれることは別の話です（第12章）。

出典：各社のモデル一覧ページまたは個別のモデルページ。2026年10月28日に確認しました。新しいモデルが出ると、この表が真っ先に古くなります。

## 三、APIの料金

APIはトークン数で課金され、入力（こちらから送る内容）と出力（モデルが生成する内容。思考の過程も含む）は別々の単価です。

読み方：単位は米ドル／百万トークンで、各社の標準料金です。「備考」には料金が変わる条件を書いています。

| モデル | 入力 | 出力 | 備考 |
| --- | --- | --- | --- |
| Claude Opus 5.5 | 4 | 20 | — |
| Claude Sonnet 5.5 | 2 | 10 | — |
| Claude Haiku 5.5 | 0.10 | 0.50 | プロンプトが10万トークンを超えると0.50／2.50 |
| GPT-6 Astra | 10 | 50 | 入力が27.2万トークンを超えると、そのリクエスト全体の入力が2倍、出力が1.5倍 |
| GPT-6.1 Sol | 2 | 10 | 同上 |
| GPT-6 Luna | 0.10 | 0.50 | 同上 |
| Gemini 4 Argon | 2 | 10 | 2026年12月1日から4／20 |
| Gemini 3.8 Flash | 0.75 | 3.75 | 2027年1月1日から1.50／7.50 |
| DeepSeek V4 Pro | 1.32 | 3.96 | ピーク時間帯の料金。それ以外の時間帯は半額 |
| DeepSeek V4.1 Flash | 0.30 | 1.20 | 同上 |
| Qwen3.8-Max | 2 | 6 | シンガポール（国際）デプロイの料金 |
| Qwen3.8-Flash | 0.15 | 0.47 | 同上 |
| Kimi K3.1 Pro | 2 | 10 | コンテキストの長さによる段階なし |

割引：バッチAPI（すぐに結果を返さなくてよい処理）は、Anthropic、OpenAI、Googleでは標準料金の半額、Kimiでは6割の料金です。また、繰り返し送る冒頭部分がキャッシュに当たると、表のモデルではその入力が元の料金の約2%〜13%になります。

DeepSeekのピーク時間帯は、北京時間の月〜金曜（中国の祝日を除く）9:00〜12:00と14:00〜18:00です。人民元の料金（ピーク時間帯、百万トークンあたり）は、V4 Proが入力9元・出力27元、V4.1 Flashが入力2元・出力8元です。

まとめ：同じ会社の中でも、最も高いモデルと安いモデルで100倍の差があります（GPT-6 Astraの出力は50ドル、GPT-6 Lunaは0.50ドル）。出力の単価は入力のおおむね3〜5倍です。1か月にどれくらいかかるかは第38章を参照してください。

出典：各社の料金ページとモデルページ。2026年10月28日に確認しました。Googleは値上げの日付をすでに公表しており、ほかの会社もいつ料金を変えてもおかしくありません。

## 四、オープンウェイトモデルのパラメータ数

オープンウェイト（open-weight）とは、モデルのファイルをダウンロードして自分の環境で動かせることです。表の多くは混合エキスパート（MoE）モデルです。内部に多数の「エキスパート」のパラメータ群があり、1トークンを生成するたびにその一部だけを使います。使われる部分をアクティブパラメータと呼びます。Bは10億、Tは1兆です。

読み方：総パラメータ数は、モデルファイルの大きさと、載せるのに必要なメモリを決めます。アクティブパラメータ数は、1トークンごとの計算量の目安です。

| モデル | 総パラメータ | アクティブパラメータ | ライセンス |
| --- | --- | --- | --- |
| Kimi K3 | 2.8T | 104B | 独自ライセンス |
| Qwen3.8-2.4T-A95B | 2.4T | 95B | 独自ライセンス |
| DeepSeek-V4-Pro | 1.6T | 49B | MIT |
| gpt-oss-120b | 117B | 5.1B | Apache 2.0 |
| Gemma 4 31B | 30.7B | すべて（密なモデル） | Apache 2.0 |
| Qwen3.8-27B | 27B | すべて（密なモデル） | Apache 2.0 |
| Gemma 4 26B A4B | 25.2B | 3.8B | Apache 2.0 |
| gpt-oss-20b | 21B | 3.6B | Apache 2.0 |

名前にある「A95B」「A4B」がアクティブパラメータ数です。Qwen3.8-2.4T-A95Bは、APIのQwen3.8-Maxのもとになっているオープンモデルです。「独自ライセンス」は各社が独自に定めた利用条件のことで、商用で使う前に条項を読んでください。

まとめ：上の三つは総パラメータが兆単位で、個人のパソコンには載りません。30B前後のモデルが、手元で動かすときのよくある選択肢です（次節）。

出典：Hugging Faceにある各モデルの公式モデルカード。2026年10月28日に確認しました。オープンモデルは更新が速く、新しい版ではパラメータ数がまったく違うこともあります。

## 五、自分のパソコンでモデルを動かすのに必要なメモリ

目安の式：モデルの重みに必要なメモリ（バイト）≈ パラメータ数 × 1パラメータあたりのビット数 ÷ 8。量子化（quantization）とは、各パラメータを少ないビット数で保存することです。llama.cppでよく使う4ビット形式のQ4_K_Mは1パラメータあたり平均約4.9ビット、8ビット形式のQ8_0は約8.5ビット、量子化しないFP16は16ビットです。重みのほかに、コンテキストとプログラム自体のためのメモリも必要です。

読み方：表は重みの分だけを上のビット数で見積もったもので、単位はGB、すべて概算です。実際のファイルの大きさはモデルの構造によって多少違います。

| モデルの規模 | 4ビット（Q4_K_M） | 8ビット（Q8_0） |
| --- | --- | --- |
| 7B〜8B | 約4.3〜4.9GB | 約7.4〜8.5GB |
| 14B | 約8.6GB | 約14.9GB |
| 32B | 約19.6GB | 約34.0GB |
| 70B | 約42.8GB | 約74.4GB |

llama.cppのドキュメントにある実測値と比べると、Llama 3.1 8BのQ4_K_Mファイルは4.9GB、70Bは43.1GBで、見積もりとほぼ一致します。

コンテキストは別に必要です。モデルは会話の各トークンについて途中の計算結果（KVキャッシュ）を保持します。Qwen3-8Bを例に、その設定（36層、KVヘッド8個、各ヘッド128次元、FP16）から計算すると、1トークンあたり約0.15MBで、4Kのコンテキストなら約0.6GB、32Kなら約4.8GBです。Ollamaはコンテキストの長さの初期値をVRAM（GPUのメモリ）の量で決めます。24GiB未満なら4K、24〜48GiBなら32K、48GiB以上なら256Kです。コンテキストを長くするほどメモリを使います。`ollama ps`で、モデルが実際に使っている量を確認できます。

混合エキスパートモデルは総パラメータ数でメモリを見積もります。gpt-oss-20bのアクティブパラメータは3.6Bだけですが、公式に16GBのメモリで動くとされているのは、エキスパートのパラメータが約4ビットのMXFP4形式で保存されているからです。gpt-oss-120bには80GBのGPUが1枚必要です。

まとめ：16GBのメモリを積んだパソコンなら、4ビットの7B〜14Bモデルが向いています。32Bは4ビットでも重みだけで約20GB、70Bは4ビットでも40GB以上にコンテキストの分が加わります。Macのユニファイドメモリや単体GPUのVRAMにモデルを載せられますが、OSやほかのアプリもその一部を使います（第21章）。

出典：llama.cppの量子化の説明、Ollamaのコンテキスト長とFAQのページ、Qwen3-8Bの設定ファイル、gpt-ossのモデルカード。2026年10月28日に確認しました。式そのものは変わりませんが、量子化の形式やツールの初期値は変わるので、実際の使用量はツールの表示で確かめてください。

## 六、サブスクリプションの料金

読み方：単位は米ドル／月で、公式ページが米国向けに表示している税抜きの料金です。3社とも別に無料プランがあります。

| 製品 | 入門プラン | 主力プラン | 大量利用向けプラン |
| --- | --- | --- | --- |
| ChatGPT | Go：8 | Plus：20 | Pro：100、200、500 |
| Claude | — | Pro：20（年払いなら月あたり17） | Max：100、200 |
| Google Gemini | Google AI Plus：4.99 | Google AI Pro：19.99 | Google AI Ultra：99.99、199.99 |

ほかの国や地域、またはスマートフォンのアプリから契約する場合は、料金が異なることがあります。AnthropicはMaxの料金がWeb版での契約にだけ当てはまると明記しており、Googleの料金ページでは地域を切り替えて現地の料金を確認できます。

まとめ：3社とも主力プランは月20ドル前後です。大量利用向けは約100ドルからで、利用量の倍率によって段階が分かれています。

出典：OpenAI、Anthropic、Googleの公式料金ページとヘルプ記事。2026年10月28日に確認しました。プランの段階や名前はよく変わります。

## 七、次回、自分で確かめる方法

この付録の数字は2026年10月28日に確認したものです。次に調べるときは、次のように探してください。モデル名、コンテキストウィンドウ、APIの料金は、各社のモデル一覧と料金ページを見ます。たとえば[Anthropicのモデル一覧](https://platform.claude.com/docs/en/about-claude/models/overview)、[OpenAIのモデル一覧](https://developers.openai.com/api/docs/models)、[Geminiのモデル一覧](https://ai.google.dev/gemini-api/docs/models)、[DeepSeekのモデルと料金](https://api-docs.deepseek.com/quick_start/pricing)、[Alibaba Cloud Model Studioのモデル一覧](https://www.alibabacloud.com/help/en/model-studio/models)、[Kimiの料金](https://platform.kimi.ai/docs/pricing/chat)です。オープンモデルのパラメータ数とライセンスはHugging Faceの公式モデルカード、手元で動かすのに必要なメモリはllama.cppとOllamaのドキュメント、サブスクリプションの料金は各製品の料金ページで確認し、自分の地域の表示になっているかも確かめます。これらのページにはたいてい更新日が書かれているので、数字を引用するときは日付も一緒に記録してください。

## 出典とバージョンについて

確認日：2026-10-28。第一節のトークン数は手元で測り、それ以外の数字はすべて次の公式ページによります。

- トークナイザー：[tiktokenのモデル対応表](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py)、[Qwen3-8Bの設定](https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json)、[Qwen3.8-27Bの設定](https://huggingface.co/Qwen/Qwen3.8-27B/blob/main/config.json)。
- コンテキストとAPIの料金：Anthropicの[モデル一覧](https://platform.claude.com/docs/en/about-claude/models/overview)と[料金](https://platform.claude.com/docs/en/about-claude/pricing)、OpenAIの[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)、[GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)、[GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)と[料金](https://developers.openai.com/api/docs/pricing)、Googleの[Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon)、[Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash)と[料金](https://ai.google.dev/gemini-api/docs/pricing)、DeepSeekの[モデルと料金（米ドル）](https://api-docs.deepseek.com/quick_start/pricing)と[中国語版（人民元）](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)、Alibaba Cloud Model Studioの[qwen3.8-max](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-max)と[qwen3.8-flash](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-flash)、Kimiの[K3.1 Proの説明](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)、[推論料金](https://platform.kimi.ai/docs/pricing/chat)と[バッチ料金](https://platform.kimi.ai/docs/pricing/batch)。
- オープンモデル：Hugging Faceのモデルカード[Kimi K3](https://huggingface.co/moonshotai/Kimi-K3)、[Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)、[DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)、[gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)、[Gemma 4 31B](https://huggingface.co/google/gemma-4-31B-it)、[Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)、[Gemma 4 26B A4B](https://huggingface.co/google/gemma-4-26B-A4B-it)、[gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b)。
- 手元での実行：[llama.cppの量子化の説明](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md)、Ollamaの[コンテキスト長](https://docs.ollama.com/context-length)と[FAQ](https://docs.ollama.com/faq)。
- サブスクリプション：[ChatGPTの各プランの料金（OpenAIのCodex料金ページ）](https://learn.chatgpt.com/docs/pricing)、[Claudeの料金](https://claude.com/pricing)、[Claude Maxの説明](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)、[Google AIのプラン](https://gemini.google/subscriptions/)。

料金、上限、モデル名はどれも変わります。本書のほかの章がここの数字を引用するときも、この確認日を基準にしています。
