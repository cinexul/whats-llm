From this chapter on we learn differently: no new concepts, just building something real and using everything from earlier parts, namely how to describe what you want, how to see what the AI did, and how to check the work.

The first project is your own personal website: one web page with your name, a one-line intro, and a few links, looking however you like. You'll build it on your own computer first, then publish it and get a web address other people can open.

It makes a good first project because the bar is low and the results are visible. Whether it's right, you find out by refreshing the browser and checking item by item. "I say one thing, it changes one thing, I see the change right away" is the basic rhythm of working with a coding agent (an AI tool that can read and write files and run commands in your folder). The whole chapter is one loop: **preview, give feedback, change again**.

## 1. Getting ready: what you need, the minimum starting point

- A coding agent, such as Claude Code or Codex. It creates files, writes the page, and changes things as you say. Whether it runs on your computer or in the cloud depends on the product and the form you use (installation is in Chapters 28 and 29, the general workflow in Chapter 24).
- A browser, for looking at the results.
- An empty folder, for example a new folder on your desktop called `my-site`.
- A safety net you can fall back on. When the agent works on your own computer, first put the folder under Git as described in "Git: the bare minimum to get started" in Chapter 26, so that if things get messy you can go back to your last save. Some web and cloud forms have built-in checkpoints; how much they can restore depends on the product.

As for mindset, treat the agent like the "capable colleague on their first day" from Chapter 24: quick, but it doesn't know the style or content you want, and it makes mistakes with full confidence. Assigning the work and checking it are your job.

## 2. Doing it step by step

Each step gives you a plain-language line to say to the AI (something you say to it, not a command you type) and what you need to confirm once the step is done.

### Before you start: have it work inside this folder

A coding agent treats the folder you put it in as its workspace. In a desktop app or editor extension, that's usually "Open folder," then `my-site`. In a terminal, first `cd` into the folder, then type the start command (`claude` for Claude Code, `codex` for Codex). Web and cloud forms usually have you connect a code repository first. The exact buttons change; Chapters 28 and 29 walk through them.

Once it's running, ask: "Which folder are you in right now, and what files are in it?" It should name `my-site` and say it's empty. Make sure it's in the right place before going on.

### Step 0: Run the loop once, change a heading with one sentence, refresh and see it

First have it build the smallest possible skeleton:

> Plain-language request: *"Make me the simplest possible personal homepage: one big heading that says 'Hello' and a placeholder paragraph for my intro. Use just one file, `index.html`, with the styling (CSS) written inside it. No frameworks, don't install anything, and don't start a server; I want to double-click the file and have it open in my browser. When it's done, tell me how to open it."*

Those last sentences matter. Without them it may build a "proper" website project that installs a pile of dependencies and needs a local server running before you can see anything. One `index.html` you open with a double-click is the easiest start for a beginner, and it's exactly what GitHub Pages needs at the end.

What to confirm: double-click `index.html` and you should see a big heading that says "Hello." If it still wants to install things, creates a pile of files, or goes fancy all at once, stop it: "Just one `index.html` for now. It only needs to open and show a big heading."

Then make the first change:

> Plain-language request: *"Change the big heading from 'Hello' to my name, 'Lin Xiaoyu.'"*

What to confirm: go back to the browser and refresh; the heading should now be your name. You've just done one full round of "I give feedback, it changes, I refresh and see it." Every later step repeats this round.

This step also shows where the book stands on reading code (Chapter 25 covers it in detail). You don't need to understand every line, but you check the work with concrete checks: is the heading your name, does each link open the right page, does it lay out neatly on a phone. When there's a change you can't explain, have it tell you in plain words what it changed and what could go wrong. Changes that touch money, personal data, keys, deleting files, or publishing need a second look from someone who knows the area, and don't run anything you can't undo. In this project only the final "publish" falls into that group, so Section 3 checks it separately.

### Step 1: Fill in your own content

Say one block at a time; don't dump it all at once.

> Plain-language request: *"Under my name, add an intro paragraph: I'm a graphic designer, I love travel and photography, and I live in Chengdu. Below that, add three links: my email, my Weibo, and my portfolio. Use placeholders for the links; I'll fill them in later."*

