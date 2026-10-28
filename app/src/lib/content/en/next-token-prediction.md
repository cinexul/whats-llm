In Chapter 2 we cleared up a big misunderstanding: a large language model is not a database; its answers are "computed and generated on the spot," not looked up. But a new question immediately pops up: **if it's not looking things up, how does it "compute" a smooth passage in the first place?**

For most chat language models, the core text-generation loop is **predict a distribution of possible next tokens, choose one, then repeat**. A token can be a word or part of one. The calculations behind each prediction can be complex; generating one token at a time does not mean the model cannot reason or plan.

This chapter explains that core generation loop. Understand it, and you'll work out three things in one go: why it can write long articles, code, and tables; why it answers the same question a little differently each time; and most importantly, **why fluent answers can still contain fabricated details** (hallucination, covered in chapter 9).

## 1. A starting analogy: much more capable keyboard autocomplete

You use a "predict the next word" thing every day: the **autocomplete on your phone's keyboard.**

You type "the weather today is really," and candidates jump up above: "nice," "good," "hot." How does it guess? Because it has tallied massive amounts of text and knows which words **most often follow** "the weather today is really."

**Predicting a continuation is a useful starting analogy for a large language model, but its learned representations and capabilities are much richer.** You give it an opening, and based on the language patterns it learned during training (that set of "tuned knobs" from chapter 2), it computes "what the next token most likely is" and picks one to continue with; then it treats "the opening + the word it just added" as a new opening and **computes the next one**; one after another like this, it **rolls out a whole passage, like a snowball.**

```text
At each step it's doing this "fill in the blank":

  So far: "The capital of China is"
       ↓  compute: what's the most likely next token?
  Add one: "Bei"
       ↓  treat "The capital of China is Bei" as the new opening, compute again
  Add one: "jing"
       ↓  keep going...
  Finally rolls out: "The capital of China is Beijing."
```

> **Key point:** The visible text is usually generated token by token. That does **not** tell us everything the model computed before choosing each token. Reasoning models may also generate intermediate reasoning before the final response (chapter 8). The "Bei / jing" split here is only an illustration; actual token boundaries depend on the tokenizer. Each new output token is another iteration of the generation loop.

## 2. How it "picks" the next word: a probability list

A more accurate picture of "predict the next word": at each step, the model gives **every candidate token** in its vocabulary a probability score, arranges them into a list, and then **picks one** to continue with.

An example. Suppose what came before is "The capital of Japan is," and the list the model computes inside looks roughly like this:

```text
Before: "The capital of Japan is" → probability list for the next token (numbers are made up for illustration):

  Tokyo ........ 92%   ← highest probability
  Japan ........  2%
  Osaka ........  1.5%
  Edo ..........  0.8%
  ...(thousands more candidates, all with low probability)
```

> **Important reminder:** The percentages above are **a made-up example for illustration**, not the real numbers of any real model. The real probabilities are computed inside the model and you don't normally see them. They're used here only to give you a picture: **the "next word" in the model's eyes is a candidate list with probabilities, not a single fixed answer.**

When picking a word it usually **leans toward the high-probability ones**, but it **doesn't always rigidly pick number one**. Hidden here is a phenomenon you've long noticed:

- Choosing the highest-probability token at each step is called **greedy decoding**. With identical inputs and a fully deterministic implementation, it produces the same output. A real service may still vary because its inputs or computation differ.
- Many systems instead use **sampling**, which introduces controlled randomness. This can change the wording between runs, but does not guarantee a different answer every time.

> **How you'll actually run into it:** "Regenerate" may produce a different answer through sampling. Rephrasing also changes the input, so it can change the answer even without randomness. Neither guarantees an improvement. Chapter 8 explains temperature and other controls; availability depends on the product.

## 3. With just this one thing, how can it write long articles, code, and tables?

You might doubt it: it's just "guessing the next word," so how can such a plain action write a logically coherent long article, runnable code, an aligned table?

The key is that **the "next word" is computed together with the text that came before.** Every word it guesses takes **the earlier content available in its context window** into account (your question + the part it has already written), which is exactly what the "context window" from chapter 3 holds. So:

- Writing an **article**: it wrote "First, ..." earlier, so when computing the next paragraph, "Second," becomes a high-probability continuation. **The structure emerges naturally**, with no one having to dictate it.
- Writing **code**: code is also a kind of "language," with strong patterns (brackets must pair, indentation matters, an `if` is often followed by a condition). It learned these patterns into its parameters too, so **token by token, it can also "continue" code that follows the syntax.**
- Making a **table**: the `|` and `---` of a Markdown table are also a patterned text format, and it can continue them by pattern just the same.

