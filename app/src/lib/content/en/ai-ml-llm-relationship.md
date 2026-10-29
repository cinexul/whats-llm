"Will AI replace humans?" "AI is already conscious, right?" "AI even beat the world champion at Go, so can't it do everything?" The moment AI comes up, the conversation tends to get huge and hazy.

Yet the "AI" people talk about is really a collection of very different things. The thing that plays chess is AI. The thing that chats is AI. Your photo album recognizing "this is a cat" is AI, and so is the filter that blocks spam. They're worlds apart, so why do they share one name?

This chapter does just one thing: it uses a "nesting doll" diagram to sort out four words you hear all the time and mix up easily: artificial intelligence (AI), machine learning, deep learning, and large language models (LLMs). Once you understand the diagram, you can place any "AI" around you in its right spot, and you won't mistake "can play chess" for "can chat" again.

## 1. First, get one thing straight: they're "nested dolls," not "side by side"

Many people assume these are four things sitting side by side, like four brands of phone to pick from. They're actually a layer-inside-a-layer containment, like Russian nesting dolls, with the big one holding the smaller ones inside:

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

The further in you go, the narrower and more specific it gets. An LLM is a kind of deep learning, deep learning is a kind of machine learning, and machine learning is a kind of artificial intelligence. The large language model you chat with every day is the smallest doll, all the way inside: one very specific corner of the AI world, not all of AI.

> **Key point:** The whole diagram fits in one line: LLM ⊂ deep learning ⊂ machine learning ⊂ artificial intelligence.

## 2. Four circles, taken apart layer by layer

A table first, for the big picture; then each layer in turn.

| Layer (large to small) | What it is, in a sentence | An everyday example | How it relates to the layer outside it |
| --- | --- | --- | --- |
| Artificial intelligence (AI) | Getting machines to do things that used to take a human brain | Playing chess, recognizing objects in images, route planning, spam filtering | The biggest umbrella term; everything below counts as AI |
| Machine learning | Instead of people writing rules by hand, the machine finds patterns in data itself | After seeing tens of thousands of cat and dog photos, it learns to tell them apart | One way of doing AI (not the only way) |
| Deep learning | A kind of machine learning that uses a computing network with many layers | Today's image recognition, speech, and translation mostly rely on it | The most widely used branch of machine learning |
| Large language model (LLM) | A kind of deep learning: a huge model that learns language specifically | The core behind Claude and ChatGPT | The branch of deep learning focused on "word continuation" |

### Layer 1, artificial intelligence (AI): a "goal," not a "technique"

Artificial intelligence is the biggest and oldest of the four words. It names a goal: getting machines to do things that used to take human intelligence, like recognizing faces, understanding speech, playing chess, driving a car, or recommending things you might want to buy.

AI is an umbrella term with many completely different techniques underneath. A lot of early AI was programmers writing rules by hand, one by one: "if the board looks like this, make this move." It couldn't learn anything on its own. Even today the label covers a wild range, from chess players to image recognizers to chatbots, and their inner workings can be worlds apart.

Because the word is so broad, hearing "this is an AI" still tells you little about what it can do or how. The next three layers pin down which kind of AI we mean.

### Layer 2, machine learning: from "people write rules" to "machines find patterns"

This is the most important turn in the whole diagram.

A traditional program works like this: a person writes the rules out one by one, and the machine follows them. But some things can't be written out as rules. Could you describe what a cat looks like precisely enough for a computer to recognize every cat? Pointy ears? Whiskers? What about a fox, then?

**Machine learning** takes a different approach: instead of writing rules, feed it data. Show the machine tens of thousands of photos labeled "cat" and "dog," and let it work out for itself what separates them. Afterward, give it a photo it hasn't seen, and it can usually make the right call.

```text
Traditional program: person works out rules → writes them into code → machine follows
Machine learning:    give a bunch of examples → machine finds patterns itself → learns a "knack for judging"
```

Keep in mind that what the machine learns is patterns in the data. It can use them to make useful predictions, but getting answers right doesn't mean it understands things the way a person does, and the patterns it learned may not hold up in situations it hasn't seen. Chapter 9 looks at why AI gets things wrong.

### Layer 3, deep learning: learning with "many layers"

Machine learning has many specific methods, and **deep learning** has been the most widely used one for the past decade or so. Today's image recognition, speech, translation, and chat mostly rely on it.

"Deep" refers to the many stacked layers of its computing network, called a **neural network**. Data enters at the first layer and passes upward layer by layer, and each layer distills slightly more abstract information. More layers let it learn more complex patterns, but just adding layers doesn't automatically make it better; the data, how the network is designed, and how it's trained matter just as much.

