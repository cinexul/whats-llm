> 〔Wherever this chapter touches a specific product's installation, commands, interface, or capabilities, those change with each version, so always **check the official docs**. This chapter only covers the mental model and workflow that are **shared and stable** across these two kinds of tools, and that part won't go out of date. For word-for-word installation and commands, see Chapter 25 and Appendix C.〕

In Chapter 19 we met the Agent: an AI that "takes action on its own." The stars of this chapter, **Claude Code** and **Codex**, are Agents that specialize in "programming." You describe something in plain words, and it will **go and read files in the project, edit code, and run commands on its own**, instead of just handing you text to copy and paste.

Don't get nervous about the word "programming." **This chapter does not require you to write code.** What we're learning is "how to work alongside a helper like this that takes action": what work to assign, how to tell whether it did it right, and how to recover when things go sideways. Any ordinary person who knows their way around a computer can learn this workflow, and once you have it, you'll feel a whole new kind of control over "letting AI do things for you."

## 1. What are they, exactly

Claude Code and Codex aren't some fixed button on a web page. They're a kind of **coding agent that takes action on your project**. You'll usually run into them in a **terminal (command line), a code editor (IDE), a web task, or a cloud environment**; **some run on your own machine, some run in the cloud, the exact form varies and is being updated, so check the official docs / the product's official form**. What they have in common is:

- **They can see your project:** they browse folders and read code on their own to understand the current state, instead of only knowing the few lines you pasted in.
- **They can take action:** edit files directly, run commands (like running tests), and go online to look things up when needed.
- **They can run several steps in a row:** toward the goal you gave, they run the "look, edit, try, edit again" loop on their own.

> **Key point:** Claude Code comes from Anthropic and its core is Claude; Codex comes from OpenAI. These two "who makes it / what's inside it" facts are stable. But **their specific form (CLI / IDE plugin / web / cloud), how they install, their commands, and their capabilities all differ, and all of it is updating fast**, so this chapter doesn't write "press this key, type that command, run it here" (those are volatile, a matter for Chapter 25, Appendix C, and the official docs). This chapter covers **the shared way they get work done**: learn it once, and it carries across both and doesn't date easily.

## 2. The fundamental difference from "web chat"

| | Web/app chat (product layer) | Coding agent (Agent layer) |
| --- | --- | --- |
| How it treats code | Hands you text you go use yourself | **Edits the files in your project directly** |
| How much it knows | Only what you pasted in | **Explores the whole project** on its own to understand the state |
| How it moves forward | You ask, it answers | **Takes several steps toward the goal on its own** |
| Consequence of a mistake | At worst a wrong answer you don't use | It actually touched your files, **so you need to be able to roll back** |

That last row is the key one: because it **really will touch your stuff**, "using it in an environment you can undo" isn't a nicety, it's a precondition (more in section five below).

## 3. The mental model: treat it like "a capable new coworker who just started"

The whole book keeps using this comparison, and it fits best here: **Claude Code / Codex is like a coworker who is very capable and very fast but started on day one.**

- They're **quick on their feet:** the grunt work you hand over gets done fast and in volume.
- They **don't know your project's habits:** they don't know your rules, your naming, your minefields, so you have to tell them (the "project onboarding notes" in Chapter 28 are for exactly this).
- They **will be confidently wrong:** they might use a way of writing code that doesn't exist at all (that's the "hallucination" of Chapter 9, and it happens when writing code too).
- So **you're the one showing them the ropes.** The work can go to them, but **assigning it and signing off are your job, and your name is finally on it.**

> **Key point:** Remember this sentence for life: **"Don't let through what you don't understand and haven't verified."** Them finishing isn't them being correct. You don't have to write every line, but you do have to be able to judge "did this thing work or not," and the workflow in section four of this chapter is what turns that judgment into something concrete.

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
Have it **write down a plan** for "how it intends to change things": which files it'll touch, whether it'll add anything new, how many steps. **It only starts acting once you've read the plan and approved.** This step takes a few dozen seconds and blocks most of the "went off track for half an hour" rework. Many tools have a built-in "plan first, approve, then act" mode (Chapter 27 covers it in detail; **the exact name and toggle are a matter for the official docs**).

