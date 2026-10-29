This chapter takes a different angle. Instead of a new concept, it uses this book and its companion app as a case study and lays out how they were made. The author has a humanities background and can't write code; the text, the web version, the phone version and the Windows desktop version were all built together with coding agents. Every number and event below can be checked in the book's code repository: the commit history, the run logs of the automated checks, and the dated review records in the `docs/` folder. Numbers are as of October 28, 2026.

You don't need to copy this project, but the pitfalls it ran into and the safeguards it added later will almost all show up again in your own projects.

## 1. What was built

First, the list of what was built:

| Part | What it includes |
| --- | --- |
| Text | Chinese, Japanese and English; Chapters 0 to 41 plus 5 appendices; each teaching chapter ends with a 6-question quiz |
| Web version | Can be added to a phone's home screen and read offline; reviews are scheduled around how memory fades; four interactive labs |
| Desktop version | A Windows installer version and a no-install version; study records are kept in a database on your own computer |
| Automated checks | Run automatically after every change: type checks, about 370 unit tests, about 60 browser tests, Rust tests, and registry checks for chapters and quizzes |

As for the technology, you only need to know three things: the web part is written in Svelte and needs no server; the desktop version uses Tauri to wrap the web pages into a Windows program; review scheduling uses FSRS, the same algorithm Anki uses. Most of these choices were settled in discussion with the agent. The author's job was to say clearly what was wanted, understand the plan, and check the results before signing off.

The repository shows traces of two tools: `codex/…` branches created by Codex, and `CLAUDE.md`, a project memory file written specifically for Claude Code (Chapter 28).

## 2. Timeline

| When | What happened |
| --- | --- |
| June 2026 | The first Windows test build; it was once published as a "pre-release," version number 0.1.0 |
| October 23, 2026 | The scattered earlier history was consolidated into a fresh starting point, and the project files were cleaned up |
| October 25 | The Windows no-install version is packaged automatically, then actually unzipped and launched on a GitHub Windows machine as a check; the installer version followed |
| October 27 | A reader submitted the first outside improvement (see section 5); a full review began the same day |
| October 27–28 | Display bugs fixed, the whole book revised, tests moved back into the repository, the web and desktop versions given the same review algorithm, a tokenization lab added; version set to 1.0.0 |

As you can see, "it works" came early and "it can be trusted" came late. What really took time is what sections 3 and 4 cover.

## 3. AI writes fast and also makes quiet mistakes: five real pitfalls

### 1. The correct quiz answer was almost always the longest one

During the full review, a count showed that before the revision, in 150 of the 154 scored multiple-choice questions in Chinese, the correct option was exactly the longest one. AI had helped write the questions. Trying to make the right answer precise, it kept adding qualifiers without meaning to, while the wrong options came out short and exaggerated. A reader could skip the text, pick the longest option, and still score high.

Looking at any one question, you can't see the problem at all; you only find it by counting all of them together. The fix was to set rules for writing questions (four options of similar length, wrong options that look like misunderstandings a beginner would really have, answer letters spread around) and then check the result with a counting script. Now, of 205 scored questions, only 9 have a correct answer that happens to be the longest.

### 2. Bold text in Chinese showed up as asterisks

Markdown uses `**` to mark bold, but its rules were designed around English: when `**` sits right next to Chinese punctuation, it sometimes isn't treated as bold, and the two asterisks show up on the page as they are. The book had 41 such spots, and the author never noticed, because the chapters the author opened most happened not to have any.

The fix was to switch to a parsing plugin that handles Chinese and Japanese properly, then check the rendered pages chapter by chapter in all three languages. The lesson: check the final result as readers will see it, in all three languages, not just the source files.

### 3. Tests kept only locally quietly went stale

At one point the author felt the repository should hold only code and documentation, so the test files were moved out of it and kept only on the author's own computer. Then the book-wide revision changed some sentences, and two tests that had the original sentences written into them started failing. Nobody noticed for a long time, because nobody ran them anymore.

