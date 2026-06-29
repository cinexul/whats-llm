〔Wherever this chapter touches a specific product's commands, interface, or buttons, those change with each version, so always **refer to the provider's official documentation**. This chapter only covers the **shared, stable** guarding moves, and that part won't go out of date.〕

If you only have time to learn one chapter in all of Part Four, make it this one.

In Chapter 23 we settled on an iron rule: **it takes action and it makes mistakes, so "don't let through what you don't understand and haven't verified."** But here's the catch: **how does someone who can't write code "verify" the code it writes?**

The good news: **signing off does not mean understanding every line of code.** What you need are four plain things: **understand the change (diff), run the tests once, know how to undo with one move (roll back), and do a final sign-off with three questions.** A non-expert can learn all four, and once you have them, you really do hold the steering wheel of "letting AI do the work for you."

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

## 2. Running tests: confirming "nothing that was working got broken"

Now that you can follow "what it changed," the next urgent question is: **while it was adding a new feature, did it break a feature that was working fine?**

This is so common in programming that there's a phrase for it: "push down here, it pops up there." You have it fix A; it fixes A but accidentally bumps B. **And the place B breaks might not be in the diff in front of you at all**, so reading the diff alone won't catch it.

This is where **tests** come in.

**A "test" is a batch of small checks written ahead of time, made to automatically confirm "are these features still working or not."** Picture it as the **quality-check line** before a product ships: each unit rides the conveyor, a machine automatically checks "does the light that should be on come on, does the wheel that should turn turn," and if any item fails, **a red light goes on immediately.**

For you, the "person showing it the ropes," the move is unbelievably plain:

- After it's done, **have it "run the tests once."**
- Look at the result: **all green (all passed) = it probably didn't break old features**; **a red appears (a test failed) = it broke something, don't merge, have it go fix it.**

You don't need to be able to write tests, and you don't need to follow the test code. **You only need to look at that "all passed / not all passed" result**, the same way you don't understand how the quality-check machine works but you can read "green light or red light."

> **Common misconception / Reality:** Many beginners think "it said it's fixed, so it's fixed." **In reality, "it thinks it's fine" and "it holds up to the tests" are two different things.** It might genuinely believe it got it right (it isn't lying to you — it's "confidently wrong," the hallucination of Chapter 9), but the test line **shows no mercy**: run it once and true or false is settled then and there. So build the habit: **always run the tests after a change, don't merge with a red light on.**

One addition: not every project has tests ready. If there aren't any, at least do the **plainest manual check**: **use the feature your change affected, with your own hands**, and see whether it still works. Even just "open the page and see if it crashed" beats checking nothing.

## 3. Rollback: one move to undo, this is your biggest source of confidence

The first two steps are "checking afterward." But you might be nervous inside: **if it really does scramble the project, how does a non-expert like me clean up the mess?**

The answer should put you fully at ease: **rollback, one move to undo, restoring the project to the clean state it was in before it acted.**

Why is this possible? We need to separate two situations here:

**Situation one: it acts on your local project.** Here rollback relies on a thing called **version control (Git)**. Picture Git as a **camera that keeps taking snapshots of the project**: before it acts, the project is "one clean snapshot"; after it makes a bunch of changes, if you're unhappy, **one sentence makes the project "go back to that clean snapshot,"** all of the recent changes voided, clean as if nothing happened.

Precisely because there's this "snapshot camera" as backup, you dare to let it try freely; **you can always undo.** So one precondition has to be stated clearly first:

> **Key point:** **When it acts on your local project, be sure to manage the project with Git first and cut a "new branch" before letting it act.** Think of "cutting a new branch" as: **opening a separate scratch area for it, letting it mess around on the scratch copy** without touching your "official version." That way if it wrecks something, you just throw away the scratch area and the official version is untouched. This step is your **biggest safety net**, and Chapter 26 walks you through how to do it.

**Situation two: it acts in a web / cloud form.** Here it usually **doesn't edit directly on your machine** but works in the platform's own isolated environment, and **the platform generally has its own undo / discard / reset.** The mechanism isn't exactly Git, but the purpose is the same: **letting you undo.** For how to undo and how far back, **refer to the official documentation.**

