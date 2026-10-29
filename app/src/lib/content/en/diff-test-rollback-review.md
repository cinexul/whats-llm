If you only have time for one chapter in Part 4, make it this one.

Chapter 23 said it plainly: the agent acts, and it makes mistakes; finished isn't the same as correct. So how can someone who doesn't write code check whether the code it wrote is right?

Signing off doesn't mean understanding every line. What you do is plain: see where it changed things (the diff), use concrete checks to confirm it actually did the job without breaking anything else, know how to get back if it went wrong, and finish with three questions. This chapter takes them one at a time, and section 5 sets out the book's position on whether you need to read the code.

## 1. Reading the diff: a game of "spot the difference"

When it finishes a change, the first thing to do isn't to ask "done?" but to have it show you the change as a diff. A diff is a before-and-after comparison. Like two nearly identical pictures in a spot-the-difference puzzle, the diff circles what changed, so you don't have to compare the original line by line.

It looks roughly like this (colors and layout vary a little between tools):

```diff
  function greet(name) {
-   return "Hi, " + name;
+   return "Hi, " + name + "! Welcome back";
  }
```

There are only three rules for reading it:

- A line starting with `+`, usually shown in green: added.
- A line starting with `-`, usually shown in red: removed.
- A line with no symbol: unchanged, shown for context.

The change above means the greeting used to say just "Hi, so-and-so" and now adds "! Welcome back." One change can touch several files in several places, and the diff lists them file by file. You don't need to follow the syntax. Start with two questions anyone can answer:

1. Is it changing the right place? You asked it to change the color of the homepage title, but the diff touches the "user login" code. Even if you can't read that code, you can tell it went off track.
2. Is the scope wildly too big? You wanted one small heading changed, and the diff shows a dozen files and hundreds of lines. Either it misunderstood the task, or it "tidied up" things it shouldn't have touched.

You don't have to be a chef to notice that you ordered a salad and got a pot roast.

For the parts you can't follow, have it explain. You might ask:

> "Go file by file and tell me in plain words what you changed and why. Then list the risky changes separately: could anything delete or overwrite data, change permissions or logins, send things over the network, touch passwords or keys, or cost money? Mark anything you're unsure about."

Compare its explanation with the diff. If it says it only changed the heading but the diff includes login-related files, ask about it.

## 2. Tests and acceptance checks: did it work, and is everything else intact?

Once you know what it changed, the next question is whether it actually worked, and whether fixing A broke B. The second case is so common in programming that it has a name: a regression, where a feature that used to work is broken by a new change. The broken part may not be in the diff at all, so reading the diff won't catch it.

Tests are a set of small checks written in advance that automatically confirm whether features still work, like a quality-control line before shipping: if one item fails, a red light comes on. You don't need to write tests to use their results. After a change, have it run the tests related to this change, then ask three things: Which checks ran? Which passed and which failed? What wasn't tested?

Two things to keep in mind when reading results. Everything passing only means the tested cases are fine, not that every case is right. If something fails, find out why first: it may come from this change, from an existing problem, or from the environment. Fix it before merging, or write down the cause and the impact clearly.

Alongside tests, your own acceptance checks matter just as much, and for someone who doesn't write code they're the main tool. Before any work starts, write down what "done" looks like, as steps you can actually follow:

> Open the homepage and type "invoice" into the search box: articles with "invoice" in the title should be listed. Search with the box empty: no error. Narrow the window to phone width: the search box doesn't cover the title.

After the change, follow those steps yourself. If the project has no tests, these steps are your tests. For a wording change, proofreading the text and clicking each link is enough; for a change in behavior, always use the feature for real. "I've verified it" from the agent doesn't count; what you see with your own eyes does.

## 3. Rollback: know what can be restored

Rolling back means returning selected changes to a known earlier state. In a project on your computer, that's usually done with Git. Git saves only the versions you commit; it doesn't record every edit automatically, so before a bigger change, commit or back up a starting point. If you've never used Git, installation and the basic commands are in "Git: the bare minimum to get started" in Chapter 26.

Rollback has limits. Git doesn't protect files that were never committed or local databases, and it can't undo emails already sent, content already published, money already spent, or changes to a remote database. Checkpoints in cloud workspaces have their own scope and retention time. Chapter 26 covers these limits; for signing off, one rule is enough: if you can't say how an action would be undone, don't approve it yet.

