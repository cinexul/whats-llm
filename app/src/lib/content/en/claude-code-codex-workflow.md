> 〔Wherever this chapter touches a specific product's installation, commands, interface, or capabilities, those change with each version, so always **refer to the provider's official documentation**. This chapter only covers the mental model and workflow that are **shared and stable** across these two kinds of tools, and that part won't go out of date. For word-for-word installation and commands, see Chapters 28 and 29 and Appendix C.〕

In Chapter 19 we met the Agent: an AI that "takes action on its own." The stars of this chapter, **Claude Code** and **Codex**, are Agents that specialize in "programming." You describe something in plain words, and it will **go and read files in the project, edit code, and run commands on its own**, instead of just handing you text to copy and paste.

Don't get nervous about the word "programming." **This chapter does not require you to write code.** What we're learning is "how to work alongside a helper like this that takes action": what work to assign, how to tell whether it did it right, and how to recover when things go sideways. Anyone who knows their way around a computer can learn this workflow, and once you have it, you'll feel a whole new kind of control over "letting AI do things for you."

## 1. What are they, exactly

Claude Code and Codex aren't some fixed button on a web page. They're a kind of **coding agent that takes action on your project**. You'll usually run into them in a **terminal (command line), a code editor (IDE), a web task, or a cloud environment**; **some run on your own machine, some run in the cloud — the exact form varies and keeps changing, so go by the provider's official documentation for the current form**. What they have in common is:

- **They can see your project:** they browse folders and read code on their own to understand the current state, instead of only knowing the few lines you pasted in.
- **They can take action:** edit files directly, run commands (like running tests), and go online to look things up when needed.
- **They can run several steps in a row:** toward the goal you gave, they run the "look, edit, try, edit again" loop on their own.

> **Key point:** Claude Code comes from Anthropic and its core is Claude; Codex comes from OpenAI. These two "who makes it / what's inside it" facts are stable. But **their specific form (CLI / IDE plugin / web / cloud), how they install, their commands, and their capabilities all differ, and all of it is updating fast**, so this chapter doesn't write "press this key, type that command, run it here" (those are volatile, a matter for Chapters 28 and 29, Appendix C, and the official documentation). This chapter covers **the shared way they get work done**: learn it once, and it carries across both tools without dating easily.

## 2. The fundamental difference from "web chat"

| | Web/app chat (product layer) | Coding agent (Agent layer) |
| --- | --- | --- |
| How it treats code | Hands you text you go use yourself | **Edits the files in your project directly** |
| How much it knows | Only what you pasted in | **Explores the whole project** on its own to understand the state |
| How it moves forward | You ask, it answers | **Takes several steps toward the goal on its own** |
| Consequence of a mistake | At worst a wrong answer you don't use | It actually touched your files, **so you need to be able to roll back** |

That last row is the key one: because it **really will touch your stuff**, "using it in an environment you can undo" isn't a nicety — it's a precondition (more in section five below).

## 3. The mental model: treat it like "a capable new coworker who just started"

The whole book keeps using this comparison, and it fits best here: **Claude Code / Codex is like a coworker who is very capable and very fast but started on day one.**

- They're **quick on their feet:** the grunt work you hand over gets done fast and in volume.
- They **don't know your project's habits:** they don't know your rules, your naming, your minefields, so you have to tell them (the "project onboarding notes" in Chapter 28 are for exactly this).
- They **will be confidently wrong:** they might use a way of writing code that doesn't exist at all (that's the "hallucination" of Chapter 9, and it happens when writing code too).
- So **you're the one showing them the ropes.** The work can go to them, but **assigning it and signing off are your job, and in the end yours is the name on it.**

> **Key point:** Remember this sentence for life: **"Don't let through what you don't understand and haven't verified."** Them finishing isn't the same as them getting it right. You don't have to write every line, but you do have to be able to judge "did this thing work or not," and the workflow in section four of this chapter is what turns that judgment into something concrete.

## 4. The core workflow: investigate -> plan -> act -> sign off

Almost every task that goes smoothly follows the same four-step loop. **The two "gates" in the middle are guarded by a human**, the rest goes to the AI:

```text
   you give the goal
      │
      ▼
 1.investigate ──→ 2.plan ──→ 【human approves】──→ 3.act ──→ 4.sign off ──→ 【human lets through】
(it reads project) (it drafts plan)  ↑gate 1     (it edits files) (read diff/run tests) ↑gate 2
```

