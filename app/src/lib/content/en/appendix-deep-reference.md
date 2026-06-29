Throughout the book we kept pushing "the exact command to type, the exact name of that switch" to later, saying "details go in Appendix C." This is Appendix C. It gathers in one place **what Claude Code and Codex can actually do, what problem each capability solves, when you'd reach for it, and where it tends to go wrong**, but it does **not** memorize the exact commands for you.

Why not memorize the commands? Because this is the same line the book keeps drawing:

> **Key point (read this first):** Both tools change fast. **The names of commands, their parameters, the fields in config files, what the files are called, where they live, how events are named: all of this shifts from version to version.** So this appendix only covers the **relatively stable** things, like what the capabilities are, what each one is for, how to judge whether you need it, and what traps to watch for. For the **exact command, parameter, or config syntax, always refer to the provider's official documentation.** Treat this appendix as the map and the official docs as live traffic.

## 1. First, remember where to look (the official docs)

A good map still needs current traffic. When you hit "how exactly do I write this command right now," these two places will not steer you wrong:

| Tool | Maker | Where the official docs live |
| --- | --- | --- |
| Claude Code | Anthropic | Search for "Claude Code official docs," or visit Anthropic's docs site (such as the Claude Code section under docs.claude.com) [verify against the official docs] |
| Codex | OpenAI | Search for "OpenAI Codex official docs," or look up Codex in OpenAI's official help center or developer docs [verify against the official docs] |

> **Key point:** One good habit: **before you use it, glance at the "quick start" or "changelog" in the official docs.** When a version changes, the easiest move is to read what the maker says directly, instead of typing from memory.

## 2. Where they "live": terminal, IDE, web, cloud

Before memorizing any command, clear up one common misunderstanding.

A lot of tutorials say "Claude Code / Codex is just a command-line tool installed on your computer." That is **only one of its forms**. In practice you might run into them in several places:

- **Terminal (command line):** running in the black box on your own computer.
- **IDE plugin:** installed into an editor like VS Code or JetBrains, used while you write code.
- **Web / cloud tasks:** you hand it work in a browser; it runs in a **remote cloud environment** and gives you the result when it's done.
- And new forms that keep showing up with each version.

