In Chapter 19 we met the Agent: an AI that doesn't just answer once, but breaks a goal down, calls tools, and takes several steps in a row. This chapter looks at the most mature kind of Agent, and the one most relevant to ordinary people: the coding agent. Its best-known examples are Claude Code and Codex.

You don't need to write code for this chapter. What we want to pin down is what a coding agent is, how far it can go, what you shouldn't count on, and who is responsible in the end. Once that is clear, the moves in the next few chapters (reading diffs, running tests, rolling back, reviewing plans) will make sense, because you'll know what each one guards against.

## 1. It's a kind of Agent: it gets things done, not just writes code

Many people picture "AI for programming" as web chat: you ask "how do I write a sort function?", it gives you a block of code, and you copy it (Chapter 17 covered the model, product, and Agent layers). A coding agent sits one layer higher. It uses writing code as a means to get a job done.

| | "Writes code" (chat layer) | "Gets things done" (agent layer) |
| --- | --- | --- |
| What you give it | A specific small question | A goal ("add a search box to this site") |
| What you get back | Text that you go and use | It reads files, edits code, and runs commands until the job is done |
| How much it knows | Only the lines you pasted | It explores the whole project to see how things stand |
| How it moves | You ask, it answers | Several steps toward the goal: look, edit, try, edit again |

This is Chapter 19's Agent loop applied to programming: read the project (perceive) → work out an approach (decide) → edit files and run commands (act) → check whether the result is right (perceive again), round and round on its own. So a coding agent is simply Chapter 19's hands-on Agent, working inside your code project. If you treat it as a smarter search box, you'll underestimate both what it can do and the damage it can cause.

## 2. Where you use it: it depends on the product

As of October 2026, Claude Code (made by Anthropic, running on Claude models) and Codex (made by OpenAI) both offer several ways in: a command-line program in the terminal, code editor extensions, a desktop app, and the web. Some entry points edit files and run commands directly on your own computer; others run the task in an isolated cloud environment. Which entry points a product has, and where the work runs, depends on the product and the entry point you pick, and it keeps changing.

That's why this book collects the details that change in Chapters 28 and 29 and Appendix C. These chapters stick to what stays the same whichever entry point you use: how it works, and how you lead it.

## 3. The mental model: a capable new coworker on their first day

Picture Claude Code or Codex as a coworker who is quick and very capable but started today and knows nothing about your company. Each side of that picture matches a real trait:

- Fast hands: the grunt work you hand over gets done quickly and in volume. That's its biggest value.
- Doesn't know your ways: the project's rules, naming habits, and no-go areas are unknown to it unless you say so. (Chapter 28 shows how to write those rules down for it.)
- Confidently wrong: it may use a way of writing code that doesn't exist, with a perfectly straight face. That's Chapter 9's hallucination, and it happens with code too; because code looks professional, it fools non-experts more easily.
- Knowledge with an expiry date: very new technology may be unknown to it, or remembered as an older version, unless you give it current material (Chapter 9).

A good mentor for a coworker like that neither walks away nor does everything themselves: they assign work, watch the key moments, and check the result at the end. Many people start by treating it as a fully automatic code machine: drop in a request, wait, use whatever comes out. It's closer to an intern you supervise than to a contractor you hand the keys to. You don't need to write every line, but you do need to assign work and judge whether it was done right.

## 4. Responsibility stays with people

Finished isn't the same as correct, and "done!" doesn't mean it actually worked. It makes mistakes, and it really can change your things. Put those together and you get the most awkward outcome: it confidently breaks your project and then reports "complete."

So however strong the tools get, one line doesn't move: before a change is merged into your project, handed to a client, or put under your name, reviewing and signing off on it is your responsibility (Chapter 39 covers responsibility for AI-generated content).

How does someone who can't program sign off? You don't need to read every line of code. You do need to do a few concrete things: write down beforehand what "done" looks like, then check it yourself step by step after the change; have the agent explain in plain words what it changed and where the risks are; for anything that touches money, personal data, passwords or keys, deleting files, or publishing, get a second review from a fresh agent session or a person who knows the subject; and never run anything you can't roll back. Chapter 25 turns these into a concrete routine.

> **Key point:** Only when you hold the sign-off gate does all that fast, high-volume work turn into time actually saved. What tells you whether the job really worked is concrete checks, not reading every line of code.

## 5. How the next chapters fit together

Put the points above together and you have a map of the next few chapters:

- It acts and it makes mistakes, so it needs a fixed order of work: Chapter 24's "investigate → plan → act → sign off."
- Changes need checking: Chapter 25 covers reading diffs, running checks, rolling back, and signing off. It's the chapter in Part 4 most worth practicing.
- It really changes your things: Chapter 26 shows how to let it act in an environment you can undo, and how to make it ask before risky actions.
- Big jobs shouldn't be done in one go: Chapter 27 covers getting a plan first, approving it before any action, and breaking big tasks into small steps you sign off one at a time.

## 6. Common misconceptions

| Misconception | Reality |
| --- | --- |
| A coding agent is just a chat AI that's better at code | It's a hands-on Agent (Chapter 19): it reads the project, edits files, runs commands, and takes several steps |
| It's one particular website or program with a fixed form | Terminal, editor, desktop app, and web entry points exist, running locally or in the cloud, depending on the product |
| It's AI, so its code should be right; use it as is | It can be confidently wrong; finished isn't correct, so sign-off is needed |
| I can't program, so I can't use it | You don't need to write every line; you need to assign work and use concrete checks to judge the result |
| Once it says "done," responsibility passes to it | The name and the responsibility stay with you; review before merging or delivering is a human job (Chapter 39) |

