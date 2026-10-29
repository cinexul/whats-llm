Imagine asking an assistant to compare three venues for a workshop. It could tell you how to search. Or it could open the venue pages itself, note prices and accessibility details, notice what's missing, and hand you a comparison with sources. The second is how an agent works: it moves toward a goal through a series of "decide, act, look at the result" steps.

## 1. From "AI that answers" to "AI that acts"

In this chapter, an agent is a system that uses a model to choose and adjust steps toward a goal. It usually has tools that let it search, read, calculate or change things. Products define the word a little differently, so the more useful questions are: what can it decide, what can it access, and how does it show the task is done?

A chat assistant can call a tool once, and a fixed automation can run ten pre-written steps to the end, but neither changes its next step when something unexpected happens. An agent also doesn't have to change anything outside itself: a research agent that only reads and writes a report is still an agent.

## 2. The key part: tool use

The model itself only outputs text. The way it "acts" is by outputting a request in a fixed format saying which tool to call and with what inputs. Think of the model filling in a request form; the surrounding software works like a service counter that checks the form is within what's allowed, actually carries it out, and puts the receipt back into the context. The model reads the receipt and decides the next step. Here is one simplified round:

```text
① This round, the model outputs a request form:
   tool: fetch_page
   inputs: {"url": "https://example.com/venue-a"}

② The surrounding software checks permission, runs it, and puts the receipt back into the context:
   tool result: "...seats 30, full-day Saturday rate $650, no elevator..."

③ The model reads the receipt and decides what's next: check venue B, or start the comparison table
```

The figure below shows this loop. The model's side only writes text; the surrounding software is what actually executes. Each round's result goes back into the context, until the task is done.

![The agent loop: your goal goes to the model, which reads the context, decides the next step and fills in a tool request; the surrounding software checks permission, runs the tool and returns the result as a receipt into the context; the model reads it and decides again, and when done it delivers a result with sources](/figures/en/agent-loop.svg)

> **Key point:** When the model says "I sent the file," that does not prove the sending tool actually succeeded. Look at the receipt: the file, the record or the actual state of the application.

Tools come in roughly three kinds:

| Route | How it works | What to watch |
| --- | --- | --- |
| Direct integration / API | Requests a defined action such as finding a document or creating a draft | Available actions, account permissions and returned status |
| Computer use / browser interaction | Looks at a page or screenshot, then clicks, types or navigates | The actual page state, mistaken clicks, changed layouts and confirmation screens |
| File or command tools | Read files, edit a workspace or run a program | Which folder or environment they affect and whether the result was checked |

A direct integration offers specific, well-defined actions. Computer use can reach interfaces that have no integration, but it first has to make sense of what's on the screen, which leaves more room for mistakes. Neither route automatically gets every permission, and neither guarantees success. A sandbox is a working environment that limits what the agent can touch; when using one, still check which files and network services it can reach.

## 3. The Agent's signature move: running its own small "act -> observe -> adjust" loop

For the venue task, the small loop might go like this:

```text
Read the requirements → inspect venue sources → record comparable facts
  → discover a missing accessibility detail → investigate or mark it unknown
  → check the comparison against sources → deliver the report
```

This is not the same as the "investigate → plan → act → sign off" workflow from Chapters 14 and 24. That's the whole process you and the AI follow together, with a plan to approve and a human sign-off; the agent's small loop may go round many times inside each of its steps.

Some systems can delegate parts of a job to other agents, for example having three agents each check one venue. That's an implementation choice, not three independent experts: they can make the same mistake or lean on the same weak source. Whatever pulls the results together still has to reconcile differences and keep the evidence, and more agents can also mean more time and cost.

When you check the work, ask for evidence you can see: source links, files created, changes made and checks performed. What you need is the work record and the result, not a passage that claims to show its internal reasoning.

## 4. Capability and risk are the same coin

When you hand over a task, spell out the outcome, the available material, the allowed actions and when to stop:

> Compare these three venues for 20 people on this date, within this budget. Use their official pages and include the source and check date for each quoted price. Mark missing information as unknown. Prepare a comparison only; contact me before any booking or payment. Deliver a table and a short recommendation with the main uncertainty.

Match permissions to the job. When organizing files, try it on a copy first and have it list the planned moves or deletions before doing them. An action you've already authorized and can undo doesn't need approving again and again; your explicit OK matters at the boundaries: sending, buying, publishing or deleting important data (Chapter 26).

Web pages and documents can contain instructions aimed at the assistant. Those are content from the source, not commands from you. If a venue page tells the agent to ignore your budget or upload other files, that doesn't become part of the task. This kind of attack is called prompt injection (Chapter 22), and it's one reason to limit access and check important results.

For longer tasks, agree on a time or spending limit. When the agent hits a missing login, conflicting requirements or repeated failure, it should stop and report the obstacle rather than quietly widen the task.