What to confirm: refresh and check item by item: is the intro there, are all three links there, any typos, anything it added on its own. It may "fill in the blanks," for example inventing a hobby you never mentioned or putting a fake URL on the portfolio link. That's the hallucination from Chapter 9. When you see it, say so: "You added that sentence yourself; delete it."

### Step 2: Adjust the look: colors, fonts, layout

> Plain-language request: *"Make the page feel cleaner: a light beige background, a darker color for the heading, bigger text, everything centered, with some margin on both sides."*

What to confirm: refresh, and wherever it feels off, keep saying so in plain language: "make the heading bigger," "the beige is too dark," "space the links out." Three to five rounds on appearance is normal; each round a little better than the last is enough.

### Step 3: Add a photo or a section (optional)

Again, one thing at a time.

> Plain-language request: *"Above my name, add a spot for a round avatar. Hold the spot with a gray circle for now; I'll add the image later."*

What to confirm: the placeholder circle appears in the right place. When you swap in a real image, it will tell you which folder to put the file in and what to name it; do that, refresh, and check that the image shows.

### Step 4: A milestone "save"

Each time you finish a block you're happy with, have it save a checkpoint (in Git this is a commit).

> Plain-language request: *"I'm happy with this version. Save a checkpoint with the note 'finished the homepage's basic content and colors.'"*

What to confirm: after a save you can change things boldly and go back to this version if you break something. A save only keeps the files Git recorded at that moment; changes made afterward and not committed aren't in it. Make "finish a small block, save once you're happy" a habit; Chapters 25 and 26 cover reading the diff and going back.

## 3. Publishing it: a public address with GitHub Pages

So far the page lives only on your computer. One free way to give it a web address, with no command line, is **GitHub Pages**: static website hosting from GitHub (a site for storing code and files) that publishes the HTML, CSS, and images in a repository as a web page. The steps below were checked against GitHub's Pages help on October 29, 2026.

### Before you publish: what must not go up

**Anything you publish is public.** On a free account the repository that holds the site has to be public, so not just the page but every file you upload to the repository can be seen and downloaded by anyone, and files you delete later stay in the commit history. Before uploading, make sure none of these are in it:

- passwords, API keys, or files that hold keys, such as `.env`;
- ID numbers, your home address, your personal phone number, or other people's photos and details without their consent;
- drafts and private files you don't want everyone to see.

An email address on the page is also visible to everyone, including programs that harvest addresses, so consider a separate address for public use. Under Chapter 25's rule, publishing is an action that gets a second look: before you upload, ask a friend or colleague to open your page and look over the list of files you're about to upload.

### Publish in six steps

