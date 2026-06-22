Everyone's computer has a "junk drawer": a folder stuffed with scattered files. Dozens of meeting notes, a pile of articles you downloaded, notes scattered here and there, file names all over the place, and finding one means digging through everything.

This chapter's project is to clean up that drawer. We'll make a **document and note tool**, which isn't really a fancy piece of software but a way to use a coding agent's help to **batch-tidy, convert, and summarize** a pile of scattered files into the shape you want. For example: sorting dozens of files by content, renaming them consistently, pulling their key points into one master table, batch-converting one format into another.

Why use this to get hands-on? Because it lets you feel firsthand something very plain and also very powerful: **AI plus files equals the most effortless automation**. Repetitive work that used to take you a whole afternoon of doing one at a time, you hand to it, spell out the rules, and it does the whole batch tirelessly. Chapter 14 covered "keeping the AI pushing a task forward," and this chapter is one of the most down-to-earth places it lands.

But this chapter has a **safety red line the other projects don't have**, so let's put it right up front and keep it taut the whole way through.

> **Key point:** **Before you start any batch processing, back up the originals first.** This is the number one iron rule of this chapter, no exceptions. The reason is simple: in the last chapter, building a website, if you broke something a refresh told you and going back fixed it. But in this chapter it's **acting on your real files in bulk**, and once it mistakenly deletes, mistakenly changes, or batch-mangles dozens of files and you have no backup, those are truly gone. **Backing up the originals is the seatbelt you have to buckle before any batch operation.**

## 1. Getting ready: what you need, the minimum starting point

**The minimum starting point you need:**

- **A coding agent**: Claude Code, Codex, or the like. It can read the files in your folder and tidy and rewrite them as you say. It comes in many forms (terminal, IDE, web tasks, cloud, and so on), and **some run locally while others run in the cloud; the exact form varies and keeps changing, so check the official docs** (Chapter 24 covered the general workflow).
- **The folder you want to tidy**: that "junk drawer" of yours.
- **A backup of the originals** (**most important**): before you let it touch anything, **copy the whole folder as is** to somewhere else, for example renaming it "`originals_backup_do_not_touch`." This is your lifesaving copy, and you don't go near it the whole time.
- **A safety net you can fall back on**: besides that manual backup above, **when it's working on your local machine**, it's best to also put the working folder under version control (Git) (Chapter 27) for an extra layer of insurance.

> **Key point:** A backup and "using Git" are **two things, both to be done**, not one or the other. Manually copying the originals is the plainest, least error-prone lifesaving move, one even people who don't know Git can do; Git lets you see clearly "which files it actually changed and how" and roll back anytime. Batch operations are dealing with real files, so **layer both kinds of insurance together and you'll sleep at night**.

**Getting ready mentally**: same as always, treat it like the "capable colleague on their first day" (Chapter 24). When you ask them to tidy dozens of files, they're quick on their feet, but **whether they misread your sorting rules or fumble and delete the wrong file is on you to watch**. So this chapter puts special weight on one thing: **try one or two files first, confirm it understood the rules and got it right, then turn it loose on the whole batch.**

## 2. Doing it step by step

Each step below gives you one **plain-language line to say to the AI** (to stress it again: this is what you say to the AI, **not a command for you to type**), and **what you, the human, need to confirm**. Note the overall rhythm is: **back up, try a small batch first, check that it's right, then run the full set.**

### Step 0: Back up first, then have it "get the lay of the land"

The first thing, always, is to back up.

> Plain-language request: *"I'm about to tidy the files in this folder. Before you start, remind me first: you won't touch my separate 'originals backup,' right? We'll only work in the working folder."*

**What you need to confirm:**
- **Before** it does any tidying, **you manually copy the whole folder** yourself as the originals backup. This step is on you, not on it.
- Then have it **only look, not touch**, to get the lay of the land:

> Plain-language request: *"Don't touch any file yet, just help me see roughly what's in this folder: how many files total, what types they are, whether the file names follow any pattern. Give me a list."*

**What you need to confirm:**
- Look at the list it gives and confirm it **really understands the current state of your pile of files** (is the count right, did it miss any types). This step is "investigate" (the first step of the workflow from Chapters 14 and 24): have it understand first, you check first, and you avoid it charging in and making a mess.

### Step 1: State the "tidying rules" clearly

With tidying, success or failure rests entirely on "are the rules stated clearly." Vague rules leave it only able to guess.

> Plain-language request: *"I want to sort like this: files with the word 'meeting' in the name go to the 'meeting notes' folder; ones with 'reimbursement' or 'invoice' go to the 'finance' folder; the rest go to 'other.' When sorting, **just move files, don't change file contents**."*

**What you need to confirm:**
- Think ahead for it about the **gray areas** in the rules: what if a file name has both "meeting" and "invoice"? Does one with no keyword at all count as "other"? **Think it through and tell it**; don't leave it to guess.
- Pay special attention to that line "**just move, don't change contents**." Nailing down "what it can and can't touch" is the habit this chapter most wants you to build.