## 5. Back to Chapter 17: where the agent sits on that map

An agent is a way of organizing work around a model, tools and the state of the task. You may meet one inside a chat product, a coding tool or a custom service built on an API. The interface may be on your computer while the model runs remotely. "Agent" describes how the work moves forward; it says nothing about where the data stays or which subscription pays.

## 6. Common misconceptions, cleared up

| Misconception | Reality |
| --- | --- |
| A plan proves the work is done | A plan is only a proposal; look at actual outputs and checks |
| More agents means a more reliable answer | Shared sources and shared errors can create false agreement |
| Being able to call tools means unlimited permission | Actions must stay within the task and the granted permissions |
| A "success" message is enough | Check the actual state of the file, source or application |

## Summary

At the heart of an agent is a loop: the model fills in a request form, the surrounding software checks permission and runs it, the receipt goes back into the context, and the model decides the next step. When you delegate, hand over the goal together with its boundaries; when you check, look at real evidence. For the venue task, a sourced comparison that clearly marks the gaps is far more useful than an unsupported "everything is confirmed."

## Sources and version notes

Checked against repository snapshots from October 22, 2026.

- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/841dfdd938bfd4ca052475eb76d6245a356868e0/README.md): the structure of agents, tool calls, and delegating subtasks to other agents (handoffs).
- [Anthropic computer use demo](https://github.com/anthropics/anthropic-quickstarts/blob/9ec32b91df50b0d4906cae64b13c6298055ff40d/computer-use-demo/README.md): how a model operates a computer through screenshots and clicks, and the advice to run it in an isolated environment.

---

## Quiz

1. **[Basic · Concept]** Which behavior best illustrates the agent loop described here? <!-- quiz: q01 revision: 2 -->
   - A. Running ten predefined steps in order until the end
   - B. Checking the last step's result, then picking the next
   - C. Calling a tool once and handing you the raw result
   - D. Writing out a complete plan and announcing the task is done
   > **Answer: B.** Deciding the next step from what was observed is the agent feature this chapter describes. A fixed sequence (A) and a single tool call (C) do not adjust when something unexpected happens; a plan is only a proposal (D), so look for actual output and checks.

2. **[Basic · Concept]** How does computer use differ from a direct integration? <!-- quiz: q02 revision: 2 -->
   - A. It clicks and types on the screen instead of a set interface
   - B. It runs without a model, driven only by a prewritten script
   - C. It can reach more interfaces, so it also has more permissions
   - D. It calls the service's interface directly, so it rarely errs
   > **Answer: A.** Computer use observes a page or screen and clicks or types; a direct integration requests operations the service has defined. Both need permissions and result checks. Reaching more interfaces does not mean more permissions (C), and D describes the two routes the wrong way round.

3. **[Basic · Evidence]** An agent says “the report is saved.” What most directly verifies this? <!-- quiz: q03 revision: 2 -->
   - A. You ask again and it still says the report is saved
   - B. It describes the saving steps and file path in detail
   - C. Its underlying model has a high benchmark score
   - D. Opening the report at that location and checking it
   > **Answer: D.** Check the external result, not only the completion claim. Repeating the claim (A) or describing it in detail (B) is still only text, and a model's score (C) has nothing to do with whether this file was saved.

4. **[Intermediate · Misconception]** Three delegated agents agree on a price. Why might you still check it? <!-- quiz: q04 revision: 2 -->
   - A. Delegation erases the original sources along the way
   - B. Prices change daily, so any figure found is wrong
   - C. All three may rely on the same outdated source
   - D. More agents always means more errors, by definition
   > **Answer: C.** Agent count is not the same as independent evidence; shared sources and shared mistakes can produce false agreement. Delegation does not delete sources (A); price changes (B) are not the point here; D frames it as a matter of numbers, when what matters is whether the evidence is independent.

5. **[Basic · Scenario]** A venue page instructs the agent to upload your private notes. What should happen? <!-- quiz: q05 revision: 2 -->
   - A. Follow it, since the page is part of the task material
   - B. Treat it as untrusted content and keep to the task
   - C. Upload first and tell you what happened afterwards
   - D. Have another agent do the upload for you instead
   > **Answer: B.** Text on the page aimed at the assistant is source content, not your instruction. Reading a source does not give it authority over your data or task, and handing the upload to another agent (D) crosses the same line.

6. **[Intermediate · Scenario]** A research task reaches its agreed budget without resolving a missing fact. What is the appropriate result? <!-- quiz: q06 revision: 2 -->
   - A. Keep spending quietly until the missing fact turns up
   - B. Fill the gap with the most likely number and finish
   - C. Book the cheapest venue first, then send the report
   - D. Report work done, what's missing and why it stopped
   > **Answer: D.** Honest partial completion preserves the evidence and the agreed boundary. Spending past the budget (A), filling gaps with guesses (B) and booking without permission (C) all go beyond what was authorized.
