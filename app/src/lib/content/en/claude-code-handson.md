〔Everything in this chapter about how Claude Code is installed, its commands, its interface, and what it can do will change as new versions ship, so always **refer to the official documentation**. This chapter only covers "what it is, when to use it, how to judge it, and what to watch out for"; for word-for-word commands and deeper features, see **Appendix C** and the official docs.〕

In Chapter 24 we walked through the general workflow of "investigate, plan, do, check" in full. This chapter and the next one are about **putting it to work on specific tools**: this chapter covers **Claude Code**, the next one covers **Codex**. The two chapters are split on purpose, because even though both share the same way of working, **how you install them, how you operate them, and the quirks of each** are not the same.

One reassuring thing first: **this chapter still doesn't ask you to know how to code.** What we want to build is the mental map you should have the first time you touch Claude Code: what it looks like, what this CLAUDE.md thing is actually doing, and the instincts behind the common operations. As for "which command to type, which key to press," this chapter pins down none of it and hands all of it to the official docs and Appendix C. Chapter 24 gave the reason: these things change too fast, and writing them into a book would only make it go stale, or even mislead you.

## 1. The minimal mindset for getting started: recognize that it "comes in several forms"

A lot of people get stuck on the first step because in their heads they picture Claude Code as "one fixed web page" or "one fixed software window." **It isn't.**

Claude Code comes from **Anthropic**, and its core is **Claude**. Those two points are stable facts you can lock in. But it **takes more than one form**: you might run into it in a terminal, in a code editor plugin, in a desktop or web interface, or even as a cloud task; **some of it runs on your own machine, some in the cloud — the exact forms differ and are still changing, so go by the official documentation and the product's own list of forms.**

So the right mindset for getting started comes down to three points:

- **Don't agonize over "what kind of software it actually is."** Go to the official docs to see "which form is recommended right now and how to install it," follow it once, and that's enough (**refer to the official documentation**).
- **Recognize that its core doesn't change.** Whatever the form, behind it is a Claude that will "read your project, change your files, and run commands" on its own. The method from Chapter 24 for directing it works in any form.
- **Don't overreach on the first try.** Once it's installed, run a minimal request on a **small project you can undo** (see Chapter 25 for details). Don't have it touch something important right out of the gate.

> **Key point:** Outsource the question of "what form Claude Code takes" **to the official docs**. What you bring in isn't "is it a web page or a command line" — it's the judgment from Chapter 24: what to assign it, and how to tell whether it did it right. Forms change; judgment doesn't.

## 2. CLAUDE.md = the "onboarding notes" for your project

This is the one Claude Code design most worth understanding for a non-technical reader, and it's the heart of this chapter.

Think back to that comparison from Chapter 24: Claude Code is like a **very capable coworker, but one who is on their first day on the job**. What's the new coworker's biggest problem? **They don't know your project's rules.** What style you tend to use, which spots are minefields you can't touch, what to type to run the tests, what your naming conventions are: they know none of it, and if you don't say so they'll go by their own assumptions and step on landmines.

**CLAUDE.md is the "onboarding notes" you write for this new coworker.** It's usually a text file kept in your project (**for the exact filename, where it goes, and how it takes effect, refer to the official documentation**), and inside it you write out this project's "rules" in plain words, for example:

- roughly what this project does and where the main files are;
- our code style and naming habits;
- which spots are off limits ("don't touch this config," "this directory is auto-generated, don't edit it by hand");
- how to run the tests and the checks.

With these notes, Claude Code can "read the rules first" before it starts each time, and avoid a lot of landmines. You also don't have to repeat all of this in every conversation: write it once, and it keeps working.

### A key clarification: this is "product-layer memory," not the model itself remembering

Here we **have to clear up the point that's easiest to misread**, and it ties directly back to Chapter 13 (and don't forget Chapters 3 and 9).

You might think, "Oh, so it can **remember** my project now." That's half right and half wrong.

