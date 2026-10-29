The last two chapters covered how to sign off after it acts (Chapter 25) and how to keep it under control while it acts (Chapter 26). This chapter steps back to the moment before it acts, and to the single cheapest habit in the whole workflow: instead of letting it dive straight into edits, have it explain how it intends to make the change, and let it act only once you've approved. Alongside that comes a companion habit: breaking big tasks into small ones.

## 1. Why "see the plan first" saves so much: stopping mistakes before it acts

It may misunderstand what you meant, or pick a poor approach. If it acts straight away, you discover the misunderstanding only when you read the diff after it has changed a pile of files, and all of those changes have to be thrown out: its work is wasted, you've waited for nothing, and the context is cluttered with discarded drafts (Chapter 13 showed how longer conversations get muddled). If it explains the plan first ("I'll change these files, add this, in these steps"), you can see at a glance that it has things backwards and fix it with one sentence, before a single line of code is written.

Either way you discover the same wrong turn, but before it acts the cost is one sentence; after it acts, the cost is redoing a pile of changes. As Chapter 14 put it, the earlier you align on direction, the less rework you have.

It's like looking at the blueprints before a renovation. If the builders show you the drawings before knocking down walls, one remark ("don't touch the gas pipe in the kitchen") saves far more trouble than shouting stop after the pipe is out. The plan is the blueprint it shows you before it starts.

## 2. "Plan first, execute later": many tools have this built in

As of October 2026, both Claude Code and Codex have a built-in plan mode, entered by typing `/plan` in a session (in Claude Code you can also switch to it with Shift+Tab). In this mode it investigates and writes up its approach for you, but doesn't change your files; it starts only after you approve. Mode names and switches may change; Chapters 28 and 29 show the current usage.

With tools that don't have such a mode, one sentence does the same job:

> "Don't change any files yet. Just give me a plan: which files you intend to change, what you'll add, and how many steps. Start only after I confirm."

That's something you say to the AI, not a fixed command in any product. As long as "plan first, don't act yet" comes across, it works.

Some people think asking for a plan wastes time and it's better to let it get on with it and fix mistakes later. But once a change gets big, you can't sign it off line by line (Chapter 25), and mistakes hide where you can't see them. Half a minute with the blueprint is far cheaper than tearing things out and redoing them.

## 3. When reading the plan, what a non-expert should look at

Like reading a diff, reading a plan doesn't require knowing code. A plan looks something like this:

```text
My understanding: add a search box to the blog homepage that searches articles by title.
Plan:
1. Add a search box below the heading in index.html.
2. Create search.js: filter the article list by title as you type.
3. Add styles for the search box in style.css, with a separate adjustment for phone widths.
Won't change: article content files, the comments feature.
Verification: search for "invoice" on the homepage and confirm only related articles appear.
```

You're checking four things any non-expert can judge:

- Did it understand the task? A plan usually opens by restating what it thinks you want. That line deserves the most attention: if the understanding is wrong, everything after it is wrong.
- Is it touching the right place? You asked about the homepage title and it says it will change the "user login" part: stop it there.
- Is the scope reasonable? You wanted a small change and it lists "rewrite ten files in fifteen steps": either it's overcomplicating things or it misunderstood. Have it explain why, or break the task down.
- Are there risky actions? If the plan mentions deleting, overwriting, sending, or publishing, check against Chapter 26: those need your explicit OK.

You're looking at direction and scope, not the technical details of each step. With renovation drawings you check the layout and whether anyone is touching the gas pipe, not the pipe's diameter. Once the direction is right, let it act.

## 4. Break the task small: don't let it do a whole big feature in one go

"See the plan first" has a twin principle: break the task small and sign off in small steps. The size of a change directly decides whether you can sign it off at all.

Having it build a whole big feature in one go is the most common beginner mistake. It changes twenty or thirty files and hundreds of lines at once; the diff is too long to read, so Chapter 25's sign-off stops working, and when something breaks, the mistake is buried in the pile, hard to find and hard to roll back cleanly (Chapter 26).

The better approach is to turn the big job into a series of small ones: build a small piece, sign it off, commit, then do the next (a "commit" saves a version with Git; see "Git: the bare minimum to get started" in Chapter 26).

