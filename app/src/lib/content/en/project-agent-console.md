In the previous three projects (Chapters 31–33), the AI mostly worked "you say one thing, it does one thing." This chapter changes the game: you give it a goal and a process, it runs several steps in a row on its own, and you sit beside it watching it move through "investigate → plan → act → sign off," stepping in only at the key points. When you're done you'll have three things: a "must-stop list," a summary file, `summary.md`, that it wrote and you checked, and having seen with your own eyes that it really did stop and ask you before writing a file.

This is the "AI that takes action" from Chapter 19 landing in your hands for real. Because it takes action, this chapter practices the brakes first. The brakes have two layers. The first is the tool's **permission settings** (read-only, ask before changing anything, and so on), which actually stop operations. The second is the rules you write into your prompt, which tell the agent where to stop and ask, but can't stop it from actually doing something.

## 1. Getting ready

- Pick a small goal with several steps where no step is dangerous. Use this one the first time: read three documents in a folder, write a one-line summary of each, and gather them into one list. It takes several steps (list the files, read each, summarize each, gather), but it deletes nothing, sends nothing, and spends no money. Don't start with "clean up my inbox" or "auto-reply to customers"; that's putting a new driver straight onto the highway.
- Think through how it breaks into steps. A process you can't explain yourself can't be handed to it (Chapter 14).
- Prepare an environment you can undo: a separate practice folder holding only copies of the documents, under Git (Chapter 26). With an agent built into a platform, check what kind of isolated environment it offers.
- Make a "must-stop list": the steps that need your OK first. Step 2 shows how.

## 2. Doing it step by step

### Step 0: The minimal runnable path: use a coding agent, and tighten permissions first

You don't need to set up another platform: a coding agent already runs multiple steps on its own, and the screen where you talk to it is where you watch it work and can stop it at any moment. The first time, do this:

1. Make a practice folder, say `agent-practice`, and put copies of three short documents in it (a page or two each; no originals). Initialize Git and make one commit as described in Chapter 26, as your starting point.
2. Start the coding agent in this folder (Chapters 28 and 29) and first ask it "which folder are you in right now?" to make sure it's in the right place.
3. Set permissions to "ask me before changing anything." As of October 2026: from v2.1.283 on, Claude Code starts in auto mode in the terminal and VS Code, where a second model reviews actions and usually no confirmation appears, so switch out of it first. Start it with `claude --permission-mode manual`, or after starting press `Shift+Tab` until the status bar shows "manual mode on." In manual mode it reads files without asking, but asks before changing files, running most commands, or going online. In a folder under Git, Codex defaults to Auto, which can change files directly, so use `/permissions` to switch to Read Only: it can read files in the current folder, and changing files or going online needs your approval. These names and entry points change between versions.
4. Don't connect tools that can send or delete. This exercise needs no email, chat, cloud drive, or calendar tools. Type `/mcp` in the session to see what's connected (MCP is in Chapters 22 and 36); anything that can send messages, delete things, or spend money on your behalf, turn off for now or switch to an environment without it.

Run this way, it has to ask you before changing anything, and you just pick "deny" in the confirmation that pops up.

### Step 1: Give it a goal plus a process in plain language

Don't just toss it a goal and walk away; spell out the steps too:

```text
Goal: write a one-line summary of each of the three documents in this folder and gather them into one list.

Follow this process:
1. Investigate first: list which documents are in the folder, then stop and show me.
2. When I say "continue," read each one and write a one-line summary.
3. Write the gathered list directly in the chat; don't save it to a file yet.

Rules:
- Don't delete or change any existing file, and don't send anything anywhere.
- Where you're unsure, don't guess for me; stop and ask.
```

Half of this text is about "what not to do" and "where to stop." That's the second layer of brakes. What can actually stop it is the permission setting from Step 0.

### Step 2: Make the "must-stop list" first, the core of this chapter

Before you press start, mark actions like these as "must have human confirmation." The test is a single question: can this step be undone, and does it have consequences?

| Fine to let it do on its own | Must stop and wait for your OK |
| --- | --- |
| Reading files, organizing, sorting, drafting, making lists | Spending money: calling pay-per-use services, ordering, using up credit |
| Picking one of a few unimportant small options | Deleting or overwriting data: deleting, clearing, rewriting your original files |
| Finishing a step, reporting, then doing the next | Sending outward: email, submitting, publishing, calling outside services |
| Converting content from one form into another | Judgment calls it's unsure about and you need to make |

