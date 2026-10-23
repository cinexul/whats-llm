Codex is OpenAI’s coding agent. It can inspect a project, edit files, run commands, and help review changes. This chapter turns Chapter 24’s “investigate, plan, do, check” workflow into a first task you can actually complete.

The examples below were checked against official sources on **2026-10-22**. Your installed version and organization settings may differ; record the version and inspect the available commands before following an example.

## 1. Choose where the work will run

| Form | Where you work | What to check first |
| --- | --- | --- |
| CLI | Terminal, usually using a local project folder | Current directory, Git state, command permissions |
| IDE extension | Inside a supported code editor | Open project and the proposed file changes |
| Desktop app | A dedicated application | Which project and execution environment the task uses |
| Web / cloud task | Browser, with work running in a configured environment | Repository, branch, setup steps, network access, and secrets |

A local CLI does **not** mean the model runs offline: the client can send task context to the service. A cloud task does not automatically have your laptop’s dependencies, uncommitted files, or credentials.

For a first attempt, use a small existing Git project with a clean working tree. If you have unfinished changes, save them separately before starting; a new branch alone is not a backup of uncommitted work.

## 2. Install, sign in, and inspect the session

If Node.js and npm are already installed, the official repository lists this installation method:

```bash
npm install -g @openai/codex
codex --version
codex --help
```

On a Mac with Homebrew, an alternative is `brew install --cask codex`. Choose one installation method. The official README also provides native installers and platform binaries.

In an existing project, replace the example path with your own:

```bash
cd /path/to/your/project
git status
git switch -c practice/codex-first-task
codex
```

At sign-in, you can select **Sign in with ChatGPT** for an eligible account. The official README lists Plus, Pro, Business, Edu, and Enterprise plans; actual access and allowances depend on your account. An API key is an **alternative authentication and billing path**, not a prerequisite for every Codex user. Do not paste a key into the conversation.

Inside the interactive CLI, `/status` shows session configuration and token usage, `/permissions` lets you inspect or choose what Codex may do, and `/diff` shows changes. Type `/` to discover what your installed version offers. The shell command `codex --help` and the in-session `/` menu are different interfaces.

## 3. Complete one small task

Start with a bounded request:

```text
Read the project instructions and README. Identify the documented way
of checking this project. Do not edit files yet. Suggest one small
README clarification and tell me how you would verify it.
```

Once the proposal is clear, authorize the change:

```text
Make that README clarification only. Preserve unrelated changes.
Check the diff and any relevant links or commands. Report what changed,
what you actually checked, and anything you could not verify.
Do not publish, push, or deploy this exercise.
```

This two-step exercise helps you learn the tool. Later, a clear request can authorize implementation and verification together; you do not need to approve every harmless step individually.

Afterward, inspect `/diff` or run these in your terminal:

```bash
git diff --stat
git diff
git status --short
```

For a documentation change, check the actual wording and links. For a behavior change, run the project’s relevant tests and try the changed behavior. “The agent says it passed” is weaker evidence than a command result and a working example.

## 4. Give the project persistent instructions

Codex supports `AGENTS.md` for project instructions; `/init` can help create one. Review its contents before relying on it. For example:

```markdown
# Working in this project
- Read the README before editing.
- Keep each change focused on the requested task.
- Use the package manager and checks documented in this repository.
- Never include credentials or real customer data in examples.
- Report validation results and any checks you could not run.
```

Add real project commands once you have verified them. Keep long reference material in linked files. These instructions are loaded into context; they do not retrain the model or guarantee that a rule will always be followed. A skill packages a reusable procedure; saved memory stores retained notes. Neither replaces explicit project instructions or enforced permissions.

## 5. Permissions, cloud tasks, and cost

A **sandbox** restricts what the execution environment can access. An **approval policy** determines when an action needs approval. Their combination matters: some operations may already be allowed, some may prompt, and some may be blocked. Do not assume a confirmation dialog will appear before every consequential command.