> **The model itself really does have no cross-conversation memory.** Every time it starts from blank (Chapters 3 and 9). But **Claude Code adds a layer of "product-layer memory" outside the model**: those CLAUDE.md notes are **automatically put back into this turn's context by the product every time it starts work**, for the model to read. So it isn't that the model "grew a memory" — it's that **the product lays your project's rules back out on the "desk" for you every time** (back to that desk from Chapter 3). Lift the lid and underneath it's still "a model with no memory + context fed in fresh each time."

Why hammer this point home? Because once you get it, you can **predict its quirks** instead of putting blind faith in it:

- **If a rule isn't in the notes, it doesn't know it.** That unwritten convention you assume "it should get": as long as it isn't in CLAUDE.md (or in this conversation), it still doesn't know it. Don't blame it for "forgetting" — you never "fed" it.
- **The longer the notes, the more "desk" they take up.** Because they get put back into context every time (Chapter 3), notes that are long and rambling crowd out space and can bury the important parts. **Good notes are a "tight list of rules," not the whole project manual.**
- **It can "misread" too.** The notes being put back doesn't mean it follows every line. You still have to check the work (Chapters 24 and 27).

> **Key point:** When you see phrases like "project memory" or "project context file" (CLAUDE.md is one kind), don't feel it contradicts "the model has no memory" from Chapter 3. They're both thoughtful **product-layer** designs: **automatically putting what should be remembered back into context each time**. This is exactly an extension of that "desk" from Chapter 3, not the model itself remembering. For how to write it, where to put it, and how priority works, **refer to the official documentation**.

## 3. The instincts for common operations: only "what to do," not "which key to press"

Here are the few kinds of operations you're almost certain to use. **Note: this only covers "what it's for and when to use it." How exactly to trigger it (command, shortcut, button) is always something to check in the official docs.** This is exactly the book's safe approach: teach you the concept, and hand the volatile specific keys to the official source.

| What you want to do | Roughly what it is | What to keep in mind |
| --- | --- | --- |
| **Have it investigate only, not act** | Tell it in one line to "look but don't change yet" (the "investigate" step from Chapter 24) | This is the first move for saving rework; confirm first that it didn't look in the wrong place |
| **Have it produce a plan before acting** | Many forms have a built-in mode of "give a plan first, you approve, then it changes" | This is "gate 1" from Chapter 24; half a minute of planning blocks half an hour of rework (see Chapter 27) |
| **Permission confirmation** | Whenever it's about to do something "with consequences" (change a file, run a command) it usually stops and asks you | Don't mindlessly click "approve": this is the safety valve Chapter 26 covers in detail |
| **Look at the diff (before-and-after comparison)** | It marks "which lines were added, which were deleted" | This is the core act of checking the work; if you can't read it, don't let it through (Chapter 25) |
| **Use something like @ to reference a file** | Point it precisely to "this is the file I mean" | Far more efficient than letting it guess all over the project; **check the official source for the exact symbol** |
| **Interrupt / call a halt** | If you think it's going sideways, cut in anytime, explain, then let it continue | "Being able to halt it anytime" is a basic right of yours, not bothering it |

These together are the "steering wheel and brake" for working with Claude Code day to day. You'll notice they **all map to that workflow from Chapter 24**: investigate, approve the plan, look at the diff, halt anytime, just turned into "how exactly to do it" inside Claude Code. **And for that layer of "how exactly," always go by the official documentation.**

> **How you'll actually run into this:** The two most common beginner traps are: one, **mindlessly clicking "approve" at the permission prompt**, which is like ripping out the brakes (Chapters 26 and 30); two, **merging without bothering to look at the diff**, treating "it finished" as "it did it right" (Chapter 25). Claude Code leaves you a checkpoint for both of these. The trap isn't in the tool — it's in whether you actually went and looked.

## 4. Want to go deeper? It's all in "Appendix C," don't look for it here

Claude Code also has a whole pile of "advanced moves" that can make it more obedient and more powerful. But these are **exactly the parts that change most easily across versions**, so the book's handling is clear: **only name them here so you know they exist, and point all specific usage to Appendix C and the official docs.**

