In the last three projects (Chapters 31, 32, and 33), the AI basically worked alongside you in a "you say one thing, it does one thing" way. This chapter we switch it up: we build an **agent console**, giving it a goal and a process and letting it **run several steps in a row on its own**, while you sit beside it watching it "investigate then act" and step in only at the key points.

This is the first time that "AI that acts" from Chapter 19 truly lands in your hands. And precisely because it acts, the main event of this chapter isn't "how to make it run harder," but the reverse: **install the brakes first**. You'll find that building an agent you can use with peace of mind is never about getting it to run; the hard part is thinking through **which few steps must never be left to its own call.**

> [This chapter is about the general approach to "handling an agent that runs on its own," not tied to any one platform. Which product, which interface you build it in, how you configure the tools, all differ from provider to provider and update fast, so always **refer to the provider's official documentation**.]

## 1. Getting ready

Before you start, get clear on "what exactly am I building," and don't pile on features right away.

- **Pick a small goal that's "multi-step but not dangerous at any step" to practice on.** For your first agent, the goal should be small and safe. A good example: have it "read a few documents in a folder, write a one-line summary for each, and gather them into one list." This takes several steps (read each, summarize each, finally gather), but **no step deletes anything, sends anything, or spends money**. A bad example: have it "auto-clean my inbox" or "auto-reply to customers"; touching that kind of irreversible work on your first try is like dropping a new driver straight onto the highway.
- **Get clear on which steps the task breaks into.** You have to break the goal into the few steps of "investigate, do, check" in your head (or on paper) first. A process you can't even spell out yourself can't be handed to it to run (this is the hands-on version of that "universal loop" from Chapter 14).
- **Have an environment you can fall back on ready.** An agent really does act, so **the things it can touch should ideally all be recoverable**. If local files are involved, try it in a separate folder managed with Git (echoing Chapters 24 and 27); if you use a platform's built-in agent, look at the isolation or sandbox it provides, and **refer to its official documentation.**
- **The single most important thing: make a "must-stop list."** Before letting it run, write down "which steps can only be done with my sign-off." This list is the soul of this chapter, and Section 2 below walks you through making it step by step.

> **Key point:** Half the prep for building an agent is technical (environment, tools), and the other half is **judgment** (is the goal safe enough, is the process broken down clearly, is the brake list complete). That latter half is what really decides whether you crash.

## 2. Doing it step by step

The process below doesn't depend on any specific product. Whatever platform you build on, fit this approach in (for the specific buttons and commands, **defer to the official documentation**).

### Step 1: Give it a goal plus a process in plain language

Don't just toss it a goal and let go. Spell out "which steps to follow" too. A request aimed at a non-programmer looks roughly like this:

```text
Goal: Take the few documents in the "to be tidied" folder, write a one-line summary for each, and gather them into one list.

Please follow this process:
1. Investigate first: list which documents are in the folder, don't act yet, let me have a look.
2. Then read each one and write a one-line summary for each.
3. Finally gather them into one list and hand it to me.

Rules (very important):
- You may only "read" and "generate the list." No deleting, no modifying original files, no sending anything out.
- After investigating, stop and let me see whether the list is right; only continue when I say "continue."
- For anything you're unsure about, don't guess for me; stop and ask me.
```

Notice that **half of this passage is about "what not to do" and "where to stop."** This isn't being wordy; these are the brakes you're installing on it.

### Step 2: Make the "must-stop list" first, the core of this chapter

Before you press "start," mark these kinds of actions **in advance** as "requires human confirmation." The test is just one sentence: **is this step reversible? Does it have consequences?**

| Fine to let it do itself | Must stop and wait for your sign-off |
| --- | --- |
| Read files, tidy, sort, generate drafts, list things | **Spends money**: calls a pay-per-use service, places an order, draws down a quota |
| Pick one among a few unimportant minor options | **Deletes data / overwrites**: deletes, clears, rewrites your original files |
| Do one step, report back, then do the next | **Sends outward**: sends email, submits, publishes, calls an external interface |
| Convert content from one form to another | **A judgment where it's unsure and needs you to decide** |

This table is Chapter 14's "holding the brake" and Chapter 26's "permission mechanism" landing in a project. **The timing of making the list is key: make it before it acts, not patch it after it's caused trouble.**

### Step 3: Let it run, and watch the "investigate then act" process

After you press start, **don't walk away**. An agent's value is that it runs forward on its own, but the first time you use it, keep every step it runs in sight:

- **Watch whether its "investigation" is right**: did it find the right files, did it understand the goal right? If the first step is off, it builds ever more "tidily" on a wrong premise (Chapter 14 covered this pitfall).
- **Watch whether it really stops at the "must-stop points"**: when it reaches a spot that should be confirmed, it should stop and ask you. If it doesn't stop and goes straight ahead with an irreversible action, your brakes aren't set right; halt it immediately.
- **If you feel it's going off track, cut in anytime**: say it clearly, then let it continue; or just roll back and start over.

### Checking the result

After one run, check by these three (echoing the "three questions for checking the work" from Chapter 27):

1. **What did it actually do?** Don't just look at the final list it gave; look at what it touched along the way, whether it acted on anything you didn't tell it to.
2. **Did it stop where it should have?** Go back and confirm whether it dutifully stopped and waited for you at each of those few "must-stop points." This one matters more than how nice the result looks.
3. **Can you trust the result?** For the summaries it generated, spot-check a few pieces of key information yourself; its self-check can't be fully trusted (Chapter 14), and nice doesn't equal right.

Only when all three pass does this agent run count as "both ran through and didn't lose control."

## 3. Common pitfalls

| Pitfall | What's going on / how to dodge it |
| --- | --- |
| **Giving it a big "irreversible" job right off the bat** | Having it delete email, send messages, or move money on the first try; trouble there is real trouble. Practice first on a safe "read-only, no-write" goal |
| **Giving only a goal, no brakes** | Just saying "help me clean up my inbox" without "ask me before deleting"; it may delete all the way through. **The brakes go in with the goal, and get written down before it acts** |
| **Walking away once you press start** | An agent runs on its own, but the first time you use it you must watch the whole way through, especially watching whether it "really stops at must-stop points." Letting go entirely is exactly the dangerous use Chapter 19 warns about over and over |
| **Taking "it says it checked" as a real check** | Its self-check is still "going along with the conversation," not a real, objective pair of eyes (Chapter 14). Re-verify key information yourself |
| **Forcing fixes inside a mess after it goes off track** | The more you fix, the more it skews. Just **roll back to a clean state and open a new conversation**, re-explaining "the pitfall you just hit" as a premise (Chapters 13 and 30) |
| **Thinking "more steps equals stronger"** | Letting it run a dozen-plus steps at once leaves you no way to gatekeep step by step. **Take smaller steps and set checkpoints closer together**, and it's actually steadier |

## 4. Taking it one step further

After the first safe little agent runs smoothly, you can expand **cautiously**, asking again at every step "are the brakes enough":

- **Connect it to a tool or two, or a data source** (using the MCP/Skills approach from Chapter 22), so it can read more and do more. But remember what the next chapter and Chapter 36 stress over and over: **every new capability you add is one more entry point for mistakes and attacks**, so add as needed and add minimally.
- **Solidify a process you run often**: if you repeatedly need a certain "investigate, do, check" routine, you can package it into a fixed process (the Skills approach, Chapters 22 and 36) and call it with one sentence next time.
- **Gradually loosen "must-stop points," but with great restraint**: only when you're thoroughly sure a step is safe and it really is reversible should you consider letting it do that on its own. **For the few involving spending money, deleting data, or sending outward, keep them in "must-stop" forever**, no matter how familiar you are.
- **Write a "how it should work" guide**: write down this project's rules, landmines, and what it can and can't touch, and hand it over (the project-context approach, Chapter 28), so it keeps the rules across conversations.

> **Key point:** The real skill in building an agent console isn't "how much it can do" — it's "**which few steps you thought through in advance must not be left to its own call.**" The capability is what it brings; the safety is what you design. One sentence to remember for life: **install the brakes first, then give it the gas; spending money, deleting data, and sending outward — these three kinds of action always check with you first.**

## Summary

- This project has you handle, for the first time, an **agent that runs several steps in a row on its own** (Chapter 19); the core practice isn't "make it run hard" but "make it run safely."
- The most important thing in the prep stage isn't technical — it's **judgment**: pick a goal that's "multi-step but safe at every step," break the process down clearly, make a "must-stop list," and ready an environment you can roll back.
- When doing it: **give the goal plus the process plus the brakes in plain language**, watch its "investigate then act" process, and focus on whether it "really stops at must-stop points."
- Three questions for checking the work: what did it actually do, did it stop where it should have, can you trust the result. **Failing to stop where it should matters more than how nice the result looks.**
- For the three kinds of irreversible action, **spending money, deleting data, and sending outward**, keep them set to "requires human confirmation" forever (echoing Chapters 14 and 19). The specific platform and how to build it are **subject to the official docs.**

In the next chapter, we switch to a different way of "connecting to AI": instead of a ready-made interface, we let your own program call the model directly through an **API**.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** What's the most fundamental difference between building an agent console and the "you ask one thing, it answers one thing" of the earlier projects?
   - A. The interface is flashier
   - B. It can **run several steps in a row on its own** toward a goal (investigate, act, check), with you gatekeeping only at the key points
   - C. It uses a stronger model
   - D. It no longer makes mistakes
   > **Answer: B.** The crux of an agent is that it "runs forward a stretch on its own" (Chapter 19), not that it's smarter or less error-prone. Precisely because it runs on its own and may not stop to ask you, this chapter puts "installing the brakes" first.

2. **[Basic · Concept]** The "brakes" (must-stop list) this chapter stresses over and over are essentially what?
   - A. Making the agent run a bit slower
   - B. Marking, **in advance**, irreversible or consequential steps like "spending money, deleting data, sending outward, needing a decision" as "requires human confirmation"
   - C. A button that shuts the agent down
   - D. Limiting the agent to reading only, not thinking
   > **Answer: B.** The brakes aren't about slowing it down — they're about **drawing the safe boundary**: inside the boundary it runs freely, and when it hits an irreversible or consequential action it must stop and wait for your sign-off (echoing Chapters 14 and 19). The test is one sentence: is this step reversible? Does it have consequences?

3. **[Basic · Misconception]** "I've spelled out the goal and pressed start, so I can go do other things." For your first agent, what's wrong with this idea?
   - A. Nothing, an agent is meant to let you let go
   - B. The first time you must watch the whole way through, especially watching whether it "really stops at must-stop points"; letting go entirely is exactly the dangerous use
   - C. The mistake is that you shouldn't give it a goal
   - D. The mistake is that an agent can't run on its own at all
   > **Answer: B.** An agent runs on its own, true, but "whether it really stops where it should" has to be confirmed with your own eyes before you can rest easy. If it doesn't stop and goes straight ahead with something irreversible, the brakes aren't set right and you halt it immediately (Chapter 19). Letting go entirely is the dangerous posture this book warns about over and over.

4. **[Advanced · Scenario]** You have the agent help tidy a folder of customer records. Which step **most** needs to be set as "must stop and ask you"?
   - A. Sorting the records by company name
   - B. Standardizing the tables into one format
   - C. **Directly deleting** the few customer records it thinks are "redundant duplicates"
   - D. Reorganizing the content from a table into a paragraph of text
   > **Answer: C.** Deleting is an **irreversible** action with major consequences, exactly a must-stop point. A, B, and D are all low-risk tidying you can let go of within the boundary. The dividing test is always: is this step reversible, does it have consequences (echoing Chapter 14).

5. **[Advanced · Scenario]** Halfway through, the agent is clearly off track and getting messier. What's the best damage-control move?
   - A. Chase it with corrections sentence by sentence inside the mess
   - B. Roll back to a clean state, open a new conversation, and re-explain "the pitfall you just hit" as a premise
   - C. Shut off the computer
   - D. Let it finish this round first, then talk
   > **Answer: B.** Forcing fixes inside polluted context usually skews it further (Chapters 13 and 30). That's why the prep stage readies an environment you can roll back, for exactly this moment of starting over cleanly. C doesn't solve the problem; D lets it run further in the wrong direction.

6. **[Basic · Hands-on / Observation]** You don't have to actually build a platform. First pick a small multi-step task you'd have an agent do (like "read three documents, write a one-line summary for each, then gather them"), break it into the steps of "investigate, do, check," then make a "must-stop list" for it: which steps need your sign-off? (How exactly to build it is **subject to the official docs.**)
   > **What you should notice:** You'll find that for a safe practice goal, there may be no "must-stop points" at all (it's all read-only, no sending, no deleting), which is exactly the kind of goal to pick for your first time. The moment "delete, send, spend money" shows up in the goal, the corresponding steps must go into the "must-stop list." **Think through the brakes first, then talk about letting it run**; that's the right order for building an agent (echoing Chapters 14 and 19).
