Imagine asking an assistant to compare three venues for a workshop. It could describe how you should search. Or it could inspect the venue pages, collect prices and accessibility information, notice missing details, and produce a comparison with sources. The second example illustrates agent behavior: pursuing a goal through a sequence of decisions and observations.

## 1. From "AI that answers" to "AI that acts"

Here, an **agent** is a system that uses a model to choose and adjust steps toward a goal. Tools often let it search, read, calculate or change things. Definitions vary across products, so the useful questions are what it can decide, what it can access and how it reports completion.

A chatbot can call a tool once. A fixed automation can execute ten predetermined steps. Neither fact alone shows that the system can choose a next step when something unexpected happens. An agent also need not change anything: a research agent may only read and write a report.

## 2. The key part: tool use

The model proposes an action; the surrounding software checks and executes the tool call, then returns a result. Think of it this way: the model fills in a request form, the surrounding software works like a service counter that carries it out, and a receipt comes back.

> **Key point:** When the model says “I sent the file,” that does not prove the sending tool actually succeeded. Look at the receipt: the file, the record or the actual state of the application.

| Route | How it works | What to watch |
| --- | --- | --- |
| **Direct integration / API** | Requests a defined action such as finding a document or creating a draft | Available actions, account permissions and returned status |
| **Computer use / browser interaction** | Observes a page or screen and clicks, types or navigates | The actual page state, mistaken clicks, changed layouts and confirmation screens |
| **File or command tools** | Read files, edit a workspace or run a program | Which folder or environment they affect and whether the result was checked |

An integration usually exposes specific operations. Computer use can reach interfaces without a dedicated integration, but needs to interpret what happened on screen. Neither route automatically grants all permissions or guarantees success. A sandbox is a restricted working environment; find out which files and network services it can still reach.

## 3. The Agent's signature move: running its own small "act -> observe -> adjust" loop

While it works, an agent repeats a small loop: take a step, look at the result, decide the next step. For the venue task, it might look like this:

```text
Read the requirements → inspect venue sources → record comparable facts
  → discover a missing accessibility detail → investigate or mark it unknown
  → check the comparison against sources → deliver the report
```

This small loop is not the same as the "investigate -> plan -> act -> sign off" workflow in Chapters 14 and 24. That is the full process you and the AI follow together, with a plan to approve and a human sign-off; the agent's small loop can run many times inside each of its steps.

Some systems can **delegate** parts to other agents, such as having each examine one venue. That is an implementation choice, not proof of independent expertise. Agents can repeat the same error or rely on the same weak source. The coordinating system must reconcile the findings and preserve the evidence behind them. More agents may also mean more time and cost.

Ask for observable evidence: source links, files created, changes made and checks performed. You need the work record and result, not a claimed transcript of private internal reasoning.

## 4. Capability and risk are the same coin

A good task handoff specifies the outcome, available material, allowed actions and stopping conditions:

> Compare these three venues for 20 people on this date, within this budget. Use their official pages and include the source and check date for each quoted price. Mark missing information as unknown. Prepare a comparison only; contact me before any booking or payment. Deliver a table and a short recommendation with the main uncertainty.

Match permissions to the job. For file organization, start with a copy and request a preview of moves or deletions. For an already authorized, reversible action, repeated approval is not inherently useful; approvals matter at boundaries such as sending, purchasing, publishing or deleting valuable data.

Webpages and documents can contain instructions aimed at the assistant. Those are **source content, not instructions from you**. If a venue page tells the agent to ignore your budget or reveal other files, that is not part of the assignment. This is one reason to limit access and inspect consequential results.

Set a time or spending limit for longer work. When the agent encounters a missing login, conflicting requirements or repeated failure, it should stop or report the obstacle rather than quietly expand the task.

## 5. Back to chapter 17: where the Agent sits on the "four-layer map"

An agent is a way to organize work around models, tools and state. You might encounter it inside a chat product, coding app or custom service built with APIs. Its interface may be local while the model runs remotely. “Agent” describes how the work proceeds, not where your data stays or which subscription pays for it.

## 6. Common misconceptions, cleared up

