Claude Code is Anthropic’s coding agent. It can explore a repository, edit files, run tools, and assist with Git workflows. You can use it through a terminal and supported editor or other product interfaces. This chapter uses the terminal to make the first session concrete.

The installation and command examples were checked on **2026-10-22**. Record your installed version: instructions from an old tutorial can describe an installation method or interface that has since changed.

## 1. Install and open a small project

The official repository recommends the native installer. On macOS or Linux:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This downloads and executes an installer; use the official address and review your organization’s installation rules. If you already use Homebrew, `brew install --cask claude-code` is another listed method. On Windows, the repository lists:

```powershell
winget install Anthropic.ClaudeCode
```

Choose one method. **The current official README marks npm installation as deprecated**; an old `npm install -g @anthropic-ai/claude-code` tutorial is no longer the preferred starting point.

Then check the executable and enter an existing practice project:

```bash
claude --version
claude --help
cd /path/to/your/project
git status
git switch -c practice/claude-first-task
claude
```

Replace the path with your project’s actual folder. Start with a clean working tree or save existing work separately. Follow the login flow, then use `/status` to inspect the session and active account. Eligible subscriptions and API-backed configurations are different ways to use the tool; installing the CLI does not itself make API usage free.

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

Checked **2026-10-22**: [official Claude Code README](https://github.com/anthropics/claude-code/blob/main/README.md) for native/Homebrew/WinGet installation and npm deprecation; [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), whose first entry was **2.1.308**, for the commands, memory controls, subscription usage, and evolving permission behavior described here. That is an observed repository version, not a claim about your installed release. [Official setup documentation](https://code.claude.com/docs/en/setup) and [cost documentation](https://code.claude.com/docs/en/costs) are the follow-up references for your platform and account.

---

## Quiz

1. **[Basic · Concept]** Which installation advice matches the checked official README? <!-- quiz: q01 revision: 1 -->
   - A. npm is the only supported starting point
   - B. No installation is needed for any interface
   - C. Use a listed native or package-manager method; npm installation is deprecated
   - D. Install every available distribution simultaneously
   > **Answer: C.** The repository recommends the native installer and lists alternatives such as Homebrew and WinGet. Choose one method and check the installed version.

2. **[Basic · Concept]** What belongs in `CLAUDE.md`? <!-- quiz: q02 revision: 1 -->
   - A. Verified project conventions and useful commands
   - B. API keys
   - C. Every log from every previous session
   - D. An assumption that permission checks no longer apply
   > **Answer: A.** Keep project guidance concise, accurate, and useful. Secrets and unlimited authorization do not belong there.

3. **[Advanced · Misconception]** Auto memory contains an old test command. What should you do? <!-- quiz: q03 revision: 1 -->
   - A. Treat memory as more reliable than the current repository
   - B. Retrain the base model immediately
   - C. Delete the project
   - D. Verify the current command and correct the retained note
   > **Answer: D.** Memory is stored context and can become stale. It is neither a source of guaranteed truth nor a change to model weights.

4. **[Basic · Scenario]** Before starting a long task, which check helps avoid billing surprises? <!-- quiz: q04 revision: 1 -->
   - A. Only checking whether the CLI installed successfully
   - B. Checking the active account, allowances, and enabled paid extras
   - C. Assuming a subscription includes every API call
   - D. Asking the model to guess your bill
   > **Answer: B.** Subscription allowances, API billing, and optional extras are separate concerns. The active account and usage screen provide the relevant evidence.

5. **[Advanced · Scenario]** Two subagents will edit a repository. What is a useful precaution? <!-- quiz: q05 revision: 1 -->
   - A. Assume separate chats guarantee isolated files
   - B. Let both rewrite the same files without coordination
   - C. Assign distinct ownership or isolated worktrees and an integration owner
   - D. Give each unrestricted external-service credentials
   > **Answer: C.** Parallel workers can share files unless isolation is explicitly provided. Scope, permissions, and integration still need coordination.

6. **[Basic · Hands-on]** Write five lines of project guidance, distinguishing one verified command, one convention, and one data-handling constraint. Then compare them with any saved memory. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Project instructions state the intended rules. Memory may contain useful observations, but both need review when the repository changes.
