Up to now, the way you've used AI has been "open an interface and chat in it yourself." This chapter does something different: have **your own program** use AI. Not you sitting in front of a chat box typing, but your website, app, or script **automatically** sending the question to the model behind the scenes, getting the answer back, and embedding it into your own application.

This is the third layer in that "four-layer map" from Chapter 17, the **API**. Remember the analogy? The restaurant serves the customers who walk in, and other shops that want to use this chef's skill go through the "order window" to place an order. The API is that window, except the one placing the order isn't a person, it's a program.

Let's be clear about this chapter's scope first: **this chapter covers only the approach and the data flow, and pins down no code in any one language.** Because each provider's specific API syntax, parameters, and SDK usage differ and update often, all of that is **subject to the official docs.** What you should walk away with is the framework for "what connecting to an API is really about," which lets you talk on the same level as engineers and judge for yourself.

## 1. Getting ready

Even if you won't write the code yourself, you need a feel for the following, especially the key and the cost, which you **manage from the very first line.**

- **First confirm you really need the API, not just a membership.** This is the most common misconception, so let's pull it out on its own: if it's just you, occasionally having AI help you edit an article, a ready-made chat **product** is enough (Chapters 17 and 18). Only when you want **your own system to call AI automatically**, like having your company website's support reply on its own, or having your program batch-process data, do you need to go through the API. **Connecting to an API is not the same as buying a membership; these are two different things.**
- **Get an "API key."** Using an API usually means first applying for a key on the relevant platform, used to prove "it's you placing the order," and billing **by token** accordingly (Chapters 3 and 38). How exactly to apply is **subject to the official docs.**
- **Take the key and the cost seriously from day one.** This key is extremely sensitive; **leaking it means someone else can order on your account and run up your bill.** So Step 0 in Section 2 below is specifically about managing it. Don't patch it after something goes wrong.
- **Get clear on what the "data flow" looks like.** Connecting to an API is essentially designing a pipeline of "question goes out, answer comes back, then gets used." Draw that line clearly in your head first; writing the code is just making it real.

> **Key point:** Connecting to an API isn't as technically hard as you'd think (the smallest runnable version is short). The real bar is in two judgments: **one, telling apart "should I use the API or buy a membership"; two, managing the key and the cost from the start.** Once these two are clear, the rest is following the official docs.

## 2. Doing it step by step

Below we break "connecting to an API" into a few steps, all covering only the approach and the data flow. The specific language, how to write it, which interface to call, **subject to the official docs.**

### Step 0: Settle the key first (before writing any feature)

This step comes before all features, because it's the easiest to overlook and the easiest to cause big trouble. Three iron rules (echoing Chapter 37 on privacy and Chapter 38 on cost):

| What to do | Why |
| --- | --- |
| **Put the key in an "environment variable," don't write it into the code** | Hard-coded into the code, the key travels everywhere the code goes and can leak at any moment |
| **Never commit the key to a public repository (like a public GitHub)** | A key in a public repo gets picked up and abused by automated scanners within seconds |
| **Set a "usage cap / budget alert" for the account in the platform's dashboard** | If the key leaks, or the program writes a runaway loop hammering away, the cap helps contain your losses |

An "environment variable," put plainly, means putting sensitive information like the key **outside the program** and reading it in at runtime, instead of writing it out in plain sight in a code file. How exactly to set an environment variable or a usage cap is **subject to the official docs**, but the three principles of "put it outside, don't commit it, set a cap" are universal and won't go out of date.

> Treat this step as "the seatbelt for connecting to an API": before the car even moves, the belt is on.

### Step 1: Have the program "ask one thing" for you

The smallest runnable core is just one thing: **your program sends a question to the model through the API.** Describe that request in plain language:

```text
(Your program, doing this automatically behind the scenes)
Say to the model: "Here's a user message. Help me judge whether it's positive or negative,
                   answer only 'positive' or 'negative.' The message: ..."
```

This is essentially the same as typing in a chat box; both are "sending a passage to the model." The only difference is: **now the program sends it for you, and it can send ten thousand times a day without you typing by hand.** What you send (the prompt, that is) still follows everything from Chapter 11: state the requirement clearly, nail down the format.

### Step 2: Take the model's answer back

Once the model finishes, it **passes the answer back to your program.** What your program gets is usually a passage of text (or somewhat structured data; the exact format is **subject to the official docs**).

