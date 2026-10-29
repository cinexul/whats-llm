In the last chapter we placed the large language model on the AI map: the innermost circle, the branch of deep learning focused on language. But "a huge model focused on language" still sounds abstract. Where exactly is it "large"? What's inside it? Why can it write so fluently, yet now and then be confidently wrong?

This chapter opens up that innermost doll. By the end you'll have two things: an intuition for "parameters," which are the model's body, and an insight that will keep you out of a lot of trouble: **a large language model generates text from learned parameters plus the current context; it is not a library you can search completely and reliably.**

## 1. The "large" in "large language model," where exactly is it large?

It's large in two ways: the amount of text it read during training, and the number of adjustable values (parameters) inside it. Here are three real examples whose makers published the details. The figures come from each developer's model documentation, checked as of October 2026. A token is the small unit of text a model works with; chapter 3 explains it.

| | DeepSeek-V3 | Qwen3-235B-A22B | Kimi K2 |
| --- | --- | --- | --- |
| Developer | DeepSeek | Alibaba (Qwen) | Moonshot AI |
| Text read in training | 14.8 trillion tokens | about 36 trillion tokens | 15.5 trillion tokens |
| Total parameters | 671 billion | 235 billion | about 1 trillion |
| Parameters actually used per generated token | 37 billion | 22 billion | 32 billion |

How much is 14.8 trillion tokens? By the ratio measured in chapter 3, a 100,000-word English book is roughly 130,000 tokens, so 14.8 trillion tokens is on the order of 100 million such books. Parameter counts range from hundreds of millions to over a trillion: the smallest Qwen3 model has about 600 million, and Kimi K2 in the table has about a trillion. We picked these three because they also published how much data they were trained on; closed models such as Claude and GPT usually publish neither. Open models released since then are bigger still, and Appendix E lists their numbers as of October 2026.

## 2. What parameters are: hundreds of millions of "knobs," and training is turning them over and over

Imagine an enormous mixing board with billions of knobs packed across it. Where every knob is set decides how the model tends to continue after seeing a sentence.

- **Parameters** are the current positions of those knobs: a very long list of numbers. They're the model's body. A "trained model" is, when it comes down to it, this whole set of tuned knob positions. When you download an open-weight model, these numbers are mostly what you get.
- Training is turning those knobs over and over. Show the model a real sentence, cover what comes next, and have it guess the next word; if it guesses wrong, nudge the relevant knobs a little so it's more likely to get it right next time. Repeat this across huge amounts of text, and the knobs gradually settle into positions where the model's words simply sound right.

```text
What training is doing (bare-bones illustration):
  See a real sentence: "The sun rises in the ____"
  Cover the last word, let the model guess → it guesses "east"? Right, knobs barely move
                                            → it guesses "west"? Wrong, nudge the knobs, don't do that next time
  ...repeat this hundreds of millions of times, and the knobs get tuned to the "speaks smoothly" position
```

In everyday use, the trained parameters stay fixed: asking a question doesn't retrain the model. It uses those parameters together with the current context to generate an answer. What it learned in training stops at a cutoff date and doesn't update itself, but it can use new material you give it in the conversation or information retrieved by tools (chapter 9).

Why so many parameters? Language has a huge number of fine-grained patterns: which words fit which situations, how sentences fit together, how each field phrases things. Holding all that takes a vast number of knobs; with too few, those patterns don't fit.

### But: more parameters ≠ necessarily smarter

Hearing "hundreds of billions of parameters," many people assume that settles it. A bigger model often has more potential, but three other things matter:

- Data quality: train it on sloppy, error-filled text and no number of knobs will learn good skills, like feeding a mixing board nothing but noise.
- Training method: at the same scale, a model trained cleverly can beat one trained clumsily.
- How many parameters each step actually uses: all three models in the table use a "mixture of experts" design. The inside is split into many groups of "expert" parameters, and each generated token calls on only some of them. That part is called the **active parameters**, and in the table it's only a tenth to a thirtieth of the total (the "A22B" in Qwen3's name means "22 billion active"). Speed and cost depend mainly on the active parameters, the hardware, and how the model is served, so the total alone tells you little.

So don't rank models by parameter count. For you, which product works well and is good value on your own tasks matters more than who has more parameters (chapters 17 and 18 cover how to choose).

## 3. The key point: it is not a database you can "look things up" in

If you take away only one sentence from this chapter, let it be this: **a large language model is not a database that stores books on a disk and retrieves them on demand.**