Now all tests live in the `app/tests/` folder, and GitHub runs them automatically on every push. For someone who doesn't write code, automated checks are the eyes that watch on your behalf (Chapter 25): they don't guarantee there are no problems, but they do make sure that "what used to work hasn't been quietly broken."

### 4. The version number was 0.1.0 again

When the official release was being prepared, the version number in the config file had stayed at 0.1.0 all along, and the packaging process simply used it. But the June pre-release had also been called 0.1.0, so anyone who had downloaded it back then couldn't tell old from new. In the end it was set to 1.0.0.

Nothing here is technically hard; it's a record-keeping problem. Checking the history before you act (release records, commit history) saves far more trouble than explaining things afterward.

### 5. A feature 90% done was finally deleted

The desktop version once had a built-in "semantic search" engine that could find passages by meaning rather than by exact wording. It was never finished, yet it made the program bigger and more complicated, and even the author had forgotten it was still there. The review decided to remove it entirely and keep keyword search. The old code stays in the Git history and can be brought back whenever it's needed (Chapter 26).

Agents make "add one more feature" very cheap, but every feature needs someone to maintain it. An unfinished feature is best deleted as early as possible.

## 4. Keeping quality in check without writing code

Looking back, these are the things that actually worked. None of them requires you to understand every line of code:

- Automated checks. Every push runs the tests and checks. When something turns red (fails), fix it first, and don't keep adding things on top of a red state.
- Comparing against the official implementation. The web version's review scheduling was ported from the desktop version's algorithm, and both are tested against the same reference data generated by the desktop version: across 8 answering scenarios, the review dates come out exactly the same. The two tokenizers in the tokenization lab were also checked token by token against the official tools. Reference data is far more reliable than "looks about the same."
- A fresh pair of eyes. The same AI session has a hard time spotting its own blind spots. Open a separate session, give it the code rather than your conclusions, and have it review from scratch. Both the quiz problem (pitfall 1) and the bold problem (pitfall 2) were found this way.
- Writing the rules down. The author doesn't like spaces between Chinese and English, or slogan-like sentences. These preferences went into the project memory file, so every time the agent starts work afterward, it follows them without being told again.
- Checking in the real environment. Each time, the Windows installer is actually installed and launched on a GitHub Windows machine, and only after confirming that the study records get created does it go into a release draft. Whether to click "Publish" is up to the author, after looking it over.

## 5. The first improvement from a reader

On October 27, a reader (GitHub user pleromyst) submitted a change of just 9 lines: before packaging, check that the version number you entered matches the one written in the program, and stop right away if they differ. Without it, a wrong version number would still get packaged, and people downloading the app would see the wrong version.

The author can't read the packaging script, so the decision to accept it was made like this: ask the agent to explain in plain words what the change does and what it affects; see whether the automated checks pass; confirm that the change is small and touches only the packaging process. All three held, so it was merged. Changes from other people get checked the same way as changes from AI, using the method in Chapter 25.

## 6. Practices you can copy

1. Write down what you want and how you'll judge it done first, then have the agent investigate and make a plan (Chapters 24 and 27).
2. Do one thing at a time and commit when it's done, with a commit message that says clearly what changed and why.
3. Run the automated checks at every step; if they turn red, fix that first instead of piling new things on top.
4. Judge results by what the final product looks like: for a web page, open it and look; for an installer, actually install it once.
5. For important changes, have a separate session or another person review from scratch.
6. Put the rules you care about into the project memory file so they travel with the project.
7. Before a release, check the history: the version number, what the last release contained, and whether anything was left unfinished.

## Summary

