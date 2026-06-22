So far, your relationship with the AI is probably like this: you ask one thing, it answers; not happy, you add a line, it revises. This is "one question, one answer," good enough for small tasks.

But real work often can't be said in one sentence. "Turn this messy meeting record into notes for my boss", there are several steps hidden in there: first understand what the record says, then figure out which points the boss cares about, then write it, and finally check yourself for anything missed. If you have to hand-hold every step with "now do the next step," you've really just turned yourself into its "conveyor belt."

This chapter is about how to get AI to **move forward several steps on its own toward a goal**, instead of taking one step and stopping to wait for you to feed it. This sounds mystical but has a method. It's also the underlying idea behind those Part Four (AI coding) tools that "edit code and run tests on their own": **turn a big task into a flow it can push forward by itself.**

## 1. Why "one question, one answer" isn't enough

First see clearly where one-question-one-answer gets stuck.

| What one-question-one-answer looks like | The sticking point |
| --- | --- |
| You say a step, it does a step | You become the "human dispatcher," can't leave the whole time |
| It doesn't look back when done | Errors go unchecked, it won't fix what you don't flag |
| You don't give the full picture, it sees only what's in front | It doesn't know "what's ultimately wanted," easy to drift |

The root of the problem: the model itself **only continues with the next sentence** (the "continuing" mechanism from Chapter 4). It has no built-in "project manager" awareness, won't keep "what steps this big thing still needs" in mind on its own.

So "having it push forward" isn't an innate ability; it's **you lending it the "project manager's brain" with a set of phrasing.** A metaphor: you're not nagging a worker, you're briefing a **capable new assistant** on a full workflow, having him run it on his own, and stopping to ask you where he should check in.

> **Key point:** "Having the AI move forward on its own" sounds like it got smarter, but really **you thought through the task structure** and handed that structure to it. The smart one isn't it, it's the flow you gave it.

## 2. One all-purpose loop: investigate, plan, execute, check

No matter how big the task, it fits the same loop. Remember these four steps and you have a reusable "workflow skeleton."

```text
        +-------------------------------------+
        |                                     |
        v                                     |
   (1) investigate -> (2) plan -> (3) execute -> (4) check
   (size up         (list the     (do the      (look back
    the situation)   steps)        work)        and verify)
                                        |
                              if it fails, go back and redo
```

One by one:

- **(1) Investigate**: don't rush to act. Have it **read over and restate** the material, requirements, and constraints at hand. For example, "before writing, tell me in three sentences: what's this record's topic, what are the to-dos, and are there any contradictions." This step is to get it (and you) on the same page about "the current state."
- **(2) Plan**: have it **list the steps first, not produce the finished product directly.** "Please list how many steps you plan to write these notes in and what each does, don't write yet." This step is extremely critical, covered separately below.
- **(3) Execute**: once you approve the plan, have it do the work by the plan. "Good, start with steps 1 and 2 as you listed."
- **(4) Check**: when done, have it **self-check against the original requirements.** "Look back, are all three points the boss wanted covered? Any contradictions?" If it doesn't pass, go back to some earlier step with the problem in hand.

> **Key point:** The essence of these four steps is to **pry apart "plan" and "execute."** One-question-one-answer flips over so easily because it **thinks and does at the same time, charging straight to the end**, and you only find the error afterward, too late. Have it lay the plan out for you first, and at the cheapest stage (before any work is done) you can stop the drift.

This echoes a principle that keeps coming up: **have it state clearly how it will do it, then have it do it.** Chapter 27 (look at the plan before acting) covers this "plan mode" in coding in more detail; here you just build the intuition.

## 3. Let it "go on its own," but keep your hand on the brake

When you let AI run several steps in a row, the most unsettling thing is: **what if it goes the wrong way and gets further and further off?** That worry is right. "Auto-forward" and "out of control" are separated by one thin sheet of paper, and that sheet is **thinking ahead about where it should stop and ask you.**

Sort the steps in a task into two kinds:

| Steps it can take on its own | Steps where it must stop and ask you |
| --- | --- |
| Reading material, outlining, formatting, rewording | When it's about to **delete / overwrite** your things |
| Picking one of a few inconsequential small options | When it's about to **send outward** (email, commit, publish) |
| Converting content from one form to another | When it hits a judgment **it's unsure about and needs your call** |
| Finishing a step, reporting, then doing the next | When **money, privacy, or major right-or-wrong consequences** are involved |

The how is simple: **write "stop and ask" into the instruction when you brief the task.**

