This appendix gathers in one place the concrete numbers the chapters refer to: token counts for the same sentence, context windows and output limits of mainstream models, API prices, parameter counts of open-weight models, roughly how much memory you need to run a model on your own computer, and subscription prices for chat products. The token counts in section 1 were measured with real tokenizers; every other number was checked against the vendors' official pages on 28 October 2026. Each section ends with a note on where its numbers come from, and the links are collected at the end. Prices, model names, and limits change quickly, so if you are reading this a few months later, check again using the steps in section 7.

## 1. Same sentence, different token counts

Each of the five groups below says the same thing in Chinese, Japanese, and English (the code group changes only the comment). We counted tokens with two public tokenizers (a tokenizer is the program that splits text into tokens):

- o200k_base: a tokenizer published by OpenAI. According to the model table in OpenAI's tiktoken repository, it is used by GPT-4o, GPT-4.1, the GPT-5 series, o1, o3, o4-mini, and others. The table does not list the 2026 GPT-6 series, so you cannot conclude from it that the newest models use it too.
- Qwen3.8: this book pins the official tokenizer of Qwen/Qwen3.8-27B. Its file contains 248,044 base tokens and 33 added tokens, 248,077 in total. The model configuration's 248,320 is the embedding/output capacity, not this tokenizer's actual vocabulary size.

1. Everyday request
   - Chinese: 请帮我写一封邮件，告诉同事明天的会议改到下午三点。
   - Japanese: 同僚に、明日の会議が午後3時に変わったと伝えるメールを書いてください。
   - English: Please help me write an email telling my colleagues that tomorrow's meeting has moved to 3 p.m.
2. With English technical terms
   - Chinese: 这个API返回的JSON里缺少timestamp字段。
   - Japanese: このAPIが返すJSONにはtimestampフィールドがありません。
   - English: The JSON returned by this API is missing the timestamp field.
3. With numbers
   - Chinese: 会议定在2026年10月28日14:30，已有128人报名。
   - Japanese: 会議は2026年10月28日14:30からで、すでに128人が申し込んでいます。
   - English: The meeting is at 14:30 on October 28, 2026, and 128 people have signed up.
4. One line of code
   - Chinese comment: `total = price * quantity # 计算总价`
   - Japanese comment: `total = price * quantity # 合計金額を計算`
   - English comment: `total = price * quantity # compute the total price`
5. Short paragraph
   - Chinese: 模型本身不会记住上一次对话。产品里的“记忆”，是把保存下来的文字重新放进这次的上下文。没有这些文字，新对话里它并不知道你以前说过什么。
   - Japanese: モデル自体は前回の会話を覚えていません。製品の「メモリ」は、保存しておいた文章を今回のコンテキストに入れ直す仕組みです。その文章がなければ、新しい会話では以前の発言を知りません。
   - English: The model itself does not remember your last conversation. A product's "memory" puts saved text back into the current context. Without that text, a new conversation knows nothing of what you said before.

How to read this: each cell is the token count as "o200k_base / Qwen3.8" for the sentence alone; when you send it through an API, the message format adds a few more tokens.

| Example | Chinese | Japanese | English |
| --- | --- | --- | --- |
| Everyday request | 21 / 15 | 25 / 18 | 21 / 21 |
| With English technical terms | 11 / 10 | 13 / 11 | 12 / 12 |
| With numbers | 19 / 27 | 28 / 30 | 25 / 32 |
| One line of code | 10 / 9 | 13 / 11 | 10 / 10 |
| Short paragraph | 48 / 35 | 65 / 43 | 40 / 40 |

A few details: Qwen3.8 still splits digits individually, so "2026" costs 4 tokens, while o200k_base groups up to three digits. Japanese is no longer highest in all five groups: with Qwen3.8, English is highest for the everyday request and the numbers example. The short paragraph is cheapest in English with o200k_base, but in Chinese with Qwen3.8 (35, versus 40 in English).

Takeaway: how much the languages differ depends on the tokenizer, and English is not always cheaper. The same Chinese request takes only 15 tokens in Qwen3.8, fewer than the 21 of the English version.

