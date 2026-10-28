Up to now, the way you've used AI has been "open an interface and chat in it yourself." This chapter does something different: have **your own program** use AI. Not you sitting in front of a chat box typing, but your website, app, or script **automatically** sending the question to the model behind the scenes, getting the answer back, and embedding it into your own application.

This is the third layer in that "four-layer map" from Chapter 17, the **API**. Remember the analogy? The restaurant serves the customers who walk in, and other shops that want to use this chef's skill go through the "order window" to place an order. The API is that window, except the one placing the order isn't a person — it's a program.

Let's be clear about this chapter's scope first: **this chapter focuses on the approach and the data flow, and doesn't walk you through code in any one language.** Each provider's API syntax, parameters, and SDK (the ready-made code library a provider offers) usage differ and update often, so for all of that, **refer to the provider's official documentation.** For the smallest runnable version, we'll have a coding agent write it by following the provider's official quickstart, while you take care of the key, running it, and checking the result. What you should walk away with is the framework for "what connecting to an API is really about," which lets you talk on the same level as engineers and judge for yourself.

## 1. Getting ready

Even if you won't write the code yourself, you need a feel for the following, especially the key and the cost, which you **manage from the very first line.**

- **First confirm you really need the API, not just a membership.** This is the most common misconception, so let's pull it out on its own: if it's just you, occasionally having AI help you edit an article, a ready-made chat **product** is enough (Chapters 17 and 18). Only when you want **your own system to call AI automatically**, like having your company website's support reply on its own, or having your program batch-process data, do you need to go through the API. **Connecting to an API and buying a membership are two different things.**
- **Get an "API key."** Using an API usually means first applying for a key on the relevant platform, used to prove "it's you placing the order," and billing **by token** accordingly (Chapters 3 and 38). For the exact application process, **refer to the official documentation.**
- **Take the key and the cost seriously from day one.** This key is extremely sensitive; **leaking it means someone else can order on your account and run up your bill.** So Step 0 in Section 2 below is specifically about managing it. Don't patch it after something goes wrong.
- **Get clear on what the "data flow" looks like.** Connecting to an API is essentially designing a pipeline of "question goes out, answer comes back, then gets used." Draw that line clearly in your head first; writing the code is just making it real.
- **What you'll need for the hands-on part**: a coding agent (Chapters 28 and 29), a new empty folder, and Git set up as in Chapter 26.

> **Key point:** Connecting to an API isn't as technically hard as you'd think (the smallest runnable version is short). The real bar is in two judgments: **one, telling apart "should I use the API or buy a membership"; two, managing the key and the cost from the start.** Once these two are clear, the rest is following the official docs.

## 2. Doing it step by step

Step 0 below covers key safety, Steps 1 to 3 explain the approach and the data flow, and Step 4 gives a minimal runnable path using a coding agent. For which language to use, how to write it, and which endpoint to call, **refer to the official documentation.**

### Step 0: Settle the key first (before writing any feature)

This step comes before all features, because it's the easiest to overlook and the easiest to cause big trouble. A few iron rules (echoing Chapter 37 on privacy, Chapter 38 on cost, and Chapter 40 on security):

| What to do | Why |
| --- | --- |
| **Put the key in an "environment variable" or a `.env` file, not in the code** | Hard-coded into the code, the key travels everywhere the code goes and can leak at any moment |
| **List `.env` in `.gitignore`, and never commit the key to a repo (especially a public GitHub one)** | Keys in public repos get picked up quickly by automated scanners and abused; even if you delete them later, they stay in Git's history |
| **Set the key yourself, and never paste it into any chat** | That includes your chat with a coding agent. Pasting it in is the same as handing it over (Chapter 37) |
| **Set a "usage cap / budget alert" for the account in the platform's dashboard** | If the key leaks, or the program writes a runaway loop hammering away, the cap helps contain your losses |

A few terms first. An "environment variable," put plainly, means putting sensitive information like the key **outside the program** and reading it in at runtime, instead of writing it out in plain sight in a code file. A `.env` file is a text file in your project folder meant for settings like this. `.gitignore` is a list that tells Git "don't record these files"; put `.env` in it, and it won't get committed.

One more thing that's easy to miss: **a coding agent may read files in your project, `.env` included.** So set the key yourself, and wherever your tool allows it, restrict the agent from reading that file. As of October 2026, Claude Code lets you add a `Read(./.env)` deny rule in its settings file, and Codex lets you set `.env` to `deny` in its permissions configuration. These rules don't necessarily cover every way a file can be read (for example, a script it runs may open the file itself), so treat them as an extra layer, not a safe. If you suspect the key has leaked, revoke it in the dashboard right away and create a new one (Chapter 40).

