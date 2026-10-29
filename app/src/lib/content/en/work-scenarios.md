Every office has a pile of chores nobody enjoys but nobody can avoid: turning a list of points into a polite email, squeezing scattered information into a table, boiling a meeting's conclusions down to three sentences, translating a passage from another language. None of it is hard, but it's tedious and eats time. AI could have been made for this work: it never gets bored, it's fast, and it can give you several versions to pick from. For many people, this is where AI first pays off.

There are traps, though. In a translation it renders the same technical term two different ways; tidying a table, it quietly changes a number or a unit; writing an email, it strikes the wrong tone and gets chummy where it should be respectful. This chapter covers how to hand these jobs off well and which spots to watch most closely.

## 1. First sort it out: what to outsource, and what you must backstop

Before you start, run the task through your head and split it into two columns:

| Safe to outsource to it | You must backstop yourself |
| --- | --- |
| Drafting a first version, rephrasing, adjusting tone | Whether the facts are right (numbers, names, dates, amounts) |
| Expanding points into paragraphs, shrinking long text to a summary | Whether to send it, to whom, whether it's appropriate |
| Formatting, applying templates, outlining | Professional judgment and the final call (legal, contracts, commitments to outsiders) |
| A first-draft translation, several alternative versions | Whether the tone is right, whether it will offend anyone |
| Moving information from one form to another (text ↔ table) | Whether sensitive information may go in at all (Chapter 37) |

The left column is labor and expression; the right is judgment and responsibility. It can do the work for you, but it can't take responsibility for you: the email goes out under your name, and the numbers in the report are on you. This is the same line as Chapter 15's "a reading buddy, not a source of facts" and Chapter 14's "it runs the flow, you sign off." Once you can tell the two columns apart, you can outsource the left freely and keep a firm hold on the right.

## 2. The three places it most often goes wrong

### First, translation: terms that don't stay consistent

Ask it to translate a document full of technical terms and it may well render the same term as A in one paragraph and B in the next. A product name, a technical term or a person's name keeps shifting, as if two people did the translation. The reason is that it translates paragraph by paragraph and doesn't keep a glossary of "this word is always called this."

The fix is to pin down the terms first and write them into the instructions:

```text
Please translate the following English document into Spanish.
Use these agreed translations consistently throughout:
- "context window" → "ventana de contexto"
- the name "Smith" → keep as "Smith" (don't translate or adapt it)
After translating, check: do any of these terms appear with a different rendering anywhere?
```

### Second, tables and data: numbers and units quietly changed

This is the hardest to notice and the most dangerous. Ask it to tidy or convert a table and it sometimes gets a number wrong, swaps a unit (kilometers become miles) or scrambles a date format, without telling you. Its job is to produce the most plausible continuation (Chapter 4); unlike a calculator, it doesn't guarantee that values stay the same. To it, numbers are also text that can be "smoothed out" along the way.

So:

- Whenever numbers are involved, check them one by one against the original data, especially amounts, units and dates.
- Say it plainly: "Copy all original numbers and units exactly. Don't change or convert a single one."
- If you need real arithmetic (totals, conversions), don't rely on its mental math. Have it write out the formula so you can check it, or just use a spreadsheet.

> **Key point:** AI is not a calculator; check the numbers it hands you against the original data. A beautifully formatted table with one wrong number is more dangerous than an ugly one, because the polish makes you drop your guard.

### Third, email and copy: the wrong tone for the occasion

Its default tone may not fit: a reply to a client comes out too casual, a request to a colleague too stiff; it beats around the bush when it should decline clearly, and glosses over what calls for an apology. It doesn't know your relationship with the recipient or how sensitive the matter is. Only you know that.

So tell it the occasion:

```text
Help me write a reply email to a client.
- Relationship / occasion: important client, they complained about a shipping delay, our fault.
- Tone: sincere, formal, apologize first, give a remedy, no excuses.
- Length: brief, within 5 sentences.
```

Let it draft the email, but read it yourself before it goes out, checking whether the tone fits and whether any line could offend. That belongs in the "must backstop yourself" column from section 1.

## 3. One small trick that instantly steadies the output: list points first, then write

If you learn only one trick, make it this: don't ask for the finished piece right away; have it list the points first.

```text
x One step to the finish: "Write me a project weekly report." -> It writes out a big piece
            directly, and you have to fish through the draft for which line is off, what's
            missing.

v Two steps:   (1) "First list which blocks of points this weekly report should cover, don't
                  write it yet."
               -> You scan it, add one, cut one, change a focus (fast)
            (2) "Good, write it up by these points."
               -> The draft that comes out is already pointed right, with small changes.
```

Fixing an outline is much cheaper than fixing a draft. If a point is wrong, you see it at a glance and fix it in one sentence; once it's a long piece, the mistakes hide between the lines and take a while to dig out. Once you've approved the skeleton, it fills in the content without wandering off to another topic. Doing one thing at a time (structure first, then content) also makes the quality steadier, the same idea as Chapter 14's "see the plan before acting." It works for emails, reports, proposals and summaries alike.

## 4. Common misconceptions, corrected

