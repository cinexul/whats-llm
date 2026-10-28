In the last three projects (Chapters 31, 32, and 33), the AI basically worked alongside you in a "you say one thing, it does one thing" way. This chapter we switch it up: we build an **agent console**, giving it a goal and a process and letting it **run several steps in a row on its own**, while you sit beside it watching it move through "investigate → plan → act → sign off" and step in only at the key points.

This is the first time that "AI that acts" from Chapter 19 truly lands in your hands. And precisely because it acts, the main event of this chapter isn't "how to make it run harder," but the reverse: **install the brakes first**. The brakes come in two layers. The first layer is the tool's own permission settings (read-only, plan first, ask me at every step), and that's the layer that can actually stop it. The second layer is the rules you write in your prompt; they tell the agent where to stop and ask you, but they can't physically stop it from doing something. Building an agent you can use with peace of mind isn't about getting it to run; the hard part is thinking through **which few steps must never be left to its own call**, and then holding them with both layers.

> [This chapter is about the general approach to "handling an agent that runs on its own." For practice we use a coding agent (such as Claude Code or Codex) as the example, but nothing here is tied to one product. Which product, which interface, and how you configure permissions and tools all differ from provider to provider and update fast, so always **refer to the provider's official documentation**.]

## 1. Getting ready

Before you start, get clear on "what exactly am I building," and don't pile on features right away.

- **Pick a small goal that's "multi-step but not dangerous at any step" to practice on.** For your first agent, the goal should be small and safe. A good example: have it "read a few documents in a folder, write a one-line summary for each, and gather them into one list." This takes several steps (read each, summarize each, finally gather), but **no step deletes anything, sends anything, or spends money**. A bad example: have it "auto-clean my inbox" or "auto-reply to customers"; touching that kind of irreversible work on your first try is like dropping a new driver straight onto the highway.
- **Get clear on which steps the task breaks into.** You have to break the goal into the few steps of "investigate → plan → act → sign off" in your head (or on paper) first. A process you can't even spell out yourself can't be handed to it to run (this is the hands-on version of the workflow loop from Chapter 14).
- **Have an environment you can fall back on ready.** An agent really does act, so **the things it can touch should ideally all be recoverable**. If local files are involved, try it in a separate practice folder that holds only **copies** of your documents, managed with Git (see "Git: the bare minimum to get started" in Chapter 26); if you use a platform's built-in agent, look at the isolation or sandbox it provides, and **refer to its official documentation.**
- **The single most important thing: make a "must-stop list."** Before letting it run, write down "which steps can only be done with my sign-off." This list is the soul of this chapter, and Section 2 below walks you through making it and backing it up with permission settings.

> **Key point:** Half the prep for building an agent is technical (environment, permissions, tools), and the other half is **judgment** (is the goal safe enough, is the process broken down clearly, is the brake list complete). That latter half is what really decides whether you crash.

## 2. Doing it step by step

The process below doesn't depend on any specific product; Step 0 gives a minimal runnable path using a coding agent. If you use another platform, fit the same approach in (for the specific buttons and commands, **defer to the official documentation**).

### Step 0: The minimal runnable path: use a coding agent, and tighten permissions first

You don't need to set up a separate platform for this chapter's "console." A coding agent is itself an agent that runs several steps in a row, and the screen where you talk to it is your console. For the first run:

1. **Make a practice folder.** Call it something like `agent-practice` and put **copies** of three short documents in it (a page or two each is plenty; no originals). Then initialize Git as in Chapter 26 and make one commit as your starting point.
2. **Start the coding agent inside this folder.** Open the folder, or `cd` into it in a terminal and start the tool, depending on the product (Chapters 28 and 29). Once it's running, ask it "which folder are you in right now?" to make sure it's in the right place.
3. **Set permissions to the tightest level.** For the first run, use only read-only, plan mode, or an "ask me before every step" setting. Examples as of October 2026: in Claude Code you can enter plan mode with `/plan` (or cycle to it with `Shift+Tab`); in that mode it reads files and proposes a plan but doesn't edit your files, and its default manual mode also asks you before editing files or running commands. In Codex you can pick "Read Only" with `/permissions` (read-only: editing files or going online needs your approval), and it also has a `/plan` mode. Names and entry points change, so check the official documentation.
4. **Don't connect tools that can send or delete.** This practice doesn't need external tools like email, chat, cloud storage, or calendars. Use `/mcp` to see what's connected right now (Chapters 22 and 36 cover MCP); anything that can send messages, delete things, or spend money on your behalf, switch off first, or move to an environment where they aren't connected.
5. **Paste in the "goal + process + rules" from Step 1**, and ask it to write the summary list **directly in the chat** rather than saving it to a file. That way the whole task fits within read-only permissions.

Run it like this, and if it tries to cross a line, the tool will block it or ask you first; you just choose "deny" in the prompt that appears.

### Step 1: Give it a goal plus a process in plain language

Don't just toss it a goal and let go. Spell out "which steps to follow" too. A request aimed at a non-programmer looks roughly like this:

```text
Goal: Take the few documents in this folder, write a one-line summary for each, and gather them into one list.

Please follow this process:
1. Investigate first: list which documents are in the folder, don't act yet, let me have a look.
2. Then read each one and write a one-line summary for each.
3. Finally, write the combined list directly in the chat for me. Don't save it to a file.

Rules (very important):
- You may only "read" and "write the list in the chat." No deleting, no modifying any file, no sending anything out.
- After investigating, stop and let me see whether the list is right; only continue when I say "continue."
- For anything you're unsure about, don't guess for me; stop and ask me.
```

Notice that **half of this passage is about "what not to do" and "where to stop."** This is the second layer of brakes: it tells the agent where to stop and ask you. What can actually stop it is the permission layer from Step 0.

### Step 2: Make the "must-stop list" first, the core of this chapter

Before you press "start," mark these kinds of actions **in advance** as "requires human confirmation." The test is just one sentence: **is this step reversible? Does it have consequences?**

| Fine to let it do itself | Must stop and wait for your sign-off |
| --- | --- |
| Read files, tidy, sort, generate drafts, list things | **Spends money**: calls a pay-per-use service, places an order, draws down a quota |
| Pick one among a few unimportant minor options | **Deletes data / overwrites**: deletes, clears, rewrites your original files |
| Do one step, report back, then do the next | **Sends outward**: sends email, submits, publishes, calls an external interface |
| Convert content from one form to another | **A judgment where it's unsure and needs you to decide** |

This list is enforced in two layers. The first layer goes to the tool: use permission settings so every action in the right-hand column has to go through you, and on the first run don't connect tools that can send, delete, or spend money at all. The second layer is the rules in your prompt. As Chapter 26 explained, the absence of a prompt doesn't mean an action is harmless, and Appendix C points out that a line in a Markdown file or a prompt can't replace a limit the system actually enforces. This table is Chapter 14's "holding the brake" and Chapter 26's "permission mechanism" landing in a project. **Both the list and the permission settings come before it acts, not as a patch after it's caused trouble.**

### Step 3: Let it run, and watch the "investigate → plan → act → sign off" process

After you press start, **don't walk away**. An agent's value is that it runs forward on its own, but the first time you use it, keep every step it runs in sight:

- **Watch whether its "investigation" is right**: did it find the right files, did it understand the goal right? If the first step is off, it builds ever more "tidily" on a wrong premise (Chapter 14 covered this pitfall).
- **Watch whether the must-stop points really hold it**: in read-only or plan mode, when it tries to edit a file or run a command that changes something, the tool blocks it or asks you first, and you choose deny. If it did something irreversible without asking you, that means the permissions were too loose or a tool was connected that shouldn't have been; it isn't a matter of your prompt not being stern enough. Stop it immediately, take stock and recover as in Chapter 30, and tighten the permissions before the next run.
- **If you feel it's going off track, cut in anytime**: say it clearly, then let it continue; or just go back to a clean state and start over.

### Checking the result

After one run, check by these three (the idea comes from "the three sign-off questions" in Chapter 25):

1. **What did it actually do?** Don't just look at the final list it gave; look at what it touched along the way, whether it acted on anything you didn't tell it to. Run `git status` in the practice folder (or ask it to run this read-only command and show you); there should be no changes.
2. **Did it stop where it should have?** Go back and confirm: after investigating, did it stop and wait for you to say "continue"? Along the way, was there any write, delete, or send you didn't approve? This one matters more than how nice the result looks.
3. **Can you trust the result?** For the summaries it generated, spot-check a few pieces of key information yourself; its self-check can't be fully trusted (Chapter 14), and nice doesn't equal right.

### Done when

The project is complete when all of the following are true:

- It ran inside the practice folder under read-only, plan, or ask-every-step permissions, with no tools connected that can send or delete.
- It first listed the documents in the folder, then stopped and waited for you to say "continue."
- Each of the three documents has a one-line summary, and the combined list appeared in the chat.
- You spot-checked at least two summaries and they match the originals.
- The files in the practice folder weren't changed (`git status` shows no changes).
- Nothing was written, deleted, or sent without your approval; whenever it tried to cross a line, the permission settings blocked it or it asked you first.

## 3. Common pitfalls

| Pitfall | What's going on / how to dodge it |
| --- | --- |
| **Giving it a big "irreversible" job right off the bat** | Having it delete email, send messages, or move money on the first try; trouble there is real trouble. Practice first on a safe "read-only, no-write" goal |
| **Relying on the prompt alone as the brakes** | Writing "ask me before deleting" in the prompt while giving it permissions and tools that can delete and send; it may do it anyway. Start with read-only, plan, or ask-every-step permissions, and don't connect tools that can send or delete; the rules in your prompt are the second layer |
| **Walking away once you press start** | An agent runs on its own, but the first time you use it you must watch the whole way through, especially whether it "gets held at the must-stop points." Letting go entirely is exactly the dangerous use Chapter 19 warns about over and over |
| **Taking "it says it checked" as a real check** | Its self-check is still "going along with the conversation," not a real, objective pair of eyes (Chapter 14). Re-verify key information yourself |
| **Forcing fixes inside a mess after it goes off track** | The more you fix, the more it skews. Just **go back to a clean state and open a new conversation**, re-explaining "the pitfall you just hit" as a premise (Chapters 13 and 30) |
| **Thinking "more steps equals stronger"** | Letting it run a dozen-plus steps at once leaves you no way to gatekeep step by step. **Take smaller steps and set checkpoints closer together**, and it's actually steadier |

## 4. Taking it one step further

After the first safe little agent runs smoothly, you can expand **cautiously**, asking again at every step "are the brakes enough":

- **Connect it to a tool or two, or a data source** (using the MCP/Skills approach from Chapter 22), so it can read more and do more. But remember what Chapters 22 and 36 stress over and over: **every new capability you add is one more entry point for mistakes and attacks**, so add as needed, add minimally, and start with read-only access.
- **Solidify a process you run often**: if you repeatedly need a certain "investigate → plan → act → sign off" routine, you can package it into a fixed process (the Skills approach, Chapters 22 and 36) and call it with one sentence next time.
- **Gradually loosen permissions, but with great restraint**: only when you're thoroughly sure a step is safe and it really is reversible should you consider letting it do that without asking. **For the few involving spending money, deleting data, or sending outward, we recommend keeping them in "must-stop" for good**, no matter how familiar you are.
- **Write a "how it should work" guide**: put this project's rules, landmines, and what it can and can't touch into the project's instruction file (the project-context approach, Chapter 28). The model itself doesn't remember your last conversation; the product puts that file back into the context every time work starts, which is why it seems to "remember" the rules.

> **Key point:** The real skill in building an agent console isn't "how much it can do"; it's **thinking through in advance which few steps must not be left to its own call, and blocking them with permission settings.** The capability is what it brings; the safety is what you design. Brakes first, then the gas: spending money, deleting data, and sending outward always check with you first.

## Summary

- This project has you handle, for the first time, an **agent that runs several steps in a row on its own** (Chapter 19); the core practice isn't "make it run hard" but "make it run safely."
- The minimal runnable path: a practice folder (copies only, started with Git), the coding agent started inside it, **permissions set to read-only, plan, or ask-every-step first**, no tools connected that can send or delete, and the results written in the chat.
- The brakes have two layers: **the tool's permission settings are the first**, the rules in your prompt are the second. If it did something irreversible without asking, the permissions were too loose; tighten them before the next run.
- When doing it: give the goal, process, and rules in plain language, and watch its "investigate → plan → act → sign off" process. Three questions for checking the work: what did it actually do, did it stop where it should have, can you trust the result.
- For the three kinds of irreversible action, **spending money, deleting data, and sending outward**, we recommend keeping them set to "requires human confirmation" for good (echoing Chapters 14, 19, and 26). The specific platform and configuration are **subject to the official docs.**

In the next chapter, we switch to a different way of "connecting to AI": instead of a ready-made interface, we let your own program call the model directly through an **API**.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** What's the most fundamental difference between building an agent console and the "you ask one thing, it answers one thing" of the earlier projects? <!-- quiz: q01 revision: 2 -->
   - A. A stronger model behind it, so it can handle harder problems
   - B. It runs several steps on its own; you check at the key points
   - C. A fuller interface, so you can see more information at once
   - D. It checks its own results, so it hardly makes mistakes anymore
   > **Answer: B.** The crux of an agent is that it "runs forward a stretch on its own" (Chapter 19), not that it's smarter or less error-prone. Precisely because it runs on its own and may not stop to ask you, this chapter puts "installing the brakes" first. A and C, the model and the interface, aren't the real difference; D is backwards, since its self-check can't be fully trusted (Chapter 14).

2. **[Basic · Concept]** The "brakes" (must-stop list) this chapter stresses over and over are essentially what? <!-- quiz: q02 revision: 2 -->
   - A. Writing "no deleting, no sending" in the prompt so it complies
   - B. Slowing every agent step so you have more time to react
   - C. Setting deleting, sending, and spending to need your OK first
   - D. A stop button for forcibly shutting the agent down in a crisis
   > **Answer: C.** The brakes aren't about slowing it down; they're about **drawing the safe boundary**: inside it, it runs freely, and when it hits an irreversible or consequential action it must stop and wait for your sign-off. In practice you enforce that first with the tool's permission settings (read-only, plan, ask every step, no tools that can send or delete), and the rules in your prompt are the second layer. A relies on the second layer alone, and it may act anyway; B and D don't answer "which steps must go through you."

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

6. **[Basic · Hands-on / Observation]** Do one real run with the minimal path from Step 0: start the coding agent in a practice folder with read-only or plan permissions, and have it summarize three documents in one line each and gather the results. Before you run it, break the task into "investigate → plan → act → sign off" steps and make a "must-stop list"; afterward, go through the "Done when" list item by item. (Exact settings are **subject to the official docs.**) <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** You'll find that for a safe practice goal, there may be no "must-stop points" at all (it's all read-only, no sending, no deleting), which is exactly the kind of goal to pick for your first time; with read-only permissions, even if it tries to write a file, it gets blocked or asks you first. The moment "delete, send, spend money" shows up in the goal, the corresponding steps must go into the "must-stop list," and they must be held by permission settings first, not just written in the prompt. **Think through the brakes first, then talk about letting it run**; that's the right order for building an agent (echoing Chapters 14, 19, and 26).