**1. Investigate (it does it, you take a look)**
Don't rush it into "start editing." Have it **investigate first**: "To do this, which files is the relevant code in? How is it implemented now?" It'll go through the project and give you a written rundown with locations. You skim it and confirm it didn't find the wrong place.
> Example one-line instruction: *"Don't act yet, just investigate: to add a search box to the page, which files are involved and how is it done now?"*

**2. Plan (it does it, you approve) - gate 1**
Have it **write down a plan** for "how it intends to change things": which files it'll touch, whether it'll add anything new, how many steps. **It only starts acting once you've read the plan and approved.** This step takes half a minute and blocks most of the "went off track for half an hour" rework. Many tools have a built-in "plan first, approve, then act" mode (Chapter 27 covers it in detail; **the exact name and toggle are a matter for the official documentation**).

**3. Act (it does it, you can stop it anytime)**
After approval it starts editing. Whether file edits and commands need individual confirmation depends on the tool, sandbox, and permission settings; **actions already authorized may run automatically**. Check the allowed scope before starting, and use the agreed approval rules for deletion, publication, and external sends (Chapter 26). If you feel it's going crooked, **interrupt anytime**, say it clearly, and let it continue.

**4. Sign off (you do it) - gate 2**
This is **your most important step**, and it's just three moves (Chapter 25 explains them in detail):
- **Read the diff:** a diff is "the before-and-after comparison of the change," and it clearly marks "which lines were added, which were removed." You see **what it actually changed** and whether it touched anything it shouldn't have.
- **Run tests:** have it run the tests to confirm it **didn't break a feature that was working fine.**
- **Can you explain it:** try to say in one sentence "what this bit does." If you can't, go back and ask it "what does this bit do." **Don't merge what you can't follow.**

> **Why must there be these two gates?** Because of the two traits of a coding agent stacked together: **it will make mistakes + it can take action.** As long as both of those are true, "see the plan before acting, sign off after acting" isn't optional. Hold these two gates, and you can hand off the rest of the grunt work without worry.

## 5. The first time you run it, what to expect

Let's lower expectations a bit, so you're not scared or disappointed by the "ideal AI" in your head:

1. **Set up an environment you can undo first.** **When it's acting on your local project**, be sure it's a project managed with **version control (Git)**, and **cut a new branch** before letting it act (if you've never used Git, read "Git: the bare minimum to get started" in Chapter 26 first). **Save existing work and commit or back up the files you need before starting. A branch is not a backup**: Git can restore saved versions, but cannot recover files it never tracked or undo emails, deployments, or changes to external data. (If you're using a web/cloud form, the platform usually has its own isolation and rollback; refer to its official documentation.)
2. **It'll "read for a while" first.** It needs time to browse the project; don't assume it's stuck.
3. **Read the permission settings and confirmation requests.** Some actions require confirmation; others run within the scope already authorized. No prompt does not mean no risk.
4. **It might make mistakes and go off track.** Normal. When this happens, **don't fix it inside the mess.** The cleanest way to cut losses: **roll back to a clean state, open a new conversation, and re-explain things with "the pothole you just hit" as a premise** (Chapters 13, 30). Chasing it line by line inside a scrambled context usually makes things worse.
5. **Without going online it doesn't know the latest things.** For very new tech, remember to **state the version clearly** in what you say, or paste the material to it (the knowledge cutoff from Chapter 9).

> **What it's actually like:** The most common way beginners go off the rails is "having it do a whole big feature in one go." With a big change, you simply can't sign off line by line, and when something goes wrong it's hard to roll back. **The right move is to break the task small**: do one little piece, sign off on one little piece, commit once, then do the next (Chapter 27). Small steps at a slow jog turn out to be the fastest road.

## 6. Safety and cost, on your mind from day one

- **Don't paste keys/passwords/real personal information** into the conversation or write them into code; they'll get sent out (Chapter 37).
- **Distinguish subscription usage allowances from metered API billing.** Some interfaces use a subscription allowance; others bill through an API or cloud platform. Check the account, interface, and official terms. Longer context can increase usage, but every chat does not turn into the same token bill; focused tasks still reduce unnecessary processing (Chapters 3, 38).
- The code it generates **counts as your responsibility**: review it before merging and stand behind it (Chapter 39).

