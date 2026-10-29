It can write poems, fix code, and summarize a long article neatly, yet you've probably run into two letdowns. One: it gets things wrong with total seriousness, citing a paper that doesn't exist, naming an "expert" nobody can find, making up numbers that look perfectly real. Two: it doesn't remember you. Something you told it yesterday means nothing to it today when you start a new conversation.

Both come from how it works; it isn't "slacking." This chapter covers three things: why it gets things wrong (hallucination), how to catch the mistakes (checking), and what it keeps versus what's gone in a blink (knowledge and memory). Whenever other chapters of this book say "check it," they mean the methods in this chapter.

## 1. Hallucination: stating things that don't exist as if they were real

**Hallucination** is when the model states things that don't exist, or are wrong, as if they were true. Making mistakes isn't the surprising part; everyone does. The trouble is that wrong content often reads just as smoothly and confidently as right content, so you can't tell them apart by the wording.

Why does this happen? There are two reasons.

First, it doesn't check whether things are true while it writes. What the model does is produce a plausible continuation of what came before (Chapter 4); it has no "fact database" to check each claim against. When its knowledge runs out it can say "I'm not sure," and sometimes it really does. But it may also just keep going and land on whatever answer reads most naturally. A fake paper can look real, with a title, authors, and a journal all in place, precisely because the model has seen what thousands of real papers look like. It isn't lying (to lie you have to know the truth first); it just keeps talking when it isn't sure.

Second, training and evaluation often encourage guessing. In September 2025, OpenAI researchers pointed out, in the paper "Why Language Models Hallucinate" and an accompanying article, that many evaluations only score right or wrong, so answering "I don't know" gets zero, the same as a wrong answer. It's like a multiple-choice test that doesn't take points off for wrong answers: a guess always beats a blank. A model tuned against that standard easily learns to "give some answer even when unsure." They suggest that evaluations take off more for wrong answers than for saying "not sure," so that being honest about uncertainty no longer costs anything.

So can you go by how confident it seems? A little, but not as evidence. How sure the model is does have some link to how likely it is to be right: where it clearly says "I'm not sure," it often is more likely to be wrong, so take that seriously. The reverse doesn't hold, though: sounding certain and smooth doesn't prove it's right.

## 2. How to check: a method you can follow

Not every sentence needs checking. For brainstorming, rewording, or title ideas, if it looks right, that's fine. But mistakes in the following are costly, so check them one by one: numbers and amounts, dates, names of people and organizations, quotations and citations, links, legal, medical, and financial conclusions, "recent events," and any code or formulas you'll actually run.

Checking takes four steps:

1. Make it harder for it to make things up. Paste in reliable material, ask it to answer only from that material and to say "it's not in the material" when something isn't there, and tell it plainly: "If you're not sure, say so." This cuts down on mistakes, but it doesn't replace the steps that follow.
2. Make it show where things come from. Ask for each key claim to name which document and which sentence it comes from, or to give a link you can open. Anywhere it can't say, or is vague about it, is where to look hardest.
3. Go to the source yourself. Open the link and confirm the page exists and actually says that; don't go by the title. Compare quotations word for word, and take numbers back to the original table or report. For papers and books, search the title in a scholarly search engine or on the publisher's site, and if there's a DOI number, enter it at doi.org and see whether it opens. The "source" it gave may itself be made up.
4. Check against one more independent source: an official website, the original document, a trusted reference work. Redo anything numerical with a calculator or spreadsheet, and actually run code and its tests (Chapter 25). Asking the same AI again in different words doesn't count, because made-up content can come out the same every time. Having another AI look for errors can point out things that seem off, but you still need to confirm them at the source.

For important conclusions, jot down the source and the date you checked. Next time you use it, or when someone asks, you can say where it came from. The idea behind step 1 is "put the right material in front of it rather than bet on its memory," and that's also the basic idea behind RAG (Chapter 20).

## 3. Knowledge vs. memory: one table to tell "sticks" from "forgotten in a blink"

What it "knows" actually comes in two kinds that work completely differently. The most common beginner mistake is treating them as the same thing.

- **Knowledge**: common sense and facts learned into its parameters during training. It can answer without any material from you; ask "the boiling point of water" or "did the Tang dynasty come before or after the Song," and it answers right away.
- **Memory in context**: temporary information it can use within this request's context, the "table" from Chapter 3. A name or preference you told it can be used only if it's still on the table or gets put back there. Closing a window doesn't necessarily delete the chat history: a product may keep it and put part of it back when you carry on.

Side by side:

| | Knowledge | Memory in context |
| --- | --- | --- |
| Where it lives | Learned into the parameters (during training) | Only in this request's context |
| Where it comes from | Huge amounts of training text | What you put into this conversation, or what the product put in for you |
| How long it lasts | Always there, but has a cutoff date (see below) | Unusable unless it's in this request's context; whether history is saved is up to the product |
| Can it answer without material? | Yes | No, it depends on what's on the table this time |
| Typical example | "Paris is the capital of France" | "I just told you I'm allergic to peanuts" |

Knowledge has a limit you can't get around, called the **knowledge cutoff**: the training data has a last date, and the model itself doesn't know about events, new versions, or new terms that came after it. Ask anyway, and it may say it doesn't know, or it may make something up. For example, as of October 2026, Anthropic lists the reliable knowledge cutoff of Claude Opus 5.5 as June 2026, so it knows very little on its own about anything after that. When you ask "what happened recently," don't trust an answer it gives without looking anything up: either have it search the web (Chapter 19, and check what it finds using the steps in the previous section) or paste in up-to-date material.

