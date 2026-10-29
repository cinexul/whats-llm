The last chapter was about stating clearly what you want. This one puts that skill to work in a situation almost everyone runs into: handing it a pile of material and having it read and summarize for you.

Contracts, papers, meeting notes, dozens of emails, a manual: having AI read them and tell you the key points is one of the biggest time-savers it offers. Before you paste anything in, though, think about whether you're allowed to. Does your company permit it? Is there anyone else's personal information, or sensitive contract terms, in there? Delete those parts or swap in placeholder names first (Chapter 37 goes into this).

Beginners usually hit two problems here. One: the material is too long, and it says it can't fit, or it fits but gets read carelessly. Two: things that aren't in the material end up in the summary (the hallucination from Chapter 9). This chapter is about avoiding both.

## 1. Why long material causes trouble: back to the desk

Chapter 3 compared the context window to a desk: the material you paste, the conversation so far, and the answer it's about to write all take up space on it. When the material is long, one of two things tends to happen:

- It goes over the limit, and the product says it's too long, or only handles part of it.
- It fits, but most of what's on the desk has nothing to do with your question, so the few passages that matter get overlooked and the summary has gaps.

A fuller desk isn't automatically worse; useful material makes answers more accurate. What gets in the way is material that's irrelevant or contradicts itself. So the goal isn't "as little material as possible," it's making sure what's on the desk is what this task actually needs.

Be careful with uploads too. Uploading a PDF doesn't mean every page ends up in the context. Some products only pull out a few passages based on your question, and scans, tables, and images may not be read correctly (Chapters 3 and 20). For the parts that matter, paste the text directly, or first ask it what it was able to read.

How long counts as "long" is measured in tokens. How many tokens a given amount of text turns into depends on the model's tokenizer, and Chapter 3 has measured numbers; for exact figures, use that product's token counter. For now, just remember: the longer the material, the more you should watch out for it not fitting or not being read carefully.

## 2. First trick: split long material and handle it in pieces

The desk is limited, so the most practical approach is not to pour everything in at once, but to split it up and handle each piece separately.

One detail is easy to miss: if you paste one section after another into the same conversation, the earlier sections stay in the context (Chapter 13). The desk doesn't get any clearer, and it doesn't necessarily cost less. To really split things up, each piece needs its own separate step:

| Way to split | How | Suits |
| --- | --- | --- |
| Summarize sections, then combine | Cut the long text into a few sections. Summarize each one in a fresh conversation and save the summaries. Finally, open another fresh conversation, paste in only those summaries, and have it put together an overview | A very long article, report, or book chapter |
| One piece at a time | The material already comes in separate pieces (multiple emails, multiple files), so handle each piece or batch on its own, note the results, and combine only those results in a fresh conversation | A pile of scattered material |

```text
Handling a long text in pieces:

  Whole thing too long -> cut into [section 1][section 2][section 3]...
                            ↓ summarize each in its own fresh conversation
                          [summary 1][summary 2][summary 3]...
                            ↓ open another fresh conversation, paste only the summaries
                          have it put together an "overview"
```

When you cut, cut at paragraph or chapter breaks, not in the middle of a sentence, or it may misread what comes before and after. This approach has a cost too: summaries drop details, so when you need to check a specific number after combining, you still have to go back to that section of the original. On cost, handling less at a time usually saves money, but how it actually adds up depends on the product's caching and plan rules (Chapters 3 and 38).

## 3. Second trick: have it answer only from the material

This is the most important trick in the chapter. As Chapter 9 explained, when it isn't sure it may just keep going and come up with a plausible-looking answer. When you ask it to summarize material, the worst case is that things that aren't in the material at all get "summarized" in.

The fix is to draw a clear boundary in the prompt:

```text
"Please answer only from the material I provide below.
 If it isn't mentioned in the material, just say 'not mentioned in the material,' don't
 supplement with your own knowledge, and don't make things up. When you answer, try to
 point out which part of the material each point comes from.

 Material: ... (pasted)"
```

Those few lines do three things: they keep the answer inside the material you gave; they give it a way out, "if you don't know, say so," so it doesn't have to make something up; and they have it show where each point comes from, so you can spot-check.

> **Key point:** This turns the job from "answer from what it remembers" into "find the answer in the material in front of it," and with something to go on it's much more reliable (Chapter 4). But drawing a boundary doesn't mean you can skip checking: it can still misread, or attribute something from one place to another. So have it show where things come from, and check a few key ones against the original yourself. RAG in Chapter 20 rests on the same idea: rather than betting on its memory, put the right material in front of it.

## 4. The three most common jobs: summarize, compare, extract

Most of what you'll do with material falls into these three jobs, and each has its own way of asking:

