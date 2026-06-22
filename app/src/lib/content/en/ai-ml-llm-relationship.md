"Will AI replace humans?" "AI is already conscious, right?" "I heard AI even beat the world champion at Go, so doesn't that mean it can do everything?" The moment the word "AI" shows up, the conversation gets pulled into something huge and mystical.

But have you noticed that the "AI" people talk about is actually a bunch of completely different things? The thing that plays chess is AI. The thing that chats is AI. The thing in your phone's photo album that "automatically recognizes this is a cat" is also AI. And spam getting blocked is AI too. They look worlds apart, so what gives them the right to share one name?

This chapter skips the mysticism. We'll do just one thing: **give you a nested "matryoshka diagram"** that sorts out, all at once, the four words you hear most often and mix up most easily: artificial intelligence (AI), machine learning, deep learning, and large language models (LLMs). Once you understand this diagram, you can place any "AI" around you in its right spot, and you won't mistake "can play chess" for "can chat" again. This is the foundation for understanding every later chapter.

## 1. First, get one thing straight: they're "nested dolls," not "side by side"

Many people, hearing these words for the first time, assume they're **four things sitting side by side**, like four brands of phone for you to pick from.

**They're not.** They're a **layer-inside-a-layer, large-to-small** containment, like Russian nesting dolls, the big one holding the smaller one inside:

```text
┌───────────────────────────────────────────────────────────┐
│ Artificial Intelligence (biggest circle:                  │
│   machines doing things that "take intelligence")         │
│   ┌───────────────────────────────────────────────────┐   │
│   │ Machine Learning                                  │   │
│   │   (machines finding patterns in data themselves)  │   │
│   │   ┌───────────────────────────────────────────┐   │   │
│   │   │ Deep Learning (learning with "many layers")│   │   │
│   │   │   ┌───────────────────────────────────┐   │   │   │
│   │   │   │ LLM (focused on language)         │   │   │   │
│   │   │   └───────────────────────────────────┘   │   │   │
│   │   └───────────────────────────────────────────┘   │   │
│   └───────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

The right way to read this diagram: **the further in you go, the narrower and more specific it gets**. An LLM is a kind of deep learning, deep learning is a kind of machine learning, and machine learning is a kind of artificial intelligence. Put the other way: the large language model you chat with every day is just the smallest doll, all the way inside. It's **one very specific little corner** of the whole AI world, and definitely not "all of AI."

> **Key point:** One sentence is enough to remember: **LLM ⊂ deep learning ⊂ machine learning ⊂ artificial intelligence**. In the next three sections we go from outside in, explaining each circle one layer at a time: what it is, why we need it, and where people commonly misunderstand it.

## 2. Four circles, taken apart layer by layer

We'll use a comparison table to build the big picture first, then explain each one.

| Layer (large to small) | What it is, in a sentence | An everyday example | How it relates to the layer outside it |
| --- | --- | --- | --- |
| Artificial intelligence (AI) | Getting machines to do things that "used to take a human brain" | Playing chess, recognizing objects in images, route planning, spam filtering | The biggest umbrella term; everything below counts as AI |
| Machine learning | Instead of people writing rules by hand, let the machine **find patterns in data itself** | After looking at tens of thousands of cat and dog photos, it learns to tell them apart | One **way of doing** AI (not the only way) |
| Deep learning | A kind of machine learning, using a computing network with **many layers** | Today's image recognition, speech, and translation mostly rely on it | A **particularly strong** branch within machine learning |
| Large language model (LLM) | A kind of deep learning, a huge model that **learns language specifically** | The core behind Claude and ChatGPT | The branch of deep learning **focused on "word continuation"** |

### Layer 1, artificial intelligence (AI): a "goal," not a "technique"

**Artificial intelligence** is the biggest and oldest of these four words. It refers to a **goal**: getting machines to do things that "used to take human intelligence," like recognizing faces, understanding speech, playing chess, driving a car, and recommending things you might want to buy.

The key is that AI is an **umbrella term**, with many **completely different** techniques stuffed underneath it.

- A lot of early AI was programmers **writing rules by hand, one by one**: "if the board looks like this, make this move." This kind of AI had no ability to "learn on its own" at all; it all relied on people thinking ahead.
- Even today, the label "AI" still covers a wild range: some can play chess, some can recognize images, some can chat. Their **inner workings can be worlds apart**; they're just all grouped under the big goal of "making machines smart."

> **Why do we need this word?** Because it's a "banner" that makes it convenient to talk about "getting machines to do intellectual labor." But precisely because it's so broad, **"AI" specifies almost nothing precisely**. Hearing "this is an AI," you still don't actually know what it can do or how it does it. So the next three layers exist to pin down exactly "which kind of AI" we're talking about.

### Layer 2, machine learning: from "people write rules" to "machines find patterns"

This is the **most important turn** in the whole diagram, so make sure you understand it.

A traditional program works like this: a person writes the rules out **clearly, one by one**, and the machine follows them. But some things just can't be written out as rules. Can you describe in words what "a cat looks like" precisely enough that a computer recognizes every cat? Pointy ears? Whiskers? What about a fox, then?

**Machine learning** takes a different approach: **stop writing rules, feed it data instead**. Show the machine tens of thousands of photos labeled "cat" and "dog," and let it **figure out for itself** what actually separates cats from dogs. After it's done learning, give it a new photo it hasn't seen, and it can make a pretty good call.

```text
Traditional program: person works out rules → writes them into code → machine follows
Machine learning:    give a bunch of examples → machine finds patterns itself → learns a "knack for judging"
```

> **Common misconception:** "Machine learning, isn't that the machine 'figuring out' the reasoning on its own?" **No.** It hasn't "figured anything out." It has only **statistically extracted patterns** from massive amounts of data: which features often show up alongside "cat." It works, but it **doesn't understand** what a "cat" is. This carries all the way through to large language models: they're strong, but they don't "get it." That's the root cause of all of AI's flaws (like confidently making things up, see chapter 9).

### Layer 3, deep learning: learning with "many layers"

Machine learning has many specific methods, and **deep learning** is the **strongest** branch of the past decade or so. Today's image recognition, speech, translation, and chat mostly rely on it.

That "deep" in the name refers to its "computing network," the **neural network**, which is stacked with **many, many layers**. Data enters at the first layer and passes upward layer by layer, and each layer distills slightly more abstract information out of it. The more layers (the deeper) it has, the more complex and fine-grained the patterns it can learn.

- The name "neural network" borrows the metaphor of "brain neurons." But don't let it mislead you: inside, it's **all number crunching**, with **no relation at all** to real brain neurons. It just borrowed a vivid name. It doesn't think, has no emotions, and doesn't understand what it's computing.
- The reason deep learning suddenly got powerful in recent years is that three things came together at once: **more data** (the vast content on the internet), **stronger computing power** (specialized chips), and **mature methods**.

> **How you'll actually run into it:** You'll almost never see the word "deep learning" pop up on its own. It hides behind products. But when someone says some AI "is based on neural networks" or "was made with deep learning," be clear about this: that describes **which kind of technical approach** it uses, a branch within the big machine learning circle. It still hasn't said what the thing actually does.

### Layer 4, large language model (LLM): the deep-learning branch "focused on language"

Finally we reach the innermost little doll, and the star of this book.

A **large language model** (LLM for short) is a kind of deep learning, **built specifically to handle language (text)**. From massive amounts of text it learned "how words follow one another," so it can write articles, answer questions, translate, and write code. The cores of Claude, ChatGPT, and Gemini are all this kind of model.

Note where it sits:

- It's **just one branch of deep learning**. Within deep learning, some is used to recognize images (that's "computer vision"), some to synthesize speech, and **this LLM branch is focused on text**. Can chat ≠ can recognize images; they're **different branches** on the deep learning tree (although many products now bundle several abilities together, see chapter 18).
- Where the "large" is large, how it actually works inside, why it makes mistakes: those are what a whole part, **chapters 2 through 9**, will unfold. Here you only need to nail down its **place on the map**: **it's in the innermost circle, a very small and very specific subtype of AI.**

> **Key point:** Put the large language model back in its place, and you'll immediately become "desensitized" to a lot of exaggerated claims. "AI has woken up," "AI can do anything." These sound like they're about the boundless "AI" of the outermost circle, but what you're actually using is just the innermost circle, **a "language model focused on continuing text."** It's strong, but its abilities have edges and origins.

## 3. So which layer are Claude and ChatGPT, exactly?

This is the easiest place to get stuck, so let's make it clear on its own.

You might ask: by your account, Claude and ChatGPT are "large language models," right? **Strictly speaking, they're the "productized" form of large language models, a little further out than the pure model itself.**

An analogy: a large language model is like a **very skilled chef** (the "craft" of cooking), while the ChatGPT and Claude apps are a **restaurant**, which brings the chef in and adds a menu, tables, and waiters, so you can "walk in and order." The chat interface you open every day is the **product**; the core behind it that actually "holds the conversation" is the **large language model**.

| What you say | What it actually is | In the matryoshka diagram |
| --- | --- | --- |
| "I use ChatGPT" | A **product** (a chat interface for people) | The core is a large language model, wrapped in a "product" layer |
| "ChatGPT's core is GPT" | GPT is the **large language model** | The little doll in the innermost circle |
| "Claude" | Refers to both the model family and, often, its product | Depends on context: could mean the core, or the "restaurant" |

How exactly to tell apart model, product, API, and Agent: we'll save that for a whole chapter, **chapter 17**. Here you only need to remember: **the "AI chat product" you use every day is the innermost large language model with another layer ("packaging for people") wrapped around it.** It still sits firmly in one small corner of the big AI map.

## 4. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| AI = an all-powerful "computer brain" | AI is the umbrella term for a huge class of techniques, each handling its own thing, all **specialized**; no single AI "can do everything" |
| The AI that plays chess and the AI that chats are the same thing | Their inner workings can be **completely different**; they're just both called "AI." One is good at calculating chess, one at continuing text, and they don't transfer |
| LLM = all of AI | An LLM is just **one small subtype** in AI's innermost circle (the language-focused branch of deep learning) |
| Machine learning is the machine "figuring it out itself" | It only **statistically extracts patterns** from data; it works but **doesn't understand** the meaning |
| A neural network "thinks like a human brain" | "Neural" is just a borrowed metaphor; inside it's **all number crunching**, unrelated to real neurons |
| ChatGPT just is "that large language model" | ChatGPT is a **product**; the core is the large language model (GPT); there's a "packaging for people" layer in between (chapter 17) |

## Summary

- These four words are a **nesting relationship**, not side by side: **LLM ⊂ deep learning ⊂ machine learning ⊂ artificial intelligence**, getting broader from inside out.
- **Artificial intelligence (AI)** is the biggest umbrella term: a goal of "getting machines to do intellectual work," with all kinds of **completely different** techniques packed underneath.
- **Machine learning** is one way of doing AI: instead of writing rules by hand, **let the machine find patterns in data itself** (but they're only statistical patterns, not real "understanding").
- **Deep learning** is the strongest branch of machine learning, learning with a **many-layered neural network**; "neural" is just a metaphor, and inside it's number crunching.
- **Large language models (LLMs)** are the deep-learning branch **focused on language**. The AI chat product you use has one at its core, but it's only a **very small corner** of the AI world.
- The Claude and ChatGPT you use daily are the **productized** form of large language models, with another layer wrapped around the bare model (chapter 17 covers this in detail).

In the next chapter, we'll climb into that little innermost doll and look at **where a large language model is actually "large," what those "hundreds of millions of knobs" inside it mean**, and the one misunderstanding most worth clearing up: **it is not a database you can look things up in.**

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence most accurately describes how these four words relate?
   - A. AI, machine learning, deep learning, and large language models are four things side by side, pick-one-of-them
   - B. Large language models contain deep learning, deep learning contains machine learning, and machine learning contains AI
   - C. LLM ⊂ deep learning ⊂ machine learning ⊂ artificial intelligence, nested layer by layer, getting bigger from inside out
   - D. They're actually four names for the same thing
   > **Answer: C.** This is a set of "nested doll" containments: the large language model is innermost and most specific, artificial intelligence is outermost and broadest. A mistakes "nesting" for "side by side" (like lining up four different-sized dolls in a row); B gets the containment direction **backwards** (the big circle contains the small one, not the other way around); D ignores that they range from small to large.

2. **[Basic · Concept]** What's the most fundamental difference between "machine learning" and a traditional program?
   - A. Machine learning runs faster
   - B. A traditional program relies on people writing rules by hand; machine learning lets the machine find patterns in data itself
   - C. Machine learning doesn't need a computer
   - D. Machine learning is always more accurate than a traditional program
   > **Answer: B.** This is the most important turn in the whole diagram: from "people write rules" to "feed data, machine finds patterns itself." A, C, and D all miss the essence. Faster or more accurate depends on the case, and "doesn't need a computer" is just backwards. Remember: what it learns is **statistical patterns**, not real "figuring it out."

3. **[Advanced · Misconception]** "The AI that beat the world champion at Go must also be great at chatting and able to do anything." Where does this idea go wrong?
   - A. Nothing's wrong; a strong AI can naturally do anything
   - B. The Go AI and the chat AI are **completely different** branches under AI; what they're good at doesn't transfer, and being strong in one place doesn't mean strong elsewhere
   - C. The Go AI is actually dumber
   - D. They run on the same program
   > **Answer: B.** "AI" is a big umbrella term, with each branch handling its own thing: the Go one is good at calculating winning odds on the board, the chat one is good at continuing text, and **their inner workings and abilities don't transfer to each other**. Mistaking "super strong at one thing" for "strong at everything" is the classic trap of being led astray by claims like "AI can do anything" (see this chapter's correction of "AI = computer brain").

4. **[Basic · Misconception]** "The ChatGPT I use just is 'that large language model' itself." Where is this not quite accurate?
   - A. Completely accurate
   - B. ChatGPT is a **product** (a chat interface for people); its core is the large language model, with a "packaging for people" layer in between
   - C. ChatGPT doesn't use a large language model at all
   - D. Large language models came first, so it's irrelevant
   > **Answer: B.** What you open and chat with is the **product** (like the "restaurant"); the core that actually holds the conversation (like "the chef's craft") is the large language model. Saying them interchangeably is fine in daily life, but keep the two layers clear in your mind (chapter 17 covers the difference between model, product, API, and Agent). C erases the relationship; D doesn't answer the question.

5. **[Basic · Scenario]** A friend points at their phone's photo album and asks, "It can automatically find which photos have cats in them. Is this AI too? Is it the same as the AI I chat with?" How should you answer most accurately?
   - A. "It's not AI, just an ordinary feature."
   - B. "Both are AI, and they're the same thing."
   - C. "Both belong to the big AI circle; but the image one is the 'computer vision' branch and the chat one is the 'large language model' branch. They're different branches on the deep learning tree, and their abilities don't transfer."
   - D. "Only the chat one counts as AI; the image one doesn't."
   > **Answer: C.** Both are AI (both in that outermost big circle), but they belong to different branches: one focused on images, one on text, and what they're good at doesn't carry over. This is exactly how to use this chapter's "matryoshka diagram": **first group it into the big circle, then pin down precisely which branch it is.** A and D arbitrarily exclude one kind from AI, while B ignores that they're different branches.

6. **[Basic · Hands-on]** Look around at the "AI" you use in a day: your phone's face unlock, the album's object recognition, your keyboard's predictions, the map's route planning, spam-text blocking, the chat AI you use often. Pick three or four, and try to say roughly **which circle of the matryoshka diagram each one falls into**, and "does it belong to the 'can chat' branch?"
   > **What you should notice:** They **all** fall into the outermost "artificial intelligence" circle, but the vast majority are **not** the innermost "large language model." Face unlock and object recognition mostly belong to "computer vision"; route planning and spam blocking use other methods; only the chat AI is truly in that innermost "large language model" circle. Once you've placed the AI around you by hand, you'll never again mistake "can chat" for "can do everything," and you'll have built a correct sense of proportion for the whole AI world.
