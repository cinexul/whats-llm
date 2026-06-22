Have you noticed that asking it the same question twice often gets you answers that **aren't quite the same**? Sometimes word for word, sometimes with different wording, different examples, even a different angle on the conclusion. A lot of people's first reaction is "something's wrong with it." Actually nothing is; this is by design.

When the model generates an answer, a few "knobs" are at work behind the scenes. This chapter covers only the two you most need to know: **temperature**, which explains "same question, different answer"; and **reasoning effort** (also called extended thinking), which decides whether it "blurts things out" or "drafts first, then answers." Know these two knobs and you go from "passively accepting whatever it answers" to "knowing when to make it steadier, when to let it loosen up, and when to make it think more."

## 1. A one-second recap: it "picks" the next word

To understand temperature, first pick up the thread from Chapter 4.

Each time the model generates a word, it doesn't directly "come up with" one single answer. It first computes a probability for a whole pile of candidate words (that "probability table" from Chapter 4), for example:

```text
"The weather today is really" --> candidates for the next word (illustrative):
   nice      72%
   not bad   15%
   awful     6%
   great     4%
   …
```

Then it **picks one** from this table to output. **How it picks** is what temperature governs.

## 2. Knob one: temperature, steady or loose

**Temperature** controls "**how willing it is to pick a long shot**" when it picks a word.

- **Low temperature**: it almost always picks the highest-probability one ("nice" in the example above). The result is **steady and predictable**; ask the same question many times and the answers are nearly identical. Like reading from a script.
- **High temperature**: it's more willing to pick words that aren't quite as probable ("not bad," "great," even rarer ones). The result is **wide-ranging and creative, but also more likely to wander**. Like improvising.

An analogy:

| Temperature | Like | Upside | Cost |
| --- | --- | --- | --- |
| Low | A host **reading from a script** | Stable, reproducible, hard to derail | Even-keeled, few surprises |
| High | An actor **improvising** | Creative, varied, never the same twice | May go off topic, may run wild |

> **Key point:** This is the real reason "the same question gives a different answer every time." As long as temperature isn't pushed to the very bottom, there's **randomness** every time it picks a word from the probability table, so the result naturally changes. This is a **normal, by-design** feature, not a malfunction. So "it got it right last time" also **doesn't guarantee "it's right this time."** For important output, verify every time yourself.

When should you turn it which way? A plain rule of thumb:

- **Want stability, reproducibility, want it to follow orders faithfully** (extracting information, outputting in a fixed format, rigorous Q&A) → lean toward **lower**.
- **Want range, want inspiration, want a few different versions** (naming, brainstorming, writing copy in different styles) → lean toward **higher**.

## 3. Knob two: reasoning effort, blurt it out or draft first

The second knob governs something else: before giving an answer, **how long it's willing to "think" first**.

**Reasoning effort, also called extended thinking**: have the model, before formally answering, take a few more steps internally and **draft out its thinking**, then give the final answer based on that. The cost is **slower and more expensive** (that extra "thinking" also counts toward compute and tokens), and the payoff is **more reliable answers on hard problems**.

A particularly fitting analogy:

| Reasoning effort | Like a person who | Suits |
| --- | --- | --- |
| Low (answer directly) | **Blurts it out**, opening their mouth the instant you finish asking | Simple, direct questions |
| High (think more) | **Works through a few steps on scratch paper first, then speaks** | Math, logic, multi-step problems, hard ones needing case-by-case analysis |

> **Key point:** Reasoning effort and temperature are **two different knobs, don't mix them up**. Temperature governs "how daring it is in picking words" (steady vs. loose); reasoning effort governs "how much it's willing to think before answering" (fast vs. accurate). For a complex logic problem, you might want both **steady** (temperature not too high) and **more steps of thought** (high reasoning effort), and the two knobs can be set separately.

When is it worth turning up reasoning effort?

- For **hard problems**: math, reasoning, planning, conclusions that take several steps to reach, having it "think more" often buys a clearly better answer.
- But **don't force it on simple ones**: turning on "deep thinking" to give a date or fix a typo is just wasting time and money slowly, using a sledgehammer to crack a nut (this also echoes Chapter 3's point that "the fuller the table, the slower and more expensive").

