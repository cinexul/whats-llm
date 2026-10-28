A lot of people who use AI have hit these "odd things": partway through a conversation it forgets what you said at the start; you paste in a long article and it says "too long"; you ask roughly the same amount as before, yet this month's quota burns down fast.

These seemingly unrelated phenomena are really one and the same thing underneath: **AI sees text differently from how we do.** It doesn't read character by character, and it doesn't "remember" the whole conversation in its head. Understand the two words in this chapter, **token** and **context window**, and all those odd things make sense. This is also one of the most practical chapters in the book: understand it, and a lot of what you do with AI will suddenly "click."

## 1. Token: the "grains" AI cuts text into

When we read “please help me write an email,” we see six words. The model processes a sequence of **tokens**:

```text
Input:  please help me write an email
Tokens: please / help / me / write / an / email      (the split is just illustrative)
```

A token is a **unit used to represent text for the model**, not necessarily a character or a word. A **tokenizer** applies an encoding and vocabulary prepared for the model; it does not invent a new splitting rule every time you chat.

- A token may be a word, a word fragment, a character, or a fragment of a character’s encoding. Punctuation, spaces, and line breaks count too, sometimes combined with neighboring text in one token.
- **Different models may use different tokenizers, and some share one.** Counts depend on the encoding and text. Do not assume a fixed ratio between characters, words, languages, or models.

> **Why does the model cut it this way?** Because cutting by "letters" makes the sequence too long and too fragmented for the model to grasp meaning; cutting by "whole words," there are far too many words in the world and they keep coming (new words, misspellings, foreign words). Tokens are a compromise between the two: **not too fragmented, yet able to spell out any text**, including words it has never seen. You don't have to remember exactly how it's cut. It's enough to know "the length in the model's eyes is counted in tokens, and it doesn't exactly match the character count you'd tally."

> **Quick-math sidebar: roughly how many tokens is a passage?**
> Building a **sense of scale** is enough: a short passage of a few hundred Chinese characters is usually a few hundred to a bit over a thousand tokens. If you want a finer rule of thumb: common English is roughly "4 characters ≈ 1 token," and Chinese is often "1 character ≈ 1 to 2 tokens."
> But these are all **rough rules of thumb, not iron laws**: how many tokens you actually get depends on **which model's tokenizer** is used, and is also affected by punctuation, spaces, digits, and any code mixed in. People used to say "English uses fewer tokens than Chinese," but on newer tokenizers that gap has shrunk a lot, and it can't be taken as a law. **For precision, use the official token-counting tool for the product in question, and refer to the provider's official documentation.**

## 2. The context window: the model's "workbench"

Once you know tokens, the second word is easy.

The **context window** limits the tokens available for a model request. Think of it as the space used by the input context plus the generated response; exact accounting and separate input/output limits depend on the model. System instructions, tool definitions/results, and the "thinking" tokens a reasoning model generates before it answers (reasoning tokens, chapter 8) also use the relevant budget. Leave room for the answer.

An analogy: the context window is like a **desk**. To handle something, you have to lay all the relevant material out on the desktop. What you said, its earlier replies, the document you pasted in, the instructions you gave it: **all of it takes up desk space.** Desks come in different sizes, but even a big one has an edge.

```text
Everything spread on the desk this conversation counts toward the context window:
┌─────────────────────────────────────────────┐
│  The instructions you gave ("use a casual tone")  │
│  The material you pasted (that 5,000-word article) │
│  The questions you've asked over time              │
│  The answers it's given over time                  │
└─────────────────────────────────────────────┘   ← the total can't exceed the window limit
```

> **Key point:** What's on the desk **isn't just the characters you typed.** The long text you pasted in and the lengthy replies it wrote are what really take up space. Many people stare at their own short line of a question, puzzled that "I barely said anything," forgetting that the 10-page PDF they just pasted in and its rambling 2,000-word answer already covered the desk.

