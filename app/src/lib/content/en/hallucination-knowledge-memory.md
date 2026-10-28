It can write poems, fix code, and boil a long article down to its main points. But you've surely also run into two deflating things: it **states errors with a straight face** — citing a paper that doesn't exist at all, quoting an "expert" who can't be found anywhere, making up numbers that sound utterly convincing; and it **doesn't remember you** — losing the thread in a fresh conversation today about something you told it only yesterday.

Both have to do with how it works; it isn't being "lazy." This chapter works through both at once: **hallucination** (why it gets things wrong), and **knowledge vs. memory** (what sticks and what's forgotten the moment you turn away). Understand this chapter and you'll have a feel for how much to trust it and where to put things. It's also the chapter in the whole book most about not stepping on landmines.

## 1. Hallucination: stating things that don't exist as if they were real

**Hallucination** means the model states **nonexistent or wrong** content in a **convincing** way. The trouble isn't that it can be wrong; everyone is wrong sometimes. The trouble is that wrong content often comes out just as fluent and assured as right content, so you can't tell them apart from the wording alone.

Why does this happen? There are two sides to it.

**First, generation itself doesn't check what's true.** The model's job is to produce a plausible continuation of what came before (Chapter 4), and it has no "fact database" to check each claim against. When its knowledge falls short, it can say "I'm not sure," and sometimes it does. But it can also follow the momentum of language and produce the answer that reads most plausibly. A fake paper comes out so convincing (a plausible title, authors, journal) precisely because it has seen what thousands of real papers look like. It isn't lying (lying requires knowing the truth first); it's carrying on even when it isn't sure.

**Second, training and evaluation often reward guessing.** In September 2025, researchers at OpenAI pointed out in the paper "Why Language Models Hallucinate" that many evaluations score only right or wrong, so answering "I don't know" earns zero, the same as a wrong answer. It's like a multiple-choice test with no penalty for wrong answers: a guess always beats a blank. A model optimized against such scoring learns to "give some answer even when unsure." The researchers propose changing evaluations to penalize wrong answers, so that appropriately expressing uncertainty no longer costs points.

So can the "confidence" it shows serve as a guide? A little, but never as proof. How sure a model sounds is somewhat related to how likely it is to be right: where it says outright that it isn't sure, it often really is more likely to be wrong, and that's worth taking seriously. The reverse doesn't hold, though: sounding certain and fluent doesn't prove it's right.

Once you understand the causes, the countermeasures follow naturally. These three are often used together: the first two reduce the chances of error, and the last is the backstop.

| Countermeasure | How to do it | What it's good for |
| --- | --- | --- |
| **Give it material** | Paste in reliable material and have it "answer based **only** on this," saying so if the material doesn't cover it | Shrinks the room for making things up at the source |
| **Ask for its basis, and allow "I don't know"** | Have it list sources and explain what its claim rests on; tell it plainly, "if you're not sure, say so" | No basis, or a dubious one, is a warning sign |
| **Double-check it yourself** | Check key facts (numbers, quotes, names, dates, legal or medical conclusions) against reliable sources | The last line of defense; the other two can't replace it |

> **Key point:** Fluency and confidence only show that it carries on smoothly; they don't prove the content is true. When it volunteers that it's unsure, take that seriously; when it sounds certain, still check the facts that matter. The more important something is, and the more readily it reels off specifics (numbers, sources, names, dates), the more you should verify them yourself. "Give it material and have it answer from that material" is exactly the core idea behind RAG (Chapter 20): rather than betting it remembers right, put the right material in front of it.

## 2. Knowledge vs. memory: one table to tell apart "sticks" and "forgotten in a blink"

What's in its head is actually of **two kinds**, with completely different temperaments. Confusing the two is where beginners most often trip.

- **Knowledge**: the common sense and facts **learned into its parameters** during training. It answers without hesitation and doesn't depend on the material you give this time. Ask it for the boiling point of water, or whether the Tang dynasty came before or after the Song, and it answers straight off.
- **Memory in context**: temporary information available in **the context of the current request** (the “table” from Chapter 3). The model can use your name or preferences when that information is retained or supplied again. **Closing the window does not delete the chat history**: the product may save it and supply selected parts when you continue. Product-layer long-term memory is explained below.