The list is enforced in two layers. The first layer belongs to the tool: hold the right-hand actions with permission settings, and the first time, don't connect tools that can send, delete, or spend at all. Only the second layer is the rules in your prompt. As Chapter 26 explained, no confirmation popping up doesn't mean an action is harmless; Appendix C also warns that a sentence in a Markdown file or a prompt can't replace a restriction enforced at the system level. Settle the list and the permissions before it acts, not after it has caused trouble.

### Step 3: Let it run, and watch the "investigate → plan → act → sign off" process

Once you press start, don't walk away; the first time, watch every step:

- Is its "investigate" right? Did it find the right files and understand the goal? If the first step goes wrong, it builds ever neater work on a wrong premise (Chapter 14).
- After listing the documents, did it stop and wait for your "continue"?
- Did the must-stop points actually hold it? In manual mode or Read Only, when it wants to change a file or run a command that changes things, the tool shows a confirmation first. If something changed without it asking, the permissions were too loose or a tool that shouldn't be connected was; it's not about how firmly the prompt was worded. Stop it immediately, take stock and recover as in Chapter 30, and tighten the permissions before running again.
- If it seems to be going off track, interrupt any time, explain, and let it continue, or go back to a clean state and start over.

### Step 4: Sign off, then approve one write

When a round is done, use Chapter 25's "three sign-off questions":

1. What did it actually do? Look not only at the final list but at what it touched along the way. Have it run `git status` for you (a read-only Git command that lists any changes in the folder); there should be no changes.
2. Did it stop where it should? After listing the documents, did it wait for your "continue"? Were there any writes, deletions, or sends you didn't approve? This matters more than how polished the result is.
3. Can you trust the result? Pick two summaries and check them against the originals; its self-check can't be fully trusted (Chapter 14).

If all is well, have it save the list:

> Plain-language request: *"I've checked the list. Save it as a new file, `summary.md`, in this folder, and don't touch any other file."*

It will first ask whether it may create the file. Check the file name and content, then approve. Once it's saved, look at `git status` again: there should be just one new untracked file, `summary.md`, and no existing file changed. This step lets you see the brakes at work: it stops, says what it wants to do, and you decide whether it goes ahead.

### Done when

The project is done when all of these are true:

- It ran in a practice folder holding only copies, in manual mode or Read Only, with no tools that can send or delete.
- It listed the three documents first and stopped to wait for your "continue."
- You spot-checked at least two summaries and they match the originals.
- It asked you before creating `summary.md`; after you approved, `git status` showed just that one new file.
- At no point was there a write, deletion, or send you didn't approve.

## 3. Common pitfalls

| Pitfall | What happens / how to avoid it |
| --- | --- |
| Handing it a big irreversible job right away | Deleting email, sending messages, moving money: an accident is a real accident. Practice with a goal that sends nothing, deletes nothing, and writes just one new file at the end |
| Relying on the prompt alone as the brakes | You write "ask me before deleting" in the prompt but give it permissions and tools that can delete or send, and it may go ahead anyway. Tighten permissions and leave dangerous tools off first; the prompt is the second layer |
| Assuming the default settings will ask you | Recent Claude Code defaults to auto mode, and in a folder under Git, Codex can change files directly by default. Before the first run, check the mode in the status bar or with `/permissions` |
| Pressing start and walking away | The first time you must watch the whole way, especially whether it gets held at the must-stop points (Chapter 19) |
| Treating "it says it checked" as a real check | Its self-check is still "continuing the text"; recheck key information yourself (Chapter 14) |
| Forcing fixes inside the mess after it goes off track | Go back to a clean state, open a new chat, and restate the premise including the problem you just ran into (Chapters 13 and 30) |
| Thinking more steps means more power | Let it run a dozen steps at once and you can't check them one by one. Smaller steps and more checkpoints are steadier |

## 4. Taking it one step further

At each step forward, ask again whether the brakes are enough:

- Connect a tool or data source or two (MCP, Chapters 22 and 36). Each new capability is one more entry point for errors and attacks; connect only what you need, with read-only access first.
- Turn a process you run often into a skill (Skills, Chapters 22 and 36), so one sentence calls it next time.
- Loosen permissions gradually, and sparingly: only let it act without asking when you're completely sure a step is safe and it can be undone. Spending money, deleting data, and sending outward are best kept on the must-stop list for good.
- Write a "how you should work" guide: put the rules and what it may and may not touch into the project's instructions file (Chapter 28). The model itself doesn't remember the last conversation; it "remembers" these rules because the product puts that file back into context every time work starts.

<aside data-callout="gift">

**A small bonus:** Once you start having a coding agent write real programs, consider putting the text below in your project instructions file (`CLAUDE.md` or `AGENTS.md`, Chapters 28 and 29). It's written for the AI, so you don't need to follow every line: it asks the AI to keep the code clear and easy to change from the start, so fewer messes pile up for later. It doesn't replace signing off (Chapter 25), and the AI won't follow every rule every time, but it usually saves a fair amount of rework.

```text
While writing code, keep to these principles throughout:
1. Before changing anything, understand the existing structure and the related code. Keep the project's existing stack, naming and layering, and don't reimplement what already exists.
2. Modules work together through clear interfaces and types, not through hidden global state, call order, or another module's internals.
3. Use types and data structures to rule out invalid states. For example, don't represent mutually exclusive states with several independent booleans.
4. Keep each business rule in one place, so that when requirements change, the edit stays inside the related module.
5. Give each module one main job. Merge logic only when it is truly the same and changes for the same reasons; don't force together code that merely looks similar.
6. Don't add abstraction layers, pass-through wrappers or design patterns for imagined future needs. Start with the simplest design that meets the current need.
7. Validate external input and API responses at the system boundary, don't rely on front-end checks in place of back-end checks, and handle or report errors instead of silently swallowing them.
8. First build the smallest version that runs and can be verified, then improve it. Keep throwaway test code separate from the real implementation.
9. After each piece, check whether any of the problems above crept in, and run type checks and tests.
10. Keep changes within the task. If a larger refactor is needed, explain why and what it affects, and wait for my go-ahead. Where a rule is unclear, state your assumption instead of building it into the real implementation.
```

</aside>

## Summary

- This project is your first time handling an agent that runs several steps on its own (Chapter 19); what you practice is keeping it under control, not making it run hard.
- The minimal path: a practice folder with copies only, started under Git; permissions set to manual mode or Read Only (recent Claude Code defaults to auto mode, so switch first); no tools that can send or delete.
- The brakes have two layers: the tool's permission settings are the first, the rules in your prompt the second. If something changed without it asking, the permissions were too loose; tighten them and run again.
- While it runs, watch "investigate → plan → act → sign off"; when signing off, check what it did, whether it stopped where it should, and whether you can trust the result, then approve one write yourself and confirm with `git status` that only `summary.md` was added.
- Spending money, deleting data, and sending outward are best always set to require human confirmation (Chapters 14, 19, and 26).

In the next chapter, we connect AI a different way: instead of a ready-made interface, your own program calls the model directly through an API.

## Sources and version notes

Checked on: 2026-10-29.

