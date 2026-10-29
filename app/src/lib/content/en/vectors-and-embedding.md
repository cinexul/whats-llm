In Chapter 4 we saw the model carry a sentence forward by "guessing the next word." But a computer only handles numbers. It has no idea what "cat," "dog," or "happy" are. So how does it know that "cat" and "dog" are close in meaning, while "cat" and "rebar" have nothing to do with each other?

The trick is to give every word and every sentence a set of "coordinates." In a well-trained embedding model, text with related meanings tends to get nearby coordinates. This chapter is about those coordinates (vectors) and the way text is turned into them (embedding). Later topics build on it: why "saying it differently" changes the result (Chapter 11), and how RAG finds material by meaning (Chapter 20).

## 1. The core idea: turning "meaning" into "coordinates"

Think of a map first. A city can be pinned down with two numbers, longitude and latitude:

- Beijing is roughly `(116, 40)` and Tianjin is `(117, 39)`. The numbers are close because the cities are close.
- Shanghai is `(121, 31)`, a bit further from Beijing's numbers.

The computer doesn't need to "know" these cities. It only has to compute the distance between two sets of numbers to tell which are near each other. Embeddings bring the same trick to word meaning: the coordinates stand for meaning instead of location.

```text
Map:       use (longitude, latitude) for "geographic position"  →  distance = how geographically near
Meaning:   use (a long string of numbers) for "meaning"         →  distance = how near in meaning
```

- A **vector** is that long string of numbers: the "coordinates" of a word or sentence.
- An **embedding** is the act of turning a piece of text into such coordinates, and also the result. The name means the text is "embedded" in a space of coordinates, so each piece of text has a place to stand.

The figure below draws this idea as a flat map. Animals, fruit, and feelings each form a cluster: words in the same cluster sit close together, and words in different clusters sit far apart.

![Sketch: three clusters of words on a flat map. Cat, dog, and rabbit sit together; apple, banana, and grape sit together; happy, sad, and angry sit together. A short dashed line between cat and dog marks a small distance and similar meaning; a long dashed line between dog and apple marks a large distance and different meaning](/figures/en/embedding-map.svg)

This map is a flattened sketch. Real embeddings have hundreds or thousands of dimensions, that is, hundreds or thousands of numbers. As of October 2026, OpenAI's text-embedding-3-small outputs 1,536 numbers by default and text-embedding-3-large outputs 3,072. The vectors a large language model uses internally for each token are on the same scale; Qwen3-8B uses 4,096. Meaning is far more complicated than location, and two or three numbers can't keep things apart. Nor do the individual numbers have ready-made meanings like an "animal axis" or a "fruit axis"; what matters is overall nearness.

Keep in mind, too, that an embedding is an approximation learned from data, not a perfect map of meaning. Nearness depends on which embedding model you use and how you compare. Related text can end up far apart, and unrelated text can look close.

## 2. Why bother doing this at all? Because a computer can only do arithmetic

The "guess the next word" machine from earlier chapters runs on number-crunching underneath (Chapters 1 and 2). It can't add or multiply the word "cat," but once "cat" becomes a string of numbers, many questions become computable:

- Are two words close in meaning? Compute the distance between their coordinates; near means close in meaning.
- How do you rank a pile of material by relevance? Turn it all into coordinates and sort by distance from the question.
- When the model decides which word comes next, it is also computing on these numbers.

This is one way to make relationships between pieces of text computable, but not the only one. Just for finding material, keyword search and synonym lists help too.

## 3. The most famous intuition: you can do "arithmetic" on meaning

This is the example people reach for most often when explaining embeddings:

```text
   "king"'s coordinates  −  "man"'s coordinates  +  "woman"'s coordinates  ≈  "queen"'s coordinates
```

Start from "king," take away the "male" part, add "female," and you land near "queen."

The reason is that in the huge amount of training text, the difference between "king" and "queen" is the same kind of difference as the one between "man" and "woman." So the relationship "switch the gender" becomes a roughly fixed direction in the coordinates, and moving along it more or less switches the gender. There are other examples like it, and they too hold only roughly:

| Arithmetic on coordinates | Result lands roughly at | The relationship it captures |
| --- | --- | --- |
| Paris − France + Japan | ≈ Tokyo | capital of a country |
| walk → walked, run → ran | the same "direction" | turning into past tense |
| big → bigger, small → smaller | the same "direction" | more intense |

The point is a plain one: relationships between words (gender, capital, tense, and so on) can show up as rough directions and distances in the coordinates. The "≈" means "lands nearby," not "equals."

The example also has a source and limits. It comes from research around 2013 on static word vectors ("static" meaning each word has one fixed coordinate regardless of context; word2vec became popular at that time). Even then, the arithmetic worked only for some examples: the paper that first reported it answered just under 40% of its grammatical analogy questions correctly, and swapping in other words often breaks it. In today's large language models, a word's representation changes with context, so simple addition like this is even less to be expected. Take it as an intuition that relationships can become directions, not as a rule.

## 4. A vector is neither the original text nor encryption

An embedding is a string of numbers made for comparing text. There's no standard way to "unzip" it back into the original, so search systems usually keep a separate copy of the source text and quote from that.

