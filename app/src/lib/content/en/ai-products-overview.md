“Which AI should I use?” becomes easier when you name the job: reading a lease, practicing a language, editing a photo, or organizing a folder. These tasks need different capabilities, and the best choice depends on whether you can verify the result and use it in your own workflow.

This chapter gives you a way to compare products without memorizing a ranking that soon changes.

## 1. First, get this clear: you're not choosing a "model," you're choosing a "product experience"

The product includes its interface, models, file handling, tools, storage, permissions and pricing. A strong model with an awkward export format may be a poor fit for a document job. A convenient assistant may still be unsuitable if it cannot access the necessary sources or handle your data appropriately.

Define success before opening the app: “I need a one-page comparison, with page references, that I can edit and share.” This is much more useful than “I need the smartest AI.”

## 2. Roughly where the mainstream products sit (only the stable ownership; check the official docs for abilities)

| Examples | What to recognize | What to check for your task |
| --- | --- | --- |
| ChatGPT — OpenAI; Claude — Anthropic; Gemini — Google | General assistant products; Claude and Gemini are also model-family names | Available modes, files, tools, limits and account settings |
| Codex, Claude Code, Gemini CLI / Antigravity CLI | Examples of coding tools that can work with project files and tools | Supported environment, permissions, authentication and billing |
| Dedicated image, video, voice and document tools | Products focused on particular inputs or deliverables | Editing control, export format, quality and usage terms |
| Assistants embedded in office or business software | AI accessible inside a workflow you already use | Which files or records it can read, and which actions it can perform |

**A concrete dated change:** the Gemini CLI repository states that unpaid-tier and Google One users were moved to Antigravity CLI on June 18, 2026. As of October 2026, it also says Gemini CLI is not optimized for the latest Gemini models and recommends Antigravity CLI for coding with them. This is the scope stated in that repository, not a claim that every Gemini CLI user was migrated. Check your account’s supported route before following an older Gemini CLI tutorial.

A category is not a capability promise. A command-line coding tool is also different from the same provider's chat app. A capability documented in a developer SDK is not proof that every consumer account has it.

## 3. How to choose by "task": ask yourself three questions

**First, what goes in and what must come out?** “Multimodal” means working with more than one type of information, but support is specific to each direction.

| Your task | A useful trial |
| --- | --- |
| Read a scanned contract | Check whether it reads the scan and tables, then ask for a clause with its page number |
| Prepare an image | Test creating an image, editing a specified area, keeping text legible and exporting the required size |
| Practice conversation | Test spoken input, spoken output, interruption and latency in your language |
| Research a recent change | Ask for dated primary sources, open them and check whether they support the conclusion |
| Work with a spreadsheet | Check formulas, units and the exported file; a nice-looking chat table is not an editable workbook |
| Complete a task across applications | Check the connected tools, action permissions, progress evidence and stop controls |

Reading video, producing video and transcribing audio are separate capabilities. Test the exact operation you need.

**Second, where is your work already stored?** A useful integration may save repeated copying. Check whether it can access the relevant folder and whether access is read-only or allows changes. Computer use, where an assistant looks at a screen and clicks, is a different mechanism from a direct integration with a service.

**Third, what constraints matter?** Include budget, time, accessibility, language, data location and whether you need occasional help or repeated automation. Check quotas and billing for the route you will actually use.

## 4. The most important lesson: how to check for yourself "what it can do right now"

Use official help, release notes and plan descriptions to find the documented scope. Then check your own account: a feature may depend on region, rollout, organization policy or a particular mode.

Record a small evidence card:

```text
Task and success condition:
Product, visible model/mode, plan and date:
Relevant documentation:
What worked in my account:
What failed or remained unverified:
Time, cost and corrections needed:
```

> **Key point:** Official documentation describes intended availability; a hands-on test establishes what worked in your setup. Neither a launch announcement nor one successful demo proves reliable performance on every task.

## 5. Don't judge a product by a "single experience"

Give two candidates the same source material and requirements. Include a routine case, a difficult case and a case with missing information. Compare factual accuracy, useful output, source quality and the work needed to fix mistakes. Repeat important cases to see whether success is consistent.

A failure may come from retrieval, a file parser, permissions, a service problem or the model. You do not need to blame yourself or keep rewriting prompts indefinitely. If a product repeatedly fails a task you need, that is a reason to choose another.

## 6. So should you ignore "model strength" entirely?

No. Difficult reasoning, specialist vocabulary and precise image understanding can expose meaningful differences. Use tests that resemble your work and have an answer you can check. A benchmark measures selected tasks under selected conditions; it does not include all your usability, price or integration requirements.

