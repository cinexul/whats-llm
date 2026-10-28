So far, your relationship with the AI is probably like this: you ask one thing, it answers; not happy, you add a line, it revises. This is "one question, one answer," good enough for small tasks.

But real work often can't be said in one sentence. "Turn this messy meeting record into notes for my boss" — there are several steps hidden in there: first understand what the record says, then figure out which points the boss cares about, then write it, and finally check yourself for anything missed. If you have to hand-hold every step with "now do the next step," you've really just turned yourself into its "conveyor belt."

This chapter is about how to get AI to **move forward several steps on its own toward a goal**, instead of taking one step and stopping to wait for you to feed it. This sounds mystical but has a method. It's also the idea behind those Part Four (AI coding) tools that "edit code and run tests on their own": **turn a big task into a flow that can be pushed forward step by step.**

## 1. Why "one question, one answer" isn't enough

First see clearly where one-question-one-answer gets stuck.

| What one-question-one-answer looks like | The sticking point |
| --- | --- |
| You say a step, it does a step | You become the "human dispatcher," can't leave the whole time |
| It doesn't look back when done | Errors go unchecked, it won't fix what you don't flag |
| You don't give the full picture, it sees only what's in front | It doesn't know "what's ultimately wanted," easy to drift |

The problem lies in the chat format itself. In a chat window, it stops after each reply and waits for your next message. If you don't say anything, it won't carry on by itself, and it won't look back to take stock of what steps the bigger job still needs.

Products that can carry on for several steps do exist. Agent products wrap a loop around the model and give it tools such as reading files, searching, and running programs, so it can take a step, look at the result, and decide the next one (Chapter 19). Current models are also trained specifically for this kind of multi-step work. An ordinary chat doesn't have that outer layer, but you can simulate the loop with a workflow prompt: lay out the structure of the task, have it work through the steps, and have it stop wherever it should check with you.

A metaphor: you're not nagging a worker; you're briefing a **capable new assistant** on a full workflow, having him run it on his own and stop to ask you where he should check in.

> **Key point:** Getting the AI to "move forward on its own" in a chat depends on you thinking the task structure through first and writing it into the instructions. The clearer the flow, the steadier its progress.

## 2. One all-purpose loop: investigate → plan → act → sign off

No matter how big the task, it fits the same loop. Remember these four steps and you have a reusable "workflow skeleton." Chapter 24 uses this same loop for coding.

```text
        ┌──────────────────────────────────────────────────┐
        │                                                  │
        ▼                                                  │
   ① investigate ──→ ② plan ──→ ③ act ──→ ④ sign off ──┘
   (size up the       (list the   (work to   (look back
    situation)         steps)      the plan)  and verify)
                                                   │
                                     if it fails, go back and redo
```

One by one:

- **① Investigate**: don't rush to act. Have it **read over and restate** the material, requirements, and constraints at hand. For example, "before writing, tell me in three sentences: what's this record's topic, what are the to-dos, and are there any contradictions." This step is to get it (and you) on the same page about "the current state."
- **② Plan**: have it **list the steps first, not produce the finished product directly.** "Please list how many steps you plan to write these notes in and what each does, don't write yet." This step is extremely critical, covered separately below.
- **③ Act**: once you approve the plan, have it do the work by the plan. "Good, start with steps 1 and 2 as you listed."
- **④ Sign off**: when it's done, first have it **self-check against the original requirements** ("Look back, are all three points the boss wanted covered? Any contradictions?"), then review it yourself. If it doesn't pass, go back to some earlier step with the problem in hand.

> **Key point:** The essence of these four steps is to **separate "plan" from "act."** One-question-one-answer goes off the rails so easily because it thinks and does at the same time, charging straight to the end, and you only find the error afterward, too late. Have it lay the plan out for you first, and at the cheapest stage (before any work is done) you can stop the drift.

Have it state clearly how it will do it, then have it do it: that principle keeps coming up. Chapter 27 (look at the plan before acting) covers this "plan mode" in coding in more detail; here you just build the intuition.

## 3. Let it "go on its own," but keep your hand on the brake

When you let AI run several steps in a row, the most unsettling thing is: **what if it goes the wrong way and gets further and further off?** That worry is right. A thin line separates "auto-forward" from "out of control," and that line is **thinking ahead about where it should stop and ask you.**

Sort the steps in a task into two kinds:

| Steps it can take on its own | Steps where it must stop and ask you |
| --- | --- |
| Reading material, outlining, formatting, rewording | When it's about to **delete / overwrite** your things |
| Picking one of a few inconsequential small options | When it's about to **send outward** (email, commit, publish) |
| Converting content from one form to another | When it hits a judgment **it's unsure about and needs your call** |
| Finishing a step, reporting, then doing the next | When **money, privacy, or major right-or-wrong consequences** are involved |

The how is simple: **write "stop and ask" into the instruction when you brief the task.**

