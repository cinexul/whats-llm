Chapter 10 compared it to a "well-read intern who also makes things up." This chapter tackles that intern's biggest weakness: it can't read your mind.

As Chapter 4 explained, its basic job is to continue text, producing the most plausible continuation of whatever opening you give it. So when you say "polish this for me," what you get back often isn't the version you had in mind. It isn't being dense; whatever you didn't say, it can only guess, and its guess is "what most people usually want when they say this," which may not be you.

The good news is that stating what you want clearly is a learnable skill, and not a hard one. The skill is called writing a **prompt**.

## 1. A comparison first: why "polish this for me" doesn't work

Suppose you have this passage to send to parents:

```text
Original: "Regarding this Friday's parent meeting, please arrive at the third-floor
           conference room at 3 p.m. sharp. The meeting is expected to run an hour and
           a half. Please arrange your time in advance, thank you for cooperating."
```

Way one, vague:

```text
"Polish this for me."
```

It hands back a "polished" text, but what should it become? More formal or warmer, longer or shorter, and for whom? It's all guesswork. You'll most likely go back and forth with "not quite," "shorter," "more casual."

Way two, spelled out:

```text
"Rewrite the notice below to about 100 words, casual and warm in tone, for parents.
 Open with a greeting, and keep the two key details 'Friday 3 p.m.' and 'third-floor
 conference room.'

 Original: ... (pasted)"
```

This version gets you what you wanted almost on the first try. The model didn't get smarter; you turned the requirements that "go without saying" in your head into text it can see. "Polish" comes with a concrete picture in your head: how long, what tone, for whom, what to keep. If that picture never becomes words, the model can't see it. The whole craft of prompting comes down to one thing: honestly write out the requirements you've been taking for granted.

## 2. One all-purpose framework: context, task, constraints, format, success criteria

There are no magic spells or secret phrasings. Break down any clear request and you get these five parts. You don't need all five every time, but running through them in your head makes it hard to leave out anything important.

| Part | The question it answers | Example |
| --- | --- | --- |
| Context | What's going on? For whom? | "This is a notice for parents of elementary schoolers" |
| Task | What exactly do you want it to do? | "Rewrite this notice" |
| Constraints | What limits and requirements are there? | "About 100 words, casual, warm, keep the time and place" |
| Format | What kind of finished product do you want? | "Give me the whole rewritten text directly," "List it as 3 points," "Make a table" |
| Success criteria | What counts as done well? | "Parents can understand it at a glance, and it reads naturally" |

Look back at way two from the previous section and all five are there. A good prompt is simply one that states these five clearly.

```text
One-line template (use what you need, not all of it):

  [context] + [the task you want done] + [the constraints to meet] + [the format of the result] + [what counts as success]
```

Of the five, the ones most often forgotten, and most important, are constraints and format. Most people state the task clearly ("write me a summary") but leave how long, for whom, what tone, and how many points or one paragraph in their heads, and get something that's "right, but not what I wanted." Next time you're stuck, ask yourself: length, audience, tone, what the result looks like; did I say all four?

## 3. Make "constraints" specific: the more specific, the less work

Many people worry that being too detailed will cramp its creativity. For everyday tasks it's the opposite: the more specific the constraints, the less rework. Save "creativity" for open tasks like brainstorming, where giving just a general direction really is fine.

Here are the dimensions most worth spelling out, vague versus specific:

| Dimension | Vague (it has to guess) | Specific (it can just do it) |
| --- | --- | --- |
| Length | "Shorter" | "Keep it under 200 words," "No more than 3 sentences" |
| Audience | "Make it easier to understand" | "Write it for an older relative with no technical background" |
| Tone | "More formal" | "Written, restrained, no exclamation marks" |
| Angle, focus | "Summarize it" | "Summarize only the parts about the refund policy" |
| What to keep or avoid | (not said) | "Keep these three numbers," "No technical jargon" |
| Format | "Tidy it up" | "5 points with subheadings," "A two-column table" |

