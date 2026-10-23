You ask an assistant about your organization's travel policy. Its training may contain general travel advice, but that cannot establish your employer's actual rules. The useful approach is to find the relevant policy and answer from it. RAG helps automate that process.

## 1. Why it's needed: three problems AI can't solve on its own

A model's training knowledge can be **out of date**, omit **private documents**, or be insufficient for **verifiable detail**. Supplying current, authorized sources can help. It does not make the model or the sources infallible.

## 2. The one-line intuition: turn a "closed-book exam" into an "open-book exam"

**RAG means retrieval-augmented generation: retrieve relevant material, then use it while generating an answer.** The retrieval step might search documents, query records or look up web pages.

```text
Question → retrieve relevant evidence → give evidence and question to the model
         → generate an answer with traceable sources → check important claims
```

The open-book metaphor is useful because the reader must still find the right page, interpret it correctly and notice exceptions. Pasting a short document into a chat demonstrates answering with supplied context; it is not, by itself, an automated retrieval system.

## 3. How it "looks up material": keywords, meaning and filters

There is no single required retrieval method:

| Method | What it helps with | Example |
| --- | --- | --- |
| Keyword / exact matching | Precise names, codes and quoted terms | Find policy `TR-2026-04` |
| Semantic search using embeddings | Related meaning expressed in different words | “Claim meal costs” finds “meal reimbursement” |
| Hybrid search | Combines text and vector retrieval | Match both the policy code and the topic |
| Filters and ranking | Limit scope and prioritize likely useful results | Current version, relevant department, authorized documents |

An embedding represents aspects of meaning as numbers. Vector search compares those representations. A vector database or a database with vector-search support can help, but **RAG does not require a dedicated vector database**. Exact words can be crucial, and semantic similarity is not proof that a passage answers the question.

Documents are often split into chunks. This makes them easier to retrieve, but a limit in one chunk and its exception in another may become separated. Scans, charts and tables also need suitable extraction or image processing; uploading a PDF does not guarantee every part was read correctly.

## 4. The point to be clearest on: RAG doesn't "remake" the model, it just feeds material temporarily

Retrieval puts selected material into the model's input context. **This step does not update the model's parameters.** Training or fine-tuning is a separate process.

“Not training” does not mean “nothing is stored.” The product may keep uploaded files, a search index, conversation history or logs according to its settings. Retrieved material may remain in the conversation or be retrieved again later. Check retention and deletion behavior separately from whether a model learns from the content.

## 5. What it can and can't solve (don't make it magic)

RAG can give the answer a checkable basis. Failures can arise at different points:

| What goes wrong | What you might see | A useful response |
| --- | --- | --- |
| Wrong or stale source | A precise answer using last year's policy | Check effective dates and superseded versions |
| Retrieval misses the relevant passage | “Not found,” although the file contains it | Try an exact term, file name or narrower question; inspect search results |
| Table or exception is missing | A general rule is presented as universal | Open the original page and adjacent sections |
| Generation overstates the evidence | The citation exists but does not support the conclusion | Compare each important claim with its quoted passage |
| Sources conflict | One confident answer hides disagreement | Ask for both sources, dates and unresolved differences |

A citation is a **route to inspect evidence**, not a certificate of truth. Open it. Check that the passage supports the particular claim, applies to the right people and dates, and comes from a suitable authority. “No evidence was retrieved” also differs from “the answer is no.”

Private retrieval must respect access permissions. Connecting a shared knowledge base should not make documents visible to people who could not otherwise read them. Retrieved text can also contain malicious instructions; treat it as material to analyze, not authority to change the task.

## 6. Pulling it together: the full picture of one RAG Q&A

Suppose you ask, “Can I claim a taxi after 10 p.m.?” A useful system searches the current policy, retrieves the transport rule **and** any approval conditions, and answers with a section or page reference. If it retrieves only a meal policy, it should say it lacks the relevant evidence and try a better search or ask for the document.

A practical request is:

> Use the current travel policy. State the taxi rule, exceptions and required approval. Cite the document title, effective date and section for each important claim. If the retrieved sources do not answer a point, mark it unknown instead of filling it from general knowledge.

These instructions improve inspectability; they do not guarantee that retrieval will succeed. You still check the passages that affect the decision.

## 7. Common misconceptions, cleared up

| Misconception | Correction |
| --- | --- |
| RAG means only vector search | Keyword, vector, hybrid and other retrieval methods can be used |
| Uploading a file trains the model | Retrieval supplies context; training and storage are separate issues |
| A citation makes the answer correct | Its source, date and support for the claim need checking |
| Not retrieved means not present | Search can miss existing material |

## Summary

RAG connects an answer to retrieved material. Its quality depends on the source, extraction, retrieval and interpretation. Ask for sources and gaps, then inspect the evidence behind important claims. The next chapter asks where the processing takes place: on a cloud service or on your own computer.

---

**Verification scope — October 22, 2026:** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[Azure RAG example](https://github.com/Azure-Samples/azure-search-openai-demo/blob/558ffd397eddcfe4da5c85ebc285796b367eb9b2/README.md) · [Retrieval implementation](https://github.com/Azure-Samples/azure-search-openai-demo/blob/558ffd397eddcfe4da5c85ebc285796b367eb9b2/app/backend/approaches/approach.py)

---

## Quiz

1. **[Basic · Concept]** What is the essential RAG sequence? <!-- quiz: q01 revision: 1 -->
   - A. Retrain the model before every reply
   - B. Retrieve relevant material, then generate using that material
   - C. Generate an answer and invent a source afterward
   - D. Store every document in the model's parameters
   > **Answer: B.** Retrieval supplies evidence for generation without inherently changing model weights.

2. **[Basic · Concept]** Which retrieval design can be used in RAG? <!-- quiz: q02 revision: 1 -->
   - A. Only vectors in a dedicated vector database
   - B. Only a literal full-document scan
   - C. Only the model's training memory
   - D. Keyword search, vector search, hybrid search or another suitable retrieval method
   > **Answer: D.** The appropriate method depends on the material and the question.

3. **[Intermediate · Misconception]** A RAG system does not train on a document during retrieval. What follows about storage? <!-- quiz: q03 revision: 1 -->
   - A. The file and history must be deleted immediately
   - B. The product cannot create an index
   - C. Nothing definite: storage and retention must be checked separately
   - D. The document must be public
   > **Answer: C.** Model parameters, stored documents, indexes and chat history are different things.

4. **[Basic · Evidence]** An answer contains a citation. What should you verify? <!-- quiz: q04 revision: 1 -->
   - A. The source exists, is applicable and actually supports the claim
   - B. Only that the link is blue
   - C. Only the length of the answer
   - D. Nothing; citations guarantee truth
   > **Answer: A.** A real citation may still point to an old, irrelevant or misinterpreted passage.

5. **[Intermediate · Scenario]** A system reports no evidence for a rule you can see in a document. What is a plausible explanation? <!-- quiz: q05 revision: 1 -->
   - A. The document cannot exist
   - B. Retrieval or extraction missed the passage
   - C. RAG has retrained the model incorrectly
   - D. Your question proves the rule is false
   > **Answer: B.** “Not found” describes the search outcome, not necessarily the document's contents.

6. **[Basic · Observation]** You paste a short policy into a chat and ask for a cited answer. What have you demonstrated? <!-- quiz: q06 revision: 1 -->
   - A. A complete automated retrieval system
   - B. Permanent training on the policy
   - C. Guaranteed correctness
   - D. Answering with supplied context, which illustrates part of RAG without automating retrieval
   > **Answer: D.** You manually selected the material; the retrieval step still needs a separate mechanism.
