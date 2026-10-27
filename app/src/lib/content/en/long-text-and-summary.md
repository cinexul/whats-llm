In the last chapter you learned to "state your requirements clearly." This chapter applies that craft to a high-frequency scenario almost everyone needs: **give it a big pile of material and have it read it and summarize it for you.**

A contract, a paper, meeting notes, dozens of emails, a manual: feeding it to AI and having it "read it all and report the key points" is one of the biggest time-savers it offers. Before you paste anything, ask whether you're allowed to: does your company's policy permit it, and does the material contain other people's personal information or sensitive contract terms? Remove those parts or replace them with placeholders first (Chapter 37 goes into detail).

Beyond that, there are two traps beginners almost always hit. One, **the material is too long and it says "won't fit"** (or barely fits but reads it in a muddle); two, it will **"invent" things not in the material into the summary** (that old problem from Chapter 9 again).

This chapter teaches the right way to feed material in: how to feed a long document, how to get it to answer honestly **from the material you gave alone**, and what the routines are for summarizing, comparing, and extracting. Master it and you turn AI into a reliable "material assistant."

## 1. First understand why long material causes trouble, back to that desk

To feed it well, first understand why it gets "stuffed." This picks up from Chapter 3.

The amount of text the model can "spread out and look at" at once has a ceiling. That's the **context window**, which Chapter 3 compared to a desk. The material you paste in, your earlier conversation, and the answer it's about to write all take up desk space. When the material gets long, two things can happen:

- It goes over the limit, and the product says "too long" or only processes part of it.
- It fits, but most of what's on the desk has nothing to do with your question, so the few passages that really matter are easy to overlook and the summary drops things.

Chapter 3 also pointed out that a fuller desk isn't necessarily worse: useful material can make answers more accurate. The trouble comes from **irrelevant or conflicting content**, which can distract the model. So the goal isn't "as little as possible," but a desk holding mostly what this task actually needs.

Uploaded files deserve a bit of caution too. Uploading a PDF doesn't mean every page went into the context in full. Some products only retrieve the passages that seem relevant to your question, and scans, tables, and images may not be read correctly (Chapters 3 and 20). For the parts that matter, paste the text directly, or first ask it to tell you what it was able to read.

So "how long is long"? This is where the ruler of **token** comes in, but remember the caveat from Chapter 3.

> **Rough rule of thumb, not a law:** A page of English is usually several hundred tokens; a common rule of thumb is that a token is about three-quarters of an English word. But this **is only a rough rule of thumb, not a fixed ratio**: the actual token count depends on **which model's tokenizer** is used, and is also affected by punctuation, numbers, and any mixed-in code, differing by twenty or thirty percent between models. So this book **does not hard-code numbers like "how many words will overflow"**, each product's window size differs and keeps changing. For precision, use the official token-counting tool for the product (**and defer to the provider's official documentation**). All you need is one intuition: **the longer the material, the more careful you should be that it "won't fit" or "won't read it carefully."**

## 2. Core move one: feed long material in chunks

Since the desk is limited, the most practical move is this: **don't dump it all in at once; split it up and handle the parts separately.**

One detail is easy to miss. If you just paste one part after another into the **same conversation**, everything you pasted earlier stays in the context (Chapter 13 comes back to this). The desk isn't any clearer, and you won't necessarily save money either. To really split the work, give each part **its own separate step**:

| Way to split | How | Suits |
| --- | --- | --- |
| **Summarize sections, then combine** | Cut the long text into a few sections. Summarize each one in **a fresh conversation** and save the summaries. Finally, open **another fresh conversation**, paste in only those summaries, and have it synthesize an overview | A very long article, report, or book chapter |
| **Process one at a time** | The material is already in separate pieces (multiple emails, multiple files), so process each piece or batch separately, note the results, and combine only those results in a fresh conversation | A pile of scattered material |

```text
The idea of feeding a long text in chunks:

  Whole thing too long -> cut into [section 1][section 2][section 3]...
                            ↓ summarize each in its own fresh conversation
                          [summary 1][summary 2][summary 3]...
                            ↓ open another fresh conversation, paste only the summaries
                          have it synthesize an "overview"
```

> **Key point:** Split this way, the desk holds just one section at a time, so it can read carefully, and when you combine, the desk holds only the condensed summaries. Cut at natural paragraphs and section breaks where you can; cutting mid-sentence makes it easy to misread the context. Know the trade-off too: summaries lose detail, so if you need to check a specific number after combining, go back to that part of the original. On cost, processing less at a time is often cheaper, but the actual bill depends on the product's caching and plan rules (Chapters 3 and 38).

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
| However long the material, just paste it all in at once | The desk (context window) is limited; too long won't fit, and lots of irrelevant content can distract it; **feed it in chunks** (Chapter 3) |
| Pasting one part at a time into the same conversation counts as chunking | Earlier parts stay in the context; summarize each part in a fresh conversation, then combine only the summaries in another fresh one |
| If I upload a file, it has definitely read the whole thing | Some products retrieve only parts, and scans or tables may be misread; paste the key text directly, or ask what it was able to read |
| "Summarize this" will give me the summary I want | You have to spell out **length, format, angle, audience**, otherwise it can only guess (Chapter 11) |
| Have it summarize material and it's bound to be faithful to the original | It may invent what isn't in the material; put on the "**answer from the material only, say so if not there**" leash and spot-check |
| Just memorize a fixed number for how many words overflow the window | Tokens vary by model, it's a **rough rule of thumb** not a fixed value, and window sizes keep changing, defer to the official counting tool / docs |
| Once material is given, no checking needed at all | The leash greatly suppresses fabrication, but it can still misread or mix things up; have it mark sources and spot-check the key items |
| You can't use AI on the latest material (it doesn't know new things) | Only "answering from knowledge" is limited by the knowledge cutoff; **paste the new material in and have it answer from the material** and you're unaffected |