**3. Act (it does it, you can stop it anytime)**
After approval it starts editing. Each time it's about to do something "with consequences" (edit a file, run a command), it'll usually **stop and ask your permission** (the "permission mechanism" of Chapter 26). If you feel it's going crooked, **interrupt anytime**, say it clearly, and let it continue.

**4. Sign off (you do it) - gate 2**
This is **your most important step**, and it's just three moves (Chapter 25 explains them in detail):
- **Read the diff:** a diff is "the before-and-after comparison of the change," and it clearly marks "which lines were added, which were removed." You see **what it actually changed** and whether it touched anything it shouldn't have.
- **Run tests:** have it run the tests to confirm it **didn't break a feature that was working fine.**
- **Can you explain it:** try to say in one sentence "what this bit does." If you can't, go back and ask it "what does this bit do." **Don't merge what you can't follow.**

> **Why must there be these two gates?** Because of the two traits of a coding agent stacked together: **it will make mistakes + it can take action.** As long as both of those are true, "see the plan before acting, sign off after acting" isn't optional. Hold these two gates, and you can hand off the rest of the grunt work without worry.

## 5. The first time you run it, what to expect

Let's lower expectations a bit, so you're not scared or disappointed by the "ideal AI" in your head:

1. **Set up an environment you can undo first.** **When it's acting on your local project**, be sure it's a project managed with **version control (Git)**, and **cut a new branch** before letting it act (Chapter 26 walks you through it). That way if it scrambles something, one move takes you back to a clean state; that's your biggest safety net. (If you're using a web/cloud form, the platform usually has its own isolation and rollback; check the official docs.)
2. **It'll "read for a while" first.** It needs time to browse the project; don't assume it's stuck.
3. **It'll check in with you often.** That's a good thing, it's the "permission mechanism" protecting you, not it being dumb.
4. **It might make mistakes and go off track.** Normal. When this happens, **don't fix it inside the mess.** The cleanest way to cut losses: **roll back to a clean state, open a new conversation, and re-explain things with "the pothole you just hit" as a premise** (Chapters 13, 30). Chasing it line by line inside a scrambled context usually makes things worse.
5. **Without going online it doesn't know the latest things.** For very new tech, remember to **state the version clearly** in what you say, or paste the material to it (the knowledge cutoff from Chapter 9).

> **What it's actually like:** The most common rookie crash is "having it do a whole big feature in one go." With a big change, you simply can't sign off line by line, and when something goes wrong it's hard to roll back. **The right move is to break the task small**: do one little piece, sign off on one little piece, commit once, then do the next (Chapter 27). Small steps, slow jog, turns out to be the fastest road.

## 6. Safety and cost, on your mind from day one

- **Don't paste keys/passwords/real personal information** into the conversation or write them into code; they'll get sent out (Chapter 37).
- This kind of tool **bills by token**; the more files you have it read and the longer you chat, the faster it spends. Keep the task focused and the conversation clean: it saves money and improves quality (Chapters 3, 38).
- The code it generates **counts as your responsibility**: review it before merging and stand behind it (Chapter 39).

## 7. Claude Code and Codex: where they're alike, where they differ

