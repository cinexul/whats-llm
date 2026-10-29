Codex is OpenAI's coding agent: it can look through a project, edit files, run commands, and help review changes. This chapter turns Chapter 24's "investigate, plan, act, sign off" into an exercise you can actually complete.

Installation methods, plans, and commands were checked against official sources on 2026-10-29. Your installed version and your organization's settings may differ, so note your version first and then check which commands are available.

## 1. Choose where the work will run

| Form | Where you work | What to check first |
| --- | --- | --- |
| CLI | Terminal, usually using a local project folder | Current directory, Git state, command permissions |
| IDE extension | Inside a supported code editor | Open project and the proposed file changes |
| Desktop app | A dedicated application | Which project and execution environment the task uses |
| Web / cloud task | Browser, with work running in a configured environment | Repository, branch, setup steps, network access, and secrets |

Using the CLI locally doesn't mean the model runs offline on your computer: the client still sends task context to the service. A cloud task doesn't automatically get your computer's dependencies, uncommitted files, or credentials either.

For a first attempt, use a small existing Git project (for installing Git and the basics, see "Git: the bare minimum to get started" in Chapter 26). Make sure the working tree is clean; save any unfinished changes separately, because a new branch alone is not a backup of uncommitted work.

## 2. Install, sign in, and inspect the session

As of October 2026, the official documentation lists the standalone installer first; only the npm route mentioned below needs Node.js. On macOS or Linux:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

In Windows PowerShell:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

Both commands download and run an installer script, so make sure the address is the official one and follow your organization's rules. You can also use Homebrew (`brew install --cask codex`), or `npm install -g @openai/codex` on a computer that has Node.js. Pick one, then check it:

```bash
codex --version
codex --help
```

Go to an existing project, replacing the example path with your own. The `git` commands below need Git installed; if the project isn't under Git yet, save a starting point first as described in Chapter 26:

```bash
cd /path/to/your/project
git status
git switch -c practice/codex-first-task
codex
```

The first time you run `codex`, you can choose Sign in with ChatGPT. As of October 2026, the official pricing page says the ChatGPT Free, Go, Plus, Pro, Business, Edu, and Enterprise plans all include Codex, with very different allowances: Free is positioned for trying it out on quick, small tasks, and Go for lightweight tasks; the official README recommends signing in with Plus, Pro, Business, Edu, or Enterprise. An API key is a separate sign-in and billing path, not something every Codex user needs. Don't paste a key into the chat.

Inside the interactive session, type `/` to see the commands your version offers. A few you'll use:

| In-session command | Purpose |
| --- | --- |
| `/status` | Show session configuration and token usage |
| `/permissions` | Choose what Codex is allowed to do (Chapter 26) |
| `/plan` | Switch to plan mode (Chapter 27) |
| `/diff` | Show Git changes, including new untracked files |
| `/review` | Review the current changes and look for problems |
| `/init` | Create an `AGENTS.md` file with project instructions |

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

Splitting it into two steps helps you learn the tool. Later, when the request is clear, you can authorize implementation and verification together, without approving every harmless step.

Afterward, look at `/diff` or run these in your terminal:

```bash
git diff --stat
git diff
git status --short
```

Then sign off as in Chapter 25: have it explain each change in plain words and compare that with the diff. For a documentation change, check the wording and links; for a change in behavior, run the relevant tests and try it yourself. "The agent says it passed" carries less weight than real command output and what you see with your own eyes. `/review` makes a good first check; for changes touching money, personal data, keys, deletion, or publishing, still have a new session or a person review them.

## 4. Give the project persistent instructions

Codex keeps project instructions in `AGENTS.md`; `/init` can draft one. Review its contents before relying on it, for example:

```markdown
# Working in this project
- Read the README before editing.
- Keep each change focused on the requested task.
- Use the package manager and checks documented in this repository.
- Never include credentials or real customer data in examples.
- Report validation results and any checks you could not run.
```

Once you've confirmed the actual commands, replace general rules with exact ones, and keep long reference material in linked files. These instructions are loaded into the context; they don't retrain the model or guarantee that every rule is followed. A skill packages a reusable procedure and saved memory keeps notes; neither replaces explicit project rules or permission limits that are actually enforced.

## 5. Permissions, cloud tasks, and cost

The sandbox limits what the execution environment can reach, and the approval policy decides which actions need your approval; together they determine behavior: some actions are already allowed, some ask first, some are blocked. As of October 2026, in a folder managed by Git, Codex by default edits project files directly and runs commands the sandbox allows, asking only when it needs to go beyond that; other folders are read-only by default (the four permission levels are in Chapter 26). So don't assume a confirmation will appear before every command with consequences.

For a cloud task, confirm the target repository and branch, install dependencies through the environment's setup steps, and check which network addresses and secrets it can use. Review the diff and validation output before merging. A branch helps you undo code changes, but it can't take back an email already sent, and it won't automatically restore an outside database.

