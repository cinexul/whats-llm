There's a big category of office work nobody likes but can't escape: piecing a pile of points into a presentable email, stuffing scattered information into a table, shrinking meeting conclusions into three sentences, translating a foreign-language passage. This work isn't hard, but it's **grinding, time-consuming, and draining.**

AI is practically made for this kind of work. It doesn't mind, it works fast, and it can immediately give you several versions to pick from. Outsourcing this tedious text work to it is the **first sweet taste** most people get from using AI.

But there are traps behind the sweetness. Ask it to translate and the same technical term comes out two different ways; have it tidy a table and it casually changes a number or a unit; have it write an email and it uses the wrong tone, getting buddy-buddy where it should be respectful. This chapter teaches both how to hand off this work gracefully and how to watch the few spots most likely to go off the rails. The one-line spoiler up front: **outsource the tedium to it, keep the judgment for yourself.**

## 1. First sort it out: what to outsource, and what you must backstop

This is the master switch for using AI at work. Run the task through your head and split it into two columns:

| Safe to outsource to it | You must backstop yourself |
| --- | --- |
| Drafting a first version, rephrasing, adjusting tone | **Whether the facts are right** (numbers, names, dates, amounts) |
| Expanding points into paragraphs, shrinking long text into a summary | **Whether to send it, to whom, whether it's appropriate** |
| Formatting, applying a template, outlining | **Professional judgment and the final call** (legal, contracts, external commitments) |
| Translating a first draft, generating several alternatives | **Whether the tone is appropriate, whether it offends anyone** |
| Converting information from one form to another (text <-> table) | **Whether privacy-sensitive information can go in** (see Chapter 37) |

The logic of the split is simple: **the left is "labor and expression," the right is "judgment and responsibility."** AI can do the work for you, but **you remain responsible for the result** — the email goes out under your name, and you are accountable for the numbers in the report. This follows the last chapter's advice to use AI as a study partner while checking its facts, and Chapter 14's advice to review whether its work meets your requirements.

> **Key point:** Using AI at work, how efficient you are doesn't depend on how well you "command" it, but on whether you **tell apart these two columns.** Wrongly handing off judgment and responsibility to it will blow up sooner or later; clutching the physical work to yourself wears you out for nothing. **Outsource boldly what should be outsourced, backstop firmly what should be backstopped.**

## 2. Three most common pitfalls

The three scenarios below almost everyone uses, and almost everyone has tripped on. Recognize the trap first, then you can dodge it.

### Pitfall one: translation, inconsistent terminology

You have it translate a document with technical terms, and it very likely renders **the same term as A in this section and B in the next.** A product name, a technical term, a person's name — wobbling back and forth, reading like two people translated it. The reason is its nature again: it translates section by section, "continuing" as it goes, and it **has no stable glossary in mind** keeping "this term must be called this throughout."

**What to do**: **fix the terms first, write them into the instruction.**

```text
Please translate the following English document into Spanish.
Use these agreed translations consistently throughout:
- "context window" → "ventana de contexto"
- the name "Smith" → keep as "Smith" (don't translate or adapt it)
After translating, check: do any of these terms appear with a different rendering anywhere?
```

### Pitfall two: tables / data, numbers and units quietly changed

This is easy to overlook. Have it organize or convert a table, and it sometimes **copies a number incorrectly, changes a unit (kilometers to miles), or changes a date format**, without telling you. Generating text (Chapter 4) **does not guarantee that the original values are preserved**. Check the output against the source, and use a calculator or spreadsheet for calculations.

**What to do**:

- For any organizing that involves numbers, **check each one against the original data yourself**, especially amounts, units, dates.
- Explicitly instruct: "**Copy original numbers and units exactly, don't change or convert a single one.**"
- If you really need to compute (sum, convert), don't count on its mental math — have it **lay out the formula so you can check**, or just use spreadsheet software.

> **Key point:** Pull this one out and remember it firmly: **AI is not a calculator — don't trust the numbers it hands you.** It can lay out a table beautifully, but whether the numbers are right is something you must verify against the original data yourself. A beautifully formatted table with one wrong number is far more dangerous than an ugly one, because pretty makes you let your guard down.

### Pitfall three: email / copy, tone wrong for the occasion

Have it write an email, and its default tone isn't necessarily on point: a reply to a client comes out too casual, a request to a colleague too stiff and official; where it should refuse it beats around the bush, where it should apologize it glosses over. It **doesn't know your relationship with the recipient or how sensitive the matter is** — only you know those.

**What to do**: feed it the "occasion."

```text
Help me write a reply email to a client.
- Relationship / occasion: important client, they complained about a shipping delay, our fault.
- Tone: sincere, formal, apologize first, give a remedy, no excuses.
- Length: brief, within 5 sentences.
```

> **Key point:** Tone is the thing that most tests your sense of proportion, and proportion is exactly what most depends on **background only you hold**: your relationship, the weight of the matter, the company's conventions. So an email can be drafted by it, but **before it goes out you must read it yourself** — what you're reading is whether the tone fits and whether any line will offend. This belongs squarely in the last section's "must backstop yourself" column.

## 3. One small trick that instantly steadies the output: list points first, then write

If you learn only one trick, learn this: **don't have it hand you a finished product right away, have it list the points first.**

Compare two ways of using it:

