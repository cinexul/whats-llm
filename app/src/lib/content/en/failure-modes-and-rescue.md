〔This chapter doesn't depend on any specific tool's commands or interface: it's about what crashes have in common and the universal moves for first aid. Where it touches how a particular tool operates, always **refer to the official documentation** (see Appendix C).〕

The last several chapters walked through "how to get a coding agent working smoothly" in full: the general workflow (Chapter 24), Claude Code put to work (Chapter 28), Codex put to work (Chapter 29). But there's one thing we have to be honest about: **no matter how skilled you are, a crash will happen.** It will make mistakes, go off course, and charge ahead with confidence — as Chapter 24 said, this follows from a coding agent's nature of "will make mistakes + will act."

So this chapter doesn't teach you how to "avoid all crashes" (that's not realistic); it teaches two more practical things: **one, recognize the eight most common "crash scenes," know where the root cause is and how to treat it; two, when you really are stuck or have made a mess, have a "first-aid checklist" that gets you back to a clean state.** This chapter is tool-agnostic; it works for both Claude Code and Codex.

## 1. The eight crash scenes: symptom → cause → fix

Every one below is a trap beginners step into over and over. We suggest you **match yourself against them**: chances are you've already hit a few.

### 1. The task is too vague, so it drops things

- **Symptom**: You say "help me optimize this page," and what it changes is nothing like what you wanted, or only half done.
- **Cause**: The instruction is too broad, so it can only **guess** what you want, and it often guesses wrong (echoing "say clearly what you want" from Chapter 11).
- **Fix**: Say the goal **specifically**: what to achieve, which part to touch, what counts as "done." Have it **restate its understanding** before it acts; far cheaper than reworking afterward.

### 2. Too big a change at once, no way to check it

- **Symptom**: You have it "finish the whole feature," it changes a dozen-plus files, you stare at a screenful of diff baffled, and when something breaks you don't know where to look.
- **Cause**: The bigger the change, the **bigger the blind spot**; big enough that you can't check it line by line, and it's hard to roll back (stressed over and over in Chapter 24).
- **Fix**: **Break the task small**: do a little, check a little, commit once, then do the next bit. Small steps at a slow jog turn out to be the fastest (Chapters 27 and 29).

### 3. Not looking at the diff, clicking "approve" away

- **Symptom**: Every time it requests permission you click "approve" in an instant, then find it touched files it shouldn't have, or even deleted something important.
- **Cause**: Treating "permission confirmation" as a hassle, as routine — **like ripping out the brakes** (Chapter 26).
- **Fix**: **Before permission, look at what it's about to do and what it changed (the diff).** This step takes a few seconds and blocks what could be a few hours of disaster. If you can't follow it, ask "what is this step doing" first; **if you can't read it, don't let it through** (Chapter 25).

### 4. Chatting through one conversation from start to finish, never switching

- **Symptom**: You've chatted dozens of turns in the same conversation, and it gets more and more "stubborn": ignoring your new requests, rehashing scrapped ideas that were already rejected, contradicting itself.
- **Cause**: This is exactly that "desk" from Chapters 3 and 13: the longer the conversation, the more **noise drowns out signal**, the important parts get buried, and contradictions pile up. It didn't get dumber — the desk just got stuffed full.
- **Fix**: **One topic per conversation**; when you feel it starting to get "stubborn," decisively **start a new conversation** and restate "the information still needed" clearly (Chapter 13). Swapping in a clean desk is far faster than digging through a messy one.

### 5. Trusting hallucinations, not double-checking

- **Symptom**: It confidently uses a way of writing that doesn't exist at all, or cites a basis for something that turns out not to be the case; you take it all at face value, and it ends up wrong.
- **Cause**: What it's after is "sounding true," not "being true" (the "hallucination" of Chapter 9). **The smoother and more confident it sounds, the less that means it's reliable.**
- **Fix**: **The more important it is, and the more readily it reels off an answer, the more you verify it yourself.** Have it give a basis, run tests to confirm, and check key facts again yourself (Chapter 9).

