In the last chapter you learned to "state your requirements clearly." This chapter applies that craft to a high-frequency scenario almost everyone needs: **give it a big pile of material and have it read it and summarize it for you.**

A contract, a paper, meeting notes, dozens of emails, a manual: feeding it to AI and having it "read it all and report the key points" is one of the biggest time-savers it offers. But there are two traps here that beginners almost always hit. One, **the material is too long and it says "won't fit"** (or barely fits but reads it in a muddle); two, it will **"invent" things not in the material into the summary** (that old problem from Chapter 9 again).

This chapter teaches the right way to feed material in: how to feed a long document, how to get it to answer honestly **from the material you gave alone**, and what the routines are for summarizing, comparing, and extracting. Master it and you turn AI into a reliable "material assistant."

## 1. First understand "why it won't fit," back to that desk

To feed it well, first understand why it gets "stuffed." This follows straight from Chapter 3.

The amount of text the model can "spread out and look at" at once has a ceiling: the "desk" of the **context window**. The long material you paste in, the summary it generates, your earlier conversation, **all take up desk space.** Once the material gets long, the desk fills up, and so:

- either it tells you outright "too long" and won't fit;
- or it barely squeezes it in, but **the key points get buried**: it reads with one eye on this and one on that, and the summary drops things (the "fuller means dumber" from Chapter 3).

So "how long is long"? This is where the ruler of **token** comes in, but remember the warning from Chapter 3.

