Starting with this chapter, we switch up how we learn: no more new concepts — instead we **actually build something real**. Everything you picked up in the earlier parts (how to describe what you want to an AI, how to see what it did, how to check the work) all comes into play here.

For the first project, we'll make **your own personal website**: a web page you can open in a browser, with your name, a one-line intro about yourself, and a few links. How it looks is up to you.

Why start here? Because it meets two "beginner-friendly" conditions. **The bar is as low as it gets**: a single web page is the simplest thing there is, and the hardest to break badly. **The results are visible**: you don't need to understand any code; just refresh the browser and you'll know right away whether it's right. That loop of "I say one thing, it changes one thing, I see the change immediately" is the most important rapport you can build with a coding agent. Building that rapport is worth more than memorizing any command.

The rhythm of the whole chapter comes down to three steps: **preview, give feedback, change again**. We'll first run that loop with one small move that gives you a "five minutes to a win" feeling, then slowly pile on more.

## 1. Getting ready: what you need, the minimum starting point

This chapter doesn't ask you to write a single line of code, but a few things need to be in place first. **This book won't pin down exactly how to install them or which version to use; always refer to the provider's official documentation** (installation is covered in Chapters 28 and 29). Here we'll only cover "what you need to gather."

**The minimum starting point you need:**

- **A coding agent**: Claude Code, Codex, or the like. It will create files for you, write the page, and change things as you say. It comes in many forms (command line, editor extension, desktop app, web, cloud, and so on), and **some run on your own machine while others run in the cloud; the exact form varies and keeps changing, so refer to the official documentation** (Chapter 24 covered this general workflow).
- **A browser**: whatever you already have on your computer works, for looking at the results.
- **An empty folder**: a clean home for this project, for example a new folder on your desktop called `my-site`.
- **A safety net you can fall back on**: **when it's working on your local machine**, put this folder under version control (Git) first (see "Git: the bare minimum to get started" in Chapter 26). That way, if it messes up the page, you can go back to how things were at your last save. If you're using a web or cloud form, some platforms provide an isolated environment or checkpoints; check the official documentation for how much they can restore.

> **Key point:** Don't let the word "website" scare you. What we're making in this chapter isn't the kind of formal site where you buy a domain, rent a server, and let the whole world visit. It's **a web page file you can open in your own browser**. It lives on your computer, and if you break it, deleting it and starting over costs nothing. Setting the goal here is what gives you the nerve to experiment freely.

**One thing to get ready mentally**: treat this agent like the "capable colleague on their first day" from Chapter 24. It's quick on its feet, but it doesn't know what style or content you want; that's on you to say. It will also make mistakes with full confidence. So **assigning the work and checking it are your job**.

## 2. Doing it step by step

Each step below gives you two things: one **plain-language line to say to the AI** (note: this is what you say to the AI, **not a product command for you to type**), and **what you, the human, need to confirm once the step is done**.

### Before you start: have it work inside this folder

A coding agent normally treats "the folder you put it in" as its workspace. So the first job is to get it "standing" in the empty folder you just made. How you do that depends on the form of the product you use:

- **Desktop app or editor extension**: usually "Open folder" or "Choose project," then pick `my-site`.
- **Terminal (command line)**: first use the `cd` command to go into the folder, then type the tool's start command (for example, `claude` for Claude Code or `codex` for Codex).
- **Web or cloud form**: you usually connect a code repository first; follow the official documentation.

The exact buttons and commands change. Chapters 28 and 29 walk through them hands-on, and **the official documentation has the final word**.

**What you need to confirm:**
- Once it's running, ask it first: "**Which folder are you in right now, and what files are in it?**" It should name `my-site` and tell you it's empty. Make sure it's in the right place before you go on.

### Step 0: Run the loop once, change a heading with one sentence, refresh and see it

Don't aim for much yet. Just walk through the "preview, give feedback, change again" loop with your own hands and get your first win.

First, have it set up the skeleton:

> Plain-language request: *"Make me the simplest possible personal homepage. Start with one big heading that says 'Hello' and a placeholder paragraph for my intro, that's all. Requirements: use just one file, `index.html`, with the styling (CSS) written right inside that file. Don't use any framework, don't install anything, and don't start a server — I want to double-click the file and have it open in my browser. When it's done, tell me how to open it."*

