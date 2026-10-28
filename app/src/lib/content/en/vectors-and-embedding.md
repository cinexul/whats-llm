In Chapter 4 we saw how the model strings words together by "guessing the next word." But there's a problem we can't get around: a computer only understands numbers. It has no idea what "cat," "dog," or "happy" even are. So how does it know that **"cat" and "dog" are close in meaning, while "cat" and "rebar" have nothing to do with each other**? And how does it work out "which words belong together"?

The answer hides in an idea that sounds very mathematical but is actually easy to grasp: **give every word and every sentence a set of "coordinates." For a suitable embedding model, related meanings tend to receive nearby coordinates.** Those "coordinates" are the two stars of this chapter: the **vector** and the **embedding**.

This is the most "abstract" chapter in Part One, but it holds up a big chunk of what comes later: why "saying it a different way" changes the result (Chapter 11), and how search and RAG (Chapter 20) manage to find material "by meaning." We'll go step by step with good metaphors, and you won't get lost.

## 1. The core idea: turning "meaning" into "coordinates"

Start with an analogy you already know: **cities on a map can be pinned down with just two numbers, longitude and latitude.**

- Beijing is `(116, 40)`, Tianjin is `(117, 39)`. The two sets of numbers are very close, because the two cities are **geographically near each other**.
- Shanghai is `(121, 31)`, so its numbers sit **a bit further** from Beijing's.

With just these two numbers, the computer doesn't need to "know" anything about the cities. It only has to **work out the distance between two sets of numbers** to know who's near whom.

**What vectors and embeddings do is take this trick of using coordinates to express nearness and move it over to word meaning.** The only difference is that this time the coordinates express not nearness in **geographic position** but nearness in **meaning**:

```text
Map:       use (longitude, latitude) for "geographic position"  →  distance = how geographically near
Meaning:   use (a long string of numbers) for "meaning"         →  distance = how near in meaning
```

