A long AI task can consume money, an included usage allowance, execution time, and context capacity. These are connected, but they are **not the same meter**. Before trying to save, identify what your account is actually being charged or limited for.

## 1. Identify the billing path first

| Path | What you usually pay for | What to check |
| --- | --- | --- |
| Consumer or team subscription | A recurring plan with included use under its rules | Available allowance, reset window, and plan-specific restrictions |
| API account | Metered requests, commonly including input/output tokens | Model prices, cached-input prices, tool charges, and actual usage |
| Optional extras | Credits, paid modes, connected services, or infrastructure | Whether enabled, which account pays, and any spending cap |
| Local model | Your hardware or rented compute and electricity | Hardware capacity, runtime, and separate external services |

Using more of a subscription’s allowance does not necessarily create a new per-token charge. Buying a chat subscription also does not automatically pay for API requests. The same coding tool may support both subscription sign-in and API authentication, so check the **active account path**, not just the product name.

A budget alert is not always a hard limit. On some API platforms, spend alerts only send a notification and requests keep going; a hard cap has to be switched on separately, and because enforcement can lag slightly, actual spend may end up a little over the set amount. For example, as of October 2026, spend alerts on the OpenAI API platform only notify, and "Enforce a hard limit" is a separate setting; Anthropic's Claude Console stops requests once you reach a spend limit you set.

A safer approach: where the platform supports it, use prepaid credit, which you top up first and which stops when it runs out, and turn auto-reload off. As of October 2026, the OpenAI and Anthropic API consoles both use prepaid credits and both offer an auto-reload switch; it may already be on once you add a payment method, so check. The exact options and defaults are whatever the official console shows. Do not enable paid overflow or extra credits without understanding how they are charged.

> **Key point:** A budget alert is an alarm clock, not necessarily a brake. If you want a real brake, use prepaid credit with auto-reload off, and check whether a hard limit is actually switched on.

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

Use a smaller or faster model when the task allows it, and raise the reasoning effort when the problem warrants it. Keep output length useful. Parallel agents and repeated retries can increase total usage even when the wall-clock task finishes sooner.

When a task stalls, inspect one failing command or assumption before asking for another full attempt. A focused repair is often cheaper and more reliable than several broad reruns. For a new session, bring a short handoff with the goal, current state, verified facts, and unresolved issue.

Compare results using the account’s usage records and a quality check. A single faster response is not proof of lower cost or better accuracy, especially if caching, model, or service load changed. The goal is **useful completed work per unit of spending or allowance**, not the fewest possible tokens at any cost.

## Sources and version notes

Checked **2026-10-22**; spend limits, prepaid credit, and auto-reload rechecked on 2026-10-27. [Codex’s official sign-in guidance](https://github.com/openai/codex/blob/main/README.md) distinguishes ChatGPT-plan use from API-key use; [Claude Code’s official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), observed at **2.1.308**, documents subscription usage limits, optional usage credits, prompt-cache behavior, and compaction. [OpenAI's spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits) explains that spend alerts only notify, that a hard limit must be enabled separately, and that enforcement can lag slightly; [Claude API limits documentation](https://platform.claude.com/docs/en/api/rate-limits) explains that an organization can set its own spend limit and that requests stop when it is reached; [Claude API payment guidance](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-api-usage) covers prepaid credits and the auto-reload switch. For actual rates and account rules, use [OpenAI API pricing](https://openai.com/api/pricing/), [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing), and the active account’s usage screen. This chapter intentionally quotes no live unit prices or plan quotas; the numerical example is hypothetical.

---

## Quiz

1. **[Basic · Concept]** Which statement about AI cost is accurate? <!-- quiz: q01 revision: 2 -->
   - A. Every AI product charges a separate fee for each token
   - B. A chat subscription also covers your API requests
   - C. Subscriptions, API billing, and extras each need checking
   - D. On a subscription, token usage never affects the allowance
   > **Answer: C.** Different account paths have different charging and limiting rules. Heavy use on a subscription consumes the allowance (so D is wrong) without necessarily creating a separate per-token bill (so A is wrong), and a chat subscription does not automatically include API requests (B).

2. **[Basic · Calculation]** In the invented example, what is the total of $0.040 input, $0.002 cached input, and $0.010 output? <!-- quiz: q02 revision: 2 -->
   - A. $0.052
   - B. $0.52
   - C. $5.20
   - D. $0.0052
   > **Answer: A.** Add the three: 0.040 + 0.002 + 0.010 = $0.052. B, C, and D put the decimal point in the wrong place. Keep token units consistent and add any applicable tool charges in a real bill.

3. **[Advanced · Misconception]** “Every product always resends the entire chat unchanged and bills it at the full input rate.” Why is this unreliable? <!-- quiz: q03 revision: 2 -->
   - A. Because earlier messages never affect the final answer
   - B. Because chat products are entirely free for every user
   - C. Because only output tokens are ever charged
   - D. Selection, compaction, and caching change the costs
   > **Answer: D.** The application controls the active context and the provider sets billing rules; server-side state and other factors affect processing too. The entire visible transcript is not a universal billing formula. Earlier messages can matter (A), chat products are not all free (B), and input is usually charged too (C).

4. **[Basic · Scenario]** You hit a subscription usage limit. Will a new chat reset it? <!-- quiz: q04 revision: 2 -->
   - A. Yes; a new chat starts counting the allowance again
   - B. No; check the account's allowance and reset rules
   - C. Only after you delete the old chat and get usage back
   - D. Only if you keep the next question short enough
   > **Answer: B.** A conversation’s context and an account’s usage allowance are different limits. A new chat (A) or deleting old chats (C) does not give back used allowance, and shorter questions (D) only reduce future use.

5. **[Advanced · Scenario]** A request slows down. Which response is most useful? <!-- quiz: q05 revision: 2 -->
   - A. Delete all history and evidence and start over
   - B. Compress the context first; length must be the cause
   - C. Check context, model settings, tools, and service
   - D. Upgrade right away; a pricier plan is always faster
   > **Answer: C.** Several layers can affect latency, so find the actual cause. B fixes on one cause, A deletes the evidence that prevents mistakes, and D spends money before investigating.

6. **[Basic · Hands-on]** Before your next task, record the active account path, the relevant usage limit, whether optional paid extras are enabled, and whether auto-reload is on. After the task, compare usage with the quality of the result. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** A useful budget starts with the meter you actually use. Saving duplicated work is valuable; cutting evidence that prevents mistakes can make the whole task more expensive.
