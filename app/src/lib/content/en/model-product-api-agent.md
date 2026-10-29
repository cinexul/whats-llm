You open a chat app and see a model selector; you also hear that the same company offers an API and an agent. These words name different parts of the same system. Once you can tell them apart, you know what you're using, what you're paying for, and what the AI can actually do for you.

## 1. The map first: four views

| Term | What it describes | A simple example |
| --- | --- | --- |
| Model | The system that processes inputs and generates outputs | A model reads a passage and drafts a summary |
| Product | The application people use, including its interface, storage and tools | You upload a document in a chat app |
| API | The agreed interface a program uses to request a service | A document app sends text to a model service |
| Agent | A system that chooses steps toward a goal, often using tools and checking results | It finds documents, compares them and prepares a sourced report |

To continue the restaurant comparison from Chapter 1: the model is the chef's skill, and the product is the whole restaurant, with its menu, tables and waiters. The API is the order window the restaurant opens for delivery services, where other programs place orders in a fixed format and collect the food. An agent is like a head waiter who, asked to "arrange a birthday dinner," checks the menu, asks about allergies and changes the plan when an ingredient is sold out.

These are four ways of looking at one system. They overlap, and you don't build them one floor at a time. A product can contain an agent; the agent can call a model through an API. A local app can also run a model directly on your computer without touching a cloud API at all (Chapter 21).

## 2. View 1, the model: the core that generates

The model is the part that turns input into output: it reads a passage or looks at an image and produces a response. Which inputs and outputs it supports depends on the specific model. Reading an image doesn't mean it can generate one, and understanding audio doesn't mean the product offers live voice conversation.

A model name alone won't tell you whether web search, memory or file editing is available; the surrounding system adds those. The model also doesn't remember you between conversations: a product's "memory" is saved information that gets put back into the context of a later conversation (Chapter 9).

## 3. View 2, the product: the side wrapped for people

ChatGPT is an OpenAI product; Claude and Gemini are the names of their companies' products and also of model families. When the distinction matters, say "the Claude app" or "a Gemini model."

A product adds a lot around the model: a model selector, chat history, file upload and retrieval, web search, image generation through another service, an agent mode and so on. Which of these you get also depends on your plan, region and organization settings. So the same model inside two products can feel very different to use.

## 4. View 3, the API: the interface opened for programs

An API is like an order form a program can fill in and read: it sends a request in the agreed format and gets back a result in the agreed format. Here is a simplified call to a model; field names vary a little between providers:

```text
Request the program sends:
  model: (some model name)
  input: "Summarize this meeting record in three points: ..."
  max output: 300 tokens

Result the service returns:
  output: "1. ... 2. ... 3. ..."
  usage: 812 input tokens, 96 output tokens
```

The usage in the result is what pay-as-you-go billing is based on (Chapter 38). Behind an API there can be a service that runs a model, or another kind of service such as search or file storage. Running a model is called inference: having the model compute an output. It has nothing to do with the reasoning effort setting from Chapter 8 (how much thinking a model puts into an answer). An API is not itself a model.

You don't need to program to use a product built on APIs. But a chat subscription and a developer API are usually two separate accounts. As of October 2026, Anthropic's help center states that paid Claude plans don't include API usage, which is billed separately on its developer platform (the Max and Team plans come with some monthly API credits). OpenAI's Codex draws on your plan's allowance when you sign in with a ChatGPT account, and is billed at API prices when you use an API key instead. So when a tool asks for an API key, first find out which payment route it uses. An API key can run up charges directly, so guard it like a password.

## 5. View 4, the agent: a way of doing the work itself

An agent works toward an outcome: it searches, reads the result, notices a gap, searches again and assembles a deliverable. The feature this chapter cares about is that it chooses and adjusts its next step based on what it observes.

A single search call says little about autonomy; a fixed workflow can call tools too. Conversely, a system that only researches and writes a report, without changing any external files, can still be an agent. Products use the word "agent" loosely, so judge by actual behavior and permissions. Chapter 19 goes into detail.

## 6. How the four views fit together

For a request such as "compare these three contracts," the path might be:

```text
You use a product
  → an agent decides which sections to inspect
  → tools retrieve authorized passages
  → an API sends those passages to a model
  → the model returns a comparison
  → the product displays the result and sources
```

This is one possible arrangement. The tools, model service and file store may belong to different companies.

> **Key point:** A program running on your laptop may still send document excerpts to a cloud model. To judge privacy, trace where the content goes, not where the app is installed (Chapter 37).

## 7. A practical test: what am I facing?

Ask three concrete questions:

1. What am I opening? A website, mobile app or desktop tool is a product.
2. What processes the content, and where? Identify the model or service behind it and whether it's local or remote; if the product doesn't disclose a detail, mark it as unknown.
3. What can it decide and execute? Distinguish a suggestion, a fixed automation and an agent that adjusts its next step based on results, then check which tools and permissions it actually has.

