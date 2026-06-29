In the last chapter we pinned a large language model's place on the AI map: it's in the innermost circle, the "language-focused" branch of deep learning. But "a huge model focused on language" still sounds abstract. Where exactly is it "large"? What's packed inside it? Why can it speak so fluently, yet now and then confidently talk nonsense?

This chapter **opens up** that innermost doll for a look. By the end you'll have two things: an intuition for "parameters" (the model's "body"), and a core insight that will **keep you from a lot of pitfalls**: **a large language model is not a database; it hasn't memorized the books and then looks them up.** Once this clicks, you'll stop being surprised by all its "magic" and all its crashes.

## 1. The "large" in "large language model," where exactly is it large?

It's called a "large" model, and that's not just talk. The "large" shows up in two places, both absurdly large at once:

| Where it's large | In plain terms | A sense of scale (**illustrative only; refer to the provider's official documentation**) |
| --- | --- | --- |
| Amount of training data | The volume of text it has "read" | Massive: roughly a big sweep through the books, web pages, and articles you can find on the internet |
| Number of parameters | The count of "adjustable knobs" inside it | Easily billions, even hundreds of billions |

- **It reads a lot:** During "training," it was fed a staggering amount of text. Books, web pages, forums, code. Pretty much a big pass over everything humans have publicly written down.
- **It has many knobs:** Inside it are billions to hundreds of billions of **parameters**. Together these numbers decide "given a sentence, how it continues."

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

When training is done, the knobs are **frozen** (the parameters are fixed). After that, every time you ask a question, the model doesn't "learn" again or change the knobs. It just **takes this already-tuned set of knobs and computes once how to continue your sentence.** (A side note: precisely because parameters are fixed after training, the model **knows nothing about events after its training cutoff**. We'll save that thread for chapter 9.)

> **Why does it need so many parameters?** Because language has so many patterns, and they're so fine-grained: which words to use in which situations, how sentences fit together, how different fields phrase things. To dial all of this in, you need a huge number of knobs to share the load. With too few parameters, there's no room to hold language patterns this complex, and it would speak haltingly.

### But: more parameters ≠ necessarily smarter

This is a misconception especially worth puncturing.

Hearing "this model has hundreds of billions of parameters, that one only tens of billions," many people immediately conclude "more parameters, stronger." **That's only half right.** Parameter count is indeed one facet of "scale," and a bigger one often **has the potential** to be stronger, but it's **far from the whole story**:

- **Data quality** matters just as much: feed it dirty, messy text, and no number of knobs will learn good skills. It's like feeding an enormous mixing board nothing but noise. No number of knobs will tune out good sound.
- **Training method** also sets the ceiling: at the same scale, training cleverly can beat training clumsily.
- And the more parameters there are, **the slower and more expensive it is to run** (because answering each sentence means computing over all those knobs, which connects to chapter 3's token billing and chapter 38's costs).

> **Key point:** Don't rank models simply by "how many parameters." Parameter count, data quality, and training method together decide whether a model is good to use; and for you, the user, **which product feels good to use often matters more than who has more parameters** (chapters 17 and 18 cover how to choose).

## 3. The core correction: it is not a database you can "look things up" in

If you take away only one sentence from this chapter, let it be this: **a large language model is not a database that memorizes books onto a hard drive and retrieves them on demand.**

This misunderstanding is far too common. Many people think it has a "super library" inside, and when you ask, it flips to the right page and reads it to you. **That's not how it works at all.**

The truth: during training, all that massive text it read **was not stored whole, page by page**. What got stored were the **"patterns of language" distilled** from that text, and those patterns are **compressed into the billions of parameters (knob positions) mentioned earlier**.

An analogy makes it clearer:

| | A database (it is **not** this) | A large language model (it **actually** is this) |
| --- | --- | --- |
| What's stored inside | The original text, entry by entry, untouched | "Patterns of language," squeezed into billions of parameters |
| What it does when answering | **Retrieve**: find that record, read it out | **Compute on the spot**: generate it word by word from the patterns |
| Ask the same question twice | Reads the exact same thing each time | The wording may differ slightly each time (it's generated fresh) |
| When there's no matching content | Honestly says "no such record" | Still produces a smooth passage, even if it's **made up** |

This one point directly explains two seemingly contradictory traits of large language models:

- **Why is it so fluent, so well-rounded?** Because what it learned are the **general patterns** of language, not memorized entries. So even if you ask something it has "never seen word for word," it can produce a passage on the fly. This is where it's far more flexible than a traditional database.
- **Why does it confidently get things wrong?** Also precisely because it **computes in real time, chasing "sounds right"** rather than "verify, then speak." When its "sense of the pattern" for something is fuzzy or scrambled, it **won't stop to say "I'm not sure."** It'll just smoothly produce an answer that **looks the part but is actually false.** This is the "hallucination" we'll cover specifically later (chapter 9).

> **Common misconception:** "It can recite a whole poem, it can tell me what's in a certain book, so doesn't that mean it stored the original text?" It's not "stored the original text." Rather, that content **appeared extremely often** in the training data, so the related patterns got dialed in especially firmly, and it can reproduce them closely. But by the same token, **for content it has only a fuzzy impression of, it will "make up something very convincing."** From the outside you can't tell whether this time it "remembers firmly" or "is making it up." So: **the more important a fact, number, or quote is, the more you need to check it yourself** (chapters 9 and 15 say this repeatedly).

> **How you'll actually run into it:** Ask it for a celebrity's birth and death years, the source of a paper, or the number of a legal clause, and it'll often answer **flatly and in neat formatting**, but you check and find it's wrong, or even that the paper doesn't exist at all. This isn't it "deliberately lying to you." It's that it simply **doesn't have a "look it up" action**: it's using the pattern of "what this kind of question usually looks like" to **produce something that most resembles an answer.** Once you understand "it's not a database," you'll instinctively be a bit more wary of the hard facts it gives.

## 4. Tying this chapter together: the model "learns patterns," it doesn't "remember entries"

Looking back, the chapter's three points are really one chain of logic:

1. It **read massive amounts of text** (big data);
2. Through **training**, it **compressed language patterns into billions of parameters** (many knobs). This is its "body";
3. So when it answers, it **computes on the spot from patterns**, not by looking up a database. This both makes it **fluent and well-rounded** and dooms it to **confidently make mistakes**.

Get the sentence "it learns patterns, it doesn't remember entries" into your head, and your stance toward large language models will be right: **treat it as a "well-read person" who is extremely fluent in language and widely informed, but occasionally talks without thinking, not as an always-accurate dictionary or a trustworthy database.** How to use it to play to its strengths and around its weaknesses is exactly what Part Two of this book (starting from chapter 10) sets out to cover.

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A large language model is a giant database; answering is by "retrieval" | What it stores is **language patterns (squeezed into parameters)**; answering is **computed and generated on the spot**, not looked up |
| It stored the books it read during training as original text | The original text was **not** saved whole; what was saved are the distilled patterns |
| More parameters always means smarter | Parameter count is only one facet of scale; **data quality and training method** set the ceiling just as much, and more parameters is slower and pricier |
| It answers so accurately and so confidently, it must be true | It chases "sounds right," **not "is true"**; the more fluent it is, the more you should check hard facts (chapter 9) |
| Since it can answer, it must "understand" | It computed out the **statistical patterns**; it doesn't "understand" the meaning (following chapter 1) |
| After training it still keeps learning new things on its own | After training, the parameters are **fixed**; it doesn't know about events after the cutoff (chapter 9) |

## Summary

- The "large" in a large language model is large in two places: **amount of training data** and **number of parameters**, both larger than you can easily imagine; the exact numbers differ by model and change often, so **refer to the provider's official documentation**.
- **Parameters** are the current positions of the model's billions of "knobs," its **body**; **training** is repeatedly "turning the knobs" with massive amounts of text, until the words it "says" simply sound right.
- **More parameters ≠ necessarily smarter**: data quality and training method matter just as much, and more parameters is slower and pricier; don't choose a model by parameters alone (chapters 17 and 18).
- **The core correction**: a large language model **is not a database**. It didn't store the original text; it **squeezed language patterns into parameters**; answers are **computed and generated on the spot**, not retrieved.
- This one point also explains both **why it's fluent and well-rounded** and **why it confidently makes things up** (hallucination, chapter 9); so **always check important facts yourself**.

The next chapter (Chapter 3) covers how the model cuts text into **tokens** and lays them out in a "context window." The one after (Chapter 4) looks at how it actually "computes" the next word in real time — the answer to "if it's not a database, how does it produce the words?"

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** What's the most fitting way to understand "parameters" in a large language model?
   - A. The original-text records it stores, one by one
   - B. The current positions of the model's billions of "adjustable knobs," with language patterns dialed into them
   - C. The text you type in each time you ask a question
   - D. The model's startup password
   > **Answer: B.** Parameters are the model's set of "tuned knobs." They're the model's body, with language patterns squeezed into them. A mistakes parameters for "stored original text" (this is exactly the "database" misconception); C confuses parameters with "your input (the prompt)"; D is simply unrelated.

2. **[Basic · Concept]** What is "training" a large language model roughly doing?
   - A. Copying all the books one by one onto a hard drive for storage
   - B. Giving it massive text, repeatedly having it guess "the next word," nudging the knobs (parameters) when it's wrong, until it speaks smoothly
   - C. Writing it several million if-else rules
   - D. Having it search the internet in real time
   > **Answer: B.** Training = repeatedly "turning the knobs" with massive amounts of text. A is the "database/copy" mistaken picture; C is the old "people write rules" path of traditional programs (compared back in chapter 1); D confuses "training" with "searching online." Once training is done, the knobs are fixed, and later questions don't change them.

3. **[Advanced · Misconception]** "A large language model is just a giant database; when you ask, it retrieves the answer from inside." Where does this go wrong?
   - A. Nothing's wrong; it just is a database
   - B. It didn't store the original text; it stored "language patterns (squeezed into parameters)"; answers are **computed and generated on the spot**, not retrieved. This is also why it "makes things up"
   - C. It's a database, but with too little capacity
   - D. It retrieves from someone else's computer
   > **Answer: B.** This is the chapter's core correction. A database "finds a record and reads it out, or says there's none"; a large language model "produces a passage on the spot from patterns, and even when unsure it can make a convincing one." People who treat it as a database are most likely to take its hard facts on faith (see hallucination in chapter 9). C and D are both still stuck on the false premise of "it's a database."

4. **[Advanced · Misconception]** "Model A has 500 billion parameters, model B only 70 billion, so A must be smarter than B and the one to use." Where is this reasoning shaky?
   - A. Completely correct; more parameters just means stronger
   - B. Parameter count is only one facet of scale; data quality and training method decide quality just as much, and more parameters is slower and pricier. Comparing parameters alone is unreliable
   - C. Parameters have nothing to do with smartness at all
   - D. B is definitely stronger than A
   > **Answer: B.** "Parameters are everything" is a classic trap: no number of knobs will tune out good sound if all you feed it is noise. Besides, for the user, "which product feels good to use and offers better value" is often more practical than "who has more parameters" (chapters 17 and 18). C swings to the other extreme (saying "nothing to do with it at all" is also wrong; scale does have an effect); D is just as arbitrary.

5. **[Basic · Scenario]** You ask the AI for the title, author, and year of a certain academic paper. It answers in neat formatting and with total confidence, but you check and find the paper doesn't exist at all. What's the most accurate explanation?
   - A. The record for this in its database is corrupted
   - B. It simply has no "look it up" action: it's producing **something that most resembles an answer** from the pattern of "what this kind of citation usually looks like," and when its impression is shaky it makes up something convincing
   - C. It's deliberately lying to you
   - D. There was a network problem
   > **Answer: B.** It's not a database and has no retrieval action; it "computes and generates on the spot." For content it has a fuzzy impression of, it will **confidently make things up** (hallucination, chapter 9). A still treats it as a database; C mistakenly assumes it has an intent to "lie" (it's only continuing text by patterns); D doesn't answer the question. This is exactly where "you must check important facts yourself" comes from (chapter 15).

6. **[Basic · Hands-on]** Take one open-ended question (say, "introduce Hangzhou in three sentences") and ask the AI the **exact same way** three times (each time starting a new conversation or regenerating), then compare the wording across the three. Now think: if it really were a "database that reads out records," would the three be identical?
   > **What you should notice:** The wording across the three will **mostly differ** (similar in meaning, different in word choice). If it were a database reading out records, all three should be word for word identical. The fact that each one differs slightly shows it's **"generating on the spot" from patterns**, not "retrieving." Verify it once yourself, and the core insight "it's not a database, it computes on the fly" really takes root in your head (why the output changes also has to do with the randomness in chapters 4 and 8).
