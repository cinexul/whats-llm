A long AI task can consume money, an included usage allowance, execution time, and context capacity. These are connected, but they are **not the same meter**. Before trying to save, identify what your account is actually being charged or limited for.

## 1. Identify the billing path first

| Path | What you usually pay for | What to check |
| --- | --- | --- |
| Consumer or team subscription | A recurring plan with included use under its rules | Available allowance, reset window, and plan-specific restrictions |
| API account | Metered requests, commonly including input/output tokens | Model prices, cached-input prices, tool charges, and actual usage |
| Optional extras | Credits, paid modes, connected services, or infrastructure | Whether enabled, which account pays, and any spending cap |
| Local model | Your hardware or rented compute and electricity | Hardware capacity, runtime, and separate external services |

Using more of a subscription’s allowance does not necessarily create a new per-token charge. Buying a chat subscription also does not automatically pay for API requests. The same coding tool may support both subscription sign-in and API authentication, so check the **active account path**, not just the product name.

An alert is not always a hard spending limit. Check whether a budget setting merely notifies you, blocks new requests, or controls only one project. Do not enable paid overflow or extra credits without understanding how they are charged.

## 2. Understand token costs without overgeneralizing

For a text API, a simplified calculation is:

```text
cost = uncached input tokens × input rate
     + cached input tokens × cached-input rate
     + output tokens × output rate
     + applicable tool or other charges
```

Use the same unit throughout. If prices are quoted per million tokens, divide each token count by one million. Some APIs have additional categories such as cache writes, media processing, or billed reasoning tokens; use the provider’s actual usage fields and pricing rules.

Here is an **invented example for arithmetic, not a current provider price**. Assume input costs $2 per million tokens, cached input $0.20, and output $10. A request with 20,000 uncached input tokens, 10,000 cached input tokens, and 1,000 output tokens costs:

```text
20,000 / 1,000,000 × $2    = $0.040
10,000 / 1,000,000 × $0.20 = $0.002
 1,000 / 1,000,000 × $10   = $0.010
Total                    = $0.052
```

An agent task can make many such requests and tool calls. Its final message is not a reliable measure of the total work. A short visible answer can follow substantial searching, intermediate output, or delegated work.

## 3. Context is selected, cached, and sometimes summarized

The model needs relevant context for each response. That context can include instructions, previous messages, file excerpts, tool results, and retained notes. **Do not assume every product always sends the entire conversation unchanged.** Applications can select history, retrieve relevant material, compact earlier turns, or store state on the server.

Prompt caching can reduce the cost or processing time of eligible repeated input; it does not erase that material’s role in the model’s context. A summary can shorten context but lose a critical detail. Starting a new chat may remove distraction, yet it may require re-reading files or lose cache reuse.

More context is not inherently worse. Relevant evidence can improve a difficult answer; irrelevant or conflicting material can obscure requirements. Long inputs often require more processing, but latency also depends on model, reasoning effort, tools, network, and service load. “Slow” does not by itself diagnose an overfull conversation.

## 4. Tell four different limits apart

| Limit | What it constrains | Useful response |
| --- | --- | --- |
| Usage allowance / quota | Use over a plan-defined period | Check remaining allowance and its reset rules |
| Rate limit | Requests or tokens over a short interval | Reduce concurrency and retry after the indicated delay |
| Context window | Material the model can process in one request | Retrieve selectively, summarize, or split the task while preserving requirements |
| Spending or credit limit | What an account may spend or its remaining balance | Inspect billing settings and actual usage before increasing it |

A new conversation does not reset your subscription quota. Paying more does not necessarily remove a context limit. Retrying immediately many times can worsen rate limiting. Read the actual error rather than treating every limit as “the AI ran out of memory.”

## 5. Control cost while preserving the evidence

Start by defining a clear deliverable and acceptance criteria. Ask the agent to locate relevant files before reading entire directories. Keep essential requirements, decisions, and source references visible; trim duplicated logs and obsolete trials.

Use a smaller or faster model when the task allows it, and more reasoning when the problem warrants it. Keep output length useful. Parallel agents and repeated retries can increase total usage even when the wall-clock task finishes sooner.

When a task stalls, inspect one failing command or assumption before asking for another full attempt. A focused repair is often cheaper and more reliable than several broad reruns. For a new session, bring a short handoff with the goal, current state, verified facts, and unresolved issue.

Compare results using the account’s usage records and a quality check. A single faster response is not proof of lower cost or better accuracy, especially if caching, model, or service load changed. The goal is **useful completed work per unit of spending or allowance**, not the fewest possible tokens at any cost.

## Sources and version notes

Checked **2026-10-22**: [Codex’s official sign-in guidance](https://github.com/openai/codex/blob/main/README.md) distinguishes ChatGPT-plan use from API-key use; [Claude Code’s official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), observed at **2.1.308**, documents subscription usage limits, optional usage credits, prompt-cache behavior, and compaction. For actual rates and account rules, use [OpenAI API pricing](https://openai.com/api/pricing/), [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing), and the active account’s usage screen. This chapter intentionally quotes no live unit prices or plan quotas; the numerical example is hypothetical.

---

## Quiz

1. **[Basic · Concept]** Which statement about AI cost is accurate? <!-- quiz: q01 revision: 1 -->
   - A. Every product charges a separate fee for every token
   - B. A subscription includes every API request automatically
   - C. Subscription allowances, API billing, and optional extras need to be checked separately
   - D. Tokens never affect subscription allowances
   > **Answer: C.** Different account paths have different charging and limiting rules. More use can consume an allowance without creating a separate per-token invoice.

2. **[Basic · Calculation]** In the invented example, what is the total of $0.040 input, $0.002 cached input, and $0.010 output? <!-- quiz: q02 revision: 1 -->
   - A. $0.052
   - B. $0.52
   - C. $5.20
   - D. $0.042
   > **Answer: A.** Add the three categories. Keep token units consistent and add any applicable tool charges in a real bill.

3. **[Advanced · Misconception]** “Every product always resends the entire chat unchanged and bills it at the full input rate.” Why is this unreliable? <!-- quiz: q03 revision: 1 -->
   - A. Previous context never matters
   - B. Every chat is free
   - C. Only output tokens count
   - D. History selection, compaction, server-side state, and caching can change processing and charges
   > **Answer: D.** The application controls the active context and the provider sets billing rules. The entire visible transcript is not a universal billing formula.

4. **[Basic · Scenario]** You hit a subscription usage limit. Will a new chat reset it? <!-- quiz: q04 revision: 1 -->
   - A. Yes, always
   - B. No; check the account’s allowance and reset rules
   - C. Only if you delete the old chat
   - D. Only if you shorten the next question
   > **Answer: B.** A conversation’s context and an account’s usage allowance are different limits.

5. **[Advanced · Scenario]** A request slows down. Which response is most useful? <!-- quiz: q05 revision: 1 -->
   - A. Delete all relevant evidence immediately
   - B. Assume the context is always the cause
   - C. Inspect context size, model settings, tool activity, and service conditions
   - D. Upgrade without inspecting anything
   > **Answer: C.** Several layers can affect latency. Preserve necessary evidence and investigate the actual source of delay.

6. **[Basic · Hands-on]** Before your next task, record the active account path, the relevant usage limit, and whether optional paid extras are enabled. After the task, compare usage with the quality of the result. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** A useful budget starts with the meter you actually use. Saving duplicated work is valuable; cutting evidence that prevents mistakes can make the whole task more expensive.