| Misconception | Reality |
| --- | --- |
| A table the AI tidied up should have correct numbers | It's not a calculator; numbers, units and dates can get changed along the way. Check against the original data |
| Leave translation to it and it will keep things consistent | It translates paragraph by paragraph with no fixed glossary; pin the terms down in the instructions |
| Have it write the email and send it straight off | It doesn't know your relationship or the occasion; read anything external before sending |
| Getting a finished piece in one step saves the most effort | Points first, then the draft saves more: an outline is cheaper to fix and keeps the direction on track |
| If it can write emails and build tables, it can make my decisions | It works for you but can't take responsibility; whether to send or promise is your call |

## Summary

- Using AI at work starts with two columns: labor and expression on the left can be outsourced; judgment and responsibility on the right stay with you.
- The three places it most often goes wrong: inconsistent terms in translation (set a glossary first), numbers and units quietly changed in tables (check against the original data), email tone wrong for the occasion (tell it the relationship and setting, and read before sending).
- The habit most worth building: have it list the points, set the direction yourself, then have it write.
- Think before pasting sensitive information (Chapter 37); policies, clauses and figures it gives you at work also need checking against the original source (Chapter 9).

That wraps up Part 2, "Putting large models to work." The next part shifts perspective to the tool landscape behind names like Claude, ChatGPT, API and agent.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** By this chapter's "two-column method," which of these belongs in the "must backstop yourself" column? <!-- quiz: q01 revision: 2 -->
   - A. Rewriting a passage in a more formal, written style
   - B. Deciding whether this email should go out, and to whom
   - C. Expanding a few scattered points into a smooth paragraph
   - D. Condensing a long report into a one-page summary
   > **Answer: B.** Whether to send and to whom is judgment and responsibility, which only you can decide. A, C, and D are "labor and expression," safe to outsource (though you still look over the draft). The test for the split: is this doing the work, or making the call and taking responsibility?

2. **[Basic · Concept]** Why are numbers and units especially prone to problems when AI organizes a table? <!-- quiz: q02 revision: 2 -->
   - A. It generates text, numbers included, and doesn't guarantee they stay put
   - B. When a table overflows the context, the numbers get rounded automatically
   - C. Models are more used to metric, so they tend to convert miles to kilometers
   - D. It recalculates every number each time, and errors creep in along the way
   > **Answer: A.** Its job is to produce the most fitting continuation (Chapter 4); unlike a calculator, it doesn't guarantee that values stay unchanged, so it may write a number wrong or quietly swap a unit. B ties context to rounding, but there's no such mechanism. C overgeneralizes; a swapped unit is just one way things go wrong. D pictures it as a calculator, when most of the time it isn't "calculating" at all.

3. **[Advanced · Misconception]** "This table AI organized for me is beautifully laid out and looks professional, the data should be fine." What's dangerous about this thought? <!-- quiz: q03 revision: 2 -->
   - A. A polished layout means it worked harder, which makes number errors likelier
   - B. Just have it add "data verified" at the end, and you can use it directly
   - C. The only risk is layout; it may break when exported to spreadsheet software
   - D. Layout and correct numbers are separate; polish lowers your guard
   > **Answer: D.** "Looks good" is formatting; "are the numbers right" is another matter. A polished table with one wrong number is worse than an ugly one, because the polish disarms you. A invents a causal link that doesn't exist. B has it declare the data verified, which isn't the same as verifying it. C worries about formatting, but the real risk is in the data.

4. **[Advanced · Misconception]** You have AI translate a technical document, and it renders the same term two different ways back and forth. What's the most fundamental reason? <!-- quiz: q04 revision: 2 -->
   - A. It varies the wording on purpose to make the translation livelier
   - B. It doesn't know the term, so it guesses a new rendering each time
   - C. It translates bit by bit, with no fixed glossary held in mind
   - D. The text overflowed the window, so another model did the second half
   > **Answer: C.** This follows directly from its section-by-section nature: it doesn't automatically keep terms consistent across the whole text. The fix is to fix the terms first, write them into the instruction, and have it check after translating. A anthropomorphizes it. B is wrong: it "knows" the term but hasn't fixed a rendering. D is an imagined mechanism.

5. **[Basic · Scenario]** You need to write a reply to an important client who just complained about your service, and it really was your side's mistake. When drafting with AI, what should you most do? <!-- quiz: q05 revision: 3 -->
   - A. Have it make the reply as formal and long as possible to show sincerity
   - B. Explain the relationship and situation, and read it before sending
   - C. First have it decide whether to compensate, then draft by its conclusion
   - D. Have it follow a generic customer-service apology template and send it
   > **Answer: B.** Tone depends on background only you know (the relationship, who's at fault, how sensitive it is), so tell it the situation and read the draft yourself before sending. A mistakes "long and official" for sincerity. C hands the compensation decision to it, which is yours to make. D's generic template will most likely miss the tone and the nuance.

6. **[Basic · Hands-on]** Pick something you write often (weekly report, notice, external email all work) and do it with the "two-step method": step one, have AI **list which blocks of points to cover, no writing yet**, and you scan it and add, cut, adjust; step two, have it **write it up by the settled points.** Compare: how does this differ from "having it produce a finished product right away" in terms of "how much you change"? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** When listing points first, if the direction's wrong you can correct it in one sentence (revising an outline is cheap); once the skeleton is settled and then written up, the draft that comes out is already pointed right and you hardly need big changes. A "one step to the finish" product, by contrast, hides errors throughout the whole piece, slow and tiring to find. Try the comparison yourself and you'll see why "list points first, then write" works for almost all writing work; it's the same principle as Chapter 14's "see the plan before acting."
