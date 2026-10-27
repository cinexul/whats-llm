〔Wherever this chapter touches a specific product's commands, interface, or buttons, those change with each version, so always **refer to the provider's official documentation**. This chapter only covers the **shared, stable** guarding moves, and that part won't go out of date.〕

If you only have time to learn one chapter in all of Part Four, make it this one.

In Chapter 23 we settled on an iron rule: **it takes action and it makes mistakes, so "don't let through what you don't understand and haven't verified."** But here's the catch: **how does someone who can't write code "verify" the code it writes?**

The good news: **signing off does not mean understanding every line of code.** What you need are four plain things: **understand the change (diff), run the relevant checks, know what can be restored and how (roll back), and do a final sign-off with three questions.** A non-expert can learn all four, and once you have them, you really do hold the steering wheel of "letting AI do the work for you."

Let's take them one at a time.

## 1. Reading the diff: a game of "spot the difference"

When it finishes changing code, the first thing isn't to ask it "is it done?" It's to **have it show you the change as a diff.**

**A diff is "the before-and-after comparison of a change."** Don't let the word scare you; the idea is dead simple. Like two nearly identical pictures where you play "spot the difference," a diff **circles the spots that differ** for you, so you don't have to compare line by line against the original.

It looks like this (this is a **general illustration**; the exact colors and symbols differ a bit between tools, so **defer to the official documentation**):

```diff
  function greet(name) {
-   return "Hi, " + name;
+   return "Hi, " + name + "! Welcome back";
  }
```

There are only three rules to reading it, and they're enough:

- **A green line with a `+` in front = newly added** (the line above that "added a welcome message").
- **A red line with a `-` in front = removed** (the line above where "the old version got replaced").
- **A line with no color and no symbol = unchanged**, just there to give you context.

That's all. One change might involve several files and several additions and deletions, and the diff **lists them one by one**: "in which file, which lines added, which lines removed." Your job isn't to follow the syntax of every line — it's to answer two questions any non-expert can answer:

1. **Is the place it touched right?** You told it to "change the title color on the homepage," and the diff shows it touched the "user login" code. That's **clearly wrong**; even if you can't follow that code, you know it went off track.
2. **Is the scope absurdly big?** You only asked it to change a small heading, but the diff shows it changed a dozen-plus files and hundreds of lines. **The alarm should ring.** Either it misread the task, or it "casually" touched a pile of things it shouldn't have.

> **Key point:** **Reading a diff is about "what was touched and how much," not "what every line of code means."** It's like not being a chef but still being able to tell "I ordered a salad, why did a pot of braised pork show up." **Right or wrong, right amount or not, a non-expert can absolutely judge.** That's the biggest value of the diff as a tool: it lays out "what it actually changed" so you don't have to take its word for it.

## 2. Running tests: checking for regressions

Now that you can follow "what it changed," the next urgent question is: **while it was adding a new feature, did it break a feature that was working fine?**

This is so common in programming that there's a phrase for it: "push down here, it pops up there." You have it fix A; it fixes A but accidentally bumps B. **And the place B breaks might not be in the diff in front of you at all**, so reading the diff alone won't catch it.

This is where **tests** come in.

**A "test" is a batch of small checks written ahead of time, made to automatically confirm "are these features still working or not."** Picture it as the **quality-check line** before a product ships: each unit rides the conveyor, a machine automatically checks "does the light that should be on come on, does the wheel that should turn turn," and if any item fails, **a red light goes on immediately.**

For you, the "person showing it the ropes," the move is unbelievably plain:

- After it's done, **ask it to run the checks relevant to the change.** A wording edit may need proofreading and link checks; a behavior change calls for relevant tests or a manual exercise.
- Look at the result: **all passed means the tested cases passed**, not that every possible behavior is correct. **A failure needs investigation**: it may come from this change, an existing problem, or the environment. Resolve or clearly account for it before merging.

You do not have to write tests to use their results. Ask **which relevant checks ran, what passed or failed, and what remains untested**. A green result from an unrelated check does not validate your change.

> **Common misconception / Reality:** Many beginners think "it said it's fixed, so it's fixed." **In reality, "it thinks it's fine" and "it holds up to the tests" are two different things.** It might genuinely believe it got it right (it isn't lying to you — it's "confidently wrong," the hallucination of Chapter 9), and tests provide independent evidence for the cases they cover. Build the habit: **run relevant checks after a change, investigate failures, and state any remaining gaps.**

One addition: not every project has tests ready. If there aren't any, at least do the **plainest manual check**: **use the feature your change affected, with your own hands**, and see whether it still works. Even just "open the page and see if it crashed" beats checking nothing.

## 3. Rollback: know what can be restored

**Rollback means returning selected changes to a known earlier state.** It helps you back out of a mistake, but it can't erase every consequence, and restoring often takes more than one step.

**For a local project, Git records versions you deliberately save.** Before a substantial change, inspect the current status and preserve existing work in an appropriate commit or backup. Do not commit secrets just to create a checkpoint. Git is not a camera that automatically saves every edit. If you've never used Git, the basic commands for installing it, saving a starting point, and viewing or undoing changes are in "Git: the bare minimum to get started" in Chapter 26.

