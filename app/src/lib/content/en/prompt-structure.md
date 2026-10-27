In Chapter 10 we set a mindset: treat it as a "well-read intern who also makes things up." This chapter solves that intern's biggest weak spot: **it can't read your mind.**

Chapter 4 explained that its real job is to "continue": given your opening, it continues with the most plausible content. That brings an awkward moment you've definitely hit. **You say "polish this for me," and what it gives you often isn't the version you had in mind.** It's not that it's dumb -- it's that you didn't spell things out; the part you left unsaid, **it can only guess**, and its guess is "what most people usually want when they say this," which isn't necessarily what you want.

The good news: stating "what I want" clearly is **a craft you can learn**, and it isn't hard. This chapter gives you a simple framework that takes you from "rolling the dice" to "knowing what you'll get." This craft has a name: writing a **prompt**.

## 1. A comparison first: why "polish this for me" doesn't work

No theory yet, just the effect. Same passage, two ways of asking, worlds apart.

Suppose you have this passage to send to parents:

```text
Original: "Regarding this Friday's parent meeting, please arrive at the third-floor
           conference room at 3 p.m. sharp. The meeting is expected to run an hour and
           a half. Please arrange your time in advance, thank you for cooperating."
```

**Way one (vague):**

```text
"Polish this for me."
```

It hands you back a "polished" piece of text, but what exactly should it become? More formal or warmer? Longer or shorter? For whom? It's **all guessing**. You'll most likely go back and forth with "not this feeling," "shorter," "more casual," a tug of war.

**Way two (spelled out):**

```text
"Rewrite the notice below to about 100 words, casual and warm in tone, for parents.
 Open with a greeting, and keep the two key details 'Friday 3 p.m.' and 'third-floor
 conference room.'

 Original: ... (pasted)"
```

This version gives you what you wanted on nearly the first try. The difference isn't that it got smarter. **It's that you turned the "goes without saying" requirements in your head into text it can see.**

> **Key point:** Why doesn't "polish this for me" work? Because "polish" has a concrete picture in your head (how long, what tone, for whom, what to keep), but those pictures **never became words**, so it can't see them. Back to Chapter 4: it can only continue based on "what you wrote," **it can't read your mind, and what you didn't say it can only guess.** So the whole craft of prompting is one sentence: **honestly write out the requirements you've been taking for granted.**

## 2. One all-purpose framework: context, task, constraints, format, success criteria

You don't need to memorize "spells," and there's no mysterious sentence pattern. Break down any clear request and it's nothing more than these five blocks. You don't have to write them all every time, but **run through these five in your head** and you'll rarely miss what matters.

| Five blocks | The question it answers | Example |
| --- | --- | --- |
| **Context** | What's going on? For whom? | "This is a notice for parents of elementary schoolers" |
| **Task** | What exactly do you want it to do? | "Rewrite this notice" |
| **Constraints** | What limits and requirements are there? | "About 100 words, casual, warm, keep the time and place" |
| **Format** | What kind of finished product do you want? | "Give me the whole rewritten text directly" / "List it as 3 points" / "Make a table" |
| **Success criteria** | What counts as done well? | "Parents can understand it at a glance, reads naturally" |

Look back at "way two" from the last section and you'll find it hits all five blocks. That's no accident: **a good prompt is just these five blocks stated clearly.**

```text
One-line template (use what you need, not all of it):

  [context] + [the task you want done] + [constraints to meet] + [format of the
  finished product] + [what counts as success]
```

> **How you'll actually run into this:** You'll find that of the five, the ones most often forgotten and most critical are **constraints** and **format**. Most people state the task clearly enough ("write me a summary") but leave "how long, for whom, what tone, listed as several points or one paragraph" in their heads. The result is "right, but not what you wanted." Next time you're stuck, ask yourself first: **length, audience, tone, what the product looks like, did I say those four?**

## 3. Make "constraints" specific: the more specific, the less work

Many people fear that "saying too much detail will limit it." The opposite is true: **for everyday tasks, the more specific the constraints, the less back-and-forth rework.** Save the "free play" for open tasks like brainstorming (there you really can just give a rough direction).

A few constraint dimensions most worth spelling out, vague vs specific:

| Dimension | Vague (it has to guess) | Specific (it follows) |
| --- | --- | --- |
| **Length** | "Shorter" | "Keep it under 200 words" / "No more than 3 sentences" |
| **Audience** | "Make it easier to understand" | "Write it for an older relative with no technical background" |
| **Tone** | "More formal" | "Written, restrained, no exclamation marks" |
| **Angle / focus** | "Summarize this" | "Summarize only the parts about the 'refund policy'" |
| **Keep / avoid** | (unsaid) | "Keep these three numbers" / "No jargon" |
| **Format** | "Tidy this up" | "List it as 5 points with subheadings" / "Make a two-column table" |

> **Key point:** Notice the counterintuitive bit: **spelling out constraints isn't "bossing it around," it's saving yourself work.** Every extra constraint you write is one fewer round of "no, redo it." Especially **length** and **format**, which most affect how the product looks yet are most often left out. A small habit: after writing the task, tack on "**give me XX words, XX format**," and the hit rate jumps up a notch.

## 4. An "example" beats a long explanation

There's one more move that works especially well, worth pulling out on its own: **rather than struggling to describe the style you want, just give it an example.**

People and models are alike: "copy from a sample" is easier than "follow a description." Want a certain format, a certain tone? Give it one or two samples and it can imitate them:

```text
"Following the format below, write one line for each of these three items:

 Sample:
 [Title] Friday parent meeting
 [Time] June 26, 3:00 p.m.
 [One line] Please be on time at the third-floor conference room, about 90 minutes.

 Now do these three items: ..."
```

It immediately gets that you want the "[Title] [Time] [One line]" mold and fills it in. That's far more efficient than explaining in words "I want a format with a title, a time, and a one-line summary."

> **How you'll actually run into this:** When you find that "no matter how I say it, it's not right," it's usually a **style** requirement, and style is the hardest thing to pin down in words. Don't pile on adjectives, just **paste a sample you're happy with**: "do it like this feeling / this format." Also, Chapter 4 explained that its word choice has some randomness, so **the same clear prompt, regenerated once, may give a better version**. Spell it out + occasionally re-roll is a perfect pair.

## 5. Spelling out is not writing long: find the balance

Don't swing to the other extreme. "Spelling out" means **stating all the key information**, not **piling up filler**. A long, rambling prompt jammed with irrelevant background actually buries the point (as Chapter 3 explained, irrelevant content can distract the model).

To find this balance, remember three things:

- **Don't skip what matters**: task, key constraints (length / audience / tone / format), what to keep or avoid, none of these can be missing.
- **Don't stuff what's useless**: background unrelated to this task, pleasantries, repeated reminders, the less the better.
- **Complex task, say it step by step**: rather than writing one blob of "first A then B then C then D," have it do A first, take a look, then have it do B (this leads straight into Chapter 14, "keep the AI pushing a task forward").

> **Key point:** The standard for a good prompt isn't "long," it's "**all the key information, little filler**." What you're after is letting it see at a glance "what to do, what to satisfy, what kind of product to give me." State those three crisply and it beats filling a whole screen.

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| "Polish / tidy this for me" should make it understand what I want | It can't read your mind; how long, for whom, what tone, what format, unsaid it can only guess (Chapter 4) |
| Prompts need special "spells" or fixed sentence patterns | No spells needed, just state context, task, constraints, format, success criteria clearly in plain language |
| Being too specific limits its play | For everyday tasks the more specific the constraints the less rework; save "free play" for open tasks like brainstorming |
| Style is described by piling on adjectives | Style is best handled by giving an **example** to imitate, far more efficient than describing in words |
| The longer the prompt the better | The standard is "all the key information, little filler"; piling on irrelevant background buries the point (Chapter 3) |
| A prompt that didn't work means the model is weak | More likely the requirement wasn't clear; fixing the prompt and adding the missing constraints often works immediately |

## Summary

- Its biggest weak spot is **it can't read your mind**: what you don't spell out, it can only guess as "what most people usually want" (Chapter 4).
- "Polish this for me" doesn't work because "how long, for whom, what tone, what format" never **became words**; write them out and the hit rate jumps.
- The all-purpose framework, five blocks: **context, task, constraints, format, success criteria.** You don't have to write them all every time, but run through them in your head and you won't miss what matters.
- The most often forgotten and most critical are **constraints** (length / audience / tone / focus) and **format**; after writing the task, tack on "give me XX words, XX format."
- For style requirements, **give an example** to imitate, better than piling on adjectives; pair it with "regenerate" and an occasional re-roll (Chapter 4).
- "Spelling out" is not "writing long": the standard is **all the key information, little filler**; for complex tasks, **say it step by step** (leading into Chapter 14).