| Job | What you want | How to write the prompt |
| --- | --- | --- |
| Summarize | Make the long short and pick out the key points | "Summarize this material into 5 key points, each no more than one sentence, for someone who hasn't read the original" |
| Compare | See how two or more pieces differ and overlap | "Compare these two plans on 'price, timeline, risk,' as a two-column table" |
| Extract | Pull specific information out of the material | "Extract all the 'deadlines' and their matching 'owners' from these emails, as a list" |

Each example uses the skill from Chapter 11: spell out length, format, angle, and audience. "Summarize into 5 points, one sentence each, for someone who hasn't read it" is a good request; just saying "summarize this" leaves it guessing again.

Of the three, extraction is where it shines most, and where you most need to pin down the rules. If you ask it to "pull out all the dates," add something like "use YYYY-MM-DD, sort them in order, and leave it blank if the material doesn't say," or it may convert things on its own, miss some, or even make one up. Clear rules, sources marked, and your own spot-check: with all three, extraction results are reliable.

## 5. Know the difference: reading your material, or answering from memory

This whole chapter has really been about one distinction that runs through the book. There are two ways a model can answer you, and where the answer comes from is completely different:

| | Answer from its own knowledge | Answer only from the material you gave |
| --- | --- | --- |
| Where the answer comes from | Knowledge learned into its parameters during training (Chapter 9) | The material you spread on the desk this time |
| How reliable | May be out of date or hallucinated; check hard facts | It has something to go on, so it's fairly reliable, but still spot-check for misreadings |
| Cutoff date problem? | Yes: it doesn't know about recent events (Chapter 9) | No: however new the material is, it can answer that new |
| Good for | General knowledge, explaining concepts, finding ideas | Handling the specific material in your hands, when you need it faithful to the original |

When you're working with material, the right-hand column is almost always what you want. It also gets you around the knowledge cutoff: even material that came out today, which it never saw in training, it can answer from as long as you paste it in. RAG in Chapter 20 is this same "hand it the material" step, done automatically: you ask a question, and the system finds the relevant passages in a large collection of documents and hands them to the model along with your question.

## 6. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| However long the material, just paste it all in at once | The desk (context window) is limited; too long won't fit, and lots of irrelevant content gets in the way; split it up (Chapter 3) |
| Pasting one part at a time into the same conversation counts as splitting | Earlier parts stay in the context; summarize each part in a fresh conversation, then combine only the summaries in another fresh one |
| If I upload a file, it has definitely read the whole thing | Some products only pull out parts, and scans or tables may be misread; paste the key text directly, or ask what it was able to read |
| "Summarize this" will give me the summary I want | You have to spell out length, format, angle, and audience, or it can only guess (Chapter 11) |
| Have it summarize material and it's bound to be faithful to the original | It may write in things that aren't in the material; tell it to "answer only from the material, and say so if it isn't there," then spot-check |
| Memorize a fixed ratio and you can work out how many words overflow the window | Token counts vary by model, and window sizes keep changing; for exact numbers use a token counter (Chapter 3) |
| Once you've given it material, no checking is needed | A clear boundary cuts down a lot on made-up content, but it can still misread or mix things up; have it mark sources and spot-check the key items |
| You can't use AI on the latest material (it doesn't know new things) | Only answering from its own knowledge is limited by the cutoff; paste the new material in and have it answer from that, and you're fine |

## Summary

- Before pasting material, make sure you're allowed to; delete or replace other people's personal information and sensitive contract terms first (Chapter 37).
- Two common problems: material too long to fit or to be read carefully, and things that aren't in the material showing up in the summary (Chapter 9). Uploaded files aren't necessarily read in full either (Chapters 3 and 20).
- Split long material: summarize each section in its own fresh conversation, then combine only the summaries in another fresh one; pasting more into the same conversation doesn't take the earlier parts off the desk. Cut at paragraph breaks where you can.
- How long counts as "long" is measured in tokens, and the numbers vary by model; for exact figures, use a token counter (Chapter 3).
- The most important trick: tell it to "answer only from the material I gave you; if it isn't there, say so, and don't make anything up," have it mark where things come from, and spot-check.
- The three most common jobs are summarize, compare, and extract; spell out length, format, and angle as in Chapter 11, and pin down the rules especially carefully for extraction.
- With material, what you want is "read what I gave you," not "answer from what you remember": it's more reliable and gets around the knowledge cutoff, and it's also the basic idea behind RAG in Chapter 20.

The next chapter looks at the conversation itself: one topic per conversation, when to start a new one, and how to get it to remember your long-term preferences. In other words, multi-turn chats and context management.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** You need to process a very long report. Why is pasting it all in at once not recommended? <!-- quiz: q01 revision: 2 -->
   - A. It may exceed the limit, or key passages may get lost in irrelevant text
   - B. The model memorizes what you paste, so it keeps taking space in new chats
   - C. Models usually read only the first few pages closely and skip the rest
   - D. Longer material always gives worse answers, so cut it as short as possible
   > **Answer: A.** The context window has a limit, and even when the material fits, lots of content unrelated to your question can distract the model so that key passages get overlooked (Chapter 3). B confuses context with memory. C turns how some products behave into an iron rule. D goes too far: Chapter 3 noted that useful material can make answers more accurate; the trouble is irrelevant content.

