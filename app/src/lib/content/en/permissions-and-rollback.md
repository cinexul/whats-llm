〔Wherever this chapter touches a specific product's default behavior, permission granularity, commands, or interface, those change with each version, so always **check the official docs**. This chapter only covers the **shared, stable** ideas, and that part won't go out of date.〕

In Chapter 23 we recognized a slightly scary combination: **it makes mistakes + it takes action.** In Chapter 25 we learned "how to sign off afterward." This chapter solves the other half of the problem: **before and during, how do you let it "act without losing control"?**

The answer is two things that work together, and this chapter covers each thoroughly: **one is the "permission mechanism," where dangerous operations ask you before acting; the other is a "rollback-friendly environment," where if something goes wrong, you can undo.** One sentence up front: **let the AI go do the "no big deal" work freely, but anything that "might cause trouble" is always left for a human to nod through.**

## 1. The core loop: request -> see the proposal -> permit -> verify

Mentoring an agent that takes action is really just one small loop, repeated over and over. Carve it into your head and you'll never again feel "it's running loose in my computer and I can't control it":

```text
   you give the goal
      │
      ▼
 1.it requests ──→ 2.you see the proposal ──→ 3.you permit ──→ it acts ──→ 4.you verify ──→ (next step back to 1)
("I plan to change X")  (see what it wants to do)  (nod/refuse)         (read diff/run tests)
```

- **1. Request:** each time it's about to do something "with consequences" (edit a file, run a command, go online...), it'll usually **stop and tell you first what it plans to do**, rather than just barreling ahead.
- **2. See the proposal:** you get a clear view of "what it wants to touch and where." This step is your window to step in; if something's off, stopping it now costs the least.
- **3. Permit:** you nod (agree this once / agree to this whole category) and it acts; you can also refuse, or have it try a different approach.
- **4. Verify:** when it's done, you use the Chapter 25 set (read the diff, run tests, three sign-off questions) to confirm the result. Then on to the next step, **and the loop restarts.**

> **Key point:** This "request -> see the proposal -> permit -> verify" loop is the Chapter 24 "investigate -> plan -> act -> sign off" in miniature on **each specific operation.** Its soul is keeping "the key decision points" **in human hands**: the AI is responsible for doing the work fast and in volume, **the human is responsible for nodding or calling a halt at the forks.** Once you understand this loop, your sense of control over it is established; it's not off the leash, every action with consequences has to pass your gate (which step it stops at, and how finely, differs by tool, so **check the official docs**).

## 2. What the "permission mechanism" is: it's keeping the gate for you

Pull out points 1, 2, 3 above and that's the **permission mechanism.**

A comparison: the permission mechanism is like the worker you hire when renovating your home, who **before knocking down any wall or changing any plumbing comes and asks you "can this wall come down,"** and only acts once you nod. A reliable worker won't take it on themselves to tear out a load-bearing wall. The permission mechanism is that "ask before acting" rule, installed on that "quick but just-started new coworker" (Chapter 23).

How does it actually work? Roughly: when it's about to do an operation **with consequences**, it'll **pause, lay out "what I'm about to do" for you to see, and wait for your response.** The choices you'll commonly see are just a few kinds: **agree this once / agree to this category from now on / disagree / have it try a different approach.**

> **Common misconception / Reality:** First-time users often get impatient at "why does it keep stopping to ask me," thinking it's **dumb or unreliable.** **Quite the opposite: it stopping to ask is exactly the "permission mechanism" protecting you, a good thing, not a flaw.** What you should actually watch out for is a setting that "asks nothing and just barrels straight through to the end." Read "it's asking me" as "the seatbelt is working" and you'll stop finding it annoying.

One important "trade-off" to add here: **permissions can be tightened or loosened.** Most tools let you set some category of "safe small operations" to "stop asking from now on" (like just reading files), so it can work smoothly; they also let you keep "dangerous operations" permanently stuck at "must ask every time." **How you tune it, and how loose you go, is your power and your responsibility**, and the next section is the bottom line on that power.

## 3. Which operations "always need a human to nod": irreversible things never get auto-approved

Not all operations are equally dangerous. **Some things, done wrong, are easy to take back (like changing a line of text, just roll back); some things, done wrong, are spilled water you can't gather up.** The latter are the red line that must "always be left for a human to nod through."

What counts as "water you can't gather up"? Remember these few kinds of **irreversible / high-cost** operations:

| Danger category | Why it's dangerous | Everyday analogy |
| --- | --- | --- |
| **Delete / overwrite** | A deleted file or overwritten content might never be found again | Shredding the file outright, not dropping it in the recycle bin |
| **Sending outward** | Once it's out (sending an email, sending a message, submitting to a public place), **you can't take it back**, and it might carry out something that shouldn't go out | An email is unreachable the moment you hit "send" |
| **Spending money / calling a paid service** | Real money out, or billing triggered, which you may not get refunded afterward | Running your card for you |
| **Changing a live / production environment** | What's affected is a system **being used by real people right now**, and a mistake is an incident | Not editing on a draft, but editing during a live broadcast |