- A **vector** is that "long string of numbers" itself, the "coordinates" assigned to a given word or sentence. (Map coordinates use only 2 numbers; coordinates for meaning take **hundreds or even thousands of numbers**, because "meaning" is far more complicated than "geographic position," and two or three numbers aren't nearly enough to tell things apart.)
- An **embedding** is the act of **turning a piece of text into these coordinates** (and the result you get out). The name "embedding" means you're embedding the word into a space described by coordinates, so every word has a place to stand.

> **Key point:** An embedding maps text to a vector—a numerical representation that can help estimate semantic similarity. This is an approximation learned from data, not a perfect map of meaning. Similarity depends on the embedding model, context, and comparison method; related texts can be missed, and unrelated ones can appear close.

## 2. Why bother doing this at all? Because a computer can only do arithmetic

Step back and ask: why go to all this trouble to turn a perfectly good word into a string of numbers?

Because that "guess the next word" machine from the earlier chapters runs on **nothing but number-crunching underneath** (Chapters 1 and 2). It can't add, subtract, multiply, or divide the word "cat" directly. But the moment you turn "cat" into a string of numbers (coordinates), everything becomes **computable**:

- Want to know whether two words are close in meaning? → **Compute the distance between their two coordinates** (near = close in meaning).
- Want to "rank a pile of material by relevance"? → Turn it all into coordinates and **line it up by how near each one is to the question's coordinates**.
- Need the model to judge whether one word should follow another? → Again, it relies on the mathematical relationship between coordinates.

```text
No coordinates:  the computer faces "cat" and "dog" → two symbols it doesn't recognize, nothing to go on
With coordinates: "cat"→a string of numbers, "dog"→a string of numbers → compute the distance, find it's small → "ah, these two are close in meaning"
```

> **Why we need it:** Embeddings are one useful way to make relationships between pieces of text computable. They support semantic search, but are not the only way to find relevant text; keyword search, synonym rules, and other techniques can also help.

## 3. The most famous intuition: you can do "arithmetic" on meaning

This is the example people reach for most often when explaining embeddings.

Since words have become coordinates (vectors), and coordinates can be added and subtracted, the amazing thing is that **doing arithmetic on coordinates of meaning gives results that also follow the logic of meaning**. The classic one:

```text
   "king"'s coordinates  −  "man"'s coordinates  +  "woman"'s coordinates  ≈  "queen"'s coordinates
```

Read out loud: **take king, subtract "male," add "female," and the coordinates you land on fall right next to "queen."**

Why does this happen? Because during training, the model noticed from a huge amount of text that "king" and "man," and "queen" and "woman," get used in very similar ways; and that the difference between "king" and "queen" is the same kind of difference as the one between "man" and "woman" (both come down to "gender"). So this "gender relationship" gets **encoded as a roughly consistent "direction" in the coordinate space**. Walk along that direction and you more or less "switch the gender."

There are other examples like it (they too hold only roughly):

| Arithmetic on coordinates | Result lands roughly at | The relationship it captures |
| --- | --- | --- |
| Paris − France + Japan | ≈ Tokyo | the "capital of a country" relationship |
| walk → walked, run → ran | the same "direction" | the "turn into past tense" relationship |
| big → bigger, small → smaller | the same "direction" | the "more intense" relationship |

> **Key point:** Don't let "arithmetic" scare you. What it's really saying is plain: **the "meaning relationships" between words (gender, capital, tense, and so on) can show up as rough "directions and distances" in coordinate space.** In other words, an embedding holds not only isolated words but some of the relationships between them. Here "≈" means "lands roughly nearby," not an equals sign.

This example also has a source and limits. It comes from research around 2013 on **static word vectors** ("static" meaning each word has one fixed coordinate regardless of context; word2vec became popular at that time). Even then, the arithmetic worked only for some examples: the paper that first reported it answered just under 40% of its grammatical analogy questions correctly, and swapping in other words often breaks it. In today's large language models, a word's representation changes with context, so simple addition like this is even less to be expected. Take it as an intuition that relationships can become directions, not as a rule.

## 4. A search representation is not an archive or a privacy guarantee

This is the misunderstanding the chapter most wants to clear up, so lock it in.

An embedding is a learned numerical representation used to compare text. It is **not a lossless archive with a standard “unzip” operation**, so a retrieval system normally keeps the source text separately.

But **not directly readable does not mean impossible to reconstruct**. Research on embedding inversion has recovered substantial wording, sometimes exact text, from vectors under particular conditions. Recovery depends on the embedding model, text, and attacker’s information and methods. An embedding is **not encryption or guaranteed anonymization**; protect vectors derived from sensitive data too.

```text
Original:           "I went for a walk in the park today and felt great."
Made into an embedding: [0.12, -0.83, 0.05, 0.41, ……]  ← a few hundred numbers
Can an ordinary decoder restore the text exactly? There is no general guarantee; inversion attacks may nevertheless recover text.
What can it do?     Compute how near it is in meaning to other sentences.
```

> **Practical rule:** Keep the **source text and its citation separately** when you need reliable quotations in RAG. The vector helps find relevant material. Apply appropriate access controls to both the source and its vectors; converting sensitive text to embeddings does not by itself make it safe to publish.

## 5. What it's good for: semantic search and RAG

A major use of embeddings is **semantic search**: finding material with related meaning even when the wording differs. It is one common retrieval method used in RAG (Chapter 20).

Simple keyword search can miss relevant material when wording differs. For example, "make my computer run faster" and "improving computer performance" share "computer," but express the main action differently. Keyword systems can also use synonyms and other matching techniques; the distinction is not simply "words versus meaning."

Embeddings offer another approach: **represent the material as vectors, then search by similarity**:

```text
Roughly how search-by-meaning (embedding) works:
  ① Ahead of time: turn every passage in the library into an embedding (each gets a "coordinate of meaning")
  ② You ask: "how do I make my computer run faster" → also turned into an embedding (one coordinate)
  ③ In the coordinate space, find the few passages whose coordinates are "nearest" to your question's coordinate
  ④ Passages with different wording may rank highly if their vectors are similar; check their relevance
```

An embedding search may rank the "improving computer performance" article highly because its vector is similar to the query's. That is a useful signal, not a guarantee that the article is relevant or correct.

**RAG (retrieval-augmented generation, Chapter 20)** retrieves relevant material, then supplies it as context for an answer. Retrieval may use **embeddings, keywords, or a combination of both**. Embeddings are not required. Whatever the method, check the retrieved passages and their sources: retrieval can reduce unsupported answers, but can also miss evidence or retrieve misleading material.

> **How you'll actually run into this:** When you hear a product say "it can search by understanding your meaning" or "it can find the relevant passages in the hundreds of pages you uploaded," it's usually embeddings doing the work behind the scenes, turning both the documents and your question into coordinates and matching by nearness. How a given product actually does it, and how well it works, is best confirmed against its official documentation; but the principle of making coordinates first and then finding by meaning carries across.

## 6. Back to an old question: why does "saying it differently" change the result?

Now that you've learned embeddings, a common puzzle from Chapter 4 and from Chapter 11 later can finally be explained.

You've probably hit this: ask the AI the same thing but **swap a few words**, and the answer is **noticeably different**. Why so sensitive?

Changing the wording can change tokenization, internal representations, and how the model interprets the instructions. Sampling can also produce different answers to identical wording. **Token embeddings inside a language model and sentence embeddings used for search are related ideas, but they are not the same representation or a complete explanation of the output.**

> **Key point:** Clear instructions can improve the result, but there is no single “right coordinate” that guarantees a correct answer. Compare outputs against your task’s requirements; do not infer an embedding distance just from a different reply (Chapter 11).

## 7. Common misconceptions, set straight

| Common misconception | Reality |
| --- | --- |
| An embedding is a complete, recoverable text archive | It is a learned representation, with no general lossless decoding guarantee; some text may still be reconstructed by inversion attacks |
| A vector hides the text securely | Embeddings are not encryption or guaranteed anonymization. Protect sensitive vectors as well as source documents |
| Two numbers (like longitude and latitude) are enough to represent meaning | Meaning is too complex; it takes **hundreds or thousands of numbers** to tell things apart, far more than two or three dimensions |
| "king − man + woman ≈ queen" shows you can add and subtract meanings as precisely as math | It's a famous example from 2013-era static word vectors that holds roughly for only some words; modern LLM representations can't be added up this simply |
| Semantic search requires identical wording | Embeddings can find related wording; keyword search and hybrid methods are also useful, and retrieval quality still needs evaluation |
| Saying it differently changes the result, so the AI is buggy | Wording, context, model processing, and sampling can all affect the answer. A changed answer alone does not diagnose a bug |

## Summary

- **The core idea:** give a word or sentence a "**coordinate of meaning**." That string of numbers is the **vector**; the process or result of making it is the **embedding**; **the coordinates can help estimate similarity in meaning**.
- **Why we need it:** a computer can only do arithmetic and doesn't recognize words. Once things become coordinates, the machine can **"sense" nearness in meaning by computing distance**. That's its bridge to handling meaning.
- **The signature intuition:** "king − man + woman ≈ queen" shows that some **meaning relationships** between words can appear as rough directions in coordinate space. It comes from 2013-era static word vectors and holds only for some examples; it isn't a rule.
- **The core correction:** embeddings support similarity search; they do not replace reliable source storage or provide a privacy guarantee. Reconstruction is possible under some conditions, so protect sensitive vectors.
- **A major use:** semantic search and RAG (Chapter 20). Embeddings are one retrieval option; keyword search and hybrid methods can also retrieve useful evidence.
- **Back-reference:** rephrasing can change the result, but output differences alone do not measure semantic distance. Compare prompt clarity and verify the answer (Chapters 4 and 11).

With this chapter closed, the core of Part One on "the model's inner workings" is complete: tokens and context (Chapter 3), how it guesses the next word (Chapter 4), and how it uses coordinates to represent meaning (Chapter 5). Next (Chapter 6) we look at one more key piece of machinery, the one that lets it **"pick out what matters,"** attention and the Transformer (pure intuition, zero formulas).

## Sources and verification

- Morris et al., *Text Embeddings Reveal (Almost) As Much As Text* (2023): [authors’ vec2text implementation and paper link](https://github.com/jxmorris12/vec2text). It demonstrates text reconstruction under studied conditions, not guaranteed recovery of every embedding. Source checked 2026-10-22.
- Mikolov, Yih, and Zweig, *Linguistic Regularities in Continuous Space Word Representations* (NAACL 2013): [paper page](https://aclanthology.org/N13-1090/). The abstract gives the example of "King − Man + Woman" landing close to "Queen," and reports answering just under 40% of the grammatical analogy questions correctly. Source checked 2026-10-27.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most fitting way to understand making a word into an embedding? <!-- quiz: q01 revision: 2 -->
   - A. Giving a word or sentence numeric coordinates to estimate how close meanings are
   - B. Translating the word into a machine-only language, with meaning kept one-to-one
   - C. Encrypting the word into a string of numbers so nobody who gets it can read the text
   - D. Giving each word a fixed serial number, where closer numbers mean closer meanings
   > **Answer: A.** An embedding is a numeric representation that helps compare how close pieces of text are in meaning; the similarity is approximate and depends on the model and comparison method. B treats it as translation, but an embedding doesn't guarantee a one-to-one match of meaning. C treats it as encryption, which section 4 of this chapter corrects. D is the most believable: a serial number is just a label, and neighboring numbers have no link in meaning, whereas an embedding is a long string of numbers compared by overall distance.

2. **[Basic · Concept]** Why turn a word into a string of numbers (a vector) instead of having the computer handle the text directly? <!-- quiz: q02 revision: 2 -->
   - A. Numbers take up less space than text, so converting saves a lot of storage
   - B. Once it's numbers, the model truly understands the word and won't misread it
   - C. Computers only do math; as coordinates, closeness can be measured by distance
   - D. The numbers put words in a fixed order, to make alphabetical lookups easier
   > **Answer: C.** Once words are coordinates, "which two words are similar in meaning" becomes something you can compute (as in chapters 1 and 2, it's all number-crunching underneath). A isn't the goal; a string of hundreds or thousands of numbers often takes more space than the text. B goes too far: coordinates help estimate similarity, which isn't "truly understanding," and errors still happen. D confuses vectors with sort order.

3. **[Advanced · Misconception]** “After I turn sensitive text into an embedding, it is safe to publish because nobody can reconstruct the text.” What is wrong? <!-- quiz: q03 revision: 2 -->
   - A. Nothing; a vector is just numbers, and no one can read any information from it
   - B. It's wrong because any vector can be turned back into text with one click of a tool
   - C. It's fine as long as you make the vectors with an obscure model nobody knows
   - D. A vector isn't encryption; in some conditions text can be recovered, so protect it
   > **Answer: D.** The lack of a universal lossless decoder doesn't guarantee secrecy; research has reconstructed text from vectors for some models and conditions. A is the very misconception to correct. B overstates the risk: recovery depends on the model, the text, and what an attacker knows, so not every vector can be reversed with one click. C is security through obscurity and is no substitute for access control.

4. **[Advanced · Concept]** What does the famous example "king − man + woman ≈ queen" best illustrate about embeddings? <!-- quiz: q04 revision: 2 -->
   - A. Word meanings add and subtract as precisely as arithmetic, for any words at all
   - B. Some relationships between words can show up as rough directions in the coordinates
   - C. King and queen share the same coordinates in the model and are fully interchangeable
   - D. The model stores the original text of "queen" right next to the word "king"
   > **Answer: B.** The example shows that a relationship like "switch the gender" can appear as a rough direction in the coordinates. A turns it into a rule: the example comes from 2013-era static word vectors, where it held only for some examples, and modern LLM representations can't be added up this simply. C is wrong: "≈" means landing nearby; the two words don't share coordinates. D treats vectors as a place to store original text.

5. **[Basic · Scenario]** In a tool that supports "search by meaning," you search "how do I make my computer run faster," and it puts an article titled "Methods for improving computer performance" at the very top, even though the phrase "run faster" never appears in it. What's the most reasonable explanation? <!-- quiz: q05 revision: 2 -->
   - A. It's a bug; an article that doesn't match the keywords shouldn't show up at all
   - B. That article must have secretly added "run faster" as a hidden keyword somewhere
   - C. Ranking by meaning can put a related article first even with different wording
   - D. Being ranked first proves it's the most relevant, so you can use it without reading
   > **Answer: C.** Embedding search ranks passages by vector similarity, so an article close in meaning can rank high even when the key phrases differ. That's a reasonable explanation, though it doesn't prove how the tool works inside: keyword search with synonyms, or hybrid search, could find it too. A mistakes "search by meaning" for literal matching only. B has no basis. D swings to over-trust: high similarity is just a signal, and you still need to check whether the article is really relevant and correct.

6. **[Basic · Hands-on]** Ask the same model to edit the same public paragraph using three phrasings: “make this easier to read,” “polish this text,” and “fix awkward sentences.” Record which edits satisfy the intended task. What does this comparison establish, and what can it not establish about embeddings? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Wording may change, but this experiment alone cannot measure embedding distance or isolate why the answers differ: sampling, instructions, and the model’s full processing also matter. Use it to compare how clearly each prompt states the task. To test semantic similarity directly, use one embedding model on all examples and compare its similarity scores; do not compare vectors from different models.