- This book and its app were made by an author who doesn't write code, working with coding agents; the commit history and review records in the code repository are this chapter's evidence.
- AI's mistakes often can't be seen by looking at one spot: quiz answers that were always the longest, Chinese bold that didn't work, and tests that went quietly stale all came to light only when looked at as a whole or on the real page.
- Someone who doesn't write code keeps quality in check with tools and process: automated checks, comparing against the official implementation, a fresh pair of eyes, written-down rules, and checking in the real environment.
- Outside contributions get checked the same way as AI's changes.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** How was the problem "the correct answer is almost always the longest option" in the old quizzes finally discovered? <!-- quiz: q01 revision: 1 -->
   - A. A reader posted online that the questions were too easy
   - B. The author reread each question and found wording issues
   - C. The review counted option lengths across all questions
   - D. The automated checks reported an error on every push
   > **Answer: C.** Looking at a single question shows nothing at all; only by counting all the scored questions together did it emerge that 150 of 154 had the longest option as the correct one. B is what many people would assume, but going one question at a time is exactly how you miss the pattern. A and D never happened; the automated checks at the time didn't count option lengths.

2. **[Advanced · Misconception]** About "keeping tests only on your own computer," which understanding is most accurate? <!-- quiz: q02 revision: 1 -->
   - A. Local tests work just as well, if you remember to run them now and then
   - B. Tests nobody runs go stale; keep them in the repo to run automatically
   - C. Tests clutter the repository, so real projects are better off without them
   - D. If AI wrote the code, there's no longer any need to keep the tests around
   > **Answer: B.** In this project, once the tests left the repository nobody ran them, and after the book-wide revision two of them failed quietly without anyone noticing. A's weak point is exactly "now and then." C and D treat tests as a burden, but for someone who doesn't write code, tests that run automatically are the very tool that watches your changes for you.

3. **[Basic · Scenario]** Someone online sends you a change you can't understand. What's the most suitable thing to do? <!-- quiz: q03 revision: 1 -->
   - A. If you can't read it, don't accept it; close all outside changes
   - B. Have the agent explain it, then look at the checks and the scope
   - C. They're willing to help, so they're reliable; just merge it in
   - D. Merge it first, and if a problem shows up, roll it back later
   > **Answer: B.** This chapter's approach: ask the agent to explain in plain words what changed and what it affects, confirm the automated checks pass and the change is small, then decide. A passes up useful improvements; C and D both skip checking, and the standard from Chapter 25 applies to outside changes too.

4. **[Advanced · Misconception]** The web version's review scheduling was ported from the desktop version's algorithm. Why test it against reference data generated by the desktop version anyway? <!-- quiz: q04 revision: 1 -->
   - A. Porting easily causes small deviations, so compare the results one by one
   - B. The web version runs slower than the desktop one, and the gap needs measuring
   - C. The reference data is for readers, to show how the algorithm works inside
   - D. As long as the code runs without errors, there's really no need to compare
   > **Answer: A.** "Looks about the same" isn't the same as matching. Only when both sides, tested on the same data, give exactly the same review dates in all 8 answering scenarios can you safely say the two versions schedule the same way. B and C aren't what the comparison is for; D mistakes "it runs" for "the results are right," which is exactly the misconception to avoid.

5. **[Basic · Scenario]** A feature is 90% done, you realize you haven't used it in a long time, and you can't say what it still lacks. Based on this chapter's experience, what's the better way to handle it? <!-- quiz: q05 revision: 1 -->
   - A. Leave it for now; it isn't affecting any other features yet
   - B. Have the agent add a few more features to make it complete
   - C. Remove it; the old code stays in Git history for when needed
   - D. Hide it from the interface but keep all of its code in place
   > **Answer: C.** An unfinished feature makes the program bigger and harder to maintain; that's how this book's semantic search ended up removed, and Git history means it can still be brought back later (Chapter 26). A and D both leave the maintenance burden in the project; B piles more onto something that hasn't been thought through, which only makes the problem bigger.

6. **[Basic · Hands-on / Observation]** Open your own project's memory file (for example `CLAUDE.md` or `AGENTS.md`; if there isn't one, create it) and write three rules you want the agent to follow every time, such as formatting habits, files it must not touch, or checks to run after every change. Then have the agent do a small task and watch whether it followed them. <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Rules written in the project memory file are automatically put into the context each time work starts (Chapters 3 and 28), so you don't have to repeat them. If it didn't follow them, the rule was most likely too vague; rewrite it in specific, checkable terms and try again.
