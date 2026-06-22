In Chapter 4 we saw how the model strings words together by "guessing the next word." But there's a problem we can't get around: a computer only understands numbers. It has no idea what "cat," "dog," or "happy" even are. So how does it know that **"cat" and "dog" are close in meaning, while "cat" and "rebar" have nothing to do with each other**? And how does it work out "which words belong together"?

The answer hides in an idea that sounds very mathematical but is actually easy to grasp: **give every word and every sentence a set of "coordinates." Things close in meaning get coordinates that sit close together; things far apart in meaning get coordinates that sit far apart.** Those "coordinates" are the two stars of this chapter: the **vector** and the **embedding**.

This is the most "abstract" chapter in Part One, but it holds up a big chunk of what comes later: why "saying it a different way" changes the result (Chapter 11), and how search and RAG (Chapter 20) manage to find material "by meaning." We'll go step by step with good metaphors, and nobody gets left behind.

## 1. The core idea: turning "meaning" into "coordinates"

Start with an analogy you already know: **cities on a map can be pinned down with just two numbers, longitude and latitude.**

- Beijing is `(116, 40)`, Tianjin is `(117, 39)`. The two sets of numbers are very close, because the two cities are **geographically near each other**.
- Shanghai is `(121, 31)`, so its numbers sit **a bit further** from Beijing's.

With just these two numbers, the computer doesn't need to "know" anything about the cities. It only has to **work out the distance between two sets of numbers** to know who's near whom.

**What vectors and embeddings do is take this "use coordinates to express nearness" trick and move it over to word meaning.** The only difference is that this time the coordinates express not nearness in **geographic position** but nearness in **meaning**:

```text
Map:       use (longitude, latitude) for "geographic position"  →  distance = how geographically near
Meaning:   use (a long string of numbers) for "meaning"         →  distance = how near in meaning
```