### 6. Stubbornly fixing a failing approach, getting more off course with each change

- **Symptom**: A direction has clearly hit a dead end, and you keep clinging to it, having it fix the original plan one line at a time, and it gets messier and more roundabout.
- **Cause**: The wrong context has already filled the "desk," and it's being **carried along** by its own earlier mistakes (Chapter 13). Stubbornly fixing in a messy context is often negative work.
- **Fix**: **Admit this road doesn't go through, roll back + start over.** Go back to the last clean state, start a new conversation, and restate "the trap we just stepped in" as a premise (Chapters 13 and 24). This is almost always faster than stubbornly fixing.

### 7. Making a big change with no tests

- **Symptom**: It finishes and you merge and ship directly, only to find a couple of days later that it broke a feature that was working fine.
- **Cause**: Treating "it says it's done" as "it did it right": **no verification, no certainty** (Chapters 24 and 27).
- **Fix**: When it's done, **have it run the tests**, confirm it didn't break the existing features; and try saying clearly in one sentence what this stretch is doing yourself. **If you can't say it clearly and haven't tested it, don't merge** (Chapter 25).

### 8. Pasting in keys / sensitive information

- **Symptom**: To save effort you paste an API key, a password, or real personal information into the conversation, or write it into code and push it to a public repository.
- **Cause**: Forgetting that iron rule: **what you paste in is as good as handed over** (Chapter 3); a key is the "key to your wallet," and whoever gets it can spend your money (Chapter 29).
- **Fix**: **Keys / passwords / sensitive information never go in the chat box, never in a public repository** (Chapter 37). If you do paste one out, **go to the platform right away to revoke the old key and issue a new one** (**refer to its official documentation for the exact steps**), and don't count on luck.

> **Key point:** String these eight together and you'll see they really only break **three principles**: (1) not saying things clearly (1, 2), (2) not holding the "two gates before and after acting" (3, 5, 7), (3) not managing context / data well (4, 6, 8). Remembering these three is more useful than memorizing eight scenes: they're exactly the flip side of the workflow from Chapter 24 and the safety discipline of the whole book.

## 2. What to do when you're stuck: the five-step first-aid checklist

The section above is "prevention"; this one is "rescue." When it's already gone off course, you're at a total loss, and things are a mess, **don't panic, and don't keep wrestling inside the mess.** Follow the five steps below and you can almost always get yourself back.

```text
Stuck / made a mess, go in order:
① Interrupt first ──→ ② State the situation ──→ ③ Roll back to the last good state ──→ ④ Start a new conversation ──→ ⑤ Diagnose
(halt right away)    (don't rush to let it keep changing)  (get back to a clean place)         (swap in a clean desk)      (think through why it went off)
```

**① Interrupt first: halt right away**
When something feels off, **your first reaction is to cut it off**, not watch it keep running into the trap. "Being able to halt anytime" is a basic right of yours (Chapter 26); the sooner you stop, the smaller the loss. Stop, take a breath, and don't keep clicking "approve" in a panic.

**② State the situation: take stock first, don't rush to let it keep changing**
After stopping, ask yourself three things first: **What has it changed so far? Which of those did I want, and which came from it going off course? Where is my last "clean, working" state?** Take stock of the situation clearly and you'll know where to retreat to. This step lays the groundwork for "rolling back" later; roll back without taking stock and you easily retreat too far or not far enough.

**③ Roll back to the last good state: this is what checking out a branch earlier was for**
This is the core act of first aid. If you **listened to the last few chapters** and were managing with **Git** from the start with a **new branch** checked out (Chapter 26), then right now you can **get back to that clean state in one move** and wipe out everything it produced while off course.

