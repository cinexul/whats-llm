Over the last nine chapters we got a good feel for what the model is and how it works: it takes your words and continues them one token at a time (Chapter 4), it chases "sounds real" rather than "is real" so it will confidently make things up (the hallucination in Chapter 9), and the model itself has no memory across conversations (Chapter 3). All of that is about the inner workings.

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
| **Can't remember what you told him yesterday** | The model itself has no memory across conversations; a new conversation resets everything (Chapter 3) |
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
Safe to outsource:
   "Rewrite this 300-character notice to be more casual and warm, for parents."
   -> You have the material, it's a style task, any error is easy to catch.

Must backstop:
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
- **Don't count on it remembering yesterday**: the model itself has no memory across conversations; a new conversation starts from zero (Chapter 3).
- **Don't count on it knowing the latest news**: its knowledge has a "cutoff date" (Chapter 9), so for recent events, by default don't trust whatever it rattles off.
- **Don't count on it reading your mind**: requirements you didn't spell out, it can only guess (Chapter 11 teaches you to "state the requirements clearly").

> **Key point:** Holding these two columns side by side is like a pair of "how much to trust" glasses. A handy starting rule of thumb: **first use it to save effort, don't rush to use it to reach conclusions.** Let it push the work from 0 to 70 (drafting, organizing, finding ideas), where it's fast and good; the last 30 (checking facts, making the call, signing off) is yours. That way you get its upside without getting burned by its weak spots.

## 4. About "does it have memory," set the rule straight on day one

Almost every beginner steps into the same trap on the first try: you get into the conversation and instinctively feel "it knows me now, it remembers what we talked about." Let me nail down the conclusions from Chapters 3 and 9 one more time, aimed at the "first conversation," because it directly affects how you use it.

The model **itself** has no memory across conversations: open a new conversation and it knows **nothing** about you; even within the same conversation, if it runs too long the earliest content gets pushed out of the context window and "forgotten" (that "desk" from Chapter 3).

But you may have noticed that some products can "remember" your preferences, remember a whole project. There's no contradiction here.

> The model **itself** really has no memory across conversations; but **many products add a "memory" ability at the "product layer" outside the model**: things like long-term memory, project memory, account-level preferences, a company knowledge base (ones you might run into include Claude's Projects, ChatGPT's Memory, project context files in coding tools, personalization settings in your account). But this **is not the model itself growing a memory; it's the product layer automatically stuffing the relevant information back into this conversation's context each time** (back to that "desk" from Chapter 3). So seeing these features is no contradiction: lift the lid and underneath it's still "a memoryless model + context re-fed every time." Exactly how each one remembers, how long, whether it's on or off by default, and whether you can delete it: **refer to the provider's official documentation**.

For the "first conversation," the practical takeaway is simple: **don't assume it remembers.** Background it needs to know, state it clearly in this conversation; preferences you want it to remember long-term, use the product's "memory / preference" feature (Chapter 13 covers how). Start from "by default it has no memory" and you won't be surprised when it "acts like it's never met you."

## 5. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| It's all-knowing, you can trust it as an authority | It's well-read but makes things up; it knows more than you, but its words need your sign-off (keep both halves of the intern together) |
| Nothing it says is reliable, so don't hand it any work | Rewriting, drafting, organizing, summarizing material are fast and good, safe to outsource; only hard facts need backstopping |
| It's like a search engine, what it gives is the fact it found | It **computes the answer fresh** to generate it (Chapter 2); it isn't looking things up, and fluency doesn't equal correctness (Chapters 4 and 9) |
| Writing tasks don't need checking at all | Watch for hard facts smuggled into the writing (numbers, names, sources), that part still needs your verification |
| Once we've chatted, it "knows" me | The model itself has no memory across conversations; "remembering" is the product layer re-feeding context, not the model itself remembering (refer to the provider's documentation) |
| It should be able to guess what I want | It can't read your mind, what you didn't spell out it can only guess; spelling out the requirement is your job (Chapter 11) |

## Summary

- Set the tone for your "first serious conversation": **treat it as a "very well-read intern who occasionally makes things up with a straight face."** The two halves, "well-read" and "makes things up," must be kept together.
- Your seat is "the person supervising the intern": hand off the work, but **the signature and the consequences are yours**, so the last look has to be yours.
- Tell apart two kinds of work: **rewriting, drafting, organizing, summarizing material** are safe to outsource; **key numbers, sources, names and dates, legal / medical / financial hard facts** you must backstop (following the boundary from Chapter 9).
- Set expectations: you can expect it to understand plain language, draft in one pass, revise tirelessly, work from material; don't count on every sentence being true, on it remembering yesterday, on it knowing the latest news, on it reading your mind.
- The rule of thumb in one line: **use it to save effort (push to 70), don't rush to use it to reach conclusions (the last 30 is yours).**
- Set the rule straight on day one: **by default it has no memory**; to remember preferences long-term, use the product layer's "memory / preference" feature (Chapter 13; refer to the provider's documentation).