## 7. Claude Code and Codex: where they're alike, where they differ

| | Same (this chapter's focus, stable) | Different (**see the official documentation**, will change) |
| --- | --- | --- |
| Positioning | Both are coding agents that "take action on your project" | Maker, core model, and **run form (local / cloud / web)** differ |
| Workflow | Both fit the "investigate -> plan -> act -> sign off" loop | Specific commands, shortcuts, and interfaces vary |
| Safety | Both should be set up with a permission mechanism + an undo-friendly environment | Default behavior and permission granularity differ |
| Getting started | Both: try small steps in a Git branch first | Installation and login differ |

> **Key point:** The workflow you learn in this chapter **works whichever tool you switch to**, because it comes from the unchanging truth of "how to mentor an Agent that makes mistakes," not from some product's buttons. For the specifics of "how to install, what to type," see Chapters 28 and 29 and Appendix C, and **treat the official documentation as the latest source.**

## 8. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| It's AI, the code it writes should be right, merge it directly | It will confidently get it wrong; read the diff, run tests, don't merge what you can't follow |
| Having it do a whole big feature in one go is easiest | Big changes are hard to sign off on and hard to roll back; break it small and sign off in small steps to go fastest |
| It remembers my whole project and yesterday's conversation | The model itself works on "reading the project each time + this conversation's context," with no cross-conversation memory by default; but many tools provide "project memory" at the **product layer** (like CLAUDE.md / a project context file) so it remembers your project's rules across sessions. That's a product feature, not the model itself remembering (Chapters 9, 28) |
| I can't program, so I can't use it | You don't have to write every line, but you do need "assigning work + the three sign-off questions"; the bar is judgment, not typing code |
| When it goes off track, keep chasing it with fixes | Roll back + open a new conversation and start over; grinding away inside a scrambled context usually makes it worse |

## Summary

- Claude Code / Codex are a kind of coding agent that **takes action in your project**; whether you use it in a terminal, an editor, the web, or the cloud depends on the product. **The exact form varies and keeps changing, so refer to the official documentation.**
- The fundamental difference from web chat: it **edits files directly, explores the project on its own, and takes several steps in a row**, so it has to be used in an environment you can **roll back**.
- Mental model: **a capable new coworker who just started**; the work can go to them, but **assigning it and signing off are your job.**
- The core workflow is **investigate -> plan -> 【human approves】-> act -> sign off -> 【human lets through】**, with the human guarding two gates: approving the plan and signing off on the change (read the diff, run tests, explain it clearly).
- First time using it: save your work and create a Git branch first (Git basics are in Chapter 26), break the task small, roll back and start over if it goes off track, never paste keys.
- This workflow **doesn't depend on the specific tool**, because it comes from "how to mentor an Agent that makes mistakes." Learn it once, it works everywhere.

The next chapter (Chapter 25) covers the step in this workflow most worth practicing: reading the diff, running tests, rolling back, and signing off. Installation and your first hands-on session come in Chapters 28 and 29.

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

3. **[Basic · Misconception]** "It's AI, the code it writes should be correct, just merge it." What's wrong? <!-- quiz: q03 revision: 2 -->
   - A. It can be confidently wrong; don't merge what you can't follow or verify
   - B. Nothing; as long as the code runs, that alone shows it must be correct
   - C. The mistake is not asking it to confirm that there's really no problem
   - D. The mistake is not rewriting it all; its code always needs a human to redo it
   > **Answer: A.** Hallucination (Chapter 9) happens when writing code too: inventing functions that don't exist, using the syntax of the wrong version. Running isn't the same as correct (B); having it vouch for itself isn't verification (C); rewriting everything goes to the other extreme (D). Read the diff, run tests, and ask for clarity on what you can't follow.

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

6. **[Advanced · Hands-on / Observation]** No need to actually install a tool: find a code change you can follow (or the diff example in Chapter 25) and practice answering just three questions: **what did it change? could it break anything else? can I say in one sentence what this bit does?** If you can't answer the third, go back and ask "what does this bit do." <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** "Signing off" isn't mysterious — it's these three questions. Building the muscle memory of "don't let it through if you can't follow it" matters more than knowing any command. The installation and commands of specific tools: **refer to the official documentation** (see Chapters 28 and 29 and Appendix C).