For these kinds, the principle is one sentence, and it's not negotiable:

> **Key point:** **Delete, overwrite, send outward, spend money: these "irreversible or high-cost" operations must be set to "require human confirmation," never auto-approved.** For the sake of smoothness you can set "no big deal" things like "reading a file" to "stop asking me"; but **the harder something is to take back, the more firmly you keep it on the "I have to nod in person every time" setting.** One sentence: **"Dangerous operations are always left for a human to nod through."** This isn't a nicety, it's the bottom line. Which operations are blocked by default, and how strictly, differs by tool, so **check the official docs**; but the principle "dangerous operations need human confirmation" doesn't change anywhere.

Why stress "never automatic"? Because the iron rule of Chapter 23 is most lethal here: **it will be confidently wrong.** A "confidently wrong" delete command, if auto-approved, means the water has already spilled by the time you notice. **Having it stop and ask you that once is the last brake left for "it might be making a mistake right now."**

## 4. The rollback-friendly environment: lay out the "undo medicine" before acting

The permission mechanism handles "intercepting once before acting." But it can't intercept everything; some mistakes always slip through. So there's a second layer of insurance: **let it act in an environment you can undo.** Chapter 25 already touched on this when covering rollback; here we make clear "why it's a precondition and how to set it up."

The reasoning is plain: **precisely because it makes mistakes, you have all the more reason to ensure "even a mistake can be undone."** Get both of these in place, an interception before acting from permissions and an undo after acting from rollback, and you've truly put it in a cage that "can do the work and yet not lose control."

How do you set up this "can undo" environment? Again, two forms (echoing Chapter 25):

- **When it acts on your local project:** be sure to **manage the project with version control (Git) first and cut a "new branch" before letting it act.** "Cutting a new branch" = **opening a separate scratch area for it**, letting it mess around on the scratch copy without touching your official version; if it wrecks something, throw away the scratch and go back to a clean state. **This step has to be done before letting it act**; remember it only afterward and that safety net never opened.
- **When it acts in a web / cloud form:** it usually works in **the platform's own isolated environment**, and the platform generally provides a matching **undo / discard / reset.** For how to undo and to what point, **check the official docs.**

> **Key point:** Treat the "rollback-friendly environment" as a **precondition for acting**, not homework you make up after something goes wrong. Locally, cut a Git branch first; in the cloud, use the platform's isolation. **Different forms, same purpose: let it work in a "scratch area where a spill costs you nothing."** With that scratch area, you dare to boldly hand off the work; without it, every "let it act" is gambling on your official version.

## 5. How the two insurances combine into one routine

Put the permission mechanism and the rollback-friendly environment together and you have the whole of this chapter: **one before, one after, two insurances.**

```text
            ┌──────────────── before acting ────────────────┐
lay out the undo medicine: in an environment you can undo (locally cut a Git branch / cloud use platform isolation)
            └────────────────────────────────────────────────┘
                              │
                              ▼
   1.it requests ─→ 2.you see the proposal ─→ 3.permit (dangerous operations must have human confirmation!) ─→ it acts
                              │
                              ▼
   4.you verify (read diff/run tests, Chapter 25)
                              │
              ┌───────────────┴───────────────┐
          result is good                    result is wrong / messier with every change
              │                                 │
           move to the next step          use the undo medicine to roll back, reopen a clean conversation and retry
```

- **The permission mechanism** is the "brake before acting": before it acts, it intercepts operations with consequences and shows them to you, and **the dangerous kinds must have your personal nod.**
- **The rollback-friendly environment** is the "undo after acting": if a mistake slips through, **one move back to a clean state** and the loss is zero.
- **Neither can be missing:** with a brake but no undo medicine, the time the brake fails you crash; with undo medicine but no brake, you'll wear yourself out endlessly "undoing and retrying." Get both and you can enjoy its speed without living on edge.

Remember this final summary: **letting the AI act without losing control comes down to "dangerous operations are always left for a human to nod through" + "always act in an environment you can undo."**

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| It keeps stopping to ask me, so it's dumb / unreliable | That's **the permission mechanism protecting you**, a good thing; what to worry about is "asks nothing, barrels straight to the end" |
| Since it takes action, just make it fully automatic and don't ask me, that's easiest | Dangerous operations (delete / overwrite / send outward / spend money) **must never be auto-approved**, they need human confirmation; it will be confidently wrong |
| Things like delete or send an email, just let it do them on the fly | These are "spilled water you can't gather up," the red line that must stay at "human confirmation every time" |
| Rollback is something you go study only after a mishap | A rollback-friendly environment is a **precondition for acting**: cut a Git branch locally first, use platform isolation in the cloud, set it up before acting |
| Having a permission mechanism is enough, no need to worry about rollback | Neither insurance can be missing: permission is the brake before, rollback is the undo medicine after; some mistakes always slip past the brake |
| Every tool's default behavior is the same | What's blocked by default, how strictly, and permission granularity all differ, so **check the official docs**; what doesn't change is the principle "dangerous operations need a human to nod" |

## Summary

