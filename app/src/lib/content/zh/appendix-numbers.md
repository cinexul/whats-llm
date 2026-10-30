本附录把书中各章提到的具体数字集中在一处：同一句话的token数、主流模型的上下文窗口和输出上限、API价格、开放权重模型的参数量、在自己电脑上运行模型大约要多少内存，以及聊天产品的订阅价。第一节的token数是用真实分词器测出来的，其余数字都在2026年10月28日对照厂商的官方页面核对过，每节末尾说明出处，具体链接集中在文末。价格、模型名和上限变得很快，几个月后再看，请按第七节的方法重新查一遍。

## 一、同一句话，token数不一样

下面五组句子，每组用中文、日文、英文说同一件事（代码那组只换了注释）。我们用两个公开的分词器（tokenizer，把文字切成token的程序）分别数了token：

- o200k_base：OpenAI公开的分词器。按OpenAI的tiktoken仓库里的模型对照表，GPT-4o、GPT-4.1、GPT-5系列和o1、o3、o4-mini等都用它；这张表没有列出2026年的GPT-6系列，所以不能据此断定最新模型也用它。
- Qwen3.8：本书固定使用Qwen/Qwen3.8-27B的官方分词器。分词器文件含248,044个基础token和33个追加token，共248,077个；模型配置里的248,320是模型词嵌入/输出容量，不是这个分词器的实际token种类数。

1. 日常请求
   - 中文：请帮我写一封邮件，告诉同事明天的会议改到下午三点。
   - 日文：同僚に、明日の会議が午後3時に変わったと伝えるメールを書いてください。
   - 英文：Please help me write an email telling my colleagues that tomorrow's meeting has moved to 3 p.m.
2. 夹英文术语
   - 中文：这个API返回的JSON里缺少timestamp字段。
   - 日文：このAPIが返すJSONにはtimestampフィールドがありません。
   - 英文：The JSON returned by this API is missing the timestamp field.
3. 带数字
   - 中文：会议定在2026年10月28日14:30，已有128人报名。
   - 日文：会議は2026年10月28日14:30からで、すでに128人が申し込んでいます。
   - 英文：The meeting is at 14:30 on October 28, 2026, and 128 people have signed up.
4. 一行代码
   - 中文注释：`total = price * quantity # 计算总价`
   - 日文注释：`total = price * quantity # 合計金額を計算`
   - 英文注释：`total = price * quantity # compute the total price`
5. 短段落
   - 中文：模型本身不会记住上一次对话。产品里的“记忆”，是把保存下来的文字重新放进这次的上下文。没有这些文字，新对话里它并不知道你以前说过什么。
   - 日文：モデル自体は前回の会話を覚えていません。製品の「メモリ」は、保存しておいた文章を今回のコンテキストに入れ直す仕組みです。その文章がなければ、新しい会話では以前の発言を知りません。
   - 英文：The model itself does not remember your last conversation. A product's "memory" puts saved text back into the current context. Without that text, a new conversation knows nothing of what you said before.

怎么读：每格是“o200k_base／Qwen3.8”的token数，只数句子本身；通过API发送时，消息格式还会多占几个token。

| 例句 | 中文 | 日文 | 英文 |
| --- | --- | --- | --- |
| 日常请求 | 21／15 | 25／18 | 21／21 |
| 夹英文术语 | 11／10 | 13／11 | 12／12 |
| 带数字 | 19／27 | 28／30 | 25／32 |
| 一行代码 | 10／9 | 13／11 | 10／10 |
| 短段落 | 48／35 | 65／43 | 40／40 |

细看几处：Qwen3.8仍把数字一位一位地切，“2026”算4个token，o200k_base则把最多三位数字合成一个token。日文不再在五组里都是最多的：Qwen3.8的日常请求和带数字例句都是英文最多。短段落在o200k_base里英文最省，在Qwen3.8里则是中文最省（35个，英文40个）。

结论：语言之间差多少取决于分词器，英文并不总是更省。同一句中文请求，在Qwen3.8里只要15个token，比英文版的21个还少。

