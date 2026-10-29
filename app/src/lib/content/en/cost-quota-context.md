A long task can consume several things: money, a plan's included allowance, execution time, and context capacity. They are connected, but they are **not the same meter**. Before trying to save, find out what your account is actually charged for and limited by. Whenever another chapter of this book mentions costs and limits, this is the chapter it means; current prices and context window sizes for the major models are collected in Appendix E (Numbers at a glance).

## 1. Identify the billing path first

| Path | What you usually pay for | What to check |
| --- | --- | --- |
| Consumer or team subscription | A recurring plan with included use under its rules | Available allowance, reset window, and plan-specific restrictions |
| API account | Metered requests, commonly including input/output tokens | Model prices, cached-input prices, tool charges, and actual usage |
| Optional extras | Credits, paid modes, connected services, or infrastructure | Whether enabled, which account pays, and any spending cap |
| Local model | Your hardware or rented compute and electricity | Hardware capacity, runtime, and separate external services |

Using more of a subscription's allowance does not necessarily create a new per-token charge, and buying a chat subscription does not automatically pay for API requests. The same coding tool may support both; Codex, for example, can sign in with a ChatGPT account or use an API key. So check which account path is active, not just the product name.

A budget alert is not necessarily a brake. As of October 2026, spend alerts on the OpenAI API platform only send a notification while requests keep going; "Enforce a hard limit" must be switched on separately, and because enforcement lags slightly, actual spend can end up a little over the set amount. Anthropic's Claude Console lets you set your own spend limit; once you reach it, requests are refused until you raise the limit.

A safer approach is prepaid credit: you top up first, and usage stops when it runs out. Also make sure auto-reload is off. As of October 2026, both the OpenAI and Anthropic APIs use prepaid credits, and Anthropic's console lets you set up auto-reload; check in your billing settings whether it is on. Do not enable paid overflow or extra credits before you understand how they are charged.

## 2. How token costs are calculated

When you use an API, the model itself does not remember the previous turn (Chapter 9), so every request carries the context needed for that request: system instructions, the conversation so far, file excerpts, and tool results. These are billed as input tokens, and what the model writes is billed as output tokens. A simplified formula:

```text
cost = uncached input tokens × input rate
     + cached input tokens × cached-input rate
     + output tokens × output rate
     + applicable tool or other charges
```

Use the same unit throughout: if prices are quoted per million tokens, divide each token count by one million. Some services also bill cache writes, image processing, or reasoning tokens separately; go by the usage fields actually returned on your bill.

Here is a calculation at Claude Sonnet 5's API list price as of October 2026: $2 per million input tokens, $0.20 per million cached reads, and $10 per million output tokens. A request with 20,000 uncached input tokens, 10,000 cached input tokens, and 1,000 output tokens costs:

```text
20,000 / 1,000,000 × $2    = $0.040
10,000 / 1,000,000 × $0.20 = $0.002
 1,000 / 1,000,000 × $10   = $0.010
Total                    = $0.052
```

These prices show two common patterns: output costs much more than input (as of October 2026, every Anthropic model's output rate is five times its input rate), and input that hits the cache costs much less than ordinary input (one tenth on most Anthropic models). Per-model prices are in Appendix E.

The longer a conversation runs, the more history each turn carries. If each exchange adds about 1,000 tokens, the request at turn 30 carries about 30,000 tokens; over all 30 turns, about 465,000 tokens are billed as input, roughly 15 times the last turn alone. Prompt caching makes the repeated opening much cheaper, but that material still occupies the context.

An agent task can make dozens of such requests and tool calls. The length of the final message says little about the total work: a short conclusion can follow a lot of searching, intermediate output, and delegated work.

## 3. Context is selected, cached, and sometimes compacted

The previous section describes the basic API mechanism. A finished application does not necessarily resend the entire history unchanged each time: it can select history, retrieve relevant material, compact earlier turns, or keep state on the server.

A summary shortens context but can lose a critical detail. A new chat can remove distraction, yet it may require re-reading files and lose cache reuse.

More context is not inherently worse. Relevant evidence can help with a difficult problem; irrelevant or conflicting material can bury the requirements. Long inputs usually need more processing, but latency also depends on the model, reasoning effort, tools, network, and service load. "It got slow" does not by itself prove the conversation is overfull.

## 4. Tell four different limits apart

| Limit | What it constrains | Useful response |
| --- | --- | --- |
| Usage allowance / quota | Use over a plan-defined period | Check remaining allowance and its reset rules |
| Rate limit | Requests or tokens over a short interval | Reduce concurrency and retry after the indicated delay |
| Context window | Material the model can process in one request | Retrieve selectively, summarize, or split the task while preserving requirements |
| Spending or credit limit | What an account may spend or its remaining balance | Inspect billing settings and actual usage before increasing it |

A new conversation does not reset your subscription quota. Paying more does not necessarily remove a context limit. A rate-limit error is usually HTTP 429, often with a suggested number of seconds to wait; retrying immediately and repeatedly only makes it worse. Read the actual error rather than calling every limit "the AI ran out of memory."

## 5. Control cost while preserving the evidence

Start by defining the deliverable and acceptance criteria. Ask the agent to locate relevant files before reading whole directories. Keep essential requirements, decisions, and sources; trim duplicated logs and obsolete attempts.

Use a smaller or faster model when the task allows it, and raise the reasoning effort when the problem calls for it. Keep output as long as it is useful. Parallel agents and repeated retries can shorten the wait yet increase total usage.

When a task stalls, check one failing command or wrong assumption before asking for another full attempt. A focused repair is often cheaper and more reliable than several broad reruns. For a new session, hand over the goal, current state, verified facts, and open problems.

Compare results using the account's usage records plus a quality check. One faster response does not prove lower cost or better accuracy, especially if caching, the model, or service load changed. What you want is more useful finished work per unit of spending or allowance, not the fewest possible tokens at any cost.

## Sources and version notes

Checked 2026-10-29. The [Codex README](https://github.com/openai/codex/blob/main/README.md) distinguishes ChatGPT-plan sign-in from API keys; [OpenAI's spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits) explains that spend alerts only notify, that a hard limit must be enabled separately, and that enforcement lags; the [Claude API limits documentation](https://platform.claude.com/docs/en/api/rate-limits) explains that an organization can set its own spend limit and requests stop when it is reached, and that rate limits return 429 with a suggested wait; the [Claude API payment guidance](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-api-usage) covers prepaid credits and the auto-reload switch; [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing) gives Sonnet 5's prices, the output-to-input ratio, and cache discounts. For other services, see [OpenAI API pricing](https://openai.com/api/pricing/) and Appendix E.

---

## Quiz

1. **[Basic · Concept]** Which statement about AI cost is accurate? <!-- quiz: q01 revision: 2 -->
   - A. Every AI product charges a separate fee for each token
   - B. A chat subscription also covers your API requests
   - C. Subscriptions, API billing, and extras each need checking
   - D. On a subscription, token usage never affects the allowance
   > **Answer: C.** Different account paths have different charging and limiting rules. Heavy use on a subscription consumes the allowance (so D is wrong) without necessarily creating a separate per-token bill (so A is wrong), and a chat subscription does not automatically include API requests (B).

2. **[Basic · Calculation]** In the example in Section 2, what is the total of $0.040 input, $0.002 cached input, and $0.010 output? <!-- quiz: q02 revision: 3 -->
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
