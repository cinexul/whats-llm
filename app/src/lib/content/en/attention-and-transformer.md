In Chapter 3 we said the model cuts text into tokens and lays them out on the "table"; in Chapter 4, that it adds the next word one at a time. One question is still open: a sentence has so many words, so when the model picks the next one, which words is it actually looking at?

Read this sentence:

> "Xiao Li returned the book to the library, because it was already overdue."

"It" refers to the book, not the library. You get it at a glance: what goes overdue is a borrowed book. When you reach "overdue," you instinctively glance back and pick whichever of "book" and "library" makes sense. The model has to do this too, and it relies on the star of this chapter: **attention**. There are no formulas here; the goal is an intuition.

## 1. Attention: reading a sentence, your eyes scan back and forth between words

When we read a long sentence, our eyes don't sweep evenly over every word. As we read a word, we naturally look more at the few words related to it and only glance at the rest. Attention is the machine version of this: each time the model processes a position, it decides which tokens to take information from, and in what proportions.

All of those tokens are earlier ones. The large language models used for chat write one token after another (Chapter 4), so each position can only look back: it can draw on itself and what came before, but it can't see words that haven't appeared yet. So when the model reads "it," the word "overdue" isn't there yet, and what "it" means is still open. When it reaches "overdue," it looks back for "what can be overdue," links the information in "it" and "book," and from then on treats "it" as that book.

The figure below draws this, using the chapter's example and a second sentence that changes only the ending (section 5 comes back to this pair). A thicker line means the model looks back at that word more from that position:

![Attention sketch for two sentences. First sentence, "Xiao Li returned the book to the library, because it was already overdue": looking back from "overdue," the line to "book" is thickest, the line to "it" is medium, and the line to "library" is thinnest, so here "it" is the book. Second sentence, "Xiao Li returned the book to the library, because it was about to close": looking back from "close," the line to "library" is thickest, so here "it" is the library](/figures/en/attention.svg)

The two sentences are word-for-word identical up to "it," so when the model reads "it," it sees exactly the same thing in both. The difference comes from the word after: looking back from "overdue," "book" gets the most attention; looking back from "close," "library" does. The line widths are only an illustration. In a real model, attention is spread across many layers and many heads (section 3) and is never this tidy.

Attention that can only look back is called causal attention, and it's what text-generating chat models use. Some models built only to understand text, not generate it (encoders used for search or classification, for example), can look at the context on both sides. Everything you send at once, your question and any material, comes before the answer, so all of it is available when the answer is generated.

## 2. How does it decide what to look at?

Which earlier words get the most attention isn't a rule written in advance; it's worked out fresh at every step. You can picture it like this:

- Each token sends out a "question" describing what information it needs right now. The position at "overdue," for instance, is roughly asking "what can be overdue?"
- Each token also carries a "label" describing what it can offer, plus some "content," the information it actually passes along.
- The model compares the current position's question with the label of every earlier token (including itself). The better a label matches, the more of that token's content gets passed along. The match results are turned into proportions that add up to exactly 100%, and the current position mixes everyone's content in those proportions and adds the mix to its own representation.

The technical names for these three are query, key, and value. What the questions, labels, and contents actually look like is learned in training, not written by hand.

There's one thing this matching can't do on its own: tell the order apart. It only checks how well questions and labels fit; it has no idea which word came first. If the model weren't told positions separately, "dog bites man" and "man bites dog" would be the same three words, and this step would struggle to tell who bit whom. So the model is also given each token's position. The original Transformer added a set of numbers meaning "this is position N" straight onto each token's vector; many large models today (Qwen3, for example) use a different method that takes into account how far apart two tokens are when it compares a question with a label.

## 3. Not just one look: several viewpoints, layer after layer

The model doesn't use just one set of questions, labels, and contents on a sentence. It uses several at once, and each set is called an attention head. Picture handing one draft to several editors at the same time, each watching for something different. The table below is only an illustration:

| What this "viewpoint" might watch for | What it would notice in the example |
| --- | --- |
| who refers to whom | "it" ↔ "book" |
| who did what to whom | "Xiao Li" → "returned" → "library" |
| cause and contrast | "because" hooks the second half to the first |

In a real model, what each head watches for forms on its own during training; the division of labor is usually not this neat and may not be expressible in words at all. The heads' results are combined and handed to the next layer, so one layer's output is the next layer's input. Models stack many such layers: as of October 2026, Qwen3-8B, whose configuration is public, has 36 layers with 32 attention heads in each.

## 4. The Transformer: the "engine type" of today's mainstream models

Combine attention with a few other parts into a complete structure that can be stacked layer upon layer and scaled up, and you have the **Transformer**. It comes from the 2017 paper "Attention Is All You Need."

Today's mainstream large models (Claude, GPT, Gemini, and so on) are basically built on the Transformer or on improved or hybrid versions of it. Think of it as a car's engine type: you don't need to know how the engine works to drive, but knowing that most cars use this kind of engine helps explain why different models share so many habits.