Why add those last sentences? Without limits, it may build a "proper" website project: install a pile of dependencies, and require you to start a local server before you can look at anything. That's extra baggage for a beginner. **One `index.html` you can open with a double-click** is the most hassle-free starting point for this chapter.

**What you need to confirm:**
- It will create files first, then tell you how to preview. **Find `index.html` and double-click it** (or open it in the browser the way it says), and you should see a big heading reading "Hello." Once you see it, the "preview" part of the loop is working.
- If it still wants to install things, creates a pile of files, or tries to do something fancy all at once (a pile of styles, a pile of sections), you can cut it off: "**Just one `index.html` for now. It only needs to open and show one big heading; save the rest for later.**" Small steps are the keynote of this chapter.

Now for the most satisfying move: **change that big heading to your name**:

> Plain-language request: *"Change the big heading on the homepage from 'Hello' to my name, 'Lin Xiaoyu.'"*

**What you need to confirm:**
- Once it's done, **go back to the browser and hit refresh**. The big heading should immediately become your name.
- **This moment matters**: you just did a full pass of "I give one sentence of feedback, it changes, I refresh and see the change." Everything from here on is the same loop repeated, just with more and more content. Once this rhythm clicks, you're past the beginner stage.

> **Key point:** The value of this step isn't "changed a heading," it's that you confirmed something firsthand: **you don't need to understand the code to direct it and check the result**. Your eyes (what you see in the browser) are your tool for checking the work. Hand the parts you can't read to it, and you call the shots on the results you can see.

### Step 1: Fill in your own content

The skeleton works, so start filling in the real stuff. Say one block at a time; don't dump it all at once.

> Plain-language request: *"Under my name, add an intro paragraph that says: I'm a graphic designer, I love travel and photography, and I live in Chengdu. Below that, add three links: my email, my Weibo, and my portfolio (I'll fill in the links later, use placeholders for now)."*

**What you need to confirm:**
- Refresh the browser and **check item by item** against what you said: is the intro there, are the three links present, is the text wrong anywhere, did it add content on its own.
- **It may "fill in the blanks"**: for example, it invents a hobby you never mentioned, or quietly puts a fake URL on "portfolio." That's the kind of mistake it makes (hallucination, covered in Chapter 9, and it happens just the same when building a page). When you see something off, just say: "**That sentence you added yourself, delete it**" or "**That URL is fake, use a placeholder for now.**"

### Step 2: Adjust the look: colors, fonts, layout

The content is right, so now adjust "how it looks." Appearance is the best fit for going back and forth in plain language.

> Plain-language request: *"I want the whole page to feel cleaner: use a light beige background, a darker color for the heading, a bigger font, center everything, and leave some margin on both sides so it doesn't hit the edges."*

**What you need to confirm:**
- Refresh and look at the effect. Wherever it feels off, **keep giving feedback in plain language**; this is exactly "preview, give feedback, change again" in motion: *"the heading is still too small, bigger"*, *"the beige is too dark, lighter"*, *"the links are cramped together, space them out."*
- **No need to nail it in one shot.** With appearance, three to five rounds back and forth is normal; as long as each round is a little better than the last, you're on track.

### Step 3: Add a photo or a section (optional)

Want a bit more? You can add an avatar or a small "my projects" list. Same rule as always: **add one thing at a time**.

> Plain-language request: *"Above my name, add a spot for a round avatar. I'll put the image in later; for now just hold the spot with a gray circle."*

**What you need to confirm:**
- Refresh and confirm the placeholder circle shows up in the right spot.
- When it comes to putting in a real image, it usually tells you "which folder to put the image file in, and what to name it." **Do as it says**, then refresh to see whether the image shows up.

### Step 4: A milestone "save"

Each time you finish a block you're happy with, have it **save a checkpoint** (in a project using Git, this is called making a commit).

> Plain-language request: *"I'm pretty happy with this version. Save me a checkpoint, with the note 'finished the homepage's basic content and colors.'"*

