You open a chat app, see a model selector, and hear that the same company also offers an API and an agent. These words describe different parts of a system. Understanding them helps you decide what to use, what you are paying for, and what the AI can actually do.

## 1. The map first: four layers

| Term | What it describes | A simple example |
| --- | --- | --- |
| **Model** | The system that processes inputs and generates outputs | A model reads a passage and drafts a summary |
| **Product** | The application people use, including its interface, storage and tools | You upload a document in a chat app |
| **API** | A defined interface through which software requests a service | A document app sends text to a model service |
| **Agent** | A system that chooses steps toward a goal, often using tools and checking results | It finds documents, compares them and prepares a sourced report |

Think of these as **four viewpoints, not four mutually exclusive boxes or a mandatory stack**. A product can contain an agent; the agent can call a model through an API. A local app can run a model without a cloud API.

## 2. Layer 1, the model: the "core" that thinks

The model supplies capabilities such as understanding language, interpreting an image or generating text. Which kinds of input and output it supports depends on the specific model. Reading an image does not automatically mean it can generate an image, and understanding audio does not automatically mean the product offers live conversation.

A model name alone does not tell you whether web search, saved preferences or file editing is available. Those depend on the surrounding system too. Calling the model a “brain” is a metaphor, not a claim that it understands or remembers like a person.

## 3. Layer 2, the product: the layer wrapped for people

ChatGPT is an OpenAI product; Claude and Gemini are names used for both model families and their respective providers' products. Say “the Claude app” or “a Gemini model” when the distinction matters.

A product may select among models, store conversation history, retrieve files, generate images through another service, or expose an agent mode. The experience also depends on your plan, region, organization settings and permissions. **The same model inside two products can produce a different practical experience.**

## 4. Layer 3, the API: the interface opened for programs

An API is like an order form software can submit and read. The program sends an agreed request, such as text to summarize, and receives a structured response. APIs can provide model inference, search, file access and many other services; an API is not itself a model.

You do not need to program to use a product built on APIs. Also, **a chat subscription does not automatically include separately billed developer API usage**. Some tools accept a subscription login; others require an API key or a separate balance. Check the payment route the particular tool uses before assuming the accounts are interchangeable. An API key can authorize access and spending: treat it like a credential.

## 5. Layer 4, the Agent: the layer that "does the work itself"

An agent works toward an outcome: it may decide to search, read the result, identify a gap, search again and assemble a deliverable. Its distinguishing feature here is **choosing and adapting steps based on observations**.

A single web search does not establish meaningful autonomy. A fixed workflow can call tools too. Conversely, an agent that only researches and writes can be an agent without changing external files. In practice, “agent” is used broadly; inspect its behavior and permissions instead of relying on the label.

## 6. How the four layers stack

For a request such as “compare these three contracts,” the path might be:

```text
You use a product
  → an agent decides which sections to inspect
  → tools retrieve authorized passages
  → an API sends those passages to a model
  → the model returns a comparison
  → the product displays the result and sources
```

This diagram is one possible arrangement. The tools, model service and file store may belong to different providers. **A program running on your laptop may still send document excerpts to a cloud model.** To understand privacy, trace where the content goes; the location of the app icon is insufficient.

## 7. A practical test: which layer am I facing?

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

1. **[Basic · Concept]** Which description of these four terms is most accurate? <!-- quiz: q01 revision: 1 -->
   - A. They are four competing kinds of model
   - B. Every product must contain all four in the same order
   - C. They describe different parts of a system and can overlap
   - D. An API is always an agent
   > **Answer: C.** A product can contain an agent that accesses a model through an API; other arrangements also work.

2. **[Basic · Concept]** What is an API? <!-- quiz: q02 revision: 1 -->
   - A. A defined interface that software can use to request a service
   - B. A model with more parameters
   - C. A paid chat subscription
   - D. A screen-reading feature
   > **Answer: A.** The interface connects programs to services, including model and non-model services.

3. **[Basic · Misconception]** An assistant searches the web once. What can you conclude? <!-- quiz: q03 revision: 1 -->
   - A. It can complete any task independently
   - B. It has at least a search capability; that alone does not establish an adaptive agent loop
   - C. It can edit your files
   - D. It must be running locally
   > **Answer: B.** Inspect whether it chooses and adjusts steps, and what permissions it has.

4. **[Intermediate · Scenario]** You bought a chat subscription and a separate tool requests an API key. What should you check? <!-- quiz: q04 revision: 1 -->
   - A. Whether the icons match
   - B. Whether the model uses a longer name
   - C. Whether the tool's authentication and API usage are included or billed separately
   - D. Whether you can paste the key publicly
   > **Answer: C.** A subscription and a developer API balance are not automatically the same entitlement.

5. **[Basic · Scenario]** A desktop assistant reads a document using a cloud model. Where might the document's contents be processed? <!-- quiz: q05 revision: 1 -->
   - A. Only on the desktop, because the app is installed there
   - B. Nowhere: models do not process input
   - C. Only on a printer
   - D. At the cloud service, depending on what the app sends
   > **Answer: D.** Installation location and processing location are separate questions.

6. **[Basic · Observation]** A product does not disclose the exact model handling your request. What is the soundest description? <!-- quiz: q06 revision: 1 -->
   - A. Invent a likely model name
   - B. Identify the product and visible capabilities, and mark the underlying model as unknown
   - C. Assume it has no model
   - D. Assume the most expensive model is used
   > **Answer: B.** A useful map can include unknowns; a brand name is not evidence of a specific model version.
