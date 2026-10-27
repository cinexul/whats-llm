Claude Code is Anthropic’s coding agent. It can explore a repository, edit files, run tools, and assist with Git workflows. You can use it through a terminal and supported editor or other product interfaces. This chapter uses the terminal to make the first session concrete.

The installation methods, account requirements, and command examples were checked on **2026-10-27**. Record your installed version: instructions from an old tutorial can describe an installation method or interface that has since changed.

## 1. Install and open a small project

Check your account first. As of October 2026, the official documentation says Claude Code requires a Pro, Max, Team, or Enterprise plan or a Console (API) account; the free claude.ai plan does not include it. It can also be used through third-party cloud providers such as Amazon Bedrock.

If you're not comfortable in a terminal, there is also an official desktop app (macOS, Windows, Linux) that lets you use Claude Code without the command line; the download links are in the official setup documentation. This chapter uses the terminal as the example.

The officially recommended method is the native installer, which then updates itself in the background. On macOS or Linux (including WSL on Windows):

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

In Windows PowerShell (there is an equivalent CMD command in the official docs):

```powershell
irm https://claude.ai/install.ps1 | iex
```

Both commands download and execute an installer script; make sure the address is the official one and follow your organization's installation rules. On Windows, the docs also recommend installing Git for Windows (see Chapter 26) so Claude Code can run Bash commands; without it, Claude Code still works and uses PowerShell instead.

You can also use a package manager: `brew install --cask claude-code` with Homebrew, or `winget install Anthropic.ClaudeCode` with WinGet. These two don't update automatically by default, so run `brew upgrade claude-code` or `winget upgrade Anthropic.ClaudeCode` from time to time. Choose one method. The README in the official GitHub repository marks npm installation as deprecated, so an old tutorial's `npm install -g @anthropic-ai/claude-code` is no longer the preferred starting point.

After installing, open a new terminal window, check that the command works, and enter a practice project. The `git` commands below need Git installed; if the project isn't under Git yet, save a starting point first as described in "Git: the bare minimum to get started" in Chapter 26:

```bash
claude --version
claude --help
cd /path/to/your/project
git status
git switch -c practice/claude-first-task
claude
```

Replace the path with your project's actual folder. `git status` confirms there are no unsaved changes (or save existing work separately first), and `git switch -c` creates a practice branch. The first time you run `claude`, follow the browser prompts to log in, then use `/status` to inspect the session and active account. Subscription sign-in and API-backed configurations are different ways to use the tool; installing the CLI does not itself make API usage free.

## 2. Ask for investigation, then one change

A useful first request is:

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

Read `git diff` yourself. If the change affects software behavior, also exercise that behavior and run appropriate project tests. For an unfamiliar repository, a concise explanation backed by file paths is more useful than a confident story about how the project “probably” works.

## 3. Project instructions, memory, and skills are different

`CLAUDE.md` contains instructions such as project conventions, useful commands, and constraints. `/init` can help draft project guidance; inspect the generated file. A small example:

```markdown
# Project guidance
- Read the README and existing implementation before changing behavior.
- Use the repository's documented package manager and test commands.
- Keep generated files out of manual edits unless the task requires them.
- Use synthetic data in examples.
- Explain what was verified and what remains uncertain.
```

Replace general statements with specific commands only after verifying those commands. Do not paste an entire manual or credentials into the file.

| Mechanism | What it stores | How to treat it |
| --- | --- | --- |
| `CLAUDE.md` and project rules | Deliberate instructions for working in this project | Review and maintain them like other project documentation |
| Auto memory, where enabled | Notes retained by the product from previous work | Inspect and correct them; old observations may become wrong |
| Skills | Reusable procedures and optional scripts or reference files | Use when the task matches, after reviewing the source |
| Current conversation | This task’s requirements, evidence, and progress | Summarize important state when handing work to a new session |

Use `/memory` to inspect the memory interface available in your version. Persisted notes and loaded instructions are product features, not evidence that the model’s weights learned your project. Memory also does not make an unverified claim true.

## 4. Learn a few commands by their purpose

| In-session command | What it helps you do |
| --- | --- |
| `/help` | Discover available commands |
| `/status` | Inspect session and account configuration |
| `/plan` | Enter the planning workflow for a task |
| `/permissions` | Inspect or change permission rules within your control |
| `/memory` | Inspect project guidance and memory controls |
| `/usage` | Inspect available usage information and limits |
| `/diff` | Inspect changes through the supported interface |

Commands available in a terminal, editor, or cloud session can differ. Planning is useful when scope is uncertain; it is not a replacement for the execution environment’s permission controls. Once you have authorized a clear, bounded change, the agent can usually perform its routine implementation and checks without asking you to approve every step again.

## 5. Keep execution and billing boundaries visible

Read a permission request as a concrete action: **which command, which files or service, and what effect?** A permission can cover repeated operations, so do not assume every later action will prompt again. Shell commands, hooks, skills with scripts, and external tools can all do real work. A Git branch cannot undo an external message or payment.