- [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes): from v2.1.283 on, terminal and VS Code sessions start in auto mode; manual mode (config value `default`, with `manual` also accepted on the command line) asks before editing files, running shell commands, or reaching the network; `Shift+Tab` switches modes and `--permission-mode` sets one at startup.
- [Codex approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security): in folders under version control Codex recommends Auto (edits and commands in the working directory without asking); switch to read-only with `/permissions`.
- [Codex approval presets source](https://github.com/openai/codex/blob/main/codex-rs/utils/approval-presets/src/lib.rs): Read Only can read files in the current workspace, and editing files or accessing the internet needs approval.
- [Claude Code commands](https://code.claude.com/docs/en/commands): in-session commands such as `/mcp` and `/permissions`.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** What's the most fundamental difference between letting an agent run a multi-step task and the "you ask one thing, it answers one thing" of the earlier projects? <!-- quiz: q01 revision: 3 -->
   - A. A stronger model behind it, so it can handle harder problems
   - B. It runs several steps on its own; you check at the key points
   - C. A fuller interface, so you can see more information at once
   - D. It checks its own results, so it hardly makes mistakes anymore
   > **Answer: B.** The crux of an agent is that it "runs forward a stretch on its own" (Chapter 19), not that it's smarter or less error-prone. Precisely because it runs on its own and may not stop to ask you, this chapter puts "installing the brakes" first. A and C, the model and the interface, aren't the real difference; D is backwards, since its self-check can't be fully trusted (Chapter 14).

2. **[Basic · Concept]** The "brakes" (must-stop list) this chapter stresses over and over are essentially what? <!-- quiz: q02 revision: 3 -->
   - A. Writing "no deleting, no sending" in the prompt so it complies
   - B. Slowing every agent step so you have more time to react
   - C. Setting deleting, sending, and spending to need your OK first
   - D. A stop button for forcibly shutting the agent down in a crisis
   > **Answer: C.** The brakes aren't about slowing it down; they're about **drawing the safe boundary**: inside it, it runs freely, and when it hits an irreversible or consequential action it must stop and wait for your sign-off. In practice you enforce that first with the tool's permission settings (manual mode or read-only, no tools that can send or delete), and the rules in your prompt are the second layer. A relies on the second layer alone, and it may act anyway; B and D don't answer "which steps must go through you."

3. **[Basic · Misconception]** "I've spelled out the goal and pressed start, so I can go do other things." For your first agent, what's wrong with this idea? <!-- quiz: q03 revision: 2 -->
   - A. On a first run, watch to see whether the must-stop points hold
   - B. The goal was too vague; spell it out and you can safely leave
   - C. Nothing, as long as the prompt says "ask me first when unsure"
   - D. You didn't grant full access, so it will stall waiting for you
   > **Answer: A.** An agent runs on its own, true, but whether it got held at a must-stop point, or asked you first, is something you have to see with your own eyes before you can rest easy. If it did something irreversible without asking, the permissions were too loose, and you stop it immediately. B and C assume that spelling things out or writing them in the prompt lets you walk away; D is backwards: the first run should use the tightest permissions, and stopping to ask you is exactly what you want.

4. **[Advanced · Scenario]** You have the agent help tidy a folder of customer records. Which step **most** needs to be set as "must stop and ask you"? <!-- quiz: q04 revision: 2 -->
   - A. Reorganizing the content from a table into a paragraph of text
   - B. Re-sorting all the customer records by company name
   - C. Standardizing several tables into one consistent format
   - D. Deleting the customer records it decides are duplicates
   > **Answer: D.** Deleting is an **irreversible** action with major consequences, exactly a must-stop point. A, B, and C are all low-risk tidying you can let go of within the boundary (as long as results are saved separately and the originals stay untouched). The dividing test is always: is this step reversible, does it have consequences (echoing Chapter 14).

5. **[Advanced · Scenario]** Halfway through, the agent is clearly off track and getting messier. What's the best damage-control move? <!-- quiz: q05 revision: 2 -->
   - A. Chase it with corrections line by line in the current chat
   - B. Let it finish this round first, then fix everything at the end
   - C. Stop it, roll back, and restate the premise in a new chat
   - D. Loosen its permissions a bit so it can clean up the mess itself
   > **Answer: C.** Forcing fixes inside polluted context usually skews it further (Chapters 13 and 30). That's why the prep stage readies an environment you can roll back, for exactly this moment of starting over cleanly. A is exactly forcing fixes; B lets it run further in the wrong direction; D widens the damage it can do just when it has already gone wrong.

6. **[Basic · Hands-on / Observation]** Do one real run of Steps 0–4 in this chapter: start the coding agent in a practice folder in manual mode or Read Only, have it summarize three documents in one line each and gather the results, and after checking them approve saving them to `summary.md`. Before you run it, break the task into "investigate → plan → act → sign off" steps and make a "must-stop list"; afterward, go through the "Done when" list item by item. <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** You'll find this practice goal has just one must-stop point: the final write that creates `summary.md`. In manual mode or Read Only it stops and asks you there, and after you approve, `git status` shows only that one new file. Nothing sent, nothing deleted, and the one write is visible and reversible: exactly the kind of goal to pick for your first time. The moment "delete, send, spend money" shows up in the goal, the corresponding steps must go into the "must-stop list," and they must be held by permission settings first, not just written in the prompt. **Think through the brakes first, then talk about letting it run**; that's the right order for building an agent (echoing Chapters 14, 19, and 26).