### Step 2: Try a small batch first, see whether it understood

**This step is the soul of this chapter; whatever you do, don't skip it.** Once you've stated the rules, **don't turn it loose on the whole batch yet**; have it **handle only two or three files as a demo**.

> Plain-language request: *"Don't touch all of them yet. Pick 3 files and walk me through how you'd sort them by the rule just now; tell me which folder you plan to put each file in and why. Don't actually move them yet, just talk me through it."*

**What you need to confirm:**
- Look at whether its judgment on these 3 **matches what you meant**. If it matches, it understood the rules and you can move on; if not, **fill in the rules right there** and have it explain again. **Correcting at this point costs next to nothing.**
- Picture the counterexample: if you skip this step and just let it run dozens of files, by the time it sorts everything wrong by a "misunderstood rule" and you find out, that's a mess of dozens of files. **Trying a small batch first uses the cost of three files to head off a disaster across dozens.**

### Step 3: Confirm it's right, then run the full set

Only after the small batch passes do you let it handle the whole batch.

> Plain-language request: *"The judgments are all right. Now, by this rule, sort all the files in the whole folder."*

**What you need to confirm:**
- After it's done, **spot-check a few**: open a few folders at random and see whether the files that should be there are there and nothing that shouldn't be has crept in.
- If you're using Git, you can have it **say "which files were touched this time and where they moved"** and glance at it for comparison (the diff, Chapter 25). It's fine if you can't read the technical details; the point is to confirm "the scope of what was touched matches what you expected."
- **If you find the whole batch is wrong**: don't panic, and don't keep changing on top of the wrong state. This is exactly what that backup from the start is for; **go back and run it again.**

### Step 4: Going further: summarizing and converting

Sorting is just the appetizer. Where "AI plus files" really saves effort is in **summarizing** and **converting**.

> Plain-language request (summarizing): *"From the 'meeting notes' folder, pull out each file's title, date, and single most important conclusion, gather them into one table, and save it as a new file. **Leave the original files alone.**"*

> Plain-language request (converting): *"Convert the text notes in this folder all to the same format, and put the results in a new 'converted' folder, **keeping the original files untouched.**"*

**What you need to confirm:**
- Once the summary table is done, **pick two or three rows and check them back against the original files**: are the title, date, and conclusion it pulled out real, did it copy something wrong or invent it (it will "fill in the blanks," Chapter 9). **The mistake summarizing is most prone to is quietly changing a number or inventing a conclusion**, so a spot-check is a must.
- Notice that both lines above stress "**results go to a new file or new folder, originals untouched.**" This is a good habit: **have it produce something new rather than overwrite the old**, so the originals are always safe.

## 3. Common pitfalls

- **Skipping "try a small batch first" and running the full set directly.** This is the deadliest pitfall of this chapter. If it understands the rules even a little wrong, running the full set produces mistakes in bulk. **Always try two or three first, confirm it's right, then scale up.**
- **Starting without a backup.** Saying the opening red line again: it's acting on your **real files**, and a mistaken delete or change with no backup can't be recovered. **A backup is the seatbelt to buckle before you start, no exceptions.**
- **Giving rules that are too vague.** "Just tidy up the messy files," but what counts as messy and what to tidy it into, it can only guess, and you can't blame it for guessing wrong. **The more specific the rules (what word goes where, what to do in gray areas), the more accurately it works.**
- **Having it "overwrite in place" instead of "save to a new file."** If you have it change the originals directly when converting or summarizing, one mistake destroys the originals. **Try to land the results in a new file or new folder** and keep the originals.
- **Accepting the summary as is without checking.** When it pulls information, it may copy wrong, miss something, or even invent. **Spot-check at least a few rows of the summary table back against the originals**, and don't use its "filled-in" content as if it were real data.
- **Dumping files with private information on it all at once.** If a file has things like an ID number, a password, or customer privacy in it, **those get sent out** (Chapter 37). Before processing sensitive files, think clearly about what can be handed over and what has to be scrubbed first or simply not handed over.

## 4. Taking it one step further

Once tidying, summarizing, and converting run smoothly, you can try more "automated" plays (all still the same old routine of "state the rules clearly, try a small batch first, check"):

- **Rename consistently**: *"Rename these files consistently in a 'date_topic' format; show me a demo with 3 first."*
- **Batch-extract key points into a directory**: *"Generate a directory file for this whole folder, listing each file's title and a one-line summary."*
- **Find duplicates and outdated files**: *"Help me find files that are almost duplicates in content, give me a list, **don't delete yet**, let me decide myself."* (Anything involving "deleting," all the more reason to have it list first and let you call the shots, never letting it delete automatically.)
- **Turn this set of rules into a small repeatable process for the future**: you can have it write the tidying logic into a set of instructions, to follow next time new files come in. Whether to make it into a more formal automation, take it as far as you can manage, and **the specifics of how to implement it are subject to the official docs**.