- Mentoring an agent that takes action comes down to one loop: **request -> see the proposal -> permit -> verify.** The AI does the work, **the human nods or calls a halt at the key points** (echoing Chapter 24's "investigate -> plan -> act -> sign off").
- **The permission mechanism** = the rule of asking you before acting, like a renovation worker "asking before knocking down a wall." Its stopping to ask **is protecting you**, not a flaw.
- **Dangerous operations are always left for a human to nod through:** delete, overwrite, send outward, spend money, these **irreversible / high-cost** operations **must be set to "require human confirmation," never auto-approved**, because it will be confidently wrong.
- **A rollback-friendly environment** is a **precondition for acting**: **cut a Git branch locally first** (open a separate scratch area for it), **use the platform's built-in isolation web/cloud** (check the official docs), letting it work where "a spill costs you nothing."
- Get both insurances in place, **the brake before (permissions) + the undo medicine after (rollback)**, and you can "let the AI act without losing control." Defaults and granularity differ by tool, so **check the official docs**; the principle doesn't change.

In the next chapter (Chapter 27) we solve the other half of "before": before a big change, how to make it **lay out a plan and get your approval before writing**, and break the task **small, signing off in small steps**, the step that saves the most rework.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** Mentoring an agent that takes action, which is the core loop?
   - A. It finishes on its own and you take one look at the end
   - B. Request -> see the proposal -> permit -> verify, with the human nodding or calling a halt at the key points
   - C. You give the order and it never pauses, going straight through to the end
   - D. It asks, you answer, and that's all
   > **Answer: B.** This is exactly Chapter 24's "investigate -> plan -> act -> sign off" landing on each specific operation: the AI does the work, the human guards the forks. A and C both drop "the human nods," which is precisely the core of not losing control.

2. **[Basic · Concept]** What's the most fitting analogy for the "permission mechanism"?
   - A. A robot that never speaks and just works heads-down
   - B. A renovation worker who "asks you before knocking down a wall or changing the plumbing," acting only after you nod
   - C. An assistant who only chats and never takes action
   - D. A script that automatically runs every operation
   > **Answer: B.** The permission mechanism = installing the "ask before acting" rule on the "quick but just-started new coworker." It's really: pause before an operation with consequences, lay out what's to be done, wait for your nod. Option D is exactly the "auto-approve everything" it's meant to avoid.

3. **[Basic · Misconception]** "It keeps stopping to ask me whether it can act, so annoying, is it not very good?" What's wrong?
   - A. Nothing, asking a lot means it's not good
   - B. Its stopping to ask is exactly the permission mechanism protecting you, a good thing; what to really worry about is "asks nothing, barrels to the end"
   - C. It stops because it's broken
   - D. Stopping to ask costs extra
   > **Answer: B.** Read "it's asking me" as "the seatbelt is working." An action-taking AI that goes the whole way without asking and auto-approves dangerous operations, that's the dangerous one, especially because it'll be "confidently wrong" (Chapter 23).

4. **[Advanced · Misconception]** "Since it takes action, just set it to fully automatic and don't ask me anything, that's easiest." Why is this dangerous?
   - A. Not dangerous, full automatic is most efficient
   - B. Once **irreversible or high-cost** operations like delete / overwrite / send outward / spend money are auto-approved, by the time you notice "the water has spilled" and can't be gathered back
   - C. Full automatic makes it slower
   - D. Full automatic costs extra
   > **Answer: B.** "No big deal" things like "reading a file" can be set to stop asking; but the harder something is to take back, the more it must stay at "human confirmation every time." A delete command it got "confidently wrong," if auto-run, is an incident in that one move. **Dangerous operations are always left for a human to nod through.**

5. **[Basic · Scenario]** You're about to have it make a fairly big change on your **local project**. **Before** acting, what's the one thing you should do first?
   - A. Restart the computer
   - B. Manage the project with Git first and cut a new branch, opening a separate "scratch area" for it, ensuring a one-move rollback if it wrecks things
   - C. Compliment it first so it's more careful
   - D. Turn off all permissions and let it work freely
   > **Answer: B.** A rollback-friendly environment is a **precondition for acting**, not catch-up homework. Cutting a new branch = letting it mess around in the scratch area without touching the official version, throw away the scratch if it wrecks things. D is exactly backward; before a big change you should tighten permissions and lay out the undo medicine. For a cloud form, use the platform's built-in isolation, **check the official docs.**

6. **[Advanced · Hands-on / Observation]** Imagine (no need to actually do it) you want it to help you "clean up a batch of old files." Before letting it act, which operations would you set to "must confirm in person"? Why? And think: if it deleted something it shouldn't have, what do you rely on to recover the loss?
   > **What you should notice:** "Delete" is a textbook irreversible operation and must stay at "human confirmation," never auto-approved. The confidence to recover comes from a **rollback-friendly environment**: cutting a Git branch first locally lets you roll back to the clean state before the deletion, and in the cloud it relies on the platform's built-in undo / reset (**check the official docs**). Two insurances, permission intercepting before and rollback catching after; get both in place and "letting it act" doesn't equal "leaving it to fate."