> **Rough rule of thumb, not a law:** A few hundred characters of Chinese is usually a few hundred to a thousand-plus tokens; people often say "Chinese is roughly one token per character." But this **is only a rough rule of thumb, not a fixed ratio**: the actual token count depends on **which model's tokenizer** is used, and is also affected by punctuation, numbers, and any mixed-in code, differing by twenty or thirty percent between models. So this book **does not hard-code numbers like "how many characters will overflow"**, each product's window size differs and keeps changing. For precision, use the official token-counting tool for the product (**and defer to the provider's official documentation**). All you need is one intuition: **the longer the material, the more careful you should be that it "won't fit" or "won't read it carefully."**

## 2. Core move one: feed long material in chunks

Since the desk is limited, the most practical move is this: **don't dump it all in at once, feed it in chunks.**

Split a long document into a few blocks and process them one at a time, letting it "digest" each block before the next. Two common ways to split:

| Way to split | How | Suits |
| --- | --- | --- |
| **Summarize sections, then combine** | Cut the long text into a few sections, summarize each one separately; finally **feed those section summaries back to it** and have it synthesize an overview | A very long article, report, or book chapter |
| **Process one at a time** | The material is already in separate pieces (multiple emails, multiple files), so process them one by one and combine at the end | A pile of scattered material |

```text
The idea of feeding a long text in chunks:

  Whole thing too long -> cut into [section 1][section 2][section 3]...
                            | summarize each separately
                          [summary 1][summary 2][summary 3]...
                            | feed the summaries back
                          have it synthesize an "overview"
```

> **Key point:** The essence of chunked feeding is **never letting any single desk get blown out** — each pass spreads out only one section, so it can read carefully. It also saves money as a side effect: a fuller desk is slower and more expensive (Chapters 3 and 38). A practical reminder: when splitting, **cut at natural paragraphs and section breaks** as much as possible, don't cut mid-sentence, or it easily misreads the context.

## 3. Core move two: put a "leash" on it, answer from the material only

This is the most important move in the chapter, please make it a habit. Chapter 9 explained that when it isn't sure, it will **string together a plausible fake answer along the inertia of language**. When you feed material for it to summarize, the thing you fear most is it folding content **that isn't in the material at all** into the "summary."

The fix is to draw an explicit boundary in the prompt:

```text
"Please answer only from the material I provide below.
 If it isn't mentioned in the material, just say 'not mentioned in the material,' don't
 supplement with your own knowledge, and don't make things up. When you answer, try to
 point out which part of the material each point comes from.

 Material: ... (pasted)"
```

These few sentences do three things: (1) lock its answer **within the range of the material you gave**; (2) give it a way out of "if you don't know, just say so" (so it doesn't have to force a fabrication); (3) make it **give sources** so you can spot-check.

> **Key point:** Why does this work? Because it turns the task from "**answer on your own ability**" (prone to hallucination) into "**find the answer in this material in front of me**" (Chapter 4 explained that with a basis to "continue" it's far more reliable). But **even with the leash, don't skip inspection entirely** — it can still misread or mix things up. So build the habit: have it **mark sources**, and you **spot-check a few key ones** against the original. This is the plain-language version of the whole **RAG** technique in Chapter 20 (giving AI an external knowledge base), where the core idea is the same: "**rather than bet it remembers right, feed the right material in front of it**" (Chapter 9).

## 4. The three most common routines: summarize, compare, extract

Most material work falls into these three kinds. Each has its own phrasing, so memorize the routine and you can put it to use right away.

| Routine | What you want | How to phrase the prompt |
| --- | --- | --- |
| **Summarize** | Make the long short, grab the key points | "Summarize this material into 5 key points, each no more than one sentence, for someone who hasn't read the original" |
| **Compare** | See the similarities and differences across two or more pieces | "Compare these two plans on 'price, timeline, risk,' as a two-column table" |
| **Extract** | Pull specific information out of the material | "Extract all the 'deadlines' and their matching 'owners' from these emails, as a list" |

Notice every example uses the craft from Chapter 11: **spell out length, format, angle, audience.** "Summarize into 5 points, each one sentence, for someone who hasn't read it" — that's a good phrasing; just "summarize this" and it has to guess again.

> **How you'll actually run into this:** Of these three, **extract** is the most impressive and the one most needing the rules nailed down. For example, asking it to "extract all dates," you'd best add "**use YYYY-MM-DD format, sort chronologically, leave blank if not in the material**," otherwise it may convert on its own, drop some, or invent one for you. Spell out the rules + have it mark sources + you spot-check, run all three together and extraction is reliable.

## 5. The key boundary: have it "read the material" or "answer on its own ability"

This chapter is really hammering one boundary that runs through the whole book, so let me make it explicit. When it answers you, there are two very different sources:

| | Answer from its own knowledge | Answer only from the material you gave |
| --- | --- | --- |
| Where the answer comes from | The "knowledge" welded into its parameters during training (Chapter 9) | The material you spread on the desk this time |
| Reliable or not | Easily outdated, possible hallucination, hard facts need re-checking | Relatively reliable (with a basis to "continue"), but still spot-check that it didn't misread |
| Is there a "cutoff date" problem | **Yes**: it inherently doesn't know recent events (Chapter 9) | **No**: however new the material is, that's how new its answer is |
| Suits what | General knowledge, explaining concepts, finding ideas | Handling the specific material in your hands, cases requiring "faithful to the original" |

> **Key point:** When doing material work, you almost always want **the right-hand column**: have it "read the material I gave," not "guess on its own ability." That's why the "**answer from the material only**" leash is so critical. It also sidesteps the "knowledge cutoff" trap: even if the material came out today and it never saw it in training, as long as you paste it in, it can still answer from the material. Hold this firmly and Chapter 20's **RAG** will make immediate sense: that's just making "feeding material" **automatic and at scale**: you ask a question, and the system automatically pulls relevant pieces from a big knowledge base and feeds them, along with your question, to the model.

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| However long the material, just paste it all in at once | The desk (context window) is limited, too long won't fit or won't be read carefully; you should **feed it in chunks** (Chapter 3) |
| "Summarize this" will give me the summary I want | You have to spell out **length, format, angle, audience**, otherwise it can only guess (Chapter 11) |
| Have it summarize material and it's bound to be faithful to the original | It may invent what isn't in the material; put on the "**answer from the material only, say so if not there**" leash and spot-check |
| Just memorize a fixed number for how many characters overflow the window | Tokens vary by model, it's a **rough rule of thumb** not a fixed value, and window sizes keep changing, defer to the official counting tool / docs |
| Once material is given, no checking needed at all | The leash greatly suppresses fabrication, but it can still misread or mix things up; have it mark sources and spot-check the key items |
| You can't use AI on the latest material (it doesn't know new things) | Only "answering from knowledge" is limited by the knowledge cutoff; **paste the new material in and have it answer from the material** and you're unaffected |

## Summary

- Two traps in feeding material: **the material is too long to fit / not read carefully**, and it **invents what isn't in the material into the summary** (the hallucination from Chapter 9).
- Feed long material **in chunks**: summarize sections then combine, or process one at a time, don't dump it all and blow out the desk (Chapter 3); cut at natural paragraphs where possible.
- "How long is long" is measured in tokens, but that's a **rough rule of thumb**, varies by model, and the window keeps changing; for precision, use the official counting tool and defer to the provider's documentation.
- The most critical move: put on the leash, "**answer only from the material I gave, say so if it's not there, don't make things up**," have it **mark sources**, and you **spot-check**.
- The three routines: **summarize, compare, extract**, each spelled out with the Chapter 11 craft for length / format / angle; extraction especially needs the rules nailed down.
- Remember the boundary: material work wants "**read the material I gave**" rather than "answer on its own ability," which is both more reliable and sidesteps the knowledge cutoff; it's the core idea of Chapter 20's **RAG**.

In the next chapter we switch angles and look at how to manage the "conversation" itself: one topic per conversation, when to open a new one, how to get it to "remember" your long-term preferences, which is **multi-turn conversation and context management**.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** You need to process a very long report. Why is pasting it all in at once not recommended?
   - A. AI doesn't like reading long text
   - B. The context window (desk) is limited, too long won't fit, or it barely fits but the key points get buried and it reads carelessly
   - C. Long text makes it remember permanently and take up memory
   - D. You can only paste one sentence at a time
   > **Answer: B.** This is the direct consequence of that "desk" from Chapter 3: the longer the material the more desk it takes, and once full it can't read carefully. The countermeasure is to **feed it in chunks**. C confuses "memory" (the model itself has no memory across conversations); D is an imaginary limit.

2. **[Basic · Concept]** Which sentence most accurately describes the benefit of "have it answer from the material only"?
   - A. It makes it answer faster
   - B. It turns the task from "answer on its own ability (prone to hallucination)" into "find the answer in the material in front of it (with a basis to continue, more reliable)," and also sidesteps the knowledge cutoff
   - C. It means no checking at all is needed
   - D. It makes it remember the material permanently
   > **Answer: B.** With a basis to "continue" it's far more reliable (Chapter 4), and however new the material is that's how new its answer is, unaffected by the knowledge cutoff (Chapter 9). C overstates it, the leash greatly suppresses fabrication but you still have it mark sources and spot-check; D again confuses memory (close the conversation and it's gone).

3. **[Advanced · Misconception]** Someone says: "I had it summarize this contract, the summary looks pretty complete, so it must be what's in the contract." What's the problem?
   - A. No problem, a summary is always faithful to the original
   - B. It may "invent" content not in the contract into the summary (Chapter 9); put on the "answer from the material only, say so if not there" leash, have it mark sources, and spot-check the key clauses
   - C. Its contract summary is bound to drop key points
   - D. Contracts can't be shown to AI, so the summary is invalid
   > **Answer: B.** "Looks complete" is exactly where hallucination is most dangerous, it fabricates something that looks real (Chapters 4 and 9). For critical material like a contract, the leash + marking sources + spot-checking are all indispensable. Whoever makes this mistake takes "fluent and complete" for "accurate and faithful." C overstates the case; D is a separate topic (privacy in Chapter 37) and doesn't change the fact that it "will invent."

4. **[Advanced · Misconception]** "The internet says 1000 characters is about 1000-plus tokens, so if I memorize that ratio I can precisely calculate whether the window will overflow." What's off?
   - A. Completely correct, it's a fixed ratio
   - B. That's only a **rough rule of thumb**, not a fixed value, the token count varies by **the model's tokenizer**, punctuation, numbers, and whether code is mixed in, and window sizes also change; for precision use the official counting tool
   - C. Chinese always uses more tokens than English, just remember that
   - D. Tokens and character count are exactly equal
   > **Answer: B.** Chapter 3 stresses repeatedly that this is a rough rule of thumb, not a law: models can differ by twenty or thirty percent, and window sizes keep changing (defer to the official documentation). Whoever treats it as a fixed ratio will miscalculate at the edge. C is also wrong, "which uses more tokens" is no longer a rule on new tokenizers; D is the most common misconception (a token is not a character).

5. **[Basic · Scenario]** You have 30 project emails on hand and want to sort out "the deadline and owner for each to-do." What's the most reliable approach?
   - A. Paste all 30 in at once and ask "what to-dos are there"
   - B. Feed them in batches (say a few at a time), have it "extract deadlines and owners from the emails only, sorted by YYYY-MM-DD, leave blank if missing, mark which email each came from," then combine and spot-check
   - C. Ask it from memory "roughly what to-dos this project has" and let it think them up
   - D. Have it memorize all 30 emails before answering
   > **Answer: B.** This is the standard play for the "extract" routine: feed in chunks (avoid blowing out the desk) + nail down the rules (format, sorting, blanks, sources) + spot-check. A easily overflows the window and reads carelessly; C makes it "fabricate on its own ability" (guaranteed hallucination); D mistakenly thinks it can "remember" (it has no memory across conversations).

6. **[Basic · Hands-on]** Find a long article you've read and know well. First have it "summarize into 5 key points" with **no** restriction; then redo it with "summarize from this article only, don't supplement what isn't in the material, and mark which paragraph of the original each point comes from." Compare the two, especially watching for content that "isn't actually in the original" slipping into the first summary.
   > **What you should notice:** Without the leash, it sometimes mixes in "reasonable extensions" not in the original or content it outright made up — that's hallucination, and it confirms that "looks complete does not equal faithful to the original"; with "answer from the material only + mark sources" added, the drift drops noticeably and you can spot-check more easily. Do the comparison once yourself and you'll never again blindly trust a summary it reels off, which is exactly the core idea of Chapter 20's RAG: feed the right material in front of it.
