Appendix C lists the commands and settings the tools offer. This appendix is about connecting them with your own rules and checks so that a coding agent's work can be trusted. The industry calls this whole arrangement a harness.

## 1. What "harness" means

A harness is originally the gear you put on a horse: the horse is no stronger, but with the harness it can pull a cart in the direction you want. In AI, a common way of putting it as of 2026 is "agent = model + harness": the harness is everything in an agent except the model itself, including the instructions given to the model, the tools it can call, the loop that keeps calling the model until the task is done, the context management that decides what the model sees at each step, and permissions and checks. Anthropic, for example, calls the Claude Agent SDK a general-purpose agent harness and describes it as providing the same tools, agent loop, and context management that power Claude Code.

From the user's side, a harness has two layers. The inner layer comes with the tool: coding agents such as Claude Code and Codex already have a loop, tools for reading and writing files and running commands, context compaction, and a permission system built in, and you usually cannot change them. The outer layer is the one you build: project rule files, reviewing a plan before work starts, automated tests and checks, and human acceptance. Birgitta Böckeler of Thoughtworks sorts the outer layer into two kinds: guides, which tell the agent how to work before it acts (rule files, for example), and sensors, which catch problems after it acts and let it correct itself (tests and code checks, for example).

What follows is this book's working checklist for building that outer layer. It combines the sources above with the practices in Chapters 24 to 27; it is not any vendor's official method. The ideas are the same whether you use Claude Code or Codex.

## 2. The outer layer you can build: four parts

| Part | Kind | What it does | Examples |
| --- | --- | --- | --- |
| Project rule file | Guide | Goes into the context at the start of every session and tells the agent how this project works | `CLAUDE.md`, `AGENTS.md` (Chapter 28, Appendix C) |
| Plan gate | Guide | Confirms which files will change and what will be reused before any work starts | Plan mode (Chapter 27) |
| Automated checks | Sensor | Run after every change; failures go back to the agent to fix | Tests, code checks, builds |
| Human acceptance | Sensor | Confirms the behavior meets the requirement, with an extra review for high-risk changes | The checklist in Section 6 of this appendix (Chapter 25) |

One distinction matters: a rule file is just text placed in the context. The model usually follows it, but nothing guarantees that. Anything you truly need to block, such as reading `.env` or deleting a directory, should be enforced with the tool's permission rules or a sandbox (Chapter 26).

## 3. The five-step workflow

Put into an actual conversation, the outer layer becomes these five steps. Each step comes with a sample of "what to say to the AI"; these are plain-language prompts, not product commands.

| Step | What you want at this step | Sample prompt |
| --- | --- | --- |
| ① Investigate | Understand the current state; no changes yet | "Before changing anything, investigate this project: its overall structure, existing approaches similar to this request, shared modules we can reuse (network requests, error handling, logging, forms, and so on), and its naming and code style. List them with file paths, and don't write code yet." |
| ② Write the rules | Turn the findings into rules | "Turn that investigation into project rules for the AI: which mechanisms must be reused and what is forbidden." |
| ③ Plan gate | Propose a plan and wait for approval | "The task is 〈…〉. Before changing anything, give me a plan: which files you'll change or add, which existing mechanisms you'll reuse, and whether you need any new dependency (and why). Don't write code until I approve." |
| ④ Implement | Follow what already exists | "Approved. Follow the existing directory structure, naming, and style strictly, and reuse the shared modules you found. Don't introduce new abstractions of your own." |
| ⑤ Accept | Self-check, then your review | "Check yourself against the existing code you referenced: did you reinvent anything, break the overall design, or bypass a shared module? Then tell me in plain words what you changed and where the risks are." After that, go through the checklist in Section 6. |

The step that saves the most rework is ③: see what the agent intends to do before it does it. Many tools have a plan mode that helps you hold that line (Chapter 27, Appendix C).

## 4. Project rule file: a starter you can copy

The rules from step ② work best as a file in the project that the tool reads automatically at the start of every session: Claude Code uses `CLAUDE.md` (and reads `AGENTS.md` when there is no `CLAUDE.md`), and Codex uses `AGENTS.md` (Appendix C). It looks as if the agent "remembers the project's rules," but in fact the product puts the file back into the context every time; the model itself remembers nothing (Chapter 13). So it only "remembers" what is written in the file, and the more specific the rules, the steadier the results.

Replace each `<...>` in this starter with your project's real details:

```markdown
# Project rules / rules for working with AI

## Most important principles
- Follow the existing implementation approach and design; don't bring in a style of your own.
- Before introducing any new mechanism (library, abstraction, layer), check for an existing one of the same kind. Reuse it if it exists; if not, explain why and propose alternatives first, and wait for approval.
- Don't make changes that break the overall architecture (layering, dependency direction, naming rules).

## Workflow
1. First investigate the relevant existing code and shared modules, and list where you looked (paths).
2. Give an implementation plan (files to change or add, what you'll reuse, whether a new dependency is needed and why); write code only after approval.
3. After changing code, run the existing checks, formatting, and tests (<e.g. npm run lint && npm test>) and report the results.

## Tech stack and versions
- <e.g. TypeScript 5 / React 18 / Vite>

## Directory structure and responsibilities
- <e.g. components/ UI   hooks/ logic   services/ API calls   utils/ shared helpers>
- Dependency direction: <e.g. UI → hooks → services, one way only; no reverse or layer-skipping dependencies>

## Shared mechanisms that must be reused
- Network requests: <e.g. services/apiClient> (don't call fetch directly all over the code)
- Error handling: <e.g. AppError / errorHandler>
- Logging: <e.g. logger> (don't use console.log directly)

## Forbidden
- Adding third-party dependencies without approval
- Reading or printing key files such as .env
- Layer-skipping dependencies (for example, the UI layer touching the database directly)
```

## 5. Tips that make it work

| Tip | How |
| --- | --- |
| Make rules specific | "Write clean code" does nothing; name the modules to reuse, the file paths, and what is forbidden |
| Separate investigating, planning, and acting | Don't try to do it all in one message; give investigation and plan approval their own rounds |
| Work in small steps | Big changes in one go drift most easily; break the work up and check each step |
| Keep adding rules | When the agent drifts, add the matching rule to the file and share it with the team |
| Let checks run automatically | Put the test and code-check commands in the rule file and require the agent to run them after every change and report the results |
| Don't over-abstract | Too much "reuse" breeds needless wrappers; match the granularity of the existing code |

## 6. Pre-release checklists

Keep these two checklists at hand: go through the first before you give anything to the AI, and the second before you adopt what it produced.

### Before giving it to the AI

- Does the material contain confidential code, production data, or personal information? If so, mask it first or leave it out (Chapter 37).
- Have API keys, passwords, or connection strings slipped in? Never hand these over (Chapter 37).
- Is the service and plan you're using allowed by your company or for this situation?
- Have you stated the basics: language, framework, versions?
- Have you given enough context: relevant code, logs, expected behavior?

### Before adopting its output

If you don't write code, you don't need to understand every changed line. You do need to do the following:

- Confirm the behavior with concrete acceptance checks: which page to open, what to click, what you should see; whether the relevant tests pass and the old features still work (Chapter 25).
- Have the agent explain the diff in plain words: which files changed and why, and which parts are risky. If the scope of the change doesn't match what you asked for, don't adopt it yet.
- For any change that touches money, personal data, keys, deleting files, or publishing, get a second review: a colleague who knows the area, or at least a separate, independent review pass.
- Don't run anything you can't roll back. First make sure the change is committed to Git and the data is backed up (Chapter 26). Git cannot bring back sent emails or changed live data.
- Is any newly added library from a trustworthy source, and does its license allow your use (Chapter 39)?
- Do the function names, APIs, and settings it mentions really exist? Check against official documentation or actual run results (Chapter 9).
- Have you checked important facts, numbers, and quotes yourself (Chapter 39)?

## 7. When a team sets its rules

One person can rely on habits; a team needs written rules. How to write the four basic rules on data, authority, credentials, and recovery is covered in Chapter 40. A coding team should add two more:

1. An approval flow: who approves AI-generated code from review through merge to deployment, and by what standard.
2. Shared assets: collect the project rule files and frequently used prompt templates (Appendix B) for the whole team, and review them regularly, since tools and models keep changing.

## Summary

- A harness is everything in an agent except the model: instructions, tools, the loop, context management, permissions, and checks. Coding tools come with the inner layer; you build the outer layer.
- The outer layer consists of guides (rule files, the plan gate) and sensors (automated checks, human acceptance). What truly must be blocked is enforced with permissions and sandboxes, not just written in the rules.
- Of the five steps, reviewing the plan before work starts saves the most rework.
- Before adopting output, you don't need to read every line, but you do need concrete checks of the behavior, an explanation of the diff and its risks, a second review for high-risk changes, and no operations you can't roll back.

## Sources and version notes

Checked on 2026-10-29. The five-step workflow and the checklists are this book's working method, not a vendor's official methodology.

- [Birgitta Böckeler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) (martinfowler.com, 2026-04-02): "Agent = Model + Harness," the harness built into tools versus the outer harness users build, and guides versus sensors.
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (2025-11-26): calls the Claude Agent SDK a general-purpose agent harness and describes feature lists, progress files, Git commits, and end-to-end testing for long tasks.
- [Claude Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview): the SDK provides the same tools, agent loop, and context management that power Claude Code.
- [Claude Code documentation: memory](https://code.claude.com/docs/en/memory): `CLAUDE.md` is context, not enforced configuration; a repository without `CLAUDE.md` has its `AGENTS.md` read instead.