1. Create an account: go to `github.com/signup`, follow the prompts, and verify your email address (you can't create a repository until you do). GitHub strongly recommends turning on two-factor authentication (2FA) as well. Note your username, for example `linxiaoyu`.
2. Create the repository: once signed in, click the "+" in the upper-right corner and choose New repository. Name it `your-username.github.io`, for example `linxiaoyu.github.io`; if your username has capital letters, write them in lowercase here. Choose Public, turn Add README on, and click Create repository.
3. Upload the files: on the repository's main page, choose Add file → Upload files and drag in `index.html` and your image files from inside `my-site`. Drag the files inside the folder, not the `my-site` folder itself, because `index.html` has to sit at the top level of the repository. Below, choose to commit directly to the `main` branch (Commit directly to the main branch) and click the green Commit changes button. Browser uploads are limited to 25 MiB per file and 100 files at a time.
4. Turn on Pages: click Settings at the top of the repository (if you can't see it, use the "⋯" menu), then Pages in the left sidebar. Under Build and deployment, set Source to Deploy from a branch, choose `main` as the branch and `/ (root)` as the folder, and click Save.
5. Wait a little: publishing can take up to 10 minutes. Back on the Pages page in Settings, when the site address and a Visit site button appear at the top, it's live.
6. Open the address: `https://your-username.github.io`. Open it once on your phone too, then send it to the friend who checked it for you.

To change it later, edit and check it on your computer first, save a checkpoint, then upload the file again with the same name to replace the old one, commit, wait a few minutes, and refresh. If nothing has changed after 10 minutes, look at the repository's Actions page for a failed run marked in red, and paste the message you find there to your coding agent to ask why. Once you're comfortable with Git, you can also push your local repository straight to GitHub; we won't cover that here.

## 4. Common pitfalls

- Asking it to do too much at once. "Build the whole site with a blog and a photo album" piles everything on at once; you can't review what's wrong and can't cleanly back it out. One block at a time: build, refresh, happy, save.
- Refreshing, seeing no change, and deciding it did nothing. It's usually the browser cache, or you have a different file open from the one it changed. Force a refresh first; if that doesn't help, ask "which file should I open?"
- It builds a whole project that needs installing and a running server. Usually Step 0 didn't spell out the limits. Have it switch back to "one `index.html` that opens with a double-click," or go back to a saved checkpoint and redo the step.
- It adds things you didn't ask for. An invented intro, a fake link, a mystery section: catch them when you check item by item, and one sentence gets them deleted.
- It gets messier the more you change. Don't chase fixes sentence by sentence inside a mess; go back to the last checkpoint you were happy with and say what you want again, more clearly (Chapter 30).
- Using real details too early. Start with placeholders, and keep passwords and private information out of the page and out of the chat (Chapter 37). Before publishing, go through the list in Section 3 again.

## 5. Taking it one step further

All of these use the same routine: one sentence to ask, refresh to check.

- Add a dark mode switch: *"Add a small button that switches the whole page to a dark background when clicked."*
- Make it look good on a phone: *"When it opens on a phone, the content should still line up neatly."* After publishing, open the address on your phone to check it.
- Add the look of a contact form. GitHub Pages only hosts static files, so on its own it can't receive form submissions, and GitHub says it shouldn't be used for sensitive transactions such as sending passwords or credit card numbers. Actually receiving messages takes a third-party service, so go only as far as you can manage.
- Use your own domain: GitHub Pages supports custom domains. Buy a domain first, then follow GitHub's instructions to set it up.

## Summary

- The first project is a personal website: low bar, visible results, and at the end you publish it with GitHub Pages and get a public address like `https://your-username.github.io`.
- Before you start, get the agent working inside your project folder; in Step 0, say clearly: "one `index.html`, nothing installed, opens with a double-click."
- The loop running through the chapter is preview, give feedback, change again. Run it first with "one sentence to change the big heading to your name, refresh and see it."
- You don't need to understand every line of code, but you check the work with concrete checks; have it explain any change you can't explain, and get a second look before outward-facing actions like publishing (Chapter 25).
- Build one small block at a time and save once you're happy; if it gets messy, go back to a save and redo it (Chapters 26 and 30).
- Anything you publish is public, and so are the repository's files and history. Keep passwords, keys, ID numbers, addresses, and other people's details off it (Chapter 37).

In the next chapter, we'll put the same "AI plus files" approach to another real task: tidying up a pile of scattered documents and notes.

## Sources and version notes

Checked on: 2026-10-29.

- [Quickstart for GitHub Pages](https://docs.github.com/en/pages/quickstart): the repository name `<username>.github.io`, choosing Deploy from a branch under Settings → Pages, and that publishing can take up to 10 minutes.
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): on GitHub Free the repository must be public; a Pages site is public even if its repository is private; the entry file can be `index.html`, `index.md`, or `README.md`.
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): not to be used for sensitive transactions such as sending passwords or credit card numbers; published sites may be no larger than 1 GB.
- [Adding a file to a repository](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository): browser uploads are limited to 25 MiB per file and 100 files at a time.
- [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github): a verified email address is needed to create a repository, and two-factor authentication is recommended.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** Which work loop runs through this entire chapter? <!-- quiz: q01 revision: 3 -->
   - A. Write the spec, generate it all, publish
   - B. Learn to code, write the page, check it
   - C. Preview, give feedback, change again
   - D. Run commands, read the logs, fix bugs
   > **Answer: C.** You say one thing, it changes one thing, you refresh the browser to see the effect, and if you're not happy you say more. This "preview, give feedback, change again" loop runs through the whole chapter, even after you publish. A is the "do it all in one go" approach, while this chapter asks you to break things down; B assumes you must learn to code first, which the chapter doesn't require; D is how programmers hunt down problems, while this chapter mainly checks the work with concrete checks in the browser.

2. **[Basic · Concept]** Why does this chapter pick a "personal website" as the first hands-on project? <!-- quiz: q02 revision: 3 -->
   - A. Lowest bar, cheap to break, and a refresh shows the result
   - B. It goes online automatically, so others can see it right away
   - C. Web page code is short, so the AI almost never gets it wrong
   - D. You pick up HTML along the way, a base for writing code later
   > **Answer: A.** A single web page is the simplest thing there is and the hardest to break badly, and a refresh tells you right away whether it's right. That kind of visible result is the best fit for a beginner to build the confidence of "I can direct it." B is wrong: the page doesn't go online by itself; it becomes public only when you publish it in Section 3, after checking it first. C is wrong: it still "fills in the blanks" and makes mistakes on a web page. D is wrong: the chapter doesn't ask you to learn HTML; you check the work with concrete checks.

3. **[Basic · Scenario]** You ask it to change the big heading to your name, go back to the browser, and **after refreshing nothing has changed**. What should you do first? <!-- quiz: q03 revision: 3 -->
   - A. Decide the change failed and have it do the same thing again
   - B. Delete the folder and start over with a simpler request
   - C. Open the code, see which lines changed, find the problem yourself
   - D. Force a refresh, then ask which file you should open to look
   > **Answer: D.** The most common reasons for "refresh, no change" are the browser cache or having the wrong file open instead of the one it just changed. Rule those two out before you draw conclusions. A and B both decide it failed before checking why; C isn't the first move, because tracing the code line by line is slow and hard, and ruling out the two common causes is quicker.

4. **[Advanced · Misconception]** "Just have it build the whole website with a blog and a photo album all at once, that's the least hassle." What's wrong with this idea? <!-- quiz: q04 revision: 2 -->
   - A. Nothing; with a detailed enough spec, one go is least hassle
   - B. Too much to review at once, and hard to back out cleanly
   - C. Mostly the token cost; splitting it up saves a lot of money
   - D. The AI can't keep that many requirements in mind; write a file first
   > **Answer: B.** A big change equals a big blind spot. The keynote of this chapter is to **break it down**: one block of content, refresh and check, save a checkpoint once you're happy, then do the next. A assumes a detailed spec makes one pass enough, but however detailed it is, you still have to check every item; C and D are about cost and memory, which aren't the main problem here. Even if you save money or write it all in a file, you still can't review everything that lands at once.

5. **[Basic · Scenario]** After refreshing, you find the intro has an extra line about a hobby **you never mentioned**. What does this show, and what should you do? <!-- quiz: q05 revision: 2 -->
   - A. It remembered your hobby from past chats, so keep it
   - B. It's sample text from the page template, harmless to keep
   - C. It made that up; catch it when checking and have it removed
   - D. Your wording was ambiguous, so restart from Step 0
   > **Answer: C.** It will confidently embellish, and that's the hallucination that shows up just the same when building a page (Chapter 9). Just because it wrote it doesn't mean you wanted it; your item-by-item check is what counts, and when you find invented content, have it deleted. A is wrong: the model itself doesn't remember you across conversations, and even with a product memory feature, things you didn't ask for shouldn't appear. B is wrong: it's content the AI wrote into your page, not a template you can ignore. D overreacts; deleting that one line is enough.

6. **[Advanced · Hands-on]** Walk through Step 0 of this chapter yourself: have it make the simplest homepage, confirm you can open it in the browser and see the big heading, then change the heading to your name with one sentence and refresh to confirm. After you're done, answer: in this pass, **which sentence was the "feedback," and which action was the "preview"?** <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** The "feedback" is the sentence you said, "change the heading to my name," and the "preview" is you going back to the browser to refresh and see the effect. You'll find that without reading the code line by line, you can direct it and check the work by saying clearly what you want and looking at the result item by item. That's the basic skill every later project uses (installing and starting the tools is covered in Chapters 28 and 29).