To count your own text, open the [tokenizer lab](/labs/#tokens). These five groups share the same sample data as the lab presets.

Source: recomputed on 30 October 2026 with the official Python tiktoken and tokenizers libraries, checking JavaScript token IDs one by one. Samples are centralized in token-samples.json. Qwen3.8 applies the official NFC normalization and recognizes added special markers, but does not add message wrappers automatically. o200k_base treats literal special-marker strings as ordinary text. These are text counts, not chat API usage.

The lab also offers a separately labeled [ctok community estimate](https://github.com/sanderland/ctok), limited to the v4.8 method for the Claude Opus 4.8 family. It is not an official Anthropic tokenizer: it estimates counts only, without token IDs or actual splits. The display separates a “content estimate” (the single-user-message estimate minus a fixed overhead of 6) from the total including that overhead. Content-boundary rules remain, so this is not a guaranteed raw-text token count and is not folded into the official tokenizer comparison above. Opus 5/5.5 differences are not modeled; do not generalize this estimate to every Claude model.

## 2. Context windows and maximum output

The context window is the total number of tokens a model can handle at once; your question, your material, and the answer all have to fit in it (Chapter 3). Maximum output is the most tokens the model can generate in one answer.

How to read this: K is roughly a thousand and M roughly a million. Vendors write these differently, and the table copies each official notation, so treat 1M, 1,000,000, and 1,048,576 as about the same size.

| Vendor | Model | Context window | Maximum output |
| --- | --- | --- | --- |
| Anthropic | Claude Opus 5.5 | 1M | 128K |
| Anthropic | Claude Sonnet 5.5 | 1M | 128K |
| Anthropic | Claude Haiku 5.5 | 1M | 128K |
| OpenAI | GPT-6 Astra | 1,050,000 | 128,000 |
| OpenAI | GPT-6.1 Sol | 1,050,000 | 128,000 |
| OpenAI | GPT-6 Luna | 1,050,000 | 128,000 |
| Google | Gemini 4 Argon | 1,048,576 | 65,536 (up to 1,048,576 in long-output mode) |
| Google | Gemini 3.8 Flash | 1,048,576 | 65,536 |
| DeepSeek | DeepSeek V4 Pro | 1M | 384K |
| DeepSeek | DeepSeek V4.1 Flash | 1M | 384K |
| Alibaba | Qwen3.8-Max | 1,000,000 | 131,072 |
| Alibaba | Qwen3.8-Flash | 1,000,000 | 131,072 |
| Moonshot AI | Kimi K3.1 Pro | 1,048,576 | 131,072 by default, can be set up to 1,048,576 |

The window is usually shared by input and output, so the input you can send is a little smaller than the window; for example, Qwen3.8-Max accepts at most 991,808 input tokens. For Gemini 3.8 Flash, Google states an "input token limit".

Takeaway: as of October 2026, the main models from every vendor have windows of about a million tokens, while the default output limit per answer ranges from about 65,000 to 384,000. Fitting into the window does not mean every part gets read with the same care (Chapter 12).

Where the numbers come from: each vendor's model overview or individual model pages, checked on 28 October 2026. This table is the first to go out of date when new models ship.

## 3. API prices

APIs charge by the token, and input (what you send) and output (what the model generates, including its thinking) are priced separately.

How to read this: prices are in US dollars per million tokens at each vendor's standard rate; the notes column lists conditions that change the price.

| Model | Input | Output | Notes |
| --- | --- | --- | --- |
| Claude Opus 5.5 | 4 | 20 | — |
| Claude Sonnet 5.5 | 2 | 10 | — |
| Claude Haiku 5.5 | 0.10 | 0.50 | 0.50 / 2.50 for prompts over 100,000 tokens |
| GPT-6 Astra | 10 | 50 | If input exceeds 272K tokens, input costs 2x and output 1.5x for the whole request |
| GPT-6.1 Sol | 2 | 10 | Same as above |
| GPT-6 Luna | 0.10 | 0.50 | Same as above |
| Gemini 4 Argon | 2 | 10 | 4 / 20 from 1 December 2026 |
| Gemini 3.8 Flash | 0.75 | 3.75 | 1.50 / 7.50 from 1 January 2027 |
| DeepSeek V4 Pro | 1.32 | 3.96 | Peak-hour price; half price at other times |
| DeepSeek V4.1 Flash | 0.30 | 1.20 | Same as above |
| Qwen3.8-Max | 2 | 6 | Price for the Singapore (international) deployment |
| Qwen3.8-Flash | 0.15 | 0.47 | Same as above |
| Kimi K3.1 Pro | 2 | 10 | No tiers by context length |

Discounts: batch APIs (for work that need not return right away) cost half the standard price at Anthropic, OpenAI, and Google, and 60% of it at Kimi; when a repeated opening hits the cache, that part of the input costs only about 2% to 13% of the normal input price for the models in the table.

DeepSeek's peak hours are 9:00–12:00 and 14:00–18:00 Beijing time, Monday to Friday, excluding Chinese public holidays. Its yuan prices (peak hours, per million tokens) are 9 yuan input and 27 yuan output for V4 Pro, and 2 yuan input and 8 yuan output for V4.1 Flash.

Takeaway: within one vendor, the most and least expensive models can differ by a factor of 100 (GPT-6 Astra output costs $50, GPT-6 Luna $0.50); output generally costs 3 to 5 times as much as input per token. For what a month of use might cost, see Chapter 38.

Where the numbers come from: each vendor's pricing and model pages, checked on 28 October 2026. Google has already announced dates for price increases, and any vendor can change prices at any time.

## 4. Parameter counts of open-weight models

Open-weight means you can download the model files and run them on your own machine. Most models in the table are mixture-of-experts (MoE) models: they contain many groups of "expert" parameters, and each generated token uses only a few of them. The part that is used is called the active parameters. B means billion and T means trillion.

How to read this: total parameters decide how big the model files are and how much memory you need to hold them; active parameters roughly decide how much computing each token takes.

| Model | Total parameters | Active parameters | License |
| --- | --- | --- | --- |
| Kimi K3 | 2.8T | 104B | Custom |
| Qwen3.8-2.4T-A95B | 2.4T | 95B | Custom |
| DeepSeek-V4-Pro | 1.6T | 49B | MIT |
| gpt-oss-120b | 117B | 5.1B | Apache 2.0 |
| Gemma 4 31B | 30.7B | All (dense model) | Apache 2.0 |
| Qwen3.8-27B | 27B | All (dense model) | Apache 2.0 |
| Gemma 4 26B A4B | 25.2B | 3.8B | Apache 2.0 |
| gpt-oss-20b | 21B | 3.6B | Apache 2.0 |

The "A95B" and "A4B" in the names are the active parameters. Qwen3.8-2.4T-A95B is the open model that the API's Qwen3.8-Max is based on. "Custom" means a license the vendor wrote itself; read its terms before any commercial use.

Takeaway: the first three have total parameters in the trillions and will not fit on a personal computer; models around 30B are the usual choice for running locally (next section).

Where the numbers come from: each model's official model card on Hugging Face, checked on 28 October 2026. Open models are updated quickly, and a new version may have entirely different parameter counts.

## 5. Memory needed to run a model on your own computer

Rule of thumb: memory for the model weights (in bytes) ≈ number of parameters × bits per parameter ÷ 8. Quantization means storing each parameter with fewer bits: llama.cpp's common 4-bit format Q4_K_M averages about 4.9 bits per parameter, its 8-bit format Q8_0 about 8.5 bits, and unquantized FP16 uses 16 bits. Besides the weights, you need memory for the context and for the program itself.

How to read this: the table covers the weights only, estimated with the bits above, in GB; all figures are approximate, and actual file sizes vary with the model's structure.

| Model size | 4-bit (Q4_K_M) | 8-bit (Q8_0) |
| --- | --- | --- |
| 7B–8B | about 4.3–4.9 GB | about 7.4–8.5 GB |
| 14B | about 8.6 GB | about 14.9 GB |
| 32B | about 19.6 GB | about 34.0 GB |
| 70B | about 42.8 GB | about 74.4 GB |

Compared with the measurements in llama.cpp's documentation, the Q4_K_M file of Llama 3.1 8B is 4.9 GB and that of the 70B model is 43.1 GB, which agrees closely with the estimate.

Context comes on top. During a conversation the model keeps intermediate results (the KV cache) for every token. Taking Qwen3-8B as an example and calculating from its configuration (36 layers, 8 KV heads, 128 dimensions per head, FP16), each token takes about 0.15 MB: about 0.6 GB for a 4K context and about 4.8 GB for 32K. Ollama picks its default context length from the amount of VRAM (GPU memory): 4K below 24 GiB, 32K for 24–48 GiB, and 256K for 48 GiB or more. The longer the context, the more memory it uses; `ollama ps` shows how much a loaded model actually takes.

For mixture-of-experts models, estimate memory from the total parameters. gpt-oss-20b has only 3.6B active parameters, and the reason it officially runs within 16 GB of memory is that its expert parameters are already stored in the roughly 4-bit MXFP4 format; gpt-oss-120b needs a single 80 GB GPU.

Takeaway: a computer with 16 GB of memory suits 4-bit models of 7B to 14B; at 4-bit, a 32B model needs about 20 GB for the weights alone, and a 70B model needs more than 40 GB even at 4-bit, plus the context. A Mac's unified memory or a discrete GPU's VRAM can both hold the model, but the operating system and other programs use part of it too (Chapter 21).

Where the numbers come from: llama.cpp's quantization guide, Ollama's context length and FAQ pages, the Qwen3-8B configuration file, and the gpt-oss model card, checked on 28 October 2026. The formula itself is stable, but quantization formats and tool defaults change, so rely on what your tool reports for actual use.

## 6. Subscription prices

How to read this: prices are in US dollars per month, as the official pages show them for the United States, excluding tax; all three also have a free plan.

| Product | Entry plan | Main plan | High-usage plan |
| --- | --- | --- | --- |
| ChatGPT | Go: 8 | Plus: 20 | Pro: 100, 200, or 500 |
| Claude | — | Pro: 20 (17 per month billed annually) | Max: 100 or 200 |
| Google Gemini | Google AI Plus: 4.99 | Google AI Pro: 19.99 | Google AI Ultra: 99.99 or 199.99 |

Prices can differ in other countries and regions, or when you subscribe through a mobile app: Anthropic notes that its Max prices apply to web subscriptions only, and Google's plans page lets you switch regions to see local prices.

Takeaway: the main plan from all three costs about $20 a month; high-usage plans start at about $100 and are tiered by multiples of usage.

Where the numbers come from: OpenAI's, Anthropic's, and Google's official pricing pages and help articles, checked on 28 October 2026. Plan tiers and names change often.

## 7. How to check these numbers yourself

The numbers in this appendix were checked on 28 October 2026. Next time, look them up like this. For model names, context windows, and API prices, open each vendor's model list and pricing page, such as [Anthropic's models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [OpenAI's model list](https://developers.openai.com/api/docs/models), [Gemini's model list](https://ai.google.dev/gemini-api/docs/models), [DeepSeek's models and pricing](https://api-docs.deepseek.com/quick_start/pricing), [Alibaba Cloud Model Studio's model list](https://www.alibabacloud.com/help/en/model-studio/models), and [Kimi's pricing](https://platform.kimi.ai/docs/pricing/chat). For parameter counts and licenses of open models, read the official model cards on Hugging Face; for the memory needed to run models locally, read the llama.cpp and Ollama documentation; for subscription prices, open each product's pricing page and make sure it shows your own region. These pages usually show when they were last updated, so record the date along with any number you quote.

## Sources and version notes

Checked 2026-10-28. The token counts in section 1 were measured locally; all other numbers come from the official pages below.

- Tokenizers: [tiktoken model table](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py), [pinned Qwen3.8-27B tokenizer](https://huggingface.co/Qwen/Qwen3.8-27B/blob/1d4bf0f2ff6012fd82039f2fa52739d0dd7c60c0/tokenizer.json). KV-cache example: [Qwen3-8B configuration](https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json).
- Context and API prices: Anthropic's [models overview](https://platform.claude.com/docs/en/about-claude/models/overview) and [pricing](https://platform.claude.com/docs/en/about-claude/pricing); OpenAI's [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), and [pricing](https://developers.openai.com/api/docs/pricing); Google's [Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon), [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash), and [pricing](https://ai.google.dev/gemini-api/docs/pricing); DeepSeek's [models and pricing (USD)](https://api-docs.deepseek.com/quick_start/pricing) and [Chinese version (CNY)](https://api-docs.deepseek.com/zh-cn/quick_start/pricing); Alibaba Cloud Model Studio's [qwen3.8-max](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-max) and [qwen3.8-flash](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-flash); Kimi's [K3.1 Pro guide](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart), [inference pricing](https://platform.kimi.ai/docs/pricing/chat), and [batch pricing](https://platform.kimi.ai/docs/pricing/batch).
- Open models: Hugging Face model cards for [Kimi K3](https://huggingface.co/moonshotai/Kimi-K3), [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B), [DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro), [gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b), [Gemma 4 31B](https://huggingface.co/google/gemma-4-31B-it), [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B), [Gemma 4 26B A4B](https://huggingface.co/google/gemma-4-26B-A4B-it), and [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b).
- Running locally: [llama.cpp quantization guide](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md), Ollama's [context length](https://docs.ollama.com/context-length) and [FAQ](https://docs.ollama.com/faq).
- Subscriptions: [ChatGPT plan prices (OpenAI's Codex pricing page)](https://learn.chatgpt.com/docs/pricing), [Claude pricing](https://claude.com/pricing), [about the Claude Max plan](https://support.claude.com/en/articles/11049741-what-is-the-max-plan), [Google AI plans](https://gemini.google/subscriptions/).

Prices, limits, and model names all change; when other chapters of this book quote numbers from here, they refer to this check date as well.