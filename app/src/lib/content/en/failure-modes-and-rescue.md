The last few chapters covered how to get a coding agent working smoothly: the general workflow (Chapter 24), and hands-on use of Claude Code and Codex (Chapters 28 and 29). But however skilled you get, things will still go wrong: it makes mistakes, drifts off course, and confidently does the wrong thing. This chapter doesn't teach you how to never go wrong. It teaches two more practical things: recognizing the eight most common mistakes and knowing their causes and fixes, and, when you're truly stuck or things have turned into a mess, a first-aid checklist that gets you back to a clean state. None of this depends on which tool you use.

## 1. The eight common mistakes: symptom → cause → fix

Each one below is a problem beginners run into again and again. Try matching yourself against them.

### 1. The task is too vague, so it drops things

You say "help me optimize this page," and what comes back is nothing like what you wanted, or is only half done. When the instruction is too broad, it can only guess, and it often guesses wrong (Chapter 11). Make the goal specific: what you want to achieve, which part to touch, and what counts as "done." Before it starts, have it restate its understanding.

### 2. Too big a change at once, no way to check it

You ask it to "finish the whole feature," it changes a dozen or more files, the diff fills the screen and you can't take it all in, and when something breaks you don't know where to start looking. The bigger the change, the bigger the blind spot. Break the task into small pieces: do one small piece, sign it off, commit, then do the next (Chapter 27).

### 3. Not looking at the diff, clicking "approve" away

Every time it asks for permission, you click approve without looking, and later find it touched files it shouldn't have, or even deleted something important. Treating confirmation as a routine formality is like removing the brakes (Chapter 26). Before you approve, look at what it's about to do and what it changed. If you can't follow it, ask "What is this step for?" and let it through only once you understand (Chapter 25).

### 4. Chatting through one conversation from start to finish, never switching

You've gone dozens of turns in the same conversation, and it listens less and less: it ignores your new requests, brings back ideas you already rejected, and contradicts itself. This is the context problem from Chapters 3 and 13: the longer the conversation, the more noise there is, and the important points get buried. Use one conversation per topic. When it stops listening, open a new conversation and restate the information it still needs.

### 5. Trusting hallucinations, not double-checking

It confidently uses a way of writing code that doesn't exist, or cites a source for something that turns out not to be true, and you take it at face value. What it aims for is "sounds true," not "is true" (Chapter 9), and sounding fluent doesn't make it any more reliable. The more important something is, the more it needs checking: have it give its sources, run the tests, and look up key facts again yourself.

### 6. Stubbornly fixing a failing approach, making it worse with each change

A direction clearly isn't working, but you keep having it fix the original plan one instruction at a time, and things only get messier. The failed attempts have already filled the context, and it's being carried along by its own earlier mistakes (Chapter 13). Admit this road is a dead end: roll back to the last clean state, open a new conversation, and give it the problem you just ran into as a starting premise.

### 7. Merging without signing off

It says it's done, you merge and ship right away, and a couple of days later you find that a feature that used to work is broken. That's mistaking "it says it's done" for "it did it right." Sign it off as described in Chapter 25: have it explain what it changed, follow the steps you wrote in advance yourself, and run the related tests. If you can't answer the three sign-off questions, don't merge.

### 8. Pasting in keys or sensitive information

To save effort, you paste an API key, a password, or real personal information into the conversation, or write it into code and push it to a public repository. Anything you paste in has effectively been handed over (Chapter 37), and if a key ends up in someone else's hands, they can spend your money (Chapter 35). If one does get out, go to that platform right away, revoke the old key, and create a new one. Don't count on luck.

> **Key point:** The eight really break only three principles: not saying things clearly (1, 2), not holding the two gates before and after it acts (3, 5, 7), and not managing context and data well (4, 6, 8). Remembering these three is more useful than memorizing all eight.

## 2. What to do when you're stuck: the five-step first-aid checklist

The section above was about prevention; this one is about rescue. When it has already drifted, you've lost track of what's going on, and things are a mess, don't keep struggling inside the mess. Go through these five steps:

```text
Stuck or made a mess? Go in order:

① Interrupt first                    (stop it right away)
   ↓
② State the situation                (take stock before you act)
   ↓
③ Roll back to the last good state   (get back to a clean place)
   ↓
④ Start a new conversation           (swap in a clean desk)
   ↓
⑤ Diagnose                           (work out why it drifted)
```