Spelling out constraints is really about saving yourself work: every constraint you add means one fewer round of "no, try again." Length and format shape the result most, yet they're left out most often. Make a habit of adding "give me so many words, in such a format" after the task, and your hit rate changes noticeably.

## 4. One example beats a long explanation

Another trick works especially well: rather than struggling to describe the style you want, show it an example.

People and models are alike here: copying a sample is easier than following a description. Want a certain format or tone? Give it one or two samples and it can imitate them:

```text
"Following the format below, write one line for each of these three items:

 Sample:
 [Title] Friday parent meeting
 [Time] June 26, 3:00 p.m.
 [One line] Please be on time at the third-floor conference room, about 90 minutes.

 Now do these three items: ..."
```

It sees right away that you want the "[Title] [Time] [One line]" mold and fills it in. That's far more efficient than explaining in words that you want "a format with a title, a time, and a one-line summary."

When nothing you say gets the feel right, it's usually a style requirement, and style is the hardest thing to pin down in words. Stop piling on adjectives and paste a sample you're happy with: "do it with this feel, in this format." Also, as Chapter 4 explained, its word choice involves some randomness, so the same clear prompt, regenerated, may produce a better version. State it clearly first, then re-roll now and then; the two work best together.

## 5. Clear doesn't mean long: getting the balance right

Don't swing to the other extreme, either. Being clear means including all the key information, with no need for filler. A long, cluttered prompt stuffed with irrelevant background actually buries the point (as Chapter 3 explained, irrelevant content gets in its way).

To get the balance right, remember three things:

- Don't leave out what matters: the task, the key constraints (length, audience, tone, format), and what to keep or avoid.
- Don't stuff in what doesn't: background unrelated to this task, pleasantries, repeated reminders. The less the better.
- Break complex tasks into steps: rather than one block of "first A, then B, then C, finally D," have it do A, take a look, then have it do B (Chapter 14 picks this up).

What makes a prompt good is having the key information and little filler, not its length: make it clear at a glance what to do, what to satisfy, and what kind of result to deliver.

## 6. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| "Polish this" or "tidy this up" should tell it what I want | It can't read your mind; length, audience, tone, and format it can only guess if you don't say (Chapter 4) |
| Prompts need special "spells" or fixed phrasings | No spells needed; state the context, task, constraints, format, and success criteria in plain words |
| Being too specific cramps its creativity | For everyday tasks, more specific constraints mean less rework; save "creativity" for open tasks like brainstorming |
| Style has to be described with lots of adjectives | Show it an example to imitate; that's far more efficient than describing it |
| The longer the prompt, the better | What counts is having the key information with little filler; irrelevant background buries the point (Chapter 3) |
| If a prompt doesn't work, the model isn't capable enough | Usually the requirements weren't clear; adding the missing constraints often fixes it right away |

## Summary

- It can't read your mind: whatever you don't spell out, it can only guess at "what most people usually want" (Chapter 4). "Polish this for me" fails because the picture of length, audience, tone, and format never became words.
- The all-purpose framework has five parts: context, task, constraints, format, and success criteria. You don't need all of them every time, but running through them keeps you from missing anything important.
- The parts most often forgotten, and most important, are constraints and format. After writing the task, add "give me so many words, in such a format."
- For style requirements, show an example to imitate; regenerating now and then helps too.
- Clear doesn't mean long: include the key information, cut the filler, and break complex tasks into steps (Chapter 14).

The next chapter applies this skill to a common situation: handing it a long document and having it answer strictly from that material, that is, handling long texts and summarizing material.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** Why does "polish this for me" often not work? <!-- quiz: q01 revision: 2 -->
   - A. "Polish" is too casual; it only responds to formal, precise commands
   - B. Your unstated length, tone, and audience leave it guessing
   - C. The sentence is too short, so the model can't give it enough attention
   - D. Polishing is a subjective judgment, which models are simply bad at
   > **Answer: B.** It can only continue from what you actually wrote (Chapter 4). The unstated requirements behind "polish" get filled in with a guess at what most people usually want, which may not be what you want. A assumes it needs special commands; plain language works fine. C blames the length, but a short sentence can still be clear. D is wrong: polishing is one of its strengths. What's missing is your requirements.