| | Same (this chapter's focus, stable) | Different (**check the official docs**, will change) |
| --- | --- | --- |
| Positioning | Both are coding agents that "take action on your project" | Maker, core model, and **run form (local / cloud / web)** differ |
| Workflow | Both fit the "investigate -> plan -> act -> sign off" loop | Specific commands, shortcuts, and interfaces vary |
| Safety | Both should be set up with a permission mechanism + an undo-friendly environment | Default behavior and permission granularity differ |
| Getting started | Both: try small steps in a Git branch first | Installation and login differ |

> **Key point:** The workflow you learn in this chapter **works whichever tool you switch to**, because it comes from the unchanging truth of "how to mentor an Agent that makes mistakes," not from some product's buttons. For the specifics of "how to install, what to type," see Chapter 25 and Appendix C, and **treat the official docs as the latest source.**

## 8. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| It's AI, the code it writes should be right, merge it directly | It will confidently get it wrong; read the diff, run tests, don't merge what you can't follow |
| Having it do a whole big feature in one go is easiest | Big changes are hard to sign off on and hard to roll back; break it small and sign off in small steps to go fastest |
| It remembers my whole project and yesterday's conversation | The model itself works on "reading the project each time + this conversation's context," with no cross-conversation memory by default; but many tools provide "project memory" at the **product layer** (like CLAUDE.md / a project context file) so it remembers your project's rules across sessions. That's a product feature, not the model itself remembering (Chapters 3, 28) |
| I can't program, so I can't use it | You don't have to write every line, but you do need "assigning work + the three sign-off questions"; the bar is judgment, not typing code |
| When it goes off track, keep chasing it with fixes | Roll back + open a new conversation and start over; grinding away inside a scrambled context usually makes it worse |

## Summary

- Claude Code / Codex are a kind of coding agent that **takes action in your project**, running in a terminal/editor; **the exact form varies and is updating, so check the official docs.**
- The fundamental difference from web chat: it **edits files directly, explores the project on its own, and takes several steps in a row**, so it has to be used in an environment you can **roll back**.
- Mental model: **a capable new coworker who just started**; the work can go to them, but **assigning it and signing off are your job.**
- The core workflow is **investigate -> plan -> 【human approves】-> act -> sign off -> 【human lets through】**, with the human guarding two gates: approving the plan and signing off on the change (read the diff, run tests, explain it clearly).
- First time using it: cut a Git branch first, break the task small, roll back and start over if it goes off track, never paste keys.
- This workflow **doesn't depend on the specific tool**, because it comes from "how to mentor an Agent that makes mistakes." Learn it once, it works everywhere.

In the next chapter, we'll get hands-on starting from "install it and get your first request working."

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's the most fundamental difference between a coding agent (like Claude Code / Codex) and a web chat AI?
   - A. The interface looks nicer
   - B. It can read and write your project files and run commands directly, instead of just handing you text to copy
   - C. It doesn't make mistakes
   - D. It doesn't use a model
   > **Answer: B.** A chat AI is "you copy and paste back and forth"; a coding agent "takes action directly in your project." That's exactly why it's efficient, and why it needs the "permission mechanism" watching it.

2. **[Basic · Concept]** In the "investigate -> plan -> act -> sign off" loop, at which step is the human's work most critical?
   - A. Investigate
   - B. Approving the plan + signing off (read the diff, run tests)
   - C. Act
   - D. The human doesn't take part
   > **Answer: B.** Letting the AI do the work, the human guards two gates: **approve the plan before acting, sign off on the change after acting.** The grunt work in the middle goes to it.

3. **[Basic · Misconception]** "It's AI, the code it writes should be correct, just merge it." What's wrong?
   - A. Nothing
   - B. It will confidently write wrong/nonexistent things; **a change you can't follow and haven't verified shouldn't be merged**
   - C. What it writes never runs
   - D. Merging costs money
   > **Answer: B.** Hallucination (Chapter 9) happens when writing code too: inventing functions that don't exist, using the syntax of the wrong version. Read the diff, run tests, and ask for clarity on what you can't follow.

4. **[Advanced · Misconception]** "Having it do a whole big feature in one go is easiest." Why is it often more work?
   - A. No, the bigger the cheaper
   - B. The bigger the change the easier it goes off track, and it's too big for you to sign off line by line, and hard to roll back when something goes wrong
   - C. It can only change one file at a time
   - D. Big tasks cost extra
   > **Answer: B.** A big change = a big blind spot. Breaking the task small, seeing the plan first, signing off in small steps is actually fastest (echoing Chapter 27).

5. **[Basic · Scenario]** You have it change code, it goes off track and gets messier. What's the best move to cut losses?
   - A. Keep chasing it with line-by-line corrections
   - B. Use version control to roll the change back to a clean state, then open a new conversation and re-explain things with "the pothole you hit" as a premise
   - C. Delete the project and redo it
   - D. Turn off the computer
   > **Answer: B.** Grinding away inside a scrambled context usually makes it more crooked. **Rolling back + reopening a clean conversation that carries the lesson** is almost always faster (echoing Chapters 13, 30). Starting in Git and cutting a branch first is for exactly this moment.

6. **[Advanced · Hands-on / Observation]** No need to actually install a tool: find a code change you can follow (or the diff example in Chapter 25) and practice answering just three questions: **what did it change? could it break anything else? can I say in one sentence what this bit does?** If you can't answer the third, go back and ask "what does this bit do."
   > **What you should notice:** "Signing off" isn't mysterious, it's these three questions. Building the muscle memory of "don't let it through if you can't follow it" matters more than knowing any command. The installation and commands of specific tools: **check the official docs** (see Chapter 25 and Appendix C).