Many people picture a giant library inside: you ask, it turns to the right page and reads it out. In reality, training tunes the parameters to pick up patterns and facts; it doesn't build an archive of all the source text you can search. That said, while learning general patterns it can also memorize particular passages, and sometimes it reproduces training text word for word. So "not a database" doesn't mean "never keeps the original wording."

| | A database (it is not this) | A large language model (it actually is this) |
| --- | --- | --- |
| What is stored | Original records | Learned patterns and facts in parameters, sometimes including memorized passages |
| What it does when answering | Retrieve: find that record, read it out | Compute on the spot: generate it token by token from the patterns |
| Ask the same question twice | Reads the exact same thing each time | The wording often differs, because picking the next word usually involves a bit of random sampling (chapter 4) |
| When there's no matching content | Honestly says "no such record" | May admit uncertainty or produce a plausible but false passage |

This table also explains two traits that seem to contradict each other:

- Why can it answer questions it has never seen? What it learned are general patterns, so it can answer a question it has never seen in exactly those words by following them. That doesn't clash with it having memorized some training text.
- Why can it be confidently wrong? Generating a plausible continuation is not the same as checking the facts. It may say "I'm not sure," or it may give a fluent, false answer. This is the **hallucination** discussed in chapter 9.

Another misunderstanding: "If it can recite a whole poem, it must hold a searchable copy of every book." Memorizing fragments does happen. Researchers extracted word-for-word training text from GPT-2, including names, phone numbers, and email addresses that had been public online, and some of it appeared in only one document in the training data. But this memory is neither complete nor reliably searchable. So check important quotations against the original; and once sensitive information is in training data, it can come back out verbatim (chapter 37).

Likewise, a model can give a neatly formatted citation that doesn't exist. If it hasn't actually used a search or retrieval tool, that citation is generated text, not evidence of a lookup (chapter 9 covers how to check).

## 4. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A large language model is a giant database; answering is by "retrieval" | Patterns live in the parameters, and answers are generated on the spot |
| It contains a complete copy of every training book | It can memorize some passages, but neither complete storage nor reliable retrieval is guaranteed |
| More parameters always means smarter | Data, training method, and the task matter too; speed and cost depend more on active parameters |
| It sounds so fluent and confident, it must be true | Fluency doesn't prove truth; check important facts (chapter 9) |
| It updates its training knowledge whenever I chat | Everyday use doesn't change the parameters; new information comes from the current context or tools |

## Summary

- A large language model is large in two ways: it read a lot of text in training (DeepSeek-V3 read 14.8 trillion tokens), and it has many parameters (from hundreds of millions to over a trillion).
- Parameters are the current positions of countless "knobs" inside the model, its body; training turns those knobs again and again on huge amounts of text until its words sound right.
- More parameters isn't automatically better. Mixture-of-experts models use only a small part of theirs at each step; judge a model by quality, speed, and cost on your own tasks.
- A model generates from learned parameters and context. It may reproduce memorized wording, but it is not a complete, reliably searchable database.
- It can be fluent and useful while still getting facts wrong (hallucination, chapter 9), so check important facts against reliable sources.

The next chapter covers how the model cuts text into tokens and lays them out in a "context window." Chapter 4 then looks at how it "computes" an answer one token at a time: the answer to "if it's not a database, how does it produce fluent text?"

## Sources and verification