## Summary

- Before pasting, check that you're allowed to; remove other people's personal information and sensitive contract terms, or replace them with placeholders (Chapter 37).
- Two traps in feeding material: **the material is too long to fit / not read carefully**, and it **invents what isn't in the material into the summary** (the hallucination from Chapter 9). Uploaded files may not be read in full either (Chapters 3 and 20).
- Feed long material **in chunks**: summarize each part in its own fresh conversation, then open another fresh conversation and combine only the summaries; pasting on in the same conversation doesn't take earlier parts off the desk. Cut at natural paragraphs where possible.
- "How long is long" is measured in tokens, but that's a **rough rule of thumb**, varies by model, and the window keeps changing; for precision, use the official counting tool and defer to the provider's documentation.
- The most critical move: put on the leash, "**answer only from the material I gave, say so if it's not there, don't make things up**," have it **mark sources**, and you **spot-check**.
- The three routines: **summarize, compare, extract**, each spelled out with the Chapter 11 craft for length / format / angle; extraction especially needs the rules nailed down.
- Remember the boundary: material work wants "**read the material I gave**" rather than "answer on its own ability," which is both more reliable and sidesteps the knowledge cutoff; it's the core idea of Chapter 20's **RAG**.

In the next chapter we switch angles and look at how to manage the "conversation" itself: one topic per conversation, when to open a new one, how to get it to "remember" your long-term preferences, which is **multi-turn conversation and context management**.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** You need to process a very long report. Why is pasting it all in at once not recommended? <!-- quiz: q01 revision: 1 -->
   - A. It may exceed the limit, or key passages may get lost in irrelevant text
   - B. The model memorizes what you paste, so it keeps taking space in new chats
   - C. Models usually read only the first few pages closely and skip the rest
   - D. Longer material always gives worse answers, so cut it as short as possible
   > **Answer: A.** The context window has a limit, and even when the material fits, lots of content unrelated to your question can distract the model so that key passages get overlooked (Chapter 3). B confuses context with memory. C turns how some products behave into an iron rule. D goes too far: Chapter 3 noted that useful material can make answers more accurate; the trouble is irrelevant content.

