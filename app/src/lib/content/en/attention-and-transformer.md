In Chapter 3 we said the model cuts text into tokens and lays them out on the "table"; in Chapter 4 we said it works across the table, adding the next word one word at a time. But one question went unanswered: a sentence has so many words, so when it picks the next word, **which words is it actually looking at**?

Read this sentence:

> "Xiao Li returned the book to the library, because **it** was already overdue."

"It" refers to the book, not the library. You get it at a glance: what goes "overdue" is a borrowed book, not a library. When you reach "overdue," you instinctively glance back and pick whichever of "book" and "library" makes sense. The model has to do this too, and what it relies on is the star of this chapter: **attention**. This chapter won't use any formulas; it just helps you build an intuition for how it manages to **grab what matters** out of a long string of words.

## 1. Attention: reading a sentence, your eyes scan back and forth between words

When we read a long sentence, our eyes don't sweep evenly over every character. As we read a particular word, we automatically look more at the few words related to it, underline what matters, and just glance past the rest.

Attention is the "machine version" of exactly this. When the model processes a sentence, for **every position** it has to answer one question:

> For the current token, **which earlier tokens should contribute information, and with what weights**?

Why "earlier"? Because the large language models used for chat write one token after another (Chapter 4), so each position can only **look back**: it can draw on itself and what came before, but it can't peek at words that haven't appeared yet. In the example, when the model reads "it," the word "overdue" hasn't appeared, so whether "it" means the book or the library is still open. When it reaches "overdue," it looks back for "what can be overdue":

```text
Looking back from "overdue" (weights invented for illustration):

Xiao Li   returned   the   book   to   the   library   because   it   was   already   overdue
  ▏          ▏        ▏    ███     ▏    ▏       █         ▏      ██    ▏       ▏      ← current position
                     ("book" heaviest, "it" next, "library" lighter)
```

So at the "overdue" step, the information in "it" and "book" gets linked, and as the model goes on writing, it treats "it" as "that book." That's attention: **for each position, work out which earlier words to focus on.**

> **A note on terms:** Attention that can only look back is called **causal attention**, and it's what text-generating chat models use. Some models built only to understand text, not generate it (encoders used for search or classification, for example), can look at the context on both sides; that's bidirectional attention. Everything you send at once, your question and any material, comes before the answer, so all of it is available when the answer is generated.

> **Key point:** Attention isn't "reading the whole sentence at an even glance"; it's **looking with emphasis, some heavy and some light**. That emphasis is what gives it a chance, in a sentence packed with several nouns, to connect "it" to "book" rather than getting pulled toward the nearer "library." Being able to underline what matters is a big part of why it can read long sentences and catch key connections that are far apart.

Why does it need this skill? Think back to Chapter 4: how well it "adds the next word" depends heavily on whether it has pinned down the key parts of what came before. The longer and more roundabout a sentence (pronoun references, callbacks, "that plan I mentioned earlier"), the more it needs to reach across a heap of words in between and **pull out the few relevant ones**. If it could only take the two or three nearest words into account, it would lose the thread as soon as a sentence got long.

## 2. It doesn't just look once — it looks with "several sets of eyes" at once

There's one more layer worth knowing (still no formulas): when the model looks at a sentence, it doesn't use just "one way of paying attention"; it uses **several at the same time**. The technical term is multiple **attention heads**.

Here's an analogy: a draft is handed to several different editors to read at once. The table below is only an illustration to help you picture it:

| What this "set of eyes" might watch for | In the example sentence, it would notice |
| --- | --- |
| Who refers to whom | "it" ↔ "book" |
| Who did what to whom | "Xiao Li" → "returned" → "library" |
| Cause-and-effect, contrast | "because" hooks the second half to the first |

In a real model, what each head focuses on takes shape during training; the division of labor is usually not this neat, and it can't always be described in plain words. Just know this: **it weighs the same sentence from multiple angles at once** and then pools what each one underlined, rather than sweeping over it in a single line. That's one reason it can attend to grammar, reference, and logic at the same time.

## 3. The Transformer: the "engine type" inside today's mainstream large models

Take this "attention" mechanism, build it into a complete architecture that can be stacked layer on layer and scaled up very large, and you get a name: the **Transformer**. It comes from the 2017 paper "Attention Is All You Need."

About it, you only need to remember one sentence:

> **Today's mainstream large models (Claude, GPT, Gemini, and so on) are basically built on the Transformer or on improved and hybrid versions of it.** It's like a car's "engine type." You don't need to understand how an engine works inside to drive, but knowing that "cars on the market basically all use this type of engine" helps you understand why they share certain tendencies.

"Improved and hybrid versions" means that over the last year or two, some models have replaced part of their standard attention layers with cheaper linear-attention or state-space layers, mixing the two kinds. For example, as of October 2026, Alibaba's Qwen3-Next uses such a hybrid design. For the structure of any specific product, defer to its official technical report.