A **branch** is a named line of development. Creating one does not create a separate directory or isolate the running process. To work with separate files, use a **separate checkout or Git worktree** when useful. A worktree shares repository history while providing its own working directory; it still does not replace a sandbox.

Git can restore recorded file content or reverse committed changes. It does not automatically protect untracked or ignored files, local databases, or other unsaved work. Before discarding anything, identify which changes belong to this task and preserve unrelated work. Recovery may involve more than one step.

**For a cloud workspace, check its documented recovery features.** A checkpoint, discarded task, or workspace reset may cover only particular files and a limited retention period. Do not assume every platform provides the same undo.

> **Key point:** Reverting code does not unsend messages, recover data already shared, refund charges, restore a remote database, or undo a deployment automatically. Those systems need their own recovery procedures. Prepare the appropriate backup and recovery plan before acting; Chapter 26 explains the permission and workspace boundaries.

## 4. The three sign-off questions: this last gate, don't merge what you can't follow

You read the diff, ran the tests, confirmed you can roll back. Finally, gather all of it into a single move **you can use anytime, with no tools at all: the three sign-off questions.**

Every time it says "done," run it through these three questions. **If you can't answer any one of them, don't merge yet.**

1. **"What did it change?"** Looking at the diff, can you say "which spots it touched and roughly what for." If you can't, have it explain, or it **changed too much** (break it into smaller pieces, see Chapter 27).
2. **"Could it break anything else?"** Which relevant checks passed, which failed, and what remains untested? Investigate failures and resolve or clearly account for them before merging. If no suitable tests exist, try the affected behavior yourself.
3. **"Can I say in one plain sentence what this bit does?"** This is the most important one. Try to say, to yourself (or to a non-expert), in **one plain sentence**, "what this change does." **If you can't say it, that means you didn't follow it, and what you can't follow you absolutely don't let through.**

The third question is the easiest to skip out of laziness, but it's exactly **the soul of the whole sign-off.** Not being able to say it isn't embarrassing; the right move is **to go back and ask it**: "what does this bit do? why change it this way?" Have it explain until you can restate it in one sentence. If it can't explain clearly, or the more it explains the more suspect it gets, then the change itself may have a problem.

> **Key point:** **"Don't merge what you can't follow" is the bottom line of this chapter, and of all of Part Four.** Done isn't the same as correct (Chapter 23); the diff lets you see what it changed, tests help reveal regressions, rollback gives you the confidence to "undo," and the three sign-off questions twist these three into one safety rope you can pull anytime. **Remember: the gatekeeping is yours, not its.**

## 5. Stringing the four things into one routine

Don't treat them as four isolated facts. They're really one pipeline that flows in order, matching the "sign-off" gate from Chapter 24:

```text
it says "done"
     │
     ▼
1.read diff ──→ what did it change? right place? normal scope?
     │
     ▼
2.run relevant checks ──→ investigate failures; resolve or explain them and record untested behavior
     │
     ▼
3.three questions ──→ what changed / could it break anything / can you say it in one sentence
     │
     ├── all three pass ──→ merge, move to the next small step
     │
     └── one gets stuck ──→ go ask for clarity / have it fix / if no good, 【roll back】and start over
```

That last "roll back and start over" matters a lot: when it **gets messier with every change**, the cleanest thing isn't to grind away inside the mess — it's to **restore the intended changes to a known state while preserving unrelated work, then restate the task and what went wrong, in a new conversation if useful** (Chapters 13 and 30 covered this loss-cutting idea). **A rollback isn't a failure — it's the best card in your hand.**

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| Reading a diff means understanding every line of code, which I can't | Reading a diff is about "what was touched, how much, right place or not," which a non-expert can judge; green = added, red = removed |
| It said "fixed," so it's fixed | Check the result using relevant tests, manual use, or document review. Investigate failures and record verification gaps before merging |
| I cannot write tests, so I cannot use their results | Ask what was tested, what passed or failed, and what remains untested; passing checks have limited coverage |
| If it breaks things I have no options | Git and backups can restore what they recorded. Check coverage first; a branch is not a separate directory, and external effects need separate recovery |
| I didn't fully follow it, but it sounds so sure, so I'll merge | **Don't merge what you can't follow**: if the third sign-off question stumps you, go ask for clarity, and if it stays unclear, don't let it through |
| It went off track, so I have to correct it line by line in place | When it gets messier, **roll back + open a new conversation and start over** is usually fastest (Chapters 13, 30) |

## Summary

- **A diff = the before-and-after comparison of a change**, like "spot the difference": **green = added, red = removed.** It's about "what was touched, how much, right place or not," **no need to follow every line of code.**
- **Tests check the behavior they cover.** Run relevant checks, investigate failures, and report gaps. If no suitable tests exist, exercise the affected feature by hand.
- **Rollback restores selected recorded state.** Preserve existing work first; use a separate checkout or worktree when needed. Check cloud recovery limits and plan separately for unrecorded data and external effects.
- **The three sign-off questions:** 1. what did it change? 2. could it break anything else? 3. can I say it in one sentence? **If you can't answer any one, don't merge yet.**
- One bottom-line sentence: **"Don't merge what you can't follow."** The gatekeeping always stays with the human (Chapters 23, 39); when it gets messier, rolling back and starting over beats grinding in place (Chapters 13, 30).

