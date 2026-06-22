〔Wherever this chapter touches a specific product's name for the "plan" feature, its toggle, commands, or interface, those change with each version, so always **check the official docs**. This chapter only covers the **shared, stable** way of working, and that part won't go out of date.〕

The previous two chapters solved "how to sign off after it acts" (Chapter 25) and "how to keep it from losing control while it acts" (Chapter 26). This chapter steps back one more, to the thing most worth doing and most labor-saving **before it acts**: **don't let it barrel in and start changing things; first have it "say clearly how it intends to change them," and once you nod, then let it act.**

This sounds like a redundant extra step: "I already worked out what I want it to do, and now I have to make it explain first?" Quite the opposite. **These few dozen seconds of "see the plan first" are the highest-return step in the whole workflow**, and they block most of the "went off track and didn't notice for half an hour" rework. Let's talk through why, and the partner principle of "breaking the task small."

## 1. Why "see the plan first" saves so much: blocking mistakes before acting

Recall the iron rule we keep repeating: **it makes mistakes.** It might **misread your meaning**, and it might **pick a bad approach.** The problem is:

If it **acts directly**, and you only notice "it misunderstood" when you read the diff after it's changed a whole pile of files, then that whole pile of changes **has to be thrown out and redone.** It worked for nothing, you waited for nothing, and the context is stuffed with this pile of scrap (Chapter 13 covered how it gets dumber the longer you chat).

But if it **lays out the plan first**, "I plan to change these files, add this thing, in these steps," you spot at a glance "wait, you've got it backward," and **one sentence corrects it, with not a single line of code written yet.**

That's the key difference:

> **Key point:** **Seeing the plan first moves "the mistake it might make" forward, from "after it's changed things" to "before it acts."** For the same off-track moment, **catching it before acting costs one sentence; catching it after acting costs throwing out a pile of changes and redoing them.** This is exactly what Chapter 14, "keeping the AI moving the task forward," kept stressing: **the earlier you align on direction, the more rework you save.** A few dozen seconds of plan buys you a few dozen minutes not wasted.

A comparison: it's like looking at the **blueprint** before a renovation. Before the crew actually knocks down walls and lays pipes, they run the blueprint by you, "we'll change the living room like this, move the kitchen here," and your one sentence on the blueprint, "the gas line in the kitchen can't move," saves untold trouble compared to shouting stop after they've already torn the pipes out. **The plan is that blueprint it shows you before acting.**

## 2. "Plan first, execute later": many tools have this built in

The good news: this is so important that **many coding agents have built it in directly as a feature**, where you can put it in a state of "**only plan, don't act yet**": it'll investigate, write the approach out for you, **but stop there and not touch your files**, starting to execute only once you approve.

Different tools have **different names for this feature and different ways to toggle it** (some call it a "plan mode" or the like; **the exact name and how to turn it on are a matter for the official docs**). But they're all after the same thing: **splitting "make a plan" and "actually act" into two stages, with a "human approves" gate wedged between them**, which is exactly "gate 1" in that diagram from Chapter 24.

Even if the tool you're using has no ready-made "mode" like this, you can **implement it by hand anytime with one sentence.** Say something like this to it:

> *"Don't edit any files yet, just give me a plan: which files you plan to change, what to add, in how many steps. Start only after I confirm."*

The essence of this sentence is to **explicitly halt "acting" and ask only for "the approach."** Note that this is **something you say to the AI, not some product's fixed command**; get the meaning of "plan first, don't act" across in plain words and that's enough.

> **Common misconception / Reality:** Some people think "having it plan first is a waste of time, better to just let it work and deal with mistakes as they come." **In reality, 'deal with mistakes as they come' is the most wasteful road**, especially when the change is big and you simply can't sign off line by line (Chapter 25); the mistake hides where you can't see it. **Spending a few dozen seconds on the blueprint first beats tearing it out and relaying afterward by a mile.** "Plan first, execute later" isn't dawdling, it's the shortcut.

## 3. When reading the plan, what a non-expert should look at

Like reading a diff (Chapter 25), reading the plan **doesn't require you to know code.** What you need to confirm are a few things a non-expert can fully judge:

- **Did it understand the task?** The start of a plan usually restates "what it thinks you want it to do." **This sentence is the most worth reading**: if it misunderstood, everything after is wrong, and correcting now is the most labor-saving.
- **Is the place it wants to touch right?** It says it'll change the "user login" part, but you clearly told it to change the "homepage title." **Wrong place, call a halt.**
- **Is the scope absurdly big?** You wanted a small change, and it lists "rewrite ten files in fifteen steps." **Either it overcomplicated it or it misunderstood**; have it clarify, or break the task small (next section).
- **Are there any dangerous moves?** If the plan mentions "delete so-and-so, overwrite so-and-so, send so-and-so," cross-check against Chapter 26: these are the red lines you need to **watch especially closely** and confirm in person when it acts.

> **Key point:** Reading the plan is about **"is the direction right, is the scope reasonable," not the technical detail of each step.** Like reading a renovation blueprint, you look at "is the layout right, did they touch the gas line," not "how many millimeters is this pipe." **Direction right, then let it act; direction wrong, call a halt now, the cheapest interception in the whole run.**