This chapter **deliberately doesn't open the hood**. There are many more parts and terms inside (you may have heard words like "encoder/decoder," which are in the glossary in Appendix A, but you don't need to dig into them here). The reason is simple: open it up and it's all math, which does little for our goal of "using it well and not getting fooled by it." Three things are enough:

- Its core is the **attention** described above (it underlines what matters);
- It can be **stacked deep and built large**, which is one of the reasons large models are "large";
- Most mainstream large models are built on it or a variant of it, so the underlying principles are shared.

> **How you'll actually run into this:** You'll almost never bump into the word "Transformer" directly while using AI; it hides at the very bottom. But you'll see it again and again in tech news and product write-ups. Next time you see it, just have it clear in your mind: that's the "engine type" these models share, not some new product or piece of magic tech.

## 4. The question most worth thinking through: did it "understand"?

This is the most important section of the chapter.

Seeing attention connect "it" to "book," a lot of people will blurt out: **it really understood this sentence.** There's no simple yes or no here, so let's take it in two parts.

**What we can say for sure:** The example sentence is not as easy as it looks. It's a "Winograd-style" sentence (after the Winograd schema): change a word or two and the pronoun points to something else. Change the second half to "because it was about to close," and "it" becomes the library. Grammar alone can't tell them apart; you need common sense, such as that books go overdue and libraries close. When a model gets sentences like this right, it shows it has learned useful patterns from huge amounts of text, very likely including a good deal of common sense.

**What we can't say for sure:** Getting it right doesn't prove human-like understanding, such as first-hand experience of the world or awareness of why it judged as it did. Its abilities come from patterns in its training data. With sentence structures that were rare in training, deliberately designed traps, or knowledge it never learned, it can connect things wrong, and its tone may not change when it does.

| | A human reader | The model |
| --- | --- | --- |
| Relies on | Knowledge of language, plus first-hand experience of the real world | Patterns learned from huge amounts of text, which may include a lot of common sense |
| What getting "it = book" right shows | The reader knows books go overdue | It has learned patterns that can solve sentences like this; whether it understands like a person can't be proven from this |
| When it tends to go wrong | Carelessness, or a genuinely ambiguous sentence | Rare structures, deliberately designed traps, knowledge missing from training |

> **Key point:** "It can grab what matters and use common sense" and "it understood like a person" are two separate questions. The first can be checked by its behavior; the second is still unsettled. This book takes the same stance as Chapters 1 and 2: treat it as a system that has learned a great many useful patterns but can go wrong in unexpected places. In practice that comes down to one habit: double-check important references and facts yourself (Chapter 9 explains why fluent answers can still be wrong).

## 5. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| The model reads a sentence by looking over it evenly from start to finish | Attention lets it look **with emphasis**, giving related words more "attention weight" |
| A chat model can see the context on both sides of every word it processes | Text-generating models can only look back; but everything you send at once comes before the answer, so it can all be used when generating the answer |
| Getting "it = book" right proves it understood like a person | It shows it learned useful patterns (possibly including common sense), but doesn't prove human-like understanding |
| The Transformer is a specific AI product | It's an **underlying architecture** (an engine type); most mainstream large models are built on it or a variant of it |
| To use AI well, you first have to understand the Transformer's internals | No need. Knowing "its core is attention, and it's the shared foundation of mainstream models" is enough |
| The stronger the attention, the less it'll err | Being good at underlining isn't the same as never erring; with rare, tricky sentence structures it can still connect wrong |

## Summary

- **Attention**: when processing each position, the model decides which available tokens to take information from and how much weight each gets; in short, it **underlines what matters**. Text-generating chat models can only look back (causal attention).
- It's precisely because it looks with emphasis that it can reach across a heap of words and catch the key connections in a long sentence (like who a pronoun actually refers to).
- It also looks with **multiple attention heads** at once; what each head focuses on takes shape in training, and the division of labor in the table is only an illustration.
- The **Transformer** is the underlying architecture of today's mainstream large models (or the basis of their improved and hybrid versions), like an "engine type," with attention at its core. Knowing it exists is enough; its internal structure isn't worth digging into.
- Getting "it" right shows it learned useful patterns, even common sense, but doesn't prove human-like understanding; with rare structures and traps it can still go wrong.

In the next chapter we switch angles: how was a model like this, one that knows how to underline what matters and how to add words, originally **"taught"**, from reading huge amounts of text to learning to do what you say properly.

## Sources and verification

