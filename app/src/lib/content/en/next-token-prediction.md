In Chapter 2 we cleared up a big misunderstanding: a large language model is not a database; its answers are "computed and generated on the spot," not looked up. But a new question immediately pops up: **if it's not looking things up, how does it "compute" a smooth passage in the first place?**

The answer is surprisingly simple. So simple that many people freeze the first time they hear it: **from start to finish, it only does one thing over and over: predict "the next word (token) most likely to come next."** There's no "thinking up the answer first," no "drafting in its head." It just pops out one word after another, and as it pops them out it asks only one thing: "given what came before, what should the next word be?"

This chapter explains that "one and only thing" thoroughly. Understand it, and you'll work out three things in one go: why it can write long articles, code, and tables; why it answers the same question a little differently each time; and most importantly, **why it's bound to "confidently make things up"** (the root of hallucination in chapter 9).

## 1. The principle in one sentence: it's "keyboard autocomplete" scaled up a hundred million times

You use a "predict the next word" thing every day: the **autocomplete on your phone's keyboard.**

You type "the weather today is really," and candidates jump up above: "nice," "good," "hot." How does it guess? Because it has tallied massive amounts of text and knows which words **most often follow** "the weather today is really."

**What a large language model does is, at heart, the same thing, just scaled up a hundred million times.** You give it an opening, and based on the language patterns it learned during training (that set of "tuned knobs" from chapter 2), it computes "what the next token most likely is" and picks one to continue with; then it treats "the opening + the word it just added" as a new opening and **computes the next one**; one after another like this, it **rolls out a whole passage, like a snowball.**

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

> **Key point:** It **doesn't think up the answer "Beijing" first and then write it.** It "guesses the next token, adds it, guesses again," step by step, rolling it out like a snowball. So-called "it's answering a question," taken apart, is **nothing but a relay of hundreds of millions of "guess the next word."** That's the core of a large language model, with nothing more mystical to it. (The gap between your phone's autocomplete and it is mainly that the patterns it learned are far more complex and the "earlier text" it can hold is far longer, as long as the whole context window from chapter 3.)

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

- If it **unfailingly picked the highest-probability one** every time, then asking the same question ten times would give an identical, rigid answer.
- In reality the model picks with a bit of **controllable randomness**: sometimes it picks the second- or third-probability word too. So the wording this time and next time **won't be exactly the same.** This also explains that little experiment in chapter 2, where asking the same question three times always gave slightly different wording.

> **How you'll actually run into it:** When you're unhappy with an answer, clicking "regenerate" or rephrasing often gets you a better version. That relies exactly on this bit of randomness: it amounts to having it **walk a different "word-picking path" again** (chapter 11 covers the "rephrase it" technique). Exactly how this randomness is adjusted (that knob called "temperature") we'll save for **chapter 8**. For now just remember: **its next word is "picked" from a probability list, the picking carries a bit of randomness, so the output varies.**

## 3. With just this one thing, how can it write long articles, code, and tables?

You might doubt it: it's just "guessing the next word," so how can such a plain action write a logically coherent long article, runnable code, an aligned table?

The key is that **the "next word" is computed together with the text that came before.** Every word it guesses takes **everything before it** into account (your question + the part it has already written), which is exactly what the "context window" from chapter 3 holds. So:

- Writing an **article**: it wrote "First, ..." earlier, so when computing the next paragraph, "Second," becomes a high-probability continuation. **The structure emerges naturally**, with no one having to dictate it.
- Writing **code**: code is also a kind of "language," with strong patterns (brackets must pair, indentation matters, an `if` is often followed by a condition). It learned these patterns into its parameters too, so **token by token, it can also "continue" code that follows the syntax.**
- Making a **table**: the `|` and `---` of a Markdown table are also a patterned text format, and it can continue them by pattern just the same.

```text
Why "only guessing the next word" can still make a whole piece:
  every step guesses with "everything before" in tow
  → the previous sentence steers the next one
  → relayed step by step, logic and structure "grow" out
```

> **Key point:** Don't underrate "guess the next word." Because **every step is tightly constrained by the text before it**, these "locally most reasonable next words," relayed along, produce a whole that **looks planned and logical**. But remember: this is **coherence that emerges on its own**, not it "having a blueprint first and then building." This distinction leads straight into the most important point of the chapter.

