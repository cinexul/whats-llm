In the last chapter we pinned a large language model's place on the AI map: it's in the innermost circle, the "language-focused" branch of deep learning. But "a huge model focused on language" still sounds abstract. Where exactly is it "large"? What's packed inside it? Why can it speak so fluently, yet now and then confidently talk nonsense?

This chapter **opens up** that innermost doll for a look. By the end you'll have two things: an intuition for "parameters" (the model's "body"), and a core insight that will **keep you from a lot of pitfalls**: **a large language model generates from learned parameters and context; it is not a complete, reliably searchable library.** Once this clicks, you'll stop being surprised by all its "magic" and all its crashes.

## 1. The "large" in "large language model," where exactly is it large?

It's called a "large" model, and that's not just talk. The "large" shows up in two places, both absurdly large at once:

| Where it's large | In plain terms | A sense of scale (**illustrative only; refer to the provider's official documentation**) |
| --- | --- | --- |
| Amount of training data | The volume of text it has "read" | Massive: roughly a big sweep through the books, web pages, and articles you can find on the internet |
| Number of parameters | The count of "adjustable knobs" inside it | Billions to hundreds of billions is common; as of October 2026, some open-weight models (whose parameter files you can download) have about a trillion in total |

- **It reads a lot:** During "training," it was fed a staggering amount of text. Books, web pages, forums, code. Pretty much a big pass over everything humans have publicly written down.
- **It has many knobs:** Inside it are billions of **parameters**, and in some models up to around a trillion. Together these numbers decide "given a sentence, how it continues."

> **Note:** Exactly "how many" parameters and "how much" data differ from model to model and keep changing, so **this book won't pin down these numbers (writing them down would go stale fast; refer to the provider's official documentation)**. You only need to build one intuition: **both are large to a degree an ordinary person can hardly imagine.** The next section focuses on that more central and harder word: parameters.

## 2. What parameters are: hundreds of millions of "knobs," and training is turning them over and over

This is the one metaphor in the chapter most worth understanding deeply, so read it slowly.

Imagine an enormous **mixing board** with **billions of knobs** packed across it. **Each way you set the knobs (where every knob is turned to)** corresponds to one tendency for "after seeing a sentence, what word the model will continue with next."

- **Parameters** are the **current positions** of those billions of knobs (long strings of numbers). They're the model's "body." A "trained model" is, at heart, **this whole set of turned knob positions**.
- **Training** is the process of **turning these knobs over and over**. How? Show the model a real sentence, cover the back half, and have it guess "what the next word is." If it guesses wrong, nudge the relevant knobs a little so it's more likely to guess right next time. Do this with **massive amounts of text, hundreds of millions of times**, and the knobs gradually get tuned to a magical position: **the words the model "says" simply sound right.**

```text
What training is doing (bare-bones illustration):
  See a real sentence: "The sun rises in the ____"
  Cover the last word, let the model guess → it guesses "east"? Right, knobs barely move
                                            → it guesses "west"? Wrong, nudge the knobs, don't do that next time
  ...repeat this hundreds of millions of times, and the knobs get tuned to the "speaks smoothly" position
```

In ordinary use, the trained parameters stay **fixed**: asking a question does not itself retrain the model. It uses those parameters together with the current context to generate a response. Its training knowledge does not automatically update after the cutoff, but it can use newer information supplied in the conversation or retrieved by tools (Chapter 9).

> **Why does it need so many parameters?** Because language has so many patterns, and they're so fine-grained: which words to use in which situations, how sentences fit together, how different fields phrase things. To dial all of this in, you need a huge number of knobs to share the load. With too few parameters, there's no room to hold language patterns this complex, and it would speak haltingly.

### But: more parameters ≠ necessarily smarter

This is a misconception especially worth puncturing.

Hearing "this model has hundreds of billions of parameters, that one only tens of billions," many people immediately conclude "more parameters, stronger." **That's only half right.** Parameter count is indeed one facet of "scale," and a bigger one often **has the potential** to be stronger, but it's **far from the whole story**:

- **Data quality** matters just as much: feed it dirty, messy text, and no number of knobs will learn good skills. It's like feeding an enormous mixing board nothing but noise. No number of knobs will tune out good sound.
- **Training method** also sets the ceiling: at the same scale, training cleverly can beat training clumsily.
- **A large total doesn't mean every parameter is used every time.** Some models use a "mixture of experts" design: the inside is split into many groups of "expert" parameters, and each small piece of text it generates calls on only a few of them. The part that actually takes part in each step is called the **active parameters**, and it can be just a few percent of the total. So speed and cost depend on the active parameters, the hardware, and how the model is served; you can't guess them from the total alone.

> **Key point:** Don't rank models simply by "how many parameters." Parameter count, data quality, and training method together decide whether a model is good to use; and for you, the user, **which product feels good to use often matters more than who has more parameters** (chapters 17 and 18 cover how to choose).

