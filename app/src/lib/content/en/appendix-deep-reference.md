This appendix is a working reference for Claude Code and Codex. Chapters 28 and 29 provide first-session exercises; this page helps you choose the next capability and troubleshoot it. The examples were checked on 2026-10-29. Use your installed version’s help output to resolve differences.

## 1. Start with the executable and the account

Run these commands in a terminal, using the tool you installed:

```bash
claude --version
claude --help
```

```bash
codex --version
codex --help
```

Inside either interactive tool, use `/status` to inspect the session and `/` to discover available commands. Shell commands and interactive slash commands are different: typing `/status` into Bash does not inspect an agent session.

Record the version, platform, execution location, and active account when reporting a problem. Check that subscription sign-in, API credentials, and organization configuration are not pointing to a different billing account than intended. Do not include actual keys in diagnostic notes.

## 2. Use the right control for the problem

| Need | Claude Code entry point | Codex entry point | What to verify |
| --- | --- | --- | --- |
| Inspect the session | `/status` | `/status` | Account, settings, execution context |
| Discover commands | `/help` or `/` | `/` and `codex --help` | What this installed version exposes |
| Review permissions | `/permissions` | `/permissions` | Scope of allowed actions and restrictions |
| Plan before acting | `/plan`, or cycle to plan mode with `Shift+Tab` | `/plan` | Whether the plan names concrete files and a validation method |
| Draft project guidance | `/init`, then review `CLAUDE.md` | `/init`, then review `AGENTS.md` | Accuracy of paths, commands, and rules |
| Inspect changes | `/diff` or `git diff` | `/diff` or `git diff` | Relevant tracked changes and unexpected files |
| Undo this session's file edits | `/rewind` (or press `Esc` twice with an empty prompt) | Use Git (Section 11) | Restores only files it changed with its editing tools in this session; files changed only by Bash commands, most subagent edits, and external effects are not included |
| Inspect retained knowledge | `/memory` | `/memories` plus project files | Stale or conflicting notes |
| Reduce a long conversation | `/compact`, or `/clear` for a new conversation | `/compact`, or `/new` for a new conversation | Requirements and evidence preserved in the summary |
| Check skills | `/skills` | `/skills`, or type `$` to name one | Skill name, description, source |
| Check MCP connections | `/mcp`; in a terminal, `claude mcp list` | `/mcp`; in a terminal, `codex mcp list` | Connection status, exposed tools |

This table is a navigation aid, not a promise of identical interfaces. An editor, desktop app, or managed cloud environment may expose a different set of controls.

## 3. Project instructions, memory, skills, and configuration

Use project instructions for stable working conventions, memory for retained observations, and skills for reusable procedures. Configuration controls the application itself: enabled tools, connection settings, model choices, and permissions. Putting a sentence into a Markdown instruction file does not enforce an operating-system restriction.

A good project instruction file is short enough to review and specific enough to act on:

```markdown
- Read the project README and existing implementation first.
- Use the documented dependency lockfile and package manager.
- Before finishing, run the checks relevant to the changed behavior.
- Report commands run, outcomes, and any unverified assumptions.
```

Replace these general rules with verified repository details where useful. Keep personal preferences and secrets out of shared project rules. For nested instruction files, inspect which files apply to the directory being edited; do not assume every instruction file applies globally. Claude Code reads `AGENTS.md` when a repository has no `CLAUDE.md`, so both tools can share one instruction file.

For files you don't want the agent to read (such as a `.env` holding a key), restrict reading wherever the tool supports it: Claude Code accepts `Read(./.env)` under `permissions.deny` in its settings, and Codex accepts `"**/*.env" = "deny"` in the filesystem rules of a permissions profile. Such rules don't necessarily cover every way a file can be read, so set the key yourself and never paste it into a chat (Chapter 35).

## 4. Planning and reasoning settings

