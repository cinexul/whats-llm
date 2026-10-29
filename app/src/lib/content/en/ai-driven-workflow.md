So far, your relationship with the AI has probably gone like this: you ask one thing, it answers; if you're not happy, you add a line and it revises. Call it "one question, one answer." For small tasks, that's enough.

Real work often can't be said in one sentence. "Turn this messy meeting record into notes for my boss" hides several steps: understand the record, work out which points the boss cares about, write the notes, then check for anything missed. If you have to prompt every step with "now do the next one," you've turned yourself into its conveyor belt.

This chapter is about getting the AI to move several steps toward a goal on its own, and to stop and ask you at the right places. The Part Four coding tools that edit code and run tests by themselves work on the same idea: turn a big task into a flow that can move forward step by step.

## 1. Why "one question, one answer" isn't enough

| What one-question-one-answer looks like | Where it gets stuck |
| --- | --- |
| You say one step, it does one step | You become the "human dispatcher" and can't step away |
| It doesn't look back after finishing | It doesn't self-check; if you don't point out an error, it won't fix it |
| You don't give the full picture, so it only sees what's in front of it | It doesn't know what the end goal is and drifts easily |

The problem is the chat format itself. In a chat window, the AI stops after each reply and waits for you. If you say nothing, it won't carry on by itself or take stock of how many steps are left.

Products that keep going for several steps do exist. Agent products wrap a loop around the model and give it tools such as reading files, searching and running programs, so it can do a step, look at the result and decide the next one (Chapter 19). Current models are also specifically trained for this kind of multi-step work. An ordinary chat has no such outer layer, but you can simulate the loop with a workflow prompt: lay out the structure of the task, have it proceed step by step, and have it stop wherever it needs your call. Think of briefing a capable new assistant on the whole process, letting them run with it, and having them come back when a decision is yours to make.

## 2. One all-purpose loop: investigate → plan → act → sign off

Any task, however large, fits the same loop. Chapter 24 uses this loop for coding.

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

- ① Investigate: don't let it jump in. Have it read the materials, requirements and constraints and say them back. For example: "Before writing, tell me in three sentences: what this record is about, what the to-dos are, and whether anything contradicts itself." Now you both have the same picture of the situation.
- ② Plan: have it list the steps first, with no finished product yet. "List how many steps you'll take to write these notes and what each step does. Don't start writing."
- ③ Act: once you approve the plan, have it follow the plan. "OK, start with steps 1 and 2."
- ④ Sign off: when it's done, have it check its work against the original requirements ("Are all three things the boss wanted covered? Any contradictions?"), then look it over yourself. If it doesn't pass, send it back to an earlier step with the problems noted.

> **Key point:** What matters most in these four steps is keeping "plan" and "act" apart. One question, one answer goes wrong so easily because the AI thinks and writes at the same time and charges to the end; by the time you spot the error, it's late. If it lays out the plan first, you can stop the drift at the cheapest stage, before any work is done.

Chapter 27 goes deeper into "see the plan before acting" for coding. For now, just build the intuition.

## 3. Let it go on its own, but keep your hand on the brake

The worrying part of letting the AI take several steps in a row is this: what if it heads the wrong way and keeps going? The fix is to decide in advance where it must stop and ask you. Split the steps of a task into two kinds:

| It can go ahead on its own | It must stop and ask you |
| --- | --- |
| Reading materials, outlining, formatting, rewording | When it would delete or overwrite your files or content |
| Picking one of a few unimportant small options | When it would send something out (email, commit, publish) |
| Converting content from one form to another | When it hits a judgment it isn't sure about and needs your call |
| Finishing a step, reporting, then doing the next | When money, privacy or serious consequences are involved |

The method is simple: when you hand over the task, write "stop and ask" into the instructions.

```text
Please work through tidying these notes by "investigate → plan → act → sign off."
Rules:
- After listing the plan, stop and show it to me; wait until I say "start" before acting.
- Wherever you're unsure (say, who owns a given to-do), don't guess for me; stop and ask.
- Self-check after writing, then hand it to me. Don't send it to anyone for me.
```

That's your brake. It marks out a safe area: inside, the AI runs freely; at the edge, it has to stop. You don't need to watch every step. Just work out ahead of time which steps can't be undone or have consequences, and mark those as "must stop." This matters even more in AI coding: letting it edit code is fine, but deleting files, committing and deploying need a checkpoint. Chapter 26 covers how coding tools' own permission settings work.

## 4. Why you still can't be a hands-off boss

You've given it a flow and set a brake. Can you let go completely? No, and the reasons come back to the model's old weaknesses:

- Its self-check can't be fully trusted. Ask it "check for errors" and it may confidently say "all correct" while something is missing. Its "check" is text produced by the same model, not a second, independent pair of eyes (Chapter 9).
- It carries errors down the flow. If step ① misread the situation, the next three steps build ever more neatly on a wrong premise. It looks polished, but it went wrong at the start.
- It doesn't know what you really care about unless you say so. It can write beautiful notes that leave out the one item that matters most to you.

So the division of labor is: it runs the flow, you own the direction and the sign-off. It pushes the tedious steps forward; at a few key points you check that the direction is right and nothing important is missing. Chapter 16 applies this split to everyday work tasks.

## 5. A complete example: turning a meeting record into notes

Put together, it looks like this:

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

You only said a few sentences, but each one came at a checkpoint: set out the flow and the brake at the start, answer the questions it should ask along the way, and sign off yourself at the end. The legwork of reading, sorting, organizing and trimming, it moved forward on its own.

## 6. Common misconceptions, corrected

| Misconception | Reality |
| --- | --- |
| The model can only do one question, one answer; multi-step work is beyond it | In a chat it stops after each reply; agent products add a loop and tools around the model (Chapter 19), and in a chat you can simulate that with a workflow prompt |
| Having it go from start to finish in one go is most efficient | Acting without first seeing the plan is the easiest way to go far on a wrong premise |
| With a flow and a brake set, you can let go completely | Its self-check can't be fully trusted and it carries errors down; direction and sign-off are yours |
| "The brake" means it has to ask me about everything | Put checkpoints only on irreversible or consequential steps; inside that, let it run |
| If it says "I've checked, no problems," you can believe it | Its "check" is also generated text; verify what matters yourself |

## Summary

- One question, one answer suits small things; big tasks need a workflow that moves step by step. In a chat it stops after each reply; agent products add a loop and tools around the model (Chapter 19), and in a chat you can simulate that loop with a workflow prompt.
- The all-purpose skeleton is "investigate → plan → act → sign off" (Chapter 24 uses the same loop). The key is to see the plan before acting.
- It goes on its own, you hold the brake: mark the irreversible, consequential steps in advance and have it stop and ask you there.
- Its self-check can't be fully trusted, it carries errors forward, and it doesn't know what you care about. It runs the flow; you own the direction and sign-off. Part Four's AI coding (Chapters 23 to 30) works on the same idea.

The next chapter looks at a scenario where AI is especially helpful and especially easy to be misled by: learning and looking things up.

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