In the next chapter we solve "it can't read your mind": how to state "what I want" clearly, which is **the structure of a prompt**.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What does this chapter suggest treating the model as, for the steadiest sense of proportion?
   - A. An all-knowing authority you can trust sentence by sentence
   - B. A "very well-read intern who occasionally makes things up with a straight face"
   - C. A search engine that always finds the correct answer
   - D. A person with their own agenda who deliberately deceives you
   > **Answer: B.** The heart is keeping both halves together, "well-read" and "makes things up": it knows more than you, but its words need your sign-off. A keeps only "well-read" and leads to blind trust; C treats it as "looking things up" (already debunked in Chapter 2 — it computes the answer fresh); D overthinks it: it has no intentions and won't "deliberately" deceive you, and "intern" is just a handle for proportion.

2. **[Basic · Concept]** Which kind of task is best suited to being "safely outsourced" to it?
   - A. Confirming the exact clause number in a regulation
   - B. Rewriting a notice you already wrote to be more casual and warm
   - C. Reporting the exact source and publication year of a paper
   - D. Giving the precise dosage of a drug
   > **Answer: B.** Rewriting and polishing is its strength, the material is in your hands, and any error is immediately obvious, so it's "safe to outsource." A, C, and D are all "hard facts," it may fabricate something flawless (Chapter 9), and the cost of being wrong is yours, so **you must backstop them** (check yourself or look up the official source).

3. **[Advanced · Misconception]** Someone says: "Writing is what it's best at, so the product-intro email I had it write can go out as is." What's wrong?
   - A. Nothing, writing tasks need no checking at all
   - B. Writing often smuggles in hard facts (specs, prices, awards), and that part still needs your verification, you can't send the whole thing as is
   - C. The email it writes is bound to have grammar errors
   - D. Emails must be hand-written, AI can't touch them
   > **Answer: B.** This is the sneakiest trap: a task that "looks safe to outsource" but hides hard facts. The trick is to pull out every specific **number, name, date, and citation** in the draft and verify those separately, then use the rest, the style text, with confidence. Whoever makes this mistake sees only "writing is its strength" and forgets that fluency doesn't equal correctness (Chapters 4 and 9). C and D both overstate the case.

4. **[Advanced · Misconception]** "I just chatted with it all afternoon, surely it remembers who I am and what I like." What's off here?
   - A. Completely correct, it has permanently remembered you
   - B. The model itself has no memory across conversations; in a new conversation it knows nothing, and "remembering" is the product layer re-feeding the information into context each time, not the model itself remembering
   - C. It remembers, but you have to pay to unlock it
   - D. It only remembers this afternoon and will automatically forget half by tomorrow
   > **Answer: B.** The model itself has no "yesterday" by default. **Note:** some products offer "memory / preference" outside the model (such as Claude Projects, ChatGPT Memory, project context files, account preferences), and that's the **product layer** re-stuffing the information into this conversation each time, not the model itself remembering (**refer to the provider's documentation**). Start from "by default it has no memory" and you'll neither be surprised when it "forgets" nor be confused by the memory feature.

5. **[Basic · Scenario]** You're using AI for help for the first time and want a reliable starting strategy. Which is best?
   - A. Hand all judgment and conclusions to it, whatever it says goes
   - B. Use it to push the work from 0 to 70 (drafting, organizing, finding ideas), and do the last 30 (checking facts, making the call, signing off) yourself
   - C. Don't dare hand it anything, do it all yourself, and only let it keep you company
   - D. Treat every fact it gives as correct by default, no checking needed
   > **Answer: B.** This is exactly the chapter's rule of thumb: "first use it to save effort, don't rush to use it to reach conclusions." The first 70 is fast and good; the last 30 is your zone of responsibility. A and D overrate it (you'll get burned by hallucination); C underrates it (wasting its strengths).

6. **[Basic · Hands-on]** Pick a real small task you have on hand (rewriting a notice, drafting an email). First think it through: is this "safe to outsource" or "must backstop"? If it's both, circle the "hard fact" parts separately. Then hand it to the AI.
   > **What you should notice:** For most everyday tasks the "style part" (how to write it more smoothly, more appropriately) is safe to outsource; what truly needs your backing is usually just the few **hard facts** tucked inside (numbers, names, dates, sources). Circle them once yourself and you build the habit of "checking the hard facts first when a draft comes back," the most effortless and trap-proof move for using AI well. For the facts you circled to check, where an official source is available, go by the official documentation.
