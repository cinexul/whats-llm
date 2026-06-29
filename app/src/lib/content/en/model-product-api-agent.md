When you first meet AI, the thing that scares people off is usually not the technology. It's the **names**: Claude, ChatGPT, GPT, Gemini, Copilot, API, Agent... who is who, and which one contains which? How does one company have both a model and a product, with names that look almost the same?

This chapter hands you a **map**. You'll find that nearly every AI name out there fits into **four layers**. Once you see how the four layers relate, most of the fog around the names lifts. The later chapters on comparing products (chapter 18), Agents (chapter 19), and wiring AI into a program (chapter 35) all build on this map.

## 1. The map first: four layers

We'll use one metaphor for the whole chapter: **a very capable chef**.

| Layer | What it is | Chef metaphor | Examples (**actual capabilities per the provider's official docs**) |
| --- | --- | --- | --- |
| 1. Model | The core that truly "thinks" | The chef's own mind and skill | Claude, GPT, Gemini and other "model families" |
| 2. Product | The model packaged into something a person can use directly | A restaurant: menu, waiters, tables | Claude (app/web), ChatGPT, Gemini (app) |
| 3. API | The interface that opens the model's abilities to a **program** | The chef's "order window," where other shops can place orders | Each company's API / developer interface |
| 4. Agent | The model given "hands" and a goal, so it runs the whole task itself | A chef who shops, preps, plates, and cleans up on their own | Claude Code, Codex and other "agents" |

> **Key point:** These four layers are not four separate, mutually exclusive things. They wrap each other, from the inside out. The same model can go into a product for people, be opened through an API for programs, or be made into an Agent that does work on its own. Hold on to that one sentence; we'll take it apart layer by layer below.

## 2. Layer 1, the model: the "core" that thinks

The **model** is the thing Part One described: the large language model that learned "how to continue a sentence" from a huge pile of text (chapters 1 and 2). It's the core that actually "computes," but **it is not itself a piece of software you can just open and use**.

- You can't "download a GPT and start chatting," any more than you can hold a chef's skill in your hand by itself. The skill has to live in a person, in a kitchen, to turn into a dish.
- Each company usually has **one model family**, split into bigger and smaller tiers (stronger but slower and pricier / faster and cheaper), with names that often carry version numbers. **The specific versions and their abilities update often, so this book won't pin them down; refer to the provider's official documentation.**

> **Common misconception / Reality:** "Claude and ChatGPT are the same kind of thing, just pick one." Strictly speaking, **Claude is both a model family and, often, the name used for its product; ChatGPT is a product, and its core model is called GPT**. So "Claude vs ChatGPT" is really comparing "core + shell" against "shell," which is a bit of a mismatch. It's fine to talk this way day to day, but keep that relationship clear in your head.

## 3. Layer 2, the product: the layer wrapped for people

A chef (the model) alone still doesn't put food on your table. You need a **restaurant**: menu, waiters, tables, a register. The **product** is that wrapping. It puts a chat interface, login, history, file upload, and so on around the model, so a non-technical reader can **open it and use it right away**.

- ChatGPT, the Claude app and web version, the Gemini app: these are all products. Behind each one is its own model.
- The same core can be wrapped very differently: a web version, a phone app, a browser extension, something built into an office tool... **Being friendly to people** is the whole point of the product layer.

> **Why keep this layer straight?** Because the thing you use every day, the one you can open and chat with, is **almost always a "product."** When someone asks "which AI is good," they're really comparing product experience (chapter 18 covers how to choose), not bare models. Separating "product" from "model" is what keeps the names from tangling you up.

## 4. Layer 3, the API: the interface opened for programs

A restaurant serves the customers who walk in. But if **a bubble-tea shop next door** wants to add a "signature curry rice" to its own menu, it doesn't have to hire a chef. It can place an order through the chef's **order window**: send the order over, the chef makes it and hands it back, and the bubble-tea shop plates it and sells it to its own customers.

The **API** is that "order window," except the one placing the order is not a person but a **program**.

- Your own website, app, or script can use the API to send a question to the model and get an answer back, **building it into your own product**.
- Using an API usually needs a **key (API key)** to prove "it's really you placing the order," and it bills you **by token** on that basis (chapters 3 and 38).
- This key is sensitive. **If it leaks, someone else can place orders on your account and run up your bill.** So "never paste your key into a chat box, never commit it to a public repository" is an iron rule (chapter 37).

> **How you'll actually run into this:** When you or a coworker says "we want to plug AI into our own system," say, to have the company website's support answer automatically, what you're doing is **calling an API**, not signing up for a ChatGPT subscription. This is exactly what the chapter 35 project, "wiring AI into an existing program," has you build by hand.

## 5. Layer 4, the Agent: the layer that "does the work itself"

Up to here, all the chefs in the first three layers still only do "what you order." An **Agent** goes a step further: you give it only a **goal**, "make a four-dish, one-soup dinner tonight," and it goes off on its own to **plan the menu, check the pantry, shop for what's missing, cook each dish, plate them, and finally clean the kitchen**. When a problem comes up along the way (the greens aren't fresh), it figures something out on its own (swap in a different dish).