2. **[Basic · Concept]** Which five blocks make up the "all-purpose framework" in this chapter? <!-- quiz: q02 revision: 2 -->
   - A. Context, task, constraints, format, success criteria
   - B. Role, tone, length, layout, reference examples
   - C. Goal, work steps, tools needed, deadline, owner
   - D. Question, material, requirements, examples, regenerate
   > **Answer: A.** Context, task, constraints, format, success criteria. You don't have to write them all every time, but running through them in your head keeps you from missing what matters, especially the often-forgotten "constraints" and "format." In B, tone and length are really part of "constraints," and examples are a separate trick from section 4. D mixes a few tips in with the framework. C is more like a project plan.

3. **[Advanced · Misconception]** Someone says: "The more specific a prompt, the more it limits the AI's play, so you should be vague and let it run free." What's the problem here? <!-- quiz: q03 revision: 2 -->
   - A. The idea is right; just regenerate a few times to make up for vagueness
   - B. Specific constraints matter only for long texts; short asks can be vague
   - C. The real problem is that specific prompts use more tokens and cost more
   - D. For everyday tasks like rewriting and summarizing, specifics cut rework
   > **Answer: D.** Everyday tasks want "right, and the version I wanted," so spelling out constraints saves rework. Only open tasks like brainstorming suit a rough direction and free rein. A relies on luck; regenerating helps after you've been clear. B is wrong: short asks still need length, audience, and format. C's few saved tokens are nothing next to the cost of repeated rework.

4. **[Advanced · Misconception]** You want a certain layout style, you keep describing it in words, and it never feels right. Which approach is most likely to work? <!-- quiz: q04 revision: 2 -->
   - A. Add more and finer adjectives until the description is precise enough
   - B. Switch to a stronger model, since style depends on the model's ability
   - C. Paste in a sample you're happy with and have it follow that sample
   - D. Rewrite the whole prompt in another language the model handles better
   > **Answer: C.** Copying a sample is easier than following a description, and style is the hardest thing to pin down in words, so one or two samples are the quickest fix. A keeps piling on adjectives, which is exactly why you're stuck. B and D blame the model or the language, when it's really a matter of how the request is expressed.

5. **[Basic · Scenario]** You want the AI to rewrite a technical explanation for an older relative with no technical background. Which prompt is most likely to nail it in one pass? <!-- quiz: q05 revision: 2 -->
   - A. "Rewrite this technical explanation in a rigorous, expert tone, keep every term, and make it sound authoritative. Original: ..."
   - B. "Make it one paragraph of about 150 words for an older relative, no jargon, with everyday comparisons for hard parts. Original: ..."
   - C. "This explanation isn't great. Please really improve it and make it easier to read, smoother, and better organized. Original: ..."
   - D. "You are a senior technical expert. Think carefully, then rewrite the explanation below and make it absolutely perfect. Original: ..."
   > **Answer: B.** It spells out the audience (an older relative), length (about 150 words), constraints (no jargon, everyday comparisons), and format (one paragraph), so the critical "constraints" and "format" are both there. A gets the tone and audience backwards. C just says "polish" at greater length and still doesn't say how long or for whom. D leans on a role and "absolutely perfect" but gives none of the key constraints or format.

6. **[Basic · Hands-on]** Take a vague instruction you'd normally fire off ("summarize this for me," "write a notice") and fill it out using "context, task, constraints, format, success criteria," especially adding **length, audience, tone, and the format you want**. Ask once with each version, before and after, and compare results. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** The filled-out version usually has a clearly higher hit rate and clearly less back-and-forth. The difference isn't that the model got smarter; it's that you turned the requirements you'd taken for granted into text it can see. Compare them yourself once and you've got the craft of spelling things out. Next time you're stuck, look back first: length, audience, tone, format, did I say those four?
