You open a chat app, see a model selector, and hear that the same company also offers an API and an agent. These words describe different parts of a system. Understanding them helps you decide what to use, what you are paying for, and what the AI can actually do.

## 1. The map first: four views

| Term | What it describes | A simple example |
| --- | --- | --- |
| **Model** | The system that processes inputs and generates outputs | A model reads a passage and drafts a summary |
| **Product** | The application people use, including its interface, storage and tools | You upload a document in a chat app |
| **API** | A defined interface through which software requests a service | A document app sends text to a model service |
| **Agent** | A system that chooses steps toward a goal, often using tools and checking results | It finds documents, compares them and prepares a sourced report |

To continue the restaurant comparison from Chapter 1: the model is the chef's skill, and the product is the whole restaurant, with its menu, tables and waiters. The API is the order window the restaurant opens for delivery services, where other programs place orders in a fixed format and collect the food. An agent is like a head waiter who, asked to "arrange a birthday dinner," checks the menu, asks about allergies and changes the plan when an ingredient is sold out.

These are four viewpoints, not four mutually exclusive boxes or a four-story building you must construct in order. A product can contain an agent; the agent can call a model through an API. A local app can also run a model directly on your computer without a cloud API.

## 2. View 1, the model: the core that generates

The model supplies capabilities such as understanding language, interpreting an image or generating text. Which kinds of input and output it supports depends on the specific model. Reading an image does not automatically mean it can generate an image, and understanding audio does not automatically mean the product offers live conversation.

A model name alone does not tell you whether web search, saved preferences or file editing is available. Those depend on the surrounding system too. The model itself also does not remember you between conversations: what products call "memory" is saved information that the product puts back into the context of a later conversation (Chapter 9).

## 3. View 2, the product: the side wrapped for people

ChatGPT is an OpenAI product; Claude and Gemini are names used for both model families and their respective providers' products. Say “the Claude app” or “a Gemini model” when the distinction matters.

A product may select among models, store conversation history, retrieve files, generate images through another service, or expose an agent mode. The experience also depends on your plan, region, organization settings and permissions. So the same model inside two products can feel quite different to use.

## 4. View 3, the API: the interface opened for programs

An API is like an order form software can submit and read. The program sends an agreed request, such as text to summarize, and receives a structured response. The service behind an API can be running a model (inference), meaning handing the input to the model and having it compute an output, or it can be search, file access and many other things. Inference here simply means running the model; it has nothing to do with the reasoning effort setting from Chapter 8 (how much thinking a model puts into an answer). An API is not itself a model either.

You do not need to program to use a product built on APIs. Also, a chat subscription does not automatically include separately billed developer API usage. Some tools accept a subscription login; others require an API key or a separate balance. Check the payment route the particular tool uses before assuming the accounts are interchangeable. An API key can authorize access and spending, so guard it like a password.

## 5. View 4, the agent: a way of doing the work itself

An agent works toward an outcome: it may decide to search, read the result, identify a gap, search again and assemble a deliverable. Its distinguishing feature here is **choosing and adapting steps based on observations**.

A single web search does not establish meaningful autonomy. A fixed workflow can call tools too. Conversely, an agent that only researches and writes can be an agent without changing external files. In practice, “agent” is used broadly; inspect its behavior and permissions instead of relying on the label.

## 6. How the four views fit together

For a request such as “compare these three contracts,” the path might be:

```text
You use a product
  → an agent decides which sections to inspect
  → tools retrieve authorized passages
  → an API sends those passages to a model
  → the model returns a comparison
  → the product displays the result and sources
```

This diagram is one possible arrangement. The tools, model service and file store may belong to different providers.

> **Key point:** A program running on your laptop may still send document excerpts to a cloud model. To understand privacy, trace where the content goes; the location of the app icon is not enough.

## 7. A practical test: what am I facing?

Ask three concrete questions:

1. **What am I opening?** A website, mobile app or desktop tool is the product.
2. **What processes the content, and where?** Identify the model or service and whether processing is local or remote; if the product hides that detail, mark it as unknown.
3. **What can it decide and execute?** Distinguish a suggested plan, a fixed automation and an agent that adapts its next step. Check the tools and permissions it actually has.

## 8. Common misconceptions, cleared up

| Misconception | Correction |
| --- | --- |
| Claude must mean only a model | The name can also refer to the product; context matters |
| Buying a subscription means every API call is included | Login methods and billing arrangements differ by service |
| An agent is always a separate, stronger model | Agent behavior comes from a system built around models and tools |
| Any tool call makes the system autonomous | A fixed workflow can also call tools |
| A desktop app means local processing | The model or connected tools may run in the cloud |

## Summary

Use the four terms to answer four questions: **what generates, what you use, how software connects, and how the work is organized**. They overlap in real systems. The next chapter uses this map to choose a product for a real task.

---

**Verification scope — October 22, 2026:** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/841dfdd938bfd4ca052475eb76d6245a356868e0/README.md) · [Codex](https://github.com/openai/codex/blob/86e17e98c7f901277aeeb4649cf1b01462b082f2/README.md)

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

4. **[Intermediate · Scenario]** You bought a chat subscription and a separate tool requests an API key. What should you check? <!-- quiz: q04 revision: 2 -->
   - A. Nothing; the subscription already covers all usage
   - B. Whether the tool's sign-in and usage are billed separately
   - C. Whether both products display the same model name
   - D. Whether you can paste the key into chat for the AI to set up
   > **Answer: B.** A chat subscription and a developer API balance are not automatically the same entitlement; some tools accept a subscription login, others need a key or a separate balance. A is exactly that misconception; matching model names say nothing about billing (C); a key is a credential and does not belong in a chat (D).

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