## 4. Break the task small: don't let it do a whole big feature in one go

"See the plan first" comes paired with a twin principle: **break the task small, sign off in small steps.**

Why? Because **the "size" of a change directly decides whether you "can or can't sign off."** This is the root of that rookie crash scene from Chapter 23:

**Having it "do a whole big feature in one go" is the most common way beginners crash.** Think about it: it changes twenty or thirty files and hundreds of lines at once, the diff so long you can't possibly finish reading it (the Chapter 25 sign-off set completely fails), and if something goes wrong the mistake is mixed into one huge blob of changes, so you **can't find where it is and can't cleanly roll back** (Chapter 26). The bigger the change, the bigger your blind spot.

The right move is to break a big thing into a string of small things, **do one little piece, sign off on one little piece, commit once, then do the next**:

```text
wrong move:  one "do the whole feature" ─→ it wildly changes a huge blob ─→ diff too long to read, mistakes hard to find, hard to roll back

right move:  big task
              │ broken into
              ├─ small step 1 ─→ read diff/run tests (sign off) ─→ commit ✔
              ├─ small step 2 ─→ read diff/run tests (sign off) ─→ commit ✔
              └─ small step 3 ─→ read diff/run tests (sign off) ─→ commit ✔
                         (each little piece is followable, verifiable, rollback-able on its own)
```

The benefits of breaking it small each cure a pain of yours:

- **You can sign off on every little piece:** the diff is short, and the three sign-off questions (Chapter 25) are answerable.
- **Mistakes are easy to locate:** the problem from that one small step is only so big in scope, and you can circle it at a glance.
- **Rollback is clean:** to undo, you only back out the one small step that broke, and the results you already signed off on are still there.
- **Wrong direction, fast loss-cutting:** spotting the off-track on the very first small step, the loss is just one little piece, not the whole big feature.

> **Common misconception / Reality:** "Doing one little piece at a time, how slow, better to let it do it all at once." **This is an illusion.** Doing it all at once looks fast, but the moment something's wrong you sink into "a diff too long to read + a bug you can't find + a mess too hard to roll back," and the rework time far exceeds the bit you "saved." **Small steps at a slow jog turns out to be the fastest road to the finish**, because you almost never backtrack. This is of a piece with Chapter 14, "keeping the AI moving forward": **small rhythm, frequent alignment, fastest overall.**

## 5. The two things combined: a "before acting" routine that saves trouble

Put "see the plan first" and "break the task" together and you have this chapter's "before acting" approach, tied tightly to that "gate 1" from Chapter 24:

```text
big goal
   │
   ▼
1. have it make a plan first (many tools build in "plan first, execute later," name per the official docs;
   without it, you can ask by hand in one sentence: "don't act yet, just give me a plan")
   │
   ▼
2. you read the plan: understood right? right place? reasonable scope? any dangerous moves?
   │
   ├─ direction wrong ─→ correct in one sentence (most labor-saving now, it hasn't acted yet)
   │
   └─ direction right ─→ go ahead and break it into a few small steps
                     │
                     ▼
   3. one small step at a time: do a piece -> sign off on a piece (Chapter 25) -> commit -> next piece
```

Remember this chapter's summary: **for a big change, see the blueprint before breaking ground; the bigger the work, the more you cut it into small pieces, do a piece, verify a piece.** The few dozen seconds spent on this step and the extra sentence or two you type are the **highest-return investment** in all of AI programming: they keep rework outside the door.

## 6. Common misconceptions, cleared up together

| Misconception | Reality |
| --- | --- |
| Having it plan first is a waste of time, just work and deal with mistakes as they come | "Deal with mistakes as they come" is the most wasteful: catching the off-track after acting means throwing out a pile of changes; **see the plan before acting and a correction is one sentence** |
| Reading the plan needs technical detail, which I can't do | Reading the plan is about "understood right, right place, reasonable scope, any dangerous moves," which **a non-expert can judge** (like reading a renovation blueprint for the layout) |
| "Plan first, execute later" is one product's exclusive command | Many tools build in this feature (**name and toggle per the official docs**); without it you can **say it to the AI in one sentence**, "don't act yet, just the plan," which is something you say to the AI, not a fixed command |
| Having it do a whole big feature in one go is easiest | A big change's diff is too long to read, mistakes hard to find, hard to roll back (Chapters 25, 26); **break it small, do a piece verify a piece** to go fastest |
| Doing it one little piece at a time is too slow | An illusion: small steps almost never backtrack and are fastest overall; do it all at once and once it's wrong the rework far exceeds what you saved (echoing Chapter 14) |
| Once the plan is approved you can ignore sign-off | The plan is the "before acting" gate; **after acting you still sign off** (read the diff, run tests, Chapter 25), guard both gates |

## Summary

