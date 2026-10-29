You ask an assistant about your company's travel policy. Its training data may include general travel advice, but that can't tell you what your employer actually allows. The safer approach is to find your company's policy first and answer from that. RAG automates that process.

## 1. Why it's needed: three problems AI can't solve on its own

A model's training knowledge can be out of date (training data has a cutoff, Chapter 9), it doesn't include your private documents, and it often can't supply details you could verify. Giving it current material you're authorized to access solves much of this, but it doesn't make the model or the material infallible.

## 2. An analogy: turn a "closed-book exam" into an "open-book exam"

RAG stands for retrieval-augmented generation: first retrieve the material, then answer from it. Retrieval can mean searching documents, querying database records or searching the web.

The figure below shows a typical RAG system. The top half happens once, ahead of time: documents are split into small chunks and indexed. The bottom half runs every time you ask: the most relevant chunks are found in the index, put into the context together with your question, and the model answers from them with citations.

![The RAG pipeline: in the top half, documents are split into small chunks ahead of time and indexed by keywords and vectors; in the bottom half, each question triggers a search of the index for the most relevant chunks, which go into the context with the question, and the model answers with citations; a label notes that the model's parameters stay unchanged](/figures/en/rag-pipeline.svg)

The open-book comparison fits well: even with the book open, you still have to find the right page, understand it and notice the exceptions. Pasting a short document into a chat demonstrates "answer from the material provided," with you choosing the material by hand; automatic retrieval needs the machinery in the top half of the figure.

## 3. How it "looks up material": keywords, meaning and filters

There is no single required retrieval method:

| Method | What it helps with | Example |
| --- | --- | --- |
| Keyword / exact matching | Precise names, codes and quoted terms | Find policy `TR-2026-04` |
| Semantic search using embeddings | Related meaning expressed in different words | "Claim meal costs" finds "meal reimbursement" |
| Hybrid search | Combines text and vector retrieval | Match both the policy code and the topic |
| Filters and ranking | Limit scope and put likely useful results first | Current version, relevant department, authorized documents |

As Chapter 5 explained, an embedding represents aspects of a word's or sentence's meaning as a list of numbers (a vector), and similar meanings get similar numbers. Vector search compares those numbers to find passages with related meaning. You can use a dedicated vector database or an ordinary database that supports vector search; RAG itself doesn't care which. Exact wording sometimes matters a lot, and a passage that means something similar doesn't necessarily answer the question.

Documents are usually split into chunks first. For a concrete example: as of October 2026, an open-source RAG sample that Microsoft publishes on GitHub splits documents into chunks of about 1,000 characters by default (roughly 400 to 500 tokens of English), overlaps neighboring chunks by 10%, and records the source file and page number for each chunk so answers can cite them. The cost of chunking is that a spending limit in one chunk can get separated from its exception in another. Scans, charts and tables need proper text extraction, and uploading a PDF doesn't guarantee every part was read correctly.

## 4. The most important point: RAG doesn't change the model, it just hands it a few pages for now

What retrieval finds just goes into the context for this one answer; training or fine-tuning is a different thing.

> **Key point:** Retrieval does not update the model's parameters, the numbers learned in training that Chapter 2 described. The model has not "learned" your document; it simply has a few extra pages at hand for this answer.

"Not training" doesn't mean "nothing is stored," either. Depending on its settings, a product may keep uploaded files, a search index, conversation history or logs; retrieved material may stay in later turns of the conversation or be retrieved again. Check how long things are kept and how to delete them separately from whether the model learned anything (Chapter 37).

## 5. What it can and can't fix

RAG can attach checkable evidence to an answer, but errors can happen at different stages:

| Problem | What you may see | What to do |
| --- | --- | --- |
| Wrong or outdated source | A precise answer based on last year's policy | Check effective dates and replacement versions |
| Relevant passage not retrieved | The file has it, but the system says it found nothing | Retry with exact terms, the file name or a narrower question; inspect the search results |
| Table or exception not extracted | A general rule presented as universal | Open the original page and nearby clauses |
| Generation goes beyond the evidence | A real citation that doesn't support the conclusion | Compare each important claim with the cited passage |
| Conflicting sources | One confident answer hides a disagreement | Ask for both sources, dates and the unresolved difference |

A citation is a way into the evidence, not a certificate of correctness. Open it and check whether the original really supports this claim, whether it applies to your situation and dates, and whether the source is in a position to say so. "No evidence was retrieved" is also not the same as "the answer is no."

Searching private material has to respect access rights: once a shared knowledge base is connected, people who couldn't open a file before still shouldn't be able to read it through the assistant. Retrieved content can also contain malicious instructions; it's material to analyze and can't change the task (prompt injection, Chapter 22).

## 6. Putting it together: one complete RAG answer

Suppose you ask, "Can I claim a taxi after 10 p.m.?" A good system retrieves the current policy, finds both the transport rule and the approval conditions, and answers with clause or page references. If it only finds the meal policy, it should say it couldn't find support for that part, search a different way, or ask you for the document.

A practical request:

> Use the current travel policy to explain the taxi rules, exceptions and required approvals. Cite the document name, effective date and clause for each important claim. Mark anything the retrieved sources do not answer as unknown; do not fill it in from general knowledge.

Asking this way makes the result easier to check, but it can't guarantee the retrieval succeeded. For any clause that affects a decision, read the original.

## 7. Common misconceptions, corrected

| Misconception | Correction |
| --- | --- |
| RAG only uses vector search | It can use keyword, vector, hybrid and other retrieval methods |
| Uploading a file trains the model | Retrieval supplies context; training and storage are separate questions |
| A citation means the answer is correct | Check the source, its date and whether it supports the claim |
| If retrieval found nothing, it doesn't exist | Search can miss material that is there |

## Summary

RAG retrieves first and answers second: documents are chunked and indexed ahead of time, each question pulls the most relevant chunks into the context alongside it, and the model's parameters never change. Answer quality depends on the sources, text extraction, retrieval and interpretation. Ask it to show its sources and gaps, and check important claims against the original. The next chapter looks at where this processing happens: in the cloud or on your own computer.

## Sources and version notes

Checked October 29, 2026 (repository links point to snapshots from October 22, 2026).

- [Azure RAG example](https://github.com/Azure-Samples/azure-search-openai-demo/blob/558ffd397eddcfe4da5c85ebc285796b367eb9b2/README.md) · [Retrieval implementation](https://github.com/Azure-Samples/azure-search-openai-demo/blob/558ffd397eddcfe4da5c85ebc285796b367eb9b2/app/backend/approaches/approach.py): retrieve-then-generate, with keyword, vector and hybrid retrieval.
- [Azure RAG example: data ingestion and chunking](https://github.com/Azure-Samples/azure-search-openai-demo/blob/558ffd397eddcfe4da5c85ebc285796b367eb9b2/docs/data_ingestion.md): about 1,000 characters per chunk by default, 10% overlap between neighboring chunks, and the source file and page number stored with each chunk.

---

## Quiz

1. **[Basic · Concept]** What is the essential RAG sequence? <!-- quiz: q01 revision: 2 -->
   - A. Fine-tune the model on your documents, then answer
   - B. Write the answer first, then look for supporting sources
   - C. Retrieve relevant material, then answer based on it
   - D. Put every document into the context at once, then answer
   > **Answer: C.** Retrieval supplies evidence for generation without changing the model's parameters. A describes fine-tuning, which is a different process; B reverses the order and tends to justify a conclusion after the fact; D is not retrieval and breaks down once there is a lot of material.

2. **[Basic · Concept]** Which retrieval design can be used in RAG? <!-- quiz: q02 revision: 2 -->
   - A. Keyword, vector, hybrid or another suitable method
   - B. Only semantic search in a dedicated vector database
   - C. Only exact keyword matching, with no sense of meaning
   - D. Only the knowledge the model memorized in training
   > **Answer: A.** The right method depends on the material and the question: codes and quoted terms suit keywords, while the same idea in different words suits semantic search. RAG does not require a dedicated vector database (B); C names just one method, and D is not retrieval at all.

3. **[Intermediate · Misconception]** A RAG system does not train on a document during retrieval. What follows about storage? <!-- quiz: q03 revision: 2 -->
   - A. Files and chat logs are deleted automatically after the answer
   - B. Since nothing is trained, the product stores nothing at all
   - C. The document has become part of the model's parameters
   - D. Nothing definite; storage rules need to be checked separately
   > **Answer: D.** Model parameters, stored documents, search indexes and chat history are different things. “Not training” does not mean “not storing” (A, B), and retrieval does not write documents into the model's parameters (C).

4. **[Basic · Evidence]** An answer contains a citation. What should you verify? <!-- quiz: q04 revision: 2 -->
   - A. That the link opens; if it does, all is well
   - B. That the source applies and really supports the claim
   - C. That there are enough citations; more means more reliable
   - D. Nothing; a citation shows the sources were checked
   > **Answer: B.** A real citation may still point to an old, irrelevant or misread passage. A link that opens (A) or a large number of citations (C) does not show support for the claim, and D treats a citation as a certificate of truth.

5. **[Intermediate · Scenario]** A system reports no evidence for a rule you can see in a document. What is a plausible explanation? <!-- quiz: q05 revision: 2 -->
   - A. The model never saw the document in training
   - B. Since it wasn't found, the rule must no longer apply
   - C. Retrieval or text extraction missed the passage
   - D. RAG only reads the first page of long documents
   > **Answer: C.** “Not found” describes the search outcome, not necessarily the document's contents; tables, scans or chunking can cause a passage to be missed. RAG does not depend on the model having seen the document in training (A), “not retrieved” does not mean “no longer valid” (B), and D is a baseless guess.

6. **[Basic · Observation]** You paste a short policy into a chat and ask for a cited answer. What have you demonstrated? <!-- quiz: q06 revision: 2 -->
   - A. Answering from supplied material you retrieved yourself
   - B. A complete RAG system that retrieves automatically
   - C. That the model will now remember this policy for good
   - D. That the answer must be correct because it cites a source
   > **Answer: A.** You picked the material by hand, so this shows the "answer from material" half of RAG; automated retrieval needs a separate mechanism (B). Pasting into a chat does not make the model learn it permanently (C), and a cited answer still needs checking (D).