"Improved or hybrid versions" means that over the past year or two, some models have replaced part of their standard attention layers with cheaper linear-attention or state-space layers and mixed the two kinds. As of October 2026, for example, Alibaba's Qwen3-Next uses such a hybrid structure.

The Transformer has many other parts and terms (such as "encoder/decoder," listed in the Appendix A glossary). Taken apart, it's all math, which doesn't help much with using it well and not being fooled by it. Three things are enough to remember: its core is attention; it can be stacked very deep and made very large; and most mainstream models are built on it or a variant. You'll almost never meet the word "Transformer" while using AI, though it shows up all the time in tech news and product announcements.

## 5. The question most worth thinking through: did it "understand"?

Seeing attention link "it" to "book," many people say the model truly understood the sentence. That question has no simple yes or no, so let's take it in two parts.

What we can say for sure is that the example isn't as easy as it looks. It's a "Winograd-style" sentence (after the Winograd schema): change a word or two and the pronoun points to something else, like the second sentence in the figure. Grammar alone can't tell them apart; you need common sense, such as that books go overdue and libraries close. When a model gets sentences like this right, it has learned useful patterns from huge amounts of text, very likely including a good deal of common sense.

What we can't say is whether getting it right proves human-like understanding, such as firsthand experience of the world or knowing why it judged as it did. Its abilities come from patterns in its training data. With sentence structures rare in training, deliberately designed traps, or knowledge it never learned, it can link things wrongly, and its tone may not change when it does.

| | Human reader | Model |
| --- | --- | --- |
| Relies on | Knowledge of language, plus firsthand experience of the world | Patterns learned from huge amounts of text, possibly including a lot of common sense |
| What linking "it = book" correctly shows | The reader knows books go overdue | It learned patterns that solve this kind of sentence; whether it understands like a person can't be proven from this |
| When it tends to go wrong | Carelessness, or when the sentence itself is ambiguous | Rare structures, deliberate traps, knowledge missing from training |

This book's stance is the same as in Chapters 1 and 2: treat it as a system that has learned a lot of useful patterns but goes wrong in unexpected places. In practice, check important references and facts yourself; Chapter 9 explains why fluent answers can still be wrong and how to check them.

## 6. Common misconceptions, set straight

| Misconception | Reality |
| --- | --- |
| The model reads a sentence by looking evenly from start to finish | Attention lets it look with emphasis, giving related words more weight |
| When a chat model processes each word, it can see the context on both sides | Text-generating models can only look back; but everything you send at once comes before the answer, so all of it is available for the answer |
| Attention only matches content, so word order doesn't matter | The model is given position information separately, so "dog bites man" and "man bites dog" are different to it |
| Linking "it = book" correctly proves it understood like a person | It shows useful learned patterns (possibly including common sense), not human-like understanding |
| The Transformer is a specific AI product | It's an underlying architecture; most mainstream models are built on it or a variant |
| The stronger the attention, the less it gets wrong | Picking out what matters isn't the same as never being wrong; rare or tricky structures can still trip it up |

## Summary

- Attention: when processing each position, the model decides which available tokens to take information from and in what proportions; in other words, it picks out what matters. Text-generating chat models can only look back.
- How the proportions are set: each token sends out a "question" and carries a "label" and "content"; the better a label matches the question, the more content is passed along (query, key, value). Position information is supplied separately, so the model can tell word order apart.
- The model looks again and again, with many attention heads and many layers; what each head watches for forms during training.
- The Transformer is the underlying architecture of today's mainstream models (or the basis of improved and hybrid versions), and its core is attention.
- Linking "it" correctly shows useful learned patterns, even common sense, but doesn't prove human-like understanding; with rare structures and traps it can still go wrong.

The next chapter takes a different angle: how a model that picks out what matters and continues text was "taught" in the first place, from reading huge amounts of text to learning to do what you ask.

## Sources and verification