```text
Please push the notes forward by "investigate -> plan -> execute -> check."
Rules:
- After listing the plan, stop and show me first, wait for me to say "start" before acting.
- Anywhere you're unsure (like who owns a certain to-do), don't guess for me, stop and ask.
- Self-check after writing, then hand it to me, don't send it to anyone for me.
```

This is your "brake." It doesn't restrict its work, it **fences off a safe range**: inside the range it runs free, at the edge it must stop.

> **Key point:** The opposite of "auto-forward" isn't "ask about everything," it's "**definitely stop where you should stop.**" What you do isn't watch its every step, it's **think ahead about which steps are irreversible and have consequences** and mark those as "must stop." This matters especially in AI coding, having it edit code on its own is fine, but irreversible actions like "delete files, commit, deploy" must have a checkpoint (Chapters 26 and 27).

By the way: some products and coding tools provide a mechanism of "ask your permission before each dangerous action," and the behavior differs by vendor, **check the official docs**. But the underlying principle is shared: **set irreversible actions to require your nod.**

## 4. Why you still can't be a hands-off boss

You might think: I gave it the flow and set the brake, so can I let go entirely? **No.** The reason comes back to the model's old problems:

- Its self-check is **not fully trustworthy.** Have it "check for errors" and it may swear up and down "all correct" while actually missing something, because its "check" is still essentially "continuing," not a truly objective pair of eyes (an extension of the hallucination in Chapter 9).
- It will **carry errors down the flow.** If step (1) understood things wrong, the next three steps may build ever more "neatly" on a wrong premise, looking quite presentable while the root is crooked.
- It **doesn't know what you truly care about**, unless you say so. It can write the notes beautifully yet beautifully leave out the one point that matters most to you.

So the right posture is: **it runs the flow, you manage direction and acceptance.** It's responsible for pushing the tedious steps forward, you're responsible for glancing at a few key checkpoints to see "is the direction right, was anything important missed." This is the same as the "**outsource the tedium, keep the judgment for yourself**" said repeatedly in the later work scenarios (Chapter 16).

> **Key point:** Think of it as a new assistant who is **quick at the work but doesn't know your mind and occasionally errs with confidence.** You're willing to let someone like that run the flow on their own, but you'd never skip a look "before it goes out." "Auto-forward" saves your physical effort, **it doesn't save your judgment.**

## 5. A complete example: turning a meeting record into notes

Tie the above together and see what it actually looks like.

```text
You: Here's a messy meeting record (pasted). I want notes for my boss.
   Please go by "investigate -> plan -> execute -> check," with the rules I say below:
   stop and wait for me after listing the plan; don't guess when unsure, ask me;
   self-check after writing, don't send for me.

It: (investigate) This meeting's topic was Q3 scheduling, with 4 to-dos, 2 undetermined
   owners, and 1 time conflict. (plan) I plan three steps: (1) split into three blocks by
   "conclusions / to-dos / risks" (2) fill in the owners and times (3) trim to one page.
   Shall I start?

You: Start. In step (2), don't guess the "undetermined owners" for me, list them and ask.

It: (executing step (2)) Two to-dos have no owner written: A and B, who owns each?

You: A goes to Wang, leave B blank for now.

It: (finished executing, checking) Notes generated. Self-check: all three points the boss
   cares about are there; the time conflict is flagged red as pending; B's owner is left
   blank as you said. Please review.

You: (acceptance) ... (check the key information yourself, then finalize)
```

See it? You said only a few sentences total, but each one landed on a **checkpoint**: brief the flow and the brake at the start, answer its "questions worth asking" midway, do the acceptance yourself at the end. All the physical labor of reading, splitting, organizing, and trimming, it pushed forward on its own. **This is what upgrading from "one question, one answer" to a "workflow" looks like.**

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| "Having it auto-forward" = it got smarter, more autonomous | You thought through the task structure and handed it over by instruction; the smart one is the flow you gave |
| Having it do everything in one go is most efficient | Executing without seeing the plan first most easily builds further on a wrong premise; listing the plan first is cheaper |
| Once the flow and brake are set, you can be fully hands-off | Its self-check is not fully trustworthy and it carries errors down; direction and acceptance must be yours |
| The "brake" means having it ask about everything | The brake sets checkpoints **only at irreversible / consequential steps**; inside the range it still runs free |
| "I checked it, no problem" means you can trust it | Its "check" is still continuing, not a real verification; verify the important things yourself |

## Summary