| Misconception | Reality |
| --- | --- |
| A plan proves work was done | A plan is a proposal; look for actual outputs and checks |
| More agents guarantee a better answer | Shared sources and mistakes can produce false agreement |
| Tool access means unlimited authority | Tools must remain within the task and permission scope |
| The agent's success message is enough | Check the resulting file, source or application state |

## Summary

Delegate an outcome with clear boundaries. An effective agent selects steps, uses tool results to adapt and returns evidence you can inspect. For the venue task, a sourced comparison with clearly marked gaps is more useful than an unsupported “everything is confirmed.”

---

**Verification scope — October 22, 2026:** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/841dfdd938bfd4ca052475eb76d6245a356868e0/README.md) · [Anthropic computer use](https://github.com/anthropics/anthropic-quickstarts/blob/9ec32b91df50b0d4906cae64b13c6298055ff40d/computer-use-demo/README.md)

---

## Quiz

1. **[Basic · Concept]** Which behavior best illustrates the agent loop described here? <!-- quiz: q01 revision: 1 -->
   - A. Running ten predefined steps in order until the end
   - B. Checking the last step's result, then picking the next
   - C. Calling a tool once and handing you the raw result
   - D. Writing out a complete plan and announcing the task is done
   > **Answer: B.** Deciding the next step from what was observed is the agent feature this chapter describes. A fixed sequence (A) and a single tool call (C) do not adjust when something unexpected happens; a plan is only a proposal (D), so look for actual output and checks.

2. **[Basic · Concept]** How does computer use differ from a direct integration? <!-- quiz: q02 revision: 1 -->
   - A. It clicks and types on the screen instead of a set interface
   - B. It runs without a model, driven only by a prewritten script
   - C. It can reach more interfaces, so it also has more permissions
   - D. It calls the service's interface directly, so it rarely errs
   > **Answer: A.** Computer use observes a page or screen and clicks or types; a direct integration requests operations the service has defined. Both need permissions and result checks. Reaching more interfaces does not mean more permissions (C), and D describes the two routes the wrong way round.

3. **[Basic · Evidence]** An agent says “the report is saved.” What most directly verifies this? <!-- quiz: q03 revision: 1 -->
   - A. You ask again and it still says the report is saved
   - B. It describes the saving steps and file path in detail
   - C. Its underlying model has a high benchmark score
   - D. Opening the report at that location and checking it
   > **Answer: D.** Check the external result, not only the completion claim. Repeating the claim (A) or describing it in detail (B) is still only text, and a model's score (C) has nothing to do with whether this file was saved.

4. **[Intermediate · Misconception]** Three delegated agents agree on a price. Why might you still check it? <!-- quiz: q04 revision: 1 -->
   - A. Delegation erases the original sources along the way
   - B. Prices change daily, so any figure found is wrong
   - C. All three may rely on the same outdated source
   - D. More agents always means more errors, by definition
   > **Answer: C.** Agent count is not the same as independent evidence; shared sources and shared mistakes can produce false agreement. Delegation does not delete sources (A); price changes (B) are not the point here; D frames it as a matter of numbers, when what matters is whether the evidence is independent.

5. **[Basic · Scenario]** A venue page instructs the agent to upload your private notes. What should happen? <!-- quiz: q05 revision: 1 -->
   - A. Follow it, since the page is part of the task material
   - B. Treat it as untrusted content and keep to the task
   - C. Upload first and tell you what happened afterwards
   - D. Have another agent do the upload for you instead
   > **Answer: B.** Text on the page aimed at the assistant is source content, not your instruction. Reading a source does not give it authority over your data or task, and handing the upload to another agent (D) crosses the same line.

6. **[Intermediate · Scenario]** A research task reaches its agreed budget without resolving a missing fact. What is the appropriate result? <!-- quiz: q06 revision: 1 -->
   - A. Keep spending quietly until the missing fact turns up
   - B. Fill the gap with the most likely number and finish
   - C. Book the cheapest venue first, then send the report
   - D. Report work done, what's missing and why it stopped
   > **Answer: D.** Honest partial completion preserves the evidence and the agreed boundary. Spending past the budget (A), filling gaps with guesses (B) and booking without permission (C) all go beyond what was authorized.