## 8. Common misconceptions, cleared up

| Misconception | Correction |
| --- | --- |
| Claude must mean only a model | The name can also refer to the product; context matters |
| Buying a subscription means every API call is included | Subscriptions and APIs are usually billed separately, with different logins |
| An agent is always a separate, stronger model | Agent behavior comes from a system built around models and tools |
| Any tool call makes the system autonomous | A fixed workflow can also call tools |
| A desktop app means local processing | The model or connected tools may run in the cloud |

## Summary

The four terms answer four questions: what generates the content (model), what you're using (product), how programs connect (API), and how the work moves forward step by step (agent). They overlap in real systems. The next chapter uses this map to choose a product for a real task.

## Sources and version notes

Checked October 29, 2026. The agent mechanisms were checked against repository snapshots from October 22, 2026.

- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/841dfdd938bfd4ca052475eb76d6245a356868e0/README.md) · [Codex](https://github.com/openai/codex/blob/86e17e98c7f901277aeeb4649cf1b01462b082f2/README.md): the basic structure of agents, tool calls and coding agents.
- [Claude Help Center: why API usage is billed separately from paid plans](https://support.claude.com/en/articles/9876003-i-have-a-paid-claude-subscription-pro-max-team-or-enterprise-plans-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan): paid plans don't include API usage; Max and Team include monthly API credits.
- [Codex pricing](https://learn.chatgpt.com/docs/pricing): Codex is included in ChatGPT plans; with an API key it is billed at API prices.

---

## Quiz

1. **[Basic · Concept]** Which description of these four terms is most accurate? <!-- quiz: q01 revision: 2 -->
   - A. Four stacked layers that every product must contain
   - B. Four competing kinds of model; just pick the strongest
   - C. Different views of one system, which can overlap
   - D. Two names for the same thing: API and agent
   > **Answer: C.** A product can contain an agent that calls a model through an API, and other combinations exist. A treats them as floors that must be built in order; D confuses an interface that connects programs with a way of carrying out work.

2. **[Basic · Concept]** What is an API? <!-- quiz: q02 revision: 2 -->
   - A. An agreed interface programs use to request a service
   - B. A class of larger models with more parameters
   - C. A premium feature included with your chat subscription
   - D. A way of letting the AI decide its own next step
   > **Answer: A.** An API connects programs to services, which may be a model or something else such as search or file access. It is not itself a model (B), and a chat subscription does not automatically include API usage (C). D describes an agent.

3. **[Basic · Misconception]** An assistant searches the web once. What can you conclude? <!-- quiz: q03 revision: 2 -->
   - A. It is an agent that can finish the whole job alone
   - B. It has also gained permission to edit your files
   - C. The search ran locally, so nothing left your device
   - D. It can search, which does not yet prove it acts autonomously
   > **Answer: D.** A fixed workflow can call a tool once too. Whether it is an agent depends on whether it chooses and adjusts its next step based on results. A search capability is not file permission (B), and it says nothing about where content is processed (C).

4. **[Intermediate · Scenario]** You bought a chat subscription and a separate tool requests an API key. What should you check? <!-- quiz: q04 revision: 3 -->
   - A. The subscription's renewal date, so API calls won't stop
   - B. Whether the tool's sign-in and usage are billed separately
   - C. Whether both products display the same model name
   - D. Whether you can paste the key into chat for the AI to set up
   > **Answer: B.** A chat subscription and a developer API balance are not automatically the same entitlement; some tools accept a subscription login, others need a key or a separate balance. A assumes API usage runs on the chat subscription, the very misconception this chapter corrects; matching model names say nothing about billing (C); a key is a credential and does not belong in a chat (D).

5. **[Basic · Scenario]** A desktop assistant reads a document using a cloud model. Where might the document's contents be processed? <!-- quiz: q05 revision: 2 -->
   - A. Possibly at the cloud service, depending on what the app sends
   - B. Only on this computer, because the app is installed right there
   - C. Only on the computer, because the file is on its hard drive
   - D. It is encrypted locally, so the cloud never sees the content
   > **Answer: A.** Installation location and processing location are separate questions. With a cloud model, the excerpts the app sends are processed by the provider. B and C mistake where the app or file sits for where processing happens; D assumes a protection the product has not promised.

6. **[Basic · Observation]** A product does not disclose the exact model handling your request. What is the soundest description? <!-- quiz: q06 revision: 2 -->
   - A. Infer the most likely model from the style of the answers
   - B. Write down the company's newest, strongest model
   - C. Note the product and features; mark the model as unknown
   - D. Ask the product to name its model and copy that down
   > **Answer: C.** A useful map can include unknowns. Neither writing style (A) nor a brand name (B) proves a specific model version, and the name a model gives for itself may be wrong too (D).