## 4. The three sign-off questions

You've read the diff, run the checks, and confirmed the way back. Finish with three questions. Every time it says "done," go through them; if you can't answer one, don't merge yet.

1. What did it change? It has explained each file in plain words, you've checked against the diff that the place and scope are right, and you can say in one sentence what the change is for.
2. Did it actually do the job without breaking anything else? You've followed your acceptance steps yourself, the related checks pass, failures have a known cause, and you know what wasn't tested.
3. If something is wrong, how costly is it, and can you undo it? If the change touches money, personal data, passwords or keys, deleting files, or publishing, has it had a second review? Is the way back ready?

When you can't answer the first question, go back and ask: "What does this part do? Why did you change it this way?" Have it explain until you can say it back. If it can't explain, or the explanation gets more suspicious the more you ask, the change itself may be the problem.

## 5. Do you need to read the code? The book's position

Someone who can't program doesn't need to read every line of code to take responsibility for an AI's changes. The condition is doing four things:

1. Confirm the behavior with concrete acceptance checks, instead of trusting "done" (section 2).
2. Have it explain the diff in plain words and point out the risky parts itself (section 1).
3. For any change that touches money, personal data, passwords or keys, deleting files, or publishing, get a second review: open a new session and have an agent with none of the earlier conversation review just that diff, or ask a person who knows the subject. The same session carries its earlier reasoning and tends to defend its own approach.
4. Never run what you can't roll back (section 3 and Chapter 26).

> **Key point:** Reading every line is not the bar. If you can't say what it changed, haven't followed your acceptance steps, have a high-risk change nobody else reviewed, or have no way back if it goes wrong, any one of these means: don't merge.

The project chapters that follow use this standard. When you build a personal website (Chapter 31), reloading the page in your browser and looking at it is your acceptance check; once the site is going public, or starts collecting visitors' information, you're in second-review territory.

## 6. Stringing them into one routine

These moves make up the "sign off" step in Chapter 24's work loop:

```text
it says "done"
     │
     ▼
1. read the diff, have it explain in plain words ──→ right place? normal scope? any risk?
     │
     ▼
2. follow acceptance steps + run related checks ──→ find causes of failures, note what's untested
     │
     ▼
3. three questions ──→ what changed / did it work, anything broken / cost and way back
     │
     ├── all pass ──→ merge, commit, on to the next small step
     │
     └── stuck ──→ ask / have it fix / if not, roll back and start over
```

When things get messier with every fix, don't keep patching inside the mess. Keep unrelated work, restore this change to the last good state, and restate the task along with the problem you just hit, in a new conversation if needed (Chapters 13 and 30).

## 7. Common misconceptions

| Misconception | Reality |
| --- | --- |
| Reading a diff means understanding every line of code | First look at where and how much it changed; have it explain the rest in plain words and check against the diff |
| It said "fixed," so it's fixed | Follow your acceptance steps yourself and look at the related check results |
| All tests pass, so everything is right | Only the tested cases are fine; also ask what wasn't tested |
| If I can't write tests, I can't sign off | Turn "what done looks like" into steps and follow them yourself; that's your test |
| Having the same session check again is enough | High-risk changes need a new session or a person; the same session tends to defend itself |
| If it breaks, rolling back restores everything | Git restores only what was committed; emails, publishing, money, and remote data don't come back (Chapter 26) |

## Summary

- A diff is a before-and-after comparison: `+` is added, `-` is removed. First look at where and how much it changed; have it explain the rest in plain words and point out the risks.
- Tests verify the behavior they cover; acceptance steps written in advance are the main checking tool for someone who doesn't write code.
- Rollback restores only recorded states; don't approve an action if you can't say how it would be undone (Chapter 26).
- The three sign-off questions: What did it change? Did it work without breaking anything? How costly is a mistake, and can you undo it?
- The book's position: you don't need to read every line, but you do need concrete checks of behavior, a plain-language explanation of the diff and its risks, a second review for high-risk changes, and nothing run that you can't roll back.

Chapter 26 covers how to let it act without losing control: permission settings and an environment you can roll back.

## Sources and version notes