The essence of this is one sentence: **let it act in an environment you can undo.** As for what the undo button is actually called, locally it's Git and in the cloud it depends on the platform, but the "must be able to undo" part doesn't change anywhere.

## 4. The three sign-off questions: this last gate, don't merge what you can't follow

You read the diff, ran the tests, confirmed you can roll back. Finally, gather all of it into a single move **you can use anytime, with no tools at all: the three sign-off questions.**

Every time it says "done," run it through these three questions. **If you can't answer any one of them, don't merge yet.**

1. **"What did it change?"** Looking at the diff, can you say "which spots it touched and roughly what for." If you can't, have it explain, or it **changed too much** (break it into smaller pieces, see Chapter 27).
2. **"Could it break anything else?"** Did you run the tests? All green? If there are no tests, did you try the affected feature with your own hands?
3. **"Can I say in one plain sentence what this bit does?"** This is the most important one. Try to say, to yourself (or to a non-expert), in **one plain sentence**, "what this change does." **If you can't say it, that means you didn't follow it, and what you can't follow you absolutely don't let through.**

The third question is the easiest to skip out of laziness, but it's exactly **the soul of the whole sign-off.** Not being able to say it isn't embarrassing; the right move is **to go back and ask it**: "what does this bit do? why change it this way?" Have it explain until you can restate it in one sentence. If it can't explain clearly, or the more it explains the more suspect it gets, then the change itself may have a problem.

> **Key point:** **"Don't merge what you can't follow" is the bottom line of this chapter, and of all of Part Four.** Done isn't the same as correct (Chapter 23); the diff lets you see what it changed, tests help you confirm it broke nothing, rollback gives you the confidence to "undo," and the three sign-off questions twist these three into one safety rope you can pull anytime. **Remember: the gatekeeping is yours, not its.**

## 5. Stringing the four things into one routine

Don't treat them as four isolated facts. They're really one pipeline that flows in order, matching the "sign-off" gate from Chapter 24:

```text
it says "done"
     │
     ▼
1.read diff ──→ what did it change? right place? normal scope?
     │
     ▼
2.run tests ──→ all green? if there's a red light, don't merge, send it back to fix
     │
     ▼
3.three questions ──→ what changed / could it break anything / can you say it in one sentence
     │
     ├── all three pass ──→ merge, move to the next small step
     │
     └── one gets stuck ──→ go ask for clarity / have it fix / if no good, 【roll back】and start over
```

That last "roll back and start over" matters a lot: when it **gets messier with every change**, the cleanest thing isn't to grind away inside the mess — it's to **roll back to a clean state, open a new conversation, and re-explain things with the pothole you just hit as a premise** (Chapters 13 and 30 covered this loss-cutting idea). **A rollback isn't a failure — it's the best card in your hand.**

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| Reading a diff means understanding every line of code, which I can't | Reading a diff is about "what was touched, how much, right place or not," which a non-expert can judge; green = added, red = removed |
| It said "fixed," so it's fixed | "It thinks it's fine" and "it holds up to tests" are two things; always run tests after a change, don't merge with a red light on |
| I can't follow the tests, so I can't use them | You don't have to follow the test code, just look at the "all green / has red" result |
| If it breaks things I'm done for | In an environment you can undo there's nothing to fear: locally with Git (cut a new branch first), web/cloud with the platform's built-in undo (**refer to the official documentation**) |
| I didn't fully follow it, but it sounds so sure, so I'll merge | **Don't merge what you can't follow**: if the third sign-off question stumps you, go ask for clarity, and if it stays unclear, don't let it through |
| It went off track, so I have to correct it line by line in place | When it gets messier, **roll back + open a new conversation and start over** is usually fastest (Chapters 13, 30) |

## Summary

- **A diff = the before-and-after comparison of a change**, like "spot the difference": **green = added, red = removed.** It's about "what was touched, how much, right place or not," **no need to follow every line of code.**
- **Running tests = confirming nothing that was working got broken**, like a factory quality-check line: you just look at "all green or has a red light," and don't merge with a red light on. No tests? Try the affected feature by hand.
- **Rollback = one move to undo**: let it act in an environment you can undo. **Locally with Git (cut a new branch first)**, web/cloud with **the platform's built-in undo (refer to the official documentation).**
- **The three sign-off questions:** 1. what did it change? 2. could it break anything else? 3. can I say it in one sentence? **If you can't answer any one, don't merge yet.**
- One bottom-line sentence: **"Don't merge what you can't follow."** The gatekeeping always stays with the human (Chapters 23, 39); when it gets messier, rolling back and starting over beats grinding in place (Chapters 13, 30).