**What you need to confirm:**
- This step is your **undo button**. After saving a checkpoint, you can change boldly again, and if you break it, you can go back to this version you liked. Note that it only keeps the files Git recorded at the moment you saved; changes you make afterward and haven't committed aren't in it.
- Build the habit of "**finish a small block, save a checkpoint once you're happy**." It's far safer than barreling straight through all your changes at once. Chapter 25 covers reading the diff, and Chapter 26 covers saving and going back, in more detail. In this project you mainly check the work by "refreshing to see the effect," and it's fine if you can't read the diff, but **do use this checkpoint safety net**.

## 3. Common pitfalls

- **Asking it to do too much at once.** "Build me the whole website with a blog and a photo album," and you get a heap of stuff piled on at once, where you can't review what's wrong and can't cleanly back any of it out. **Always break it down**: one block of content, refresh, satisfied, save, then the next.
- **You refreshed but nothing changed, so you think it did nothing.** It's usually the browser cache, or you've got the wrong file open, not the one it just changed. **Force a refresh first**; if that doesn't work, go back and ask it "**which file should I open to look?**" Don't rush to conclude it did nothing.
- **It built you a whole project that needs installing and a running server.** Usually Step 0 didn't spell out the limits. Have it switch back to "just one `index.html`, nothing installed, opens with a double-click," or simply go back to your last checkpoint and start that step again.
- **It added things you didn't ask for.** An invented intro, a fake link, a section out of nowhere; catch these when you check item by item, and one sentence has it delete them. **Just because it wrote it doesn't mean you wanted it; your check is what counts.**
- **It gets messier the more you change, and no matter what you say it won't go back to what you want.** Don't keep fixing on top of the mess. The cleanest move is: **go back to the last good checkpoint and say what you want again, more clearly** (the first-aid approach from Chapter 30). Chasing fixes sentence by sentence inside a mess usually makes it worse.
- **Treating the real stuff as real too early.** Don't fill in your real email or real account passwords right off the bat; **passwords and private information in particular should never go into the page or the chat** — they get sent out (Chapter 37 covers this in detail). Use fake placeholders first, swap in the real ones at the end.

## 4. Taking it one step further

Once you've got the basics down, if you want to play more, try these (all still the same old routine of "make a request in one sentence, refresh to check"):

- **Add a "dark mode" switch**: *"Add a small button that switches the whole page to a dark background when clicked."*
- **Make it look good on a phone too**: *"When it opens on a phone, the content should still lay out neatly and not get crammed together."*
- **Add the look of a simple comment or contact form** (do "how it looks" first; whether messages actually get through is a separate matter that involves more complex things, so take it as far as you can manage).
- **Actually publish it online**: this step involves "deployment," and there are many ways to do it that differ from one provider to another. You can have the AI **first walk you through the options and what each one takes**, then decide whether to bother once you understand it (**for the specific platform and steps, defer to its official documentation**).

> **Key point:** "Taking it one step further" still relies on that one loop the whole way through: **make a request, preview, give feedback, change again**. You'll find that going from a crude site to a polished one rests not on how much code you learned, but on you **stating what you want more and more clearly and looking at the results more and more carefully**. Those two things are what this book really wants to teach you.

## Summary

- The first project is a **personal website**, because it has **the lowest bar and visible results**, the best fit for building the core rapport between you and a coding agent.
- Before you start, get the agent working inside your project folder (open the folder, or `cd` into it in a terminal and start the tool, depending on the product). In Step 0, say clearly: "one `index.html`, nothing installed, opens with a double-click."
- The loop running through the whole chapter is: **preview, give feedback, change again**. Run it first with "one sentence to change the big heading to your own name, refresh and see it."
- You **don't need to understand the code**: what you see in the browser is your tool for checking the work, and **you call the shots on the results you can see**.
- The iron rule for getting work done is to **break it down**: one block of content, refresh, satisfied, save, then the next; if it gets messy, go back to a saved version and start over, don't keep forcing fixes.
- The safety baseline: use fake placeholders first, and **passwords and private information never go into the page or the chat** (Chapter 37); before working locally, start with Git, and a saved checkpoint is your undo button (Chapter 26).

In the next chapter, we'll put the same "AI plus files" approach to another real task: **tidying up a pile of scattered documents and notes**.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** Which work loop runs through this entire chapter? <!-- quiz: q01 revision: 1 -->
   - A. Write the spec, generate it all, publish
   - B. Learn to code, write the page, check it
   - C. Preview, give feedback, change again
   - D. Run commands, read the logs, fix bugs
   > **Answer: C.** You say one thing, it changes one thing, you refresh the browser to see the effect, and if you're not happy you say more. This "preview, give feedback, change again" loop is the most important rapport between you and a coding agent. A is the "do it all in one go" approach, while this chapter asks you to break things down; B assumes you must learn to code first, which the chapter says you don't; D is how programmers hunt down problems, while this chapter checks the work by what you see in the browser.

