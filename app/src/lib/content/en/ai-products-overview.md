"Which AI should I use?" gets easier once you name the job: reading a lease, practicing a language, editing a photo, or organizing a folder. Different jobs need different capabilities, and the right choice also depends on whether you can check the result and fit it into the way you actually work.

This chapter gives you a snapshot of the main products as of October 2026, plus a method for comparing them. The snapshot will change within months; the method keeps working.

## 1. You're choosing a whole product experience

A product includes its interface, models, file handling, tools, storage, permissions and price. A strong model with an awkward export format can still be a poor fit for a document job. A convenient assistant is no use if it can't reach the sources you need or handles your data in a way that doesn't suit you.

Before opening an app, write down what success looks like: "I need a one-page comparison I can edit and share, with page references for every point." That's far more useful than "I need the smartest AI."

## 2. The main products at a glance (as of October 2026)

| Product | Made by | What it is |
| --- | --- | --- |
| ChatGPT | OpenAI | General assistant |
| Claude | Anthropic | General assistant; Claude is also a model-family name |
| Gemini | Google | General assistant; Gemini is also a model-family name |
| DeepSeek, Qwen, Kimi, Doubao | DeepSeek, Alibaba, Moonshot AI, ByteDance | General assistants widely used by Chinese speakers |
| Codex, Claude Code, Antigravity CLI | OpenAI, Anthropic, Google | Coding agents that work with project files and commands (Part 4) |
| Dedicated image, video, voice and document tools | Various | Focused on particular inputs or deliverables |
| Assistants built into office or business software | Various | AI inside a workflow you already use |

On price: ChatGPT, Claude and Gemini all have free versions. At US prices in October 2026, each company's main paid personal plan (ChatGPT Plus, Claude Pro, Google AI Pro) costs around $20 a month, and plans for heavy users start at around $100 a month; Appendix E lists the exact prices for each plan. Prices and taxes differ in other regions.

As of October 2026, here's how the coding agents relate to the plans:

- Codex is included in every ChatGPT plan from Free to Enterprise; if you sign in with an API key instead, it's billed at API prices (Chapter 17).
- Claude Code needs a Pro, Max, Team or Enterprise plan or a developer platform (Console) account; the free plan doesn't include it.
- The official Gemini CLI repository says free users and Google AI Pro/Ultra users moved to Antigravity CLI on June 18, 2026. It also says Gemini CLI isn't tuned for the Gemini 4 series and recommends Antigravity CLI for coding with those models. Before following an older Gemini CLI tutorial, check which route your account uses.

Which models each company currently promotes, how long their context windows are and what the API costs change fastest, so they're collected in Appendix E (Numbers at a glance).

The categories in the table describe what a product is for, not what it promises to do. A company's command-line coding tool and its chat app are different products, and a capability in developer documentation doesn't mean every consumer account has it.

## 3. How to choose by "task": ask yourself three questions

First, what goes in and what must come out? "Multimodal" means working with more than one type of information, but support has to be checked separately for each direction.

| Your task | A useful trial |
| --- | --- |
| Read a scanned contract | Check whether it reads the scan and tables, then ask for a clause with its page number |
| Prepare an image | Test creating an image, editing a specified area, keeping text legible and exporting the required size |
| Practice conversation | Test spoken input, spoken output, interruption and latency in your language |
| Research a recent change | Ask for dated primary sources, open them and check whether they support the conclusion |
| Work with a spreadsheet | Check formulas, units and the exported file; a nice-looking chat table is not an editable workbook |
| Complete a task across applications | Check the connected tools, action permissions, progress evidence and stop controls |

Reading video, producing video and transcribing audio are three separate capabilities. Test the exact operation you need.

Second, where does your work already live? A good integration saves a lot of copying and pasting. Check whether it can reach the relevant folder and whether it can only read or can also make changes. Computer use, where an assistant looks at the screen and clicks, is a different mechanism from a direct integration with a service (Chapter 19).

Third, which constraints matter most? Budget, time, accessibility, language, where your data is stored, and whether you need occasional help or repeated automation. Check the limits and billing on the route you'll actually use (Chapter 38).

## 4. The most important lesson: how to check for yourself "what it can do right now"

Start with official help pages, release notes and plan descriptions to see the documented scope. Then try it in your own account: a feature may depend on region, a staged rollout, organization policy or a particular mode.

Keep a small evidence card while you test:

```text
Task and success condition:
Product, visible model/mode, plan and date:
Relevant documentation:
What worked in my account:
What failed or remained unverified:
Time, cost and corrections needed:
```

> **Key point:** Official documentation describes what's meant to be available; a hands-on test shows what works in your setup. Neither a launch announcement nor one successful demo proves reliable performance on every task.

## 5. Don't judge a product by a "single experience"

Give two candidates the same material and requirements: a routine case, a harder case and a case with missing information. Compare factual accuracy, whether the output is usable as is, source quality and how much work it takes to fix mistakes. Repeat the important cases to see whether success is consistent.

A failure may come from retrieval, file parsing, permissions, a service outage or the model itself. You don't need to blame yourself or keep rewriting prompts forever. If a product keeps failing a task you need, that's a reason to pick another.

## 6. So should you ignore "model strength" entirely?

No. Hard reasoning, specialist vocabulary and fine-grained image understanding can show real differences. Test with tasks close to your own work whose results you can check. A benchmark measures a set of tasks under particular conditions; it says nothing about your usability, price or integration needs.

