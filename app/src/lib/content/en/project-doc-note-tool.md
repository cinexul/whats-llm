Everyone's computer has a "junk drawer": a folder stuffed with scattered files. Dozens of meeting notes, downloaded articles, notes here and there, file names all over the place, and finding one means digging through the lot.

This chapter tidies that drawer. "A small document and note tool" doesn't mean building software. You set the rules, and a coding agent sorts, renames, summarizes, and converts a pile of files in bulk. Repetitive work that would take you an afternoon by hand gets done in batches once the rules are clear; it's the most down-to-earth use of Chapter 14's "letting AI keep a task moving." When you're done you'll have two things: a folder organized by your rules, and a summary table you can open in a spreadsheet program.

Unlike the last chapter, this time it's working on your real files. A broken web page shows up on refresh and you go back; a batch of dozens of files changed wrongly, with no backup, is truly gone. So the first rule of this chapter is: **before any batch processing, make a full backup of the originals.**

## 1. Getting ready: what you need, the minimum starting point

- A coding agent, such as Claude Code or Codex, that can read the files in your folder and organize them as you say (whether it runs locally or in the cloud depends on the product; see Chapter 24).
- The folder you want to tidy.
- A backup of the originals: before it does anything, copy the whole folder as it is to somewhere outside the working folder, for example renamed "originals_backup_do_not_touch," and leave it alone the whole time.
- Git: when it works on your own computer, also put the working folder under Git as described in "Git: the bare minimum to get started" in Chapter 26.

Use the backup and Git together, not one or the other. A manual copy is the plainest move, needs no Git knowledge, and also protects files Git never recorded; Git shows you clearly which files it changed and lets you go back to a committed version.

Also watch the permission mode (Chapter 26 explains the ideas). As of October 2026, recent versions of Claude Code start in auto mode in the terminal and won't necessarily ask before changing files. For your first batch job, press `Shift+Tab` to switch to manual mode, shown as "manual mode on" in the status bar, and it will ask before every file change or command. In Codex, choosing Read Only with `/permissions` has a similar effect.

The rhythm of the chapter is: back up → try two or three files → check → process everything.

## 2. Doing it step by step

Each step gives you a plain-language line to say to the AI (something you say to it, not a command you type) and what you need to confirm.

### Step 0: Back up first, then have it "survey the situation"

The backup is your job. Before you open the coding agent, copy the whole folder by hand to somewhere outside the working folder, such as another drive or another spot on your desktop.

Then start the agent with the working folder as its project: in a desktop app or editor that's usually "Open folder"; in a terminal, `cd` into the folder and type `claude` or `codex` (Chapters 28 and 29). Don't start it in a parent folder that holds both the working folder and the backup, or the backup ends up inside its workspace too.

> Plain-language request: *"I'm about to tidy the files in this folder. First, confirm: which folder are you in right now? My 'originals backup' isn't here; don't go looking for it, and don't touch it."*

What to confirm: it should name the working folder. If it names the wrong place, quit and start it again in the right folder. Then have it look without touching:

> Plain-language request: *"Don't move any files yet. Just look at what's in this folder: how many files there are, what types, and whether the file names follow any pattern. Give me a list."*

What to confirm: is the count right, did it miss any type? This is the "investigate" step of the workflow (Chapters 14 and 24): it learns first and you check first, so it doesn't start rearranging blindly.

### Step 1: Spell out the "sorting rules"

Tidying succeeds or fails on how clear the rules are; with vague rules it can only guess.

> Plain-language request: *"Sort like this: file names containing 'meeting' go into a 'Meeting notes' folder; ones containing 'reimbursement' or 'invoice' go into 'Finance'; everything else goes into 'Other.' Only move files; don't change their contents."*

What to confirm: think through the gray areas for it. A file name with both "meeting" and "invoice": which folder? Does a file with none of the keywords go to "Other"? Decide and tell it. Keep the "only move, don't change contents" line too: spelling out what it may and may not touch is the habit this chapter most wants you to build.

### Step 2: Try a small batch first, see if it understood

Never skip this step. Once the rules are stated, have it demonstrate on just two or three files.

> Plain-language request: *"Don't do all of them yet. Pick 3 files and tell me which folder you'd put each one in under these rules, and why. Don't actually move them; just tell me."*