Move that onto AI, and an Agent is this: **give the model "tools" (it can read and write files, run commands, go online, call other programs), then point it at a goal and let it run the loop of "investigate, act, check, adjust" by itself**.

| | Chat product (layer 2) | Agent (layer 4) |
| --- | --- | --- |
| What it can do | Answer you in words | Actually **take action** (edit files, run commands, etc.) |
| Who executes | You, following what it says | It executes; you watch over it |
| How it moves forward | You ask, it answers, one at a time | It moves several steps toward the goal on its own |

The **Claude Code and Codex** you'll learn in Part Four are Agents built specifically for "programming." You say "add a search feature to this page," and it reads the code, edits files, and runs tests on its own (chapters 23 and 24).

> **Common misconception / Reality:** "Isn't an Agent just a smarter chatbot?" The key difference is **not 'smarter,' it's 'can take action.'** And precisely because it can really operate your things, the risk goes up too: it might do something you didn't expect, on its own. So an Agent always comes with a "permission/confirmation" mechanism and a "rollback-able" environment (chapters 26, 27, 40). Capability and risk are two sides of the same coin.

## 6. How the four layers stack

Put the four layers together into one full picture:

```text
        ┌─────────────────────────── Agent (runs the whole flow itself)
        │   ┌─────────────────────── Product (interface for people)
        │   │   ┌─────────────────── API (interface for programs)
        │   │   │   ┌─────────────── Model (the thinking core)
   you → goal   order   call          predict the next word
```

- At the very center is always the **model**.
- Moving outward, you either wrap it into a **product** for people, or open it as an **API** for programs.
- Further out, give it tools and a goal and it becomes an **Agent**, and inside, the Agent is often calling the model through an API.

So "model / product / API / Agent" is not a pick-one-of-four. It helps you see clearly: **which layer am I dealing with right now?**

## 7. A practical test: which layer am I facing?

Next time you run into an AI name or a request, three questions will locate it:

1. **Is a person using it directly in an interface, or is a program calling it behind the scenes?** Person uses it -> probably a "product"; program calls it -> "API."
2. **Does it only "talk," or does it "take action"?** Only answers -> product/model layer; can edit files, run commands, go online -> has an "Agent" nature.
3. **Is this name the company's core technology, or an application you can open?** Core -> "model"; open it and use it -> "product."

> **Key point:** When a coworker says "let's get AI," the first thing to ask is not "which subscription do we buy," but **"is a person going to use it in a chat box, do we want our system to call it automatically, or do we want to build an Agent that runs on its own?"** Those three things differ completely in cost, difficulty, and risk. Figure out the layer first, then talk options. That saves a lot of back-and-forth.