- Vaswani et al., *Attention Is All You Need* (2017): [arXiv paper page](https://arxiv.org/abs/1706.03762). Introduces the Transformer; the abstract says it is based solely on attention. The paper describes attention in terms of a query and key-value pairs, with the output as a weighted sum of the values, and adds positional encodings to the input so the model can use word order.
- The [Winograd Schema page](https://cs.nyu.edu/~davise/papers/WinogradSchemas/WS.html) maintained by Davis, Morgenstern, and Ortiz: these sentences come in pairs that differ by a word or two, and resolving the pronoun takes common sense and reasoning.
- [Qwen3-Next-80B-A3B model card](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct): an example that mixes linear-attention (Gated DeltaNet) layers with standard attention layers.
- Su et al., *RoFormer: Enhanced Transformer with Rotary Position Embedding* (2021): [arXiv paper page](https://arxiv.org/abs/2104.09864). Rotary position embedding (RoPE) brings relative position into the attention calculation.
- [Qwen3-8B model configuration](https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json): 36 layers (`num_hidden_layers`), 32 attention heads per layer (`num_attention_heads`), and RoPE for positions (`rope_theta`).

Sources checked: the first three on 2026-10-27, the last two on 2026-10-28.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most accurate one-sentence summary of what "attention" does? <!-- quiz: q01 revision: 2 -->
   - A. It looks at every word in the sentence evenly, so no information gets missed
   - B. It records all your past conversations so later chats can call them up any time
   - C. For each position, it decides which words to draw on and how much each weighs
   - D. It compresses the whole sentence into one set of numbers for comparing meanings
   > **Answer: C.** The core of attention is "looking with emphasis": giving more weight to words related to the current position, that is, underlining what matters. A is the opposite: it specifically does not look evenly. B mixes attention up with context and product memory (Chapter 3). D sounds more like the embeddings of Chapter 5, which compress meaning into vectors to compare closeness.

2. **[Basic · Concept]** Which statement about the Transformer is correct? <!-- quiz: q02 revision: 2 -->
   - A. It's a chat product on a par with ChatGPT, released by one company on its own
   - B. It's an architecture built around attention that most mainstream models are based on
   - C. It's a specialized AI chip, and models have to be installed on it before they can run
   - D. It means every company's LLM is exactly the same program under a different name
   > **Answer: B.** The Transformer is like an "engine type": most mainstream large models are built on it or on improved and hybrid versions of it. A mistakes the architecture for a product; C mistakes it for hardware. D is the most confusing: sharing an architecture doesn't make two models the same, since size, training data, and modifications differ from company to company, and some mix in other kinds of layers.

3. **[Advanced · Misconception]** A model connects "it" to "book" in "Xiao Li returned the book to the library, because it was already overdue," and some say this shows "it already understands like a person." Which view is most sound? <!-- quiz: q03 revision: 2 -->
   - A. It shows useful patterns, even common sense, were learned, but not human-like understanding
   - B. That's right: solving a sentence that needs common sense proves it understands like a person
   - C. It's just luck: the model really only links a pronoun to whichever noun is closest to it
   - D. It got it right by looking up a built-in grammar dictionary, which has nothing to do with training
   > **Answer: A.** This is a Winograd-style sentence: swap "overdue" for "about to close" and "it" becomes the library, which grammar alone can't settle. Getting it right shows it learned useful patterns, possibly including common sense, but doesn't prove human-like understanding. B equates behavior directly with human-like understanding. C doesn't hold up: the noun closest to "it" is "library," so linking to the nearest noun would get it wrong. D is also wrong: grammar rules can't resolve sentences like this, and its behavior comes from patterns learned in training.

4. **[Advanced · Misconception]** "The attention mechanism is very strong, so it almost never errs when handling a sentence." Where does this reasoning wobble? <!-- quiz: q04 revision: 2 -->
   - A. It doesn't: as long as attention is used, mix-ups over references basically stop
   - B. It's the reverse: attention makes models more error-prone, so less of it is better
   - C. Errors depend only on the context window's size; a big enough window prevents them
   - D. Underlining well isn't never erring; rare structures or traps can still trip it
   > **Answer: D.** Attention working doesn't mean it can't err. With unusual sentence structures, deliberate traps, or knowledge it never learned, it can still connect things wrong, and its tone may not give that away (Chapter 9). A is the very reasoning in the question. B is backwards: attention is a big reason it can handle long sentences at all. C blames window size, but a bigger window doesn't fix misreadings.

5. **[Basic · Scenario]** You wrote a sentence with a somewhat roundabout reference and sent it to the AI, and it took "this plan" to mean the one you didn't intend. What's the most practical next step? <!-- quiz: q05 revision: 2 -->
   - A. Resend the exact same sentence a few times and wait for it to work it out
   - B. Decide it can't read your language, and switch to English so it won't err
   - C. Replace "this plan" with its real name to clear up the ambiguity, then ask
   - D. Add "please read this carefully" at the end, and it will pick the right one
   > **Answer: C.** The more roundabout the reference, the easier it is to misread; rather than hoping it guesses right, remove the ambiguity directly (a basic of prompting in Chapter 11). A leaves the ambiguity in place, and since output has some randomness, resending may not help (Chapter 8). B blows one mix-up up into a language problem, and switching languages doesn't remove the ambiguity. D is a magic phrase, no substitute for saying it clearly.

6. **[Basic · Hands-on]** Make up a sentence with **an ambiguous pronoun**, ask the AI "what does 'it / he / this' refer to here, and why," and try several sentence structures. Also try pairs that differ by a word or two, such as "because it was already overdue" and "because it was about to close." Observe: what kinds of sentences does it answer steadily, and what kinds easily get connected wrong? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** With common sentence structures it usually answers quickly and steadily; with tricky structures, sentences that need unusual knowledge, or deliberate traps, it's more likely to connect wrong. Sentence pairs show whether it changes its answer along with the key word. These observations help you judge where it's reliable and where you should reread things yourself, but getting a sentence right or wrong can't by itself prove whether it understands like a person.