> **Key point (the book's third red line):** **Don't assume "it must be running on this computer of yours."** It **can run locally and it can run in the cloud**, and the exact form changes as the product updates. This matters, because it directly decides "can it read your local files" and "has your code ever left this machine," which is a privacy and security question (see Chapter 37). **For the form you're actually using, defer to the official docs.**

## 3. In-session commands (slash commands and the like)

**What it is:** while you're talking with the tool, a "shortcut instruction" you type with a special prefix (often a slash `/`) that makes it do something unrelated to "writing code," such as viewing help, clearing the current context, switching the model or mode, initializing project rules, or managing external connections.

**Mental model:** ordinary words are "the thing I want you to do"; a slash command is "I want to adjust the tool itself." The first is content, the second is a control switch.

**How to know which ones exist and how to write them:** the most reliable way is to look at the tool's own command list in the session (many tools list it when you type `/` or "help"). For **which commands exist and what their parameters are, rely on the official docs and the tool's own prompts.**

**Common trap:** mixing up "things you say to the AI" with "slash commands." If you want it to clear its memory, you type the dedicated command, not "please forget what came before"; the latter won't necessarily clear anything.

## 4. Permissions and the config file

**What it is:** this kind of tool can edit files and run commands, so they all build in a **permission** mechanism: stop and ask you before a risky action, or automatically allow / block based on rules you've set. These rules usually live in a **config file** (Claude Code tends to call it something like `settings.json`; Codex has its own config).

**Mental model:** think of it as setting permissions for a capable intern: which things they can do on their own, and which they must raise a hand to ask about first. The config file is that "permission list."

**A few typical permission strengths (the gist, not the exact names):**

| Rough level | What it means | Good for |
| --- | --- | --- |
| Ask every step | Any change, any command asks first | Just starting out, or working in an important project |
| Auto-allow part of it | "Read-only" actions like reading files or looking things up happen automatically, changes still need confirmation | Speeding up once you're comfortable |
| Plan only, no action | It only proposes a plan, doesn't actually change anything | When you want to see clearly what it intends to do first |

> **Key point:** **For how many modes there are, what each is called, and how to write the fields in the config file, always refer to the official docs.** The safe default for a beginner is "have it ask first before any action that makes a change."

**Common trap:** setting permissions to "fully automatic" right away, for speed. By the time it has acted somewhere it shouldn't, you realize you never set up any guardrail. **The more important the project, the more you keep that gate where a human confirms.**

## 5. The project-rules file: give the tool a "manual for this project"

**What it is:** you can put a **rules file** in the project that writes down "what tech this project uses, how the directories are split, which rules must be followed, what is forbidden." The tool reads it every time it starts work and follows it. Claude Code tends to use a file called `CLAUDE.md`; Codex has its own equivalent. **For the exact file name, location, and how it takes effect, the official docs are the authority.**

**This is "product-layer memory," not the model growing a memory.** This echoes the red line that runs through Chapters 3 and 13:

> **Key point:** the model itself **has no memory across conversations.** The reason it "remembers this project's rules" is that **the product re-injects this rules file into the context every time it starts work** and feeds it in. It's the product layer re-feeding it, not the model remembering on its own. Once you understand this, you see: **the clearer and more specific the rules, the steadier it behaves**; anything not written in the rules, it "doesn't remember."

**How to write it so it's actually useful (the key points):**

- **Use proper nouns, not adjectives.** "Code should be clean" is useless; "all HTTP requests go through `services/apiClient`, no direct `fetch`" is useful.
- **Spell out "must do" and "must not do."** For example, "ask first before adding a third-party dependency," "don't reinvent your own version that bypasses the existing shared modules."
- **Add the traps you've hit as you go.** Whenever it goes off track, add the matching rule. This file is a living document that **gets better the more you use it.**

For a detailed "starter project-rules file" and how to build the whole workflow, see **Appendix D (the Harness method)**.

## 6. Plan mode and "reasoning effort"

**Plan mode (plan mode and the like):** have it **propose a plan first, not act directly**; once you've looked it over and signed off, it implements. This is one of the habits the book values most (Chapter 27), and many tools build in this switch so you don't have to ask for it manually every time.

**Reasoning effort / how hard it thinks:** some tools let you dial "have it think a while longer, or answer quickly." For hard problems and designs with trade-offs, set it higher; for small chores, lower, to save time and money.

> **Key point:** **for what these two switches are exactly called and how to set them, refer to the official docs.** But the reasoning behind them is stable: **for important things, have it think it through, propose a plan, and only then act.**

## 7. Subagents

**What it is:** handing one kind of work to a **specially configured "stand-in,"** such as one that only does code review, or one that only does research. Each has its own description (a bit of config, often including a name, a description of its job, which tools it can use, and so on).

**Mental model:** like splitting up work on a team. The main conversation is the "project manager," and subagents are "team members" with their own specialties; you send out the matching work, and they stay out of each other's way and stay focused.

**Common trap:** building a pile of subagents right away. In reality, **for most everyday tasks one main conversation is enough.** Once you clearly feel "this kind of work keeps repeating and needs a fixed routine," then consider configuring a dedicated one. **For the exact config fields and how to define them, the official docs are the authority.**

## 8. Hooks

**What it is:** having the tool **automatically trigger** an action you've specified at **certain moments**. For example, "every time it finishes editing a file, automatically run formatting / tests," or "before a certain kind of action starts, automatically run a check."

**Mental model:** like home automation, "the light turns on when the door opens." You define "when this event happens, automatically do that," and it watches the rest for you.

**Common trap:** this is a more advanced feature, and for ordinary use you **can simply leave it alone at first.** Learn it when you need it. **For which events exist and how to configure them, refer to the official docs.**

## 9. Skills

**What it is:** packaging "a standard procedure for doing a kind of work, plus the materials it needs" into a reusable **skill package** that the tool calls when needed. This is the same thing Chapter 22 covers; the reminder here is just that it's the mechanism that **makes a capability reusable.**

**Common trap:** don't use it for the sake of using it. First explain the work in plain words; only a **fixed routine that shows up again and again** is worth turning into a skill package. **For the packaging format and how to call it, the official docs are the authority.**

## 10. MCP: wiring the AI up to external tools and data

**What it is:** MCP (covered in detail in Chapter 22) is a "universal interface" that lets an AI tool connect to **external tools and data sources**, such as a database, an internal system, or a kind of file service. The connection is usually made through an "add MCP server" command or a bit of config (such as Claude Code's `claude mcp add` kind of usage).

**Mental model:** giving the AI "peripherals." The model on its own only chats; wire up MCP and it can go look up, fetch, and use those external resources.

> **Key point (security):** connecting external data = bringing **external content** into the conversation. **That external content may hide "fake instructions" (prompt injection, Chapters 22 and 40).** Only connect sources you trust, and don't give it too much power. **For the exact add command and config syntax, refer to the official docs.**

## 11. Installing, getting it running, and troubleshooting

**The minimal path (the idea, not the literal commands):** install the tool, log in / set up the account or key, get it running in a project directory, then give it a safe small task (such as "explain in plain words what this project does") to get a working run and build confidence.

**The most common places it stalls:**

- **Won't install / won't run:** usually the runtime environment (version, dependencies) or the network. Copying the raw error text to the AI and having it read it for you is often fastest.
- **Login / authentication fails:** an account, plan, or key problem; check each item against the official "quick start."
- **It can't read your files:** first confirm which form you're using (local or cloud, see section 2 of this appendix). A cloud-based form simply can't read the files on your own machine.

> **Key point:** **for the exact install command, system requirements, and login method, refer to the official docs**, and these are what change most easily from version to version. Glancing at the official "quick start" before installing is the easiest move.

## 12. Git / GitHub / PR operations

**What it is:** in a local code project, this kind of tool can usually help with version-control work: viewing changes, committing, opening a branch, even drafting a PR (pull request) for you. This is exactly Chapter 25's "read the diff, roll back, accept" landing inside the tool.

**Mental model:** it can help you **record and undo** changes, which is why you dare to let it edit; if you don't like the result, roll back (Chapters 25 and 26).

**Common trap:** letting it "commit / push while it's at it" without your having read the diff. **What gets committed, where it gets pushed, whether to open a PR, should be your call**; especially for outward-facing, hard-to-undo actions like "push / merge," be sure to confirm yourself. **For the exact commands, refer to the official docs.**

## Summary

- This appendix is a **capability map** for Claude Code / Codex: what the capabilities are, what each one solves, when to use it, and what traps to watch for.
- **It deliberately doesn't memorize the exact commands for you**, because commands, parameters, config, file names, and event names all change with versions, so **always check the official docs.** Before you use it, glance at the official "quick start / changelog."
- A few red lines that run through the book, stated once more here: **don't assume it runs on your own machine** (terminal / IDE / web / cloud are all possible); **the project-rules file is "product-layer memory,"** taking effect by being re-fed in each time; **the more important the project, the more you keep those gates: see the plan first, ask before changes, make the commit call yourself.**
- To string these capabilities into a reusable workflow, read on in **Appendix D**.
