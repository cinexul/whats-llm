Before giving AI a document, ask: **where will this data go, who can access it, and is that route appropriate for this task?** The answer depends on the whole product and workflow, not just the model's name.

This chapter gives you a practical four-tier ruler. It helps you use useful information with the right safeguards, while keeping actual passwords and keys in secure settings.

## 1. Follow the data, including the tools

An AI application can send more than the sentence you typed. Selected conversation history, uploaded files, retrieved documents, screenshots, and tool results may also become model input. Applications choose, summarize, or truncate context; they do not necessarily send the entire history on every turn.

| Route | What to check |
| --- | --- |
| **Cloud model** | Which provider receives selected context, under which account and terms |
| **Local model** | Whether inference stays on the device, and whether the app also uses cloud features |
| **Connected tools** | What a search service, connector, external API, or remote MCP server receives and returns |
| **Storage around the model** | Chat history, execution logs, traces, caches, shared folders, and backups |

A local model can keep inference on your machine. That does not automatically make the **whole workflow** offline: a web search may send a query out, a connector may fetch private data, and a tracing service may record tool inputs and outputs. Local files and backups also need access controls.

Likewise, a cloud product does not mean every connected party receives everything. Check the actual route and permissions. A simple sketch—**source → application → model/tools → logs/storage**—usually reveals more than the label “local” or “enterprise.”

## 2. Separate training, retention, and access

These are different questions:

| Question | What you need to find out |
| --- | --- |
| **Training** | Is content used to improve models? Which settings and exceptions apply? |
| **Retention** | What is stored, for how long, and what does deletion remove? |
| **Access and sharing** | Can workspace members, administrators, providers, or tool services access it? |
| **Location and contract** | Is this service and data route approved for your organization and task? |

**“Not used for training” does not mean “not retained.”** A product may keep history, operational records, or tool traces under separate rules. Turning off history, starting a new conversation, and deleting a conversation may have different effects. None should be assumed to erase every log or backup immediately.

Check the exact product, plan, settings, and contract. An enterprise account or API can have different terms from a personal chat account, but a paid label alone does not settle the question. Connected tools may have their own policies. Avoid memorizing a universal retention period; look up the current one for the actual route.

## 3. Four data tiers: a practical default, not a universal law

Your organization may use different names or stricter rules. This table is a starting point for daily decisions.

| Tier | Examples | Default approach |
| --- | --- | --- |
| **1. Public** | Published articles, public product descriptions | Usually suitable; still respect use rights and check for hidden private material |
| **2. Internal** | Routine work drafts, nonpublic meeting agendas | Use approved tools and share only the necessary parts |
| **3. Sensitive** | Customer records, private contracts, personal information | Use an authorized workflow with suitable access, retention, and data handling; remove details the task does not need |
| **4. Highly restricted** | Production credentials, identity documents, medical records, critical trade secrets | Keep credentials out of prompts; process other restricted data only in a specifically approved environment with appropriate safeguards |

Data minimization means **send only what the task needs**. For help rewriting a customer email, replace the name with “Customer A” and omit the account number. For a support workflow that genuinely needs the correct customer, an approved system may process that information under appropriate permissions.

Removing a name does not automatically make data anonymous or lower its tier. An address, rare job title, order history, or combination of details may still identify a person. Screenshots and attachments count as data too.

> **Key point:** Sensitive personal information is not suitable for casual pasting into an arbitrary chat. That is different from saying every properly authorized medical, customer-support, or internal workflow is forbidden. Match the information, purpose, service, and controls.

## 4. Actual credentials belong in secure settings

Passwords, API keys, session cookies, and access tokens are capabilities: whoever can use them may be able to read data, change systems, or spend money.

Use placeholders such as `YOUR_API_KEY` in examples. Put actual credentials in the product's designated secret settings, a secret manager, or an approved authentication flow. Do not paste them into chat, source code, screenshots, or diagnostic logs. Even secure storage needs restricted access and suitable credential scope.

