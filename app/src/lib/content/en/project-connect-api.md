So far you've used AI by opening an interface and chatting in it yourself. This chapter has your own program use AI instead: your website, app, or script automatically sends a question to the model behind the scenes, takes the answer back, and uses it in your own application.

This is layer ③ of Chapter 17's "four-layer map": the **API** (application programming interface, an entry point opened up for programs to call). Remember the analogy: a restaurant serves customers who walk in, and another shop that wants this chef's cooking places an order at the "order window." The API is that window; it's just that a program, not a person, places the order.

This chapter first explains the data flow, then gives you a minimal script that really runs: thirty-odd lines of JavaScript that send one sentence to a model and print the answer, reading the key from an environment variable. When you're done you'll have a working script and a habit of keeping keys and costs under control.

## 1. Getting ready

- First make sure you really need an API rather than a subscription. If it's just you occasionally having AI polish some writing, a ready-made chat product is enough (Chapters 17 and 18). You need the API when your own system should call AI automatically, for example a website support bot that replies on its own, or a program processing data in bulk.
- An **API key**: a string the platform issues you to prove "it's you placing the order," which it uses to bill you by the token (Chapters 3 and 38). If it leaks, someone else can order on your account and charge it to your bill, which is why Step 0 in Section 2 deals with it first.
- Think through the data flow: the question goes out, the answer comes back, then it gets used. Draw that line clearly in your head first; writing code just puts it into practice.
- What you need to build it: Node.js (installed in Step 4), a coding agent (optional; Chapters 28 and 29), and a new empty folder, started under Git as in Chapter 26.

## 2. Doing it step by step

### Step 0: Settle the key first (before writing any feature)

| What to do | Why |
| --- | --- |
| Put the key in an environment variable or a `.env` file, never in the code | In the code, the key travels everywhere the code goes and can leak at any time |
| List `.env` in `.gitignore`, and never commit the key to a repository (especially a public one on GitHub) | Keys in public repositories are picked up quickly by automated scanners; even if you delete them later, they stay in the Git history |
| Set the key yourself and never paste it into any chat | That includes your chat with a coding agent; pasting it in is handing it over (Chapter 37) |
| Set a usage cap in the platform's dashboard | If the key leaks, or a program loops and keeps calling, the cap limits the damage (Chapter 38) |

A few terms first. An **environment variable** is a setting kept outside the program and read in when it runs, so the key never sits openly in the code. `.env` is a text file in the project folder for holding settings like this. `.gitignore` is a list telling Git which files not to record; put `.env` on it and it won't be committed.

A coding agent may read the files in your project, including `.env`. So set the key yourself, and where the tool allows it, block it from reading that file. As of October 2026, in Claude Code you can add `Read(./.env)` under `permissions.deny` in a settings file; in Codex you can set `.env` to `deny` in the permissions section of `config.toml` (that feature is still marked Beta). These rules don't necessarily block every way of reading, for example a script it runs that reads the file itself, so they're one extra layer, not a safe. If you suspect the key has leaked, revoke it in the dashboard right away and create a new one (Chapter 40).

### Step 1: Have the program "ask one thing" for you

The core of a minimal runnable version is a single thing: your program sends one question to the model through the API. Described in plain words, the request looks like this:

```text
(your program does this automatically, behind the scenes)
Say to the model: "Decide whether the following review is positive
          or negative. Answer only 'positive' or 'negative'. Review: ..."
```

This is essentially the same as typing into a chat box: both send some text to the model. The difference is that now the program sends it for you, and it can send ten thousand a day. What to send follows Chapter 11's advice: state the requirement clearly and fix the format.

### Step 2: Take the model's answer back

When the model is done, the answer comes back to your program, usually as structured data containing the answer text and this call's usage.

A common beginner trap is assuming the model will always answer in the requested format. You ask for only "positive" or "negative," and now and then it replies with a whole sentence of explanation; hallucinations happen here too (Chapter 9). So the program checks what came back and falls back to a default when it doesn't fit the format.

### Step 3: "Use" the answer, embed it into your application

Once you have the answer, the rest is your own application's logic: store "positive/negative" in a database, show it on a page, trigger a notification email; your program decides. Connected end to end, the data flow looks like this:

```text
 Users / your data
      │
      ▼
 Your program  ──(through the API, carrying the key)──→  Model
      ▲                                                  │
      │                                                  ▼
      └──────────────  model passes the answer back  ────┘
      │
      ▼
 Your program uses the answer (store / display / next step)
```

The model in the middle is rented capability, and you pay by the token.

### Step 4: The minimal runnable path: a script that really runs

What follows was checked against Anthropic's official quickstart (Get started with Claude) and its API versioning page on October 29, 2026.