Use a planning workflow when the goal is ambiguous, the change crosses several systems, or a wrong assumption would be costly (Chapter 27). Ask for the relevant files, the proposed change, and a validation method. A plan should end with a concrete next action.

Reasoning effort and model selection can change latency, usage, and results. Higher settings are useful for some difficult problems, but do not supply missing evidence or fix a bad requirement. For a small wording change, a long planning debate can cost more effort than the edit.

## 5. Sandbox and approval are separate controls

A sandbox limits access to files, processes, or the network. Approval rules determine which actions may proceed automatically, prompt for confirmation, or be rejected. Organization policies can further constrain both (Chapter 26).

Before granting an exception, identify the exact command, target, and side effect. A missing dependency is a reason to inspect setup, not to disable every restriction. Prefer a narrow permission that covers the authorized task. A configured “automatic” mode does not mean every possible action is appropriate. The first time you let an agent run several steps on its own, start with read-only, plan, or ask-every-step settings (Chapter 34).

## 6. Subagents and orchestration

Use delegation for work that can be divided with a clear handoff: independent investigations, separate components, or a bounded review. A practical assignment includes:

```text
Investigate why the preview fails. You may read the app and run its
existing checks. Do not edit files. Return the failing command,
relevant evidence, and the smallest plausible repair.
```

Specify file ownership for parallel edits or use isolated worktrees. Separate agent conversations do not automatically isolate the filesystem. The coordinating agent must reconcile changes, verify the combined result, and enforce the original scope. More workers can increase usage and coordination costs; agreement among agents is not independent proof.

## 7. Hooks and unattended execution

Hooks run configured actions at lifecycle events; unattended modes run tasks without a person answering every prompt. Both can be useful for repeatable checks and automation. Both can also execute scripts, contact services, or modify files.

Before enabling them, read the actual commands and set the working directory, credentials, timeout, and expected output. Avoid secrets in logs. Decide what happens on failure and how repeated execution avoids duplicate external actions. A hook is executable behavior, not just a helpful instruction paragraph.

## 8. Skills, plugins, and MCP

The minimal steps for a first skill or MCP server (where the skill folder goes, how to write the top of `SKILL.md`, and how to use `claude mcp add` and `codex mcp add`) are in Chapter 36. This section lists only the judgment points.

Start with a skill you can inspect: `SKILL.md`, a clear description, short instructions, and only the supporting files needed. Under the Agent Skills standard, `name` uses only lowercase letters, digits, and hyphens and matches its folder. Validate it on synthetic data. Client installation locations and optional metadata differ.

For MCP, check the server’s publisher, local command or remote URL, account scope, and exposed capabilities. Test one known read operation before adding write operations. A plugin may package several skills and servers together; inspect what is actually enabled. Neither a plugin nor an MCP connection automatically gives permission to send messages or publish changes.

## 9. Context, compaction, and handoffs

A useful handoff records the goal, current state, changed files, commands and results, pending issues, and references to evidence. It should not simply reproduce the entire transcript.

Compaction can preserve important state while shortening the active context, but summaries can omit details. Reopen the relevant source file or log when the exact text matters. Starting a new session may improve focus, but it can also require reloading context and lose cache benefits; choose it for task clarity rather than assuming it is always cheaper.

## 10. Troubleshoot by the failing layer

| Symptom | First useful check |
| --- | --- |
| Command not found | Installation result, executable location, shell restart, and `PATH` |
| Login or access failure | Active account, credential source, organization policy, and service status |
| Quota or rate-limit message | Usage screen, reset time, model/mode, and whether requests are running in parallel |
| Missing dependency in a cloud task | Environment setup, package manager, lockfile, and required system packages |
| Permission denied | Exact path or operation and the active sandbox/approval rules |
| MCP tool missing or failing | Server connection, authentication, exposed capabilities, and server logs |
| Skill doesn't appear | Folder location, the file name `SKILL.md`, whether `name` matches the folder; restart the session |
| Unexpected edits | Git diff, instruction scope, shared working directories, and task boundaries |
| Agent reports success but feature fails | Reproduce the behavior and inspect actual command results |