- Vaswani et al., *Attention Is All You Need* (2017): [arXiv paper page](https://arxiv.org/abs/1706.03762). It introduced the Transformer; the abstract describes it as based solely on attention mechanisms.
- The [Winograd Schema page](https://cs.nyu.edu/~davise/papers/WinogradSchemas/WS.html) maintained by Davis, Morgenstern, and Ortiz: such sentences come in pairs that differ by a word or two, and resolving the pronoun takes common sense and reasoning.
- The [Qwen3-Next-80B-A3B model card](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct): an example that mixes linear-attention (Gated DeltaNet) layers with standard attention layers.

Sources checked 2026-10-27.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most accurate one-sentence summary of what "attention" does? <!-- quiz: q01 revision: 1 -->
   - A. It looks at every word in the sentence evenly, so no information gets missed
   - B. It records all your past conversations so later chats can call them up any time
   - C. For each position, it decides which words to draw on and how much each weighs
   - D. It compresses the whole sentence into one set of numbers for comparing meanings
   > **Answer: C.** The core of attention is "looking with emphasis": giving more weight to words related to the current position, that is, underlining what matters. A is the opposite: it specifically does not look evenly. B mixes attention up with context and product memory (Chapter 3). D sounds more like the embeddings of Chapter 5, which compress meaning into vectors to compare closeness.

2. **[Basic · Concept]** Which statement about the Transformer is correct? <!-- quiz: q02 revision: 1 -->
   - A. It's a chat product on a par with ChatGPT, released by one company on its own
   - B. It's an architecture built around attention that most mainstream models are based on
   - C. It's a specialized AI chip, and models have to be installed on it before they can run
   - D. It means every company's LLM is exactly the same program under a different name
   > **Answer: B.** The Transformer is like an "engine type": most mainstream large models are built on it or on improved and hybrid versions of it. A mistakes the architecture for a product; C mistakes it for hardware. D is the most confusing: sharing an architecture doesn't make two models the same, since size, training data, and modifications differ from company to company, and some mix in other kinds of layers.

3. **[Advanced · Misconception]** A model connects "it" to "book" in "Xiao Li returned the book to the library, because it was already overdue," and some say this shows "it already understands like a person." Which view is most sound? <!-- quiz: q03 revision: 1 -->
   - A. It shows useful patterns, even common sense, were learned, but not human-like understanding
   - B. That's right: solving a sentence that needs common sense proves it understands like a person
   - C. It's just luck: the model really only links a pronoun to whichever noun is closest to it
   - D. It got it right by looking up a built-in grammar dictionary, which has nothing to do with training
   > **Answer: A.** This is a Winograd-style sentence: swap "overdue" for "about to close" and "it" becomes the library, which grammar alone can't settle. Getting it right shows it learned useful patterns, possibly including common sense, but doesn't prove human-like understanding. B equates behavior directly with human-like understanding. C doesn't hold up: the noun closest to "it" is "library," so linking to the nearest noun would get it wrong. D is also wrong: grammar rules can't resolve sentences like this, and its behavior comes from patterns learned in training.

4. **[Advanced · Misconception]** "The attention mechanism is very strong, so it almost never errs when handling a sentence." Where does this reasoning wobble? <!-- quiz: q04 revision: 1 -->
   - A. It doesn't: as long as attention is used, mix-ups over references basically stop
   - B. It's the reverse: attention makes models more error-prone, so less of it is better
   - C. Errors depend only on the context window's size; a big enough window prevents them
   - D. Underlining well isn't never erring; rare structures or traps can still trip it
   > **Answer: D.** Attention working doesn't mean it can't err. With unusual sentence structures, deliberate traps, or knowledge it never learned, it can still connect things wrong, and its tone may not give that away (Chapter 9). A is the very reasoning in the question. B is backwards: attention is a big reason it can handle long sentences at all. C blames window size, but a bigger window doesn't fix misreadings.

5. **[Basic · Scenario]** You wrote a sentence with a somewhat roundabout reference and sent it to the AI, and it took "this plan" to mean the one you didn't intend. What's the most practical next step? <!-- quiz: q05 revision: 1 -->
   - A. Resend the exact same sentence a few times and wait for it to work it out
   - B. Decide it can't read your language, and switch to English so it won't err
   - C. Replace "this plan" with its real name to clear up the ambiguity, then ask
   - D. Add "please read this carefully" at the end, and it will pick the right one
   > **Answer: C.** The more roundabout the reference, the easier it is to misread; rather than hoping it guesses right, remove the ambiguity directly (a basic of prompting in Chapter 11). A leaves the ambiguity in place, and since output has some randomness, resending may not help (Chapter 8). B blows one mix-up up into a language problem, and switching languages doesn't remove the ambiguity. D is a magic phrase, no substitute for saying it clearly.

6. **[Basic · Hands-on]** Make up a sentence with **an ambiguous pronoun**, ask the AI "what does 'it / he / this' refer to here, and why," and try several sentence structures. Also try pairs that differ by a word or two, such as "because it was already overdue" and "because it was about to close." Observe: what kinds of sentences does it answer steadily, and what kinds easily get connected wrong? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** With common sentence structures it usually answers quickly and steadily; with tricky structures, sentences that need unusual knowledge, or deliberate traps, it's more likely to connect wrong. Sentence pairs show whether it changes its answer along with the key word. These observations help you judge where it's reliable and where you should reread things yourself, but getting a sentence right or wrong can't by itself prove whether it understands like a person.