## 4. The point most worth remembering: it chases "resembling," not "being right"

Now, putting the previous three sections together leads to a conclusion that's a little unsettling but extremely important.

What the model picks at each step is **"the most likely, most natural, most plausible-looking" next word**. Its entire goal is to make the text **smooth, presentable, and in line with how language is used.** **It has no "fact-checking" step.** It won't stop to wonder, "Is what I'm saying true? Is there a basis for it?" It only cares about "does writing it this way next look like a normal stretch of speech."

In other words:

> **A large language model's inner pursuit is "sounds right (resembles the truth)," not "is right (is the truth)."**

This one point directly explains its most maddening flaw: **it confidently talks nonsense (hallucination):**

- Ask it a fact it has "a fuzzy impression" of, and it **won't** say "I'm not sure" (that's not how it works). It'll **just smoothly produce a passage that most resembles an answer**, even if it's made up. Because to it, "making up a plausible answer" and "stating the true answer" are, inside this "guess the next word" machine, **doing the same thing**: picking the most likely next word to continue.
- The more a spot is one where it should be fluent (formatting, tone, phrasing), the more **flawlessly** it can make things up. So **the more confident and fluent an answer, the less you can take it for granted.** Smoothness only means "resembles," not "is right."

> **Common misconception:** "It laid the answer out so coherently, surely it understood my question first, thought it through, and then answered?" **The order is reversed.** It doesn't "understand first, then organize, then express." It **guesses the next word and produces the text as it goes**, and coherence and "looking like it understands" are a **byproduct** of this process, not a precondition. Think this through and you'll see why it can answer so smoothly yet crash on facts: **fluency and correctness, in its case, were never the same thing** (see hallucination in chapter 9).

> **How you'll actually run into it:** Have it summarize material you pasted in and it's generally reliable (because the answer is right there in the context, and what it "continues" is the content you gave); but have it produce a figure, a source, or a quote out of thin air and it's prone to error, because here it has no basis to "continue" from and can only **make up something that resembles, by the pattern of "what this kind of answer usually looks like."** Remember this dividing line and you'll know **when you can use it with confidence and when you must verify** (chapter 15).

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| It thinks up the whole answer in its head first, then writes it | It has **no answer in advance**; it rolls it out **guessing and writing as it goes**, one token at a time |
| Its answer is "looked up" from somewhere | It's **generated on the spot by probability** (following chapter 2: not a database) |
| For the same question, its answer should be word for word identical | Word-picking carries a bit of **randomness**, so the wording often differs each time (how randomness is adjusted, see chapter 8) |
| It speaks coherently, so it "understood" and "verified" | Coherence only means "resembles a normal stretch of speech"; it **doesn't verify facts**, and chases "resembles," not "is right" |
| Since it "guesses the next word," it can only write short sentences | Because every step guesses with **all the text before it**, relayed along it can make whole pieces, essays, and code |
| When it confidently says something wrong, it's "a bug" | This is the **normal product** of the "only chase resemblance, don't chase correctness" mechanism (hallucination, chapter 9), not a malfunction |

## Summary

- A large language model's core, from start to finish, is **just one thing**: based on the text before, predict **the most likely next token**, pick one, continue, and **relay-roll out** a whole passage, like keyboard autocomplete scaled up a hundred million times.
- It picks words from a **probability-weighted candidate list** (the percentages in this chapter are made up for illustration); the picking carries **a bit of randomness**, so the wording of the same question varies each time (chapter 8 covers adjusting it).
- It can write long articles, code, and tables because **every step is constrained by all the text before it**, and locally most-reasonable words relayed along make **coherence and structure emerge naturally**, not "a blueprint first, then construction."
- The deadliest and most important point: it chases **"sounds right (resembles)," not "is right (is true)"**, with **no fact-checking step** in between. This is exactly the root of why it **confidently makes things up (hallucination)** (chapter 9).
- From this comes a practical dividing line: **when it has a basis to "continue" (like summarizing material you gave) it's more reliable; producing hard facts out of thin air is error-prone, and must be verified** (chapter 15).