Different products and different models have desks of different sizes, and they keep getting bigger, so **this book won't give specific numbers** (writing them down would go stale fast; refer to the provider's official documentation). You only need to build the intuition that "the desktop is limited."

## 3. Conversation context and trained knowledge are different

This is where beginners most easily go wrong, so let's pull it out and address it on its own.

A model can use earlier conversation text, but **ordinary chat does not write each conversation into its trained parameters**. Whether the service stores transcripts, memories, or logs is a separate product and privacy question.

The software makes **selected conversation state available for the next response**. A simple implementation sends the whole message history. Other products may maintain state on the server, reuse cached processing, select relevant passages, or supply summaries. The diagram below shows the simple case, not a requirement to resend everything unchanged.

```text
Round 1:       [your question A]                              → answer a
Round 2:    [question A + answer a + your question B]         → answer b
Round 3: [question A + answer a + question B + answer b + question C]  → answer c
            └──────── illustrative full-history implementation ────────┘
```

“Remembering the conversation” means the relevant information is available in the current context or supplied through product features. Near the limit, a product may **summarize, trim, retrieve selected content, or reject an oversized request**. Losing details is possible, but it is not a universal rule that the oldest text is automatically dropped.

> **Misconception vs. reality:** “I told it my name yesterday, so a new conversation must remember.” It may remember only if the product supplies that information through history, saved memory, project material, or personalization. A new chat still has system instructions and may have such context; it is not necessarily a blank desk. Check what is enabled and repeat critical requirements.

For an **online service**, material you submit is sent to that service for processing. Context management does not mean the service has deleted its stored copy. Retention and training use are separate questions (Chapter 37); local processing has a different data path.

### Then what are products' "project" and "memory" features?

You might immediately push back: but I've clearly seen products that can "remember" my preferences, remember a whole project. As of October 2026, Claude, ChatGPT, and many other products offer **project** and **memory** features: projects let you keep material and instructions together for reuse, and memory stores your preferences and points from past chats. Coding tools often have project instruction files, your account has personalization settings, and a company may connect an internal knowledge base. Doesn't this contradict "the model has no memory"?

**No contradiction.** The key is to separate two layers:

| | The model itself | The product layer's "memory" |
| --- | --- | --- |
| What it is | Trained parameters used with the current context | Features for storing and supplying relevant information |
| Does it remember | Ordinary inference does not save the chat into its parameters | May retain history, preferences, or project material |
| How it works | Uses the context available for this request | Supplies selected information when relevant; not necessarily every stored item on every turn |

In other words, remembering your preference usually means the **product supplied relevant saved information**, rather than your conversation retraining the model. That is distinct from the training-data memorization discussed in Chapter 2.

> **Key point:** Project and memory features differ in scope from product to product. Some products **automatically extract** things to remember from your chats, and this may be on by default; on the other hand, not every saved item is used in every answer. For things you don't want remembered, use a temporary chat (some products call it incognito) or turn memory off first; now and then, check what's been saved in settings and delete anything outdated or wrong. For what's saved, used, and shared, and how to delete it, check the official documentation (Chapters 10 and 13).

## 4. Why can a long conversation lose track?

Even before the context limit is reached, a long conversation **can become harder to follow**. Length alone does not determine quality: useful context can improve an answer, while irrelevant or conflicting material can hurt it. Three possible problems fit the "desk" analogy:

| Reason | Desk metaphor | What it looks like |
| --- | --- | --- |
| The point gets buried | Too much material on the desk; the truly important sheet is pressed underneath | A key requirement you set early on, it later "can't see" |
| Contradictions pile up | Old discarded approaches and wrong info from trial and error are still spread on the desk | It gets dragged along by its own earlier mistakes, drifting further off |
| Summarizing loses detail | As the desk fills up, old material gets "boiled down to a sticky note," and the details are gone | Specific numbers and agreements stated early get blurred |

> **How you'll actually run into it:** A typical scene: you and it polish a draft back and forth, and the first 10 rounds are great, but the further on it goes the more "stubborn" it gets, starting to ignore your new requirements and rehash phrasings it already rejected. This isn't it "getting tired." It's that the desk is packed with this long string of trial and error, and **the noise has drowned out the signal.**