2. **[Basic · Concept]** Why does this chapter pick a "personal website" as the first hands-on project? <!-- quiz: q02 revision: 1 -->
   - A. Lowest bar, cheap to break, and a refresh shows the result
   - B. It's the most common project and you can publish it right away
   - C. Web page code is short, so the AI almost never gets it wrong
   - D. You pick up HTML along the way, a base for writing code later
   > **Answer: A.** A single web page is the simplest thing there is and the hardest to break badly, and a refresh tells you right away whether it's right. That kind of "visible result" is the best fit for a beginner to build the confidence of "I can direct it." B is wrong: what you build here is a file you open in your own browser, not a site you publish. C is wrong: it still "fills in the blanks" and makes mistakes on a web page. D is wrong: the chapter stresses that you don't need to understand the code.

3. **[Basic · Scenario]** You ask it to change the big heading to your name, go back to the browser, and **after refreshing nothing has changed**. What should you do first? <!-- quiz: q03 revision: 1 -->
   - A. Decide the change failed and have it do the same thing again
   - B. Delete the folder and start over with a simpler request
   - C. Open the code, see which lines changed, find the problem yourself
   - D. Force a refresh, then ask which file you should open to look
   > **Answer: D.** The most common reasons for "refresh, no change" are the browser cache or having the wrong file open instead of the one it just changed. Rule those two out before you draw conclusions. A and B both decide it failed before checking why; C asks you to read code, while this chapter checks the work by what you see in the browser.

4. **[Advanced · Misconception]** "Just have it build the whole website with a blog and a photo album all at once, that's the least hassle." What's wrong with this idea? <!-- quiz: q04 revision: 1 -->
   - A. Nothing; with a detailed enough spec, one go is least hassle
   - B. Too much to review at once, and hard to back out cleanly
   - C. Mostly the token cost; splitting it up saves a lot of money
   - D. The AI can't keep that many requirements in mind; write a file first
   > **Answer: B.** A big change equals a big blind spot. The keynote of this chapter is to **break it down**: one block of content, refresh and check, save a checkpoint once you're happy, then do the next. A assumes a detailed spec makes one pass enough, but however detailed it is, you still have to check every item; C and D are about cost and memory, which aren't the main problem here. Even if you save money or write it all in a file, you still can't review everything that lands at once.

5. **[Basic · Scenario]** After refreshing, you find the intro has an extra line about a hobby **you never mentioned**. What does this show, and what should you do? <!-- quiz: q05 revision: 1 -->
   - A. It remembered your hobby from past chats, so keep it
   - B. It's sample text from the page template, harmless to keep
   - C. It made that up; catch it when checking and have it removed
   - D. Your wording was ambiguous, so restart from Step 0
   > **Answer: C.** It will confidently embellish, and that's the hallucination that shows up just the same when building a page (Chapter 9). Just because it wrote it doesn't mean you wanted it; your item-by-item check is what counts, and when you find invented content, have it deleted. A is wrong: the model itself doesn't remember you across conversations, and even with a product memory feature, things you didn't ask for shouldn't appear. B is wrong: it's content the AI wrote into your page, not a template you can ignore. D overreacts; deleting that one line is enough.

6. **[Advanced · Hands-on]** Walk through Step 0 of this chapter yourself: have it make the simplest homepage, confirm you can open it in the browser and see the big heading, then change the heading to your name with one sentence and refresh to confirm. After you're done, answer: in this pass, **which sentence was the "feedback," and which action was the "preview"?** <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** The "feedback" is the sentence you said, "change the heading to my name," and the "preview" is you going back to the browser to refresh and see the effect. You'll feel firsthand that **the whole way through you don't need to understand the code; you can direct it and check the work just by "saying it clearly and looking carefully."** This is the basic skill every later project uses over and over. For exactly how to install the tools and start them inside your folder, **defer to the official documentation** (Chapters 28 and 29).