## 3. The core correction: it is not a database you can "look things up" in

If you take away only one sentence from this chapter, let it be this: **a large language model is not a database that memorizes books onto a hard drive and retrieves them on demand.**

This misunderstanding is far too common. Many people think it has a "super library" inside, and when you ask, it flips to the right page and reads it to you. **That's not how it works at all.**

Training **adjusts the parameters to learn patterns and facts**, rather than building a searchable archive of all the source documents. But **learning general patterns and memorizing particular passages can both happen**: models can sometimes reproduce training text verbatim. “Not a database” does not mean “cannot retain original wording.”

An analogy makes it clearer:

| | A database (it is **not** this) | A large language model (it **actually** is this) |
| --- | --- | --- |
| What is stored | Original records | Learned patterns and facts in parameters, sometimes including memorized passages |
| What it does when answering | **Retrieve**: find that record, read it out | **Compute on the spot**: generate it word by word from the patterns |
| Ask the same question twice | Reads the exact same thing each time | The wording often differs, because picking the next word usually involves a bit of random sampling (chapter 4) |
| When there's no matching content | Honestly says "no such record" | May admit uncertainty or produce a plausible but **false** passage |

This one point directly explains two seemingly contradictory traits of large language models:

- **Why can it respond to unfamiliar questions?** It learns **general patterns**, so it can generate an answer to a question it has never seen word for word. This ability to generalize can coexist with memorization of some training examples.
- **Why can it confidently get things wrong?** Generating a plausible continuation does not by itself verify the facts. A model may express uncertainty, but it may also produce a fluent, false answer. This is the **hallucination** discussed in Chapter 9.

> **Common misconception:** “If it can recite a poem, it must contain a searchable copy of every book.” Models can **memorize and reproduce some text exactly**, with repetition among the factors that affect memorization. That gives neither a complete archive nor a guarantee of accurate retrieval. Check important quotations against the original; do not treat model parameters as a way to anonymize sensitive training data.

> **How you may encounter it:** A model can give a neatly formatted but nonexistent citation. If it has not actually used a search or retrieval tool, the citation is generated text, not evidence of a lookup. Even when tools are used, inspect the retrieved source and whether it supports the claim.

## 4. Tying this chapter together: generating answers from learned parameters

Looking back, the chapter's three points are really one chain of logic:

1. It **read massive amounts of text** (big data);
2. Through **training**, it **compressed language patterns into billions of parameters** (many knobs). This is its "body";
3. When it answers, it **generates from learned parameters and context**. That supports fluent responses to many kinds of questions, but does not guarantee factual correctness.

Remember: **it generates from learned parameters and context; it can generalize, memorize, and make mistakes.** Treat it as a useful assistant whose factual claims and quotations need checking. Part Two (starting from Chapter 10) develops that practical habit.

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A large language model is a giant database; answering is by "retrieval" | What it stores is **language patterns (squeezed into parameters)**; answering is **computed and generated on the spot**, not looked up |
| It contains a complete, searchable copy of every training book | It learns through parameters and can memorize some passages; neither complete storage nor reliable retrieval is guaranteed |
| More parameters always means smarter | Data, training, architecture, and the task matter too; total parameters alone do not determine quality, speed, or cost |
| It answers so fluently and confidently, it must be true | Training can encourage accurate answers, but fluency alone does not prove a claim is true; check important facts (chapter 9) |
| Since it can answer, it must "understand" exactly as a person does | Useful responses show learned capabilities; they do not by themselves establish human-like understanding (chapter 1) |
| It updates its training knowledge whenever I chat | Ordinary inference does not retrain the parameters; current context or tools can supply new information |

## Summary

- The "large" in a large language model is large in two places: **amount of training data** and **number of parameters**, both larger than you can easily imagine; the exact numbers differ by model and change often, so **refer to the provider's official documentation**.
- **Parameters** are the current positions of the model's billions of "knobs," its **body**; **training** is repeatedly "turning the knobs" with massive amounts of text, until the words it "says" simply sound right.
- **More parameters ≠ necessarily better**: evaluate quality on your task along with actual speed and cost, rather than comparing total parameter counts alone.
- **The core correction:** a model generates from **learned parameters and context**. It may reproduce memorized wording, but it is not a complete, reliably searchable database.
- A model can be **fluent and useful while still making factual errors** (hallucination, chapter 9), so verify important facts against reliable sources.

The next chapter (Chapter 3) covers how the model cuts text into **tokens** and lays them out in a "context window." The one after (Chapter 4) looks at how it actually "computes" the next word in real time — the answer to "if it's not a database, how does it produce the words?"

## Sources and verification