```text
Why "only guessing the next word" can still make a whole piece:
  every step uses the earlier content available in the context window
  → the previous sentence steers the next one
  → relayed step by step, logic and structure "grow" out
```

> **Key point:** Next-token prediction can support complex behavior. Learned patterns and the available context let the model maintain structure over many steps; an outline or intermediate reasoning can help too. But coherent structure does not guarantee correct logic, working code, or accurate facts.

## 4. The point most worth remembering: a plausible answer is not a verified answer

Now, putting the previous three sections together leads to a conclusion that's a little unsettling but extremely important.

A next-token probability measures **how likely a continuation is under the model**, not whether a statement is true. Training can reward accurate answers and honest uncertainty; some products also search, use calculators, or check sources. However, **the generation loop itself provides no guarantee that every claim has been verified against reliable evidence**.

In other words:

> **Fluency and confidence are not evidence that an answer is correct.**

This helps explain one of its most frustrating failure modes: **it confidently talks nonsense (hallucination):**

- When evidence is missing or its learned knowledge is unreliable, the model **may generate a plausible but false answer**. It can also say "I'm not sure," especially after training that rewards honesty. The problem is that neither confident wording nor a statement of uncertainty is a dependable accuracy test by itself.
- Surface features like formatting, tone, and phrasing almost always come out polished, even when the content is wrong. So a confident tone is only loosely related to being right: confident answers are often correct, but they can also be wrong in a very convincing way. Fluency shows that something looks like a good answer, not that it is one; judge it by the evidence.

> **Common misconception:** "The answer is so coherent that it must have been checked." A model may reason, plan, and use tools, but smooth prose alone does not show that those steps were successful—or that sources were checked at all. **Judge factual claims by their evidence, not their presentation** (chapter 9).

> **How you'll actually run into it:** Summarizing material you provide gives it a source to work from and gives you something to check. It can still omit or distort details. Asking for an obscure number, citation, or quotation without a source is riskier: learned knowledge may be incomplete, and it may invent a convincing detail. Check important claims against the original source in either case (chapter 15).

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| It must have the whole answer ready before writing | Text is generally generated **token by token**; a model may also produce an outline or intermediate reasoning before its final response |
| Its answer is "looked up" from somewhere | It's **generated on the spot by probability** (following chapter 2: not a database) |
| For the same question, its answer should be word for word identical | Word-picking carries a bit of **randomness**, so the wording often differs each time (how randomness is adjusted, see chapter 8) |
| It speaks coherently, so it "understood" and "verified" | Coherence does not prove accuracy; check whether the answer is supported by reliable evidence |
| Since it "guesses the next word," it can only write short sentences | Learned patterns and **the available context** can support long passages, structured explanations, and code |
| When it confidently says something wrong, it must be a software bug | Hallucinations can occur even when the software runs as designed; training and tools can reduce them, but important claims still need checking |

## Summary

- The core text-generation loop predicts a **probability distribution over next tokens**, selects one, and repeats. The calculations behind that loop can support complex reasoning and planning.
- It selects tokens from a **probability distribution** (our percentages are illustrative). Sampling can vary the output; identical wording is also possible. Chapter 8 explains generation settings.
- Learned patterns and **available context** help maintain structure across a long answer. Outlines and intermediate reasoning can also guide generation; coherence alone does not prove correctness.
- **A likely continuation is not automatically a true statement.** Training can encourage truthfulness and uncertainty, and tools can supply evidence, but none of that guarantees every claim is correct (chapter 9).
- Providing source material makes answers easier to ground and check. Unsupported specific facts are especially risky; verify important details, including those in summaries (chapter 15).

In the next chapter (Chapter 5), we look at its "inner workings" from another angle: how it turns the **meaning** of words into computable "coordinates," so it can "sense" which words are close in meaning. This is **vectors and embeddings**, also the basis of search and RAG (chapter 20).

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** In one sentence, which best sums up the core mechanism by which a large language model generates text? <!-- quiz: q01 revision: 2 -->
   - A. It first writes out the whole answer internally, then outputs it all in one go
   - B. It predicts next-token probabilities from what came before, picks one, and repeats
   - C. It finds the best-matching sentence among huge numbers it saved in training and copies it
   - D. It translates your question into program commands, then runs them to get an answer
   > **Answer: B.** The core loop is: compute probabilities for the next token from what came before, pick one, append it, and compute the next. A is wrong about "in one go": text is generated token by token, though a model can outline or reason first, which doesn't conflict with token-by-token generation. C mistakes generation for retrieving stored sentences (corrected in chapter 2). D doesn't describe how text is generated.