Change one suspected cause at a time and keep the original error. Repeatedly restarting, widening permissions, or upgrading a plan without identifying the failing layer makes diagnosis harder.

## 11. Git command quick reference

Why to use these commands, when, and how far they can take you back is explained in Chapter 26 (including "Git: the bare minimum to get started" and the limits of recovery). This is only a quick reference. Run the commands in a terminal inside the project folder; you can also have the agent run them, but read exactly which command it's about to run first.

| Command | What it does | Watch out for |
| --- | --- | --- |
| `git init` | Turns the current folder into a Git repository | Once per project |
| `git status` | Shows which files changed, which are staged, and which aren't tracked | The go-to "what's going on right now" command |
| `git add <file>` or `git add .` | Puts changes into the staging area (the queue for the next commit) | `.` means every change under the current folder; check `git status` first so you don't add a key file |
| `git commit -m "message"` | Saves what's staged as a commit (a save point) | Only what you `add`ed gets saved |
| `git diff` | Shows changes not yet staged | Use `git diff --staged` for staged changes; new untracked files don't appear |
| `git log --oneline` | Lists past commits with their IDs | You need an ID to undo a specific commit |
| `git restore <file>` | Puts the file back the way it is in the staging area (usually as of your last commit) | That file's uncommitted changes are discarded; confirm before running |
| `git restore --staged <file>` | Takes the file back out of the staging area | Doesn't change the file's contents |
| `git revert <commit-id>` | Makes a new commit that reverses the changes of the given commit | Keeps history intact; suits commits already pushed or shared |
| `git switch -c <branch-name>` | Creates a new branch and switches to it | A branch is a line of development, not a backup, and it doesn't isolate running programs |

To make sure certain files (such as `.env`) never get committed, list their names in a `.gitignore` file at the project root.

Git can only restore files it recorded. Emails already sent, a production database already changed, and charges already incurred are outside its reach (Chapter 26).

## 12. Review and integration

Check `git status --short` for the full file list. Use `git diff --stat` and `git diff` for unstaged changes, and `git diff --cached --stat` and `git diff --cached` for changes already staged for the next commit. Inspect untracked files separately; these diff commands do not show their contents. Verify the relevant behavior (Chapter 25) and record any unavailable checks. Then commit, open a pull request, push, or deploy only within the task’s authorization and repository workflow.

A review should state the concrete problem, resulting behavior, and validation evidence. An agent’s generated review is another useful analysis, not a substitute for tests or a human decision where the workflow requires one.

## Sources and version notes

Checked 2026-10-29: [Codex README](https://github.com/openai/codex/blob/main/README.md), [CLI command source](https://github.com/openai/codex/blob/main/codex-rs/tui/src/slash_command.rs), [configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json), [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), [Codex permissions](https://learn.chatgpt.com/docs/permissions), and [Codex skills](https://learn.chatgpt.com/docs/build-skills); [Claude Code commands](https://code.claude.com/docs/en/commands), [checkpointing and `/rewind`](https://code.claude.com/docs/en/checkpointing), [settings](https://code.claude.com/docs/en/settings), [memory](https://code.claude.com/docs/en/memory), [Claude Code README](https://github.com/anthropics/claude-code/blob/main/README.md), and [changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md); [Agent Skills specification](https://agentskills.io/specification); [MCP specification repository](https://github.com/modelcontextprotocol/modelcontextprotocol); Git documentation for [git-restore](https://git-scm.com/docs/git-restore), [git-revert](https://git-scm.com/docs/git-revert), and [git-switch](https://git-scm.com/docs/git-switch). The product documentation entry points are [Codex](https://learn.chatgpt.com/docs) and [Claude Code](https://code.claude.com/docs/en/overview) (Codex's documentation used to live at developers.openai.com/codex and has moved to learn.chatgpt.com). Command availability and policy settings vary by installed version and organization.