In the next chapter we apply this craft to a high-frequency scenario: how to "feed" a long document to it and get it to answer honestly from the material alone, which is **long-text processing and summarizing material**.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** Why does "polish this for me" often not work? <!-- quiz: q01 revision: 1 -->
   - A. "Polish" is too casual; it only responds to formal, precise commands
   - B. Your unstated length, tone, and audience leave it guessing
   - C. The sentence is too short, so the model can't give it enough attention
   - D. Polishing is a subjective judgment, which models are simply bad at
   > **Answer: B.** It can only continue from what you actually wrote (Chapter 4). The unstated requirements behind "polish" get filled in with a guess at what most people usually want, which may not be what you want. A assumes it needs special commands; plain language works fine. C blames the length, but a short sentence can still be clear. D is wrong: polishing is one of its strengths. What's missing is your requirements.

2. **[Basic · Concept]** Which five blocks make up the "all-purpose framework" in this chapter? <!-- quiz: q02 revision: 1 -->
   - A. Context, task, constraints, format, success criteria
   - B. Role, tone, length, layout, reference examples
   - C. Goal, work steps, tools needed, deadline, owner
   - D. Question, material, requirements, examples, regenerate
   > **Answer: A.** Context, task, constraints, format, success criteria. You don't have to write them all every time, but running through them in your head keeps you from missing what matters, especially the often-forgotten "constraints" and "format." In B, tone and length are really part of "constraints," and examples are a separate trick from section 4. D mixes a few tips in with the framework. C is more like a project plan.

3. **[Advanced · Misconception]** Someone says: "The more specific a prompt, the more it limits the AI's play, so you should be vague and let it run free." What's the problem here? <!-- quiz: q03 revision: 1 -->
   - A. The idea is right; just regenerate a few times to make up for vagueness
   - B. Specific constraints matter only for long texts; short asks can be vague
   - C. The real problem is that specific prompts use more tokens and cost more
   - D. For everyday tasks like rewriting and summarizing, specifics cut rework
   > **Answer: D.** Everyday tasks want "right, and the version I wanted," so spelling out constraints saves rework. Only open tasks like brainstorming suit a rough direction and free rein. A relies on luck; regenerating helps after you've been clear. B is wrong: short asks still need length, audience, and format. C's few saved tokens are nothing next to the cost of repeated rework.

4. **[Advanced · Misconception]** You want a certain layout style, you keep describing it in words, and it never feels right. Which approach is most likely to work? <!-- quiz: q04 revision: 1 -->
   - A. Add more and finer adjectives until the description is precise enough
   - B. Switch to a stronger model, since style depends on the model's ability
   - C. Paste in a sample you're happy with and have it follow that sample
   - D. Rewrite the whole prompt in another language the model handles better
   > **Answer: C.** Copying a sample is easier than following a description, and style is the hardest thing to pin down in words, so one or two samples are the quickest fix. A keeps piling on adjectives, which is exactly why you're stuck. B and D blame the model or the language, when it's really a matter of how the request is expressed.

5. **[Basic · Scenario]** You want the AI to rewrite a technical explanation for an older relative with no technical background. Which prompt is most likely to nail it in one pass? <!-- quiz: q05 revision: 1 -->
   - A. "Rewrite this technical explanation in a rigorous, expert tone, keep every term, and make it sound authoritative. Original: ..."
   - B. "Make it one paragraph of about 150 words for an older relative, no jargon, with everyday comparisons for hard parts. Original: ..."
   - C. "This explanation isn't great. Please really improve it and make it easier to read, smoother, and better organized. Original: ..."
   - D. "You are a senior technical expert. Think carefully, then rewrite the explanation below and make it absolutely perfect. Original: ..."
   > **Answer: B.** It spells out the audience (an older relative), length (about 150 words), constraints (no jargon, everyday comparisons), and format (one paragraph), so the critical "constraints" and "format" are both there. A gets the tone and audience backwards. C just says "polish" at greater length and still doesn't say how long or for whom. D leans on a role and "absolutely perfect" but gives none of the key constraints or format.

6. **[Basic · Hands-on]** Take a vague instruction you'd normally fire off ("summarize this for me," "write a notice") and fill it out using "context, task, constraints, format, success criteria," especially adding **length, audience, tone, and the format you want**. Ask once with each version, before and after, and compare results. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** The filled-out version usually has a clearly higher hit rate and clearly less back-and-forth. The difference isn't that the model got smarter; it's that you turned the requirements you'd taken for granted into text it can see. Compare them yourself once and you've got the craft of spelling things out. Next time you're stuck, look back first: length, audience, tone, format, did I say those four?
