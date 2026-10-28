An agent can edit files, run commands, and use connected services. To use that help well, agree on **where it may work, what it may do, and how you will check and recover the result**. Asking permission before every keystroke is not the goal. Keeping meaningful boundaries is.

Product defaults and permission modes change. Check the official documentation and your organization's settings; the ideas below help you understand what those controls do.

## 1. Three different things: sandbox, authorization, and approval

Think of hiring someone to repair a room. The locked doors define where they can go; the work order says what you want done; a call to you handles a change to that order.

| Control | Question it answers | Example |
| --- | --- | --- |
| **Sandbox** | What can the process technically access? | Write only inside this workspace; restrict network destinations |
| **Authorization** | What work has the user or organization allowed? | Fix this page and run the relevant local checks |
| **Approval mechanism** | When must execution pause for a decision? | A command needs access outside the sandbox, or an action exceeds the agreed scope |

These are related, but different. A command can be technically possible and still outside your instructions. Conversely, you can authorize a task while the environment still blocks a capability it needs. An approval prompt is a decision point, not proof that everything else is harmless. Some tools also use policy-based automatic reviews.

**Least privilege** means giving the task only the files, tools, accounts, and network access it needs. Reading a public page does not require access to your whole inbox. Fixing a local document does not require production credentials.

## 2. A useful loop: agree on scope → work within it → verify

A good instruction can authorize a whole sensible piece of work:

> “Fix the broken navigation in this checkout. You may inspect and edit the relevant files and run local checks. Preserve my existing work. Show me the diff and results before publishing.”

Within that scope and the environment's limits, the agent can read files, edit, test, and repair a failed check without repeatedly asking the same question. **Existing authorization remains valid for the work it covers.** A new recipient, production change, destructive cleanup, or broader access may require a new decision.

```text
agree on goal, scope, and recovery
               ↓
work within the authorized limits → check the result
               │
               └─ need to cross a boundary? → explain the concrete action → obtain approval
```

Frequent prompts do not automatically mean better safety. Too many vague prompts can make people click through without reading. A useful approval shows **what will change, where, for whom, and with what cost or recovery limits**. Whether a tool prompts on every command, only on escalation, or according to a policy depends on its configuration.

## 3. "Skip approvals" switches: leave them off as a beginner