1. Interrupt first. When something feels wrong, your first move is to stop it, not to watch it keep heading the wrong way. As of October 2026, both Claude Code and Codex let you press Esc to interrupt what they're doing. The sooner you stop it, the less you lose; and once it has stopped, don't go on clicking approve in a panic.

2. State the situation. Take stock first: What has it changed so far? Which of those changes did you want, and which came from it drifting? Where is the last clean, working state? `git status` and `git diff` list the files that changed (Chapter 26). If you roll back without taking stock, it's easy to go back too far or not far enough.

3. Roll back to the last good state. This is the heart of first aid. If you saved a starting point with Git and created a new branch at the start, you can now take this task's changes back to that clean state; the exact commands are in "Git: the bare minimum to get started" in Chapter 26. Claude Code's `/rewind` can also restore the files it changed itself (Chapter 28). This moment is why earlier chapters kept saying "save a starting point before you start." Rolling back can't undo outside effects, such as emails already sent or cloud data already deleted.

4. Start a new conversation. Once you're back at a clean state, don't continue in the conversation that got messy. Open a new one, tell it "that approach didn't work, and here's the problem it ran into" as a premise, and have it plan again with that lesson in mind. The old conversation is piled with failed attempts, and if you keep going on top of them, it will just drift again.

5. Diagnose. Finally, take a minute to look back: what was the root cause this time? Was the task too vague (mistake 1)? Did you have it change too much at once (mistake 2)? Or did you keep forcing fixes when you should have rolled back (mistake 6)? Once you find the cause, you can stop it at the source next time, for example by having it produce a plan first (Chapter 27), or by breaking the task smaller.

The most common beginner error isn't things going wrong; it's refusing to roll back once they have. You keep thinking "one more tweak and it'll be fine," and half an hour later you're worse off than when you started. Experienced users do the opposite: the moment the direction feels wrong, they'd rather roll back and start over than keep patching a mess.

## 3. Common misconceptions

| Misconception | Reality |
| --- | --- |
| If I'm skilled enough, nothing will go wrong | It makes mistakes and can act, so things going wrong is normal; what matters is knowing how to recover |
| When it drifts, keep chasing it with corrections | Roll back and start over in a new conversation; forcing fixes in a messy context often makes things worse (mistake 6) |
| Permission prompts are a hassle, so just keep clicking approve | That's like removing the brakes; before approving, look at what it's about to do (mistake 3, Chapter 26) |
| If it says it's done, it did it right | Don't merge anything you haven't signed off (mistake 7, Chapter 25) |
| Rolling back means failure, admitting defeat | Rolling back is your biggest safety net, and often the fastest way back on track |
| Pasting a key once should be fine | Pasting it in means handing it over; revoke it and replace it right away (mistake 8, Chapter 37) |

## Summary

- A coding agent will go wrong at some point, because it makes mistakes and can also act. The goal isn't never going wrong; it's recognizing problems and getting back from them.
- The eight common mistakes: a vague task, too big a change at once, clicking approve without reading the diff, never switching conversations, trusting hallucinations, forcing fixes on a failing approach, merging without signing off, and pasting in keys. They break only three principles: not saying things clearly, not holding the two gates, and not managing context and data well.
- Five-step first aid: interrupt first, state the situation, roll back to the last good state, start over in a new conversation, and diagnose. The heart of it is rolling back, which is exactly why you save a starting point and create a branch before you start.
- The biggest mistake is refusing to roll back once things go wrong. The exact rollback commands are in Chapter 26.

That brings Part 4 to a close: you now have the general workflow, a way to get started with both tools, and first aid for when things go wrong. The next part is where you start building real projects.

## Sources and version notes