(If you want it to write out its reasoning even in **ordinary** mode and so answer more accurately, Chapter 11 covers a prompting trick called "have it think step by step." That uses "talking" to coax more thinking out of it, a different route from the product-level "reasoning effort" knob here, and the two can work together.)

## 4. A key reminder: the knobs look different across products

These two knobs are very important, but one thing has to be made clear, or you'll come up empty looking for them by the book:

> **Their names, locations, and even whether they can be adjusted at all differ across products.** Some products **hide** parameters like temperature and only let you set them in the developer-facing API (Chapter 17); some turn "reasoning effort" into a clickable option in the interface, under all sorts of names ("deep thinking," "think longer," "extended thinking," and so on), and some decide for you automatically. **Exactly how to adjust them, where, and whether you even can, all check the official docs.** This book doesn't pin it down, because anything pinned down would soon be out of date.

What you really want to take away is the **underlying intuition**: no matter where a product hides the button or what name it gives it, behind it is nothing more than these two things, "**do I want it steadier or looser this time (temperature)**" and "**do I want it to blurt it out or think a few steps first this time (reasoning effort)**." Understand these two things and you can slot any related option in any product into place instantly.

## 5. The misconceptions most worth clearing up

**Misconception one: same question, different answer = malfunction.**

No. As said above, that's **normal randomness** from temperature, a by-design feature. The real response isn't to "fix it," it's: for stability, turn the relevant settings toward "steady" (if you can) and pin your requirements down in the prompt; if variety is exactly what you want, then it being different every time is right where you want it.

**Misconception two: the higher the temperature, the smarter it is.**

Also no. Temperature only changes "**how daring it is in picking long-shot words**," and **has nothing to do with right or wrong**. Turning it up just makes it more wide-ranging and varied, **never more accurate**. The opposite, really: too high and it's more likely to wander and run wild. To make it more accurate, what you should touch is **reasoning effort** (have it think more) and **prompt quality** (Chapter 11), not cranking temperature up.

**Misconception three: max out reasoning effort and the answer is sure to be right.**

Still no. "Thinking a few more steps" can clearly raise the success rate on **complex reasoning**, but **doesn't guarantee correctness**. It can still go wrong at some step and still produce the "hallucination" of Chapter 9. And maxing out reasoning on a simple task just wastes time and money for nothing. So: turn it up only for hard problems, and even then still double-check.

| | What it governs | Turning it up ≠ |
| --- | --- | --- |
| Temperature | Whether word picks are steady or loose | Turning it up ≠ smarter, more accurate |
| Reasoning effort | Whether it thinks long before answering | Maxing out ≠ sure to be right, and shouldn't be used on simple problems |

## 6. Common misconceptions, set straight

| Common misconception | Reality |
| --- | --- |
| Same question, different answer every time, means it's broken | This is normal randomness from **temperature**, by design; for stability turn it down / pin requirements, for variety use it as is |
| The higher the temperature the smarter | Temperature only governs "how daring it is with long-shot words," **nothing to do with right or wrong**; too high wanders more. For accuracy, adjust reasoning effort and the prompt |
| Temperature and reasoning effort are the same thing | Two knobs: temperature governs "steady vs. loose," reasoning effort governs "fast vs. accurate (how long it thinks)," set separately |
| Max out reasoning effort and it's foolproof | It only raises the success rate on complex reasoning, **doesn't guarantee correctness**, still hallucinates; maxing out on simple problems is just slow and expensive |
| The book will tell me exactly where to adjust and what to set | Names, locations, and whether they're adjustable differ across products and change often, so check the official docs; what to remember is the two things behind them |

## Summary

- **Temperature**: controls how daring it is in picking words, "willing to pick long shots" or not. Low = steady, predictable (reading from a script); high = wide-ranging, creative but prone to wander (improvising). This is the reason for **"same question, different answer,"** a normal feature, not a malfunction.
- **Reasoning effort / extended thinking**: have it think a few more steps before answering for a more reliable result, at the cost of being slower and more expensive. Turn it up for hard problems, don't waste it on simple ones. Blurting it out vs. drafting first.
- Don't mix the two knobs: one governs steadiness (temperature), one governs how long it thinks (reasoning effort), and they can be set separately.
- Turning up temperature ≠ smarter; maxing out reasoning ≠ sure to be right. **Neither replaces your own double-check** (Chapter 9).
- Each product's names, locations, and adjustability **differ and change often, so check the official docs**; what you take away is the intuition for the two things behind them.

