Many people who use AI have hit these odd things: partway through a chat it forgets what you said at the start; you paste in a long article and it says "too long"; you ask about as much as usual, yet this month's quota drops fast.

They share one cause: AI sees text differently from how we do. It doesn't read letter by letter, and it doesn't keep the whole conversation "in its head." Understand this chapter's two words, token and context window, and all of these make sense.

## 1. Token: the "grains" AI cuts text into

We read "Please help me write an email telling my colleagues that tomorrow's meeting has moved to 3 p.m." as 17 words, or 95 characters counting spaces and punctuation. The model receives a sequence of **tokens**: a tokenizer first cuts the text into pieces, then hands them to the model. The figure below shows how two real tokenizers split this sentence: o200k_base, used by GPT-4o, and the tokenizer of Alibaba's Qwen3.

![The same English sentence split into 21 tokens by both o200k_base and Qwen3, with a table comparing token counts for the Chinese, Japanese, and English versions of the sentence](/figures/en/tokens.svg)

Here both tokenizers produce the same 21 tokens. Most words are one token each, including the space in front of them; "tomorrow's" becomes "tomorrow" plus "'s", and "3 p.m." takes five tokens.

A token is the unit a model works with, not necessarily a character or a word:

- It may be a word, part of a word, a single character, or even part of a character's encoding. Take the Chinese word 骆驼 ("camel"): o200k_base splits it into 4 tokens (each character in two halves), Qwen3 into 2, while the English "camel" is a single token in both. Punctuation, spaces, and line breaks count too, sometimes merged with neighboring text.
- A tokenizer is a fixed vocabulary and set of splitting rules set up for a model ahead of time; it doesn't make up new rules each time you chat. Different models often use different tokenizers, so the same sentence can come out at different token counts.

Why cut text this way? Splitting into single letters or characters makes sequences long and fragmented; splitting into whole words means far too many words, with new words and typos appearing all the time. Tokens are the compromise: common combinations become one piece and rare ones are split smaller, so text is never too fragmented, yet any string can be spelled out.

> **Quick math: roughly how many tokens is a passage?**
> Measured on this book's text with these two tokenizers, English comes to about 1.3 tokens per word (one token per 4 to 5 characters on average). Chinese and Japanese come to about 0.65 to 0.77 tokens per character. So a 1,000-word English article is about 1,300 tokens, and a 1,000-character Chinese article about 700. An older tokenizer such as cl100k_base, used by GPT-4, needed about one token per Chinese character.
> These are rough rules of thumb: counts depend on the tokenizer and are affected by punctuation, digits, and code. The example sentence takes 21 tokens in both Chinese and English with o200k_base, and with Qwen3 the Chinese version needs fewer, so "English uses fewer tokens than Chinese" is not a law. For precise counts, use the counter for the model in question or check the usage the API reports. Appendix E compares more sentences.

## 2. The context window: the model's "workbench"

The **context window** is the maximum number of tokens a model can handle in one request. Think of it as a desk: to work on something, everything you need has to be spread out on it. System instructions (what the product tells the model ahead of time), earlier conversation, material you paste in, and tool descriptions and results all take up space, and there has to be room left for the answer. The thinking tokens a reasoning model produces before it answers (chapter 8) count too. The figure below draws the desk as a fixed budget:

![The context window drawn as a fixed-length budget bar shared by system instructions, conversation history, attachments, and room for the answer; after a long chat the history grows until the budget is full, and four things a product may do near the limit are listed below](/figures/en/context-window.svg)

What's on the desk isn't just what you typed. Many people look at their own short question and wonder why "I barely said anything," forgetting that the 10-page PDF they pasted earlier and the 2,000-word reply already cover most of the desk.

How big is the desk? As of October 2026, the Claude models Anthropic offers through its API have a context window of 1 million tokens and can write up to 128,000 tokens in one reply; by Anthropic's estimate, 1 million tokens is about 555,000 English words. Appendix E lists other mainstream models. How much you can actually use in a chat product depends on the product and plan.

## 3. What you chat about and what it learned in training are different things

A model can use the earlier conversation, but chatting normally doesn't write anything into its trained parameters. Whether the service keeps transcripts, memories, or logs is a different question, about the product and privacy (chapter 37).

Before each reply, the software picks what part of the conversation to hand the model. The simplest way is to send the whole history every time, like this; other products keep state on the server, reuse cached work, pick out only the relevant passages, or swap in summaries.

```text
Round 1:       [your question A]                              → answer a
Round 2:    [question A + answer a + your question B]         → answer b
Round 3: [question A + answer a + question B + answer b + question C]  → answer c
            └──────── illustrative full-history implementation ────────┘
```

So "it remembers what I said" really means the relevant information is in this request's context, or the product put it back in. Near the limit, a product may summarize, cut some of it, pull in only the relevant parts, or just refuse a request that's too long (the figure in the previous section). Details can get lost that way, but not every product simply "pushes out the oldest text first."

