An agent can edit files, run commands, and use connected services. To get the most from that help, agree on three things first: where it may work, what it may do, and how results will be checked and recovered. The goal isn't to ask permission at every keystroke; it's to hold the boundaries that matter.

## 1. Three different things: sandbox, authorization, and approval

Think of hiring someone to repair a room. The locks decide where they can go, the work order says what you want done, and changing the work order means checking with you first.

| Control | Question it answers | Example |
| --- | --- | --- |
| Sandbox | What can the process technically reach? | Write only inside the current project folder; no network |
| Authorization | What work have you or your organization allowed? | Fix this page and run the related local checks |
| Approval | When must it stop and wait for a person? | A command needs to leave the sandbox, or an action goes beyond the agreed scope |

A sandbox is a technical fence: files and networks outside it are out of reach. The three are related but not the same: a command may be technically possible yet outside what you asked for. An approval prompt is a decision point; no prompt doesn't mean everything else is harmless.

Least privilege means granting only the files, tools, accounts, and network access the task needs. Reading a public web page doesn't need access to your whole inbox; editing a local document doesn't need production keys.

## 2. Four permission levels

Tools name their permission settings differently, but they roughly line up into four levels, from low to high:

![Four permission levels, from bottom to top: read only, asks before each change, edits project files freely, runs anything without asking; the first two are marked fine for beginners, the third fine after saving a starting point in Git, and the fourth marked for beginners to avoid](/figures/en/permission-levels.svg)

1. Read only: it looks at files and answers questions, and changes nothing. Good for having it investigate an unfamiliar project first.
2. Asks before each change: it stops and waits for your OK before editing files or running commands. Good when you're just starting.
3. Edits project files freely: changes inside the project folder no longer ask each time; going beyond it (network access, files outside the project) still asks. Once the project has a starting point saved in Git (section 5), this level saves effort and you can still go back.
4. Runs anything without asking: approvals are off, and sometimes the sandbox too. Beginners shouldn't use it.

Here's how the two tools map onto this as of October 2026 (mode names may change). Claude Code's Manual mode (`default` in the settings) asks before most file edits, commands, and network access, so it's level 2; `acceptEdits` mode can edit files in the working directory directly, so it's level 3. Note that recent versions of Claude Code start terminal and VS Code sessions in the auto mode described below; to work at level 2, press Shift+Tab in the terminal until the status bar shows "manual mode on". Codex starts at level 3 in a folder managed by Git (it calls this Auto: it asks only when it needs to leave the sandbox), and is read-only by default in other folders; type `/permissions` in a session to change it.

Both tools have a level 4, and every name for it contains "dangerous": Claude Code's `--dangerously-skip-permissions` flag (equivalent to `bypassPermissions` mode), and Codex's `--dangerously-bypass-approvals-and-sandbox` flag (alias `--yolo`) plus a sandbox setting called `danger-full-access`. With it on, one misjudgment by the agent, or a malicious instruction it read on a web page or in an email, can turn straight into a real action. Don't switch it on because the prompts are annoying. If you truly need it, say to run a batch of tests unattended, use it only in a disposable, isolated environment: a virtual machine or container with none of your personal files, important accounts, or keys. Both companies' documentation marks it as high risk.

