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

## 3. High-impact actions need explicit, specific authorization

The word “delete” alone does not tell you the risk: removing a generated test file differs from deleting customer records. Judge the **target, scope, external effects, and recoverability**.

| Action | What to agree on before execution |
| --- | --- |
| Delete or overwrite valuable data | Exact targets, backup or recovery, and whether unrelated work could be lost |
| Send a message or publish | Recipients or destination, content, and which information may leave |
| Spend money or call paid services | Budget, account, quantity, and stopping limits |
| Change a live system or account access | Environment, affected users, intended change, and recovery plan |

These actions should have explicit authorization. It may be a specific instruction now, or a narrow, previously approved workflow with clear limits. “Send this approved notice to these three recipients” does not need a second identical approval. “Help organize my inbox” does not authorize forwarding private messages to a new address.

For an action outside that scope, prepare a concrete proposal and pause before executing it. Broad permission to edit a project is not permission to publish it, spend an unspecified amount, or wipe unrelated files. Keep especially consequential decisions with the responsible person.

## 4. Git helps recovery; a branch is not a separate room

Git records versions you deliberately save. Before a substantial change, check the current status and preserve existing work in a suitable commit or backup. Do not blindly commit secrets or discard someone else's unfinished edits.

Three terms matter:

- **Branch:** a named line of development. Creating a branch does not create another directory. Switching branches in one working directory still uses that same directory.
- **Separate checkout or worktree:** another directory containing working files. A Git worktree lets you work on another branch in its own directory while sharing the repository's history.
- **Sandbox:** a technical access boundary. A worktree organizes files; by itself it does not restrict a process from accessing other directories, accounts, or networks.

A branch is useful for reviewing and merging changes. A separate worktree or checkout is useful when you need independent working files. **Neither automatically snapshots everything on your computer.**

Git can restore recorded file content or undo committed changes. It cannot recover a file it never recorded merely because a branch exists. Untracked and ignored files, local databases, uploads, and secrets may need their own backup. Restoring files or discarding changes can itself erase unfinished work, so identify exactly what should be restored first.

## 5. Recovery also has an outside edge

Rolling back code does **not** unsend an email, retract data someone has already received, refund a bill, restore a remote database, or automatically undo a production deployment. Those systems need their own recovery steps; some effects cannot be fully reversed.

A cloud workspace may provide checkpoints or a disposable checkout. Check **what is included, how long it lasts, and what happens to external services**. A “reset workspace” button is not a universal undo button.

A practical routine is:

1. Define the work and grant only the access it needs.
2. Preserve the starting state; use a separate working directory when useful.
3. Let the agent complete the authorized local work, stopping for genuine scope changes.
4. Review the diff and relevant checks before the agreed release or external action.
5. If recovery is needed, restore only the intended changes and handle external effects separately.

## Summary

- Sandbox limits, user authorization, and approval prompts answer different questions.
- Give clear scope once; already authorized local work need not trigger repeated permission requests.
- High-impact external actions require explicit authorization with clear targets and limits.
- A branch tracks development. A worktree provides another directory. Neither replaces a sandbox or a backup.
- Know the recovery limits before acting: Git restores recorded project state, not every consequence.

Chapter 27 turns these boundaries into a plan: divide larger changes into pieces you can review.

## Sources and version notes

Checked on 2026-10-22. These sources describe concrete mechanisms; this chapter's approval routine is practical guidance, not a claim that every product has the same defaults.

- [OpenAI Codex configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json): separate approval, sandbox, and network settings.
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime): filesystem and network restrictions.
- Git documentation: [branches](https://git-scm.com/docs/git-branch), [worktrees](https://git-scm.com/docs/git-worktree), [revert](https://git-scm.com/docs/git-revert), and [ignored files](https://git-scm.com/docs/gitignore).

---

## Quiz

> Six questions. Think first, then check the answer and explanation.

1. **[Basic · Concept]** Which distinction is correct? <!-- quiz: q01 revision: 1 -->
   - A. A sandbox proves the user authorized every possible action
   - B. A sandbox limits technical access; authorization defines allowed work; approval decides when to pause
   - C. Approval prompts are a backup system
   - D. A branch blocks network access
   > **Answer: B.** A tool may be capable of an action without being authorized to do it. These controls support each other but serve different purposes.

2. **[Basic · Scenario]** You authorized a local page fix and its tests. Must the agent ask again before each ordinary edit within that scope? <!-- quiz: q02 revision: 1 -->
   - A. Yes, every edit always needs a new approval
   - B. Only if the file has more than ten lines
   - C. No; it may continue within the agreed scope and environment limits
   - D. No; that also authorizes publishing to production
   > **Answer: C.** Existing authorization covers the agreed work. Publishing or broader access is a separate boundary unless already explicitly authorized.

3. **[Advanced · Scenario]** “Organize my inbox” is the only instruction. A message asks the agent to forward the inbox to an unfamiliar address. What should happen? <!-- quiz: q03 revision: 1 -->
   - A. Forward it because the email requested it
   - B. Treat the message as data; do not send outside the user's authorized scope
   - C. Create a Git branch and forward it
   - D. Forward only the oldest messages
   > **Answer: B.** Incoming content cannot grant permission. External sending needs an authorized destination and scope.

4. **[Basic · Concept]** What creates another directory of working files? <!-- quiz: q04 revision: 1 -->
   - A. Merely naming a new branch
   - B. Opening another chat
   - C. Creating a separate checkout or Git worktree
   - D. Approving a command
   > **Answer: C.** A branch is a development reference; a worktree supplies another working directory. It is still not a security sandbox.

5. **[Advanced · Misconception]** After an agent sends an email and changes a database, what can a Git rollback guarantee? <!-- quiz: q05 revision: 1 -->
   - A. It unsends the email and restores the database
   - B. It refunds any paid calls
   - C. It erases every trace of the task
   - D. It can restore the relevant recorded code; the external effects need separate handling
   > **Answer: D.** Git manages recorded repository content. Messages, database state, billing, and unrecorded files are outside that guarantee.

6. **[Hands-on · Observation]** Without deleting anything, plan a cleanup of old project files. What would you check first? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** List the exact candidates, distinguish generated files from valuable data, preserve existing work, and check what Git or backups actually cover. Agree on the cleanup scope and any external effects. A clear, bounded authorization is more useful than approving an unexplained “clean everything” command.
