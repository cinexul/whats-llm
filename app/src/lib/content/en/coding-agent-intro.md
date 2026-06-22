〔Wherever this chapter touches a specific product's form, installation, commands, interface, or capabilities, those change with each version, so always **check the official docs**. This chapter only covers the mental model that is **shared and stable** across this kind of tool, and that part won't go out of date.〕

Back in Chapter 19 we met the **Agent**: not something that just "answers a question," but an AI that **goes and does things on its own**. It can break a goal into steps, call tools, and run several steps in a row. In this chapter we point the camera at the most mature branch of the Agent family, and the one most worth knowing for ordinary people: the **coding agent**.

Its best-known examples are two names you've probably already heard: **Claude Code** and **Codex**.

Let me say the awkward part up front: **this chapter does not require you to write code, not a single line.** What we're building is a mental model: getting clear on **what this thing actually is, how far it can go, what you shouldn't count on it for, and who is finally responsible.** Once that's clear in your head, the specific guarding moves in the next few chapters (reading the diff, running tests, rolling back, checking the plan) will make sense, because you'll know **what you're guarding and why.**

## 1. It's a kind of Agent: it "does things," not just "writes code"

A lot of people's first impression of "programming AI" stops at "it can write code." You ask "how do I write a sorting function," it hands you a chunk of code, you copy it away. That impression belongs to the **web chat** layer (Chapter 17 covered the model / product / Agent layers).

A coding agent is **one level up** from that. It isn't "able to write code," it's "**able to use the act of writing code to get things done**." Where's the difference?

| | "Writes code" (chat layer) | "Does things" (agent layer) |
| --- | --- | --- |
| What you give it | One specific small problem | A **goal** ("add a search box to this website") |
| What it gives you | A block of text you go use yourself | It **does the work itself**: reads files, edits code, runs commands |
| How much it knows | Only the few lines you pasted in | It **goes and reads through the whole project** to understand the current state |
| How it moves forward | You ask, it answers | It **takes several steps toward the goal**: look, edit, try, edit again |

This is exactly the Chapter 19 definition of an Agent landing in the specific area of "programming": **perceive (read the project) -> decide (think of an approach) -> act (edit files, run commands) -> perceive again (check whether the result is right)**, running that loop on its own. So remember this first sentence:

> **Key point:** **A coding agent is the "Agent that takes action" from Chapter 19, except the place it takes action is your code project.** "Writing code" is just one of its skills; "taking that skill and using it to get something done" is its real identity. Once you understand this, you'll stop treating it as "a smarter search box."

## 2. What it "looks like": the form varies, so don't pin it down

You might ask: so where do I use it? Is it a website? An app?

The answer is: **there is no single answer, and it keeps changing.** You'll usually run into them in a **terminal (command line), a code editor (IDE), a web task, or a cloud environment**; **some run on your own machine, some run in the cloud, the exact form varies and gets updated, so check the official docs / the product's official form.**

Why won't this book just tell you "use that website" or "install that program"? Because the form of this kind of tool **changes especially fast**: today the mainstream is the command line, tomorrow an IDE plugin might feel smoother, the day after a web version or a cloud-backend version shows up. **Pin the book to one specific form and it's out of date in six months.** So this book only covers the part that **won't go out of date**: how it does the work, and how you direct it. The specifics of "where to open it, which button to click, which command to type" are spelled out in Chapter 25 and Appendix C, but in the end always **check the official docs**.

> **Key point:** Two things are **stable** and safe to remember: Claude Code comes from Anthropic, and its core is Claude; Codex comes from OpenAI. This "who makes it / what's inside it" attribution won't shuffle around. But **what they actually look like, how to install them, and what they can do** belong to the "will change" category. When you hit those details, trust the official docs.

## 3. The core mental model: treat it like "a very capable new coworker on day one"

This is the comparison the whole book keeps coming back to, and it fits best right here. Really do picture it as a **person**:

**Claude Code / Codex is like a coworker who is quick, willing, and very capable, but who started today and knows nothing about your company.**

Break that picture apart, and each piece matches a real trait it has:

- **Quick on their feet:** the grunt work you hand over gets done fast and in volume. That's its biggest value, so don't waste it.
- **Doesn't know your "ways":** your project's rules, naming habits, the spots no one's allowed to touch, none of it. **If you don't say it, they don't know it.** (There are ways to make them "remember these rules"; see Chapter 28.)
- **Will be confidently wrong:** they might, with a perfectly straight face, use a way of writing code that **doesn't exist at all**. That's the "hallucination" from Chapter 9, and it happens when writing code too; because code looks so "professional," it's even easier to fool a non-expert.
- **Doesn't know the latest things:** their knowledge has a "cutoff date" (Chapter 9). Very new tech they may not have heard of, or they remember an older version, unless you tell them the latest information.