A new chat isn't necessarily an empty desk either: system instructions are always there, and a product may bring in history, saved memories, project material, or personalization. The name you mentioned yesterday is usable only if it's brought in this way. If you're not sure, check which features are on, or just say the important requirements again.

Also, an online service does receive the material you send; when material drops out of the context, that doesn't mean the service has deleted the copy it stored (chapter 37).

Products' "project" and "memory" features do the same thing: they put saved information back into the context when it's needed, rather than having the chat retrain the model. That's also different from the training-time memorization of text in chapter 2. Chapter 9 explains how these features work, and chapter 13 covers managing them day to day and what to do when you'd rather not be remembered.

## 4. Why does it lose track when a conversation runs long?

Even before the limit, a long conversation can get harder for it to follow. Length itself isn't the problem: more useful material makes answers better, and what gets in the way is material that's irrelevant or contradicts itself. In desk terms, three things commonly happen:

| Reason | Desk metaphor | What it looks like |
| --- | --- | --- |
| The point gets buried | Too much material on the desk; the truly important sheet is pressed underneath | A key requirement you set early on, it later "can't see" |
| Contradictions pile up | Old approaches and wrong information from trial and error are still spread on the desk | It gets dragged along by its own earlier mistakes, drifting further off |
| Summarizing loses detail | As the desk fills up, old material gets "boiled down to a sticky note," and the details are gone | Specific numbers and agreements from early on get fuzzy |

A common case: you and the AI go back and forth on a draft. The first 10 rounds go fine, but later it gets stubborn, ignoring new requests and bringing back wording you already turned down. It isn't tired; the desk is piled with leftovers from trial and error, and the useful information is buried under them.

## 5. Why longer context costs more and runs slower

The token is the unit of measure, and both cost and speed follow it.

- Cost: APIs bill input and output tokens separately, and output is usually much more expensive. For example, as of October 2026, Claude Opus 5.5 costs $4 per million input tokens and $20 per million output tokens through the API. In a multi-turn chat, the history carried along is counted as input again on every turn, though many services discount repeated content through caching. Subscription plans may instead limit messages, model choice, or usage, and don't necessarily show a token balance.
- Speed: as the model reads its input, each token is compared with every token before it (the attention described in chapter 6). Double the tokens and this comparison work roughly quadruples, so the work grows faster than the length. While writing the answer, each new token also looks back over everything before it. So the longer the input, the longer you wait before the answer starts, and the writing itself can slow down. Many models use various techniques to lighten this load, but the overall pattern holds: longer means pricier and slower.
- Other limits: products may also cap file size, page count, or number of uploads, and an uploaded document may be searched so that only a few passages go into the context.

So even when you feel you "just asked a small question," pasting a lot of material earlier and having it write a long answer makes tokens climb fast and the quota drop with them. Chapter 38 covers what this costs in practice and how to save.

> **Key point:** Put only what you need on the desk and leave room for the answer. The more you pile on, the more it costs and the longer you wait, and it can distract the model; but useful material makes answers more accurate, so a fuller desk isn't automatically worse.

## 6. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A token is one character | A token is a tokenizer's unit; it can be a word, part of a word, a character, or even part of a character |
| English always uses fewer tokens | It depends on the tokenizer: this chapter's example is 21 tokens in Chinese and English with o200k_base, and only 16 in Chinese with Qwen3 |
| It must remember every earlier chat | The product decides what history or memory to bring in; chats aren't written into the parameters |
| The bigger the context window, the more carefree | It holds more, but costs more and runs slower, and irrelevant content still gets in the way |
| Forgetting always means a malfunction | The information may not have been brought in, or was summarized or trimmed; a model can also overlook information that is still there |

## Summary

- A token is the unit of text a tokenizer produces. The same English sentence is 21 tokens with both o200k_base and Qwen3, while its Chinese version is 21 and 16; use the model's own counter for precise numbers.
- The context window is one request's token budget, shared by system instructions, history, material, and the answer. As of October 2026, Claude's API window is 1 million tokens.
- The product manages the conversation: full history, summaries, and selected passages are all ways of supplying context, and none of them retrains the model.
- In a long conversation, key points can get buried, content can contradict itself, and summaries can drop details, so it loses track; but useful context also makes answers better.
- Longer context costs more and runs slower. Keep what's relevant and leave room for the answer (chapters 13 and 38).

In the next chapter we'll look at how the model, after cutting text into tokens and laying them on the desk, actually "continues" with the next words.

## Sources and verification