```text
Please push the notes forward by "investigate → plan → act → sign off."
Rules:
- After listing the plan, stop and show me first, wait for me to say "start" before acting.
- Anywhere you're unsure (like who owns a certain to-do), don't guess for me, stop and ask.
- Self-check after writing, then hand it to me, don't send it to anyone for me.
```

This is your "brake." It doesn't restrict its work; it **fences off a safe range**: inside the range it runs free, at the edge it must stop.

> **Key point:** The opposite of "auto-forward" isn't "ask about everything," it's "definitely stop where you should stop." What you do isn't watch its every step; it's **think ahead about which steps are irreversible and have consequences** and mark those as "must stop." This matters especially in AI coding: having it edit code on its own is fine, but irreversible actions like deleting files, committing, and deploying must have a checkpoint (Chapters 26 and 27).

By the way: some products and coding tools provide a mechanism of "ask your permission before each dangerous action," and the behavior differs by vendor, so **refer to the provider's official documentation**. But the underlying principle is shared: **set irreversible actions to require your sign-off.**

## 4. Why you still can't be a hands-off boss

You might think: I gave it the flow and set the brake, so can I let go entirely? **No.** The reason comes back to the model's old problems:

- Its self-check is **not fully trustworthy.** Have it "check for errors" and it may swear up and down "all correct" while actually missing something. Its "check" is text generated by the same model, not an independent pair of eyes (an extension of the hallucination in Chapter 9).
- It will **carry errors down the flow.** If step (1) understood things wrong, the next three steps may build ever more "neatly" on a wrong premise, looking quite presentable while the root is crooked.
- It **doesn't know what you truly care about**, unless you say so. It can write the notes beautifully yet beautifully leave out the one point that matters most to you.

So the right posture is: **it runs the flow, you manage direction and sign-off.** It's responsible for pushing the tedious steps forward; you're responsible for glancing at a few key checkpoints to see "is the direction right, was anything important missed." This is the same idea as "outsource the tedium, keep the judgment for yourself" in the later work scenarios (Chapter 16).

> **Key point:** Think of it as a new assistant who is quick at the work but doesn't know your mind and occasionally errs with confidence. You're willing to let someone like that run the flow on their own, but you wouldn't skip a look "before it goes out." "Auto-forward" saves your physical effort; it doesn't save your judgment.

## 5. A complete example: turning a meeting record into notes

Tie the above together and see what it actually looks like.

```text
You: Here's a messy meeting record (pasted). I want notes for my boss.
   Please go by "investigate → plan → act → sign off," with the rules I say below:
   stop and wait for me after listing the plan; don't guess when unsure, ask me;
   self-check after writing, don't send for me.

It: (investigate) This meeting's topic was Q3 scheduling, with 4 to-dos, 2 undetermined
   owners, and 1 time conflict. (plan) I plan three steps: (1) split into three blocks by
   "conclusions / to-dos / risks" (2) fill in the owners and times (3) trim to one page.
   Shall I start?

You: Start. In step (2), don't guess the "undetermined owners" for me, list them and ask.

It: (working through step (2)) Two to-dos have no owner written: A and B, who owns each?

You: A goes to Wang, leave B blank for now.

It: (done, self-checking) Notes generated. Self-check: all three points the boss
   cares about are there; the time conflict is flagged red as pending; B's owner is left
   blank as you said. Please review.

You: (sign off) ... (check the key information yourself, then finalize)
```

You said only a few sentences in total, but each one landed on a **checkpoint**: brief the flow and the brake at the start, answer its "questions worth asking" midway, sign off yourself at the end. All the physical labor of reading, splitting, organizing, and trimming, it pushed forward on its own. That's roughly what upgrading from "one question, one answer" to a "workflow" looks like.

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| The model can only do one question, one answer; multi-step work is beyond it | In a chat it stops after each reply and waits for you; agent products add a loop and tools around the model (Chapter 19), and in a chat you can simulate that loop with a workflow prompt |
| Having it do everything in one go is most efficient | Executing without seeing the plan first most easily builds further on a wrong premise; listing the plan first is cheaper |
| Once the flow and brake are set, you can be fully hands-off | Its self-check is not fully trustworthy and it carries errors down; direction and sign-off must be yours |
| The "brake" means having it ask about everything | The brake sets checkpoints **only at irreversible / consequential steps**; inside the range it still runs free |
| "I checked it, no problem" means you can trust it | Its "check" is generated text too, not a real verification; verify the important things yourself |

## Summary

- One-question-one-answer suits small things; big tasks need upgrading to **a workflow that moves forward step by step**. In a chat it stops after each reply and waits for you; agent products add a loop and tools around the model (Chapter 19), and in a chat you can simulate that loop with a workflow prompt.
- The all-purpose skeleton is the loop **investigate → plan → act → sign off** (Chapter 24 uses the same one), and the essence is to **separate "plan" from "act"**: see the plan, then act.
- Let it go on its own, but **keep your hand on the brake**: think ahead about which steps are irreversible / consequential and set them as "must stop and ask you."
- **You can't be a hands-off boss**: its self-check is not fully trustworthy, it carries errors down, it doesn't know what you truly care about. It runs the flow, you manage direction and sign-off.
- This approach is also the underlying logic of Part Four's AI coding (Chapters 23 to 30): let it work on its own, but set irreversible actions to require your sign-off.