## 5. Tokens also decide "the cost" and "how much you can fit"

One last practical thing: **the token is the unit of measure.**

- Many **text APIs** meter input and output tokens, often at different rates, with possible cache discounts and tool charges. Subscription quotas may instead depend on messages, tools, compute, model choice, or other limits; they are not universally a visible token balance.
- The **context limit** is measured in tokens, but products may also impose file-size, page-count, or upload limits. A document may be retrieved in parts rather than placed entirely in the context.

So you get situations like this: you feel "I just asked a small question," but because you pasted a big chunk of material earlier and then had it generate a long answer, **tokens climb fast and the quota drops fast.** Chapter 38 covers how to "use it sparingly"; for now, remember one sentence:

> **Key point:** **Keep the material relevant and leave room for the response.** Longer input can increase processing, cost, and distraction, but useful context can improve accuracy, and caching or plan rules change the cost. A fuller desk is not automatically worse.

## 6. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A token is one character | A token is a unit of text representation; it can be a word, half a word, or a character, and doesn't map exactly to "character count" |
| It must remember every earlier chat | The application chooses what history or memory to supply. Ordinary inference does not write the chat into the trained parameters |
| I only typed one short line this time, so it didn't cost much | The long text pasted earlier, the history carried along, and its long answer are what really eat tokens |
| The bigger the context window, the more carefree | A bigger window holds more, but relevance, output room, retrieval, and actual pricing still matter |
| Forgetting always means a malfunction | Missing or summarized context is one possible cause; a model can also overlook information that is still present |

## Summary

- A **token** is a tokenizer’s unit of text. Use the model’s actual encoding or provider counter for precise counts; subscription quotas need not be token balances.
- The **context window** is the upper limit on the tokens the model can lay on the "desk" in a single request. What you say, what it says, and the material you paste all take up the desk.
- The application manages **conversation state**. Full history, saved state, selected passages, and summaries are different ways to supply context; they are not new learning in the model’s parameters.
- A long conversation can lose focus when key details get buried, instructions conflict, or summaries omit information. Useful context can also improve the answer.
- Keep **relevant context** and reserve output space. Check actual usage and pricing rather than assuming length alone determines accuracy, speed, or cost (Chapters 13 and 38).

In the next chapter we'll look at this: after the model cuts text into tokens and lays them on the desk, how does it actually "continue" with the next sentence?

## Sources and verification