## 4. The misconception most worth clearing up: does it remember you long-term like a person?

After chatting with it for a while, it's natural to feel it "knows" you. But as Chapter 3 said, the model itself has no memory across conversations. When you start a new conversation, unless the product brings in history, memory, or custom instructions, the model doesn't know what you said before. And when one conversation runs long and gets close to the context limit, the product may summarize, cut some of it, pull in only the relevant pieces, or just refuse, so earlier details can get lost (Chapter 3). The model itself simply has no place to keep anything from one conversation to the next.

You might ask right away: then what about the "projects" and "memory" features in products? I've definitely seen it remember my preferences and a whole project.

The answer is that these features are built in the product layer, outside the model. As of October 2026, many products, including Claude and ChatGPT, have project and memory features, and there are also project instruction files for coding tools (such as CLAUDE.md; see Chapter 28), account personalization settings, internal company knowledge bases, and so on. They all do the same thing: during a conversation, they put the relevant information back into this request's context. Underneath, it's still "a model with no memory, plus context put back in each time." Some products automatically pick out things to remember from your chats, possibly by default; exactly what each one remembers, for how long, whether it's on by default, and whether you can delete it vary and change quickly, so check each product's official description (Chapter 13 covers managing it, and Chapter 37 the privacy side).

| | The model itself | Product-layer "memory" |
| --- | --- | --- |
| What it is | The core that continues text by probability | A layer of features the product adds outside the model |
| Does it remember you? | Doesn't save past conversations itself; sees only what this request provides | Stores "what should be remembered" for you |
| How | — | Puts that information back into this request's context during the conversation |
| Limits of what it "remembers" | — | Only the part the product decides to put back on the table; anything not put back, it still doesn't know |

Keep these two layers apart and you can guess how these features will behave. What it "remembers" is always the part the product put back into the context. When it suddenly "forgets" a preference you set, that piece of information most likely wasn't put back on the table this time; the cause may be in the product's search, settings, or choice of context, or it may be a bug, and "it forgot" alone doesn't tell you which.

## 5. Common misconceptions, cleared up

| Misconception | Reality |
| --- | --- |
| The more fluent and confident it sounds, the more reliable | Fluency and confidence aren't evidence; take "I'm not sure" seriously, and check important facts even when it sounds certain |
| It never admits it doesn't know | It can say "I'm not sure," and telling it that's allowed often helps; but you can't count on it noticing its uncertainty every time |
| Getting things wrong is an occasional lapse; a reminder fixes it | Hallucination is tied to how it generates text and to training and evaluation that reward guessing; prevent it by supplying material, asking where things come from, and checking at the source |
| If the same question gets the same answer every time, it's right | Made-up content can also come out the same every time; check against an independent source |
| It knows about recent events | Its knowledge has a cutoff; it doesn't know what came after and may make things up if you ask anyway; have it search the web or give it material |
| A "memory" feature means the model itself remembers me | The product layer puts information back into the context; the model itself doesn't remember |

## Summary

- Hallucination means stating things that don't exist, or are wrong, as if they were real. One cause is that it doesn't check truth while generating (Chapter 4); the other is that training and evaluation often reward guessing rather than admitting uncertainty. Take "I'm not sure" seriously, but fluency and confidence are never evidence in themselves.
- The four steps of checking: give it material so it makes less up, make it show where things come from, go to the source yourself, and check against one more independent source. Numbers, dates, names, quotations, links, professional conclusions, and recent events need it most.
- Knowledge is learned into the parameters and needs no material from you, but has a knowledge cutoff; memory in context is limited to what this request can see, and whether chat history is kept is up to the product.
- The model itself has no memory across conversations. Projects, memory features, project instruction files, account preferences, and company knowledge bases are the product layer putting information back into the context.
- In short, it has neither a "truth database" nor a "long-term memory store," only knowledge in its parameters (with a cutoff) and the context on the table this time. Both its mistakes and its forgetting come from this.

That's the end of Part One: you now have a rough feel for what the model is and how it works. The next part is about using it well, from your first serious conversation to using prompts to make clear what you want.

## Sources and verification

- Kalai, Nachum, Vempala, and Zhang, *Why Language Models Hallucinate* (September 2025): [arXiv paper page](https://arxiv.org/abs/2509.04664). The paper argues that training and evaluation procedures tend to reward guessing over acknowledging uncertainty. OpenAI's accompanying article, ["Why language models hallucinate"](https://openai.com/index/why-language-models-hallucinate/), explains that accuracy-only scoring encourages models to guess rather than say "I don't know," and suggests penalizing confident errors more than expressions of uncertainty. Source checked 2026-10-29.
- [Claude Help Center: chat search and memory](https://support.claude.com/en/articles/11817273): an example of product-layer memory, explaining that memory is saved automatically from chats, is on by default on the Free, Pro, and Max plans, and how to view and delete it. Source checked 2026-10-29.
- [Anthropic: models overview](https://platform.claude.com/docs/en/about-claude/models/overview): the comparison table lists Claude Opus 5.5's reliable knowledge cutoff as June 2026. Source checked 2026-10-29.

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