```text
All at once:   "build the whole feature" ─→ it changes a pile ─→ diff too long, bugs hidden, hard to roll back

Small steps:   big task
                 │ broken into
                 ├─ step 1 ─→ sign off (read diff, try it) ─→ commit
                 ├─ step 2 ─→ sign off (read diff, try it) ─→ commit
                 └─ step 3 ─→ sign off (read diff, try it) ─→ commit
```

Take "add a guestbook to my small website." It splits into three steps: first, just a box where you can type a message and see it displayed, with nothing saved yet; next, save the messages so they're still there after a reload; finally, add a length limit and checks against junk entries. After each step you can open the page and try it yourself, and if something goes wrong you roll back only that step.

Broken down like this, every step has a short diff and you can answer the three sign-off questions (Chapter 25); a mistake is confined to a small area and easy to find; to change your mind you undo only the step that went wrong, and everything already signed off stays; and if the very first step shows the direction is wrong, you lose only that small piece.

Doing it all at once looks faster, but once something breaks, you're left with an unreadable diff, a bug you can't find, and a mess that's hard to undo, and the rework far outweighs what you "saved." Small steps almost never backtrack, so overall they're faster (the same idea as Chapter 14).

## 5. The two things combined: a "before acting" routine

Put "see the plan first" and "break it small" together and you have the full routine for the first gate in Chapter 24's work loop:

```text
big goal
   │
   ▼
1. have it plan first (plan mode, or "don't act yet, just give me a plan")
   │
   ▼
2. read the plan: right understanding? right place? reasonable scope? risky actions?
   │
   ├─ wrong direction ─→ correct it in one sentence, have it rewrite the plan
   │
   └─ right direction ─→ break it into small steps
                     │
                     ▼
3. one step at a time: build → sign off (Chapter 25) → commit → next
```

Approving a plan doesn't mean you can skip signing off. The plan is the gate before it acts; after it acts you still read the diff and follow your acceptance steps. Both gates need guarding.

## 6. Common misconceptions

| Misconception | Reality |
| --- | --- |
| Asking for a plan wastes time; fix mistakes later | Finding a wrong turn after it acts means redoing a pile of changes; before it acts, one sentence fixes it |
| Reading a plan requires technical knowledge | You check understanding, place, scope, and risky actions, which any non-expert can judge |
| "Plan first, execute later" is one product's special command | Many tools have a plan mode; without one, just say "don't act yet, give me a plan" |
| Having it build a whole big feature at once is easiest | Big changes mean unreadable diffs, hidden bugs, and hard rollbacks; small pieces signed off one by one are fastest |
| Breaking things into small pieces is too slow | Small steps almost never backtrack, so they're faster overall; when an all-at-once job fails, the rework outweighs any savings |
| Once the plan is approved, no sign-off is needed | You still sign off after it acts (Chapter 25); both gates need guarding |

## Summary

- Reviewing the plan before it acts is the step that saves the most rework: before it acts, one sentence fixes a wrong turn; afterwards, a pile of changes has to be redone (Chapters 14 and 24).
- As of October 2026, both Claude Code and Codex have a plan mode (`/plan`); without one, you can just ask: "don't act yet, give me a plan."
- Reading a plan doesn't require knowing code: check its understanding, the place it will touch, whether the scope is reasonable, and whether there are risky actions (Chapter 26).
- Break tasks small: build a piece, sign it off (Chapter 25), commit, then do the next.
- After the plan is approved, you still sign off once it has acted.

That completes the shared method of Part 4: it's a capable new coworker who makes mistakes (Chapter 23), it works through the investigate, plan, act, sign-off loop (Chapter 24), you learn to sign off (Chapter 25), you let it act without losing control (Chapter 26), and you review the plan and break tasks small before it acts (Chapter 27). The next two chapters walk through this for real in Claude Code and Codex.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Think first, then read the answer in the quoted block.