## Summary

- A coding agent (Claude Code, Codex) is Chapter 19's hands-on Agent applied to programming: it reads the project, edits files, runs commands, and takes several steps to get a job done.
- Entry points include the terminal, editors, a desktop app, and the web; whether the work runs locally or in the cloud depends on the product. The details that change are in Chapters 28 and 29 and Appendix C.
- Mental model: a capable new coworker on their first day, quick and willing, but unaware of your rules and sometimes confidently wrong.
- Responsibility stays with people. You don't need to read every line, but you do need concrete checks that it did the job right (Chapter 25).
- The next chapters cover the workflow (Chapter 24), signing off (Chapter 25), permissions and rollback (Chapter 26), and planning first (Chapter 27).

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** Lining up "coding agent" with the "Agent" from Chapter 19, which sentence is most accurate? <!-- quiz: q01 revision: 2 -->
   - A. It's a kind of Agent; the place where it takes action is your code project
   - B. It's an upgraded chat AI; the main difference is that it writes code more accurately
   - C. It's separate from an Agent: an Agent acts, while it only suggests code
   - D. An Agent is a small built-in feature of it, used only for looking things up
   > **Answer: A.** The Chapter 19 Agent is an AI that breaks goals into steps, calls tools, and runs several steps on its own; a coding agent is that same ability aimed at "changing a code project." B sees only the "writing code" part and misses that it reads the project, edits files, and runs commands itself. C is still stuck on the old impression that "chat AI only gives text," and D gets the relationship backward.

2. **[Basic · Concept]** For a coding agent, what's the difference between "writing code" and "doing things"? <!-- quiz: q02 revision: 3 -->
   - A. No real difference; "doing things" is just a phrase vendors use for marketing
   - B. One hands you code to use; the other reads, edits files, and runs commands itself
   - C. "Doing things" means it can write a longer, more complete program in one go
   - D. The difference is speed: the one that "does things" simply answers faster
   > **Answer: B.** This is exactly the line between the chat layer and the agent layer: the former gives you text and you execute; the latter executes itself and takes several steps in a row. C and D read the difference as "writes more" or "answers faster," but the key is who takes action. A overlooks that it really does change your files.

3. **[Basic · Misconception]** "It's AI, the code it writes should be correct, use it straight away." What's wrong with that? <!-- quiz: q03 revision: 2 -->
   - A. AI code is usually right; it just needs a tidy-up for consistent style
   - B. AI code usually doesn't run, so you should rewrite whatever you get back
   - C. Only the free version makes mistakes; code from a paid plan can be used as-is
   - D. It can be confidently wrong; "finished" isn't "correct," so verify it first
   > **Answer: D.** Hallucination (Chapter 9) happens when writing code too, and because code looks "professional" it fools non-experts more easily. That's why later chapters teach "read the diff, run tests." A understates the problem. B goes to the other extreme; it often does run, the problem is that "runs" isn't "correct." C assumes paying prevents mistakes, but every version can get things wrong.

4. **[Advanced · Misconception]** "Claude Code / Codex is one fixed website (or one piece of software), the form is set in stone." Why does thinking this way cause trouble? <!-- quiz: q04 revision: 2 -->
   - A. It doesn't; the mainstream form won't change much over the next few years
   - B. It does, because they actually only run inside a web page in the cloud
   - C. The form varies and keeps updating; pin it down and you're soon out of date
   - D. It does, because they only work at a command line, with no visual interface at all
   > **Answer: C.** Form is in the "will change" category: depending on the product you might use it in a terminal, an editor, the web, or the cloud. So this book only covers the mental model that won't date and leaves "where to use it, how to install it" to the official docs. B and D just pin it to a different single form. Two things are stable, though: Claude Code comes from Anthropic (core: Claude), Codex comes from OpenAI.

5. **[Basic · Scenario]** Your first time using it, it says "feature added" in no time flat. As the "person showing it the ropes," what should you do next? <!-- quiz: q05 revision: 2 -->
   - A. Have it check its own work again, and merge if it says everything is fine
   - B. Sign off: what it changed, whether it broke anything, can you explain it
   - C. Have it build the next feature first, then check everything at the end
   - D. Ship it first to see how it goes, and have it fix whatever problems come up
   > **Answer: B.** "Finished isn't correct." It's like a capable coworker who just started, and signing off is the job of the person showing them the ropes (the three specific moves are in Chapter 25). A lets it grade its own work, which isn't a sign-off. C lets problems pile up and makes them harder to trace. D treats it as a "turnkey contractor," which is exactly the most common way things go off the rails.

6. **[Advanced · Hands-on / Observation]** No need to actually install anything: find a "does things vs only gives advice" contrast near you, for example "a navigation app that drives you through each turn" versus "a stranger who points you in a direction." Think about it: which is a coding agent more like? And where does it differ from a chat AI that "just hands you a block of code to copy"? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** A coding agent is like the navigation that "drives you through each turn": it executes itself and takes several steps in a row. A chat AI is like the stranger who "points a direction": it gives you information, but you walk the road yourself. The difference is "who takes action, and who takes several steps in a row." And precisely because it acts on its own and might point the wrong way, the "sign-off" gate has to stay with you (Chapters 25, 26). For the form, installation, and commands of specific tools, **defer to the official documentation**.
