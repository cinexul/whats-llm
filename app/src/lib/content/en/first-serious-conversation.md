Over the last nine chapters we got a good feel for what the model is and how it works: it takes your words and continues them one token at a time (Chapter 4), it doesn't check facts as it generates, so it sometimes makes things up with confidence (hallucination, Chapter 9), and the model itself has no memory across conversations (Chapter 3). All of that is about the inner workings.

But when you actually open the chat box, fingers hovering over the keyboard, the first real question is a different one. **What exactly should I treat this thing as?** An all-knowing expert? A search engine? An assistant that does your work for you? Get this wrong and you either don't dare use it (wasting it) or use it too freely (and get burned without realizing it).

This chapter has no new theory. It does one thing: **hand you a reliable mindset.** One metaphor sets the tone. **Treat it as a "very well-read intern who occasionally makes things up with a straight face."** Hold on to that intern and this whole part of the book (how to use it well) goes smoothly.

## 1. Who it's most like: a "well-read intern who also makes things up"

Let's set up the metaphor first, then bring it back to what it actually is.

Imagine the company assigns you a new intern. He has these traits:

| This intern | Maps to the model |
| --- | --- |
| **Has read a frightening number of books** | The huge body of knowledge pressed into its parameters during training (Chapter 2), knows a bit of everything |
| **Fast hands, never tired, never complains** | Ask for ten drafts and it writes ten, even at 3 a.m. |
| **Smooth talker, extremely confident** | It chases "sounds right," so its wording is always fluent and assured (Chapter 4) |
| **But sometimes invents things with a straight face** | When it doesn't know, instead of saying "I can't" it strings together a plausible fake answer (the hallucination in Chapter 9) |
| **Can't remember what you told him yesterday** | The model itself has no memory across conversations; what it knows in a new conversation depends on what the product brings in this time (Chapter 3) |
| **Doesn't grasp what you actually want** | What you didn't spell out, it can only guess (exactly what Chapter 11 solves) |

> **Key point:** The heart of this metaphor is keeping both halves together: "**well-read**" and "**makes things up**." Remember only "well-read" and you'll blindly trust it and treat it as an authority. Remember only "makes things up" and you'll fear it and never hand it anything. The truth is both at once: **it knows more than you, but what it says needs your sign-off.** A good way to use it is to put yourself in the seat of "the person supervising the intern." You can hand off the work, but **the signature and the consequences are yours**, so that last look has to be yours.

Back to what it actually is: it isn't really a "person." It has no intentions, won't slack off, and won't deliberately deceive you. "Intern" is just a handle for judging **proportion**, neither overrating nor underrating it.

## 2. Work you can safely outsource vs work you must backstop yourself

With the "intern" sense of proportion, the most useful next step is to tell apart **which work you can hand off and which you must watch.** This line follows straight from the boundary in Chapter 9: **work that has a basis to "continue" and that you can verify, hand it off; generating hard facts from nothing, where being wrong has a cost, is work you must backstop yourself.**