In the next chapter (Chapter 26) we'll talk through "acting in an environment you can undo" thoroughly: how the permission mechanism protects you, and why dangerous operations are always left for a human to sign off on.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** In a diff, what does "a green line with a `+` in front" mean?
   - A. A removed line
   - B. A newly added line
   - C. An errored line
   - D. A comment line
   > **Answer: B.** A diff is "the before-and-after comparison": **green = added (`+`), red = removed (`-`)**, and the colorless ones are unchanged, there for context. Picking A flips added and removed, the thing beginners mix up most; remember "the plus sign means added" and you won't go wrong.

2. **[Basic · Concept]** What is "running tests" mainly meant to confirm?
   - A. Whether the code looks good
   - B. Whether this change broke a feature that was working fine
   - C. Whether the AI has a good attitude
   - D. Whether the project can launch and make money
   > **Answer: B.** Tests are like a factory quality-check line, made to automatically check "are existing features still working." They catch the "push down here, pops up there" cases that aren't in the diff in front of you and that the change alone won't reveal. You only need to look at "all green or has a red light."

3. **[Basic · Misconception]** "It said 'fixed,' so it must be fixed, merge it directly." What's wrong?
   - A. Nothing, if it says fixed it's fixed
   - B. "It thinks it's fine" and "it holds up to tests" are two things; it might be confidently wrong, so verify with the diff and tests
   - C. It never says "fixed"
   - D. You have to pay before merging
   > **Answer: B.** It isn't lying to you — it'll be "confidently wrong" (the hallucination of Chapter 9). The test line shows no mercy: run it once and true or false appears. Blindly trusting its tone is exactly the most common way beginners crash.

4. **[Advanced · Misconception]** "Reading a diff means being able to follow every line of code, which a non-expert like me just can't do." Where is this worry unnecessary?
   - A. It's not unnecessary; if you can't follow the code you can't read the diff
   - B. Reading a diff is about "what was touched, how much, right place or not," like spotting "I ordered a salad, why did braised pork show up," which a non-expert can absolutely judge
   - C. Only programmers can open a diff
   - D. A non-expert reading a diff will break the project
   > **Answer: B.** Signing off doesn't mean reading every line of syntax. "Did it touch the right place, is the scope normal" doesn't need a programming background. Mistaking "reading a diff" for "following all the code" makes you needlessly give up this most useful guarding tool.

5. **[Basic · Scenario]** It's changing code on your **local project**, gets messier with every change, and you want to "act as if nothing happened." What had to be done beforehand to make that possible?
   - A. Took a screenshot
   - B. Managed the project with Git and cut a new branch first so it acts in a "scratch area," letting you roll back to a clean state with one move
   - C. Memorized the code
   - D. Turned off the computer
   > **Answer: B.** "Rollback (one move to undo)" relies on Git, the "snapshot camera," and **cutting a new branch first** = opening a separate scratch area for it to mess around in without touching the official version. This step is your biggest safety net (Chapter 26 covers it in detail). With a web/cloud form, it relies on the platform's built-in undo — **refer to the official documentation.**

6. **[Advanced · Hands-on / Observation]** Find a ready-made code change (or this chapter's diff example), don't try to follow the code, just practice the "three sign-off questions": **what did it change? could it break anything else? can I say in one sentence what this bit does?** When you can't answer the third, what do you plan to do?
   > **What you should notice:** The three sign-off questions aren't mysterious; a non-expert can do them. When you can't answer the third, the right move is **to go back and ask it** "what does this bit do, why change it this way," and have it explain until you can restate it in one sentence, **not** to let it through just because its tone is sure. Building the muscle memory of "don't merge what you can't follow" is worth more than knowing any command. For the commands and interface of specific tools, **refer to the official documentation.**