Interrupting with Esc was checked on 2026-10-29: the [Claude Code costs documentation](https://code.claude.com/docs/en/costs) says pressing Escape stops it immediately, and in the [Codex terminal interface source code](https://github.com/openai/codex/blob/main/codex-rs/tui/src/status_indicator_widget.rs), the default interrupt key is Esc and "esc to interrupt" is shown while it runs.

---

## Quiz

> Six questions, covering four types: concept, misconception, scenario, and hands-on. Think for yourself first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's this chapter's basic attitude toward things going wrong? <!-- quiz: q01 revision: 3 -->
   - A. Most mistakes come from badly written prompts; write them well to avoid them
   - B. Crashes are the norm; the goal is to recognize them and rescue yourself
   - C. A mistake means the tool is no good, and you should switch to another one
   - D. Once you're experienced enough, things will hardly ever go wrong anymore
   > **Answer: B.** Things go wrong because of a coding agent's nature of "will make mistakes + will act" (Chapters 23 and 24). Better prompts reduce some of them (A), but neither switching tools (C) nor experience (D) makes them go away. The mature way to use it is **knowing how to rescue**: recognizing the eight common mistakes and using the five-step first aid.

2. **[Basic · Concept]** What's the correct order of the five-step first-aid checklist? <!-- quiz: q02 revision: 2 -->
   - A. Roll back → interrupt → new conversation → state the situation → diagnose
   - B. Interrupt → new conversation → roll back → diagnose → state the situation
   - C. Interrupt → state the situation → roll back → new conversation → diagnose
   - D. State the situation → diagnose → interrupt → roll back → new conversation
   > **Answer: C.** The order matters: **stop the loss first (interrupt), then take stock (state the situation), get back to a clean place (roll back), swap in a clean desk (new conversation), and finally think through why (diagnose).** Without interrupting first (A, D), it keeps changing things while you take stock; skip taking stock and roll back directly (B) and you easily retreat to the wrong spot.

3. **[Advanced · Misconception]** "It went off course, I'll just cling to it and correct the original plan line by line." Why does this often get worse the more you correct? <!-- quiz: q03 revision: 3 -->
   - A. It grows more careful with each correction, so it gets there eventually
   - B. The problem is that it corrects too slowly; a stronger model would fix it
   - C. As long as you explain in more detail each time, you can pull it back
   - D. Failed attempts fill the context, and it's carried along by old mistakes
   > **Answer: D.** This is mistake 6, "stubbornly fixing a failing approach," rooted in the overfilled "desk" from Chapter 13. More detailed explanations (C) or a different model (B) leave the old mistakes sitting in the context. **Getting back to a clean state and starting a new conversation carrying the lesson** is almost always faster than stubbornly fixing in the mess: this is also steps ③ and ④ of the first-aid checklist.

4. **[Advanced · Misconception]** "Rolling back equals failure, equals admitting defeat." Where's the mistake in this thought? <!-- quiz: q04 revision: 3 -->
   - A. There's no mistake; rolling back means everything before was wasted
   - B. Rolling back is a safety net, often the fastest way back on track
   - C. Rolling back deletes the whole project, so it's only a last resort
   - D. Rolling back is for beginners; once skilled, you should fix it in place
   > **Answer: B.** "Save a starting point and check out a Git branch before acting" (Chapter 26) is laying the groundwork for exactly this moment. Rolling back only undoes the changes that went off course; the work you committed earlier is still there (A, C). The most common beginner mistake is precisely **flat refusing to roll back and grinding on inside the mess** (D), ending up worse and worse.

5. **[Basic · Scenario]** You're watching it work and suddenly notice it's about to delete a file you think is very important. What should you do most at this moment? <!-- quiz: q05 revision: 3 -->
   - A. Hold off approving, see what it's trying to do, and ask if it's unclear
   - B. Approve it; you can always get the file back with Git later anyway
   - C. Let it delete first, then read the diff afterward to judge if it was right
   - D. Close the whole tool and start this task over again from the beginning
   > **Answer: A.** This hits both "clicking approve without looking at the diff" (mistake 3) and step ① of first aid, "interrupt first." **See clearly before permission, and if you can't read it don't let it through** (Chapters 25 and 26). B and C assume a deleted file can always be recovered, but a file that was never committed has no copy in Git; closing the tool outright (D) throws away the chance to find out what's going on.

6. **[Basic · Hands-on / Observation]** You don't have to actually install the tool: look back at the eight common mistakes in this chapter and **match yourself against them**: in your past use of AI (even just chatting), which two or three did you run into most? Then copy down the corresponding "fixes" and stick them somewhere you'll see them later. <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** Most people will find they keep making the same one or two (a very common pair is "never switching the conversation" and "trusting hallucinations"). The eight mistakes really only break three principles: **not saying it clearly, not holding the two gates, not managing context / data well**; watching your own high-frequency items and plugging them at the source is more useful than memorizing all eight. For the basic rollback commands, see "Git: the bare minimum to get started" in Chapter 26; for how each tool works, see Chapters 28 and 29 and Appendix C.
