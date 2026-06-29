〔Everything in this chapter about how Codex is installed, its commands, its interface, and what it can do will change as new versions ship, so always **refer to the official documentation**. This chapter only covers "what it is, when to use it, how to judge it, and what to watch out for"; for word-for-word commands and deeper features, see **Appendix C** and the official docs.〕

The last chapter covered Claude Code; this one is **Codex**'s turn. If you jumped straight here, here's a bit of background: Chapter 24 walked through the **general workflow** of "investigate, plan, do, check" for directing coding agents in full, and Chapter 28 put it to work on Claude Code. **This chapter is the same workflow put to work on Codex.**

So you'll find this chapter and the last one highly consistent in their "approach," but going their own way on "how exactly to operate." That's exactly the point: **the workflow is universal, the tools differ.** Likewise, this chapter **doesn't ask you to know how to code**, and **pins down no specific command, button, or shortcut**: those change too fast, so they're all handed off to the official docs and Appendix C.

## 1. What Codex is: a coding agent from OpenAI

First, lock in one stable fact: **Codex comes from OpenAI.** It and Claude Code are "same type, different makers": both are coding agents that will **read files, change code, and run commands** on your project on their own, but they differ in maker and in the core model.

Like Claude Code, **Codex isn't a single fixed web page or piece of software either**. You might run into it in several forms:

