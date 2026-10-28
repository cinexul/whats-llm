You've probably had this experience: you talk through something with it, and the first few turns are fast and sharp, but the further you go the more "stubborn" it gets. It forgets requirements you set earlier, contradicts itself, gets long-winded, even goes in circles. Plenty of people grumble that it gets "dumber the longer you talk" and wonder whether it's tired.

It doesn't get tired. Chapter 3 explained why long conversations can lose track of the point; this chapter is purely practical: how to organize conversations, **when to decisively open a new one**, and how to use product features to "remember" your **long-term preferences**. These habits look minor, but they're among the most valuable basics for using it well.

## 1. Why it seems to get "dumber the longer you talk": a quick recap

Chapter 3 laid out the causes with the "desk" metaphor and a table, so here are just the conclusions. On each turn, the model sees the context the product prepared for that request: the full history, or a version that has been selected, truncated, or summarized. The longer the conversation, the more likely the desk is to pick up **content unrelated to the current task, old drafts you rejected, and summaries that lost detail**.

A full desk isn't bad in itself; useful content can help it answer more accurately. The trouble is that irrelevant and conflicting material can distract it, and the requirements you set at the start can get buried. So the fix is simple: rather than keep digging through a messy desk, switch to a clean one. The two habits below do exactly that.

## 2. Core habit one: one topic, one conversation

The most effortless rule: **one real thing, one dedicated conversation; once it's done or you change topics, start another.**

Many people are used to chatting in **one conversation** from morning to night: first a recipe, then switching to revising a resume, then having it explain a concept, then back to revising the resume. That's like piling totally unrelated material on one desk:

```text
❌ One conversation for everything:
   [recipe] → [revise resume] → [explain relativity] → [back to the resume]
            → [flight booking advice] ...
   The desk gets messier → it's distracted by unrelated content, the resume's
   requirements long buried at the bottom

✅ One topic, one conversation:
   Conversation A: focus on the resume
   Conversation B: ask about recipes
   Conversation C: explain relativity
   Every desk is clean, and it stays "focused" each time
```

> **How you'll actually run into this:** Once topics get mixed, things bleed into each other. You just had it revise the resume "more formally," then you chat about something else, come back, and it may have forgotten "formal" or oddly picked up the tone of the chit-chat. Split unrelated things into separate conversations, one thing's material per desk, and its performance is far steadier. Shorter conversations are usually faster and use less of your quota too, though the actual cost depends on the product's caching and plan rules (Chapters 3 and 38).

## 3. Core habit two: spot these signals, open a new conversation

So, while working through the same thing, **when should you decisively drop this conversation and reopen?** If you see any one of these signals, don't keep fighting:

| Signal | What it looks like | What's probably happening on the desk |
| --- | --- | --- |
| **It starts contradicting itself** | This turn doesn't line up with earlier ones; it's at odds with itself | Contradictory old content piled on the desk leads it astray |
| **Repeatedly forgets requirements** | Rules you set (tone, length, format) it keeps ignoring, reminders don't help | Key requirements are buried under newer content |
| **More and more long-winded / circular** | Answers getting longer, rambling, rehashing long-rejected plans | A long string of trial-and-error noise drowns the signal |
| **Clear "amnesia"** | Specific info stated earlier it mixes up or drops | Old content may have been trimmed, summarized, or buried |

When you see these, **don't slug it out in the original conversation**: more reminders and corrections usually just add more paper to a full desk. The right move is to open a new conversation and lay out the information still needed again, cleanly.

```text
The standard move when it's time to switch desks:
  1) Open a new conversation (= a clean desk)
  2) In a sentence or two, lay it out clearly: context + what you now want it to do +
     key requirements
     (that's the "state it clearly" craft from Chapter 11)
  3) If needed, paste over the "useful intermediate results" from the last round,
     leave the scrapped drafts behind
```

> **Key point:** The mistake beginners make most is correcting it over and over in the same messy conversation, which only makes things messier. The rule is simple: **try a fresh conversation first.** If the problem goes away in a clean new conversation, the long conversation was most likely the cause. If the same problem shows up again in the new conversation, that's when you check your settings (custom instructions, an old preference saved in memory) or report a bug to the product. There's an easy test for when to reopen, too: once explaining things again costs more than starting over, start over.

## 4. How to get it to "remember" your long-term preferences

If you start fresh from a clean desk every time, what about the **long-term preferences you'd otherwise state every time** ("answer in English," "more professional tone," "I work in education")? Do you have to repeat them in every new conversation?

First, the rule that runs through this book: the model itself has no memory across conversations. In a new conversation it can only know what's put into the context this time, meaning what you say plus whatever the product brings in for you (Chapter 3).

The product brings information in through product-layer features outside the model. As of October 2026, Claude, ChatGPT, and similar products offer roughly these kinds:

| Kind of feature | What it roughly does | What it suits |
| --- | --- | --- |
| **Custom instructions / personal preferences** | You write a standing note once, and the product adds it to your conversations | Long-term preferences like language, tone, your role |
| **Projects** | Keep a set of material and instructions together for every conversation in the project | One ongoing piece of work; separate things go in separate projects |
| **Memory** | The product saves key points from your chats and puts them back in later conversations | Some products **extract memories from chats automatically**, and that may be on by default |

Names, scope, and defaults differ by product, so check the official documentation for details. When you use them, keep a few things in mind:

- For preferences you want to stick, writing them into custom instructions or a project's instructions is more reliable than hoping it "remembers on its own."
- For things you don't want remembered, use a temporary chat (some products call it incognito), or turn memory off before you start.
- Every so often, look in the settings at what memories it has saved and delete anything outdated or wrong. In some products, deleting a chat doesn't delete the memories extracted from it, so remove those separately.
- Don't save passwords, ID numbers, trade secrets, and the like as preferences (Chapter 37).

> **Key point:** What it "remembers" is only what the product put back into the context this time. If a preference you set occasionally doesn't take, follow the same rule as in section 3: try a fresh conversation first; if it still doesn't work there, check your settings or report it to the product.

## 5. A workflow that ties it together

Put this chapter together with the previous two and you get a handy everyday workflow:

```text
1) One real task → open a dedicated conversation (habit one)
2) State the requirements clearly in the first message (Chapter 11: context, task,
   constraints, format)
3) Long material? Feed it in chunks, have it answer from the material only (Chapter 12)
4) Refine back and forth; once it contradicts itself / keeps forgetting requirements /
   gets long-winded → open a new conversation and restart (habit two)
5) Long-term preferences needed every time → hand them to the product's custom
   instructions, projects, or memory (section 4)
```

> **How you'll actually run into this:** Say you've been refining a draft with it back and forth, and eventually it starts ignoring new requirements and rehashing approaches you rejected long ago. Don't slug it out in the original conversation. Open a new one, paste in "the version you're happiest with so far," and add "building on this version, change only XX." Carrying good intermediate results to a clean desk and leaving scrapped drafts in the old conversation is a move you'll use again and again.

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| Getting "dumber the longer you talk" means it's tired or broken | Usually irrelevant or conflicting content in a long conversation is distracting it (Chapter 3); try a fresh conversation first, and if the problem persists there, check settings or report it |
| If it drifts, repeated reminders in the original conversation will fix it | Adding paper to a full desk often makes it messier; **open a new conversation** and start clean |
| Chatting about everything in one conversation is most convenient | Mixed topics bleed into each other; **one topic, one conversation**, one thing per desk |
| Setting up "memory / preferences" means the model itself remembers me | The product layer puts saved information back into the context; the model itself doesn't remember |
| Memory only saves what I explicitly ask it to remember | Some products extract memories from chats automatically, possibly on by default; use temporary chats for what you don't want remembered, and review and delete saved memories |
| Long-term preferences can only be repeated by hand each time | Write them into custom instructions, a project, or memory, and the product will add them to your conversations (check the official documentation) |

## Summary

- Getting "dumber the longer you talk" is usually irrelevant or conflicting content in a long conversation distracting it, with your earlier requirements buried (Chapter 3). It doesn't get tired.
- Habit one: **one topic, one conversation**; don't pile unrelated things on one desk, or they'll bleed into each other.
- Habit two: when you see it **contradicting itself, repeatedly forgetting requirements, getting long-winded, or showing clear amnesia**, decisively **open a new conversation** and lay out what's still needed cleanly, using the Chapter 11 craft; bring the good intermediate results, leave the scrapped drafts.
- When something odd happens, try a fresh conversation first; if it reproduces there, check settings or report a bug. Once explaining costs more than reopening, reopen.
- Long-term preferences: the model **itself has no memory across conversations**; to have it "remember," use the product layer's custom instructions, projects, or memory, which put information back into the context (check the official documentation).
- Memory may be extracted automatically and on by default: use temporary chats or turn memory off for what you don't want remembered, review and delete saved memories now and then, and **don't save sensitive information as a preference** (Chapter 37).

That completes the "conversation basics" of Part 2. In the next chapter we go a step further: how to move it from "one question, one answer" to **pushing a task forward continuously**, which is the AI workflow (Chapter 14).

## Sources and verification