What Git can and can't restore was checked on 2026-10-29 against Git's official documentation: [revert](https://git-scm.com/docs/git-revert) and [ignored files](https://git-scm.com/docs/gitignore). Branches and worktrees, with their sources, are covered in Chapter 26.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** In a diff, what does "a green line with a `+` in front" mean? <!-- quiz: q01 revision: 2 -->
   - A. A removed line: it was there before the change and is gone after it
   - B. An error line the tool highlights so you know to check it closely
   - C. A newly added line: it wasn't there before and appears after the change
   - D. An unchanged line, shown only so you can see the code around the change
   > **Answer: C.** A diff is "the before-and-after comparison": green = added (`+`), red = removed (`-`), and lines with no color or symbol are unchanged, there for context (D). Picking A flips added and removed, the thing beginners mix up most; remember "the plus sign means added" and you won't go wrong. B mistakes the color for an error marker; a diff doesn't judge right or wrong.

2. **[Basic · Concept]** What is "running tests" mainly meant to confirm? <!-- quiz: q02 revision: 2 -->
   - A. Whether this change broke a feature that used to work fine
   - B. Whether the new code follows the style rules and reads well
   - C. Whether the AI made its changes exactly as the approved plan said
   - D. Whether every possible case is guaranteed correct after the change
   > **Answer: A.** Tests are like a factory quality-check line, made to automatically check "are existing features still working." They catch the "push down here, pops up there" cases that aren't in the diff in front of you. Whether the code follows the style (B) or matches the plan (C) is for the diff and the three sign-off questions. Passing tests only show the covered cases passed, not that every case is correct (D).

3. **[Basic · Misconception]** "It said 'fixed,' so it must be fixed, merge it directly." What's wrong? <!-- quiz: q03 revision: 2 -->
   - A. Nothing; it can check its own code, so if it says fixed, it's fixed
   - B. It skipped a spot check; opening one or two places is enough
   - C. It skipped the full test run; if every test passes, every case is right
   - D. It may be confidently wrong; verify with the diff and relevant checks
   > **Answer: D.** It isn't lying to you; it can be "confidently wrong" (the hallucination of Chapter 9). Its own judgment doesn't replace verification (A); a quick look at one or two places won't catch problems elsewhere (B); relevant tests provide evidence for the behavior they cover, but passing does not prove every case is correct (C).

4. **[Advanced · Misconception]** "Reading a diff means being able to follow every line of code, which a non-expert like me just can't do." Where is this worry unnecessary? <!-- quiz: q04 revision: 2 -->
   - A. It isn't; if you can't follow the code, you can't make any sense of the diff
   - B. A diff is mostly about where and how much it changed, and if that's right
   - C. You can skip the diff; if the tests pass, that does the same job
   - D. Counting how many files changed is enough; the contents don't matter
   > **Answer: B.** Signing off doesn't mean reading every line of syntax. "Did it touch the right place, is the scope normal" is like spotting "I ordered a salad, why did braised pork show up," which a non-expert can absolutely judge. Tests can't catch "changed the wrong place," so they can't replace the diff (C); counting files is too coarse to tell whether it touched the part you asked for (D).

5. **[Basic · Scenario]** You want a way to restore a local code change if it goes wrong. What should you arrange beforehand? <!-- quiz: q05 revision: 2 -->
   - A. Save a starting point with a Git commit or suitable backup, and check coverage
   - B. Just create a new branch, which automatically backs up the whole project folder
   - C. Take a screenshot, and if things break, change everything back by hand from it
   - D. Nothing; reverting the code will also restore the database and the emails
   > **Answer: A.** Git restores recorded content (basic commands are in "Git: the bare minimum to get started" in Chapter 26); a branch alone creates neither a backup of all files nor another directory (B). A screenshot can't capture every change (C), and external effects like databases and emails need their own recovery plans (D). Use a separate checkout or worktree if you need separate working files; cloud checkpoints also have their own scope and retention limits.

6. **[Advanced · Hands-on / Observation]** Take an existing code change (or this chapter's diff example) and, without needing to understand the code, practice the three sign-off questions: What did it change? Did it actually do the job without breaking anything else? If something is wrong, how costly is it, and can you undo it? When you can't answer the first, what will you do? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** When you can't answer the first question, go back and have it explain file by file in plain words and point out the risky parts, until you can say it back in one sentence; don't let it through just because it sounds sure. The second is answered by your acceptance steps written beforehand and the related checks; the third by whether the change touches money, personal data, keys, deletion, or publishing, and where the way back is. Merge only when you can answer all three.