Here's a mental pitfall beginners often step in: **what the model returns can still be wrong and can still not follow the format you asked for** (hallucination happens just the same, Chapter 9). You tell it to "answer only positive or negative," and once in a while it might reply with a whole sentence of explanation. So the program has to **check and have a fallback for the returned result**; this part is engineering detail, but you need the idea: **don't assume the model behaves every time.**

### Step 3: "Use" the answer, embed it into your application

Once you have the answer, what comes next has nothing to do with AI anymore; it's **your own application's logic**: store "positive/negative" in a database, show it on a page, trigger a notification email, and so on. This part is entirely up to your program.

Linked up, the whole data flow is this one line:

```text
 User / your data
      │
      ▼
 Your program  ──(through the API, carrying the key)──→  model
      ▲                                                   │
      │                                                   ▼
      └────────  model passes the answer back  ──────────┘
      │
      ▼
 Your program uses the answer (store / display / trigger the next step)
```

Once you see this line, you've grasped the whole essence of "connecting AI to a program": **your program sends the question out, takes the answer back, and embeds it into its own process.** That "model" in the middle is rented capability, and what you pay is the token bill.

### Checking the result

Once the smallest version is running, check by these:

1. **Can it stably "send out and take back"?** Run a few pieces of real data through and confirm the pipeline is working.
2. **Is the key safe?** Go back and check: is the key in an environment variable, not written into the code, not committed to a public repo, with a usage cap set. **Confirm this one over and over.**
3. **Does the returned result have a fallback?** Deliberately feed in a tricky input and see whether your program crashes or handles it when the model doesn't reply in the format.
4. **How much did it cost?** Glance at this test's usage and spend in the platform's dashboard, and build an intuition for "roughly how much one call costs" (Chapter 38).

## 3. Common pitfalls

| Pitfall | What's going on / how to dodge it |
| --- | --- |
| **Thinking "connecting to an API equals buying a membership"** | This is the biggest misconception. A membership is for **people** to use a product; connecting to an API is for **programs** to use an interface, applying for a key and billing by token (Chapter 17). First tell apart which one you want |
| **Hard-coding the key into the code / committing it to a public repo** | Like taping your house key to the door. Put the key in an environment variable, don't commit it, set a cap; **do it before the first line of code** (Chapters 37 and 38) |
| **No usage cap set, burned by hammering or a runaway loop** | A single bug in a program might call hundreds of times a second. Set a budget alert and usage cap in the dashboard to backstop your bill (Chapter 38) |
| **Assuming the model always replies in format obediently** | It makes mistakes and goes off track (Chapter 9). The program has to check and have a fallback for the returned result; don't run it bare |
| **Sending users' private data to the API as is** | Remember that line from Chapter 37: **sending it in is the same as handing it over.** Sensitive information has to be de-identified first; whether it's used for training depends on the terms and settings (Chapter 37, subject to the official docs) |
| **Copying some old code snippet from the internet wholesale** | Each provider's API syntax differs and updates often. **Subject to the official docs**; don't put faith in outdated code snippets |

## 4. Taking it one step further