Carlini et al., *Extracting Training Data from Large Language Models* (2021): [authors’ code and paper link](https://github.com/ftramer/LM_Memorization). The work demonstrates extraction of memorized training text from GPT-2; it does not claim every model reproduces every training document. Source checked 2026-10-22.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** What's the best way to understand a large language model's "parameters"? <!-- quiz: q01 revision: 1 -->
   - A. Stored records of the original training text, from which it picks a fitting sentence
   - B. The settings you give the model with each question, such as tone, length, and format
   - C. The cap on how much text the model can handle at once; a bigger number means longer reads
   - D. The current values of a huge number of adjustable numbers, where learned patterns live
   > **Answer: D.** Parameters are numeric "knobs" set by training; they are the model's body. They mainly encode general patterns and can also encode some memorized passages. A treats parameters as an archive of original text, which is exactly the "database" picture this chapter corrects. B describes a prompt or product settings, which you supply with each question; those aren't parameters. C describes the context window (chapter 3), a different thing.

2. **[Basic · Concept]** Roughly what does "training" a large language model involve? <!-- quiz: q02 revision: 1 -->
   - A. Having it guess the next word over and over on huge amounts of text, nudging parameters when wrong
   - B. Copying every book into the model one by one, then building a searchable index for each book
   - C. Engineers writing answer rules for every kind of question, which the model carries out one by one
   - D. Letting the model learn while it chats with users, so the more it chats, the more its parameters change
   > **Answer: A.** Training means "turning the knobs" again and again on huge amounts of text until its continuations sound right. B is the mistaken "database/copy" picture; C is the old "people write rules" approach of traditional programs (compared in chapter 1). D is the most believable trap: normally the parameters are fixed after training, and your everyday chats don't change them. Whether a service uses chat records for future training is a separate question that depends on its terms (chapter 37).

3. **[Advanced · Misconception]** "A large language model is just a huge database: you ask, and it retrieves the answer from inside." What's wrong with this? <!-- quiz: q03 revision: 1 -->
   - A. It's basically right; the database is just so big that it sometimes opens the wrong spot
   - B. It stores no original text at all, so it can never repeat anything it read word for word
   - C. It generates on the spot from learned patterns; it may memorize bits but can't reliably look up text
   - D. It actually searches the web live every time, which is why the answer changes each time
   > **Answer: C.** This is the chapter's core correction. A database "finds the record and reads it out, or says there's none"; an LLM "generates on the spot from learned patterns," and when unsure it can still produce a plausible wrong answer (chapter 9). A is still stuck in the database premise. B overcorrects: models can memorize some training text word for word. D mixes up generation and web search; some products do search, but that's an extra tool, not how the model itself works.

4. **[Advanced · Misconception]** "Model A has 500 billion parameters, model B only 70 billion, so A must be smarter than B and the one to use." Where is this reasoning shaky? <!-- quiz: q04 revision: 1 -->
   - A. Nothing is shaky; a model with more parameters is stronger on every kind of task
   - B. Data, training methods, and the task all matter; parameter count is only one factor
   - C. Parameter count has nothing to do with ability; models with fewer are always better
   - D. More parameters means it read more books, so the facts A gives are always more accurate
   > **Answer: B.** "Parameters are everything" is a classic misconception: no number of knobs makes good sound from pure noise, and for users, which product is handier and better value often matters more (chapters 17 and 18). A is the very misconception in the question. C swings to the other extreme: scale does matter, it just doesn't decide quality alone. D confuses parameter count with the amount of training data, and reading more doesn't guarantee accurate facts anyway.

5. **[Basic · Scenario]** You ask an AI for a paper's title, authors, and year. It answers in neat format, sounding certain, but when you check, the paper doesn't exist at all. What's the most accurate explanation? <!-- quiz: q05 revision: 1 -->
   - A. That record in its internal database is corrupted; asking another way will find the right entry
   - B. It's deliberately making things up to fool you; a more honest AI would never do this
   - C. The paper surely exists and you just didn't search widely enough, so you should trust it
   - D. It generated a plausible citation; neat formatting doesn't mean it checked a real source
   > **Answer: D.** A neat, fluent answer is not evidence that it looked up or verified a source; a model can "assemble" a nonexistent paper from the format of papers it has seen. Check important citations against reliable sources (chapter 15). A still treats it as a database. B pictures it as a person lying on purpose, but switching products doesn't rule out the same error. C over-trusts the model; if you can't find the paper, that's a reason for more caution, not less.

6. **[Basic · Hands-on]** Ask the same open-ended question (for example, “introduce Hangzhou in three sentences”) in three new conversations using the same model and settings. Record which wording and factual claims change, then verify one claim using a reliable source. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Wording may vary because of sampling and other system behavior, or may remain identical. Neither outcome proves or rules out memorization, retrieval, or factual correctness. This experiment illustrates output variability; checking the source is what tests the factual claim.