1. **[Basic · Concept]** What's the main benefit of "having it lay out a plan and approving before acting"? <!-- quiz: q01 revision: 2 -->
   - A. It saves a lot of tokens, since a plan is much shorter than code
   - B. It makes it write faster, since its thinking is sorted out in advance
   - C. You catch a misunderstanding before it acts and fix it in one line
   - D. Once the plan is approved, you no longer need to check the result
   > **Answer: C.** This is the highest-return step: catching the off-track before acting costs one sentence; catching it after acting costs throwing out a pile of changes and redoing them (echoing Chapters 14, 24). A and B might happen along the way, but they aren't the point. D is a common misconception: the plan is the gate before acting, and you still read the diff and run tests afterward.

2. **[Basic · Concept]** About the "plan first, execute later" feature, which statement is right? <!-- quiz: q02 revision: 2 -->
   - A. It's one fixed command, written exactly the same way in every tool
   - B. Only products with a "plan mode" button can work this way at all
   - C. Many tools build it in; without it, one sentence asks for a plan first
   - D. Once it's on, the AI only makes plans and never carries out the task
   > **Answer: C.** Its essence is splitting "make a plan" and "actually act" into two stages with a human-approval gate in between. Names and toggles differ by tool (see the official documentation), so A is wrong; you can ask for it in plain words without any button, so B is wrong; once you approve, it goes ahead and acts, so D is wrong.

3. **[Basic · Misconception]** "Having it plan first is a waste of time, better to just let it work and fix mistakes as they come." What's wrong? <!-- quiz: q03 revision: 2 -->
   - A. Fixing after the fact costs most; catch it late and you must redo it all
   - B. Nothing; today's AI rarely misunderstands, so going straight is fastest
   - C. It's about money: planning is free, and only the actual work is billed
   - D. Plans are more accurate than code, so after reading one you can skip checks
   > **Answer: A.** Spending half a minute on the "blueprint" first beats tearing it out and relaying afterward by a mile. With a big change, the Chapter 25 sign-off set fails and the mistake hides in your blind spot. B underestimates how often it misunderstands; C misses the point, since planning and acting both use your allowance; D treats "reading the plan" as a substitute for signing off.

4. **[Advanced · Misconception]** Someone says: "Breaking a task small just means sending the request as a few sentences in a row; no need to stop in between, just read the whole diff at the end." What does this miss? <!-- quiz: q04 revision: 2 -->
   - A. It isn't small enough; real splitting means changing one line per step
   - B. Checking and committing each step, so a mistake can be undone on its own
   - C. Nothing; sending it as several sentences already lowers the risk by itself
   - D. Only tools with a plan mode can split a task into small steps at all
   > **Answer: B.** The value of small pieces is that each one can be followed, verified, and rolled back on its own. Without stopping in between, the final diff is still one huge blob with the mistakes mixed in, so C is wrong. Breaking it small doesn't mean one line at a time (A), and any tool can be asked in one sentence to go step by step (D).

5. **[Basic · Scenario]** It gives you a plan, and the first line reads "I understand you want me to redo the entire payment system." But you only wanted it to "change a button color." What should you do? <!-- quiz: q05 revision: 2 -->
   - A. Let it work from its own understanding, then see whether the result is right
   - B. Approve the plan, but remind it to change only the parts about the button
   - C. Wait until it finishes the first step, then judge whether it understood
   - D. Hold off approving, say you only want the color changed, and get a new plan
   > **Answer: D.** The opening line "what it thinks you want it to do" is the most worth reading: misunderstood, everything after is wrong. It hasn't acted yet, so the cost of correcting is nearly zero, which is exactly where "see the plan first" saves the most. A and C let it start changing things with its misunderstanding intact; B still approves a plan built on the wrong understanding, so following it will still blow up the scope.

6. **[Advanced · Hands-on / Observation]** Take a "fairly big" task you'd want to hand it (say "add a message board to my little website"), set the tech aside, and try breaking it into **3 small steps** yourself, thinking about how you'd sign off after each small step. Then think: why does this reassure you more than "one sentence to do it all"? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Once broken small, you can finish reading the diff of each small step, answer the three sign-off questions (Chapter 25), roll back individually if something breaks (Chapter 26), and cut losses at the first step if the direction's wrong. "One sentence to do it all" pushes you into "a diff too long to read + a bug you can't find + a mess too hard to roll back." **Small steps at a slow jog turn out to be fastest**, and this judgment is tool-agnostic; for the specific "plan feature" name and toggle, **refer to the official documentation.**