> **Key point:** Chapters 27, 28, and 29 harp on "check out a Git branch before acting" **precisely for this moment in step ③**. Rolling back isn't failure — it's your **biggest safety net**. That "environment you can undo" is exactly this ability made real. (Web / cloud forms usually have the platform's own rollback / versioning; **refer to its official documentation**.) For the exact rollback commands, **see Appendix C and the official docs**; this chapter only covers the act of "getting back to the last good state" itself.

**④ Start a new conversation: swap in a clean desk**
After getting back to a clean state, **don't keep going in that conversation that's already a mess.** Start a **new conversation**, tell it "the road we just took doesn't go through, and here's the trap we stepped in" as a **premise**, and let it plan again carrying that lesson. Why start a new one? Because the old conversation's "desk" is piled with failed attempts (Chapter 13); keep going on it and it'll still be carried along by the old mistakes.

**⑤ Diagnose: think through "why it went off," don't trip over the same thing again**
Last, spend a minute reviewing: where's the root of this going-off-course? Was the **task said too vaguely** (back to scene 1 in section one)? **Had it change too much at once** (scene 2)? Or **should you have rolled back early but stubbornly fixed instead** (scene 6)? Find the root cause, and when you start over **plug it at the source**: for example, have it produce a plan you review first this time (Chapter 27), or break the task even smaller.

> **How you'll actually run into this:** The most common beginner mistake isn't "the crash" itself, it's **flat refusing to roll back after the crash**: always feeling "one more tweak and it'll be fine," and ending up sinking deeper into the mess, worse off half an hour later than at the start. **The veteran's instinct is exactly the opposite: the moment the direction feels wrong, they'd rather roll back and start over than patch a wreck.** Rolling back + starting a new conversation is often the fastest road, not admitting defeat.

## 3. The whole thing in one line

Boil this chapter down to one line you can carry around:

> **For prevention, hold the workflow from Chapter 24 (say it clearly, break it small, look at the diff, run the tests); for rescue, remember "interrupt → take stock → roll back → start over → diagnose."** A crash isn't scary; what's scary is gritting it out inside the mess. Your biggest backing is that "environment you can undo," so the step of "check out a branch before acting," never skip it.

## 4. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| If I'm skilled enough I can avoid crashes | It "will make mistakes + will act," so crashes are the norm; the key isn't avoiding crashes, it's knowing how to rescue (Chapter 24) |
| When it goes off course, keep chasing it with fixes | You should roll back + start a new conversation; stubbornly fixing in a messy context often gets worse (scene 6, Chapter 13) |
| Permission confirmation is a hassle, clicking approve away is fine | That's ripping out the brakes; look at the diff before permission, and if you can't read it don't let it through (scene 3, Chapters 26 and 27) |
| If it says it's done, it did it right | If it's untested and you can't say it clearly, don't merge (scene 7, Chapter 25) |
| Rolling back = failure, = admitting defeat | Rolling back is the biggest safety net, the veteran's instinct, often the fastest (steps ② and ③) |
| Pasting a key once should be fine | Pasting it in = handing it over; revoke and reissue right away, don't count on luck (scene 8, Chapter 37) |

## Summary

- A coding agent **will definitely crash** (will make mistakes + will act); the goal isn't "never crash," it's **recognizing the scene and rescuing yourself back**.
- **The eight crash scenes**: vaguely dropping the task, too big a change at once, clicking permission away without looking at the diff, never switching the conversation, trusting hallucinations, stubbornly fixing a failing approach, making a big change with no tests, pasting in a key. They really only break three principles: not saying it clearly, not holding the two gates, not managing context / data well.
- **The five-step first-aid checklist**: ① interrupt first ② state the situation ③ roll back to the last good state ④ start a new conversation ⑤ diagnose. The core is step ③ rolling back: exactly the value that "check out a Git branch before acting" makes real.
- The biggest misconception is **flat refusing to roll back after a crash** and gritting it out in the mess; the veteran's instinct is to **rather roll back and start over** (echoing Chapters 13, 24, and 25).
- For the exact rollback commands and tool steps, **refer to the official documentation** (see Appendix C); the "act" this chapter covers is tool-agnostic and won't go stale.

That brings Part Four, "AI coding in practice," to a close: you now have the general workflow, the getting-started map for the two main tools, and the first-aid skills for when you crash. In the next part, we **actually build a project hands-on**, turning these abilities into results you can see.

---

## Quiz

> Six questions, covering four types: concept, misconception, scenario, and hands-on. Think for yourself first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's this chapter's basic attitude toward "crashing"?
   - A. As long as you're skilled enough, you can never crash
   - B. A coding agent "will make mistakes + will act," so crashes are the norm; the goal isn't to eliminate crashes, it's to recognize them and rescue yourself
   - C. A crash means this tool is no good and you should switch
   - D. Crashes are all because the user is too dumb
   > **Answer: B.** Chapter 24 already covered it: crashes come from a coding agent's nature of "will make mistakes + will act." The mature way to use it is **knowing how to rescue**: recognizing the eight scenes and using the five-step first aid, not fantasizing about never erring.

2. **[Basic · Concept]** What's the correct order of the five-step first-aid checklist?
   - A. Let it keep changing first → then see
   - B. Interrupt first → state the situation → roll back to the last good state → start a new conversation → diagnose
   - C. Delete the project first → reinstall the tool
   - D. Start a new conversation first → then see whether to interrupt
   > **Answer: B.** The order matters: **stop the loss first (interrupt), then take stock (state the situation), get back to a clean place (roll back), swap in a clean desk (new conversation), and finally think through why (diagnose).** Skip taking stock and roll back directly and you easily retreat to the wrong spot; not interrupting and continuing makes you sink deeper.

3. **[Advanced · Misconception]** "It went off course, I'll just cling to it and correct the original plan line by line." Why does this often get worse the more you correct?
   - A. No problem, a few more corrections and it's fine
   - B. The failed attempts have already filled the "desk" of context, and it's being carried along by its own earlier mistakes; what you should do is roll back + start a new conversation
   - C. It speeds up while correcting
   - D. Correcting costs no tokens
   > **Answer: B.** This is the eighth scene "stubbornly fixing a failing approach," rooted in that stuffed-full "desk" from Chapter 13. **Getting back to a clean state and starting a new conversation carrying the lesson** is almost always faster than stubbornly fixing in the mess: this is also steps ③ and ④ of the first-aid checklist.

4. **[Advanced · Misconception]** "Rolling back equals failure, equals admitting defeat." Where's the mistake in this thought?
   - A. No mistake, rolling back is embarrassing
   - B. Rolling back is your **biggest safety net**, the veteran's instinct after a crash; it's often the fastest road back on track, not admitting defeat
   - C. Rolling back deletes the whole project
   - D. Only the paid version can roll back
   > **Answer: B.** "Check out a Git branch before acting" (Chapter 26) is laying the groundwork for exactly this moment. The most common beginner mistake is precisely **flat refusing to roll back and gritting it out on a wreck**, ending up worse and worse. Training "rather roll back and start over" into an instinct is the most valuable line in this chapter.

5. **[Basic · Scenario]** You're watching it work and suddenly notice it's about to delete a file you think is very important. What should you do most at this moment?
   - A. It's an AI anyway, it probably has a reason, so click "approve"
   - B. Immediately **interrupt / not approve** this operation, see clearly what it actually wants to do, and if you can't tell, ask "what is this step doing" first
   - C. Turn off the computer
   - D. Redo the whole project
   > **Answer: B.** This hits both "clicking approve without looking at the diff" (scene 3) and step ① of first aid, "interrupt first." **See clearly before permission, and if you can't read it don't let it through** (Chapters 26 and 27): "being able to halt anytime" is a basic right of yours, and the sooner you stop the smaller the loss.

6. **[Basic · Hands-on / Observation]** You don't have to actually install the tool: look back at the eight crash scenes in this chapter and **match yourself against them**: in your past use of AI (even just chatting), which two or three did you step into most? Then copy down the corresponding "fixes" and stick them somewhere you'll see them later.
   > **What you should notice:** Most people will find they keep tripping over the same one or two (a very common pair is "never switching the conversation" and "trusting hallucinations"). The eight scenes really only break three principles: **not saying it clearly, not holding the two gates, not managing context / data well**; watching your own high-frequency items and plugging them at the source is more useful than memorizing all eight. For how a specific tool rolls back and operates, **refer to the official documentation** (see Appendix C).