- A **vector** is that "long string of numbers" itself, the "coordinates" assigned to a given word or sentence. (Map coordinates use only 2 numbers; coordinates for meaning take **hundreds or even thousands of numbers**, because "meaning" is far more complicated than "geographic position," and two or three numbers aren't nearly enough to tell things apart.)
- An **embedding** is the act of **turning a piece of text into these coordinates** (and the result you get out). The name "embedding" means you're embedding the word into a space described by coordinates, so every word has a place to stand.

> **Key point:** Remember it in one line: **an embedding gives a word or sentence a "coordinate of meaning" (a vector); the closer the meaning, the closer the coordinates.** A computer has no native sense of whether "cat" is closer to "dog" or to something else, but once you turn them both into coordinates, it can **compute how near two words are in meaning** the same way it computes "the distance between cities." That's the secret behind how a machine "senses" nearness in meaning. Not through understanding, but by computing the distance between coordinates.

## 2. Why bother doing this at all? Because a computer can only do arithmetic

Step back and ask: why go to all this trouble to turn a perfectly good word into a string of numbers?

Because that "guess the next word" machine from the earlier chapters runs on **nothing but number-crunching underneath** (Chapters 1 and 2). It can't add, subtract, multiply, or divide the word "cat" directly. But the moment you turn "cat" into a string of numbers (coordinates), everything becomes **computable**:

- Want to know whether two words are close in meaning? → **Compute the distance between their two coordinates** (near = close in meaning).
- Want to "rank a pile of material by relevance"? → Turn it all into coordinates and **line it up by how near each one is to the question's coordinates**.
- The model needs to judge "should this word follow that word"? → Again, it relies on the mathematical relationship between coordinates.

```text
No coordinates:  the computer faces "cat" and "dog" → two symbols it doesn't recognize, nothing to go on
With coordinates: "cat"→a string of numbers, "dog"→a string of numbers → compute the distance, find it's small → "ah, these two are close in meaning"
```

> **Why we need it:** Because this is the bridge that translates "semantics" (meaning), a fuzzy thing, into the only language a machine understands: **numbers**. Without this step, a computer can't even judge "which two words are similar in meaning," let alone pull off search, RAG, and the other "find things by meaning" tricks. The embedding is that bridge.

## 3. The most famous intuition: you can do "arithmetic" on meaning

This is the part of embeddings that makes people sit up, and it has become almost the signature example.

Since words have become coordinates (vectors), and coordinates can be added and subtracted, the amazing thing is that **doing arithmetic on coordinates of meaning gives results that also follow the logic of meaning**. The classic one:

```text
   "king"'s coordinates  −  "man"'s coordinates  +  "woman"'s coordinates  ≈  "queen"'s coordinates
```

Read out loud: **take king, subtract "male," add "female," and the coordinates you land on fall right next to "queen."**

Why does this happen? Because during training, the model noticed from a huge amount of text that "king" and "man," and "queen" and "woman," get used in very similar ways; and that the difference between "king" and "queen" is the same kind of difference as the one between "man" and "woman" (both come down to "gender"). So this "gender relationship" gets **encoded as a fixed "direction" in the coordinate space**. Walk along that direction and you "switch the gender."

There are plenty of others like it:

| Arithmetic on coordinates | Result lands roughly at | The relationship it captures |
| --- | --- | --- |
| Paris − France + Japan | ≈ Tokyo | the "capital of a country" relationship |
| walk → walked, run → ran | the same "direction" | the "turn into past tense" relationship |
| big → bigger, small → smaller | the same "direction" | the "more intense" relationship |

> **Key point:** Don't let "arithmetic" scare you. What it's really saying is plain: **the "meaning relationships" between words (gender, capital, tense, and so on) become computable "directions and distances" in coordinate space.** That shows an embedding packs in not isolated words but **the systematic web of meaning relationships between words**. (Here "≈" means "lands roughly nearby," not an exact equals sign. It's a statistical approximation, with some error.)

## 4. One reminder you can't skip: it stores the "coordinates of meaning," not the original text

This is the misunderstanding the chapter most wants to clear up, so lock it in.

A lot of people assume that turning a piece of text into an embedding is like "compressing and packing" the passage away, so when you need it you can **reconstruct the original text**. **No.**

An embedding stores that passage's **"coordinates of meaning," a string of numbers from which you can't make out the original sentence at all**. Hand someone an embedding (say, a few hundred decimals) and they **cannot** read back "what this passage originally said." It drops the specific words and keeps only "where the meaning lands in coordinate space."

```text
Original:           "I went for a walk in the park today and felt great."
Made into an embedding: [0.12, -0.83, 0.05, 0.41, ……]  ← a few hundred numbers
Can you reconstruct the original? No. It only keeps the "coordinates of meaning"; the original words are gone.
What can it do?     Compute how near it is in meaning to other sentences.
```

Here's an analogy: an embedding is like a **"flavor coordinate"** measured for each passage (so much sour, so much sweet, so much spicy). If two dishes have very close flavor coordinates, you know they "taste similar"; but **from the flavor coordinate alone you can't reconstruct the full recipe**. That's the relationship between an embedding and the original text: it **keeps "how alike," not "what the original was."**

> **Common misconception:** "Making an embedding = storing the original text inside, so I can later read the original sentence back out of the vector." Wrong. An embedding is a **one-way** "distillation of meaning," not a reversible "compressed archive." You can use it to **compare how close two passages are in meaning**, but you **can't read back** the original of either one. (This has a practical consequence too: when you make embeddings, **you usually have to store the original text separately**. The vector handles "find it by meaning," but the original is the content actually shown to you, which is exactly what RAG below needs.)

## 5. What it's good for: the foundation of search and RAG

After all this talk of coordinates, here's where it lands: the most important use of embeddings is **"search by meaning,"** which is also the core part of RAG (giving the AI an attached library) in Chapter 20.

Traditional "keyword search" has an old flaw: **it only matches the literal words.** Search for "how do I make my computer run faster," and a great article titled "Methods for improving computer performance" might get missed because **not a single keyword matches**, even though the meaning is identical.

Embeddings solve this nicely. The idea is "**give every piece of material coordinates first, then find things by how near the coordinates are**":

```text
Roughly how search-by-meaning (embedding) works:
  ① Ahead of time: turn every passage in the library into an embedding (each gets a "coordinate of meaning")
  ② You ask: "how do I make my computer run faster" → also turned into an embedding (one coordinate)
  ③ In the coordinate space, find the few passages whose coordinates are "nearest" to your question's coordinate
  ④ Even if the wording is completely different, as long as the "meaning is near," the coordinates are near, and it still gets found
```

So when you search "make my computer run faster," that "improving computer performance" article has **very near coordinates and gets pulled out reliably**, because what's being compared is **meaning**, not **literal words**.

This is the first step of **RAG (retrieval-augmented generation, Chapter 20)**: first use embeddings to find, **by meaning**, the few passages from your pile of material most relevant to the question, then drop them into the context (that "table" from Chapter 3) and hand them to the model so it can answer **based on this material**. That way you can use private material the model doesn't have on its own, and you cut down on it making things up out of thin air (the hallucination of Chapter 9).

> **How you'll actually run into this:** When you hear a product say "it can search by understanding your meaning" or "it can find the relevant passages in the hundreds of pages you uploaded," it's usually embeddings doing the work behind the scenes, turning both the documents and your question into coordinates and matching by nearness. How a given product actually does it, and how well it works, you should check the official docs; but the principle of "make coordinates first, then find by meaning" carries across.

## 6. Back to an old question: why does "saying it differently" change the result?

Now that you've learned embeddings, a common puzzle from Chapter 4 and from Chapter 11 later can finally be explained.

You've probably hit this: ask the AI the same thing but **swap a few words**, and the answer is **noticeably different**. Why so sensitive?

Because **the moment you swap words, the "coordinates" of the text you send in move.** The model is dealing with these coordinates the whole way through: change the coordinates, and the starting point for its "guess the next word" (Chapter 4) changes, so **what rolls out step by step naturally changes with it**. Even if you think "these two phrasings mean the same thing," in coordinate terms they **won't land on the exact same point**, so the results differ.

> **Key point:** "Wording sensitivity" isn't the AI being temperamental. It's the inevitable result of it **going by coordinates**: change the words, the coordinates shift, everything after follows. Flip that around and it gives you a handle: **saying things more clearly, closer to the "meaning" you want, pushes the coordinates toward a better spot**, and the answer often gets better. How to use this on purpose is exactly the skill Chapter 11 ("prompting") teaches. (This also echoes Chapter 4: rephrasing often gets you a better version.)

## 7. Common misconceptions, set straight

| Common misconception | Reality |
| --- | --- |
| The original text is stored inside an embedding, and you can reconstruct the sentence | It stores the **"coordinates of meaning" (a string of numbers you can't read the sentence from)**; you can compare nearness in meaning but **can't read back the original** |
| A vector just "compresses and packs" the text | It's a **one-way distillation of meaning**, not reversible compression; the original usually has to be **stored separately** |
| Two numbers (like longitude and latitude) are enough to represent meaning | Meaning is too complex; it takes **hundreds or thousands of numbers** to tell things apart, far more than two or three dimensions |
| "king − man + woman ≈ queen" is a coincidence | That's training encoding the **meaning relationships between words** as a "direction" in the coordinates; "≈" is an approximation, with error |
| Search by meaning = keyword matching | Keywords only match **the literal words**; embeddings compare **meaning**, so different wording still finds it (RAG, Chapter 20) |
| Saying it differently changes the result, so the AI is unstable / buggy | It's the inevitable result of it **going by coordinates**: words change → coordinates shift → everything after changes. Normal behavior (Chapter 11) |

## Summary

- **The core idea:** give a word or sentence a "**coordinate of meaning**." That string of numbers is the **vector**; the process or result of making it is the **embedding**; **the closer the meaning, the closer the coordinates**.
- **Why we need it:** a computer can only do arithmetic and doesn't recognize words. Once things become coordinates, the machine can **"sense" nearness in meaning by computing distance**. That's its bridge to handling meaning.
- **The signature intuition:** "king − man + woman ≈ queen." The **meaning relationships** between words become **computable directions** in coordinate space; "≈" is an approximation, with error.
- **The core correction:** an embedding **stores "coordinates of meaning," not the original text**. You can't read out the original sentence or reconstruct it, only compare "how near in meaning" (which is why the original often has to be stored separately).
- **The biggest use:** it's the foundation of **search by meaning** and **RAG (Chapter 20)**. Make coordinates for the material first, then find relevant content by "near coordinates," comparing meaning rather than literal words.
- **Back-reference:** why does "saying it differently" change the result? Because **change the words and the coordinates shift**, and everything generated after follows (Chapters 4 and 11). Saying your meaning clearly pushes the coordinates toward a better spot.

With this chapter closed, the core of Part One on "the model's inner workings" is complete: tokens and context (Chapter 3), how it guesses the next word (Chapter 4), and how it uses coordinates to represent meaning (Chapter 5). Next (Chapter 6) we look at one more key piece of machinery, the one that lets it **"pick out what matters,"** attention and the Transformer (pure intuition, zero formulas).

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most fitting way to understand making a word into an embedding?
   - A. Translating the word into English
   - B. Giving the word a "coordinate of meaning" (a string of numbers), so words close in meaning have close coordinates
   - C. Storing the word in a database to be retrieved later
   - D. Encrypting the word
   > **Answer: B.** An embedding turns text into a "coordinate of meaning (a vector)"; the closer the meaning, the closer the coordinates. A confuses it with "translation"; C falls back into the "database" misconception (already cleared up in Chapter 2), since it doesn't store entries; D has nothing to do with encryption. Remember the core: **nearness of coordinates = nearness of meaning**.

2. **[Basic · Concept]** Why turn a word into a string of numbers (a vector) instead of having the computer handle the text directly?
   - A. Numbers look more sophisticated
   - B. A computer can only do arithmetic and doesn't recognize words; once things are coordinates, the machine can judge nearness in meaning by "computing distance"
   - C. It saves disk space
   - D. Text slows the model down
   > **Answer: B.** This is the bridge that translates "meaning" into the only language a machine understands (numbers). With coordinates, "which two words are similar in meaning" becomes computable (following Chapters 1 and 2: it's all number-crunching underneath). A, C, and D all miss the point: it isn't about looking nice or saving space, it's about **making semantics computable**.

3. **[Advanced · Misconception]** "Making a passage into an embedding is the same as storing the original text inside the vector, so I can later read the original sentence back out." What's wrong with this?
   - A. Nothing, you can read out the original
   - B. An embedding stores the **"coordinates of meaning" (a string of numbers you can't read the sentence from)**; you can only compare nearness in meaning, and **can't read back or reconstruct the original**
   - C. You can read it out, but you have to pay
   - D. What's stored in the vector is the English translation
   > **Answer: B.** This is the chapter's core correction: an embedding is a **one-way distillation of meaning**, not reversible compression. It can compute "how alike," but it doesn't keep "what the original was" (which is why, when doing RAG, the original usually has to be stored separately). A and C assume it can be reconstructed (wrong); D is made up.

4. **[Advanced · Concept]** What does the famous example "king − man + woman ≈ queen" best illustrate about embeddings?
   - A. The model can do grade-school arithmetic
   - B. The "meaning relationships" between words (like gender) become computable "directions" in coordinate space; relationships can be added and subtracted on the coordinates
   - C. King and queen are synonyms
   - D. The embedding stored the original text of these four words
   > **Answer: B.** It shows an embedding packs in not isolated words but **a systematic web of meaning relationships**. "Switch the gender" gets encoded as a fixed direction in the coordinates, which is why this arithmetic works. A mistakes it for ordinary arithmetic (it's computing "coordinates of meaning," not a numbers problem); C and D both miss the point. Note that "≈" is an approximation, with error.

5. **[Basic · Scenario]** In a tool that supports "search by meaning," you search "how do I make my computer run faster," and it puts an article titled "Methods for improving computer performance" at the very top, even though the phrase "run faster" never appears in it. What's the most reasonable explanation?
   - A. The tool is buggy; no keywords matched
   - B. It uses embeddings to compare **meaning**, not **literal words**: the two texts' "coordinates of meaning" are very near, so it got pulled out despite the different wording
   - C. That article secretly stuffed in keywords
   - D. Pure coincidence
   > **Answer: B.** This is exactly what embeddings / semantic search (and RAG in Chapter 20) are good at: turn both the question and the material into coordinates and **match by nearness in meaning**, not literal word matching. Anyone treating this as a bug is still stuck in the old "search = keyword matching" mindset. C and D both miss the "compare meaning" principle.

6. **[Basic · Hands-on]** Take the same meaning and ask the same AI in **three different phrasings** (for example: "help me make this passage read smoothly" / "polish the text below" / "this reads a bit awkward, optimize it"), and compare the differences across the three answers. Then think: which concept from this chapter explains "why the result changes when you change the phrasing"?
   > **What you should notice:** The three answers will have visible differences (sometimes quite large). The reason is exactly this chapter's coordinate view: **the moment you swap words, the "coordinates" of the text you send in move**, and the starting point the model uses to "guess the next word" (Chapter 4) shifts with it, so the result naturally differs. Even when you think it's "the same meaning," the coordinates don't land on the exact same point. Verify it once yourself and you'll grasp both the embedding's "meaning is coordinates" and Chapter 11's "saying things clearly = pushing the coordinates toward a better spot," the prompting skill.