For small everyday tasks, the differences between mainstream products are sometimes hard to notice. Whether one is good enough depends on your task and on what a mistake would cost: a quick personal draft and a contract comparison for a client call for very different standards.

## 7. Common misconceptions, cleared up

| Misconception | What to check instead |
| --- | --- |
| It accepts images, so it can edit images | Input and output capabilities separately |
| The announcement means I have the feature | Your plan, account, mode and availability |
| An agent label guarantees completed work | Actual tool results and a verifiable deliverable |
| A high score guarantees a useful workflow | Your sources, export needs, time and correction effort |

## Summary

Choose with a small real task: specify the input, output and acceptance criteria; check documented availability; test your account; compare the result and the effort needed to use it. Next, we look at what changes when an assistant starts taking actions.

---

**Verification scope — October 22, 2026 (Gemini CLI notes rechecked October 27, 2026):** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[Codex](https://github.com/openai/codex/blob/86e17e98c7f901277aeeb4649cf1b01462b082f2/README.md) · [Claude Code](https://github.com/anthropics/claude-code/blob/5ed799e5cc56bea9efff57398ca43e31d82784ff/README.md) · [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/09d81bf116b6f0ef084731dc996aa9d56438bb70/README.md)

---

## Quiz

1. **[Basic · Concept]** You need a contract comparison you can check. What is the most useful success condition? <!-- quiz: q01 revision: 1 -->
   - A. It is produced with the model now rated the strongest
   - B. It lists clauses with pages and exports as an editable file
   - C. It is well structured, with a confident, professional tone
   - D. It is as detailed and long as possible, the longer the better
   > **Answer: B.** The condition describes the deliverable and how to verify it. A strong model (A) does not make the result checkable, and neither tone (C) nor length (D) shows the content is right.

2. **[Basic · Concept]** A product can read uploaded images. What follows? <!-- quiz: q02 revision: 1 -->
   - A. It can also edit and generate images on request
   - B. It can read video too, since video is a series of images
   - C. It never misreads the text inside an image
   - D. It accepts image input; output and editing need checks
   > **Answer: D.** “Multimodal” does not promise every combination of input and output. Reading images, editing them, generating them and reading video are separate capabilities (A, B) to test individually, and reading can still go wrong (C).

3. **[Basic · Misconception]** An official announcement describes a new capability. What should you do before relying on it? <!-- quiz: q03 revision: 1 -->
   - A. Read the stated conditions and test it in your own account
   - B. Assume every account has it, since the announcement is official
   - C. Assume paid plans have it and just follow the tutorial
   - D. Assume it is reliable because the demo video worked
   > **Answer: A.** Features can roll out gradually or depend on region, plan and organization settings, so availability and real performance must be checked separately. B and C read the announcement as a promise to every account; one demo (D) does not prove reliability.

4. **[Intermediate · Scenario]** How should you compare two research assistants? <!-- quiz: q04 revision: 1 -->
   - A. Count the links and trust the one that gives more
   - B. Ask each what it is good at and compare the answers
   - C. Give both the same task; check claims against sources
   - D. Pick whichever answer is longer and sounds more expert
   > **Answer: C.** A link is useful only when it leads to evidence supporting the claim, so open it and check. Link count (A), self-assessment (B) and length (D) cannot replace that check.

5. **[Basic · Scenario]** An assistant can view your spreadsheet. What else matters before asking it to update the file? <!-- quiz: q05 revision: 1 -->
   - A. Whether it has write access and returns a usable file
   - B. Nothing; if it can view the file, it can surely edit it
   - C. Whether the table shown in the chat is neatly formatted
   - D. Whether its analysis of your data is detailed enough
   > **Answer: A.** Reading a file and changing it are distinct capabilities and may need different permissions; B mixes the two up. A neat table in the chat (C) is not an editable workbook, and a detailed analysis (D) does not show it can deliver a correct file.

6. **[Intermediate · Observation]** One candidate is fast but needs many corrections; another is slower but usually usable. What should the comparison include? <!-- quiz: q06 revision: 1 -->
   - A. First-reply speed, since waiting hurts the experience most
   - B. Subscription price, since the cheaper one saves more overall
   - C. Benchmark scores, since a higher score means less rework
   - D. Total time, correctness, cost and the correction effort
   > **Answer: D.** What matters is the total cost of reaching a usable result. First-reply speed (A), subscription price (B) or a score (C) alone miss the time and money spent on repeated corrections.