In the next chapter we'll fully work through "why it says wrong things and why it can't remember": hallucination, knowledge, and memory.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What does the "temperature" knob control?
   - A. How hot the machine runs while the model is going
   - B. "How daring it is in picking a long shot" for the next word, low = steady, high = wide-ranging
   - C. How fast it answers
   - D. How long it remembers you
   > **Answer: B.** Temperature tunes the randomness of word picking: low = almost always picks the highest-probability one (steady), high = more willing to pick long-shot words (wide-ranging and creative but prone to wander). A reads the word literally; C is closer to the fast/slow that "reasoning effort" brings; D confuses it with memory / context (Chapters 3 and 9).

2. **[Basic · Concept]** Which statement about "reasoning effort / extended thinking" is correct?
   - A. It and temperature are two names for the same knob
   - B. It has the model take a few more steps and draft its thinking before answering, for a more reliable answer, at the cost of being slower and more expensive
   - C. Turn it on and it'll never err
   - D. It's only useful for simple questions
   > **Answer: B.** Reasoning effort governs "how long it thinks before answering" (blurt it out vs. draft first), suited to hard problems. A is a common mix-up, since it and temperature are two different knobs; C overstates it (it still errs, still hallucinates); D has it backwards, using it on simple problems is just waste.

3. **[Advanced · Misconception]** "I asked the same question twice and got different answers, is this AI broken?" What's wrong?
   - A. Nothing, it's definitely broken
   - B. This is normal randomness from temperature, a by-design feature; for stability turn it down / pin requirements, for variety it's right where you want it
   - C. It's because it forgot you
   - D. It's caused by network fluctuations
   > **Answer: B.** As long as temperature isn't pushed to the very bottom, there's randomness every time it picks a word, so the result naturally changes, a feature not a malfunction. Precisely because of this, "right last time" doesn't guarantee "right this time," so verify important output every time. C and D are mismatched and have nothing to do with the randomness.

4. **[Advanced · Misconception]** "Turn temperature to the max and it'll get smartest and answer most accurately." What's wrong?
   - A. Completely correct
   - B. Temperature only changes "how daring it is with long-shot words," nothing to do with right or wrong; too high makes it wander and run wild more. For accuracy, adjust reasoning effort and the prompt
   - C. The higher the temperature, the cheaper
   - D. The higher the temperature, the faster it answers
   > **Answer: B.** This is one of the most common misconceptions, mistaking "wide-ranging" for "smart." High temperature only means varied and never the same, never more accurate, and too high makes it more likely to go off the rails. For accuracy, adjust "reasoning effort" (have it think more) and prompt quality (Chapter 11).

5. **[Basic · Scenario]** You need it to extract a batch of customer information **by fixed fields, neatly**, ideally with consistent results every time for easy checking. Which way should the two knobs lean?
   - A. Temperature to the max, reasoning effort off
   - B. Temperature leaning low (for steadiness and reproducibility), reasoning effort set by difficulty (no need for high if the fields are simple), and pin the format requirements in the prompt
   - C. Both maxed out
   - D. Whatever, it's all the same
   > **Answer: B.** "Want stability, reproducibility, faithful following" is exactly the typical scenario for turning temperature down; an extraction task isn't complex, so reasoning effort needn't be maxed (maxing it is just slower and more expensive); pin the field format down and the result is neatest. A is exactly backwards (high temperature makes results waver and hard to check); C is wasteful and unnecessary.

6. **[Basic · Hands-on]** Pick an AI tool you use often, first flip through its settings/help to see whether it has a "temperature"-type parameter and whether it has a "deep thinking / extended thinking"-type switch (**check the official docs**). Then take the same question and ask it three times in a row to see if the answer changes; if you can turn on "deep thinking," try a hard problem with and without it once each and compare the difference.
   > **What you should notice:** Many general-audience products **don't let you adjust temperature directly** (it's hidden on the API side), but often have some "deep thinking" switch under various names, which confirms the chapter's line that "names, locations, and adjustability differ across companies, check the official docs." Asking the same question three times will mostly differ slightly each time (randomness from temperature); turning on "deep thinking" for a hard problem is often more reliable but slower. Try it once yourself and these two knobs go from abstract to concrete.
