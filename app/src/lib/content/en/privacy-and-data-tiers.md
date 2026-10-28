Before giving AI a document, ask: **where will this data go, who can access it, and is that route appropriate for this task?** The answer depends on the whole product and workflow, not just the model's name.

This chapter gives you a practical four-tier ruler. It helps you use useful information with the right safeguards, while keeping actual passwords and keys in secure settings.

## 1. Follow the data, including the tools

An AI application can send more than the sentence you typed. Selected conversation history, uploaded files, retrieved documents, screenshots, and tool results may also become model input. Applications choose, summarize, or truncate context; they do not necessarily send the entire history on every turn.

| Route | What to check |
| --- | --- |
| **Cloud model** | Which provider receives selected context, under which account and terms |
| **Local model** | Whether the model runs on the device, and whether the app also uses cloud features |
| **Connected tools** | What a search service, connector, external API, or remote MCP server receives and returns |
| **Storage around the model** | Chat history, saved memories, execution logs, traces, caches, shared folders, and backups |

A local model can run on your own machine. That does not automatically make the **whole workflow** offline: a web search may send a query out, a connector may fetch private data, and a tracing service may record tool inputs and outputs. Local files and backups also need access controls.

Likewise, a cloud product does not mean every connected party receives everything. Check the actual route and permissions. A simple sketch, **source → application → model/tools → logs/storage**, usually reveals more than the label “local” or “enterprise.”

## 2. Separate training, retention, access, and memory

These are different questions:

| Question | What you need to find out |
| --- | --- |
| **Training** | Is content used to improve models? Which settings and exceptions apply? |
| **Retention** | What is stored, for how long, and what does deletion remove? |
| **Memory** | Does the product pull information out of chats, save it, and put it back into context later? Is that on by default? Where can you view and delete it? |
| **Access and sharing** | Can workspace members, administrators, providers, or tool services access it? |
| **Location and contract** | Is this service and data route approved for your organization and task? |

**“Not used for training” does not mean “not retained.”** A product may keep history, operational records, or tool traces under separate rules. Turning off history, starting a new conversation, and deleting a conversation may have different effects. None should be assumed to erase every log or backup immediately.

Check memory separately. The model itself does not remember you between conversations (Chapter 9); what products call "memory" is saved information that the product puts back into the context of later conversations. Some products create memories from your chats automatically, and the feature may be on by default. For example, as of October 2026, Claude's Free, Pro, and Max plans have "memory from chats" on by default, and deleting a conversation does not delete memory entries generated from it. Practical steps:

- For sensitive material, use a temporary chat (some products call it incognito) or turn memory off first.
- Open the memory settings now and then, see what has been saved, and delete entries that should not stay.
- Do not use memory as a place to keep passwords, ID numbers, or similar information.

Feature names and locations vary; check the help documentation of the product you use.

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

If you start writing code yourself or using a coding agent, add three habits:

- Never commit a key to a Git repository. Even after you delete the file, older versions usually still contain it.
- Many projects keep keys in a text file called `.env`. Add `.env` to `.gitignore` (the list of files Git should not record, Chapter 26) so it never gets committed.
- A coding agent may read `.env` or print environment variables while running commands. Where possible, keep keys somewhere the agent cannot read: use the tool's rules for blocking file reads, or give it only a limited test key (Chapter 35 shows how).

**You do not have to type a key for a connected agent to have power.** An existing login or connector can let it read a document or send a message using delegated access. Limit connected accounts and tools to what the task needs, and check the destination before data leaves.

If a live credential is accidentally exposed, treat it as potentially compromised: revoke or rotate it promptly, check relevant access records, and follow the service or team's incident procedure. Deleting the conversation alone does not invalidate the credential or remove all copies.

## Summary

- Follow data through the model, connected tools, logs, and backups. “Local model” describes only part of that route.
- Training, retention, memory, access, and deletion are separate controls. Memory may be on by default; for sensitive material, use a temporary chat or switch it off first.
- Use data tiers and minimization; authorized sensitive-data workflows need suitable safeguards.
- Keep actual credentials in secure settings, out of repositories and out of the agent's reach, and restrict the access already granted through connectors.
- If a key is exposed, rotate it and investigate; do not rely on chat deletion.

