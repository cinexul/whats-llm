Chapter 2 explained that a large language model is not a database: its answers are computed on the spot, not looked up. That raises the next question right away: if it isn't looking things up, how does it "compute" a smooth passage?

For most chat models, the way text gets written is surprisingly simple: work out what the next token is likely to be, pick one, add it, and do it again. The math behind each step can be complicated, and writing one token at a time doesn't mean the model can't reason or think ahead.

Once you understand this loop, three things click at once: why it can write long articles, code, and tables; why it answers the same question a little differently each time; and why an answer that reads smoothly can still have made-up details in it.

## 1. A comparison to start: keyboard autocomplete, only far smarter

You use something that predicts the next word every day: your phone keyboard's autocomplete. Type "the weather today is really," and suggestions pop up: "nice," "good," "hot." It has tallied huge amounts of text and knows what usually follows those words.

That's a fine first picture of a large language model, except that what it has learned is far richer than autocomplete. You give it an opening; using the patterns it learned in training (the tuned knobs from chapter 2), it computes what the next token is likely to be and adds one. Then it treats "the opening plus the token it just added" as a new opening and computes the next. One after another, it rolls out a whole passage like a snowball.

```text
At each step it's doing this "fill in the blank" (token boundaries as o200k_base actually splits them):

  So far: "The capital of Japan is"
     ↓  compute the probability list, choose " Tokyo"
  So far: "The capital of Japan is Tokyo"
     ↓  compute again, choose "."
  So far: "The capital of Japan is Tokyo."
     ↓  compute again, choose a special token meaning "done," and stop
```

In both o200k_base and Qwen3, " Tokyo" happens to be a single token; with a different tokenizer, the same word might be cut in two and take one more step. The loop keeps going until the model chooses the special "done" token or hits an output limit set by the product. Reasoning models may also generate intermediate reasoning before the final answer (chapter 8).

## 2. How it "picks" the next word: a probability list

A more accurate picture: at every step, the model assigns a probability to every token in its vocabulary, lines them up in a list, and picks one. If the text so far is "The capital of Japan is," the list looks roughly like the top half of the figure below (the numbers are made up for illustration; you normally can't see a real model's probabilities):

![Bar chart: after "The capital of Japan is," the next token is "Tokyo" with 92% probability, "Japan" 2%, "Osaka" 1.5%, "Edo" 0.8%, and all other candidates 3.7% combined; below, three bars compare Tokyo's chance of being picked at temperature 0.5, 1, and 1.5: 99.9%, 92%, and about 64%](/figures/en/next-token.svg)

Where do these probabilities come from? At each step, the model first gives every token in its vocabulary a score (these raw scores are called logits). The vocabulary is large: o200k_base has about 200,000 tokens and Qwen3 about 150,000. A fixed conversion (softmax) then turns the scores into probabilities: the higher the score, the higher the probability, and all the probabilities add up to exactly 100%. So every candidate gets a probability, though almost all are too small to matter.

It usually leans toward high-probability tokens, but it doesn't always take the top one:

- Choosing the highest-probability token at every step is called **greedy decoding**. In theory, the same input then gives the same output every time; in a real service, small differences in the input or the computation can still change the result.
- Many systems instead sample according to the probabilities, mixing in a bit of randomness you can turn up or down, so the wording can differ between runs (or happen to come out the same). The temperature covered in chapter 8 widens or narrows the gaps between scores before they're turned into probabilities: at low temperature "Tokyo" is picked almost every time, while high temperature gives other candidates more of a chance, as in the bottom half of the figure.

So hitting "regenerate" may get you a different answer through sampling, and rephrasing changes the input itself, so the answer can change even with no randomness at all. Neither one is sure to give you a better answer, and which settings you can adjust depends on the product.

## 3. With just this one thing, how can it write long articles, code, and tables?

You might doubt it: it's just guessing the next word, so how can something that simple produce a coherent long article, code that runs, or a neatly lined-up table?

The key is that the next token is computed together with the text before it. Every step uses what's visible in the current context window, including your question and the part it has already written (the desk from chapter 3). So:

- Writing an article: if it wrote "First, ..." earlier, then "Second," becomes a likely continuation for the next paragraph, and structure emerges naturally.
- Writing code: code is a "language" with strong patterns: brackets come in pairs, indentation matters, and `if` is usually followed by a condition. These patterns are learned into the parameters too, so it can continue code token by token in a way that follows the syntax.
- Making a table: the `|` and `---` of a Markdown table are patterned text as well, and it continues them the same way.

Writing an outline first, or reasoning a bit before answering, also helps it keep a long piece on track. But a tidy structure doesn't mean the logic is right, the code works, or the facts are accurate.

## 4. The point most worth remembering: a plausible answer is not a verified answer

Put the three sections together and you reach an important conclusion: a next-token probability says how natural a continuation is under the model, not how true a statement is. "Tokyo" is likely after "The capital of Japan is" because that's the most common continuation in the patterns it learned, not because the model checked.

Training can encourage it to answer accurately and to say so when it isn't sure, and some products also search, use a calculator, or check sources; but the loop of adding one token after another doesn't check each claim against evidence. When it has nothing to go on and what it learned is shaky, it can keep going with a smooth, confident, wrong answer. This is the **hallucination** covered in chapter 9. Surface features like formatting, tone, and phrasing nearly always come out polished, so fluency only shows that an answer looks like a good one.

This also explains why the risk differs by task. When you ask it to summarize material you've given it, it has something to work from and you can check against the original, though it can still leave things out or get details wrong. Asking for an obscure figure, citation, or quotation with no source at all is much riskier: it may fill in a convincing detail. Chapters 9 and 15 cover how to check.

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| It must have the whole answer ready before writing | Text is generally generated token by token; a model may also produce an outline or intermediate reasoning before its final answer |
| Its answer is "looked up" from somewhere | It's generated on the spot from probabilities (following chapter 2: not a database) |
| For the same question, its answer should be word for word identical | Sampling adds a bit of randomness, so the wording often differs (chapter 8) |
| It speaks coherently, so it must have checked | Coherence doesn't prove accuracy; look for reliable evidence |
| Since it only "guesses the next word," it can only write short sentences | Learned patterns plus the available context can support long passages, code, and tables |
| When it confidently says something wrong, it must be a software bug | Hallucinations happen even when the software runs as designed; training and tools reduce them but don't eliminate them |

## Summary

- The core generation loop: score every token in the vocabulary, convert the scores into probabilities that add up to 100%, pick one, append it, and repeat, until the model picks the special "done" token or hits the output limit.
- Picking leans toward high probabilities, but many systems sample, so the wording may or may not change; temperature widens or narrows the gaps between scores (chapter 8). This chapter's percentages are illustrative.
- Every step is computed with the earlier text in the context window, which is how it writes structured long passages, code, and tables; reading smoothly doesn't make it correct.
- A high probability means a continuation is natural, not that it's true. Providing source material makes answers easier to ground and check; specific facts without a source need checking most (chapters 9 and 15).

In the next chapter (chapter 5), we look at its foundations from another angle: how it turns the meaning of words into computable "coordinates," so it can "sense" which words are close in meaning. This is vectors and embeddings, also the basis of search and RAG (chapter 20).

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