In Chapter 26 we examine sandbox boundaries, scoped authorization, useful approval points, and the limits of recovery.

## Sources and version notes

Recovery guidance checked on 2026-10-22 against Git's official documentation: [branches](https://git-scm.com/docs/git-branch), [worktrees](https://git-scm.com/docs/git-worktree), [revert](https://git-scm.com/docs/git-revert), and [ignored files](https://git-scm.com/docs/gitignore). The repository records files and commits; external services require their own recovery procedures.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** In a diff, what does "a green line with a `+` in front" mean? <!-- quiz: q01 revision: 1 -->
   - A. A removed line: it was there before the change and is gone after it
   - B. An error line the tool highlights so you know to check it closely
   - C. A newly added line: it wasn't there before and appears after the change
   - D. An unchanged line, shown only so you can see the code around the change
   > **Answer: C.** A diff is "the before-and-after comparison": green = added (`+`), red = removed (`-`), and lines with no color or symbol are unchanged, there for context (D). Picking A flips added and removed, the thing beginners mix up most; remember "the plus sign means added" and you won't go wrong. B mistakes the color for an error marker; a diff doesn't judge right or wrong.

2. **[Basic · Concept]** What is "running tests" mainly meant to confirm? <!-- quiz: q02 revision: 1 -->
   - A. Whether this change broke a feature that used to work fine
   - B. Whether the new code follows the style rules and reads well
   - C. Whether the AI made its changes exactly as the approved plan said
   - D. Whether every possible case is guaranteed correct after the change
   > **Answer: A.** Tests are like a factory quality-check line, made to automatically check "are existing features still working." They catch the "push down here, pops up there" cases that aren't in the diff in front of you. Whether the code follows the style (B) or matches the plan (C) is for the diff and the three sign-off questions. Passing tests only show the covered cases passed, not that every case is correct (D).

3. **[Basic · Misconception]** "It said 'fixed,' so it must be fixed, merge it directly." What's wrong? <!-- quiz: q03 revision: 1 -->
   - A. Nothing; it can check its own code, so if it says fixed, it's fixed
   - B. It skipped a spot check; opening one or two places is enough
   - C. It skipped the full test run; if every test passes, every case is right
   - D. It may be confidently wrong; verify with the diff and relevant checks
   > **Answer: D.** It isn't lying to you; it can be "confidently wrong" (the hallucination of Chapter 9). Its own judgment doesn't replace verification (A); a quick look at one or two places won't catch problems elsewhere (B); relevant tests provide evidence for the behavior they cover, but passing does not prove every case is correct (C).

4. **[Advanced · Misconception]** "Reading a diff means being able to follow every line of code, which a non-expert like me just can't do." Where is this worry unnecessary? <!-- quiz: q04 revision: 1 -->
   - A. It isn't; if you can't follow the code, you can't make any sense of the diff
   - B. A diff is mostly about where and how much it changed, and if that's right
   - C. You can skip the diff; if the tests pass, that does the same job
   - D. Counting how many files changed is enough; the contents don't matter
   > **Answer: B.** Signing off doesn't mean reading every line of syntax. "Did it touch the right place, is the scope normal" is like spotting "I ordered a salad, why did braised pork show up," which a non-expert can absolutely judge. Tests can't catch "changed the wrong place," so they can't replace the diff (C); counting files is too coarse to tell whether it touched the part you asked for (D).

5. **[Basic · Scenario]** You want a way to restore a local code change if it goes wrong. What should you arrange beforehand? <!-- quiz: q05 revision: 1 -->
   - A. Save a starting point with a Git commit or suitable backup, and check coverage
   - B. Just create a new branch, which automatically backs up the whole project folder
   - C. Take a screenshot, and if things break, change everything back by hand from it
   - D. Nothing; reverting the code will also restore the database and the emails
   > **Answer: A.** Git restores recorded content (basic commands are in "Git: the bare minimum to get started" in Chapter 26); a branch alone creates neither a backup of all files nor another directory (B). A screenshot can't capture every change (C), and external effects like databases and emails need their own recovery plans (D). Use a separate checkout or worktree if you need separate working files; cloud checkpoints also have their own scope and retention limits.

6. **[Advanced · Hands-on / Observation]** Find a ready-made code change (or this chapter's diff example), don't try to follow the code, just practice the "three sign-off questions": **what did it change? could it break anything else? can I say in one sentence what this bit does?** When you can't answer the third, what do you plan to do? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** The three sign-off questions aren't mysterious; a non-expert can do them. When you can't answer the third, the right move is **to go back and ask it** "what does this bit do, why change it this way," and have it explain until you can restate it in one sentence, **not** to let it through just because its tone is sure. Building the muscle memory of "don't merge what you can't follow" is worth more than knowing any command. For the commands and interface of specific tools, **refer to the official documentation.**