Side by side:

| | Knowledge | Memory |
| --- | --- | --- |
| Stored where | **Learned into the parameters** (in training) | Only in **this conversation's context** |
| Comes from | Huge amounts of training text | What you fed in this conversation |
| Lasts how long | Long-term (but has a "cutoff," see below) | Available only when included in the current context; history retention depends on the product |
| Answers without prompting | Yes, doesn't need material from you | No, depends entirely on what's laid on the table this time |
| Typical example | "Paris is the capital of France" | "I just said I'm allergic to peanuts" |

Knowledge has one hard limit you can't get around: the **knowledge cutoff**. The model's training data has a "deadline." The model **doesn't know on its own** about anything that happened, any new version that came out, or any new term that appeared **only after this point in time**. Push it to answer and it may say it doesn't know, or it may make something up.

> **Key point:** Each model's knowledge cutoff differs and shifts with versions, so this book doesn't pin it down — refer to the provider's official documentation. You just need to remember the intuition: **for anything that happened recently, by default don't trust the answer it reels off.** Either have it search the web (Chapter 19, and verify even what it finds) or paste the latest material in for it to read. Its "knowledge" is a snapshot of one moment, and it won't update on its own.

## 3. The misconception most worth clearing up: does it remember you long-term like a person?

This is the most important point worth sorting out in the chapter, and in the whole book. It picks up from that line in Chapter 3 and goes deeper.

After talking with it for a long time, it's hard not to feel it "knows" you. But remember the conclusion from Chapter 3: **the model itself has no cross-conversation memory.** In a fresh conversation, **unless the product supplies history, memory, or custom instructions**, the model does not automatically know what you said before. Within one conversation, if it runs so long that it nears the context limit, the product may summarize, trim, retrieve only the relevant pieces, or refuse an oversized request, and earlier details can get lost along the way (see Chapter 3). It isn't forgetful — **the model itself simply has no place to store things across conversations.**

But you'll immediately ask back: **then what about products' "project" and "memory" features? I've clearly seen it "remember" my preferences, remember a whole project!** This is the key thing that has to be made clear.

> **The model itself really has no cross-conversation memory; but many products provide a "memory" capability at the "product layer" outside the model.** As of October 2026, Claude, ChatGPT, and many other products offer project and memory features; there are also project instruction files in coding tools (such as CLAUDE.md; how they're loaded is described in the official docs), personalization settings in your account, company knowledge bases, and so on. But this **isn't the model itself growing a memory; it's the product layer putting the relevant information back into the current context during the conversation.** So these features being there isn't a contradiction: lift the lid and underneath it's still a memory-less model plus context re-fed each time (exactly that "table" from Chapter 3). Some products automatically extract things to remember from your chats, and this may be on by default; for exactly how each company remembers, how long, whether it's on or off by default, and whether it can be deleted, refer to the provider's official documentation (Chapters 10 and 13).

Telling these two layers apart beats memorizing any one product's usage:

| | The model itself | The product layer's "memory" |
| --- | --- | --- |
| What it is | The core that only picks words by probability | A layer of features the product adds outside the model |
| Does it remember you | **Does not store past conversations itself**; uses the information supplied for this request | Stores "what should be remembered" for you |
| How it's done | (nothing) | **During the conversation, puts this information back into the current context** (back to that table again) |
| The limit of what it "remembers" | (nothing) | Always only **the part the product decides to put back on the table**; whatever isn't put back, it still doesn't know |

> **Key point:** Once you understand "**no memory underneath, the upper layer re-feeds it**," you can predict how these features behave: what it can "remember" is always the part the product puts back into context for you; what you assume it should remember but the product didn't put back, it just doesn't know. This also explains why it sometimes "inexplicably forgot" a preference you set — most likely that piece of information wasn't put back on the table this time. This may reflect retrieval, settings, or context selection, but it could also be a fault; forgetting alone does not establish the cause.

## 4. Tying off the earlier "misconceptions"

This chapter has two misconceptions that echo each other, clearest placed side by side:

- **"The more confident it is, the more reliable."** Wrong. How sure it sounds is only somewhat related to being right, and fluency and confidence aren't evidence; the more important and the more readily it answers off the cuff, the more you should verify it yourself.
- **"It remembers me long-term like a person."** Wrong. The model itself has no cross-conversation memory; the "remembering" you see is the product layer putting information back into context, not the model itself remembering.

These two things are really **two sides of the same underlying fact**: it has no "truth database" and no "long-term memory store." All it has is the knowledge learned into its parameters during training (with a cutoff) plus the context laid on the table this time. Lock this in, and its getting things wrong and its forgetting both stop being strange.

## 5. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| The more fluent and confident it sounds, the more reliable | Fluency and confidence aren't evidence; take "I'm not sure" seriously, and check important facts even when it sounds certain |
| It never admits it doesn't know | It can say "I'm not sure," and explicitly allowing it to often helps; but you can't count on it noticing every time it's unsure |
| Its "errors" are occasional lapses, and a reminder fixes them | Hallucination is tied to how generation works and to training and evaluation that reward guessing; guard against it by giving material, asking for its basis, and double-checking |
| It knows what just happened | Knowledge has a **cutoff**; it doesn't know what came after on its own, and pushing it can lead to made-up answers; have it search the web or feed it material (refer to the provider's official documentation) |
| What you told it this time, it'll remember forever | That is memory in context; using it again depends on whether the product retains and supplies the relevant information |
| A "memory" feature means the model itself remembered me | It's the **product layer** putting information back into context, not the model itself remembering; refer to the provider's official documentation for specifics |