2. **[Basic · Concept]** Which sentence most accurately describes the benefit of "have it answer from the material only"? <!-- quiz: q02 revision: 2 -->
   - A. It stops using its own knowledge, so answers are always right and need no checks
   - B. It's told to stick to the material, so answers get shorter, faster, and cheaper
   - C. Answers can be traced and cited, and new material escapes the knowledge cutoff
   - D. The material goes into its long-term memory, so you won't need to paste it again
   > **Answer: C.** With a basis to "continue" from, it's far more reliable (Chapter 4), and it can mark sources so you can spot-check. However new the material, that's how new its answer is, so the knowledge cutoff doesn't apply (Chapter 9). A overstates it: it can still misread or mix things up, so spot-check. B swaps the benefit for speed and cost, which aren't the point. D confuses context with memory; the material doesn't stay in the model after the conversation.

3. **[Advanced · Misconception]** Someone says: "I had it summarize this contract, the summary looks pretty complete, so it must be what's in the contract." What's the problem? <!-- quiz: q03 revision: 2 -->
   - A. Contracts are sensitive, so the AI deliberately skips some clauses to protect privacy
   - B. As long as the summary has no obvious typos, it usually matches the original
   - C. Looking complete isn't being faithful; it may add things the contract doesn't say
   - D. Summaries always cut detail, so they're of no use for material like contracts
   > **Answer: C.** "Looks complete" is exactly where hallucination is most dangerous: it fabricates things that look real (Chapters 4 and 9). For critical material like a contract, ask it to answer only from the material and say so when something isn't there, have it mark sources, and spot-check the key clauses. A invents a motive; it doesn't skip things "deliberately." B judges accuracy by typos, which tells you nothing. D overstates it: summaries are useful, they just need checking. Whether you may paste a contract into an AI at all is a separate question, covered in Chapter 37.

4. **[Advanced · Misconception]** "The internet says 1,000 words is about 1,300 tokens, so if I memorize that ratio I can precisely calculate whether the window will overflow." What's off? <!-- quiz: q04 revision: 2 -->
   - A. The ratio is right; just add a 20 to 30 percent margin and it's precise enough
   - B. It's a rough rule of thumb; counts vary by model, so use the official tool
   - C. Tokens are counted by whole words only, so punctuation and numbers don't count
   - D. English always uses far fewer tokens than other languages, so the ratio is fixed
   > **Answer: B.** Chapter 3 stresses that this is only a rough rule of thumb: the token count depends on the model's tokenizer and is affected by punctuation, numbers, and code, and window sizes keep changing. For precision, use the official counting tool. A tries to turn a rule of thumb into a precise figure by adding a margin, which doesn't work. C is wrong: punctuation and numbers are tokens too, and words are often split into several tokens. D treats a rough impression about languages as a law.

5. **[Basic · Scenario]** You have 30 project emails on hand and want to sort out "the deadline and owner for each to-do." What's the most reliable approach? <!-- quiz: q05 revision: 2 -->
   - A. Paste them all into one conversation and have it list every to-do and owner
   - B. First ask it what to-dos such projects usually have, then compare with the emails
   - C. Ask it to "remember" each email as you paste it, then have it sum up at the end
   - D. Extract from a few emails at a time, citing each source, then combine and check
   > **Answer: D.** This is the standard play for extraction: work in batches (each batch can be its own conversation, and only the results are pasted in to combine), nail down the rules (dates as YYYY-MM-DD, leave blank if missing, say which email each came from), and spot-check. A can overflow the window with that much text and easily misses things. B has it guess the to-dos from nothing, which is asking it to invent. C assumes it can "remember," but the emails just pile up in the same conversation's context.

6. **[Basic · Hands-on]** Find a long article you've read and know well. First have it "summarize into 5 key points" with **no** restriction; then redo it with "summarize from this article only, don't supplement what isn't in the material, and mark which paragraph of the original each point comes from." Compare the two, especially watching for content that "isn't actually in the original" slipping into the first summary. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** Without the restriction, it sometimes mixes in "reasonable extensions" not in the original, or content it simply made up. That's hallucination, and it confirms that looking complete is not the same as being faithful to the original. With "answer from the material only + mark sources" added, the drift drops noticeably and you can spot-check more easily. Compare them once yourself and you won't blindly trust a summary it reels off again. That's also the core idea of Chapter 20's RAG: put the right material in front of it.