For a cloud task, verify the target repository and branch, install dependencies through the environment setup, and check which network destinations and secrets are available. Review the resulting diff and validation output before merging. A branch helps undo code changes; it cannot unsend an email or reverse an external database change.

For spending, distinguish the account paths:

- **ChatGPT plan:** included Codex use consumes the plan’s allowance under its current rules. A larger task may use more allowance without creating a separate per-token invoice.
- **API authentication:** usage is billed under API pricing and account limits; a ChatGPT subscription does not automatically fund API usage.
- **Optional purchases or services:** additional credits, connected services, cloud infrastructure, and other extras may have their own charges when enabled.

Check the account actually in use, its usage page, and any enabled extras. Focused tasks and relevant context help control work, but “monthly subscription” does not mean unlimited usage, and “more tokens” does not always mean an extra charge on that subscription.

## Sources and version notes

Checked **2026-10-22**: [official Codex README](https://github.com/openai/codex/blob/main/README.md) for installation, product forms, and sign-in; [official CLI command source](https://github.com/openai/codex/blob/main/codex-rs/tui/src/slash_command.rs) for `/status`, `/permissions`, `/diff`, and `/init`; [configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json) for approval and sandbox settings. These are observations of the repository’s `main` branch, not a promise that every command exists in every installed release. For account-specific allowances, use the [Codex plan help page](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) and your account’s usage screen.

---

## Quiz

1. **[Basic · Concept]** Which description of Codex is accurate? <!-- quiz: q01 revision: 1 -->
   - A. It only runs as a web page
   - B. It is OpenAI’s coding agent, available through several interfaces
   - C. It is an offline model whenever you use the CLI
   - D. It requires an API key for every user
   > **Answer: B.** The CLI, editor extension, app, and web/cloud interfaces have different execution environments. Local execution does not imply offline model inference.

2. **[Basic · Scenario]** You have an eligible ChatGPT plan. What should you do before buying API credits for Codex? <!-- quiz: q02 revision: 1 -->
   - A. Assume the subscription cannot include Codex
   - B. Paste your password into the chat
   - C. Check ChatGPT sign-in and the allowance available to your account
   - D. Assume API usage is included without checking
   > **Answer: C.** ChatGPT sign-in and API authentication are distinct paths. Check the active account and its allowance before choosing a separately billed API path.

3. **[Basic · Concept]** What does `AGENTS.md` provide? <!-- quiz: q03 revision: 1 -->
   - A. Project instructions that the agent can load into context
   - B. An unlimited usage quota
   - C. A replacement for enforced filesystem permissions
   - D. Permanent changes to model weights
   > **Answer: A.** It makes project conventions explicit. It is neither a billing mechanism nor a security boundary.

4. **[Advanced · Misconception]** “If a command is dangerous, Codex must ask me first.” What is missing? <!-- quiz: q04 revision: 1 -->
   - A. Nothing; this is guaranteed
   - B. Only the model’s name matters
   - C. Git automatically prevents external changes
   - D. The active sandbox, approval policy, and existing permissions determine behavior
   > **Answer: D.** Actions may already be allowed, require approval, or be blocked. Inspect the actual configuration rather than relying on a universal prompt-before-action assumption.

5. **[Basic · Scenario]** A cloud task fails because a dependency is missing. What is the useful next step? <!-- quiz: q05 revision: 1 -->
   - A. Assume it can use packages installed on your laptop
   - B. Inspect its setup and install the project’s documented dependencies there
   - C. Remove all network and filesystem restrictions
   - D. Change the project’s code at random
   > **Answer: B.** The cloud environment is separate. Repair the missing setup using the repository’s documented package manager and dependency files.

6. **[Basic · Hands-on]** In a small project, request one README clarification, inspect the resulting diff, and record the account path, permissions, and verification result. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** A successful exercise has a bounded change and visible evidence. It also tells you where the work ran and which account’s allowance or bill it used.