- One-question-one-answer suits small things; big tasks need upgrading to **a workflow it can push forward on its own**, because the model itself only "continues" and has no innate project-manager awareness.
- The all-purpose skeleton is the loop **investigate, plan, execute, check**, and the essence is to **pry apart "plan" and "execute"**: see the plan, then act.
- Let it go on its own, but **keep your hand on the brake**, think ahead about which steps are irreversible / consequential and set them as "must stop and ask you."
- **You can't be a hands-off boss**: its self-check is not fully trustworthy, it carries errors down, it doesn't know what you truly care about. It runs the flow, you manage direction and acceptance.
- This approach is the underlying logic of Part Four's AI coding (Chapters 23 to 30): let it work on its own, but set irreversible actions to require your nod.

In the next chapter, we turn to a scenario that's both especially well-suited and especially dangerous: using AI to learn and look things up.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most core design intent of this chapter's "investigate, plan, execute, check" loop?
   - A. Make the AI work faster
   - B. Pry apart "plan" and "execute" so you can stop the drift before any work is done
   - C. Make the AI need no human involvement
   - D. Add conversation turns to spend more tokens
   > **Answer: B.** One-question-one-answer flips over most easily because it thinks and does at once, charging to the end, and you only find the error afterward. Have it lay the plan out for you first and you can correct course at the cheapest stage, "before any work is done." A mistakes the means for the end; C is the opposite, this flow stresses that the human manages direction and acceptance; D is a misconception.

2. **[Basic · Concept]** Why won't the model "on its own initiative" push a big task all the way through?
   - A. Because it's lazy
   - B. Because it essentially only "continues with the next sentence" and has no innate project-manager awareness
   - C. Because it lacks compute
   - D. Because it's deliberately waiting for you to pay
   > **Answer: B.** The model's underlying mechanism is "predicting the next token" (Chapter 4), and it won't come with a global awareness of "what steps this big thing still needs." So-called "having it auto-forward" is you handing it the task structure with a set of instructions. A and D anthropomorphize it; C is unrelated.

3. **[Advanced · Misconception]** "I set up the flow and the brake for it, so now I can be completely hands-off." What's wrong with this thought?
   - A. Nothing, once the flow is set it's fully automatic
   - B. Its self-check is not fully trustworthy and it carries early misunderstandings all the way down; direction and acceptance must still be yours
   - C. The mistake is that you shouldn't have set a brake
   - D. The mistake is the flow should be longer
   > **Answer: B.** This mistakes "saving physical effort" for "saving judgment." Its "check" is still essentially continuing, it may swear "all correct" yet miss something; and if step one understood wrong, it builds ever more neatly on a wrong premise. Setting the flow saves the effort of nagging it, **it doesn't save your managing direction and doing acceptance.** Whoever makes this mistake is often fooled by its neat output.

4. **[Advanced · Misconception]** It finishes a task and volunteers, "I've already checked it, no problem." What should you do?
   - A. Great, adopt it directly
   - B. Re-verify the key information (numbers, names, conclusions) yourself, you can't rely solely on it saying "checked"
   - C. Have it check ten more times and it'll definitely be right
   - D. If it says no problem it's definitely no problem, it's more careful than people
   > **Answer: B.** Its "check" is still "continuing," not a real objective pair of eyes verifying, so its self-endorsement can't be taken as a guarantee (an extension of the hallucination in Chapter 9). A and D overtrust it; C mistakenly thinks "repeated checking" can conjure objectivity out of nothing, the same brain that fabricates may miss the same spot all ten times.

5. **[Basic · Scenario]** You have the AI organize a batch of customer data by workflow. Which step **most** should be set as "must stop and ask you"?
   - A. Sorting the data by date
   - B. Standardizing the table's font and format
   - C. Directly deleting a few customer records it deems "redundant"
   - D. Reorganizing the content from a table into a paragraph of text
   > **Answer: C.** Deletion is an **irreversible** action with major consequences, exactly where a checkpoint and your nod are required. A, B, and D are all low-risk organizing it can run on its own within range. The test for "must stop" vs "run free" is: is this step **reversible? Does it have consequences?**

6. **[Basic · Hands-on]** Pick a small task on hand that takes several steps to finish (such as turning a pile of messy notes into an outline) and write the AI an instruction the way this chapter shows: ask it to push forward by "investigate -> plan -> execute -> check," and explicitly require **stop and wait for you after listing the plan**, **don't guess when unsure, ask you**, and **self-check after finishing, don't send directly**. Then actually run it once and observe which step it stops at.
   > **What you should notice:** When you write "stop and show the plan first," "ask when unsure," and "self-check when done" into the instruction, it does stop at these checkpoints instead of charging to the end, which shows that "auto-forward" and "stop when you should" are **things you design by instruction**, not its nature. Run it once by hand and you'll get a real feel for "my hand on the brake, it runs free," and lay the groundwork for having AI edit code in Part Four.