Exactly how to set an environment variable, a usage cap, or a deny rule is **covered in the official documentation**, but the principles of "keep it outside, don't commit it, don't paste it into chats, set a cap" are universal.

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

Once the model finishes, it **passes the answer back to your program.** What your program gets is usually a passage of text (or somewhat structured data; for the exact format, **refer to the official documentation**).

Here's a mental pitfall beginners often step in: **what the model returns can still be wrong and can still ignore the format you asked for** (hallucination happens just the same, Chapter 9). You tell it to "answer only positive or negative," and once in a while it might reply with a whole sentence of explanation. So the program has to **check and have a fallback for the returned result**; this part is engineering detail, but you need the idea: **don't assume the model follows instructions every time.**

### Step 3: "Use" the answer, embed it into your application

Once you have the answer, what comes next has nothing to do with AI anymore; it's **your own application's logic**: store "positive/negative" in a database, show it on a page, trigger a notification email, and so on. This part is entirely up to your program.

Linked up, the whole data flow is this one line:

```text
 Users / your data
      │
      ▼
 Your program ──(through the API, carrying the key)──→ Model
      ▲                                                  │
      │                                                  ▼
      └────────────  the model passes the answer back  ───┘
      │
      ▼
 Your program uses the answer (store it / show it / trigger the next step)
```

Once you see this line clearly, you've got the core of "connecting AI to a program": **your program sends the question out, takes the answer back, and embeds it into its own flow.** The "model" in the middle is rented capability, and what you pay is the token bill.

### Step 4: The minimal runnable path: have a coding agent write a script from the official quickstart

As of October 2026, the official quickstarts from OpenAI and Anthropic follow the same path: create a key in the dashboard → set the key as an environment variable (`OPENAI_API_KEY` for OpenAI, `ANTHROPIC_API_KEY` for Anthropic) → install the official SDK → run a very short example, with the SDK reading the key from the environment automatically. You don't need to memorize these details; just do this:

1. **Make a project folder.** Something like `api-hello`, with Git set up as in Chapter 26. Start the coding agent inside this folder (Chapters 28 and 29).
2. **Have it create `.gitignore` first.** Tell it: "Create a `.gitignore` file in this folder with `.env` in it." Check that the line is really there.
3. **Set the key yourself.** Create a key in the provider's dashboard and set a usage cap. Then pick one: following the official quickstart, set the key as an environment variable in your own terminal; or open the project's `.env` file in a text editor and write one line yourself, `VARIABLE_NAME=your-key`. None of this goes through the AI, and the key never goes into the chat. If you use `.env`, the script needs extra code to load that file; have the AI handle that by following the official instructions.
4. **Restrict it from reading `.env`.** If the tool you use lets you restrict reads, set that up (see Step 0).
5. **Ask it to write the script**, roughly like this:

> Plain-language request: *"Following the latest version of <provider>'s official quickstart, write a minimal script in this folder: send one user message to the model, have it answer only 'positive' or 'negative,' then print the result. Requirements: read the key only from the environment variable <variable name>; don't put the key in the code or print it; don't ask me to send you the key, and don't read the `.env` file; if anything needs installing, tell me what first and wait for my OK; finally, tell me which command runs it."*

6. **Run it and check.** In the terminal where you set the key, run the script with the command it gave you (for example `python quickstart.py`; if you let the agent run it, read the exact command before approving). Try two or three ordinary messages first, then a tricky one (say, a sentence that has nothing to do with a review), and look at the results.

### Checking the result

Once the minimal version runs, check by these:

1. **Can it reliably "send out, take back"?** Run a few pieces of real data through and confirm the pipeline works.
2. **Is the key safe?** Go back and check: is the key only in an environment variable or `.env`, not written into the code, not committed to a repo, not in any chat, with a usage cap set? **Confirm this one again and again.**
3. **Is there a fallback for the returned result?** Deliberately feed it a tricky input and see whether, when the model doesn't reply in the format, your program crashes or handles it.
4. **How much did it cost?** Take a look in the platform's dashboard at this test's usage and cost, and build an instinct for "roughly how much one call costs" (Chapter 38).

### Done when

The project is complete when all of the following are true:

- The script runs: give it a message, and it prints "positive" or "negative."
- Searching your code files doesn't turn up your key, and `.env` doesn't show up in `git status` (`.gitignore` keeps it out).
- You never pasted the key into any chat, and you've restricted reading `.env` wherever your tool allows.
- A usage cap or budget alert is set in the dashboard, and you've seen what this test cost.
- With a tricky input, the program doesn't crash, or it returns a fallback result (such as "can't tell").

## 3. Common pitfalls