## Summary

- **Hallucination**: stating nonexistent/wrong things as if they were real. Causes include generation itself not checking truth (Chapter 4) and training and evaluation that often reward guessing over admitting uncertainty. Countermeasures: give it material so it "answers based only on the material" (leading to RAG in Chapter 20), ask for its basis and allow "I don't know," and double-check key facts yourself.
- How sure it sounds is somewhat related to being right, and "I'm not sure" is a signal worth heeding; but fluency and confidence by themselves are never evidence.
- **Knowledge vs. memory**: knowledge is **learned into the parameters** and comes without prompting, but has a **knowledge cutoff**; memory in context is limited to **the information visible in this request**; the product manages stored chat history. When a long conversation nears the limit, the product may summarize, trim, or retrieve, and details can get lost (Chapter 3).
- The model itself has **no cross-conversation memory**; the project and memory features, coding tools' project instruction files, account preferences, company knowledge bases, and so on that you see are **the product layer putting information back into context**, not the model itself remembering. Refer to the provider's official documentation.
- One line to wrap it up: it has neither a "truth store" nor a "long-term memory store," only **knowledge in its parameters (with a cutoff) plus the context on the table this time**. Its getting things wrong and its forgetting both tie back to this.

That's the end of Part One. You've built the intuition for "what the model is and how it runs." From the next part, we turn to **how to use it well**: from your first serious conversation to the prompting skill of saying "what I want" clearly.

## Sources and verification