- **Command line (CLI)**: directing it from the terminal;
- **Code editor (IDE) plugin**: embedding it in your editor;
- **Web interface (often called Codex's web / cloud workspace)**: assigning it tasks in the browser;
- **Cloud tasks**: handing the work off for it to run in the background in the cloud, and coming back later to collect.

> **Key point:** Same line as Chapter 28: **some forms run on your own machine and some run in the cloud; the exact forms differ and are changing fast, so always defer to the official docs and the product's official forms.** The only two things you can firmly lock in are that it comes from OpenAI and that it's a coding agent that acts. For the rest — "how to install it, what it looks like, what to type" — always go to the official docs for the current version.

## 2. Same as and different from Claude Code: same approach, different methods

This is the most useful section in the chapter. Put Chapter 28 and this one side by side and you'll instantly grab where the "universal" and the "differing" parts are.

| | Same (stable, learn once and use everywhere) | Different (**refer to the official docs**, will change) |
| --- | --- | --- |
| **Positioning** | Both are coding agents that "act on your project" | Maker (OpenAI vs. Anthropic), core model differ |
| **Workflow** | Both follow Chapter 24's "investigate, plan, do, check" | How exactly to trigger "produce a plan" / "look at the diff" differs |
| **Safety** | Both should be set up with permission confirmation + a rollback-capable environment | Default behavior, permission granularity, confirmation method differ |
| **Getting started** | Both: try small steps in an environment you can undo first | Install method, login / authentication method, commands differ |
| **Forms** | Both have many forms: CLI / IDE / web / cloud | The exact name, entry point, and abilities of each form differ |

Read it as one sentence: **the judgment you learned in Chapter 24 — what to assign, how to approve a plan, how to look at a diff, how to check the work — applies word for word when you switch to Codex; the only thing you need to look up again is "how exactly to do these acts inside Codex."**

So facing Codex, the right stance is just like the last chapter:

- **Don't rush to operate it.** Go to the official docs to see "which form is recommended right now, how to install it, how to log in," and follow what they say.
- **Bring the workflow from Chapter 24 over.** Have it **investigate first, then produce a plan, you approve, then it acts, and check carefully when it's done**: this rhythm holds on any tool.
- **Use a small project you can undo the first time.** Run a minimal request through in a state managed by Git with a new branch checked out (Chapters 25 and 27), don't have it touch something important right out of the gate.

> **How you'll actually run into this:** Plenty of people use both Claude Code and Codex, then get tripped up by "why doesn't this command work over there." **Don't take one tool's specific commands as another's.** What truly carries across tools is the judgment from Chapter 24 for "how to direct an assistant that will make mistakes and will act"; for specific commands, check each tool's own official docs. Remember this and you won't get lost in the differences between the two.

## 3. Keys and cost: manage them well from day one

This section gets pulled out for emphasis, because tools like Codex often need to use an **API key**, and **keys and cost are where things most easily go wrong on day one**. This only covers "why to manage them, how to judge, what to watch out for," echoing Chapters 35, 37, and 38.

### 1. What a key is, and why to take it seriously

You can think of an **API key** as a string that is "a key representing your identity and your bill." **Whoever gets it can call the service in your name and spend your money.** So its security level is the same as a password, or even higher, because it often connects directly to billing.

From this follow a few **non-negotiable disciplines** (Chapters 37 and 35 go further):

- **Never paste a key into the chat box.** Don't paste a key into the chat with the AI to save effort: what you paste in is as good as handed over (that "pasting it in = handing it over" from Chapter 3). When you need to configure a key, do it the **safe way** the official docs specify (refer to the official docs for the exact method).
- **Never commit a key to a public repository.** Writing a key into code and pushing it to a public Git repository is the most classic and most disastrous leak: crawlers can scan it within minutes, and then someone runs up your bill. Config secrets should go somewhere that **won't be committed** (Chapter 35 covers practices like "environment variables / secret management"; refer to the official docs for the specifics).
- **If you suspect a leak, void and reissue immediately.** If you accidentally paste one out or commit one, go to the corresponding platform right away to **revoke the old key and get a new one** (refer to the official docs for the exact steps); don't count on luck.

> **Key point:** Carve one sentence into your head: **a key is the key to your wallet; it doesn't go in the chat box, it doesn't go in a public repository.** This holds regardless of tool or form, anywhere a key is used. It echoes that iron rule from Chapter 37 (privacy and data tiers): **the highest-classified things, you absolutely do not feed in.**

### 2. Cost: billed by the token, don't burn money without realizing it

Tools like Codex are fundamentally **billed by the token** (Chapters 3 and 38 covered the token as the unit of measure). This means:

- **The more files you have it read, the longer you chat, the more you change, the faster you spend.** A single "have it read the whole project and then make a big change" can quietly burn quite a few tokens.
- **Cloud / background tasks especially call for awareness.** Tossing the work to it to run in the cloud is convenient, but it also means it may "run on its own for a long time"; before you start, have a sense of "roughly how much there is to do," and don't just walk away.
- **Keeping the task focused is the best way to save money.** Break the task small and keep the conversation clean: it saves tokens and lifts quality, which are two sides of the same coin as Chapter 38's "don't burn money, don't waste it either."

> **Key point:** Set a mental "budget gate." Before you start, ask yourself: is this task **worth** having it read this much and run this long? Break the task into smaller pieces and stay able to halt it at any time (Chapters 26 and 30): it's both safety and saving money. For the exact billing method, unit price, and quotas, refer to the official docs; this book only covers the unchanging mechanism of "billed by the token, the more you chat the more it costs."

## 4. Deep usage and specific operations: refer to the official docs, see Appendix C

Like Claude Code, Codex also has its own whole set of advanced abilities, config, and commands, but these are **exactly the parts that change fastest and least belong in a book**. The book's handling stays clear:

- **How exactly to install it, log in, what commands to type, which button to click**: always **refer to the official docs**.
- **Advanced moves (custom config, connecting to external tools / data, automation, and so on)**: pointed to **Appendix C** and the official docs, not pinned down in the main text.
- **Whether it can do some specific thing, what tiers there are, what the model versions are called**: these are all volatile, so **take the official docs as the latest source**.

> **Key point:** You might be curious "which is stronger, Codex or Claude Code, and which can do X." This kind of comparison **flips back and forth frequently across versions**, and this book doesn't draw such a conclusion. What you really want to walk away with is an ability that **doesn't depend on a specific tool**: reading the workflow from Chapter 24, and holding the discipline of keys and checking the work. Which tool is stronger or weaker will change; this judgment won't. For a comparison of specific abilities, check each one's official docs.

## 5. Safety checklist (sharing one baseline with the last chapter)

Whether you use Claude Code or Codex, these baselines are the same, so here they are nailed down again:

- **An environment you can undo comes first.** When it acts locally, start with **Git** first and **check out a new branch** first (Chapter 26); for cloud / web forms use the platform's own isolation and rollback (refer to the official docs).
- **Don't mindlessly wave permission through.** It requests permission whenever it's about to do something with consequences (Chapter 26); don't just keep clicking "approve" — that's ripping out the brakes.
- **Never paste in keys / passwords / real personal information.** See section 3 of this chapter, and Chapter 37.
- **Checking the work is your responsibility.** Look at the diff, run the tests, and be able to say clearly what this section is doing; if you can't read it, don't merge (Chapter 25); what's generated is your responsibility (Chapter 39).

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| Claude Code's commands should work in Codex too | The two tools' commands differ; what carries across tools is the workflow from Chapter 24, not specific commands |
| Codex is just one fixed web page | It has many forms (CLI / IDE / web / cloud) and is still changing; **refer to the official docs** |
| Pasting a key into the chat box is the most convenient | Pasting it in = handing it over; a key never goes in the chat box, never in a public repository (Chapters 37 and 35) |
| I'm paying monthly anyway, so I can burn tokens freely | It bills by the token; the more you read and the longer you chat the more it costs; breaking the task small is what saves money (Chapter 38) |
| Once I hand off a cloud task I don't have to mind it | It may run on its own for a long time and quietly spend money; have an expectation before you start, stay able to halt it |
| Which tool is stronger, the book should have a verdict | The ability comparison flips back and forth across versions, so the book draws no conclusion; **refer to the official docs** |

## Summary

- **Codex comes from OpenAI** (stable fact), and is a coding agent that acts on your project; it **takes many forms (CLI / IDE / web / cloud) and is still changing**: for how to install and operate it, **refer to the official docs**.
- **Same approach as Claude Code, different methods**: Chapter 24's "investigate, plan, do, check" is universal, while **the specific commands / install / abilities all differ and change fast**.
- **Manage keys and cost well from day one**: a key never goes in the chat box, never in a public repository (Chapters 37 and 35); it bills by the token, so breaking the task small is what saves money (Chapter 38).
- **Deep usage and specific operations are in Appendix C and the official docs**, the book doesn't pin them down, nor draw a "which is stronger" conclusion.
- The safety baseline shares one set with the last chapter: an environment you can undo, don't mindlessly wave permission through, don't paste in keys, take responsibility for checking the work.

In the next chapter we switch angles: whatever tool you use, **a crash will happen**. Chapter 30 lays out the eight common "crash scenes" and "what to do for first aid when you're stuck" all at once.

---

## Quiz

> Six questions, covering four types: concept, misconception, scenario, and hands-on. Think for yourself first, then read the answer in the quoted block.

1. **[Basic · Concept]** About Codex, which line is a **stable fact you can lock in**?
   - A. It comes from Anthropic
   - B. It comes from OpenAI, and is a coding agent that acts on your project
   - C. It has only one form, the web page
   - D. It's stronger than Claude Code, that's settled
   > **Answer: B.** "Codex comes from OpenAI" is a stable fact. A mixes up the names (that's Claude Code); C pins down the form (it has many: CLI / IDE / web / cloud — refer to the official source); D is the kind of "which is stronger" comparison that flips back and forth across versions, so the book draws no verdict.

2. **[Basic · Concept]** Between Codex and Claude Code, what's "learn once, works on both"?
   - A. The specific commands and shortcuts
   - B. Chapter 24's "investigate, plan, do, check" workflow and the discipline of checking the work
   - C. The install and login method
   - D. The core model
   > **Answer: B.** What carries across tools is the **workflow and judgment**, whereas commands, install, login, and the core all differ by maker and will change (refer to the official docs). Tell the universal approach apart from the volatile methods and you won't get lost in the differences between the two.

3. **[Basic · Misconception]** "Pasting the API key into the chat with the AI is the most convenient." Why is this a big no?
   - A. It's fine, very convenient
   - B. What you paste into the chat box is as good as handed over; a key is the "key to your wallet," and whoever gets it can spend your money
   - C. It just makes the conversation slower
   - D. After you paste it the model forgets it
   > **Answer: B.** A key's security level is the same as a password, or even higher (it often connects directly to billing). **Never in the chat box, never in a public repository** (Chapters 37 and 35). This holds regardless of tool or form, anywhere a key is used.

4. **[Advanced · Misconception]** "I pay monthly to use Codex, so I can burn tokens freely, no need to save." Where's the mistake?
   - A. No mistake, it's a monthly plan so use it freely
   - B. It's fundamentally billed by the token; the more files you have it read, the longer you chat, the more you change, the more it costs; cloud tasks may also run on their own for a long time and quietly spend money
   - C. Tokens have nothing to do with cost
   - D. Saving tokens only makes it dumber
   > **Answer: B.** Chapters 3 and 38 covered the token as the unit of measure. **Breaking the task small and keeping the conversation clean** saves money and lifts quality; for cloud / background tasks especially, have an expectation of "roughly how much to do" before you start. For the exact billing, refer to the official docs, but the "the more you chat the more it costs" mechanism doesn't change.

5. **[Basic · Scenario]** You want to use Codex for the first time to make a change to a project that's **very important to you**. What's the safer approach?
   - A. Have it make a big change all at once on the important project directly
   - B. First run a minimal request through on a small project you can undo, on a new Git branch, get used to it with the rhythm from Chapter 24, then handle the important things
   - C. Paste the key into the chat box first and have it "authenticate"
   - D. Toss all the work to the cloud and then walk away
   > **Answer: B.** Don't overreach the first time: **an environment you can undo + small-step trial + the workflow from Chapter 24** (Chapters 25 and 27). A is hard to roll back and risky; C is a cardinal sin with keys; D, walking away, is both dangerous and likely to burn money.

6. **[Advanced · Hands-on / Observation]** You don't have to actually install the tool: find the few baselines that are **exactly identical** in Chapter 28 (Claude Code) and this chapter (Codex) (hint: permission, rollback, keys, checking the work), and copy them out into a "my coding-agent safety card." Then think: why do these few hold **regardless of tool**?
   > **What you should notice:** These baselines are universal because they come from the two traits all coding agents share, "**will make mistakes + will act**" (Chapter 24), not from any one product's design. Tools will change and commands will change, but as long as it "will make mistakes and can touch your stuff," this safety card keeps working. For specific commands and deep usage, **refer to each one's official docs** (see Appendix C).