| Pitfall | What's going on / how to dodge it |
| --- | --- |
| **Thinking "connecting to an API = buying a membership"** | This is the biggest misconception. A membership is for a **person** to use a product; connecting to an API is for a **program** to use an interface, which means applying for a key and paying by token (Chapter 17). Figure out which one you need first |
| **Hard-coding the key into the code / committing it to a public repo** | Like taping your house key to the door. Put the key in an environment variable or `.env`, list `.env` in `.gitignore`, set a cap; **do it before the first line of code** (Chapters 37 and 38) |
| **Pasting the key to a coding agent and asking it to "set it up for you"** | Pasting it into the chat is handing it over. Set the key yourself, and have the agent write code that "reads it from the environment" |
| **No usage cap, so a hammering or runaway loop burns through your money** | One bug in a program can make hundreds of calls a second. Set a budget alert and a usage cap in the dashboard to backstop your bill (Chapter 38) |
| **Assuming the model always replies neatly in the format** | It makes mistakes and goes off track (Chapter 9). The program needs to check the returned result and have a fallback; don't run without a net |
| **Sending users' private data to the API as is** | Remember that line from Chapter 37: **sending it in is the same as handing it over.** Sensitive information has to be de-identified first; whether it's used for training depends on the terms and settings (Chapter 37; refer to the official documentation) |
| **Copying some old code from the internet wholesale** | Each provider's API is written differently and updates often. Have the agent follow **the latest version of the official quickstart**, and don't put blind faith in outdated code snippets |

## 4. Taking it one step further

Once the minimal pipeline runs, you can expand like this (at every step, keep the key and the cost in mind):

- **Polish the "prompt"**: the passage you send to the model directly decides the quality of the answer. Use the prompting techniques from Chapters 11 and 12, and turn it into a template if needed.
- **Take more structured output**: have the model return a tidier structure (easier for the program to use directly); for exactly how to ask for it, **refer to the official documentation.**
- **Use tokens sparingly**: when calling in bulk, tokens are money. Don't stuff irrelevant long text into every request; keep requests lean (Chapter 38's "use it sparingly" turns directly into saving money here).
- **If you start letting the program "do multiple steps and call tools on its own"**: then you're actually moving from "calling an API once" to building an **agent** (Chapters 19 and 34). At that point Chapter 34's "install the brakes" discipline has to come along: spending money, deleting data, and sending outward should still be set to require human confirmation.
- **Want to hook it up to company-internal material or outside tools**: that's the Skills / MCP topic of Chapters 22 and 36. Every new source you connect is a new entry point for risk.

> **Key point:** "Connecting AI to a program" is using the **API** (Chapter 17): your program sends the question to the model, takes the answer back, and embeds it into its own application. The approach is simple and the data flow is clear. Two things need watching from the first line of code: **first, connecting to an API is not the same as buying a membership** (tell apart a person using a product from a program calling an interface); **second, manage the key and the cost from the start**: keep it in an environment variable or `.env`, list `.env` in `.gitignore`, never paste it into a chat, set a usage cap (Chapters 37 and 38). For the specific syntax, **refer to the official documentation.**

## Summary

- "Connecting AI to an existing program" = using the **API** (the third layer from Chapter 17): have your own program automatically send the question to the model behind the scenes, take the answer back, and embed it into the application.
- The minimal runnable data flow is just one line: **your program → (carrying the key) → model → answer passed back → the program uses it**. Have a coding agent write the code from the official quickstart, while you handle the key, running it, and checking.
- **The biggest misconception is "connecting to an API = buying a membership"**: a membership is for a person to use a product; an API is for a program to use an interface, billed by token.
- **Manage the key and the cost from the first line**: keep it in an environment variable or `.env` (listed in `.gitignore`), don't write it into the code, don't paste it into chats, set a usage cap; a coding agent may read `.env`, so restrict that where you can (echoing Chapters 37, 38, and 40).
- What the model returns can still be wrong and can still ignore the format (Chapter 9), so the program has to check and have a fallback; data you send in is the same as handing it over, so de-identify sensitive information first (Chapter 37).

In the next chapter, we'll make those two concepts from Chapter 22, **Skills and MCP**, truly concrete, expanding AI with new abilities to read data and use tools.

## Sources and version notes

Checked: 2026-10-27.