**You do not have to type a key for a connected agent to have power.** An existing login or connector can let it read a document or send a message using delegated access. Limit connected accounts and tools to what the task needs, and check the destination before data leaves.

If a live credential is accidentally exposed, treat it as potentially compromised: revoke or rotate it promptly, check relevant access records, and follow the service or team's incident procedure. Deleting the conversation alone does not invalidate the credential or remove all copies.

## Summary

- Follow data through the model, connected tools, logs, and backups. “Local model” describes only part of that route.
- Training, retention, access, and deletion are separate controls.
- Use data tiers and minimization; authorized sensitive-data workflows need suitable safeguards.
- Keep actual credentials in secure settings, and restrict the access already granted through connectors.
- If a key is exposed, rotate it and investigate; do not rely on chat deletion.

The next chapter looks at the other cost of AI use: money, quota, and unnecessary context.

## Sources and version notes

Checked on 2026-10-22. The four-tier table is this book's practical framework, not a vendor policy or legal classification. Verify current terms for the service you use.

- [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.mdx): distinguishes local processing from cloud features and describes a local-only setting.
- [OpenAI Agents SDK tracing documentation](https://github.com/openai/openai-agents-python/blob/main/docs/tracing.md): traces can contain model and tool inputs/outputs and be exported to a backend; configuration controls sensitive-data capture.
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime): filesystem and network controls illustrate why credential access and outgoing connections both matter.

---

## Quiz

> Six questions. Think first, then check the answer and explanation.

1. **[Basic · Concept]** Where can information go in an AI workflow? <!-- quiz: q01 revision: 1 -->
   - A. Only to the chat window
   - B. Only to the model's training data
   - C. Depending on the configuration, to the model, tools, logs, and storage
   - D. Always to every connected service
   > **Answer: C.** Follow the actual data route. Model context may include selected files and tool results as well as typed messages.

2. **[Basic · Concept]** Where should a real API key go when configuring an approved integration? <!-- quiz: q02 revision: 1 -->
   - A. In the prompt
   - B. In a public code example
   - C. In a screenshot attached to the chat
   - D. In designated secure settings or an approved secret manager
   > **Answer: D.** Use placeholders when discussing configuration. Secure storage should also restrict who and what can use the key.

3. **[Advanced · Misconception]** A service says it does not train on your content. What still needs checking? <!-- quiz: q03 revision: 1 -->
   - A. Nothing; it cannot retain anything
   - B. Retention, access, deletion, and connected tools' handling of data
   - C. Only the model's name
   - D. Whether the chat window is dark or light
   > **Answer: B.** No training is a specific promise, not a promise of zero storage or unrestricted suitability for sensitive data.

4. **[Advanced · Scenario]** You use a local model with a cloud search tool and remote tracing enabled. Is the whole workflow necessarily offline? <!-- quiz: q04 revision: 1 -->
   - A. Yes, because the model is local
   - B. Yes, if you open a new chat
   - C. No; tool requests and traces may leave the device
   - D. No local model can run offline
   > **Answer: C.** Local inference can be offline, but the surrounding application and tools determine the complete data route.

5. **[Basic · Scenario]** You only need help polishing an email's wording. What is a good default for its customer's name and account number? <!-- quiz: q05 revision: 1 -->
   - A. Include both even though they are unnecessary
   - B. Replace or remove them and use an approved service
   - C. Send a screenshot so they stop being data
   - D. Assume removing a name guarantees anonymity
   > **Answer: B.** Minimize the input. Other details can still identify a person, so removing a name alone is no guarantee. Approved workflows may process necessary personal information with appropriate safeguards.

6. **[Hands-on · Observation]** Without entering private information, inspect an AI app you use. Identify its model route, connected tools, training setting, and retention or deletion policy. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** These answers may live in different settings or documents. Include any logs, shared workspaces, and backups you control. If a live credential was exposed, revocation or rotation is needed; deleting the conversation is not a substitute.