| | Safe to outsource | You must backstop |
| --- | --- | --- |
| **Typical tasks** | Rewriting and polishing, saying it another way, drafting a first version, outlining, brainstorming, summarizing material you pasted in, translating, explaining a concept | Key numbers, citations and sources, names and dates, legal / medical / financial conclusions, factual content meant for publication |
| **Why safe / why backstop** | Either the answer is in the context you gave (it's "continuing" from your material), or if it's wrong you can spot it at a glance and fix it fast | It may fabricate something flawless (Chapter 9), and the cost of being wrong is borne by **you** |
| **Your role** | Hands-off boss: give clear requirements, accept the draft | The person responsible: check it again yourself, your signature is what counts |

Two contrasting examples and you'll feel the line right away:

```text
✅ Safe to outsource:
   "Rewrite this 300-character notice to be more casual and warm, for parents."
   -> You have the material, it's a style task, any error is easy to catch.

⚠️ Must backstop:
   "What is the exact tax threshold for a certain policy in my country?"
   -> This is a hard fact, and it may just make one up (Chapter 9). Either have it
      give the official source and check it yourself, or just go look it up through
      official channels.
```

> **How you'll actually run into this:** The easiest trap is work that "looks safe to outsource but secretly hides a hard fact." Say you ask it to "write an email introducing the company's product." Writing is its strength, but the moment it casually "writes in" some **spec, price, or award**, that part becomes a hard fact, and **you have to check it.** The trick: when you get the draft back, pull out every **specific number, name, date, and citation** and verify those separately. The rest, the style text, you can use with confidence.

## 3. What to expect, and not expect, the first time

With those two points in hand, let's set expectations for your "first serious conversation." Expect right and you won't be let down. Expect wrong and you'll either think it "can do everything" and step into a trap, or think it "can't do anything" and miss out.

**What you can expect it to do:**

- **Understand plain language**: just state your request in everyday words, no commands or magic spells to learn.
- **Draft something usable in one pass**: writing emails, outlining, changing the style, explaining a concept, often a usable first draft on the first try.
- **Revise tirelessly**: not happy? Ask for another version, a different angle, longer or shorter. This is its most comfortable use.
- **Work from the material you give it**: paste in the documents and have it summarize, compare, or extract, usually quite reliable (Chapter 12 goes into detail).

**What not to count on (this part matters more):**

- **Don't count on every sentence being true**: it makes things up, and the more fluent it sounds the more you should watch out (Chapter 9).
- **Don't count on it remembering yesterday**: the model itself has no memory across conversations, so a new conversation starts from zero by default. Even with a product's memory feature turned on, what comes back is only the part the product chose to save (Chapter 3).
- **Don't count on it knowing the latest news**: its knowledge has a "cutoff date" (Chapter 9), so for recent events, by default don't trust whatever it rattles off.
- **Don't count on it reading your mind**: requirements you didn't spell out, it can only guess (Chapter 11 teaches you to "state the requirements clearly").

> **Key point:** Holding these two columns side by side is like a pair of "how much to trust" glasses. A handy starting rule of thumb: **first use it to save effort, don't rush to use it to reach conclusions.** Let it push the work from 0 to 70 (drafting, organizing, finding ideas), where it's fast and good; the last 30 (checking facts, making the call, signing off) is yours. That way you get its upside without getting burned by its weak spots.

## 4. About "does it have memory," set the rule straight on day one

Almost every beginner steps into the same trap on the first try: you get into the conversation and instinctively feel "it knows me now, it remembers what we talked about." Chapters 3 and 9 covered how this works; here it is once more for your first conversation, because it directly affects how you use it.

The model **itself** has no memory across conversations. Open a new conversation and the model knows nothing about you. Even within one conversation, if it runs long, earlier details may be trimmed, compressed into a summary, or buried under everything else, depending on the product (that "desk" from Chapter 3).

Still, some products really do seem to "remember" you. That's no contradiction. As of October 2026, Claude, ChatGPT, and many other products offer features like **projects** and **memory**: a project keeps material and instructions together for reuse, while memory saves your preferences and key points from past chats. Some products **extract things to remember from your chats automatically**, and that may be switched on by default. All of these live in the product layer outside the model: the product puts the saved information back into the context of later conversations. Lift the lid and underneath it's still "a memoryless model + context re-fed every time."

For your first conversation, that comes down to three practical habits:

- Don't assume it remembers. Background it needs, state it clearly in this conversation.
- Preferences you want it to keep long-term, put them in the product's memory or project features (Chapter 13 goes into this).
- Things you don't want remembered, use a temporary chat (some products call it incognito) or turn memory off first. Every so often, check in the settings what it has saved and delete anything outdated or wrong. Names, defaults, and how deletion works differ by product, so check the official documentation.

Start from "by default it has no memory" and you won't be surprised when it "acts like it's never met you." Just keep in mind that a product with memory switched on may remember more than you think.

## 5. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| It's all-knowing, you can trust it as an authority | It's well-read but makes things up; it knows more than you, but its words need your sign-off (keep both halves of the intern together) |
| Nothing it says is reliable, so don't hand it any work | Rewriting, drafting, organizing, summarizing material are fast and good, safe to outsource; only hard facts need backstopping |
| It's like a search engine, what it gives is the fact it found | It **computes the answer fresh** to generate it (Chapter 2); it isn't looking things up, and fluency doesn't equal correctness (Chapters 4 and 9) |
| Writing tasks don't need checking at all | Watch for hard facts smuggled into the writing (numbers, names, sources), that part still needs your verification |
| Once we've chatted, it "knows" me | The model itself has no memory across conversations; a product's memory feature puts saved information back into the context, which isn't the model remembering |
| It should be able to guess what I want | It can't read your mind, what you didn't spell out it can only guess; spelling out the requirement is your job (Chapter 11) |

## Summary

- Set the tone for your "first serious conversation": **treat it as a "very well-read intern who occasionally makes things up with a straight face."** The two halves, "well-read" and "makes things up," must be kept together.
- Your seat is "the person supervising the intern": hand off the work, but **the signature and the consequences are yours**, so the last look has to be yours.
- Tell apart two kinds of work: **rewriting, drafting, organizing, summarizing material** are safe to outsource; **key numbers, sources, names and dates, legal / medical / financial hard facts** you must backstop (following the boundary from Chapter 9).
- Set expectations: you can expect it to understand plain language, draft in one pass, revise tirelessly, work from material; don't count on every sentence being true, on it remembering yesterday, on it knowing the latest news, on it reading your mind.
- The rule of thumb in one line: **use it to save effort (push to 70), don't rush to use it to reach conclusions (the last 30 is yours).**
- Set the rule straight on day one: **by default it has no memory**; to keep preferences long-term, use the product layer's memory or project features (Chapter 13); for things you don't want remembered, use a temporary chat or turn memory off, and review and delete saved memories now and then (check the official documentation).

In the next chapter we solve "it can't read your mind": how to state "what I want" clearly, which is **the structure of a prompt**.

## Sources and verification

- [Claude Help Center: memory](https://support.claude.com/en/articles/11817273) explains that memory is on by default for individual plans including Free, that Claude saves memory as you chat, that incognito chats are kept out of memory, and how to view and delete memories.
- [OpenAI Help Center: Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq) covers ChatGPT's saved memories and chat-history reference, that Temporary Chats neither use nor create memories, and how to turn memory off and delete it.

Sources checked 2026-10-27. Product features change quickly; go by the latest version of each provider's official documentation.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What does this chapter suggest treating the model as, for the steadiest sense of proportion? <!-- quiz: q01 revision: 1 -->
   - A. A fast search engine whose answers are mostly facts it looked up
   - B. An expert adviser whose answers on specialist topics you can accept
   - C. A well-read intern who sometimes makes things up, straight-faced
   - D. A program that just strings words together, unfit for real work
   > **Answer: C.** Keep both halves together, "well-read" and "makes things up": it knows more than you, but what it says needs your sign-off. A treats it as looking things up; Chapter 2 showed that it generates answers on the spot, and fluent is not the same as correct. B remembers only "well-read" and leads to blind trust. D remembers only "makes things up" and wastes what it's good at, like rewriting and drafting.

2. **[Basic · Concept]** Which kind of task is best suited to being "safely outsourced" to it? <!-- quiz: q02 revision: 1 -->
   - A. Rewriting a notice you wrote so it sounds more casual and warm
   - B. Looking up the exact weight-based dose of a common medicine
   - C. Explaining exactly what a specific article of a regulation says
   - D. Compiling a reading list of papers with their authors and years
   > **Answer: A.** For a rewrite, the material is in your hands and a bad result is obvious at a glance, so it's safe to outsource. B and C are hard facts where mistakes are costly. D sounds like "organizing," but it asks the model to produce authors and years from nothing, exactly where it tends to invent (Chapter 9). All three are yours to backstop.

3. **[Advanced · Misconception]** Someone says: "Writing is what it's best at, so the product-intro email I had it write can go out as is." What's the most accurate correction? <!-- quiz: q03 revision: 1 -->
   - A. It's fine: if the email reads smoothly and politely, send it
   - B. No: anything AI writes must be rewritten by a person from scratch
   - C. The style is fine, just proofread for typos and punctuation first
   - D. The text works, but check specs, prices, and awards separately
   > **Answer: D.** The task looks safe to outsource but hides hard facts. Pull out every number, name, date, and citation in the draft and verify them separately; the rest of the text you can use with confidence. A sees only "writing is its strength" and forgets that fluent isn't the same as correct (Chapters 4 and 9). B overcorrects. C checks the surface; the real risk is in the hard facts.

4. **[Advanced · Misconception]** "I just chatted with it all afternoon, surely it remembers who I am and what I like." Which statement is most accurate? <!-- quiz: q04 revision: 1 -->
   - A. On the same account, the model learns your chats into its parameters
   - B. The model can't remember, but a product's memory may save some
   - C. The model has long-term memory, but only paid plans switch it on
   - D. Nothing is kept; once you close the chat, no product can ever use it
   > **Answer: B.** The model itself has no memory across conversations. But products such as Claude and ChatGPT may offer memory features; some extract memories from chats automatically and may have them on by default. What's saved gets put back into the context of later conversations. A mistakes this for training; ordinary chatting doesn't change the model's parameters. C confuses a product feature with a model ability. D goes too far: a product with memory on really can carry information into a new conversation. For how saving and deleting work, check the official documentation.

5. **[Basic · Scenario]** You're using AI for help for the first time and want a reliable starting strategy. Which is best? <!-- quiz: q05 revision: 1 -->
   - A. Use it as a search engine first, asking only fact questions
   - B. Let it get the work to 70; keep fact-checking and decisions
   - C. Start with your most important decisions to see what it can do
   - D. Only chat with it for a month or two before giving it real work
   > **Answer: B.** This is the chapter's rule of thumb: use it to save effort first, and don't rush to use it for conclusions. Drafting, organizing, and finding ideas it does fast and well; checking facts, making the call, and signing off are yours. A puts it exactly where hallucination is most likely. C hands it the conclusions, the riskiest choice. D is too cautious and wastes its strengths.

6. **[Basic · Hands-on]** Pick a real small task you have on hand (rewriting a notice, drafting an email). First think it through: is this "safe to outsource" or "must backstop"? If it's both, circle the "hard fact" parts separately. Then hand it to the AI. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** For most everyday tasks the "style part" (how to write it more smoothly, more appropriately) is safe to outsource; what truly needs your backing is usually just the few **hard facts** tucked inside (numbers, names, dates, sources). Circle them once yourself and you build the habit of checking the hard facts first when a draft comes back. For the facts you circled, where an official source is available, go by the official documentation.
