Chapter 23 covered what a coding agent is: an Agent that reads your project, edits files, and runs commands on its own. This chapter is about how to work with one. Whether you use Claude Code or Codex, tasks that go well almost always follow the same loop: investigate → plan → act → sign off. Once you know this order, you know when to let it run and when to stop and look.

You don't need to write code for this chapter either. Installation and specific commands come in Chapters 28 and 29.

## 1. A quick recap: how it differs from web chat

| | Web/app chat | Coding agent |
| --- | --- | --- |
| How it treats code | Gives you text that you copy and use | Edits the files in your project directly |
| How much it knows | Only what you pasted in | Explores the whole project to see how things stand |
| How it moves | You ask, it answers | Takes several steps toward the goal on its own |
| Cost of a mistake | A wrong answer you can ignore | Your files really change, so you need to be able to roll back |

The last row is the key one. Because it really changes your things, using it in an environment you can undo is a precondition, not a nicety.

Chapter 23's comparison is most useful here: it's like a very capable, very fast coworker on day one. Hand over the grunt work and it gets done quickly and in volume, but it doesn't know your rules or which places are off-limits (Chapter 28 shows how to write them down), and it can be confidently wrong (Chapter 9's hallucination). So you're the one leading: assigning work and signing off are your job, and yours is the name on the result.

## 2. The core workflow: investigate → plan → act → sign off

The figure below shows the loop. Of the four steps, investigating and acting are mostly done by the agent. Planning and signing off are the two gates you guard: it acts only after you approve the plan, and a change is merged only after it passes your sign-off. If the sign-off fails, you go back to investigate or plan instead of patching things where they stand.

Why insist on these two gates? Because a coding agent makes mistakes and can also act. As long as both are true, reviewing the plan before it acts and signing off after it acts can't be skipped. Hold those two gates, and you can hand over the rest of the grunt work with confidence.

![The work loop: investigate, plan, act, and sign off arranged in a cycle, each with a line saying what the human does at that step; plan and sign off are the gates a human guards; if sign-off fails, an arrow leads back to investigate or plan, and if it passes, you commit and start the next small step](/figures/en/work-loop.svg)

### 1. Investigate: it reads the project, you take a look

Don't rush it into editing. First have it find the relevant code and explain how things work now, and check that it's looking in the right place. You might say:

> "Don't change anything yet, just investigate: to add a search box to the page, which files are involved, and how is it done now?"

### 2. Plan: it proposes, you approve

Have it write down how it intends to make the change: which files it will touch, what it will add, how many steps. It starts only after you've read and approved the plan. This takes half a minute and prevents most of the "it went the wrong way for thirty minutes" rework. As of October 2026, both Claude Code and Codex have a plan mode you enter by typing `/plan`. With tools that don't, you can simply say "don't act yet, just give me a plan" (Chapter 27 goes into detail).

### 3. Act: it edits files, you can stop it at any time

Once you approve, it starts editing. Which actions need confirmation each time and which run automatically within the permissions you've granted depends on the tool and its settings (Chapter 26); no prompt doesn't mean no risk. Deleting, publishing, and sending things out should follow rules you agreed beforehand. If it seems to be drifting, interrupt it, say clearly what you want, and let it continue.

### 4. Sign off: you check, and merge only if it passes

This is your most important step, and Chapter 25 covers it in full. In short, it's three questions: What did it change (read the diff and have it explain in plain words)? Did it actually do the job without breaking anything else (follow the acceptance steps you wrote down beforehand, plus the relevant tests)? If something is wrong, how costly is it, and can you undo it? You don't need to read every line of code, but if you can't answer these three, don't merge.

## 3. What to expect the first time