- **Seeing the plan before acting is the highest-return step in the whole workflow**: it moves "the mistake it might make" forward, from "after it's changed things" to "before it acts." **Correcting before acting takes one sentence, correcting after acting means throwing out a pile and redoing it** (echoing Chapters 14, 24).
- Many tools build in a "**plan only, don't act yet**" feature (**name and toggle per the official docs**); without it you can **ask by hand in one sentence**: "don't act yet, just give me a plan." That's something you say to the AI, not a product command.
- Reading the plan **doesn't need code knowledge**: look at whether **it understood right, the place it touches is right, the scope is reasonable, and there are any dangerous moves** (cross-check dangerous moves against Chapter 26).
- **Break the task small, sign off in small steps:** don't let it do a whole big feature in one go, a big change's diff is too long to read, mistakes hard to find, hard to roll back. **Do a piece, verify a piece (Chapter 25), commit once, then the next.**
- Summary: **see the blueprint before breaking ground, the bigger the work the smaller you cut it.** This is the step that saves the most rework, and small steps at a slow jog are actually fastest.

With that, the four "shared" approaches of Part Four are complete: **it's a capable new coworker who makes mistakes (Chapter 23) -> learn to sign off (Chapter 25) -> let it act but not lose control (Chapter 26) -> see the plan and break the task small before acting (Chapter 27).** Carry this tool-agnostic mental model and, whichever coding agent you use down the line and however it updates, you'll hold your direction steady.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's the main benefit of "having it lay out a plan and approving before acting"?
   - A. It makes the conversation feel more formal
   - B. It moves "the mistake it might make" forward to before acting, a correction takes one sentence, avoiding throwing out a big pile after the change
   - C. It makes it write faster
   - D. It saves tokens
   > **Answer: B.** This is the highest-return step: catching the off-track before acting costs one sentence; catching it after acting costs throwing out a pile of changes and redoing (echoing Chapters 14, 24). A, C, D all miss the point, which is "intercept the mistake before acting."

2. **[Basic · Concept]** About the "plan first, execute later" feature, which statement is right?
   - A. Only one product has it, no one else does
   - B. Many tools build it in (name and toggle per the official docs); even without it, you can say to the AI in one sentence "don't act yet, just give me a plan" to do it by hand
   - C. It's a fixed command you must memorize
   - D. It makes the AI never act
   > **Answer: B.** Its essence is splitting "make a plan" and "actually act" into two stages with a human-approval gate in between. Names differ by maker (**per the official docs**), but you can ask by hand in plain words anytime; this is **something you say to the AI, not a product command.**

3. **[Basic · Misconception]** "Having it plan first is a waste of time, better to just let it work and fix mistakes as they come." What's wrong?
   - A. Nothing, working directly is fastest
   - B. "Fix mistakes as they come" is the most wasteful: catching the off-track after acting means redoing from scratch, especially when the change is too big to sign off line by line, and the mistake hides where you can't see it
   - C. The plan is free, only the work costs money
   - D. The plan it makes is always wrong
   > **Answer: B.** Spending a few dozen seconds on the "blueprint" first beats tearing it out and relaying afterward by a mile. With a big change, the Chapter 25 sign-off set fails and the mistake hides in your blind spot. "Plan first, execute later" isn't dawdling, it's the shortcut.

4. **[Advanced · Misconception]** "Having it do a whole big feature in one go is easiest." Why is it often more work?
   - A. No, the bigger the cheaper
   - B. A single big change's diff is too long to read, mistakes hard to locate, and hard to roll back cleanly; breaking it small and signing off piece by piece is what's truly fast
   - C. It can only change one file at a time
   - D. Big tasks cost extra
   > **Answer: B.** The bigger the change the bigger the blind spot (the Chapter 25, 26 gatekeeping all fails). Right move: do a little piece -> verify a little piece -> commit -> next piece. Small steps almost never backtrack and are fastest overall (echoing Chapter 14). This is also the number-one rookie crash scene noted in Chapter 23.

5. **[Basic · Scenario]** It gives you a plan, and the first line reads "I understand you want me to redo the entire payment system." But you only wanted it to "change a button color." What should you do?
   - A. Forget it, let it do it the way it understood
   - B. Correct it right away: it got it backward, it hasn't written a line of code yet, one sentence pulls it back on track
   - C. Delete the project and start over
   - D. Let it work on it for a bit and see
   > **Answer: B.** The opening line "what it thinks you want it to do" is the most worth reading: misunderstood, everything after is wrong. It hasn't acted yet, so the cost of correcting is nearly zero, which is exactly where "see the plan first" saves the most. A and D amount to letting it run off and wildly change a huge blob with its misunderstanding intact.

6. **[Advanced · Hands-on / Observation]** Take a "fairly big" task you'd want to hand it (say "add a message board to my little website"), set the tech aside, and try breaking it into **3 small steps** yourself, thinking about how you'd sign off after each small step. Then think: why does this reassure you more than "one sentence to do it all"?
   > **What you should notice:** Once broken small, you can finish reading the diff of each small step, answer the three sign-off questions (Chapter 25), roll back individually if something breaks (Chapter 26), and cut losses at the first step if the direction's wrong. "One sentence to do it all" pushes you into "a diff too long to read + a bug you can't find + a mess too hard to roll back." **Small steps at a slow jog turn out to be fastest**, and this judgment is tool-agnostic; the specific "plan feature" name and toggle: **check the official docs.**