```text
x One step to the finish: "Write me a project weekly report." -> It spits out a big piece
            directly, and you have to fish through the draft for which line is off, what's
            missing.

v Two steps:   (1) "First list which blocks of points this weekly report should cover, don't
                  write it yet."
               -> You scan it, add one, cut one, change a focus (fast)
            (2) "Good, write it up by these points."
               -> The draft that comes out is already pointed right, with small changes.
```

Why does this work?

- **Revising an outline is far cheaper than revising a draft.** A wrong point you spot immediately and fix in a sentence; once it's written into a long flowing piece, the error hides between the lines, slow and tiring to find.
- **You hold the helm on direction.** The points are the skeleton; once you sign off on the skeleton, the flesh it grows on top won't drift off to another topic.
- **It also answers more accurately.** Doing one thing at a time (structure first, then content) is steadier in quality than "thinking and writing at once, charging to the end" — the same principle as Chapter 14's "see the plan before acting."

> **Key point:** "List points first, then write" works for almost all writing and organizing work: emails, reports, proposals, summaries. It splits a one-shot "bet it all" into two steps, "agree on the skeleton first, then fill in content," letting you set the direction right at the **cheapest stage** (before it's written). Build this habit and your output gets visibly steadier.

## 4. A few small reminders for keeping the judgment in your hands

A few last running reminders, all to hold the line of "judgment and responsibility are yours":

- **Numbers, names, dates, amounts — check each one.** These are what it most loves to change in passing, and the most damaging when wrong.
- **Things going out, read them yourself before sending.** Emails, announcements, documents for clients — what you're reading is tone and proportion.
- **Don't paste sensitive information casually.** Client privacy, company secrets, personal ID — think first about whether it can go in (Chapter 37 covers this).
- **Don't let it make the call for you.** "Should I agree to this condition," "can this sentence be a promise" — this is your work, not its.
- **The "facts" it gives still need checking.** It hallucinates at work too (Chapter 9); the policies, clauses, and data it cites all need confirming against the original source.

> **Key point:** Condense this chapter into one sentence and hang it in your mind: **let AI be a nimble assistant, don't let it be the one who decides.** It clears the tedious text work fast and well, and you put the saved energy where it truly matters, checking facts, gauging proportion, making judgments, taking responsibility. This is the right posture for using AI at work.

## 5. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| The tables AI organizes shouldn't have number errors | It's not a calculator; numbers, units, and dates can all be changed in passing, so you must check against the original data yourself |
| Just hand translation to it, it'll handle consistency | It translates section by section with no stable glossary in mind, so the same term is often inconsistent; fix the terms first and write them into the instruction |
| Have it write the email and send it directly, saves effort | It doesn't know your relationship with the other party or the occasion, so the tone is often off; before anything goes out you must read it yourself |
| Having it go one step to the finished product is most effortless | Listing points first then writing is more effortless: revising an outline is cheaper than revising a draft, and the direction drifts less |
| Since it can write emails and make tables, it can make the call for me | It does the work for you, but it can't be responsible for you; whether to send, whether to promise, is your judgment |

## Summary

- The master switch for using AI at work: **tell apart the "outsource" and "backstop" columns** — the left is labor and expression, the right is judgment and responsibility. It does the work for you, but it can't be responsible for you.
- The three most common pitfalls: **inconsistent translation terminology** (fix the terms first), **table numbers / units quietly changed** (it's not a calculator, check yourself), and **email tone wrong for the occasion** (feed it the relationship and occasion, read it yourself before sending).
- The habit most worth building: **have it list points first, you set the direction, then write** — revising an outline is cheaper than revising a draft, and the output steadies instantly (same as Chapter 14's "plan first, then act").
- Running backstop: check each number, read it yourself before sending out, don't paste sensitive information carelessly (Chapter 37), don't let it make the call, and remember its "facts" still need verifying against the original source (Chapter 9).

That brings Part Two, "Putting large models to use," to a close. You can now use AI steadily in daily life, learning, and work. In the next part, we switch perspective and look at the "tool map" behind the names Claude, ChatGPT, API, and Agent.

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

5. **[Basic · Scenario]** You need to write a reply to an important client who just complained about your service, and it really was your side's mistake. When drafting with AI, what should you most do? <!-- quiz: q05 revision: 2 -->
   - A. Have it make the reply as formal and long as possible to show sincerity
   - B. Explain the relationship and situation, and read it before sending
   - C. First have it decide whether to compensate, then draft by its conclusion
   - D. Have it follow a generic customer-service apology template and send it
   > **Answer: B.** Tone depends on background only you know (the relationship, who's at fault, how sensitive it is), so feed it the situation and read the draft yourself before sending. A mistakes "long and official" for sincerity. C hands the compensation decision to it, which is yours to make. D's generic template will most likely miss the tone and the nuance.

6. **[Basic · Hands-on]** Pick something you write often (weekly report, notice, external email all work) and do it with the "two-step method": step one, have AI **list which blocks of points to cover, no writing yet**, and you scan it and add, cut, adjust; step two, have it **write it up by the settled points.** Compare: how does this differ from "having it produce a finished product right away" in terms of "how much you change"? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** When listing points first, if the direction's wrong you can correct it in one sentence (revising an outline is cheap); once the skeleton is settled and then written up, the draft that comes out is already pointed right and you hardly need big changes. A "one step to the finish" product, by contrast, hides errors throughout the whole piece, slow and tiring to find. Try the comparison yourself and you'll see why "list points first, then write" works for almost all writing work; it's the same principle as Chapter 14's "see the plan before acting."