- [Claude Help Center: memory](https://support.claude.com/en/articles/11817273) explains that memory is on by default for individual plans including Free, that Claude saves memory as you chat, that each project has its own memory, that incognito chats are kept out of memory, and that deleting a conversation doesn't remove memories generated from it.
- [OpenAI Help Center: Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq) covers ChatGPT's saved memories and chat-history reference, that Temporary Chats neither use nor create memories, and how to turn memory off and delete it.

Sources checked 2026-10-27. Product features change quickly; go by the latest version of each provider's official documentation.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most accurate explanation for a conversation getting "dumber the longer you talk"? <!-- quiz: q01 revision: 2 -->
   - A. The model tires after working so long, so answer quality slowly declines
   - B. Irrelevant, conflicting content builds up in a long chat and distracts it
   - C. The longer you chat, the more errors it learns into its parameters
   - D. Longer chats slow the network, so it can't read everything in time
   > **Answer: B.** As Chapter 3 explained, a full desk isn't bad in itself; the problem is that irrelevant or conflicting content distracts it, and requirements you set early can get buried or lose detail in a summary. A anthropomorphizes it; the model doesn't get "tired." C confuses context with training; ordinary chatting doesn't change the model's parameters. D blames the network, which misses the point.

2. **[Basic · Concept]** Which of these is a typical signal that it's time to open a new conversation? <!-- quiz: q02 revision: 2 -->
   - A. This answer is shorter than the last one and the tone is more concise
   - B. You've already asked five or six related questions in this conversation
   - C. It contradicts itself, ignores your rules, and rehashes old drafts
   - D. It quoted, word for word, something you said several turns earlier
   > **Answer: C.** Contradicting itself, repeatedly ignoring requirements, and rehashing rejected drafts mean the noise on the desk is drowning out the signal, so it's time for a clean desk. A is just a change in style and not necessarily a problem. B: the number of turns isn't a signal in itself, and related follow-ups often work better in the same conversation. D shows it still has the earlier content, which is good.

3. **[Advanced · Misconception]** "When it drifts and forgets my requirements, I'll just keep reminding and correcting it in this conversation, and eventually it'll come back." What's the problem? <!-- quiz: q03 revision: 2 -->
   - A. Correcting a messy chat often makes it worse; a fresh conversation works better
   - B. That's right; bold the requirements and repeat them, and it will comply in the end
   - C. Drifting means the model is broken, so reset all its memory in settings at once
   - D. Lower the temperature first, so its answers in the same chat become more stable
   > **Answer: A.** The drift comes from irrelevant and conflicting content piled on the desk, and adding more to the same conversation only makes it messier; open a new conversation and lay out what's still needed cleanly. C jumps ahead: the right order is to try a fresh conversation first, and only if the problem reproduces there, check settings or report it. B assumes emphasis is enough, but volume isn't the issue. D has little to do with this; temperature controls randomness (Chapter 8).

4. **[Advanced · Misconception]** "I turned on 'memory' in some product and it remembers my preferences, so the model itself must have memory across conversations." What's wrong? <!-- quiz: q04 revision: 2 -->
   - A. Your preferences were written into the model's parameters, so any product knows them
   - B. Memory saves only what you explicitly ask it to remember and nothing else
   - C. That's basically right, but this memory only really works on paid plans
   - D. The product layer puts saved information back; the model itself has no memory
   > **Answer: D.** The model itself has no memory across conversations; "memory" is the product layer putting saved information back into the context of later conversations (Chapter 3). A mixes up a product feature with training. B is wrong: some products extract memories from chats automatically, possibly on by default, which is why you should review and delete them. C also mistakes a product feature for a model ability; check each provider's official documentation for plans and defaults.

5. **[Basic · Scenario]** You've been refining a draft with the AI. It went well at first, but now it ignores new requirements and rehashes approaches you rejected. What's the best move? <!-- quiz: q05 revision: 2 -->
   - A. List every requirement again in the same chat and demand it follow them strictly
   - B. Turn on memory so it remembers the requirements, then keep editing in that chat
   - C. Open a new chat, paste your best version, say what to change, leave old drafts
   - D. Delete the whole conversation, switch models, and rewrite the draft from scratch
   > **Answer: C.** This is the chapter's signature move: carry the good intermediate result to a clean desk and leave the scrapped drafts in the old conversation. A is still adding paper to a full desk. B doesn't fix the distraction in the current conversation, and one-off requirements like these don't belong in long-term memory anyway. D is wasteful and throws away the good version too.

6. **[Basic · Hands-on]** If a product you use offers custom instructions, projects, or memory, enter one long-term preference you always have to state (such as "answer in English, professional tone, I work in education"); check the official documentation for where and how. Then open two or three brand-new conversations and see whether it "knows" this preference from the start. Also open the memory management page to see whether it has saved anything else automatically, and think about which information **shouldn't** be stored long-term this way. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** Once it's set, new conversations usually follow the preference from the start. That isn't the model remembering you; the product put the preference back into this conversation's context (Chapter 3). On the memory page you may also find things it saved on its own that you never asked it to remember; delete what you don't want. And since this information gets carried into conversation after conversation, **sensitive information (passwords, ID numbers, trade secrets) should never be saved as a preference** (Chapter 37). Features differ by product and keep changing, so check the official documentation.