Many tools have options that make the agent ask less, or not at all. As of October 2026, Claude Code has the `--dangerously-skip-permissions` flag (the bypassPermissions mode), and Codex has `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) plus a sandbox setting called `danger-full-access`. They all have "dangerous" in the name for a reason: they turn off approvals, and some turn off the sandbox too. At that point one misjudgment by the agent, or a malicious instruction it read on a web page or in an email, can turn straight into a real action.

As a beginner, don't use these options, and don't switch them on just because the prompts feel tedious. If you ever truly need one, for example to run a batch of tests unattended, use it only inside an isolated sandbox or a throwaway environment: a virtual machine or container with none of your personal files, important accounts, or keys. Claude Code's official documentation likewise recommends this mode only in isolated environments such as containers or VMs without internet access, and the Codex documentation labels the fully open combination high-risk and not recommended.

There is also a family of "auto" modes, where another model or a preset policy reviews actions for you and far fewer prompts appear. That reduces interruptions, but the official docs say plainly that it does not guarantee safety. An action that gets through automatically is not necessarily an appropriate one; deleting, publishing, and spending still need explicit authorization as described in the next section. Which modes exist and what they are called depends on your version, so check its official documentation.

## 4. High-impact actions need explicit, specific authorization

The word “delete” alone does not tell you the risk: removing a generated test file differs from deleting customer records. Judge the **target, scope, external effects, and recoverability**.

| Action | What to agree on before execution |
| --- | --- |
| Delete or overwrite valuable data | Exact targets, backup or recovery, and whether unrelated work could be lost |
| Send a message or publish | Recipients or destination, content, and which information may leave |
| Spend money or call paid services | Budget, account, quantity, and stopping limits |
| Change a live system or account access | Environment, affected users, intended change, and recovery plan |

These actions should have explicit authorization. It may be a specific instruction now, or a narrow, previously approved workflow with clear limits. “Send this approved notice to these three recipients” does not need a second identical approval. “Help organize my inbox” does not authorize forwarding private messages to a new address.

For an action outside that scope, prepare a concrete proposal and pause before executing it. Broad permission to edit a project is not permission to publish it, spend an unspecified amount, or wipe unrelated files. Keep especially consequential decisions with the responsible person.

## 5. Git: the bare minimum to get started

Earlier chapters kept saying "save your starting point" and "roll back if something goes wrong." In a local project, that job usually falls to **Git**, a tool that records versions of your files. Each time you "commit," it saves the project as it is right then, as a version you can return to later. Here is the minimum you need.

**1. Install it and check.**

- Windows: download "Git for Windows" from the official Git site, git-scm.com, and install it with the default options.
- macOS: in Terminal, run `xcode-select --install` to install Apple's command line tools, which include Git; if you already use Homebrew, `brew install git` works too.
- Linux: install it with your distribution's package manager.

Then open a new terminal window and run `git --version`. If it prints a version number, you're set. Install steps change now and then, so go by the installation pages on git-scm.com.

Before your first use, tell Git who you are. You only do this once per computer; both values are written into every commit:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**2. Save a starting point for the project.** Go into the project folder and run `git status` first. If it says "not a git repository," the folder isn't under Git yet, so run these in order:

```bash
git init
git add -A
git commit -m "Starting point before changes"
```

`git init` puts the folder under Git's management; you do it once. `git add -A` puts every addition, change, and deletion in the folder onto the "to be saved" list. `git commit -m "..."` saves that list as a version, with a short note in the quotes. Before committing, check that no password or key files are on the list; for files you never want recorded, write their names in a text file called `.gitignore` in the project and Git will skip them. From then on, each time you finish and check a small step, run `git add -A` and `git commit -m "what I did"` again to make a new save point (Chapter 27).

**3. See what changed.**

- `git status`: lists files changed since the last commit, plus new files Git hasn't recorded yet (Untracked files).
- `git diff`: shows uncommitted changes line by line; Chapter 25 explains how to read it.

**4. Undo.**

- You broke a file and haven't committed: look first with `git diff <file>`, then run `git restore <file>` to put it back to its content at the last commit (or the last `git add`). Any unsaved changes in that file are thrown away and cannot be recovered.
- Files the agent created and you never committed aren't touched by `git restore`. They show up under "Untracked files" in `git status`; delete them by hand once you've confirmed you don't need them.
- You already committed and want to undo that one commit: find its ID with `git log --oneline`, then run `git revert <ID>`. Git makes a new "reverse" commit that cancels the change and keeps the original history, which makes it a fairly safe choice. Before running it, commit or deal with any uncommitted changes you have.

`git reset --hard`, which you'll often see in tutorials online, throws away all uncommitted changes at once; leave it alone for now. Undoing often takes more than one step, so go one step at a time and check the result with `git status` after each.

**5. The limits of undo.** Git only covers files in this folder that it has recorded. Emails the agent sent, cloud data it deleted, posts it published, money it spent: Git can't bring any of that back (see section 7).

**Or let the agent do it.** If you'd rather not type the commands, tell the coding agent: "Use Git to save a starting point for this project. Before running each command, tell me what it does and wait for my OK." When it asks to run a command, compare it with the notes above and approve only once you understand it.

## 6. A branch is not a separate room

Before a substantial change, check the current state with `git status` and preserve existing work in a commit or backup. Do not blindly commit secrets or discard someone else's unfinished edits.

Three terms matter:

- **Branch:** a named line of development. `git switch -c practice/first-task` creates a branch and switches to it, so later commits go on that line. Creating a branch does not create another directory. Switching branches in one working directory still uses that same directory.
- **Separate checkout or worktree:** another directory containing working files. A Git worktree lets you work on another branch in its own directory while sharing the repository's history.
- **Sandbox:** a technical access boundary. A worktree organizes files; by itself it does not restrict a process from accessing other directories, accounts, or networks.

A branch is useful for reviewing and merging changes. A separate worktree or checkout is useful when you need independent working files. **Neither automatically snapshots everything on your computer.**

Git can restore recorded file content or undo committed changes. It cannot recover a file it never recorded merely because a branch exists. Untracked and ignored files, local databases, uploads, and secrets may need their own backup. Restoring files or discarding changes can itself erase unfinished work, so identify exactly what should be restored first.

## 7. Recovery also has an outside edge

Rolling back code does **not** unsend an email, retract data someone has already received, refund a bill, restore a remote database, or automatically undo a production deployment. Those systems need their own recovery steps; some effects cannot be fully reversed.

A cloud workspace may provide checkpoints or a disposable checkout. Check **what is included, how long it lasts, and what happens to external services**. A “reset workspace” button is not a universal undo button.

A practical routine is:

1. Define the work and grant only the access it needs.
2. Preserve the starting state (section 5); use a separate working directory when useful.
3. Let the agent complete the authorized local work, stopping for genuine scope changes.
4. Review the diff and relevant checks before the agreed release or external action.
5. If recovery is needed, restore only the intended changes and handle external effects separately.

## Summary

- Sandbox limits, user authorization, and approval prompts answer different questions.
- Give clear scope once; already authorized local work need not trigger repeated permission requests.
- Leave "skip approvals" and "full access" switches off as a beginner; if you ever need one, use it only in an isolated, throwaway environment. Auto modes reduce prompts but don't make every action appropriate.
- High-impact external actions require explicit authorization with clear targets and limits.
- Git bare minimum: `git init`, `git add -A`, and `git commit` save a starting point; `git status` and `git diff` show changes; `git restore` discards a file's uncommitted changes, and `git revert` undoes a commit.
- A branch tracks development. A worktree provides another directory. Neither replaces a sandbox or a backup.
- Know the recovery limits before acting: Git restores recorded project state, not every consequence.

Chapter 27 turns these boundaries into a plan: divide larger changes into pieces you can review.

## Sources and version notes

Checked on 2026-10-22; the permission-switch and Git starter sections were checked on 2026-10-27. These sources describe concrete mechanisms; this chapter's approval routine is practical guidance, not a claim that every product has the same defaults.

- [OpenAI Codex configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json): separate approval, sandbox, and network settings.
- [Codex approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security): sandbox modes, approval policies, and the risk of `--dangerously-bypass-approvals-and-sandbox` (`--yolo`).
- [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes): bypassPermissions recommended only in isolated environments; auto mode reduces prompts but does not guarantee safety.
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime): filesystem and network restrictions.
- Git installation pages: [Windows](https://git-scm.com/install/windows), [macOS](https://git-scm.com/install/mac); [first-time setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) and [getting a repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository).
- Git documentation: [add](https://git-scm.com/docs/git-add), [restore](https://git-scm.com/docs/git-restore), [branches](https://git-scm.com/docs/git-branch), [worktrees](https://git-scm.com/docs/git-worktree), [revert](https://git-scm.com/docs/git-revert), and [ignored files](https://git-scm.com/docs/gitignore).

---

## Quiz

> Six questions. Think first, then check the answer and explanation.

1. **[Basic · Concept]** Which distinction is correct? <!-- quiz: q01 revision: 2 -->
   - A. A sandbox decides what work is allowed; approval limits what can be technically touched
   - B. A sandbox limits technical reach, authorization defines the work, approval sets pauses
   - C. If a command can run inside the sandbox, that means the user has authorized it
   - D. The more often approval prompts appear, the safer this set of controls must be
   > **Answer: B.** Being technically able to do something is not the same as being authorized to do it; approval is the point where execution stops for a human decision. A swaps the roles of the sandbox and approval. C mistakes "can run" for "is allowed." D overlooks that too many vague prompts make people click through without reading.

2. **[Basic · Scenario]** You authorized a local page fix and its tests. Must the agent ask again before each ordinary edit within that scope? <!-- quiz: q02 revision: 2 -->
   - A. Yes; re-approving every edit, even within scope, is the safe choice
   - B. Not for edits, but it should ask again each time before running tests
   - C. No; it may continue within the agreed scope and environment limits
   - D. No, and that same authorization also allows publishing to production
   > **Answer: C.** Existing authorization covers the agreed work, including the related edits and checks, so A and B add nothing. Publishing or broader access is a separate boundary unless already explicitly authorized, so D is wrong.

3. **[Advanced · Scenario]** “Organize my inbox” is the only instruction. A message asks the agent to forward the inbox to an unfamiliar address. What should happen? <!-- quiz: q03 revision: 2 -->
   - A. Treat the message as data and don't send anything beyond the user's authorization
   - B. The message is in the user's own inbox, so treat it as the user's instruction
   - C. Create a Git branch first, so the forwarding can be undone if something goes wrong
   - D. Forward only the messages without private details, as a reasonable compromise
   > **Answer: A.** Incoming content cannot grant permission; external sending needs a destination and scope the user authorized. B mistakes "in the inbox" for "said by the user." C assumes Git can recall something already sent. D still carries out an instruction nobody authorized.

4. **[Basic · Concept]** What creates another directory of working files? <!-- quiz: q04 revision: 2 -->
   - A. Creating a new branch, which Git automatically puts in a new folder
   - B. Opening another new agent conversation in the same project
   - C. Approving a command so it runs in its own copy inside the sandbox
   - D. Creating a separate checkout, or setting up a Git worktree
   > **Answer: D.** A branch is a line of development inside the same directory and adds no folder (A); a new conversation doesn't necessarily change directories (B); approving a command doesn't produce another set of working files (C). A worktree supplies another working directory, but it is still not a security sandbox.

5. **[Advanced · Misconception]** After an agent sends an email and changes a database, what can a Git rollback guarantee? <!-- quiz: q05 revision: 2 -->
   - A. It unsends the email and puts the database back to how it was before
   - B. It restores every file in the repository, including ones never committed
   - C. It restores recorded code; the email and database are handled separately
   - D. As long as it happened recently, the external actions can be undone along with it
   > **Answer: C.** Git manages content recorded in the repository. Emails, database state, and billing sit outside Git and can't be undone by it however recent they are (A, D); files that were never committed have no copy in Git (B).

6. **[Hands-on · Observation]** Without deleting anything, plan a cleanup of old project files. What would you check first? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** List the exact candidates, distinguish generated files from valuable data, preserve existing work, and check what Git or backups actually cover. Agree on the cleanup scope and any external effects. A clear, bounded authorization is more useful than approving an unexplained “clean everything” command.