Neural networks borrow a rough idea from biological neurons, but their "neurons" only do arithmetic; they aren't a copy of a human brain. The name alone tells you nothing about whether a system has human-like thoughts or feelings.

Deep learning took off in recent years because three things came together at once: more data (the vast content of the internet), more computing power (specialized chips), and mature methods.

You'll rarely see "deep learning" mentioned on its own; it hides behind products. When someone says an AI "is based on neural networks" or "uses deep learning," they're describing the technical approach, not what the thing actually does.

### Layer 4, large language model (LLM): the deep-learning branch "focused on language"

Finally we reach the innermost doll, and the star of this book.

A **large language model** (LLM for short) is the kind of deep learning built specifically to handle language (text). From massive amounts of text it learned how words follow one another, so it can write articles, answer questions, translate, and write code. The cores of Claude, ChatGPT, and Gemini are all this kind of model.

A note on wording: in everyday talk, "large model" (in Chinese, 大模型) can also mean a large vision model that works with images, or a multimodal model that handles text, images, and sound together. In this book, unless we say otherwise, it means a large language model.

Two things to note about where it sits on the map:

- It's the branch of deep learning that's mainly about language. Images and speech have their own methods, but the lines are blurry: many models today are multimodal and can handle text, images, and sound. Being good at chatting doesn't tell you what else a model can do; check what the specific model and product support (chapter 18).
- Where it's "large," how it works inside, and why it makes mistakes are what chapters 2 through 9 lay out. For now, just fix its place: the innermost circle, a very specific subtype of AI.

With the LLM back in its place, a lot of hype loses its grip. "AI has woken up" and "AI can do anything" sound like claims about the boundless outer circle, but what you're actually using is the innermost one: a language model that works with text. It's powerful, but its abilities have limits and a traceable origin.

## 3. So which layer are Claude and ChatGPT, exactly?

You might ask: aren't Claude and ChatGPT large language models? Strictly speaking, they're products built on large language models, a little further out than the model itself.

An analogy: a large language model is like a very skilled chef, while the ChatGPT and Claude apps are a restaurant that brings the chef in and adds a menu, tables, and waiters, so you can walk in and order. The chat interface you open is the product; the core behind it that actually continues the conversation is the large language model.

| What you say | What it actually is | In the nesting-doll diagram |
| --- | --- | --- |
| "I use ChatGPT" | A product (a chat interface for people) | The core is an LLM, wrapped in a product layer |
| "ChatGPT's core is GPT" | GPT is the large language model | The little doll in the innermost circle |
| "Claude" | Both the model family and, often, its product | Depends on context: the chef or the restaurant |

Chapter 17 spends a whole chapter on telling model, product, API, and Agent apart. For now it's enough to know that the AI chat product you use every day is a large language model with another layer, packaging for people, wrapped around it.

## 4. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| AI = an all-powerful "computer brain" | AI is an umbrella term for many techniques, each with its own specialty; no AI can do everything |
| The AI that plays chess and the AI that chats are the same thing | Their inner workings can be completely different. AlphaGo, which beat Lee Sedol 4–1 in 2016, was trained only to play Go and can't hold a conversation |
| LLM = all of AI | An LLM is just one subtype in AI's innermost circle |
| Machine learning is the machine "figuring it out itself" | It learns patterns from data; useful predictions don't prove human-like understanding |
| A neural network "thinks like a human brain" | It's only loosely inspired by neurons; what it does is arithmetic |
| ChatGPT just is "that large language model" | ChatGPT is a product; the core is the large language model (chapter 17) |

## Summary

- The four words nest; they don't sit side by side: LLM ⊂ deep learning ⊂ machine learning ⊂ artificial intelligence.
- Artificial intelligence is the biggest umbrella term, the goal of getting machines to do intellectual work, with very different techniques underneath.
- Machine learning doesn't hard-code rules; the machine finds patterns in data. Learning patterns is not the same as understanding like a person.
- Deep learning learns with many-layered neural networks and is the most widely used machine-learning method today.
- Large language models are the deep-learning branch centered on language. The Claude and ChatGPT you use are products that wrap another layer around such a model (chapter 17).

In the next chapter, we'll climb into that innermost doll and look at where a large language model is "large," what the countless "knobs" inside it are, and the misunderstanding most worth clearing up: it is not a database you can look things up in.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence most accurately describes how these four words relate? <!-- quiz: q01 revision: 2 -->
   - A. They are four separate, unrelated technologies; you pick one when you need it
   - B. LLMs contain deep learning, deep learning contains machine learning, which contains AI
   - C. LLMs are part of deep learning, which is part of machine learning, which is part of AI
   - D. AI and machine learning are the same thing; deep learning and LLMs are two types under it
   > **Answer: C.** This is a set of "nested doll" containments: the large language model is innermost and most specific, AI is outermost and broadest. B lists the words in the right order but gets the direction backwards: the big circle contains the small one. A mistakes nesting for side by side. D equates AI with machine learning, but AI also includes the older approach of hand-written rules; it also puts deep learning and LLMs on the same level, when LLMs are one branch of deep learning.