2. **[Basic · Concept]** What role does the "probability distribution" (that list of candidate words) play during generation? <!-- quiz: q02 revision: 2 -->
   - A. It gives the chance each claim is true, and the most probable one is always a fact
   - B. It's a fixed word-frequency table; the same preceding text always gets the top pick
   - C. It records the odds of your past chat habits, to guess which answer you'd like
   - D. At each step it scores the candidate tokens, then one is chosen by some strategy
   > **Answer: D.** At every step, the model's "next word" is a list with probabilities, and one is chosen and appended; numbers like "Tokyo 92%" in this chapter are made up for illustration, and you don't normally see the real ones. A is the most tempting trap: a probability says how common and natural a continuation is, not how true the sentence is (section 4 of this chapter). B is wrong: probabilities are computed fresh from the current text, and many systems sample rather than always taking the top pick. C confuses it with a product's memory feature.

3. **[Advanced · Misconception]** "It answered so clearly and logically, it must have understood my question and checked everything first." Where does this go wrong? <!-- quiz: q03 revision: 2 -->
   - A. Clear structure shows it's good at organizing text, not that the content was checked
   - B. It's right: if an answer is tightly structured, every point in it has been verified
   - C. It truly understood the question; it just never checks any facts, in any situation
   - D. Clear structure is actually a sign of fabrication; the neater it is, the likelier it's wrong
   > **Answer: A.** The mistake is treating clear expression as proof of verification. A model can reason, and some products can call tools like search, but those steps can fail or may not have happened at all. B is the very misconception in the question. C is too absolute: you can't judge "understanding" from one answer, and products with tools really can check things. D swings to the other extreme: structure and correctness aren't inversely related, and well-organized answers are often right. You still judge by the evidence.

4. **[Advanced · Misconception]** "When it confidently says something wrong (hallucination), the program must have a bug." What's wrong here? <!-- quiz: q04 revision: 2 -->
   - A. It's right; once the company fixes this bug, it will never get things wrong again
   - B. Your question was too hard and broke the model; ask simpler ones and it won't err
   - C. It happens even when working normally; without evidence it can produce a plausible error
   - D. It's because it's offline; once it's connected to the web, these errors stop for good
   > **Answer: C.** A made-up answer doesn't necessarily mean a software fault: with missing evidence or unreliable learned knowledge, the generation loop can still continue with fluent errors. Better training, retrieval, and tools lower the risk but don't remove it. A treats hallucination as a bug you can fix once. B blames the asker, but simple questions can get wrong answers too. D is half right: web search can supply evidence, but what it finds can be wrong, or the model can misread it (chapters 9 and 15).

5. **[Basic · Scenario]** Which of these tasks is most likely to make it "make up" details, so that you most need to check each one? <!-- quiz: q05 revision: 2 -->
   - A. Summarize an article you just pasted into three key points
   - B. Give an obscure book's ISBN and publication year from memory
   - C. Rewrite a paragraph you wrote so it sounds more conversational
   - D. Sort a list of names you supplied alphabetically by surname
   > **Answer: B.** Specific details like an obscure book's number and year may not be in what it learned at all, and with no material to rely on, it can easily produce a convincing-looking answer; check it against the original source. A, C, and D all give it material that you can compare against, so the risk is lower, but not zero: a summary can omit or distort details, and sorting can slip too, so look over results that matter.

6. **[Basic · Hands-on]** Find an AI with a "regenerate" button, and for **the same open-ended question** (like "give my cat three names") click "regenerate" a few times in a row; then try a question with **a single correct answer** (like "what's 3 plus 5") a few times too. Compare: for which kind of question do the repeated answers **vary a lot**, and for which are they **nearly unchanged**? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Open-ended naming tasks often vary more because many continuations are plausible. A simple arithmetic answer may stay the same, although its wording can vary. Results depend on the model and settings; you may also get repeated names. This exercise illustrates possible sampling variation, not a guarantee that every regeneration changes the answer or improves it.