## 8. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| Claude and ChatGPT are the same kind of thing being compared | Claude usually means the model/product; ChatGPT is a product whose core is GPT. They're not on the same layer |
| A model can be "downloaded and chatted with directly" | A model is a core. It needs a product wrapper or an API to be used (local models are a different case; see chapter 21) |
| Plugging in AI = buying a subscription | Letting a **program** use AI means going through an API; a subscription is for **people** using a product |
| An Agent is just a souped-up chatbot | An Agent's essence is "can take action + runs the loop on its own," and the risk rises with it |
| Choosing AI means choosing the strongest model | What a non-technical reader chooses is whether the product experience suits them; strength is only one factor (chapter 18) |

## Summary

- Most AI names fit into **four layers**: **model** (the thinking core) -> **product** (interface for people) -> **API** (interface for programs) -> **Agent** (runs the whole flow itself).
- They **wrap each other**; it's not a pick-one-of-four. The same model can be wrapped into a product, opened as an API, or made into an Agent.
- The thing you open and chat with every day is almost always a **product**; plugging AI into your own system goes through an **API**; the thing that takes action for you is an **Agent**.
- The key questions for "which layer": **person or program? only talks or takes action?**
- An Agent's capability and risk are one and the same. It can act, so it must come with permission and rollback mechanisms (Parts Four and Six).

Next chapter, we'll use this map to look at where the mainstream AI products sit, and at "how an ordinary person should actually choose and mix them."

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** "Claude is a model, ChatGPT is a product." What does this come closest to meaning?
   - A. There's no difference between them
   - B. A model is the core (the thing that computes); a product is the interface layer that wraps the core and lets you use it
   - C. Claude is more expensive
   - D. ChatGPT doesn't use a model
   > **Answer: B.** ChatGPT is the product OpenAI wraps around the GPT model; Claude is both a model family name and, often, the name used for its product. Remember the "core vs shell" relationship and the names stop being confusing.

2. **[Basic · Concept]** Roughly, what is an API?
   - A. A web page
   - B. An interface that lets your own program "call" the model's abilities
   - C. A kind of paid subscription
   - D. The name of a chatbot
   > **Answer: B.** A web page or app is for people; an API is the same set of abilities opened for **programs**. The chapter 35 project, "wiring AI into a program," uses exactly this.

3. **[Basic · Misconception]** "An Agent is just a smarter chatbot." Where's the mistake?
   - A. No mistake
   - B. An Agent's key is not "smarter," it's that it can **really take action** (call tools, read and write files, run multiple steps), and the risk comes from that
   - C. An Agent doesn't need a model
   - D. An Agent can only chat
   > **Answer: B.** A chatbot only "talks"; an Agent "does." As the capability rises, so does the risk that "it did something I didn't expect" (echoing chapters 19 and 40).

4. **[Intermediate · Scenario]** A coworker says "let's plug in AI." To figure out which layer they actually want, what's the first question to ask?
   - A. "Which subscription do we buy?"
   - B. "Is a person going to use it in a chat box, or do we want our own system to call it automatically?"
   - C. "Do we need to switch computers?"
   - D. "Will AI replace us?"
   > **Answer: B.** "A person using a product," "a program calling an API," and "building an Agent that runs on its own" are three different things, with different costs and risks. Figure out the layer first, then talk options.

5. **[Basic · Scenario]** You just want AI to occasionally help you edit an article. Which is the most cost-effective and hassle-free?
   - A. Use an off-the-shelf chat product directly
   - B. Write your own program to call the API
   - C. Set up a model locally
   - D. Hire an engineer
   > **Answer: A.** For personal, low-frequency, conversational needs, off-the-shelf products are made for you. API, a local model, or an Agent are the steps you move on to only when a product can't meet the need. Don't reach for the heavy options up front.

6. **[Intermediate · Hands-on/Observation]** Pick an AI tool you use, and try to name which layer it sits in: roughly what **model** is behind it? Are you using a **product** interface or an **API**? Can it **take action** (go online, read files, call tools), giving it an **Agent** flavor?
   > **What you should notice:** Most people use a "product" day to day. Once it can go online, read files you upload, and call tools, it starts taking on an Agent nature. Being able to slot your tool into place means this map has settled into your head.