- Carlini et al., *Extracting Training Data from Large Language Models* (2021): [abstract](https://arxiv.org/abs/2012.07805), [authors’ code and paper link](https://github.com/ftramer/LM_Memorization). The work extracted memorized training text from GPT-2 (including public names, phone numbers, and email addresses), some of which appeared in only one document; it does not claim every model reproduces every training document. Source checked 2026-10-22; abstract rechecked 2026-10-28.
- [DeepSeek-V3 model card](https://huggingface.co/deepseek-ai/DeepSeek-V3): 671B total parameters, 37B activated per token, pre-trained on 14.8 trillion tokens.
- [Qwen3 release blog](https://qwenlm.github.io/blog/qwen3/): pre-trained on about 36 trillion tokens; Qwen3-235B-A22B has 235B total and 22B activated parameters; the smallest dense model is Qwen3-0.6B.
- [Kimi K2 model card](https://huggingface.co/moonshotai/Kimi-K2-Instruct): a mixture-of-experts model with 1 trillion total and 32 billion activated parameters, pre-trained on 15.5 trillion tokens.

The three sources above were checked 2026-10-28.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** What's the best way to understand a large language model's "parameters"? <!-- quiz: q01 revision: 2 -->
   - A. Stored records of the original training text, from which it picks a fitting sentence
   - B. The settings you give the model with each question, such as tone, length, and format
   - C. The cap on how much text the model can handle at once; a bigger number means longer reads
   - D. The current values of a huge number of adjustable numbers, where learned patterns live
   > **Answer: D.** Parameters are numeric "knobs" set by training; they are the model's body. They mainly encode general patterns and can also encode some memorized passages. A treats parameters as an archive of original text, which is exactly the "database" picture this chapter corrects. B describes a prompt or product settings, which you supply with each question; those aren't parameters. C describes the context window (chapter 3), a different thing.

2. **[Basic · Concept]** Roughly what does "training" a large language model involve? <!-- quiz: q02 revision: 2 -->
   - A. Having it guess the next word over and over on huge amounts of text, nudging parameters when wrong
   - B. Copying every book into the model one by one, then building a searchable index for each book
   - C. Engineers writing answer rules for every kind of question, which the model carries out one by one
   - D. Letting the model learn while it chats with users, so the more it chats, the more its parameters change
   > **Answer: A.** Training means "turning the knobs" again and again on huge amounts of text until its continuations sound right. B is the mistaken "database/copy" picture; C is the old "people write rules" approach of traditional programs (compared in chapter 1). D is the most believable trap: normally the parameters are fixed after training, and your everyday chats don't change them. Whether a service uses chat records for future training is a separate question that depends on its terms (chapter 37).

3. **[Advanced · Misconception]** "A large language model is just a huge database: you ask, and it retrieves the answer from inside." What's wrong with this? <!-- quiz: q03 revision: 2 -->
   - A. It's basically right; the database is just so big that it sometimes opens the wrong spot
   - B. It stores no original text at all, so it can never repeat anything it read word for word
   - C. It generates on the spot from learned patterns; it may memorize bits but can't reliably look up text
   - D. It actually searches the web live every time, which is why the answer changes each time
   > **Answer: C.** This is the chapter's core correction. A database "finds the record and reads it out, or says there's none"; an LLM "generates on the spot from learned patterns," and when unsure it can still produce a plausible wrong answer (chapter 9). A is still stuck in the database premise. B overcorrects: models can memorize some training text word for word. D mixes up generation and web search; some products do search, but that's an extra tool, not how the model itself works.

4. **[Advanced · Misconception]** "Model A has 500 billion parameters, model B only 70 billion, so A must be smarter than B and the one to use." Where is this reasoning shaky? <!-- quiz: q04 revision: 2 -->
   - A. Nothing is shaky; a model with more parameters is stronger on every kind of task
   - B. Data, training methods, and the task all matter; parameter count is only one factor
   - C. Parameter count has nothing to do with ability; models with fewer are always better
   - D. More parameters means it read more books, so the facts A gives are always more accurate
   > **Answer: B.** "Parameters are everything" is a classic misconception: no number of knobs makes good sound from pure noise, and for users, which product is handier and better value often matters more (chapters 17 and 18). A is the very misconception in the question. C swings to the other extreme: scale does matter, it just doesn't decide quality alone. D confuses parameter count with the amount of training data, and reading more doesn't guarantee accurate facts anyway.

5. **[Basic · Scenario]** You ask an AI for a paper's title, authors, and year. It answers in neat format, sounding certain, but when you check, the paper doesn't exist at all. What's the most accurate explanation? <!-- quiz: q05 revision: 2 -->
   - A. That record in its internal database is corrupted; asking another way will find the right entry
   - B. It's deliberately making things up to fool you; a more honest AI would never do this
   - C. The paper surely exists and you just didn't search widely enough, so you should trust it
   - D. It generated a plausible citation; neat formatting doesn't mean it checked a real source
   > **Answer: D.** A neat, fluent answer is not evidence that it looked up or verified a source; a model can "assemble" a nonexistent paper from the format of papers it has seen. Check important citations against reliable sources (chapter 15). A still treats it as a database. B pictures it as a person lying on purpose, but switching products doesn't rule out the same error. C over-trusts the model; if you can't find the paper, that's a reason for more caution, not less.

6. **[Basic · Hands-on]** Ask the same open-ended question (for example, “introduce Hangzhou in three sentences”) in three new conversations using the same model and settings. Record which wording and factual claims change, then verify one claim using a reliable source. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Wording may vary because of sampling and other system behavior, or may remain identical. Neither outcome proves or rules out memorization, retrieval, or factual correctness. This experiment illustrates output variability; checking the source is what tests the factual claim.