- [OpenAI Cookbook: session memory](https://github.com/openai/openai-cookbook/blob/main/examples/agents_sdk/session_memory.ipynb) demonstrates trimming and summarizing history.
- [OpenAI Responses API parameters](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_create_params.py) document configurable truncation, context management, and output limits. These are examples of product behavior, not universal defaults.
- [OpenAI tiktoken](https://github.com/openai/tiktoken) provides tokenizer examples and model-to-encoding mappings.

The sources above were checked 2026-10-22.

- [Anthropic models overview](https://platform.claude.com/docs/en/about-claude/models/overview): current Claude models have a 1M-token context window and 128K-token maximum output, with 1M tokens roughly 555K English words; Claude Opus 5.5 costs $4 per million input tokens and $20 per million output tokens. Checked 2026-10-28.
- Token counts in this chapter were measured with js-tiktoken's o200k_base encoding and the [Qwen3-0.6B tokenizer file](https://huggingface.co/Qwen/Qwen3-0.6B) on 2026-10-28.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence is most accurate? <!-- quiz: q01 revision: 2 -->
   - A. A token is one character or one letter, so counting characters gives the token count
   - B. A token is one whole sentence; the model reads in a sentence at a time and takes it in
   - C. A token is the unit a model splits text into: a word, part of a word, or a character
   - D. A token is the model's unit for remembering you; the more it stores, the better it knows you
   > **Answer: C.** The units a tokenizer produces need not match characters or words one to one; the count depends on the encoding and the text. A is the most common misconception: character counts and token counts are only loosely related, with no fixed ratio. B pictures the unit as far too big; a sentence is usually split into several tokens. D mixes up how text is split with a product's "memory" feature.

2. **[Basic · Concept]** What does "context window" refer to? <!-- quiz: q02 revision: 2 -->
   - A. The token limit for one request, counting instructions, material, and the answer
   - B. The size of the chat app's input box; a bigger box lets you type more at once
   - C. How many days the model can remember you; past that, it forgets automatically
   - D. The total material the model read in training; a bigger window means it knows more
   > **Answer: A.** The window limits the tokens available in one request: system instructions, carried-over history and material, tool content, and the answer to be generated all have to fit; check the model's documentation for the exact input, output, and reasoning-token rules. B mistakes it for the input box on screen. C treats it as a memory period, but the model itself doesn't remember you across conversations. D confuses the window with training data: window size has no direct bearing on how much the model "knows."

3. **[Basic · Misconception]** "I told it my name yesterday, so it should still remember today." Where does this idea go wrong? <!-- quiz: q03 revision: 2 -->
   - A. It's right: the model writes every chat into its parameters, so it remembers forever
   - B. The model actually remembers, but pretends not to know you to protect your privacy
   - C. As long as it's the same account, all past chats are carried into a new one automatically
   - D. The model can use it only if the product brings saved information into the new chat
   > **Answer: D.** Ordinary inference doesn't write your name into the trained parameters, but a product can supply it again in a new conversation through saved memory, project material, or personalization settings. A is the very misconception to correct. B pictures the model as a person who "pretends." C goes too far: what gets carried over varies by product, and it isn't all your history by default. Check which memory and project features are on, and restate requirements that matter.

4. **[Advanced · Misconception]** "I only typed one short question this time, so I didn't use many tokens." What's wrong here? <!-- quiz: q04 revision: 2 -->
   - A. It's right: tokens are counted only from the words you typed yourself this time
   - B. Material pasted earlier, carried-over history, and its long reply usually count too
   - C. Only the model's reply counts as tokens; your input never counts, however long
   - D. It's right, because the window is cleared automatically at the start of each turn
   > **Answer: B.** Many people look only at the one line they typed and forget that the 10-page PDF pasted earlier, the history carried into every turn, and the 2,000-word reply are what really eat tokens. A is the very misconception in the question. C is half backwards: input and output both usually count toward usage, though at different rates. D is wrong: within one conversation, products usually keep carrying the relevant history forward rather than clearing it each turn.

5. **[Basic · Scenario]** You've chatted with the AI for a long time, and it starts answering off-topic and forgetting settings you stated earlier. What should you do first? <!-- quiz: q05 revision: 2 -->
   - A. Ask the same question a few more times word for word; one of the tries will be right
   - B. Keep asking in the same conversation; the longer it goes, the better it understands
   - C. Start a new chat and restate the goal, requirements, and facts you still need
   - D. Switch to a model with a bigger context window; that's sure to fix the problem
   > **Answer: C.** A long thread can contain missing, summarized, conflicting, or buried information. Carrying a checked summary of the goal, requirements, and necessary facts into a new conversation is a useful reset, though it doesn't prove the window was full or guarantee a correct answer. A only repeats itself without changing what's on the desk. B tends to pile up more noise. D lets you fit more, but buried key points and contradictions don't go away on their own.

6. **[Basic · Hands-on]** Choose a short public paragraph and its translation. Use an official web-based token counter (for example, OpenAI's [Tokenizer page](https://platform.openai.com/tokenizer), where you paste text and see how it's split and the token count; it reflects only how OpenAI models split text, and it was available as of October 2026, but check the official page), or the usage display in the product or API dashboard you use. Record the model, character count, and token count for each. Repeat after adding a small code snippet. If you can code, you can also count locally with [tiktoken](https://github.com/openai/tiktoken). <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** The ratio of characters to tokens depends on the tokenizer and the text. Compare translations with the same meaning rather than arbitrary passages, and don't infer a universal language ranking from one example. A counter only counts the text you paste; actual usage can also include system instructions, tool content, and output.