There are also "auto" modes (Claude Code's auto mode, for example, which recent versions use by default in the terminal), where another model reviews actions for you, so prompts drop sharply. The official documentation states that this reduces prompts but doesn't guarantee safety. Deleting, publishing, and spending money still need explicit authorization as described in section 4.

## 3. A useful loop: agree on scope → work within it → verify

One clear instruction can authorize a whole stretch of reasonable work:

> "Fix the navigation problem in this project. You may read and edit the related files and run local checks. Keep my existing changes, and show me the diff and check results before anything is published."

Within that scope and the environment's limits, the agent can read files, edit, test, and fix failing checks without asking the same question again. An authorization you've given stays valid for the work it covers. A new recipient, a production change, a destructive cleanup, or wider access is what calls for a new decision.

```text
agree on goal, scope, and how to recover
             ↓
work within the authorization → check results
             │
             └─ need to cross a boundary? → describe the exact action → get approval
```

More prompts don't automatically mean more safety; when vague prompts pile up, people start approving without reading. A useful approval says what will change, where, who is affected, what it costs, and how far it can be undone.

## 4. High-impact actions need explicit, specific authorization

The word "delete" alone doesn't tell you the risk: deleting generated test files and deleting customer records are very different. Look at the target, the scope, the outside effects, and whether it can be undone.

| Action | What to agree before it runs |
| --- | --- |
| Deleting or overwriting valuable data | The exact target, a backup or recovery method, whether unrelated work could be lost |
| Sending messages or publishing | Recipients or destination, content, what information may go out |
| Spending money or using paid services | Budget, account, quantity, and when to stop |
| Changing live systems or account permissions | Environment, who is affected, the expected change, and a recovery plan |

Authorization can be a specific instruction given now, or a clearly bounded process approved earlier. "Send this approved notice to these three recipients" doesn't need a second confirmation; "help me tidy my inbox" doesn't mean permission to forward private mail to a new address. Permission to edit the project isn't permission to publish, spend money, or wipe unrelated files. When something goes beyond the scope, prepare a specific proposal and stop before acting.

## 5. Git: the bare minimum to get started

Earlier chapters kept saying "save your starting point" and "roll back if something goes wrong." In a local project, that job usually falls to Git, a tool that records versions of your files. Each time you commit, it saves the project as it is right then, as a version you can return to later. Here is the minimum you need.

### 1. Install it and check

- Windows: download "Git for Windows" from the official Git site, git-scm.com, and install it with the default options.
- macOS: in Terminal, run `xcode-select --install` to install Apple's command line tools, which include Git; if you already use Homebrew, `brew install git` works too.
- Linux: install it with your distribution's package manager.

Then open a new terminal window and run `git --version`. If it prints a version number, you're set.

Before your first use, tell Git who you are. You only do this once per computer; both values are written into every commit:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 2. Save a starting point for the project

Go into the project folder and run `git status` first. If it says "not a git repository," the folder isn't under Git yet, so run these in order:

```bash
git init
git add -A
git commit -m "Starting point before changes"
```

`git init` puts the folder under Git's management; you do it once. `git add -A` puts every addition, change, and deletion in the folder onto the "to be saved" list. `git commit -m "..."` saves that list as a version, with a short note in the quotes. Before committing, check that no password or key files are on the list; for files you never want recorded, write their names in a text file called `.gitignore` in the project and Git will skip them. From then on, each time you finish and sign off a small step, run `git add -A` and `git commit -m "what I did"` again to make a new save point (Chapter 27).

### 3. See what changed

- `git status`: lists files changed since the last commit, plus new files Git hasn't recorded yet (Untracked files).
- `git diff`: shows uncommitted changes line by line; Chapter 25 explains how to read it.

### 4. Undo

- You broke a file and haven't committed: look first with `git diff <file>`, then run `git restore <file>` to put it back to its content at the last commit (or the last `git add`). Any unsaved changes in that file are thrown away and cannot be recovered.
- Files the agent created and you never committed aren't touched by `git restore`. They show up under "Untracked files" in `git status`; delete them by hand once you've confirmed you don't need them.
- You already committed and want to undo that one commit: find its ID with `git log --oneline`, then run `git revert <ID>`. Git makes a new "reverse" commit that cancels the change and keeps the original history, which makes it a fairly safe choice. Before running it, commit or deal with any uncommitted changes you have.

`git reset --hard`, which you'll often see in tutorials online, throws away all uncommitted changes at once; leave it alone for now. Undoing often takes more than one step, so go one step at a time and check the result with `git status` after each.

If you'd rather not type the commands, you can tell the coding agent: "Use Git to save a starting point for this project. Before running each command, tell me what it does and wait for my OK." When it asks to run a command, compare it with the notes above and approve only once you understand it.

## 6. A branch is not a separate room

Three terms to keep apart:

- Branch: a named line of development. `git switch -c practice/first-task` creates a branch and switches to it, so later commits go on that line. Creating a branch does not create another directory; switching branches in one folder still uses that same folder.
- Worktree or separate checkout: another directory holding working files. `git worktree` lets you work on another branch in its own directory while sharing the repository's history, so two tasks don't get in each other's way.
- Sandbox: a technical access boundary. A worktree only organizes files; by itself it doesn't stop a process from reaching other directories, accounts, or networks.

Neither a branch nor a worktree snapshots your whole computer. Git can restore only what it recorded; untracked and ignored files, local databases, and keys need their own backups. Restoring files or discarding changes can itself erase unsaved work, so work out exactly what should be restored first.

## 7. Recovery also has an outside edge

Rolling back code doesn't unsend an email, retract data someone has already received, refund a charge, or restore a remote database, and it doesn't automatically undo a production deployment. Those systems need their own recovery steps, and some effects can't be fully reversed.

Cloud workspaces and some tools have built-in checkpoints (Claude Code's `/rewind`, for example; see Chapter 28). Before relying on one, check what it covers and how long it lasts. A "reset workspace" button isn't a universal undo. When you need to recover, undo only this task's changes and handle outside effects separately; that's why you review the diff and check results before publishing or sending anything (Chapter 25).

## Summary

- A sandbox limits what can technically be reached, authorization decides what should be done, and approval decides when to stop and ask a person.
- Permissions fall roughly into four levels: read only, asks before each change, edits project files freely, and runs anything without asking. Beginners use the first three (the third after saving a starting point in Git) and not the fourth; auto modes cut prompts but don't guarantee every step is appropriate.
- Agree on the scope once, and authorized local work doesn't need repeated approval; deleting, publishing, spending, and changing live systems need authorization with a clear target and limits.
- The Git minimum: `git init`, `git add -A`, `git commit` to save a starting point; `git status` and `git diff` to see changes; `git restore` to discard a file's uncommitted changes; `git revert` to undo a commit.
- A branch records a line of development and a worktree gives you another directory; neither replaces a sandbox or a backup.
- Rollback restores only recorded project states; outside effects need separate handling.

Chapter 27 turns these boundaries into a plan: breaking bigger changes into small pieces you can sign off one at a time.

## Sources and version notes

Permission modes, the related switches and the Git starter section were rechecked against the official documentation on 2026-10-29. The approval process in this chapter is practical advice and doesn't mean every product behaves the same by default.

- [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes): what each mode does without asking; bypassPermissions is equivalent to `--dangerously-skip-permissions` and recommended only for isolated environments without internet access; auto mode doesn't guarantee safety.
- [Codex approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security): folders under Git default to Auto, others to read-only; fully open settings such as `--yolo` are high risk.
- [OpenAI Codex configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json): approval, sandbox, and network are separate settings.
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime): filesystem and network restrictions.
- Git installation pages: [Windows](https://git-scm.com/install/windows), [macOS](https://git-scm.com/install/mac); [first-time setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup), [getting a repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository).
- Git documentation: [add](https://git-scm.com/docs/git-add), [restore](https://git-scm.com/docs/git-restore), [branch](https://git-scm.com/docs/git-branch), [worktree](https://git-scm.com/docs/git-worktree), [revert](https://git-scm.com/docs/git-revert), [ignored files](https://git-scm.com/docs/gitignore).

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