The next chapter looks at the other cost of AI use: money, quota, and unnecessary context.

## Sources and version notes

Checked on 2026-10-22; memory features and key-reading rules rechecked on 2026-10-27. The four-tier table is this book's practical framework, not a vendor policy or legal classification. Verify current terms for the service you use.

- [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.mdx): distinguishes local processing from cloud features and describes a local-only setting.
- [OpenAI Agents SDK tracing documentation](https://github.com/openai/openai-agents-python/blob/main/docs/tracing.md): traces can contain model and tool inputs/outputs and be exported to a backend; configuration controls sensitive-data capture.
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime): filesystem and network controls illustrate why credential access and outgoing connections both matter.
- [Claude Help Center: memory](https://support.claude.com/en/articles/11817273): memory generated from chats, default settings by plan, incognito chats, and the fact that deleting a chat does not remove memories generated from it.
- [Claude Code settings documentation](https://code.claude.com/docs/en/settings): an example of deny rules that stop `.env` files from being read.

---

## Quiz

> Six questions. Think first, then check the answer and explanation.

1. **[Basic · Concept]** Where can information go in an AI workflow? <!-- quiz: q01 revision: 2 -->
   - A. Depending on setup: the model, tools, logs, and storage
   - B. Only to the chat window, and it vanishes when you close it
   - C. Only into the model's training data, and nowhere else
   - D. To every connected service, which receives everything
   > **Answer: A.** Follow the actual data route. Model context may include selected files and tool results, and logs, traces, memories, and backups can keep copies, so B and C are too optimistic; but not every connected party receives everything either (D).

2. **[Basic · Concept]** Where should a real API key go when configuring an approved integration? <!-- quiz: q02 revision: 2 -->
   - A. In the prompt, so the AI can finish the setup
   - B. In the code file, so it is handy whenever you need it
   - C. In a screenshot, since an image is not text
   - D. In designated secure settings or a secret manager
   > **Answer: D.** Use placeholders when discussing configuration, and let secure storage restrict who and what can use the key. A prompt (A) or a screenshot (C) sends the key out, and putting it in code (B) lets it leak along with files or repositories.

3. **[Advanced · Misconception]** A service says it does not train on your content. What still needs checking? <!-- quiz: q03 revision: 2 -->
   - A. Nothing; no training means nothing is stored at all
   - B. Retention, access, deletion, and connected tools
   - C. Nothing, if it is a paid plan; paid terms are all safe
   - D. Only the model name; newer models care more about privacy
   > **Answer: B.** No training is a specific promise, not a promise of zero storage or unrestricted suitability for sensitive data, and memory features need their own check. Whether a plan is paid (C) or which model it uses (D) does not answer the retention, access, and deletion questions.

4. **[Advanced · Scenario]** You use a local model with a cloud search tool and remote tracing enabled. Is the whole workflow necessarily offline? <!-- quiz: q04 revision: 2 -->
   - A. Yes; if the model is local, the whole workflow is offline
   - B. Yes, as long as you open a new chat each time
   - C. No; search requests and traces leave the device
   - D. No; a local model cannot run offline in the first place
   > **Answer: C.** A model running locally can work offline, but the surrounding application and tools determine the complete data route. A new chat (B) does not change where tools send data, and a local model itself can run offline (D).

5. **[Basic · Scenario]** You only need help polishing an email's wording. What is a good default for its customer's name and account number? <!-- quiz: q05 revision: 2 -->
   - A. Include both; more detail makes the polishing more accurate
   - B. Replace or remove them and use an approved service
   - C. Send a screenshot instead, so they are not text data
   - D. Remove only the name; the account number is anonymous
   > **Answer: B.** Minimize the input. A screenshot is still data (C), and other details can identify a person, so removing only the name is no guarantee of anonymity (D). Approved workflows may process necessary personal information with appropriate safeguards.

6. **[Hands-on · Observation]** Without entering private information, inspect an AI app you use. Identify its model route, connected tools, training setting, memory feature, and retention or deletion policy. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** These answers may live in different settings or documents, and memory may be on by default. Include any logs, shared workspaces, and backups you control. If a live credential was exposed, revocation or rotation is needed; deleting the conversation is not a substitute.