> **Key point:** "Taking it one step further" has one unchanging safety principle running through it: **for any operation that "deletes" or "overwrites," have it list first, stop, and wait for your nod, never letting it run automatically.** Tidying you can hand off freely, but the decision to "do something irreversible" **stays in your hands always** (this echoes the spirit of the "permission mechanism" in Chapter 26: let it work, but actions with consequences need your approval).

## Summary

- The second project lets you feel "**AI plus files equals the most effortless automation**": **batch-tidy, convert, and summarize** a pile of scattered files into the shape you want.
- **The number one red line: back up the originals before you start any batch processing.** It's acting on real files, and a mistaken delete or change with no backup can't be recovered; a backup is the seatbelt to buckle.
- The core rhythm is **back up, try a small batch first (two or three files to confirm it understood the rules), check that it's right, then run the full set**; the "try a small batch first" step is the soul, so don't skip it.
- **State the rules specifically** (what word goes where, what to do in gray areas), have the results **land in a new file or new folder, originals untouched**; **spot-check the summary table back against the originals** to guard against invention.
- For any irreversible operation like "deleting or overwriting," **have it list first and let you call the shots**, never run it automatically (Chapter 26); think clearly before handing over files with private information (Chapter 37).

In the next chapter, we'll push "having AI help you process text" one step further: turning a messy meeting transcript into a clearly structured **set of meeting notes**.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** What is the "number one red line" this chapter repeatedly stresses?
   - A. You absolutely must know how to code
   - B. Before you start any batch processing, back up the originals first
   - C. You must be online to tidy files
   - D. The more files the better
   > **Answer: B.** Unlike building a website, in this chapter it's acting on your **real files**. A mistaken delete, a mistaken change, a batch-mangle with no backup, and they're truly gone. A backup is the seatbelt you have to buckle before any batch operation, no exceptions.

2. **[Advanced · Scenario]** After you tell it the sorting rules, **what should you do first** before turning it loose on the whole batch of files?
   - A. Just have it sort all dozens of files
   - B. Have it demo with two or three files first, confirm its judgment matches what you meant, then run the full set
   - C. Turn off the computer and wait overnight
   - D. State the rules vaguely again
   > **Answer: B.** "Try a small batch first" is the soul of this chapter. Use the cost of three files to verify whether it understood the rules right; if it's off, fill them in right there at next to no cost. Skipping this step to run the full set is betting it understood on the first try, and if it's wrong, that's a mess of dozens of files.

3. **[Basic · Misconception]** "I'll just have it overwrite the originals directly with the conversion results, to save having more files." What's the risk of this?
   - A. No risk, it's tidier
   - B. Once the conversion goes wrong, the originals are destroyed and can't be recovered; you should land the results in a new file or new folder and keep the originals
   - C. Overwriting is faster
   - D. The original file automatically becomes two copies
   > **Answer: B.** Have it produce **something new** rather than overwrite the old, and the originals are always safe. "Save to a new file, originals untouched" is the good habit running through this chapter.

4. **[Advanced · Scenario]** It's finished a "meeting key-points summary table." Before you send this table to a colleague, what's the most important step?
   - A. Just forward it, what it made must be right
   - B. Spot-check two or three rows back against the original files, checking whether the title, date, and conclusion are real and whether it copied something wrong or invented it
   - C. Delete the table and redo it ten times
   - D. Have it generate nine more identical tables
   > **Answer: B.** When it pulls information, it may copy wrong, miss something, or even invent (Chapter 9). The mistake summarizing is most prone to is quietly changing a number or inventing a conclusion. **Spot-check at least a few rows back against the originals**, and don't use the "filled-in" stuff as real data.

5. **[Advanced · Scenario]** You ask it to "find files with duplicate content." For the next step, how do you want it to act for the most safety?
   - A. Have it auto-delete all duplicates it finds
   - B. Have it list them for you first, **don't delete yet**, and let you decide one by one
   - C. Have it overwrite the duplicates into one
   - D. Don't bother, let it handle them however
   > **Answer: B.** For any irreversible operation that "deletes" or "overwrites," have it list first, stop, and wait for your nod (echoing the "permission mechanism" in Chapter 26). Tidying you can hand off, but the decision to "do something irreversible" stays in your hands always.

6. **[Basic · Hands-on]** Before letting an AI tidy one of your real folders, first **manually copy the whole folder as is**, rename it "originals_backup_do_not_touch," and put it somewhere else. After you're done, answer: if it later makes a mess of the working folder, what do you rely on to get things back?
   > **What you should notice:** You rely on this manual backup, the plainest lifesaving move that even people who don't know Git can use. Add to it putting the working folder under Git (so you can see clearly what it changed and roll back anytime), and that's "two layers of insurance." Batch operations deal with real files, so layer both together and you'll be at ease. How exactly to use the tools is **subject to the official docs** (Chapters 25 and 27).