Once the smallest pipeline runs through, you can expand like this (don't drop the key-and-cost thread at any step):

- **Polish the "prompt"**: the passage you send the model directly decides the answer's quality. Put the prompt techniques from Chapters 11 and 12 to use, and solidify them into a template when needed.
- **Take in more structured output**: have the model return a tidier structure (so the program can use it directly); how exactly to ask is **subject to the official docs.**
- **Use tokens sparingly**: in batch calls, tokens are money. Don't cram irrelevant long text into every request; keep requests lean (that "use sparingly" set from Chapter 38 turns directly into saving money here).
- **If you start having the program "do multiple steps on its own, call tools"**: then you're actually moving from "calling an API once" toward building an **agent** (Chapters 19 and 34), and at that point Chapter 34's "install the brakes" discipline has to keep up: spending money, deleting data, sending outward still need to be set as requiring human confirmation.
- **If you want to connect it to internal company material / external tools**: that's the Skills / MCP topic of Chapters 22 and 36; remember that every new source you connect is a new entry point for risk.

> **Key point:** "Connecting AI to a program" is using the **API** (Chapter 17): your program sends the question to the model, takes the answer back, and embeds it into its own application. **The approach is simple and the data flow is clear.** But two things must be watched from the first line of code: **(1) connecting to an API is not the same as buying a membership** (tell apart a person using a product from a program calling an interface); **(2) manage the key and the cost from the start**, put it in an environment variable, don't write it into the code, don't commit it to a public repo, set a usage cap (Chapters 37 and 38). The specific syntax is **subject to the official docs.**

## Summary

- "Connecting AI to an existing program" equals using the **API** (the third layer of Chapter 17): have your own program automatically send the question to the model behind the scenes, take the answer back, and embed it into the application.
- The smallest runnable data flow is one line: **your program, carrying the key, to the model, the answer passed back, the program uses it.** This chapter covers only this approach, pinning down no language's SDK code (**subject to the official docs**).
- **The biggest misconception is "connecting to an API equals buying a membership"**: a membership is for people to use a product, connecting to an API is for programs to use an interface, billed by token.
- **Manage the key and the cost from the first line**: put it in an environment variable, don't write it into the code, don't commit it to a public repo, set a usage cap (echoing Chapters 37 and 38). This is Step 0, ahead of all features.
- What the model returns can still be wrong and can still not follow the format (Chapter 9), so the program has to check and have a fallback; data you send in is the same as handing it over, so de-identify sensitive information first (Chapter 37).

In the next chapter, we'll truly land those two concepts from Chapter 22, **Skills and MCP**, giving AI new abilities to read data and use tools.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** "Connecting AI to an existing program" essentially uses which layer of the four-layer map (Chapter 17)?
   - A. The product layer (the interface for people)
   - B. The **API layer** (the interface for programs)
   - C. The model layer (the bare core)
   - D. The agent layer
   > **Answer: B.** Having a **program** call the model automatically behind the scenes goes through the API (that "order window," the third layer of Chapter 17). The product layer is for **people** to click open and chat; the API layer is the same capability's entry point, for programs to call.

2. **[Basic · Misconception]** "We want to bring AI into our own system, so let's go buy a ChatGPT membership." What's wrong?
   - A. Nothing, a membership does it
   - B. Having a **program** use AI goes through the **API** (apply for a key, bill by token); a membership is for **people** to use a product, two different things
   - C. The mistake is you should buy a more expensive membership
   - D. The mistake is a system can't bring in AI
   > **Answer: B.** This is the chapter's number one misconception. "A person using it in an interface" and "a program calling it automatically behind the scenes" are two completely different paths: the former uses a product (a membership), the latter uses an API (Chapter 17). First tell apart which one you want, then talk about how.

3. **[Basic · Concept]** What is the "API key" for when using an API?
   - A. To speed up the model's computation
   - B. To prove "it's you calling," and bill the usage to your account accordingly (by token)
   - C. To make the model not make mistakes
   - D. A membership card for some chat product
   > **Answer: B.** The key is your "order credential plus billing basis." Precisely because one end of it is tied to your bill, **leaking it means someone can run up your account**, which is why you put it in an environment variable, don't commit it to a public repo, and set a usage cap (Chapters 37 and 38).

4. **[Advanced · Misconception]** To save effort while coding, you write the key directly into a code file and push it to a public GitHub repo. What's most likely to happen?
   - A. Nothing, no one looks
   - B. The key in the public repo gets picked up and abused by automated scanners fast, and you may get run up a big bill out of nowhere
   - C. The code runs faster
   - D. GitHub automatically encrypts it for you
   > **Answer: B.** Public repos are watched by dedicated scanners, and a plaintext key is often picked up within seconds. The right way is to **put the key in an environment variable, never commit it, and set a usage cap to backstop you** (Chapters 37 and 38), and to do this before the first line of feature code.

5. **[Basic · Scenario]** Your program uses the API to have the model "answer only 'positive' or 'negative,'" but once in a while it replies with a whole sentence of explanation. What should you do?
   - A. Retry over and over until it obeys
   - B. Check and have a fallback for the returned result in the program; don't assume the model always replies in format obediently
   - C. Swap in a new key
   - D. Conclude the API is broken
   > **Answer: B.** What the model returns can still be wrong, can not follow the format (hallucination happens just the same, Chapter 9). A robust program assumes "it may not obey," checking and having a fallback for the return value, instead of running bare and assuming it's always right.

6. **[Basic · Hands-on / Observation]** You don't have to actually write code. Draw the "connecting to an API" data flow on paper: from "your program sends the question out (carrying the key)," to "the model passes the answer back," to "your program uses the answer." Then mark three points on the diagram about money/safety: where the key goes, where billing happens, where the cap is set. (The specific syntax is **subject to the official docs.**)
   > **What you should notice:** This line is actually short: send it out, take it back, use it, just three steps, and that's the whole approach of "connecting AI." But the three points you marked (key in an environment variable, billing by token, usage cap in the dashboard) are the spots that really cause trouble and must be managed from day one (Chapters 37 and 38). Draw the data flow and these three points clearly, and you can both talk on the same level as engineers and hold the line.