想数自己的文字，可以打开本书的[分词器实验](/labs/#tokens)。这里的五组例句与实验预设共用同一份样本数据。

出处：2026年10月30日以官方Python库tiktoken和tokenizers复算，并逐个token ID核对JavaScript结果。样本统一保存在token-samples.json。Qwen3.8按官方文件先做NFC规范化，识别文件中的追加特殊标记，但不自动添加消息包装；o200k_base把输入中的特殊标记字面串当普通文本。这里只统计文本，不是聊天API用量。

实验里还单独提供了[ctok社区估算](https://github.com/sanderland/ctok)，用于Claude Opus 4.8系列的v4.8方法。它不是Anthropic官方分词器，只估算数量，不提供token ID或真实切分。界面把单条用户消息估算总量减去固定6个开销后的“内容估算”与包含这6个开销的总量分开显示；内容边界规则仍然保留，所以不能把它当成保证准确的纯文本token数，也不并入上面的官方分词器对照。Opus 5/5.5的差异未建模，不能推广到所有Claude模型。

## 二、上下文窗口与最大输出

上下文窗口是模型一次能处理的token总量，提问、资料和回答都要放在里面（第3章）；最大输出是一次回答最多能生成的token数。

怎么读：K约为千，M约为百万。各家写法不同，表里照抄官方写法，1M、1,000,000和1,048,576可以看成差不多大。

| 厂商 | 模型 | 上下文窗口 | 最大输出 |
| --- | --- | --- | --- |
| Anthropic | Claude Opus 5.5 | 1M | 128K |
| Anthropic | Claude Sonnet 5.5 | 1M | 128K |
| Anthropic | Claude Haiku 5.5 | 1M | 128K |
| OpenAI | GPT-6 Astra | 1,050,000 | 128,000 |
| OpenAI | GPT-6.1 Sol | 1,050,000 | 128,000 |
| OpenAI | GPT-6 Luna | 1,050,000 | 128,000 |
| Google | Gemini 4 Argon | 1,048,576 | 65,536（长输出模式最多1,048,576） |
| Google | Gemini 3.8 Flash | 1,048,576 | 65,536 |
| DeepSeek | DeepSeek V4 Pro | 1M | 384K |
| DeepSeek | DeepSeek V4.1 Flash | 1M | 384K |
| 阿里巴巴 | Qwen3.8-Max | 1,000,000 | 131,072 |
| 阿里巴巴 | Qwen3.8-Flash | 1,000,000 | 131,072 |
| 月之暗面 | Kimi K3.1 Pro | 1,048,576 | 默认131,072，最多可设为1,048,576 |

窗口一般由输入和输出共用，能放进去的输入比窗口小一些，例如Qwen3.8-Max的输入上限是991,808。Google给Gemini 3.8 Flash标的则是“输入上限”。

结论：截至2026年10月，各家主力模型的窗口都在100万token左右，默认的单次输出上限从约6.5万到38.4万不等；放得下，不等于每一段都会被同样仔细地读（第12章）。

出处：各厂商的模型总览页或单个模型页，2026年10月28日核对。新模型一发布，这张表最先过时。

## 三、API价格

API按token计费，输入（你发过去的内容）和输出（模型生成的内容，包括思考过程）分开计价。

怎么读：单位是美元／百万token，取各家的标准价；“备注”写的是会让价格变化的条件。

| 模型 | 输入 | 输出 | 备注 |
| --- | --- | --- | --- |
| Claude Opus 5.5 | 4 | 20 | — |
| Claude Sonnet 5.5 | 2 | 10 | — |
| Claude Haiku 5.5 | 0.10 | 0.50 | 提示超过10万token时为0.50／2.50 |
| GPT-6 Astra | 10 | 50 | 输入超过27.2万token时，整次请求的输入按2倍、输出按1.5倍计 |
| GPT-6.1 Sol | 2 | 10 | 同上 |
| GPT-6 Luna | 0.10 | 0.50 | 同上 |
| Gemini 4 Argon | 2 | 10 | 2026年12月1日起为4／20 |
| Gemini 3.8 Flash | 0.75 | 3.75 | 2027年1月1日起为1.50／7.50 |
| DeepSeek V4 Pro | 1.32 | 3.96 | 高峰时段价，其余时段半价 |
| DeepSeek V4.1 Flash | 0.30 | 1.20 | 同上 |
| Qwen3.8-Max | 2 | 6 | 新加坡（国际）部署的价格 |
| Qwen3.8-Flash | 0.15 | 0.47 | 同上 |
| Kimi K3.1 Pro | 2 | 10 | 不按上下文长度分档 |

折扣：批量接口（不要求马上返回结果）在Anthropic、OpenAI、Google按标准价的一半收费，Kimi按六成收费；重复的开头命中缓存时，表中各模型的这部分输入只收原价的约2%～13%。

DeepSeek的高峰时段是北京时间周一至周五（法定节假日除外）9:00～12:00和14:00～18:00；它的人民币价目（高峰时段，每百万token）为V4 Pro输入9元、输出27元，V4.1 Flash输入2元、输出8元。

结论：同一家最贵和最便宜的模型可以差100倍（GPT-6 Astra的输出单价是50美元，GPT-6 Luna是0.50美元）；输出单价普遍是输入的3～5倍。一个月大概会花多少，见第38章。

出处：各厂商的价格页和模型页，2026年10月28日核对。Google已经公布了涨价日期，其他家也随时可能调价。

## 四、开放权重模型的参数量

开放权重（open-weight）指模型文件可以下载、在自己的机器上运行。表里多数是混合专家（MoE）模型：内部有许多组“专家”参数，每生成一个token只调用其中几组，被调用的这部分叫激活参数。B是十亿，T是万亿。

怎么读：总参数决定模型文件有多大、要多少内存才装得下；激活参数大致决定每生成一个token要算多少。

| 模型 | 总参数 | 激活参数 | 许可 |
| --- | --- | --- | --- |
| Kimi K3 | 2.8T | 104B | 自有许可 |
| Qwen3.8-2.4T-A95B | 2.4T | 95B | 自有许可 |
| DeepSeek-V4-Pro | 1.6T | 49B | MIT |
| gpt-oss-120b | 117B | 5.1B | Apache 2.0 |
| Gemma 4 31B | 30.7B | 全部（稠密模型） | Apache 2.0 |
| Qwen3.8-27B | 27B | 全部（稠密模型） | Apache 2.0 |
| Gemma 4 26B A4B | 25.2B | 3.8B | Apache 2.0 |
| gpt-oss-20b | 21B | 3.6B | Apache 2.0 |

名字里的“A95B”“A4B”就是激活参数。Qwen3.8-2.4T-A95B是API上Qwen3.8-Max所基于的开放模型。“自有许可”指厂商自己写的许可协议，商用前要读条款。

结论：前三款的总参数都在万亿级，个人电脑放不下；30B上下的几款才是本地运行的常见选择（见下一节）。

出处：Hugging Face上各模型的官方模型卡，2026年10月28日核对。开放模型更新很快，新版本的参数量可能完全不同。

## 五、在自己电脑上跑模型要多少内存

经验公式：模型权重占用（字节）≈ 参数量 × 每个参数的位数 ÷ 8。量化（quantization）就是用更少的位数存每个参数：llama.cpp常用的4-bit格式Q4_K_M平均每个参数约4.9位，8-bit格式Q8_0约8.5位，不量化的FP16是16位。除了权重，还要给上下文和程序本身留出内存。

怎么读：下表只算权重，按上面的位数估算，单位GB，都是约数；实际文件大小会随模型结构有出入。

| 模型规模 | 4-bit（Q4_K_M） | 8-bit（Q8_0） |
| --- | --- | --- |
| 7B～8B | 约4.3～4.9GB | 约7.4～8.5GB |
| 14B | 约8.6GB | 约14.9GB |
| 32B | 约19.6GB | 约34.0GB |
| 70B | 约42.8GB | 约74.4GB |

和llama.cpp文档里的实测对照：Llama 3.1 8B的Q4_K_M文件是4.9GB，70B是43.1GB，与估算基本一致。

上下文另算。模型在对话中要为每个token保存一份中间结果（KV缓存）。以Qwen3-8B为例，按它的配置（36层、8个KV头、每头128维、FP16）计算，每个token约占0.15MB：4K上下文约0.6GB，32K约4.8GB。Ollama默认按显存决定上下文长度：显存不到24GiB时用4K，24～48GiB用32K，48GiB以上用256K；上下文开得越长越占内存，用`ollama ps`可以看到模型实际占了多少。

混合专家模型要按总参数算内存。gpt-oss-20b的激活参数只有3.6B，官方说它能在16GB内存内运行，是因为专家参数本身已用约4位的MXFP4格式存储；gpt-oss-120b则要一张80GB的显卡。

结论：16GB内存的电脑适合4-bit的7B～14B模型；32B在4-bit下光权重就约20GB；70B即使用4-bit也要40GB以上，再加上下文。苹果电脑的统一内存和独立显卡的显存都可以用来放模型，但系统和其他程序也要占一部分（第21章）。

出处：llama.cpp的量化说明、Ollama的上下文长度和常见问题页面、Qwen3-8B的配置文件、gpt-oss的模型卡，2026年10月28日核对。公式本身是稳定的，但量化格式和工具默认值会变，实际占用以工具显示为准。

## 六、订阅价格

怎么读：单位是美元／月，取官方页面在美国显示的价格，不含税；三家都另有免费档。

| 产品 | 入门档 | 主力档 | 高用量档 |
| --- | --- | --- | --- |
| ChatGPT | Go：8 | Plus：20 | Pro：100、200或500 |
| Claude | — | Pro：20（按年付合每月17） | Max：100或200 |
| Google Gemini | Google AI Plus：4.99 | Google AI Pro：19.99 | Google AI Ultra：99.99或199.99 |

在其他国家和地区、或通过手机App订阅，价格可能不同：Anthropic注明Max的价格只适用于网页订阅；Google的订阅页可以切换地区查看当地价格。

结论：三家的主力档都在每月20美元左右，高用量档从约100美元起，按用量倍数分档。

出处：OpenAI、Anthropic、Google的官方定价页和帮助文章，2026年10月28日核对。订阅的档位和名称调整得很频繁。

## 七、下次自己怎么查

本附录的数字核对于2026年10月28日。下次要查，可以这样找：模型名、上下文窗口和API价格，看各家的模型列表和价格页，例如[Anthropic模型总览](https://platform.claude.com/docs/en/about-claude/models/overview)、[OpenAI模型列表](https://developers.openai.com/api/docs/models)、[Gemini模型列表](https://ai.google.dev/gemini-api/docs/models)、[DeepSeek模型与价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)、[阿里云Model Studio模型列表](https://www.alibabacloud.com/help/en/model-studio/models)和[Kimi价格](https://platform.kimi.ai/docs/pricing/chat)；开放模型的参数量和许可，看Hugging Face上的官方模型卡；本地运行要多少内存，看llama.cpp和Ollama的文档；订阅价格看各产品的定价页，并确认页面显示的是你所在的地区。这些页面通常标着更新日期，引用数字时把日期一起记下来。

## 来源与版本说明

核查日期：2026-10-28。第一节的token数在本地测量，其余数字都来自下列官方页面。

- 分词器：[tiktoken模型对照表](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py)、[固定版本的Qwen3.8-27B分词器](https://huggingface.co/Qwen/Qwen3.8-27B/blob/1d4bf0f2ff6012fd82039f2fa52739d0dd7c60c0/tokenizer.json)。KV缓存示例：[Qwen3-8B配置](https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json)。
- 上下文与API价格：Anthropic的[模型总览](https://platform.claude.com/docs/en/about-claude/models/overview)和[价格](https://platform.claude.com/docs/en/about-claude/pricing)；OpenAI的[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)、[GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)、[GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)和[价格](https://developers.openai.com/api/docs/pricing)；Google的[Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon)、[Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash)和[价格](https://ai.google.dev/gemini-api/docs/pricing)；DeepSeek的[模型与价格（美元）](https://api-docs.deepseek.com/quick_start/pricing)和[中文版（人民币）](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)；阿里云Model Studio的[qwen3.8-max](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-max)、[qwen3.8-flash](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-flash)；Kimi的[K3.1 Pro说明](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)、[推理价格](https://platform.kimi.ai/docs/pricing/chat)和[批量价格](https://platform.kimi.ai/docs/pricing/batch)。
- 开放模型：Hugging Face模型卡[Kimi K3](https://huggingface.co/moonshotai/Kimi-K3)、[Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)、[DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)、[gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)、[Gemma 4 31B](https://huggingface.co/google/gemma-4-31B-it)、[Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)、[Gemma 4 26B A4B](https://huggingface.co/google/gemma-4-26B-A4B-it)、[gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b)。
- 本地运行：[llama.cpp量化说明](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md)、Ollama的[上下文长度](https://docs.ollama.com/context-length)和[常见问题](https://docs.ollama.com/faq)。
- 订阅：[ChatGPT各档价格（OpenAI的Codex定价页）](https://learn.chatgpt.com/docs/pricing)、[Claude定价](https://claude.com/pricing)、[Claude Max说明](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)、[Google AI订阅](https://gemini.google/subscriptions/)。

价格、上限和模型名都会变；本书其他章节引用这里的数字时，也以这个核查日期为准。