Subagents can divide investigation or implementation when supported and authorized. Give each a clear scope and decide who integrates the results. Separate conversations do not necessarily mean separate working directories; parallel writers can overwrite each other. Delegation does not expand the permissions granted to the task.

Check `/status` and your account’s usage page to distinguish:

- **Subscription use**, which consumes included allowances under the plan’s rules.
- **API or provider use**, which follows that account’s billing and limits.
- **Optional credits, paid modes, or connected services**, which can add costs when enabled.

Do not assume a consumer subscription pays for an API key, or that all long sessions create a separate token invoice. If usage is unexpected, check the active credentials, model/mode, task length, repeated tool results, and background work before changing plans.

## Sources and version notes

Checked **2026-10-27**: the [official setup documentation](https://code.claude.com/docs/en/setup) for the native installer (including Windows PowerShell), the fact that Homebrew and WinGet installs don't auto-update, the account requirements (the free claude.ai plan doesn't include Claude Code), and the desktop app; the [official Claude Code README](https://github.com/anthropics/claude-code/blob/main/README.md) for npm deprecation; the [commands reference](https://code.claude.com/docs/en/commands) for the in-session commands in this chapter. When checked on 2026-10-22, the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)'s first entry was **2.1.308**, covering memory controls, subscription usage, and evolving permission behavior. These are observed documentation and repository versions, not a claim about your installed release. For costs, see the [cost documentation](https://code.claude.com/docs/en/costs).

---

## Quiz

1. **[Basic · Concept]** Which installation advice matches the checked official documentation? <!-- quiz: q01 revision: 1 -->
   - A. npm is the official first choice; install Node.js first, just to be safe
   - B. After installing with Homebrew or WinGet, it keeps itself updated
   - C. Pick one listed method, like the native installer; npm is deprecated
   - D. A free claude.ai account can use it as soon as it's installed
   > **Answer: C.** The official docs recommend the native installer and also list Homebrew and WinGet; the README marks npm installation as deprecated (A). Homebrew and WinGet installs don't auto-update by default, so you run the upgrade command yourself (B). Claude Code requires a Pro, Max, Team, Enterprise, or Console account; the free plan doesn't include it (D).

2. **[Basic · Concept]** What belongs in `CLAUDE.md`? <!-- quiz: q02 revision: 1 -->
   - A. Verified project conventions, handy commands, and limits
   - B. API keys, so it can call the services directly every time
   - C. Full transcripts of every earlier conversation, for recall
   - D. A blanket "you never need to ask me for permission again"
   > **Answer: A.** Keep project guidance concise, accurate, and useful. Keys never belong in project files (B); a full history is too long and buries what matters (C); project guidance can't replace permission controls or grant unlimited authorization (D).

3. **[Advanced · Misconception]** Auto memory contains an old test command. What should you do? <!-- quiz: q03 revision: 1 -->
   - A. Trust the memory, since it was summarized from earlier work
   - B. Take it as a sign the weights changed and wait for a new version
   - C. Turn off all memory features and remember commands yourself
   - D. Verify the current command, then correct the saved note
   > **Answer: D.** Memory is context notes saved by the product, and they can go stale. They aren't a more reliable source than the current repository (A), nor a change to model weights (B). You can inspect and correct notes, so one outdated entry is no reason to switch everything off (C).

4. **[Basic · Scenario]** Before starting a long task, which check helps avoid billing surprises? <!-- quiz: q04 revision: 1 -->
   - A. Confirm the install worked and the version number shows up
   - B. Check the account in use, its allowance, and paid extras
   - C. Assume a subscription already covers every single API call
   - D. Keep the request short, which guarantees you stay within limits
   > **Answer: B.** Subscription allowances, API billing, and optional extras are separate concerns; the active account and usage screen provide the relevant evidence. A successful install (A) says nothing about cost; a subscription doesn't pay for an API key (C); a short request can't guarantee usage, since tool output and background work in a long task also count (D).

5. **[Advanced · Scenario]** Two subagents will edit a repository. What is a useful precaution? <!-- quiz: q05 revision: 1 -->
   - A. Separate chats are isolated by nature, so they won't collide
   - B. Let both edit the same files at once, then keep the better one
   - C. Give each its own files or worktree and name an integrator
   - D. Give them broader permissions so they collaborate more smoothly
   > **Answer: C.** Without explicit isolation, parallel workers can share files: separate chats don't mean separate directories (A), and editing the same files at once means overwriting each other (B). Delegation doesn't expand the permissions of the original task (D); scope, permissions, and integration still need coordinating.

6. **[Basic · Hands-on]** Write five lines of project guidance, distinguishing one verified command, one convention, and one data-handling constraint. Then compare them with any saved memory. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Project instructions state the intended rules. Memory may contain useful observations, but both need review when the repository changes.