2. **[Basic · Concept]** What's the most fundamental difference between "machine learning" and a traditional program? <!-- quiz: q02 revision: 3 -->
   - A. Traditional programs follow rules people write; machine learning finds patterns in data
   - B. Machine learning needs no people at all; once built, it keeps getting smarter on its own
   - C. Machine learning stores lots of data first, then searches it for a match when it is used
   - D. Traditional programs just follow orders; machine learning truly understands like a person
   > **Answer: A.** This is the most important turn in the whole diagram: from "people write rules" to "give it data and let the machine work out the patterns." B is wrong: people prepare the data and design the training, and a typical model's parameters are fixed after training, so it doesn't get smarter just by being used (chapter 2). C confuses learning patterns with storing and looking up data (chapter 2 corrects this in detail). D goes too far: learning useful patterns does not prove human-like understanding.

3. **[Advanced · Misconception]** "The AI that beat the world champion at Go must also be great at chatting and able to do anything." Where does this idea go wrong? <!-- quiz: q03 revision: 2 -->
   - A. The Go system just isn't big enough yet; a bigger model would be able to do anything
   - B. Winning at Go shows it already has general intelligence; nobody taught it to talk yet
   - C. A Go AI isn't really AI; it's only a program running on rules that people wrote by hand
   - D. The two can be trained in different ways; being strong at Go doesn't mean it can chat
   > **Answer: D.** "AI" is a broad category. A system trained to win at Go and a model trained to generate language can differ completely in design and ability; they may share some methods, but success at one task does not prove success at another. A ("big enough means it can do anything") and B ("good at Go means general intelligence") are both common overreaches. C is also wrong: top Go programs were trained with machine learning, not built from hand-written rules.

4. **[Basic · Misconception]** "The ChatGPT I use just is 'that large language model' itself." Where is this not quite accurate? <!-- quiz: q04 revision: 2 -->
   - A. It's accurate; ChatGPT and GPT are just two names for exactly the same thing
   - B. ChatGPT is a product with an LLM at its core, wrapped in a layer of product features
   - C. ChatGPT doesn't use an LLM; it runs on a large set of question-answer rules people wrote
   - D. The LLM is only a plug-in inside ChatGPT that gets called when a question is hard
   > **Answer: B.** What you open and chat with is the product (like the "restaurant"); the core that actually continues the conversation (like "the chef's craft") is the large language model. Mixing the two up in daily talk is fine, but keep the layers clear in your mind (chapter 17 covers model, product, API, and Agent). A is the very misconception in the question. C has it backwards: the core is an LLM. D flips the roles: the LLM is the core, not an occasional plug-in.

5. **[Basic · Scenario]** A friend points at their phone's photo album and asks, "It can automatically find which photos have cats in them. Is this AI too? Is it the same as the AI I chat with?" How should you answer most accurately? <!-- quiz: q05 revision: 2 -->
   - A. Both are AI, and the phone's cat finder and the chatbot must use the very same model
   - B. Finding cats isn't AI; it's an ordinary feature that just matches colors and shapes
   - C. Both are AI, but finding cats is mostly computer vision, while chatting uses an LLM
   - D. Only things that can chat count as AI; recognizing pictures is just image processing
   > **Answer: C.** Both belong to AI; the tasks differ. Finding cats in photos is a computer-vision task, while chatting uses a language model. Some multimodal models combine images and language, so what a particular product uses depends on what it actually supports. A jumps from "both are AI" to "must be the same model"; B and D arbitrarily exclude one kind from AI.

6. **[Basic · Hands-on]** Look around at the "AI" you use in a day: your phone's face unlock, the album's object recognition, your keyboard's predictions, the map's route planning, spam-text blocking, the chat AI you use often. Pick three or four, and try to say roughly **which circle of the matryoshka diagram each one falls into**, and "does it belong to the 'can chat' branch?" <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Many of these features use AI, but they do not all use LLMs. Face unlock and object recognition commonly use computer vision; route planning can use conventional search algorithms; spam filters and keyboard suggestions can use several methods, including language models. A product name alone does not reveal its implementation. The useful habit is to ask what the system does and which techniques it uses, rather than assume "AI" means "can do everything."