So, faced with a new coworker like this, what does a reliable "person who's showing them the ropes" do? **They don't let go entirely, and they don't do everything for them.** They assign work, watch the key checkpoints, and sign off. That is exactly your position:

> **Common misconception / Reality:** A lot of people start out treating it as a "fully automatic code-writing machine": toss in a requirement, wait for it to deliver, use the result as-is. **In reality it's more like an intern you're mentoring than a turnkey contractor.** You don't have to be able to write every line, but you do have to be able to **assign the work** and **judge whether it did it right.** Treat it as a contractor and sooner or later you'll pay for a result that "looks fine but has a landmine buried in it."

## 4. Final responsibility always stays on the human side

This is the one thing **most worth remembering** in this chapter, and in all of Part Four, so it gets its own section.

It finished does **not** mean it's correct. It says "done" does **not** mean it actually worked. The reason was laid out earlier: **it will make mistakes (it will hallucinate) + it can take action (it really did change your stuff).** Put those two together and you get a dangerous combination: **it might, with full confidence, break your project and then tell you "completed."**

So no matter how strong this tool is, or how strong it gets, one boundary won't move:

> **Key point:** **Your name is on it, and you're responsible.** Before what it produces gets merged into your project, handed to your client, or attached to your name, **reviewing and signing off is your job** (Chapter 39 covers "responsibility for AI-generated content" specifically). Carve one sentence into your head: **"Don't let through what you don't understand and haven't verified."** You don't need to understand every line, but you do need to be able to judge "did this actually work or not."

This isn't meant to discourage you, quite the opposite: **precisely because responsibility clearly sits with the human, you can hand off the grunt work without worry.** Hold the "sign-off" gate, and all that fast, high-volume work in front of it is pure gain.

## 5. What this chapter sets up for what follows

String the four points above together and you already have a "map." The next few chapters just fill in the detail on it:

- It **takes action and makes mistakes** -> so you have to learn to **check its work afterward**: see what it changed (diff), whether it broke anything else (tests), and don't merge what you can't follow. That's **Chapter 25**, the chapter most worth actually practicing.
- It **really will change your stuff** -> so you have to let it work in an **environment you can undo**, and **dangerous operations have to ask you first**. That's the "permission mechanism and rollback-friendly environment" of **Chapter 26**.
- Big things **can't be rushed in one go** -> so you have to make it **lay out a plan and get your nod before acting**, and break big tasks **into small ones, signing off in small steps**. That's **Chapter 27**.

Notice something? All three of these are putting this chapter's core attitude into practice: **it's a capable coworker who makes mistakes; assign the work, but keep the gatekeeping yourself.** The next three chapters teach you "how to gatekeep," move by move.

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| A coding agent is just "a chat AI that's better at writing code" | It's an Agent that **takes action** (Chapter 19): reads the project, edits files, runs commands, takes several steps in a row, not just spitting out text |
| It's a particular website / piece of software, with a fixed form | The form varies (terminal / IDE / web / cloud), local and cloud both exist, and it's being updated. **Check the official docs** |
| It's AI, so the code it writes should be correct, use it as-is | It will **confidently get it wrong** (hallucination happens here too); finished isn't correct, **don't let through what you don't understand** |
| I can't program, so I just can't use it | You don't have to write every line; what you need is to **assign work + judge whether it worked**. The bar is judgment, not typing code |
| Once it says "completed," responsibility is handed to it | **Your name and your responsibility always stay with you**: reviewing and signing off before merging or delivering is a human job (Chapter 39) |

## Summary

- **A coding agent (Claude Code / Codex) is the Chapter 19 "Agent that takes action" in the area of programming**: not "writes code," but "uses writing code to get something done," reading the project, editing files, running commands, taking several steps in a row.
- Its **form varies and keeps changing** (terminal / IDE / web / cloud, both local and cloud). This book only covers the mental model that won't date; for how to install it and what to type, **check the official docs** (Chapter 25, Appendix C).
- Core attitude: treat it as a **very capable new coworker on day one**: quick, willing, but unaware of your rules and liable to be confidently wrong.
- **Final responsibility always stays with the human:** "Don't let through what you don't understand and haven't verified." Precisely because the gatekeeping is yours, you can hand off the grunt work without worry.
- This chapter is the map; the next three fill in detail: **signing off (read the diff / run tests, Chapter 25), permissions and rollback (Chapter 26), plan first then act (Chapter 27)**, all of it putting "assign the work, keep the gatekeeping yourself" into practice.