1. Prepare an environment you can undo. When it works on a project on your computer, keep the project in Git, commit a starting point, and create a new branch before letting it act (if you've never used Git, read "Git: the bare minimum to get started" in Chapter 26 first). A branch on its own isn't a backup: Git restores only what was committed, and can't undo emails, deployments, or changes to outside data. Web and cloud entry points have their own isolation and recovery, which you need to check separately (Chapter 26).
2. It will "read" for a while first. Browsing the project takes time; it isn't stuck.
3. Read what each confirmation is asking. Some actions ask for your OK; others run automatically within what you've already allowed.
4. It will make mistakes and drift. That's normal. When it happens, don't try to fix things inside the mess. The simplest fix is to roll back to a clean state, open a new conversation, and restate the task, including the problem you just ran into (Chapters 13 and 30).
5. For very new technology, state the version clearly or paste in current material (Chapter 9's knowledge cutoff).
6. Never paste keys, passwords, or real personal information into the conversation or into code (Chapter 37). On cost: a subscription allowance and metered API billing are two different things; Chapter 38 covers them.

The most common beginner mistake is asking it to build a whole big feature in one go. A big change is hard work to sign off, and when something breaks it's hard to roll back. Breaking it up is faster: build a small piece, sign it off, commit, then move on (Chapter 27).

## 4. Claude Code and Codex: what's the same, what differs

| | Same (stable) | Different (changes; see Chapters 28 and 29) |
| --- | --- | --- |
| What it is | Both are coding agents that act on your project | Maker, underlying models, available entry points |
| Workflow | Both fit "investigate → plan → act → sign off" | Specific commands, shortcuts, and interfaces |
| Safety | Both need permission settings and an environment you can roll back | Default permissions and how to set them |
| Getting started | Both: try small steps on a Git branch first | Installation and sign-in |

This workflow works whichever tool you switch to, because it comes from how to lead a helper that makes mistakes and can act, not from any product's buttons.

## 5. Common misconceptions

| Misconception | Reality |
| --- | --- |
| It's AI, so its code should be right; merge it | It can be confidently wrong; sign off as in Chapter 25, and don't merge if you can't answer the three questions |
| Having it build a whole big feature at once is easiest | Big changes are hard to sign off and hard to roll back; small steps signed off one by one are faster |
| It remembers my whole project and yesterday's conversation | The model itself has no memory across conversations; "project memory" such as CLAUDE.md is the product putting saved text back into the context each time (Chapters 9 and 28) |
| I can't program, so I can't use it | You don't need to write every line; you need to assign work and sign off with concrete checks |
| When it drifts, keep chasing it with corrections | Roll back and start a new conversation; fixing things inside a muddled context usually makes them worse |

## Summary

- Claude Code and Codex are coding agents that act inside your project; whether you use them in a terminal, an editor, a desktop app, or the web depends on the product.
- The fundamental difference from web chat: it edits files directly, explores the project, and takes several steps, so use it where you can roll back.
- The core workflow is investigate → plan → act → sign off. You guard two gates: approving the plan and signing off on the change. If sign-off fails, go back to investigate or plan.
- The first time: commit a starting point and create a Git branch, keep tasks small, roll back and start over when it drifts, and never paste keys.
- The workflow doesn't depend on a particular tool. Learn it once and it carries over.

The next chapter (Chapter 25) goes into the step most worth practicing: reading diffs, running tests, rolling back, and signing off.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's the most fundamental difference between a coding agent (like Claude Code / Codex) and a web chat AI? <!-- quiz: q01 revision: 2 -->
   - A. It uses a stronger model, so its answers are more accurate and less often wrong
   - B. It remembers your whole project and doesn't forget even in a new conversation
   - C. It only answers programming questions and ignores every other subject
   - D. It can read and write project files and run commands, not just hand you text
   > **Answer: D.** A chat AI is "you copy and paste back and forth"; a coding agent "takes action directly in your project." That's exactly why it's efficient, and why it needs the "permission mechanism" watching it. A and C treat the difference as model strength or subject range. B confuses the model with the product: the model itself has no cross-conversation memory, and "project memory" is the product putting files back into the context each time.

2. **[Basic · Concept]** In the "investigate -> plan -> act -> sign off" loop, at which step is the human's work most critical? <!-- quiz: q02 revision: 2 -->
   - A. Investigate: find all the relevant files yourself, then hand them over
   - B. Act: watch every single edit it makes and approve each one by one
   - C. Approving the plan, then reading the diff and running tests afterward
   - D. Writing a clear goal is enough; the remaining steps can all be left to it
   > **Answer: C.** Letting the AI do the work, the human guards two gates: **approve the plan before acting, sign off on the change after acting.** Grunt work like investigating and editing goes to it (A, B); you just skim and stay ready to stop it. D gives up both gates.

3. **[Basic · Misconception]** "It's AI, the code it writes should be correct, just merge it." What's wrong? <!-- quiz: q03 revision: 3 -->
   - A. It can be confidently wrong; don't merge changes you haven't signed off
   - B. Nothing; as long as the code runs, that alone shows it must be correct
   - C. The mistake is not asking it to confirm that there's really no problem
   - D. The mistake is not rewriting it all; its code always needs a human to redo it
   > **Answer: A.** Hallucination (Chapter 9) happens when writing code too: inventing functions that don't exist, using the syntax of the wrong version. Running isn't the same as correct (B); having it vouch for itself isn't verification (C); rewriting everything goes to the other extreme (D). Read the diff, run the checks, and have it explain anything that's unclear.

4. **[Advanced · Misconception]** "Having it do a whole big feature in one go is easiest." Why is it often more work? <!-- quiz: q04 revision: 2 -->
   - A. It isn't; stating a big task once actually saves back-and-forth messages
   - B. It can only change one file at a time, so a big feature takes many rounds
   - C. Big changes are hard to check line by line, and errors are hard to find or undo
   - D. The only issue is that big tasks use more of your allowance; nothing else differs
   > **Answer: C.** A big change is a big blind spot: the diff is too long to read, mistakes hide in the pile, and rollback isn't clean. Breaking the task small, seeing the plan first, and signing off in small steps is actually fastest (Chapter 27). B is wrong: it can change many files at once, and that is exactly the problem. D sees only the allowance and misses the trouble with checking and rolling back.

5. **[Basic · Scenario]** You have it change code, it goes off track and gets messier. What's the best move to cut losses? <!-- quiz: q05 revision: 2 -->
   - A. Keep correcting it line by line in the same conversation until it's right
   - B. Roll back to a clean state and start a new chat that names the pitfalls
   - C. Have it make another pass over the current changes to overwrite the errors
   - D. Delete the whole project and have it generate everything again from scratch
   > **Answer: B.** Grinding away inside a scrambled context (A, C) usually just makes things worse. **Rolling back + reopening a clean conversation that carries the lesson** is almost always faster (Chapters 13, 30). Committing or backing up existing work first gives you a recovery point (Git basics are in Chapter 26). Roll back only this task's changes; deleting the project (D) throws away the good parts too. Git cannot undo external actions.

6. **[Advanced · Hands-on / Observation]** No need to actually install a tool: find a code change (or the diff example in Chapter 25) and run it through Chapter 25's three sign-off questions: What did it change? Did it actually do the job without breaking anything else? If something is wrong, how costly is it, and can you undo it? If you can't answer the first, go back and have it explain in plain words. <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** Signing off isn't mysterious; it's these three questions, and none of them requires reading every line of code. The first is answered by its plain-language explanation checked against the diff, the second by the acceptance steps you wrote beforehand plus tests, the third by looking at risks and the way back. The habit of "no merge until I can answer all three" matters more than knowing any command. Installation and specific commands are in Chapters 28 and 29 and Appendix C.