We use JavaScript here, run with Node.js (a program that runs JavaScript directly on your computer). We chose it over Python because this script needs no extra packages in Node.js: it sends the request with Node.js's built-in `fetch` and reads `.env` with Node.js's built-in `--env-file` option. The official quickstart's Python version has you install the SDK (the provider's code library) first, and reading `.env` usually takes yet another package. Sending the request directly has another benefit: the data flow from Steps 1–3, where it goes, what it carries, what comes back, is all visible in the code.

1. Install Node.js: download the version marked LTS (long-term support) from `nodejs.org` and install it. Then type `node --version` in a terminal; if you see a version number, you're set.
2. Make a project folder, `api-hello`, and start it under Git as in Chapter 26.
3. Create `.gitignore` with one line: `.env`. You can have a coding agent create it, then open it yourself to check.
4. Set the key yourself: create an API key in the Claude Console (`platform.claude.com`) and set a usage cap as in Chapter 38. In a text editor, create `.env` in the project folder with one line: `ANTHROPIC_API_KEY=your-key`. None of this goes through the AI, and the key never goes into any chat.
5. In the coding agent you use, block reading `.env` (see Step 0).
6. Create `hello-api.mjs` with the content below. Paste it yourself or have a coding agent copy it exactly, then open it and check it yourself:

```javascript
// hello-api.mjs: send one review to Claude and print its verdict
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("ANTHROPIC_API_KEY not found; check your .env file");
  process.exit(1);
}

const review = "Fast delivery, and the packaging was really careful.";

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2026-10-21",
  },
  body: JSON.stringify({
    model: "claude-opus-5-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Decide whether the following review is positive or negative. Answer only "positive" or "negative". Review: ${review}`,
      },
    ],
  }),
});

const data = await response.json();
if (!response.ok) {
  console.error("Request failed:", response.status, data.error?.message);
  process.exit(1);
}