You may hear these terms someday. Just get to know the names for now; knowing "they're for extending Claude Code" is enough:

- **Slash commands**: a kind of shortcut instruction that starts with a slash inside the conversation, used to quickly trigger common features. **For the full list and usage, see Appendix C / the official docs.**
- **Config like settings.json**: a config file for setting its behavior in one place (for example the default permission scope). **Check the official source for the exact fields.**
- **Subagents**: have it spin off "copies" to handle subtasks in parallel.
- **MCP (connecting external tools)**: a standard interface for hooking it up to external tools and data sources (the concept was covered in Chapter 22).
- **Hooks / Skills**: automatically trigger actions you've set at specific moments, or give it a reusable set of abilities.

> **Key point:** These advanced features are powerful, but **for a non-programmer just getting started, none of them are the first step**. Your first step is always: in an environment you can undo (Chapters 25 and 27), use the workflow from Chapter 24 to **safely** run a small task through and check it off. Once you have a feel for "working with it," there's plenty of time to flip to **Appendix C** and unlock these advanced moves. **The exact commands, fields, and switches for all of these, take the official docs as the latest source.**

## 5. Safety and cost, on your mind from day one

These were mentioned in Chapter 24, and they're worth nailing down again for Claude Code, because it really will change your stuff and really does spend money by the token:

- **Set up an environment you can undo first.** When it acts on your **local project**, always have it act in a state managed by **version control (Git)** with a **new branch checked out** (step-by-step in Chapter 26). If it makes a mess, one move gets you back to a clean state; this is your biggest safety net. (Web / cloud forms usually have the platform's own isolation and rollback; **refer to the official documentation**.)
- **Never paste in keys, passwords, or real personal information.** Don't paste them into a conversation or write them into code; they'll be sent out (Chapter 37).
- **It bills by the token.** The more files you have it read and the longer you chat, the faster you spend. Keep the task focused and the conversation clean: it saves money and lifts quality (Chapter 38).
- **The code it generates is your responsibility.** Review before merging, and take responsibility for it (Chapter 39).

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| Claude Code is some one fixed web page / software | It has many forms (terminal / IDE / desktop / web / cloud) and is still changing; **refer to the official documentation** |
| Once I write CLAUDE.md, the model "remembers" my project | That's the **product layer** putting the notes back into context each time, not the model itself growing a memory (Chapters 3 and 13) |
| The more detailed and complete the notes, the better | They take up "desk" every time; long and rambling crowds out space and buries the important parts; a **tight list of rules** is what works |
| I have to learn all the slash commands / config before I can use it | The first step only needs the workflow from Chapter 24; advanced features are in Appendix C, no rush |
| Permission confirmation is just a hassle; clicking "approve" all the way is fine | That's like ripping out the brakes; it's a safety valve protecting you (Chapters 26 and 30) |
| If it says it's done, it did it right and I can merge | If you can't read it or haven't verified it, don't let it through; look at the diff, run the tests (Chapter 25) |

## Summary

- Claude Code comes from Anthropic and its core is Claude (stable facts); but it **takes many forms and is still changing**: for how to install and operate it, **refer to the official documentation**.
- **CLAUDE.md = the "onboarding notes" for your project**: write the project's rules once and it reads them automatically each time it starts. But this is **product-layer memory**: it puts the notes back into context each time, **not the model itself remembering** (Chapters 3 and 13).
- Common operations (investigate, produce a plan, permission confirmation, look at the diff, @ reference, halt anytime) all map to the workflow from Chapter 24; **refer to the official documentation for how exactly to trigger them**.
- Slash commands, settings.json, subagents, MCP, Hooks, Skills and other **deep features are all in Appendix C**, not the first step for getting started.
- On your mind from day one: check out a Git branch before acting, never paste in keys, spend sparingly by the token, take responsibility for what it generates.

In the next chapter we switch to **Codex**, and see how the same workflow plays out on OpenAI's tool: what's the same and what's different.

---

## Quiz

> Six questions, covering four types: concept, misconception, scenario, and hands-on. Think for yourself first, then read the answer in the quoted block.

1. **[Basic · Concept]** About Claude Code, which line is a **stable fact you can lock in**?
   - A. It's one fixed web page whose address never changes
   - B. It comes from Anthropic and its core is Claude; but the exact form (terminal / IDE / web / cloud) is varied and still changing
   - C. It can only run on your own computer
   - D. You must learn all the slash commands before you can use it
   > **Answer: B.** "The maker is Anthropic, the core is Claude" is a stable fact; while "what form it takes, how to install it, what commands to type" is the volatile part, so **refer to the official documentation**. A and C pin down the volatile form; D gets the bar backwards: getting started only needs the workflow from Chapter 24.

2. **[Basic · Concept]** What's the most fitting comparison for CLAUDE.md?
   - A. The model's brain
   - B. The "onboarding notes" for your project: writing this project's rules, minefields, and habits for that "new coworker on their first day"
   - C. A feature you have to pay to unlock
   - D. The model's permanent memory chip
   > **Answer: B.** It's the project's rules written for the "capable but newly arrived coworker" (Chapter 24), so it reads them first each time it starts and avoids landmines. D is the most off base: the model itself has no memory, see the next question.

3. **[Advanced · Misconception]** "I wrote CLAUDE.md, so the model now **remembers** my project." Where is this line inaccurate?
   - A. Completely accurate, the model remembers permanently from now on
   - B. The model itself has no cross-conversation memory; it's the **product layer** automatically putting these notes back into this turn's context each time it starts work, which creates the effect of "it remembers"
   - C. CLAUDE.md changes the model's parameters
   - D. The notes only take effect for paying users
   > **Answer: B.** This is exactly the "**model itself vs. product layer**" that Chapters 3 and 13 stress over and over. CLAUDE.md is product-layer memory: it **lays the rules back out on the "desk" each time**, not the model growing a memory. Once you get this you can predict it: if something isn't in the notes and wasn't said in this conversation, it still doesn't know it.

4. **[Advanced · Misconception]** "The more detailed and longer CLAUDE.md is the better, and stuffing in the whole project manual is the safest." Why does this often backfire?
   - A. It doesn't, longer is better
   - B. It gets put back into context every time (taking up "desk"); long and rambling crowds out space and buries the important parts, making mistakes more likely
   - C. A file that's too long freezes the computer
   - D. Long files cost extra
   > **Answer: B.** Back to that "desk" from Chapter 3: CLAUDE.md takes up room every time it starts. A **tight list of rules** works far better than "the whole manual": leave the space for the rules that really matter.

5. **[Basic · Scenario]** You just installed Claude Code and want to immediately have it make a big change to an **important project**. What's the safer first step?
   - A. Have it make the big change all at once on the important project directly
   - B. First find a small project you can undo, run a minimal request through on a new Git branch, and get used to the rhythm of "investigate, approve the plan, look at the diff" before anything else
   - C. Memorize all the slash commands first
   - D. Paste your API key into the chat box and have it "verify your identity"
   > **Answer: B.** Don't overreach the first time: in an environment you can undo (Chapters 25 and 27), run a small task through using the workflow from Chapter 24. A is too risky and hard to roll back; C gets the order backwards; D is an absolute no: never paste in keys (Chapter 37).

6. **[Basic · Hands-on / Observation]** You don't have to actually install the tool: try writing a 5-to-8-line set of "onboarding notes" for a "project / matter" you know well (even "managing the household budget"). Write two or three each of the rules, minefields, and habits. Then ask yourself: which lines are "unwritten conventions" I used to assume "the other side should get," but that nobody actually knows unless you write them down?
   > **What you should notice:** This is exactly the essence of CLAUDE.md: **making the "taken-for-granted unwritten conventions" explicit**. You'll also feel how hard "being tight" is: write too much and nobody can get through it, write too little and you miss the key parts. As for what these notes are called inside Claude Code, where they go, and how they take effect, **refer to the official documentation** (go deeper in Appendix C).
