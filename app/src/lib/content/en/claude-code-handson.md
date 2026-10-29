Claude Code is Anthropic's coding agent. It can explore a project, edit files, run commands, and help with Git. It has terminal, editor extension, desktop app, and web entry points; this chapter uses the terminal and walks through a concrete first exercise.

The installation methods, account requirements, and commands in this chapter were checked on 2026-10-29. Before you start, note the version you installed: older tutorials may describe installation steps or screens that have since changed.

## 1. Install it and open a small project

First, check your account. As of October 2026, Claude Code requires a Pro, Max, Team, or Enterprise plan or a Console (API) account; the free claude.ai plan doesn't include it. You can also use it through a third-party cloud such as Amazon Bedrock. If you're not comfortable with the terminal, there's also an official desktop app (macOS, Windows, Linux); the download links are in the setup documentation.

The recommended method is the native installer, which then updates itself in the background. On macOS and Linux (including WSL on Windows):

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

In Windows PowerShell (there's also a command for CMD):

```powershell
irm https://claude.ai/install.ps1 | iex
```

Both commands download and run an installation script, so make sure the address is the official one and follow your organization's rules. On Windows, also installing Git for Windows (Chapter 26) lets Claude Code run Bash commands; without it, Claude Code still works and uses PowerShell instead.

You can also use a package manager: `brew install --cask claude-code` with Homebrew, or `winget install Anthropic.ClaudeCode` with WinGet. These don't update automatically by default, so run `brew upgrade claude-code` or `winget upgrade Anthropic.ClaudeCode` from time to time. Pick one method. The `npm install -g @anthropic-ai/claude-code` command in older tutorials is marked deprecated in the official README.

Once installed, open a new terminal window, confirm the command works, and go to your practice project. The `git` commands below need Git installed; if the project isn't under Git yet, save a starting point first as described in "Git: the bare minimum to get started" in Chapter 26:

```bash
claude --version
claude --help
cd /path/to/your/project
git status
git switch -c practice/claude-first-task
claude
```

Replace the path with a real directory. `git status` confirms there are no unsaved changes, and `git switch -c` creates a practice branch. The first time you run `claude`, sign in through the browser prompts; afterwards, `/status` shows the version, model, and account in use. If installation goes wrong, `claude doctor` prints diagnostics.

## 2. Ask for investigation, then one change

A good first request:

```text
Read the project instructions and README. Explain what this project does,
where its entry point is, and how its existing checks are run.
Do not edit yet. Suggest one small documentation improvement.
```

Check whether the answer names actual files and commands. Then authorize the improvement:

```text
Make that documentation improvement. Keep the change limited to its purpose.
Inspect the diff and perform the relevant checks. Report the files changed,
the commands actually run, and any unresolved issue. Do not push or deploy.
```

Then sign off as in Chapter 25: have it explain each change in `git diff` in plain words and compare that with the diff. If it changed how something works, also run the relevant tests and try the new behavior yourself.

## 3. Project instructions, memory, and skills are different

`CLAUDE.md` holds project conventions, common commands, and constraints, and is loaded into the context at the start of each session. `/init` can draft it for you, but check what it generates. A small example:

```markdown
# Project guidance
- Read the README and existing implementation before changing behavior.
- Use the repository's documented package manager and test commands.
- Keep generated files out of manual edits unless the task requires them.
- Use synthetic data in examples.
- Explain what was verified and what remains uncertain.
```

Replace general statements with specific commands only after checking those commands. Don't paste an entire manual or any keys into it.

| Mechanism | What it stores | How to treat it |
| --- | --- | --- |
| `CLAUDE.md` and project rules | Deliberate instructions for working in this project | Review and maintain them like other project documentation |
| Auto memory, where enabled | Notes the product kept from earlier work | Inspect and correct them; old observations may no longer hold |
| Skills | Reusable procedures, optionally with scripts or reference files | Check the source; use them when the task matches |
| Current conversation | This task's requirements, evidence, and progress | Hand over the key state when moving to a new session |

`/memory` lets you edit `CLAUDE.md`, turn auto memory on or off, and view what it has saved. All of this is the product putting saved text back into the context; the model itself hasn't "learned" your project, and a claim written into memory doesn't become true because it's there.

## 4. Learn a few commands by their purpose

These in-session commands are available as of October 2026; type `/` to see what your version actually offers.

| In-session command | Purpose |
| --- | --- |
| `/help` | See available commands |
| `/status` | See version, model, account, and connection status |
| `/plan` | Enter plan mode: propose an approach without changing files (Chapter 27) |
| `/permissions` | View or adjust allow, ask, and deny rules |
| `/memory` | Edit `CLAUDE.md` and manage auto memory |
| `/diff` | See changes in your working files, including the edits it just made |
| `/code-review` | Review the current diff for correctness problems (alias `/review`) |
| `/rewind` | Return the conversation and the files it edited to an earlier checkpoint (or press Esc twice with an empty prompt) |
| `/usage` | See this session's usage and your plan limits (alias `/cost`) |

Two cautions. `/rewind` tracks only files Claude Code changed with its own editing tools; files changed only by terminal commands, or by you by hand, aren't covered, and outside actions certainly aren't. The documentation says plainly that it doesn't replace Git. `/code-review` runs in the same session, which makes it a good first check; for changes touching money, personal data, keys, deletion, or publishing, still get a review from a new session or a person, as Chapter 25 says.

## 5. Know the boundaries of permissions, execution, and cost

The four permission levels and the matching modes are in Chapter 26. As of October 2026, recent versions of Claude Code start terminal sessions in auto mode, where another model reviews actions for you, so it won't necessarily ask you each time. For your first practice run, press Shift+Tab until the status bar shows "manual mode on": in Manual mode it asks before most file edits and commands. Pressing Shift+Tab again switches to `acceptEdits` or plan mode. When it asks for permission, read what command it is, which files or services it touches, and what the consequences are. One approval may cover later repeats of the same action, so don't assume you'll be asked every time. Terminal commands, hooks (scripts that run automatically at set moments), skills with scripts, and external tools can all have real effects, and a Git branch can't take back a sent message or a payment.

If the product supports it and the task allows it, subagents can share investigation or implementation work. Divide their areas first and decide who integrates the results. Separate conversations don't necessarily work in separate directories, so parallel edits can overwrite each other, and delegating work doesn't widen the original task's permissions.

Think about cost by account path: a subscription draws on your plan's allowance, which `/usage` shows; API or third-party cloud use is billed through those accounts; optional usage credits, once turned on, are counted separately. A subscription doesn't pay for an API key. For a sense of scale: as of October 2026, Anthropic says enterprise deployments billed through the API average about $13 per developer per active day, with 90% of users under $30. If usage looks unusual, first check the account you're signed in with, the model, the length of the task, and background work (Chapter 38).

## Sources and version notes

Checked on 2026-10-29. The [setup documentation](https://code.claude.com/docs/en/setup) supports the account requirements, desktop app, native installer (including Windows PowerShell and CMD), Homebrew and WinGet not updating automatically by default and their upgrade commands, and `claude doctor`; the [official Claude Code README](https://github.com/anthropics/claude-code/blob/main/README.md) supports npm installation being deprecated; the [commands reference](https://code.claude.com/docs/en/commands) supports the in-session commands and aliases listed here; the [checkpointing documentation](https://code.claude.com/docs/en/checkpointing) supports what `/rewind` covers and that it doesn't replace Git; the [costs documentation](https://code.claude.com/docs/en/costs) supports `/usage` and the average cost figures. This records what the documentation showed, which may differ from your installed version.

---

## Quiz

1. **[Basic · Concept]** Which installation advice matches the checked official documentation? <!-- quiz: q01 revision: 2 -->
   - A. npm is the official first choice; install Node.js first, just to be safe
   - B. After installing with Homebrew or WinGet, it keeps itself updated
   - C. Pick one listed method, like the native installer; npm is deprecated
   - D. A free claude.ai account can use it as soon as it's installed
   > **Answer: C.** The official docs recommend the native installer and also list Homebrew and WinGet; the README marks npm installation as deprecated (A). Homebrew and WinGet installs don't auto-update by default, so you run the upgrade command yourself (B). Claude Code requires a Pro, Max, Team, Enterprise, or Console account; the free plan doesn't include it (D).

2. **[Basic · Concept]** What belongs in `CLAUDE.md`? <!-- quiz: q02 revision: 2 -->
   - A. Verified project conventions, handy commands, and limits
   - B. API keys, so it can call the services directly every time
   - C. Full transcripts of every earlier conversation, for recall
   - D. A blanket "you never need to ask me for permission again"
   > **Answer: A.** Keep project guidance concise, accurate, and useful. Keys never belong in project files (B); a full history is too long and buries what matters (C); project guidance can't replace permission controls or grant unlimited authorization (D).

3. **[Advanced · Misconception]** Auto memory contains an old test command. What should you do? <!-- quiz: q03 revision: 2 -->
   - A. Trust the memory, since it was summarized from earlier work
   - B. Take it as a sign the weights changed and wait for a new version
   - C. Turn off all memory features and remember commands yourself
   - D. Verify the current command, then correct the saved note
   > **Answer: D.** Memory is context notes saved by the product, and they can go stale. They aren't a more reliable source than the current repository (A), nor a change to model weights (B). You can inspect and correct notes, so one outdated entry is no reason to switch everything off (C).

4. **[Basic · Scenario]** Before starting a long task, which check helps avoid billing surprises? <!-- quiz: q04 revision: 2 -->
   - A. Confirm the install worked and the version number shows up
   - B. Check the account in use, its allowance, and paid extras
   - C. Assume a subscription already covers every single API call
   - D. Keep the request short, which guarantees you stay within limits
   > **Answer: B.** Subscription allowances, API billing, and optional extras are separate concerns; the active account and usage screen provide the relevant evidence. A successful install (A) says nothing about cost; a subscription doesn't pay for an API key (C); a short request can't guarantee usage, since tool output and background work in a long task also count (D).

5. **[Advanced · Scenario]** Two subagents will edit a repository. What is a useful precaution? <!-- quiz: q05 revision: 2 -->
   - A. Separate chats are isolated by nature, so they won't collide
   - B. Let both edit the same files at once, then keep the better one
   - C. Give each its own files or worktree and name an integrator
   - D. Give them broader permissions so they collaborate more smoothly
   > **Answer: C.** Without explicit isolation, parallel workers can share files: separate chats don't mean separate directories (A), and editing the same files at once means overwriting each other (B). Delegation doesn't expand the permissions of the original task (D); scope, permissions, and integration still need coordinating.

6. **[Basic · Hands-on]** Write five lines of project guidance, distinguishing one verified command, one convention, and one data-handling constraint. Then compare them with any saved memory. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Project instructions state the intended rules. Memory may contain useful observations, but both need review when the repository changes.