What to confirm: if its calls match what you meant, move on; if not, fill in the rules right there and have it explain again. Correcting it now costs almost nothing. Skip this step, and if it sorts dozens of files under a misunderstood rule, you're left cleaning up dozens of files.

### Step 3: Once it's right, do the full set

> Plain-language request: *"Those calls are all right. Now sort the whole folder by these rules."*

What to confirm:

- Spot-check a few folders: everything that belongs is there and nothing that doesn't has slipped in; the total number of files is the same as before.
- If you're using Git, have it tell you "which files it moved this time and where to," and look it over (the diff, Chapter 25). The point is that what it touched matches what you expected; it's fine if the technical details are beyond you.
- If the whole batch is wrong, don't keep fixing on top of the mistake; go back with the backup or Git and redo it.

### Step 4: Going further: summarizing and converting

Sorting is only the start; "AI plus files" saves the most effort in summarizing and converting.

> Plain-language request (summarize): *"From each file in the 'Meeting notes' folder, pull out the title, the date, and the single most important conclusion, put them into one table, and save it as a new file, `meeting-summary.csv`. Don't touch the original files."*

> Plain-language request (convert): *"Convert the text notes in this folder into one consistent format, put the results in a new 'Converted' folder, and leave the original files as they are."*

A CSV file is a table stored as text with commas between the columns; Excel, WPS, and Numbers can all open it. If Excel shows garbled characters for non-English text, ask it to save the file again as "UTF-8 with BOM."

What to confirm: pick two or three rows and check them against the original files: did it copy a title, date, or conclusion wrong, or make one up (Chapter 9)? The mistake summaries are most prone to is a quietly changed number or an invented conclusion. Both requests send the results to a new file or folder: when it produces something new instead of overwriting the old, the originals stay safe.

### Done when

The project is done when all of these are true:

- The backup of the originals sits outside the working folder, untouched.
- The working folder is sorted by your rules, the files you spot-checked are all in the right place, and the total number of files hasn't changed.
- There's a new `meeting-summary.csv` that opens in a spreadsheet program, and the rows you checked match the originals.
- The original files' contents are unchanged; Git shows only moved files and newly created ones.

## 3. Common pitfalls

- Skipping "try a small batch first" and processing everything at once. If its reading of the rules is even slightly off, the full run produces mistakes in bulk.
- Starting without a backup. It's working on real files; a mistaken delete or change with no backup can't be recovered.
- Vague rules. "Tidy up the messy files": what counts as messy, and tidy into what? It can only guess. The more specific the rules (which word goes where, what to do in gray areas), the more accurately it works.
- Letting it overwrite in place. If converting or summarizing changes the original files directly, one mistake ruins them. Have the results go to a new file or folder.
- Taking the summary at face value. It may copy wrong, leave things out, or even make things up; check at least a few rows against the originals.
- Handing over files with private information wholesale. ID numbers, passwords, client details: before handing them over, think about what can go and what should be removed first (Chapter 37).

## 4. Taking it one step further

All of these follow the same routine: state the rules → try a small batch → check.

- Consistent names: *"Rename these files in a 'date_topic' format. Show me 3 as a demo first."*
- A table of contents: *"Make a contents file for the whole folder listing each file's title and a one-sentence summary."*
- Finding duplicates: *"Find files whose contents are nearly identical and list them for me. Don't delete anything; I'll decide."* For anything that deletes or overwrites, have it list first, stop, and wait for your go-ahead (Chapter 26).
- Writing the rules down: have it write these sorting rules into a short instructions file, so new files can be handled the same way next time.

## Summary

- This project is a taste of "AI plus files" automation: sort, convert, and summarize scattered files in bulk, ending with an organized folder and a summary table.
- The first rule: back up the originals before any batch processing and keep the backup outside the working folder; add Git, and use both layers.
- The rhythm is back up → try two or three files → check → process everything; "try a small batch first" is the step you must not skip.
- Make the rules specific, send results to new files and leave the originals alone, and spot-check the summary table against the source.
- For operations you can't undo, such as deleting or overwriting, have it list first and decide yourself (Chapter 26); think before handing over files with private information (Chapter 37).