- [OpenAI Cookbook: session memory](https://github.com/openai/openai-cookbook/blob/main/examples/agents_sdk/session_memory.ipynb) demonstrates trimming and summarizing history.
- [OpenAI Responses API parameters](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_create_params.py) document configurable truncation, context management, and output limits. These are examples of product behavior, not universal defaults.
- [OpenAI tiktoken](https://github.com/openai/tiktoken) provides tokenizer examples and model-to-encoding mappings.

The sources above were checked 2026-10-22.

- [Claude Help Center: chat search and memory](https://support.claude.com/en/articles/11817273): at the time of checking, it states that memory is on by default for Free, Pro, and Max plans, is saved automatically as you chat, excludes incognito chats, and is kept separately for each project, and explains how to view and delete it. Checked 2026-10-27.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence is most accurate? <!-- quiz: q01 revision: 1 -->
   - A. A token is one character or one letter, so counting characters gives the token count
   - B. A token is one whole sentence; the model reads in a sentence at a time and takes it in
   - C. A token is the unit a model splits text into: a word, part of a word, or a character
   - D. A token is the model's unit for remembering you; the more it stores, the better it knows you
   > **Answer: C.** The units a tokenizer produces need not match characters or words one to one; the count depends on the encoding and the text. A is the most common misconception: character counts and token counts are only loosely related, with no fixed ratio. B pictures the unit as far too big; a sentence is usually split into several tokens. D mixes up how text is split with a product's "memory" feature.

2. **[Basic · Concept]** What does "context window" refer to? <!-- quiz: q02 revision: 1 -->
   - A. The token limit for one request, counting instructions, material, and the answer
   - B. The size of the chat app's input box; a bigger box lets you type more at once
   - C. How many days the model can remember you; past that, it forgets automatically
   - D. The total material the model read in training; a bigger window means it knows more
   > **Answer: A.** The window limits the tokens available in one request: system instructions, carried-over history and material, tool content, and the answer to be generated all have to fit; check the model's documentation for the exact input, output, and reasoning-token rules. B mistakes it for the input box on screen. C treats it as a memory period, but the model itself doesn't remember you across conversations. D confuses the window with training data: window size has no direct bearing on how much the model "knows."

3. **[Basic · Misconception]** "I told it my name yesterday, so it should still remember today." Where does this idea go wrong? <!-- quiz: q03 revision: 1 -->
   - A. It's right: the model writes every chat into its parameters, so it remembers forever
   - B. The model actually remembers, but pretends not to know you to protect your privacy
   - C. As long as it's the same account, all past chats are carried into a new one automatically
   - D. The model can use it only if the product brings saved information into the new chat
   > **Answer: D.** Ordinary inference doesn't write your name into the trained parameters, but a product can supply it again in a new conversation through saved memory, project material, or personalization settings. A is the very misconception to correct. B pictures the model as a person who "pretends." C goes too far: what gets carried over varies by product, and it isn't all your history by default. Check which memory and project features are on, and restate requirements that matter.

4. **[Advanced · Misconception]** "I only typed one short question this time, so I didn't use many tokens." What's wrong here? <!-- quiz: q04 revision: 1 -->
   - A. It's right: tokens are counted only from the words you typed yourself this time
   - B. Material pasted earlier, carried-over history, and its long reply usually count too
   - C. Only the model's reply counts as tokens; your input never counts, however long
   - D. It's right, because the window is cleared automatically at the start of each turn
   > **Answer: B.** Many people look only at the one line they typed and forget that the 10-page PDF pasted earlier, the history carried into every turn, and the 2,000-word reply are what really eat tokens. A is the very misconception in the question. C is half backwards: input and output both usually count toward usage, though at different rates. D is wrong: within one conversation, products usually keep carrying the relevant history forward rather than clearing it each turn.

5. **[Basic · Scenario]** You've chatted with the AI for a long time, and it starts answering off-topic and forgetting settings you stated earlier. What should you do first? <!-- quiz: q05 revision: 1 -->
   - A. Ask the same question a few more times word for word; one of the tries will be right
   - B. Keep asking in the same conversation; the longer it goes, the better it understands
   - C. Start a new chat and restate the goal, requirements, and facts you still need
   - D. Switch to a model with a bigger context window; that's sure to fix the problem
   > **Answer: C.** A long thread can contain missing, summarized, conflicting, or buried information. Carrying a checked summary of the goal, requirements, and necessary facts into a new conversation is a useful reset, though it doesn't prove the window was full or guarantee a correct answer. A only repeats itself without changing what's on the desk. B tends to pile up more noise. D lets you fit more, but buried key points and contradictions don't go away on their own.

6. **[Basic · Hands-on]** Choose a short public paragraph and its translation. Use an official web-based token counter (for example, OpenAI's [Tokenizer page](https://platform.openai.com/tokenizer), where you paste text and see how it's split and the token count; it reflects only how OpenAI models split text, and it was available as of October 2026, but check the official page), or the usage display in the product or API dashboard you use. Record the model, character count, and token count for each. Repeat after adding a small code snippet. If you can code, you can also count locally with [tiktoken](https://github.com/openai/tiktoken). <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** The ratio of characters to tokens depends on the tokenizer and the text. Compare translations with the same meaning rather than arbitrary passages, and don't infer a universal language ranking from one example. A counter only counts the text you paste; actual usage can also include system instructions, tool content, and output.