In the next chapter, we turn to a scenario that's both especially well-suited and especially dangerous: using AI to learn and look things up.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the core design intent of this chapter's "investigate → plan → act → sign off" loop? <!-- quiz: q01 revision: 2 -->
   - A. Separate planning from acting, to catch drift before work begins
   - B. Run more rounds, trading extra reasoning for higher-quality output
   - C. Make the flow fully automatic, so no person is needed along the way
   - D. Make every step wait for your approval so it never acts on its own
   > **Answer: A.** One-question-one-answer goes off the rails because it thinks and does at once, charging to the end, and you only find the error afterward. Have it lay out the plan first and you can correct course at the cheapest stage. B treats the number of rounds as the goal. C is the opposite: this flow has a person managing direction and sign-off. D overcorrects; the chapter's "brake" applies only to irreversible, consequential steps.

2. **[Basic · Concept]** In an ordinary chat, why doesn't the AI usually carry a big task all the way through on its own? <!-- quiz: q02 revision: 2 -->
   - A. A model only predicts the next word, so it can't do multi-step work at all
   - B. It stops after each reply, with no outer loop or tools to keep it going
   - C. Free plans cap the number of replies; only paid plans keep working
   - D. It fears responsibility, so it hands every decision back on purpose
   > **Answer: B.** Chat is designed as one question, one answer: it stops after replying and waits for your next message. Agent products wrap a loop and tools around the model so it can take a step, look at the result, and decide the next one (Chapter 19), and current models are trained for multi-step work too. A goes too far: models can do multi-step work; a chat just lacks that outer layer. C mistakes a product design for a plan limit. D anthropomorphizes it. In a chat, you can simulate the loop with this chapter's workflow prompts.

3. **[Advanced · Misconception]** "I've set up the flow and the brake, so now I can be completely hands-off." What's wrong with this idea? <!-- quiz: q03 revision: 2 -->
   - A. The flow isn't detailed enough; spell out every step and it runs itself
   - B. Too many brakes slow it down, so remove every stopping point
   - C. Its self-check isn't fully reliable; early misreadings carry forward
   - D. Only coding tasks need a human check; writing tasks can be left alone
   > **Answer: C.** The flow saves you the effort of nudging it along, not the job of watching direction and signing off. Its self-check is text generated by the same model, so it may swear "all correct" and still miss something, and if the first step misunderstood, later steps build ever more neatly on a wrong premise. A thinks enough detail removes the need for a person. B treats the brake as a nuisance. D is wrong: writing tasks can also leave out the one point that matters most to you.

4. **[Advanced · Misconception]** After finishing a task, it volunteers: "I've checked it, no problems." What should you do? <!-- quiz: q04 revision: 2 -->
   - A. Have it re-check three times in different words; if all pass, use it
   - B. Since the flow already has a self-check step, use the result as is
   - C. Ask it to rate how reliable its check was, and trust a high score
   - D. Check key numbers, names, and conclusions yourself, not just its word
   > **Answer: D.** Its "check" is generated text too, so it isn't a guarantee (an extension of the hallucination in Chapter 9). A and C have the same source vouch for itself, which may miss the same spot every time. B assumes a self-check step makes the result reliable; a self-check only reduces obvious slips, and the key information is still yours to verify.

5. **[Basic · Scenario]** You have the AI organize a batch of customer records through a workflow. Which step **most** needs to be set to "must stop and ask you"? <!-- quiz: q05 revision: 2 -->
   - A. Re-sorting the records from oldest to newest
   - B. Unifying the table's fonts, sizes, and formatting
   - C. Deleting customer records it thinks are duplicates
   - D. Rewriting the finished table as a paragraph of text
   > **Answer: C.** Deleting is irreversible, and wrongly deleting customer records has serious consequences, so that's exactly where to put a checkpoint and require your approval. A, B, and D can all be undone or redone, so they're tidying it can do freely. The test: can this step be undone, and does it have consequences?

6. **[Basic · Hands-on]** Pick a small task on hand that takes several steps (like turning messy notes into an outline) and write the AI an instruction the way this chapter does: have it go by "investigate → plan → act → sign off," and state clearly **stop and wait for me after listing the plan**, **don't guess when unsure, ask me**, and **self-check when done, don't send it out directly**. Then actually run it once and observe at which steps it stopped. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** When you write "stop to show the plan," "ask when unsure," and "self-check when done" into the instruction, it usually stops at those checkpoints instead of charging to the end. In a chat, those stopping points are something you designed with your instructions. Run it once yourself and you'll get a real feel for "I hold the brake, it runs free," which also lays the groundwork for having AI edit code in Part Four.