const text = (data.content.find((block) => block.type === "text")?.text ?? "").trim().toLowerCase().replace(/\.$/, "");
console.log(text === "positive" || text === "negative" ? text : `Can't tell (the model said: ${text})`);
console.log("Usage this call (tokens): input", data.usage.input_tokens, "output", data.usage.output_tokens);
```

7. In a terminal, go into this folder and run:

```bash
node --env-file=.env hello-api.mjs
```

This command means: run `hello-api.mjs` with Node.js, and before that, read the line in `.env` into an environment variable. That's where `process.env.ANTHROPIC_API_KEY` in the script gets the key; the key itself never appears in the code. If all goes well it prints "positive" and a usage line; with a wrong key it prints `Request failed: 401 invalid x-api-key`.

Matched against Steps 1–3, here is what the script does:

- Where it goes: `https://api.anthropic.com/v1/messages`, Anthropic's Messages API.
- Three request headers: `x-api-key` carries the key; `anthropic-version` gives the API version as a date, the latest being `2026-10-21` as of October 2026 (the official quickstart's example still shows `2023-06-01`, which gives the same result for a request this simple); `content-type` says the body is JSON.
- What it sends: `model` is the model name, here `claude-opus-5-5` as in the quickstart; `max_tokens` is the most tokens the answer may generate; `messages` is the conversation.
- What comes back: JSON (a text format that organizes data with curly and square brackets). `content` is a list, and the block whose type is `text` holds the answer; the list can also contain blocks of other types, such as one left by the model's thinking, so the script looks the block up by type. `stop_reason` says why it stopped, with `end_turn` meaning it finished normally. In `usage`, `input_tokens` and `output_tokens` are the token counts you're billed for.
- The fallback: after trimming spaces, lowercasing, and dropping a final period, if the answer is neither "positive" nor "negative," it prints "Can't tell" with the model's answer instead of crashing.

To save money, you can change `model` to `claude-haiku-5-5`: as of October 2026 its input price starts at $0.10 per million tokens, against $4 for `claude-opus-5-5` (more prices in Appendix E). OpenAI's API works the same way with a different address, headers, and field names; adapt it by following their quickstart.

### Checking the result

1. Does it reliably send out and get back? Swap `review` for two or three real reviews and run each one.
2. Is the key safe? It's only in `.env`, not in the code, not committed to a repository, not in any chat, and the dashboard has a usage cap. Check this one again and again.
3. Does the fallback work? Change `review` to a sentence that isn't a review at all, such as "What time is tomorrow's meeting?" The program should print "Can't tell" rather than crash.
4. How much did it cost? With the token counts the script printed in hand, look at this test's usage and cost in the dashboard to get a feel for "roughly how much one call costs" (Chapter 38).

### Done when

The project is done when all of these are true:

- Running `node --env-file=.env hello-api.mjs` prints "positive" or "negative" and a usage line.
- Searching the code files doesn't turn up your key; `git status` doesn't show `.env` (`.gitignore` keeps it out).
- You've never pasted the key into any chat, and wherever your tools can block reading `.env`, that's set.
- The dashboard has a usage cap, and you've looked at what this test cost.
- Given a tricky input, the program prints "Can't tell" and doesn't crash.

## 3. Common pitfalls

| Pitfall | What happens / how to avoid it |
| --- | --- |
| Thinking "connecting an API = getting a subscription" | A subscription lets a person use a product; an API lets a program use an interface, with a key and per-token billing (Chapter 17) |
| Writing the key into the code / committing it to a public repository | Like taping your house key to the door. Key goes in `.env`, `.env` goes in `.gitignore`, before you write the first line of code |
| Pasting the key to a coding agent so it can "set things up for you" | Pasting it into a chat is handing it over. Set the key yourself, and just have it write code that reads from an environment variable |
| No usage cap, so abuse or an infinite loop burns through money | One bug can make hundreds of calls a second. Set a cap first (Chapter 38) |
| Assuming the model always answers in the format you asked for | It makes mistakes and drifts (Chapter 9). Check the return value, and fall back when it doesn't fit |
| Sending users' private data to the API as is | What you send is handed over; anonymize sensitive information first (Chapter 37) |
| Copying an old snippet found online | Providers update their APIs, and model names and version numbers change. Follow the official quickstart as it is now; the same goes for this chapter's version |

## 4. Taking it one step further

At every step, keep the key and the costs in mind:

- Polish the prompt: the text you send the model directly decides the quality of the answer; use the techniques from Chapters 11 and 12.
- Ask for more structured output: if the model returns a fixed structure, your program can use it directly. Both Anthropic and OpenAI support "structured outputs"; follow each one's documentation.
- Spend tokens sparingly: when you call in bulk, tokens are money. Don't stuff unrelated long text into every request (Chapter 38).
- Have the program "take several steps on its own and call tools": then you're building an agent (Chapters 19 and 34), and Chapter 34's brakes have to come along: spending money, deleting data, and sending outward still need human confirmation.
- Connect internal documents or outside tools: that's Skills and MCP from Chapters 22 and 36, and every new source is a new entry point for risk.

## Summary

- "Connecting AI to an existing program" means using the API (layer ③ in Chapter 17): your program automatically sends a question to the model behind the scenes, takes the answer back, and uses it in your application.
- The data flow is one line: your program → (carrying the key) → model → answer comes back → your program uses it. The minimal script is thirty-odd lines: it sends to `https://api.anthropic.com/v1/messages` with the three headers `x-api-key`, `anthropic-version`, and `content-type`, takes the text out of the returned `content`, and `usage` holds the token counts you're billed for.
- The biggest misconception is "connecting an API = getting a subscription": a subscription is for a person using a product, an API is for a program using an interface, billed by the token.
- Manage the key and the costs from the first line: keep the key in `.env` and list it in `.gitignore`, never in the code, never pasted into a chat, with a usage cap set and the coding agent blocked from reading `.env` (Chapters 37, 38, and 40).
- What the model returns can still be wrong or off-format (Chapter 9), so the program checks it and has a fallback; data you send is handed over, so anonymize sensitive information first (Chapter 37).

In the next chapter, we put Chapter 22's two concepts, Skills and MCP, into practice, giving AI new abilities to read data and use tools.

## Sources and version notes

Checked on: 2026-10-29.

- [Anthropic: Get started with Claude](https://platform.claude.com/docs/en/get-started): the key goes in the `ANTHROPIC_API_KEY` environment variable; requests go to `https://api.anthropic.com/v1/messages` with the `x-api-key`, `anthropic-version`, and `content-type` headers; the example model is `claude-opus-5-5`; the returned JSON's `content`, `stop_reason`, and `usage` fields.
- [Anthropic: API versions](https://platform.claude.com/docs/en/api/versioning): the latest version is `2026-10-21`, and Anthropic recommends using the latest version where possible; that version's changes don't touch the fields this chapter's script uses.
- [Anthropic: Models overview](https://platform.claude.com/docs/en/about-claude/models/overview): `claude-opus-5-5` input costs $4 per million tokens; `claude-haiku-5-5` starts at $0.10.
- [Node.js command-line options](https://nodejs.org/api/cli.html): `--env-file` reads environment variables from `.env` and has not been experimental since v24.10.0 and v22.21.0.
- [OpenAI Developer quickstart](https://developers.openai.com/api/docs/quickstart): OpenAI's equivalent flow, using the `OPENAI_API_KEY` environment variable.
- [Claude Code settings](https://code.claude.com/docs/en/settings): a `Read(./.env)` deny rule blocks reading `.env`.
- [Codex permissions](https://developers.openai.com/codex/permissions): setting `.env` to `deny` in the permissions configuration (Beta).

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question; think first, then compare.

1. **[Basic · Concept]** "Connecting AI to an existing program" is essentially using which layer of the four-layer map (Chapter 17)? <!-- quiz: q01 revision: 2 -->
   - A. Product layer: a chat screen people open and use
   - B. Agent layer: an agent that acts in several steps
   - C. API layer: the interface opened up for programs
   - D. Model layer: the trained model itself, as it is
   > **Answer: C.** Having a **program** call the model automatically behind the scenes means going through the API (that "order window," layer three in Chapter 17). A is for a **person** to open and chat; D, the model itself, isn't something your program can touch directly, it goes through the interface; B is a different matter: a program calling an API can be used to build an agent, but "calling the API once to get an answer" isn't an agent in itself.

2. **[Basic · Misconception]** "We want to bring AI into our own system, so let's go buy a ChatGPT membership." What's wrong with this? <!-- quiz: q02 revision: 2 -->
   - A. Programs go through the API: get a key, pay by usage
   - B. The plan is too low; you need a team plan to connect
   - C. Nothing; a membership lets the system call it directly
   - D. You should first train a dedicated model of your own
   > **Answer: A.** This is the number one misconception of this chapter. "A person using it in an interface" and "a program calling it automatically behind the scenes" are two different roads: the first uses a product (buy a membership), the second uses the API (Chapter 17). B and C both treat a membership as the way in, but any plan, however high, is for people; D is off target, since with an API you use the provider's ready-made model and don't need to train your own.

3. **[Basic · Concept]** What is that "API key" for when you use an API? <!-- quiz: q03 revision: 2 -->
   - A. A membership card that makes a chat product unlimited
   - B. A pass that speeds up the model; pricier means faster
   - C. A switch that limits answers to questions on your account
   - D. Proof that the call is yours, used to bill you by usage
   > **Answer: D.** The key is your "order credential plus billing basis." Precisely because one end of it is tied to your bill, **leaking it means someone can run up your account**, which is why you keep it in an environment variable or `.env`, don't commit it, don't paste it into chats, and set a usage cap (Chapters 37 and 38). A confuses it with a membership; B and C, speed and the scope of answers, have nothing to do with the key.

4. **[Advanced · Misconception]** To save effort, you wrote the key straight into a code file and pushed it to a public GitHub repo. What's most likely to happen? <!-- quiz: q04 revision: 2 -->
   - A. Nothing; public repos hold so much code nobody will notice
   - B. Scanners grab it fast, abuse it, and you get the bill
   - C. GitHub encrypts keys automatically, so nobody can see it
   - D. Deleting that line afterward undoes the leak for good
   > **Answer: B.** Public repos are watched by dedicated scanners, and a plaintext key is often picked up quickly. The right way is to **keep the key in an environment variable or `.env`, list `.env` in `.gitignore`, never commit it, and set a usage cap to backstop you** (Chapters 37 and 38). A underestimates automated scanning; C doesn't hold, since the key you wrote is plain text; D doesn't work either: deleting the line leaves that commit in Git's history, and a leaked key has to be revoked in the dashboard and replaced.

5. **[Basic · Scenario]** Your program asks the model through the API to "answer only 'positive' or 'negative,'" but once in a while it replies with a whole sentence of explanation. What should you do? <!-- quiz: q05 revision: 3 -->
   - A. Swap in a new key, since the old key may be faulty
   - B. Decide the API is broken and go back to doing it by hand
   - C. Check the reply in code, with a fallback if off-format
   - D. Keep retrying automatically until it answers in format
   > **Answer: C.** What the model returns can still be wrong or ignore the format (hallucination happens just the same, Chapter 9). A robust program assumes "it might not follow instructions" and checks the return value with a fallback. A and B mistake normal behavior for a fault; D retries with no limit, which may never succeed and wastes money for nothing (Chapter 38).

6. **[Basic · Hands-on / Observation]** First draw the data flow of "connecting to an API" on paper: from "your program sends the question out (carrying the key)," to "the model passes the answer back," to "your program uses the answer," and mark three points related to money and safety: where the key goes, where you're billed, where you set the cap. If you can, then run the script from Step 4 for real and check it against "Done when." <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** This line is actually short: send it out, take it back, use it, just three steps, and that's the whole approach of "connecting AI." But the three points you marked (key in an environment variable or `.env`, billing by token, usage cap in the dashboard) are the spots that really cause trouble and must be managed from day one (Chapters 37 and 38). A real run also shows you that the key never has to pass through the AI for the code to work.
