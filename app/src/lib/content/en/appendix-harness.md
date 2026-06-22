If Appendix C is "which buttons the tool has," this Appendix D is about "**how to string those buttons into a way of working you can trust.**" It comes from a method that frontline teams have polished over and over, called the **Harness**. The core is one sentence: **don't let the AI run free and improvise; put a harness on it, the frame of "understand first, then set the rules, propose a plan first, act, and verify at the end."** Whether you use Claude Code or Codex, this method works the same.

> **Key point:** the biggest risk when AI writes code isn't "it can't write it," it's that it **acts on its own and starts over from scratch.** It may ignore the existing approach in your project and force in its own style, throwing off the overall design. The Harness exists to prevent this: have it work **along with what you already have**, instead of tearing it down and rebuilding. This method is the other side of Chapters 26, 27, 28, and 29; read them together.

## 1. What the Harness is: four moves

Treat the AI as a collaborator who's **very capable, but it's their first day and they don't know your project yet.** You wouldn't let that kind of person write straight to the main branch, right? You'd have them:

1. **Understand first:** get clear on the existing code and the existing rules.
2. **Set the rules:** write down "how things are done in this project" in black and white.
3. **Propose a plan first:** before acting, say which files will change and which existing things will be reused; you nod, then they do it.
4. **Verify:** when done, self-check against the rules, and you read the diff yourself too (Chapter 27).

These four moves are the Harness. It doesn't depend on any one tool's particular buttons; it's a way of thinking.

## 2. The five-step workflow (follow along)

Bringing those four moves down into an actual conversation gives you these five steps. Each step comes with a sample "thing to say to the AI." These are **plain-language prompts, not product commands**; edit them and they're ready to use.

| Step | What this step has it do | Sample prompt (plain words) |
| --- | --- | --- |
| 1. Explore | Get clear on the current state first, don't act | "Before acting, investigate this project: the overall structure, existing approaches similar to this need, shared modules I can reuse (network requests / error handling / logging / forms, etc.), naming and code style. List them for me **with file paths**, and don't write code yet." |
| 2. Turn into rules | Lock the findings into rules | "Take the findings above and organize them into a project-rules file for the AI: which mechanisms must be reused, which things are forbidden." |
| 3. Plan gate | Propose a plan, wait for your approval | "The task is <...>. Before acting, give me a plan first: which files to change / add, which existing mechanisms to reuse, whether to add a new dependency (if so, explain why). **Don't write code before I approve.**" |
| 4. Implement | Go along with what exists | "Approved. Implement strictly by the existing directory structure, naming, and style, reusing the shared modules you just found. **Don't introduce new abstractions of your own.**" |
| 5. Verify | Self-check, and you check | "Self-check against the existing approaches you just referenced: any reinvented wheels, anything that breaks the overall design, anything that bypasses the shared modules?" Then **read the diff and run the tests yourself** (Chapter 27). |

> **Key point:** the most important part of the whole flow is **the "plan gate" at step 3**: look at what it's going to do before it acts. Many tools build in a "plan mode" (Chapter 27, Appendix C) that can force this step for you; **check the official docs for the exact switch.** Building the habit of "see the plan first, then allow it through" matters more than remembering any command.

## 3. The project-rules file: a starter you can copy

The "rules" that step 2 produces are best landed as a **rules file** in the project, so the tool reads it automatically every time it starts work (Claude Code tends to use `CLAUDE.md`, Codex has its own equivalent; **check the official docs for the exact file name and location**, see Appendix C).

> **Key point (product-layer memory, echoing Chapters 3 and 13):** the reason this file "makes it remember the project's rules" is **not that the model itself grew a memory**; it's that **the product re-injects it into the context every time it starts work** and feeds it to the model. So: **what's written in the file is what it "remembers"; what isn't, it "doesn't remember."** The more specific the rules, the steadier it is.

Here's a general starter; replace the `<...>` with your project's real details:

```markdown
# Project rules / AI collaboration rules

## Most important principles (must follow)
- Go along with the existing implementation and design, don't bring in your own style.
- Before introducing any new mechanism (library / abstraction / layer), check whether something similar already exists.
  - If it does, reuse it; if it doesn't or it's not enough, explain the reason and the alternative before acting, and wait for my approval.
- No changes that break the overall architecture (the layering, the direction of dependencies, the naming rules).

## Implementation process (required)
1. First investigate the relevant existing implementations, shared modules, and similar features, and list the reference locations (paths).
2. Give an implementation plan (which files to change / add, what to reuse, whether to add a new dependency and why).
3. Implement only after I approve. Don't write code before approval.
4. Get the existing checks / formatting / tests to pass.

## Tech stack and versions
- Language / framework / main libraries: <e.g. TypeScript 5 / React 18 / Vite>

## Directory structure and responsibilities
- <e.g.> components/: UI  hooks/: logic  services/: API communication  utils/: shared functions
- Dependency direction: <e.g.> UI -> hooks -> services, one way, no reverse or cross-layer.

## Shared mechanisms that must be reused (no rebuilding)
- Network requests: use <e.g. services/apiClient> (no writing fetch directly all over the place)
- Error handling: use <e.g. AppError / errorHandler>
- Logging: use <e.g. logger> (no direct console.log)

## Forbidden
- Adding a third-party dependency on your own
- Reinventing your own wheel that bypasses the existing shared mechanisms
- Cross-layer dependency violations (e.g. the UI layer touching the database / API details directly)
```

## 4. A few tricks for making it actually work

| Trick | How to do it |
| --- | --- |
| Rules use proper nouns | "Write it cleaner" is useless; pinning down the **module names, file paths, and forbidden items** as proper nouns is what works. |
| Keep explore, plan, and implement separate | Don't try to do everything in one sentence. Running **the investigation and the "plan approval" gate** as their own round is the biggest trick. |
| Small steps, fast | Having it change a huge chunk at once is the easiest way to go off track. **Break it small, review every small step.** |
| Grow the rules | When you find it going off track, add the matching rule to the rules file, share it with the team, and keep updating. It **gets better the more you use it.** |
| A human looks at the end, always | Even with a Harness it can go off track. **Be sure to review the diff yourself from the angle of "does this fit the existing approach"** (Chapter 27). |
| Don't over-abstract | Overdoing "reuse" breeds unnecessary wrapping. **Stay at the same grain as the existing code** and you're fine. |

## 5. A pre-release checklist (the part most worth running through)

Keep these two checklists at hand. Run the first one **before you feed anything in**, and the second **before you actually use / commit its output.**

### Before feeding content to the AI

- Does the content you're about to feed contain **confidential code, production data, or personal privacy**? (If so, scrub it first, or just don't feed it. See Chapter 37.)
- Did any **API keys, passwords, or connection details** slip in? (Keys must never be fed. See Chapter 40.)
- Is the **service and plan** you're using one your company / situation allows?
- Did you spell out the **premises** (language, framework, version)?
- Did you give enough **context** (the relevant code, logs, expected behavior)?

### Before committing / adopting its output

- Did you **read the diff line by line and understand it before reviewing**? (Chapter 27.) **Don't use code you can't understand.**
- Do the automatic / manual **tests pass**, and did anything that used to work break (a regression)?
- Did you look at it once from a **security angle** (input validation, permissions, injection risk)?
- For the new **dependency** added, are the license and source trustworthy?
- Do the **function names / APIs / config fields it gave actually exist**? (Check them against the official docs; it will make things up with a straight face, see Chapter 9.)
- Did you double-check the **important facts, numbers, and quotes** yourself? (Chapters 9, 15, and 39.)

## 6. When a team needs to set rules (for whoever leads)

One person working solo runs on habit; a group working together runs on **written rules.** If you lead a team, pin down at least these six things:

1. **Draw the line:** which data may be fed to the AI and which absolutely may not, written down in black and white.
2. **Limit the tools:** which services and plans are allowed and which external sources may be connected (echoing the MCP security in Appendix C).
3. **Set the approval flow:** for AI-generated code, what the review -> merge -> deploy approval flow is.
4. **Manage the keys:** how keys are stored, who can touch them, and **how to rotate and revoke them if one leaks** (Chapter 40).
5. **Build shared assets:** organize the project-rules file and the common prompt templates (Appendix B) for the team to share.
6. **Build the mechanism:** hold regular share-outs, set up a place for questions, and review the rules on a schedule. The AI keeps changing, so the rules have to keep up.

## Summary

- **The Harness = putting the harness of "understand -> rules -> plan -> implement -> verify" on the AI**, so it works along with what you already have instead of starting over. Both Claude Code and Codex apply.
- Landing it is the **five-step workflow**, in which the **"plan gate" (see the plan before acting) is the linchpin.**
- Write the rules into the **project-rules file**, and remember that it's **product-layer memory** (re-fed in each time); the more specific you write it, the steadier it is.
- Two **checklists** guard both ends: don't leak before you feed, and understand before you use. **Don't use code you can't understand, and double-check the important facts yourself.**
- A product's specs, prices, and data terms all change, so **for the latest, go by the official docs and your own (company) AI usage rules.**