For small everyday tasks, the differences between mainstream products are sometimes hard to notice. Whether one is good enough depends on your task and on what a mistake would cost: a quick personal draft and a contract comparison for a client call for very different standards.

## 7. Common misconceptions, cleared up

| Misconception | What to check instead |
| --- | --- |
| It accepts images, so it can edit images | Input and output capabilities separately |
| The announcement means I have the feature | Your plan, account, mode and availability |
| An agent label guarantees completed work | Actual tool results and a verifiable deliverable |
| A high score guarantees a useful workflow | Your sources, export needs, time and correction effort |

## Summary

Choose with a small real task: write down the input, output and acceptance criteria, check the documented scope, test in your own account, and compare the result and the effort needed to use it. The main paid personal plans mostly cost around $20 a month, and each coding agent comes with different plans; for model and price figures, see Appendix E. Next, we look at what changes when an assistant starts taking actions.

## Sources and version notes

Checked October 29, 2026. Prices are US prices.

- [Codex pricing](https://learn.chatgpt.com/docs/pricing): ChatGPT plan prices, which plans include Codex, and API-key billing.
- [Claude pricing](https://claude.com/pricing): prices for Free, Pro, Max and other plans.
- [Google AI subscriptions](https://gemini.google/subscriptions/): prices for Google AI Pro and other plans.
- [Claude Code setup and account requirements](https://code.claude.com/docs/en/setup): requires a Pro, Max, Team, Enterprise or Console account; the free plan doesn't include it.
- [Gemini CLI repository notes](https://github.com/google-gemini/gemini-cli/blob/b8fa817155731c783d47dc6eaeee63163c0ec723/README.md): the June 18, 2026 move to Antigravity CLI and the lack of tuning for the Gemini 4 series.
- [Codex](https://github.com/openai/codex/blob/86e17e98c7f901277aeeb4649cf1b01462b082f2/README.md) · [Claude Code](https://github.com/anthropics/claude-code/blob/5ed799e5cc56bea9efff57398ca43e31d82784ff/README.md): official repositories of the two coding agents (snapshots from October 22, 2026).

---

## Quiz

1. **[Basic · Concept]** You need a contract comparison you can check. What is the most useful success condition? <!-- quiz: q01 revision: 2 -->
   - A. It is produced with the model now rated the strongest
   - B. It lists clauses with pages and exports as an editable file
   - C. It is well structured, with a confident, professional tone
   - D. It is as detailed and long as possible, the longer the better
   > **Answer: B.** The condition describes the deliverable and how to verify it. A strong model (A) does not make the result checkable, and neither tone (C) nor length (D) shows the content is right.

2. **[Basic · Concept]** A product can read uploaded images. What follows? <!-- quiz: q02 revision: 2 -->
   - A. It can also edit and generate images on request
   - B. It can read video too, since video is a series of images
   - C. It never misreads the text inside an image
   - D. It accepts image input; output and editing need checks
   > **Answer: D.** “Multimodal” does not promise every combination of input and output. Reading images, editing them, generating them and reading video are separate capabilities (A, B) to test individually, and reading can still go wrong (C).

3. **[Basic · Misconception]** An official announcement describes a new capability. What should you do before relying on it? <!-- quiz: q03 revision: 3 -->
   - A. Read the stated conditions and test it in your own account
   - B. Upgrade to the top plan first so the feature is sure to be on
   - C. Ask the assistant itself whether it supports the new feature
   - D. Wait a month and start relying on it once it has settled down
   > **Answer: A.** Features can roll out gradually or depend on region, plan and organization settings, so availability and real performance must be checked in your own account. B costs money without guaranteeing access, since region and organization settings can still block it; C relies on the assistant's self-report, and it may not know what the product has enabled for your account; D only waits, and no amount of waiting replaces an actual test.

4. **[Intermediate · Scenario]** How should you compare two research assistants? <!-- quiz: q04 revision: 2 -->
   - A. Count the links and trust the one that gives more
   - B. Ask each what it is good at and compare the answers
   - C. Give both the same task; check claims against sources
   - D. Pick whichever answer is longer and sounds more expert
   > **Answer: C.** A link is useful only when it leads to evidence supporting the claim, so open it and check. Link count (A), self-assessment (B) and length (D) cannot replace that check.

5. **[Basic · Scenario]** An assistant can view your spreadsheet. What else matters before asking it to update the file? <!-- quiz: q05 revision: 2 -->
   - A. Whether it has write access and returns a usable file
   - B. Nothing; if it can view the file, it can surely edit it
   - C. Whether the table shown in the chat is neatly formatted
   - D. Whether its analysis of your data is detailed enough
   > **Answer: A.** Reading a file and changing it are distinct capabilities and may need different permissions; B mixes the two up. A neat table in the chat (C) is not an editable workbook, and a detailed analysis (D) does not show it can deliver a correct file.

6. **[Intermediate · Observation]** One candidate is fast but needs many corrections; another is slower but usually usable. What should the comparison include? <!-- quiz: q06 revision: 2 -->
   - A. First-reply speed, since waiting hurts the experience most
   - B. Subscription price, since the cheaper one saves more overall
   - C. Benchmark scores, since a higher score means less rework
   - D. Total time, correctness, cost and the correction effort
   > **Answer: D.** What matters is the total cost of reaching a usable result. First-reply speed (A), subscription price (B) or a score (C) alone miss the time and money spent on repeated corrections.