- [OpenAI Developer quickstart](https://developers.openai.com/api/docs/quickstart): creating a key, setting the `OPENAI_API_KEY` environment variable, installing the SDK, running the example.
- [Anthropic: Get started with Claude](https://platform.claude.com/docs/en/get-started): setting the `ANTHROPIC_API_KEY` environment variable, installing the SDK, calling the Messages API.
- [Claude Code settings documentation](https://code.claude.com/docs/en/settings): blocking reads of `.env` with a `Read(./.env)` deny rule.
- [Codex permissions documentation](https://developers.openai.com/codex/permissions): setting `.env` to `deny` in a permissions configuration.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** "Connecting AI to an existing program" is essentially using which layer of the four-layer map (Chapter 17)? <!-- quiz: q01 revision: 1 -->
   - A. Product layer: a chat screen people open and use
   - B. Agent layer: an agent that acts in several steps
   - C. API layer: the interface opened up for programs
   - D. Model layer: the trained model itself, as it is
   > **Answer: C.** Having a **program** call the model automatically behind the scenes means going through the API (that "order window," layer three in Chapter 17). A is for a **person** to open and chat; D, the model itself, isn't something your program can touch directly, it goes through the interface; B is a different matter: a program calling an API can be used to build an agent, but "calling the API once to get an answer" isn't an agent in itself.

2. **[Basic · Misconception]** "We want to bring AI into our own system, so let's go buy a ChatGPT membership." What's wrong with this? <!-- quiz: q02 revision: 1 -->
   - A. Programs go through the API: get a key, pay by usage
   - B. The plan is too low; you need a team plan to connect
   - C. Nothing; a membership lets the system call it directly
   - D. You should first train a dedicated model of your own
   > **Answer: A.** This is the number one misconception of this chapter. "A person using it in an interface" and "a program calling it automatically behind the scenes" are two different roads: the first uses a product (buy a membership), the second uses the API (Chapter 17). B and C both treat a membership as the way in, but any plan, however high, is for people; D is off target, since with an API you use the provider's ready-made model and don't need to train your own.

3. **[Basic · Concept]** What is that "API key" for when you use an API? <!-- quiz: q03 revision: 1 -->
   - A. A membership card that makes a chat product unlimited
   - B. A pass that speeds up the model; pricier means faster
   - C. A switch that limits answers to questions on your account
   - D. Proof that the call is yours, used to bill you by usage
   > **Answer: D.** The key is your "order credential plus billing basis." Precisely because one end of it is tied to your bill, **leaking it means someone can run up your account**, which is why you keep it in an environment variable or `.env`, don't commit it, don't paste it into chats, and set a usage cap (Chapters 37 and 38). A confuses it with a membership; B and C, speed and the scope of answers, have nothing to do with the key.

4. **[Advanced · Misconception]** To save effort, you wrote the key straight into a code file and pushed it to a public GitHub repo. What's most likely to happen? <!-- quiz: q04 revision: 1 -->
   - A. Nothing; public repos hold so much code nobody will notice
   - B. Scanners grab it fast, abuse it, and you get the bill
   - C. GitHub encrypts keys automatically, so nobody can see it
   - D. Deleting that line afterward undoes the leak for good
   > **Answer: B.** Public repos are watched by dedicated scanners, and a plaintext key is often picked up quickly. The right way is to **keep the key in an environment variable or `.env`, list `.env` in `.gitignore`, never commit it, and set a usage cap to backstop you** (Chapters 37 and 38). A underestimates automated scanning; C doesn't hold, since the key you wrote is plain text; D doesn't work either: deleting the line leaves that commit in Git's history, and a leaked key has to be revoked in the dashboard and replaced.

5. **[Basic · Scenario]** Your program asks the model through the API to "answer only 'positive' or 'negative,'" but once in a while it replies with a whole sentence of explanation. What should you do? <!-- quiz: q05 revision: 1 -->
   - A. Swap in a new key, since the old key may be faulty
   - B. Decide the API is broken and go back to doing it by hand
   - C. Check the reply in code, with a fallback if off-format
   - D. Keep retrying automatically until it answers in format
   > **Answer: C.** What the model returns can still be wrong or ignore the format (hallucination happens just the same, Chapter 9). A robust program assumes "it might not follow instructions" and checks the return value with a fallback. A and B mistake normal behavior for a fault; D retries with no limit, which may never succeed and burns money for nothing (Chapter 38).

6. **[Basic · Hands-on / Observation]** First draw the data flow of "connecting to an API" on paper: from "your program sends the question out (carrying the key)," to "the model passes the answer back," to "your program uses the answer," and mark three points related to money and safety: where the key goes, where you're billed, where you set the cap. If you can, then do a real run with the minimal path from Step 4 and check it against "Done when." (For the specific syntax, **refer to the official documentation.**) <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** This line is actually short: send it out, take it back, use it, just three steps, and that's the whole approach of "connecting AI." But the three points you marked (key in an environment variable or `.env`, billing by token, usage cap in the dashboard) are the spots that really cause trouble and must be managed from day one (Chapters 37 and 38). A real run also shows you that the key never has to pass through the AI for the code to work.