Cost depends on how you sign in. Signed in with ChatGPT, Codex uses the allowance included in your plan; bigger tasks use more of it, but that doesn't necessarily mean a separate per-token bill. With an API key you pay API prices separately, and a ChatGPT subscription doesn't cover them. Extra purchased allowance and connected services are charged separately. The pricing page specifically warns against using API prices to estimate how much a subscription can do. Chapter 38 has the details.

## Sources and version notes

Checked on 2026-10-29. The [official Codex README](https://github.com/openai/codex/blob/main/README.md) supports the standalone installer, Homebrew, npm, the various entry points, ChatGPT sign-in, and the recommended plans; the [Codex CLI documentation](https://learn.chatgpt.com/docs/codex/cli) supports the standalone installer being listed first; the [Codex pricing page](https://learn.chatgpt.com/docs/pricing) supports every ChatGPT plan including Codex and API keys being billed at API prices; the [official CLI command source](https://github.com/openai/codex/blob/main/codex-rs/tui/src/slash_command.rs) supports the in-session commands listed here; the [approvals and security documentation](https://learn.chatgpt.com/docs/agent-approvals-security) supports the default permissions in Git folders; and the [configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json) supports the approval and sandbox settings. This reflects the repository's `main` branch and the documentation, and doesn't guarantee that every installed version has these commands.

---

## Quiz

1. **[Basic · Concept]** Which description of Codex is accurate? <!-- quiz: q01 revision: 2 -->
   - A. It only works in a web page and can't be installed on your computer
   - B. OpenAI's coding agent, available through several interfaces
   - C. When you use the CLI, the model runs offline on your own computer
   - D. Whatever your plan, you must have an API key ready before using it
   > **Answer: B.** There are CLI, editor extension, desktop app, and web/cloud interfaces, which may use different execution environments, so A is wrong. Running the CLI locally doesn't mean offline model inference; the client still sends task context to the service (C). Signing in with a ChatGPT account is enough; an API key is a separate path (D).

2. **[Basic · Scenario]** You have an eligible ChatGPT plan. What should you do before buying API credits for Codex? <!-- quiz: q02 revision: 2 -->
   - A. Assume the subscription excludes Codex and just buy API credits
   - B. Assume the subscription covers every API call and skip checking
   - C. Sign in with ChatGPT and check the allowance your account has
   - D. Reinstall with npm first, since only it supports ChatGPT sign-in
   > **Answer: C.** ChatGPT sign-in and API authentication are distinct paths. Check the active account and its allowance before choosing a separately billed API path. A and B both jump to conclusions without checking; and sign-in doesn't depend on how you installed it, since the standalone installer, Homebrew, and npm versions can all sign in with ChatGPT (D).

3. **[Basic · Concept]** What does `AGENTS.md` provide? <!-- quiz: q03 revision: 2 -->
   - A. Project instructions that get loaded into the context
   - B. A security setting that restricts which files can be read
   - C. A way to train the rules you write into the model itself
   - D. A guarantee that Codex follows every rule without fail
   > **Answer: A.** It makes project conventions explicit and is loaded into context while working. What actually restricts file access is the sandbox and permission settings (B); it doesn't change model weights (C); and rules in context aren't guaranteed to be followed every time (D).

4. **[Advanced · Misconception]** “If a command is dangerous, Codex must ask me first.” What is missing? <!-- quiz: q04 revision: 2 -->
   - A. Nothing; a dangerous command always brings up a confirmation
   - B. Git: it automatically blocks every action with external effects
   - C. The model: switch to a stronger model and it will ask first
   - D. It depends on the sandbox, approval policy, and permissions
   > **Answer: D.** Actions may already be allowed, require approval, or be blocked, so "it always asks" can't be relied on (A). Git covers recorded files and can't block external actions (B); switching models doesn't change the approval configuration (C). Check the actual configuration, and don't turn on options that skip approvals (Chapter 26).

5. **[Basic · Scenario]** A cloud task fails because a dependency is missing. What is the useful next step? <!-- quiz: q05 revision: 2 -->
   - A. Install it on your own computer first; the cloud will pick it up
   - B. Check the environment setup and install the dependency there
   - C. Lift the network and file limits so it can install things itself
   - D. Have it change the code to work around the missing dependency
   > **Answer: B.** The cloud environment is separate and can't use packages on your computer (A). Repair the setup using the repository's documented package manager and dependency files. Lifting every limit for this widens the risk (C), and working around the dependency can break features (D).

6. **[Basic · Hands-on]** In a small project, request one README clarification, inspect the resulting diff, and record the account path, permissions, and verification result. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** A successful exercise has a bounded change and visible evidence. It also tells you where the work ran and which account’s allowance or bill it used.