In the next chapter (Chapter 24) we'll walk through this shared "investigate -> plan -> act -> sign off" workflow from start to finish.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** Lining up "coding agent" with the "Agent" from Chapter 19, which sentence is most accurate?
   - A. A coding agent has nothing to do with an Agent; they're two different things
   - B. A coding agent is a kind of Agent, an AI that takes action, except the place it acts is your code project
   - C. A coding agent doesn't take action, it only gives suggestions
   - D. An Agent is one feature button inside a coding agent
   > **Answer: B.** The Chapter 19 Agent is an AI that breaks goals into steps, calls tools, and runs several steps on its own; a coding agent is that same ability aimed at "changing a code project." People who pick A or D haven't built the "it's a kind of Agent" relationship; people who pick C are still stuck on the old impression that "chat AI only gives text."

2. **[Basic · Concept]** For a coding agent, what's the difference between "writing code" and "doing things"?
   - A. No difference, same thing
   - B. "Writing code" gives you a block of text you use yourself; "doing things" is it reading the project, editing files, and running commands to get the goal done
   - C. "Doing things" means it makes coffee
   - D. "Writing code" is more advanced
   > **Answer: B.** This is exactly the line between the chat layer and the agent layer: the former spits out text and you execute; the latter executes itself and takes several steps in a row. Treating it as "a smarter search box" is mistaking it for the "only writes code" layer.

3. **[Basic · Misconception]** "It's AI, the code it writes should be correct, use it straight away." What's wrong with that?
   - A. Nothing, what AI writes is correct
   - B. It will confidently get it wrong (hallucination happens here too); "finished" isn't "correct," and what you can't follow or haven't verified shouldn't be let through
   - C. The code it writes never runs
   - D. You have to pay before using it
   > **Answer: B.** Hallucination (Chapter 9) happens when writing code too, and because code looks "professional" it fools non-experts more easily. That's why later chapters teach "read the diff, run tests." Option C goes to the other extreme; it often does run, the problem is that "runs" isn't "correct."

4. **[Advanced · Misconception]** "Claude Code / Codex is one fixed website (or one piece of software), the form is set in stone." Why does thinking this way cause trouble?
   - A. No trouble, the form is fixed
   - B. Their form varies (terminal / IDE / web / cloud), local and cloud both exist, and it's being updated; pinning it to one form goes out of date fast. Check the official docs for specifics
   - C. They only exist in cloud form
   - D. They have no interface at all
   > **Answer: B.** Form is in the "will change" category, so this book only covers the mental model that won't date and leaves "where to use it, how to install it" to the official docs. But two things are stable: Claude Code comes from Anthropic (core: Claude), Codex comes from OpenAI; that attribution is safe to remember.

5. **[Basic · Scenario]** Your first time using it, it says "feature added" in no time flat. As the "person showing it the ropes," what should you do next?
   - A. Just trust it and merge it live
   - B. Treat it as a new coworker on day one and sign off: what exactly did it change, did it break anything else, can I explain what this bit does
   - C. Pay it a compliment and call it done
   - D. Have it do the next, bigger feature
   > **Answer: B.** "Finished isn't correct." It's like a capable coworker who just started, and signing off is the job of the person showing them the ropes (the three specific moves are in Chapter 25). Picking A treats it as a "turnkey contractor," which is exactly the most common way to crash.

6. **[Advanced · Hands-on / Observation]** No need to actually install anything: find a "does things vs only gives advice" contrast near you, for example "a navigation app that drives you through each turn" versus "a stranger who points you in a direction." Think about it: which is a coding agent more like? And where does it differ from a chat AI that "just hands you a block of code to copy"?
   > **What you should notice:** A coding agent is like the navigation that "drives you through each turn": it executes itself and takes several steps in a row. A chat AI is like the stranger who "points a direction": it gives you information, but you walk the road yourself. The difference is "who takes action, and who takes several steps in a row." And precisely because it acts on its own and might point the wrong way, the "sign-off" gate has to stay with you (Chapters 25, 26). The form, installation, and commands of specific tools: **check the official docs**.