2. **[Basic · Concept]** Which sentence most accurately describes the benefit of "have it answer from the material only"? <!-- quiz: q02 revision: 1 -->
   - A. It stops using its own knowledge, so answers are always right and need no checks
   - B. It's told to stick to the material, so answers get shorter, faster, and cheaper
   - C. Answers can be traced and cited, and new material escapes the knowledge cutoff
   - D. The material goes into its long-term memory, so you won't need to paste it again
   > **Answer: C.** With a basis to "continue" from, it's far more reliable (Chapter 4), and it can mark sources so you can spot-check. However new the material, that's how new its answer is, so the knowledge cutoff doesn't apply (Chapter 9). A overstates it: it can still misread or mix things up, so spot-check. B swaps the benefit for speed and cost, which aren't the point. D confuses context with memory; the material doesn't stay in the model after the conversation.

3. **[Advanced · Misconception]** Someone says: "I had it summarize this contract, the summary looks pretty complete, so it must be what's in the contract." What's the problem? <!-- quiz: q03 revision: 1 -->
   - A. Contracts are sensitive, so the AI deliberately skips some clauses to protect privacy
   - B. As long as the summary has no obvious typos, it usually matches the original
   - C. Looking complete isn't being faithful; it may add things the contract doesn't say
   - D. Summaries always cut detail, so they're of no use for material like contracts
   > **Answer: C.** "Looks complete" is exactly where hallucination is most dangerous: it fabricates things that look real (Chapters 4 and 9). For critical material like a contract, ask it to answer only from the material and say so when something isn't there, have it mark sources, and spot-check the key clauses. A invents a motive; it doesn't skip things "deliberately." B judges accuracy by typos, which tells you nothing. D overstates it: summaries are useful, they just need checking. Whether you may paste a contract into an AI at all is a separate question, covered in Chapter 37.

4. **[Advanced · Misconception]** "The internet says 1,000 words is about 1,300 tokens, so if I memorize that ratio I can precisely calculate whether the window will overflow." What's off? <!-- quiz: q04 revision: 1 -->
   - A. The ratio is right; just add a 20 to 30 percent margin and it's precise enough
   - B. It's a rough rule of thumb; counts vary by model, so use the official tool
   - C. Tokens are counted by whole words only, so punctuation and numbers don't count
   - D. English always uses far fewer tokens than other languages, so the ratio is fixed
   > **Answer: B.** Chapter 3 stresses that this is only a rough rule of thumb: the token count depends on the model's tokenizer and is affected by punctuation, numbers, and code, and window sizes keep changing. For precision, use the official counting tool. A tries to turn a rule of thumb into a precise figure by adding a margin, which doesn't work. C is wrong: punctuation and numbers are tokens too, and words are often split into several tokens. D treats a rough impression about languages as a law.

5. **[Basic · Scenario]** You have 30 project emails on hand and want to sort out "the deadline and owner for each to-do." What's the most reliable approach? <!-- quiz: q05 revision: 1 -->
   - A. Paste them all into one conversation and have it list every to-do and owner
   - B. First ask it what to-dos such projects usually have, then compare with the emails
   - C. Ask it to "remember" each email as you paste it, then have it sum up at the end
   - D. Extract from a few emails at a time, citing each source, then combine and check
   > **Answer: D.** This is the standard play for extraction: work in batches (each batch can be its own conversation, and only the results are pasted in to combine), nail down the rules (dates as YYYY-MM-DD, leave blank if missing, say which email each came from), and spot-check. A can overflow the window with that much text and easily misses things. B has it guess the to-dos from nothing, which is asking it to invent. C assumes it can "remember," but the emails just pile up in the same conversation's context.

6. **[Basic · Hands-on]** Find a long article you've read and know well. First have it "summarize into 5 key points" with **no** restriction; then redo it with "summarize from this article only, don't supplement what isn't in the material, and mark which paragraph of the original each point comes from." Compare the two, especially watching for content that "isn't actually in the original" slipping into the first summary. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Without the restriction, it sometimes mixes in "reasonable extensions" not in the original, or content it simply made up. That's hallucination, and it confirms that looking complete is not the same as being faithful to the original. With "answer from the material only + mark sources" added, the drift drops noticeably and you can spot-check more easily. Compare them once yourself and you won't blindly trust a summary it reels off again. That's also the core idea of Chapter 20's RAG: put the right material in front of it.