In the next chapter, we start from a messy meeting transcript and turn it into clearly structured meeting notes.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** What is the "number one red line" this chapter repeatedly stresses? <!-- quiz: q01 revision: 2 -->
   - A. Give it only text files, never images or spreadsheets
   - B. Before batch processing, make a full backup of the originals
   - C. Put the working folder under Git, and you can skip the backup
   - D. Before starting, have it read every file in full once
   > **Answer: B.** Unlike building a website, in this chapter it's acting on your **real files**. A mistaken delete, a mistaken change, a batch-mangle with no backup, and they're truly gone. A backup is the seatbelt you have to buckle before any batch operation. C is a common misunderstanding: the chapter says to do both, a backup and Git; Git can only take you back to what was committed, while a manual backup also protects files Git never recorded. A and D aren't the red line at all; reading everything or sticking to text won't stop a batch of mistakes.

2. **[Advanced · Scenario]** After you tell it the sorting rules, **what should you do first** before turning it loose on the whole batch of files? <!-- quiz: q02 revision: 2 -->
   - A. Run the full set now and spot-check a few once it's done
   - B. Write the rules in more detail, then let it do the whole batch
   - C. Have it copy every file it will touch before it starts
   - D. Have it demo on three files, and scale up if it judges right
   > **Answer: D.** "Try a small batch first" is the soul of this chapter. Use the cost of three files to verify whether it understood the rules right; if it's off, fill them in right there at next to no cost. A checks only after the fact, so a mistake means a mess of dozens of files; B, writing more detailed rules, is good, but however detailed they are, you still need to verify it really understood; C, an extra copy, does no harm, but it can't tell you whether the rules were understood correctly.

3. **[Basic · Misconception]** "I'll just have it overwrite the originals directly with the conversion results, to save having more files." What's the risk of this? <!-- quiz: q03 revision: 2 -->
   - A. One mistake ruins the originals; save results to a new folder
   - B. No risk, as long as you saved a Git checkpoint beforehand
   - C. Overwriting changes the file names, so they're hard to find later
   - D. Overwriting is slower than saving anew, which adds up in bulk
   > **Answer: A.** Have it produce **something new** rather than overwrite the old, and the originals are always safe. "Save to a new file, originals untouched" is the good habit running through this chapter. B is only half right: Git can restore only files it recorded in a commit, and anything uncommitted or untracked can't be saved that way; C and D, file names and speed, aren't the issue here.

4. **[Advanced · Scenario]** It's finished a "meeting key-points summary table." Before you send this table to a colleague, what's the most important step? <!-- quiz: q04 revision: 2 -->
   - A. Have it self-check once more for invented content, then send
   - B. If the format is neat and every field is filled, send it
   - C. Pick a few rows; check dates and conclusions at the source
   - D. Have it regenerate once; if both runs match, treat it as right
   > **Answer: C.** When it pulls information, it may copy wrong, miss something, or even invent (Chapter 9). The mistake summarizing is most prone to is quietly changing a number or inventing a conclusion, so spot-check at least a few rows back against the originals. A's self-check is still the AI vouching for itself, not you checking the source; B, a neat format, doesn't mean the content is right; D, two matching runs, can be wrong both times.

5. **[Advanced · Scenario]** You ask it to "find files with duplicate content." For the next step, how do you want it to act for the most safety? <!-- quiz: q05 revision: 2 -->
   - A. Have it merge the duplicates into one file, so no deleting is needed
   - B. Have it list them first, delete nothing, and let you decide
   - C. Have it delete the duplicates outright, since you have a backup
   - D. Have it move the duplicates to the trash, since that's reversible
   > **Answer: B.** For any irreversible operation that "deletes" or "overwrites," have it list first, stop, and wait for your sign-off (echoing the "permission mechanism" in Chapter 26). C and D use "it can be recovered" as a reason to skip your judgment: a backup or the trash is for cleaning up after an accident, not permission for it to delete on its own; A's merge is really an overwrite, so you should look first too.

6. **[Basic · Hands-on]** Before letting an AI tidy one of your real folders, first **manually copy the whole folder as is**, rename it "originals_backup_do_not_touch," and put it somewhere else. After you're done, answer: if it later makes a mess of the working folder, what do you rely on to get things back? <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** You rely on this manual backup, the plainest lifesaving move that even people who don't know Git can use. Add to it putting the working folder under Git (so you can see clearly what it changed and go back to a committed version), and that's "two layers of insurance." Batch operations deal with real files, so layer both together and you'll be at ease. How to use Git is covered in Chapters 25 and 26.