- Kalai, Nachum, Vempala, and Zhang, *Why Language Models Hallucinate* (September 2025): [arXiv paper page](https://arxiv.org/abs/2509.04664). The paper argues that training and evaluation procedures tend to reward guessing over acknowledging uncertainty; under right-or-wrong scoring, "I don't know" earns no credit. OpenAI published an accompanying article, ["Why language models hallucinate"](https://openai.com/index/why-language-models-hallucinate/), at the same time.
- [Claude Help Center: chat search and memory](https://support.claude.com/en/articles/11817273): an example of product-layer memory, explaining that memory is saved automatically as you chat, is on by default for some plans, and how to view and delete it.

Sources checked 2026-10-27.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What does "hallucination" refer to? <!-- quiz: q01 revision: 2 -->
   - A. The model freezes up or answers extremely slowly, as if it got confused
   - B. The model lies on purpose to mislead users, with a clear goal in mind
   - C. The model states nonexistent or wrong content in a convincing way
   - D. The model leaks the contents of your conversation to other users
   > **Answer: C.** The heart of hallucination is wrong content stated as if it were real, hard to tell apart from the wording alone. Causes include generation not checking truth and training and evaluation that often reward guessing. A is a performance problem and D a privacy problem (Chapter 37); neither is hallucination. B treats it as deliberate deception, but carrying on with a plausible error when unsure is not the same as "knowing the truth and lying."

2. **[Basic · Concept]** Which pair correctly distinguishes "knowledge" from "memory"? <!-- quiz: q02 revision: 2 -->
   - A. Knowledge comes from training, with a cutoff; memory relies on this context
   - B. Knowledge holds only in this chat, while memory is written into the parameters
   - C. Both update automatically over time, so any question gets the latest answer
   - D. They're the same thing, just two different names for one feature
   > **Answer: A.** Knowledge comes from training and stays long-term but has a "knowledge cutoff"; memory in context relies on information supplied in this request, and the product manages saved history (closing the window doesn't necessarily delete it). B reverses the two. C is wrong: knowledge stops at the cutoff, and memory doesn't update itself either. D ignores the basic difference in where they come from and how long they last. A product can save and resupply memory, but that doesn't mean the model's parameters learned it.

3. **[Advanced · Misconception]** It gives you an answer full of citations and stated with conviction. Someone says "so smooth and so self-assured, it must be reliable." Which view is most sound? <!-- quiz: q03 revision: 2 -->
   - A. Right: when the model sounds sure it's usually correct, so use it with confidence
   - B. The reverse: the more certain it sounds, the more it's making up, so trust none of it
   - C. It even cites its sources, so the content must already have been fact-checked
   - D. Certainty is only partly tied to being right; fluency and confidence aren't proof
   > **Answer: D.** How sure the model sounds is somewhat related to being right, and "I'm not sure" deserves attention; but sounding certain and fluent doesn't prove it's right, so important facts still need checking. A stretches "somewhat related" into "use it with confidence." B swings to the opposite: confident answers are often right, and distrusting everything is just as inaccurate. C is dangerous too: even the "sources" can be made up, so have it give its basis and then check for yourself.

4. **[Advanced · Misconception]** "The product I use has a 'memory' feature that remembers my preferences, so the model itself remembers me." What's wrong? <!-- quiz: q04 revision: 2 -->
   - A. It shows this model is more advanced, with long-term memory built in from birth
   - B. The product puts saved information back into context; the model itself is unchanged
   - C. Your details were written into the parameters for good, so it will always know them
   - D. It's entirely right; the model itself has firmly remembered who you are
   > **Answer: B.** The key is separating the two layers: the model itself has no cross-conversation memory, and a "memory" feature is the product layer putting saved information back into context during the conversation (that table from Chapter 3). What it can "remember" is always only the part the product decides to put back; for how it's stored and whether it can be deleted, refer to the official documentation. A mistakes a product feature for an innate model ability. C assumes the parameters changed, but product-layer memory doesn't alter the model's parameters. D is the very misconception in the question.

5. **[Basic · Scenario]** You want it to help you learn the details of "some new product launched only last month," and it answers in great detail. What's the safest approach? <!-- quiz: q05 revision: 2 -->
   - A. Raise the temperature a bit and ask again so it answers from a different angle
   - B. Ask it several times; if the answer is the same every time, it must be right
   - C. Suspect the knowledge cutoff; have it search or give it material, then check
   - D. It answered in such specific detail that you can just take it at its word
   > **Answer: C.** "What happened recently" is exactly the knowledge cutoff's blind spot, and it may make up something very convincing. Either have it search the web (Chapter 19, and verify what it finds) or paste in official material and have it answer from that, then check the key points yourself. A doesn't solve anything; a higher temperature just makes it pick more loosely (Chapter 8). B isn't reliable; made-up content can come out the same every time. D walks right into the hallucination trap: detail doesn't mean truth.

6. **[Basic · Hands-on]** Deliberately ask it a **fairly obscure and specific** fact (like the publication year of some niche book, or the exact clause of some regulation) and require it to "give the source"; then paste in a reliable piece of material you have on hand, have it answer the same question "based only on this material," and tell it to say so if the material doesn't cover it. Compare the two. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** Without material, it may invent a convincing "source" that can't be found, or it may honestly say it isn't sure; once it has material and must answer only from it, the answer is usually easier to check and less likely to be made up. This is exactly the core idea of RAG (Chapter 20): rather than betting it remembers right, put the right material in front of it. Compare them once yourself and you'll see more clearly that sounding convincing is not the same as being backed by evidence.