In the next chapter (Chapter 5), we look at its "inner workings" from another angle: how it turns the **meaning** of words into computable "coordinates," so it can "sense" which words are close in meaning. This is **vectors and embeddings**, also the basis of search and RAG (chapter 20).

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence best sums up the core mechanism by which a large language model generates text?
   - A. It thinks up the complete answer first, then outputs it all at once
   - B. Based on what came before, it repeatedly predicts "the most likely next token," relaying one after another to roll out a whole passage
   - C. It retrieves ready-made sentences from a database
   - D. It translates your question into a command and executes it
   > **Answer: B.** "Predict the next token, add it, predict again" is its entire core. A imagines it "has a draft first" (order reversed); C is the "database" misconception (busted in chapter 2); D doesn't answer the question. Remember: coherence is a byproduct of this relay process, not a precondition.

2. **[Basic · Concept]** What role does the "probability distribution (that candidate-word list)" play during generation?
   - A. It's the model's startup screen
   - B. At each step, the model scores each candidate token by probability, then picks one to continue with
   - C. It records the probabilities of your chat history
   - D. It decides network speed
   > **Answer: B.** At each step, the "next word" in the model's eyes is a probability-weighted list, and it picks one to continue. A, C, and D are all unrelated to the mechanism. To add: numbers like "Tokyo 92%" in this chapter are **made up for illustration**, and you don't normally see the real probabilities.

3. **[Advanced · Misconception]** "It answered so clearly and logically, it must have understood my question and checked the facts before speaking." Where does this idea go wrong?
   - A. Nothing's wrong; it understands first, then answers
   - B. It **guesses the next word and produces the text as it goes**, and coherence and "looking like it understands" are byproducts; it **doesn't verify facts**, and chases "resembles," not "is right"
   - C. It understood, but couldn't be bothered to check
   - D. It checks first, then understands
   > **Answer: B.** The order is reversed: not "understand first, then express," but "guess and write as it goes." It has no "fact-checking" step, so it can speak smoothly yet crash on facts. This is exactly the root of why it "confidently makes things up" (chapter 9). C mistakenly assumes it has a willingness to check but is lazy (it has no such step at all); D is just wordplay.

4. **[Advanced · Misconception]** "When it confidently says something wrong (hallucination), the program must have a bug." What's wrong here?
   - A. Right, it's a bug
   - B. This is precisely the **normal product** of the "only chase resemblance, don't chase correctness" mechanism: even when unsure, it still smoothly produces something that most resembles an answer; it's not a malfunction
   - C. The network dropped
   - D. You asked something too hard and broke it
   > **Answer: B.** Hallucination isn't a bug; it's the **inevitable byproduct** of "chasing resemblance, not verifying facts" (chapter 9). People who treat it as a bug expect "once fixed, it won't happen again." But as long as it's still a "guess the next word" machine, the defense is **your verification** (chapter 15). C and D both miss the mechanism.

5. **[Basic · Scenario]** Of the following two tasks, which is more likely to trigger "making things up" and more in need of your verification?
   - A. Having it summarize an article you just pasted in into three points
   - B. Having it produce, out of thin air, the ISBN of an obscure book or the exact source of a certain paper
   - C. The two are equally safe
   - D. A is more dangerous
   > **Answer: B.** When summarizing material you gave, the answer is right there in the context, and what it "continues" is the content you provided, so it's relatively reliable; but when producing hard facts out of thin air (a number, a source), it **has no basis to continue from and can only make up something that resembles, by the pattern of "what this kind of answer looks like,"** which is most error-prone. Remember the dividing line: **has a basis to continue → steadier; produces hard facts from thin air → must check** (chapter 15).

6. **[Basic · Hands-on]** Find an AI with a "regenerate" button, and for **the same open-ended question** (like "give my cat three names") click "regenerate" a few times in a row; then try a question with **a single correct answer** (like "what's 3 plus 5") a few times too. Compare: for which kind of question do the repeated answers **vary a lot**, and for which are they **nearly unchanged**?
   > **What you should notice:** The open-ended question (naming) **varies noticeably** each time, because several candidate words all have decent probability, so the randomness in word-picking has room to play; while for "3+5," where the answer is highly certain, "8" has overwhelmingly high probability, so it's nearly the same each time. Feel this bit of randomness by hand, and you'll understand "it picks words from a probability list, with a bit of randomness in the picking," and why "rephrasing / regenerating" often helps you get a better version (how randomness is adjusted, see chapter 8).