But "you can't read it directly" doesn't mean "you can't get it back." Researchers have worked backward from vectors to the original text (this is called embedding inversion), and under the right conditions they recovered most of a sentence, sometimes word for word. How much comes back depends on the model, the text, and how much the other side already knows. So an embedding isn't encryption, and it doesn't make text anonymous.

```text
Original:               "I went for a walk in the park today and felt great."
Made into an embedding: [0.12, -0.83, 0.05, 0.41, ……]  ← over a thousand numbers
Can you read the text?  Not directly; but inversion attacks can recover text under some conditions
What can it do?         Compute how near it is in meaning to other sentences
```

In practice, store the source text and its citation separately and let the vector do the finding. Put access controls on both the source and the vectors of sensitive material; turning it into vectors doesn't make it safe to publish. For what shouldn't go into AI tools at all, see Chapter 37.

## 5. What it's good for: semantic search and RAG

The most common use of embeddings is **semantic search**: finding material with related meaning even when the wording differs.

Say you search "how do I make my computer run faster," and there's an article called "Methods for improving computer performance" in which "run faster" never appears. A keyword search that only matches the literal words might miss it, though a keyword search with a synonym list might still find it. Search by meaning works roughly like this:

```text
① Ahead of time: turn every passage in the library into an embedding (each gets a "coordinate of meaning")
② You ask: "how do I make my computer run faster" → also turned into an embedding
③ In the coordinate space, find the few passages nearest to the question's coordinate
④ Passages with different wording can rank high if their meaning is close
```

Ranking high only means the vectors are close. It doesn't guarantee the article is relevant or correct, so you still read it. When a product says it can "search by understanding what you mean" or "find the relevant passages in hundreds of pages you uploaded," this is usually what's behind it.

RAG (retrieval-augmented generation, Chapter 20) first retrieves material, then puts it into the context for the model to answer from. Retrieval can use embeddings, keywords, or both; embeddings are not required. Retrieval cuts down on answers with nothing behind them, but it can also miss the important material or pull in something misleading, so you still check the answer (Chapter 9 shows how).

## 6. Back to an old question: why does "saying it differently" change the result?

Ask the AI the same thing with a few words swapped, and the answer can change noticeably, for more than one reason. New wording can change how the text is split into tokens, the model's internal representations, and how it reads the instructions. Even identical wording can get a different answer because of sampling (Chapter 4).

The vectors a model uses inside for each token are related to the sentence embeddings used for search, but they're not the same thing, and neither one explains a whole answer by itself. So different answers don't tell you that two sentences are far apart as embeddings. Clear instructions do help, but no phrasing guarantees a right answer. The practical move is to try a few times and keep the output that best fits what you need (Chapter 11).

## 7. Common misconceptions, set straight

| Common misconception | Reality |
| --- | --- |
| An embedding is a complete, recoverable text archive | It is a learned representation with no general lossless way back; inversion attacks may still reconstruct some text |
| A vector hides the text securely | Embeddings are not encryption or guaranteed anonymization. Protect sensitive vectors as well as source documents |
| "king − man + woman ≈ queen" shows you can add and subtract meanings as precisely as arithmetic | It's an example from 2013-era static word vectors that holds roughly for only some words; modern LLM representations can't be added up this simply |
| Semantic search requires identical wording | Embeddings can find related text with different wording; keyword and hybrid search are useful too, and every result needs checking |

## Summary

- A vector is a string of numbers that serves as a "coordinate of meaning"; an embedding is the act and the result of turning text into such coordinates. With coordinates, a computer can estimate nearness in meaning as distance, though only approximately.
- Real coordinates have hundreds or thousands of dimensions; a 2D map is just a sketch.
- "king − man + woman ≈ queen" shows that some relationships between words can appear as directions in the coordinates, but it comes from 2013-era static word vectors and holds only for some examples.
- An embedding is neither an archive nor encryption: keep the source text separately, and protect sensitive vectors too.
- Semantic search and RAG (Chapter 20) often use embeddings, but keyword and hybrid search are useful too; check what gets retrieved.
- Rewording can change the result for more than one reason, and output differences can't measure embedding distance (Chapter 11).

That completes the groundwork of Part One on the model's insides: tokens and context (Chapter 3), guessing the next word (Chapter 4), and representing meaning with coordinates (Chapter 5). Chapter 6 looks at one more key mechanism, attention and the Transformer: how the model decides where to look while it reads a sentence.

## Sources and verification

- Morris et al., *Text Embeddings Reveal (Almost) As Much As Text* (2023): [authors’ vec2text implementation and paper link](https://github.com/jxmorris12/vec2text). It demonstrates text reconstruction under studied conditions, not guaranteed recovery of every embedding. Source checked 2026-10-22.
- Mikolov, Yih, and Zweig, *Linguistic Regularities in Continuous Space Word Representations* (NAACL 2013): [paper page](https://aclanthology.org/N13-1090/). The abstract gives the example of "King − Man + Woman" landing close to "Queen," and reports answering just under 40% of the grammatical analogy questions correctly. Source checked 2026-10-27.
- OpenAI, Embeddings guide: [documentation page](https://developers.openai.com/api/docs/guides/embeddings). text-embedding-3-small outputs 1,536-dimensional vectors by default and text-embedding-3-large 3,072. Source checked 2026-10-28.
- Qwen3-8B model configuration: [config.json](https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json). `hidden_size` is 4096, meaning each token is represented inside the model by 4,096 numbers. Source checked 2026-10-28.

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
