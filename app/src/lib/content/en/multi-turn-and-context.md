You've probably had this experience: you talk through something with it, and the first few turns are fast and sharp, but the further you go the more "stubborn" it gets. It starts forgetting requirements you set earlier, contradicts itself, gets long-winded, even goes in circles. You can't help wondering: is it "tired"? Has it gotten dumber?

It's not tired, and it hasn't gotten dumber. This chapter turns Chapter 3's "**dumber the longer you talk**" into practice: why this happens, **when to decisively open a new conversation**, and how to get it to "remember" your **long-term preferences**. Learning to manage conversations is like installing a "stay sharp" switch on your AI — the most unglamorous yet most valuable basic skill for using it well.

## 1. Why it gets "dumber the longer you talk," back to that desk

Let me explain the cause fully with that "desk" from Chapter 3 first, so you know how to treat it.

Remember? Every time the model gets a new sentence from you, the software **resends the entire conversation so far to it, unchanged** (Chapter 3). So the longer the conversation, the more and the messier the stuff spread on the "desk" each time. Then three things start happening:

| Symptom | Desk metaphor | What you see |
| --- | --- | --- |
| **Key points buried** | Material piles up on the desk, your original key requirement crushed at the bottom | It "can't see" the rules you set earlier and starts drifting |
| **Contradictions piling up** | Old plans from trial and error, drafts you rejected, still spread on the desk | It gets dragged along by its own earlier mistakes, rehashing scrapped drafts, contradicting itself |
| **Details compressed** | When the desk is nearly full, old content gets "squeezed into sticky notes," details lost | Specific numbers and agreements stated earlier get blurred or mixed up |

> **Key point:** "Dumber the longer you talk" isn't its ability declining — it's that **the desk is stuffed with a long string of conversation and trial-and-error, and noise drowns out signal.** Understand this and the fix is obvious: **rather than keep digging through a messy desk, switch to a clean one.** That's the two core habits below.

## 2. Core habit one: one topic, one conversation

The most effortless rule: **one real thing, one dedicated conversation; once it's done or you change topics, start another.**

Many people are used to chatting in **one conversation** from morning to night: first a recipe, then switching to revising a resume, then having it explain a concept, then back to revising the resume. That's like piling totally unrelated material on one desk:

```text
One conversation for everything:
   [recipe] -> [revise resume] -> [explain relativity] -> [back to the resume]
            -> [flight booking advice] ...
   The desk gets messier -> it's distracted by unrelated content, the resume's
   requirements long buried at the bottom

One topic, one conversation:
   Conversation A: focus on the resume
   Conversation B: ask about recipes
   Conversation C: explain relativity
   Every desk is clean, and it stays "focused" each time
```

> **How you'll actually run into this:** You'll find that **once topics get mixed, it cross-contaminates easily** — you just had it revise the resume "more formally," then you chat about something else, come back, and it may have forgotten "formal" or oddly picked up the tone of the chit-chat. Split unrelated things into separate conversations, one thing's material per desk, and its performance is far steadier. It also saves money: the cleaner the desk the faster and cheaper (Chapters 3 and 38).

## 3. Core habit two: spot these signals, open a new conversation

So, while working through the same thing, **when should you decisively drop this conversation and reopen?** Remember these "time to switch desks" signals, and the moment you see any one, don't keep fighting:

| Signal | What it looks like | Why it's "desk is full" |
| --- | --- | --- |
| **It starts contradicting itself** | This turn doesn't line up with earlier ones; it's at odds with itself | Contradictory old content piled on the desk leads it astray |
| **Repeatedly forgets requirements** | Rules you set (tone, length, format) it keeps ignoring, reminders don't help | Key requirements buried under new content at the desk's bottom |
| **More and more long-winded / circular** | Answers getting longer, rambling, rehashing long-rejected plans | A long string of trial-and-error noise drowns the signal |
| **Clear "amnesia"** | Specific info stated earlier it mixes up or drops | Old content pushed out of the window or compressed away |

When you see these, **don't slug it out in the original conversation** (more reminders and corrections usually just add more paper to a full desk). The right move is:

> **Open a new conversation and lay out "the information still needed" again, cleanly.**

```text
The standard move when it's time to switch desks:
  1) Open a new conversation (= a clean desk)
  2) In a sentence or two, lay it out clearly: context + what you now want it to do +
     key requirements
     (that's the "state it clearly" craft from Chapter 11)
  3) If needed, paste over the "useful intermediate results" from the last round,
     leave the scrapped drafts behind
```

> **Key point:** The mistake beginners make most is treating "it got dumber" as "it broke," then frantically correcting it over and over in the **same** messy conversation — which only makes it messier. Remember: **this isn't a bug — it's the normal behavior of limited context** (Chapter 3). Switching to a clean desk is far faster and more accurate than fixing a messy one. The test is simple: when you feel "the cost of explaining is already higher than the cost of reopening," reopen.

## 4. How to get it to "remember" your long-term preferences, be sure to tell apart two layers

By here you might ask: if I start fresh from a clean desk every time, what about the **long-term preferences I have to state every time** ("answer in Chinese," "more professional tone," "I work in education")? Do I have to repeat them in every new conversation?

This brings up the point this chapter most needs to make clear. Let me nail down that ironclad rule from Chapters 3 and 9 once more here.

The model **itself** has no memory across conversations: each new conversation is a **completely empty desk** to it, and it knows **nothing** about your long-term preferences. So "by default," yes, the background you need has to be stated in this conversation.

But you've probably also seen products that can "remember" you, and this is exactly where the key distinction lies:

> The model **itself** really has no memory across conversations; but **many products add a "memory" ability at the "product layer" outside the model**: things like **long-term memory, project memory, account-level preferences, a company knowledge base** (ones you'll run into include Claude's Projects, ChatGPT's Memory, project context files in coding tools, "personalization / custom instructions" settings in your account). But this **is not the model itself growing a memory; it's the product layer automatically stuffing this information back into this conversation's context each time** — back to that "desk" from Chapter 3: **when it "remembers," that's essentially the product spreading what should be remembered back onto the desk for you each time.** So seeing these features is no contradiction. Exactly how each one remembers, how long, whether it's on or off by default, and whether you can view or delete it — refer to the provider's official documentation.

Telling these two layers apart beats memorizing any one product's buttons:

| | The model itself | The product layer's "memory / preferences" |
| --- | --- | --- |
| Remembers your long-term preferences | **No**, every new conversation starts blank | Saves your preferences for you |
| How it does it | (n/a) | **Each conversation, automatically stuffs these preferences back into this context** (that desk from Chapter 3) |
| The boundary of what it can "remember" | (n/a) | Always only **the part the product decides to put back on the desk**; what's not put back, it still doesn't know |

Once you understand the mechanism, the usage follows: **preferences you want it to remember long-term, fill them into the product's "memory / project / custom instructions" feature**, so the product automatically spreads them back onto the desk for you each time you open a new conversation, and you don't have to repeat them. But know this in your gut:

> **Key point:** What it can "remember" is **always only the part the product stuffs back into context for you**; something you think it should remember but the product didn't put back this time, it just doesn't know. This also explains why it sometimes "inexplicably forgets" a preference you set: most likely that piece of information wasn't put back on the desk this time — **not a bug, but how "product-layer memory" works.** Two more things to keep in mind: (1) the exact behavior of these features differs by vendor and keeps changing, so refer to the provider's official documentation; (2) since preferences get "re-fed into every conversation," **don't store sensitive information as a preference** (privacy in Chapter 37).

## 5. A practical flow that ties it together

Put this chapter and the last two together and you have a handy daily flow:

```text
1) One real task -> open one dedicated conversation (habit one)
2) State the requirements clearly in the first sentence (Chapter 11: context, task,
   constraints, format)
3) Long material? Feed it in chunks, have it answer from the material only (Chapter 12)
4) Back-and-forth polishing; the moment it contradicts itself / repeatedly forgets
   requirements / gets long-winded -> open a new conversation and start over (habit two)
5) Long-term preferences you need every time -> hand them to the product's "memory /
   custom instructions" to remember (section 4; refer to the official docs)
```

> **How you'll actually run into this:** The most typical scene: you and it polish a draft back and forth, the first 10 turns getting better and better, and from turn 15 it starts ignoring new requirements and rehashing the wording you long rejected. Don't rush to blame it: open a new conversation, paste over "the version you're happiest with right now," and add "based on this version, only change XX," and it instantly sobers up. This move — **carry the good intermediate results to a clean desk and leave the scrapped drafts in the old conversation** — you'll use over and over.

## 6. Common misconceptions, corrected

| Common misconception | Reality |
| --- | --- |
| Getting "dumber the longer you talk" means it broke / got dumber | It's the **normal behavior** of limited context: key points buried, contradictions piling up, details compressed (Chapter 3) |
| When it drifts, reminding it repeatedly in the original conversation will correct it | Adding more paper to a full desk usually makes it messier; you should **open a new conversation** and start clean |
| Chatting about everything in one conversation is most convenient | Once topics mix it cross-contaminates; **one topic, one conversation**, one thing's material per desk |
| Setting "memory / preferences" means the model itself remembers me | It's the **product layer** stuffing preferences back into context each time, not the model itself remembering; refer to the official docs |
| It "forgot" a preference I set, so the product is broken | Most likely that information wasn't put back on the desk this time — that's how product-layer memory works, not a bug |
| Long-term preferences can only be repeated manually each time | Save them in the product's "memory / project / custom instructions" feature and it re-feeds them for you each time (refer to the official docs) |

## Summary

- The root of "dumber the longer you talk": the longer the conversation, the fuller the desk — **key points buried, contradictions piling up, details compressed** (Chapter 3), not it getting dumber or breaking.
- Habit one: **one topic, one conversation**, don't pile unrelated things on one desk, or it cross-contaminates.
- Habit two: when you see it **contradict itself, repeatedly forget requirements, get long-winded, clearly lose memory**, decisively **open a new conversation** and lay out the still-needed information again cleanly (using the Chapter 11 craft); carry the good intermediate results over, leave the scrapped drafts.
- The judgment rule: when **the cost of explaining > the cost of reopening**, reopen; agonizing in a messy conversation usually just makes it messier.
- Long-term preferences: the model **itself has no memory across conversations**; to have it "remember," use the **product layer's** "memory / project / custom instructions" — that's the product **stuffing preferences back into this context** each time, not the model itself remembering (refer to the official docs).
- Two reminders: product memory means "what's not put back, it doesn't know" (not a bug); **don't store sensitive information as a preference** (Chapter 37).

That wraps up Part Two's "conversation basics." In the next chapter we go a step further: how to take it from "one question, one answer" to **continuously pushing a task forward**, which is the AI workflow (Chapter 14).

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** What's the most accurate explanation for a conversation getting "dumber the longer you talk"?
   - A. The model gets tired and its ability declines after talking a while
   - B. The longer the conversation, the fuller the desk (context), causing key points to be buried, contradictions to pile up, details to be compressed
   - C. It's deliberately giving you a half-hearted answer
   - D. It's caused by the network slowing down
   > **Answer: B.** This is the normal behavior of limited context (Chapter 3), not it getting dumber or breaking. Every new sentence it gets, the software resends the whole conversation, and the longer it is the messier. A anthropomorphizes it (it doesn't "get tired"); C overthinks it (it has no intentions); D misses the question.

2. **[Basic · Concept]** Which is a typical signal that "it's time to open a new conversation"?
   - A. It answered very well the first time
   - B. It starts contradicting itself, repeatedly ignoring requirements you set, getting long-winded and circular
   - C. You just opened the chat box
   - D. It answers very concisely
   > **Answer: B.** Contradicting itself, repeatedly forgetting requirements, and getting more and more long-winded are all signals that "the desk is full and noise drowns the signal" — see them and switch to a clean desk. A, C, and D are exactly when it's in good shape or just starting, with no need to reopen.

3. **[Advanced · Misconception]** "When it starts drifting and forgetting my requirements, I just remind and correct it over and over in this conversation, and I can always pull it back." What's the problem?
   - A. No problem, just remind it a few more times
   - B. Correcting it over and over on an already-full desk is usually "adding more paper to a full desk," making it messier; more effective is to **open a new conversation** and start clean
   - C. Its drifting means the model is broken and should be sent for repair
   - D. You should turn the temperature up and try again
   > **Answer: B.** The root of drifting is the desk being too full (Chapter 3), and adding more content to the original conversation only fills it more. The right move is to open a new conversation and lay out the still-needed information again. People who make this mistake take "context is full" for "it didn't understand, so just say it again." C treats normal behavior as a fault; D is completely unrelated (higher temperature only makes it more unmoored, Chapter 8).

4. **[Advanced · Misconception]** "I set up 'memory' in a product and it can remember my preferences, which means the model itself has memory across conversations." What's off?
   - A. Completely correct, the model itself remembers you
   - B. That's the **product layer** automatically stuffing preferences back into this conversation's context each time, not the model itself growing a memory; what it can remember is only the part the product puts back
   - C. It means this model is more advanced than others
   - D. It means your preferences were permanently written into the model's parameters
   > **Answer: B.** The key is telling apart two layers: the model itself has no memory across conversations, and "memory / preferences" is the product layer re-feeding information into context each time (that desk from Chapter 3). So what it "remembers" is always the part the product decides to put back; what's not put back, it doesn't know (which is also why it occasionally "forgets" preferences — not a bug). For the exact behavior, refer to the official docs. D is a deeper misconception: product-layer memory doesn't alter the model's parameters.

5. **[Basic · Scenario]** You and the AI are polishing a draft back and forth, it goes well early on, then later it starts ignoring new requirements and rehashing wording you rejected. What's the best move?
   - A. Repeat the requirements five more times in the original conversation
   - B. Open a new conversation, paste over "the version you're happiest with right now," add "based on this version only change XX," and don't carry the scrapped drafts
   - C. Delete the whole conversation and rewrite the draft from scratch
   - D. Turn off the computer and chat again after a while
   > **Answer: B.** This is the chapter's signature move: carry the good intermediate results to a clean desk, leave the scrapped drafts in the old conversation. A is "adding more paper to a full desk" (makes it messier); C is too wasteful (you lose the good version too); D is useless (it doesn't "rest and recover," the problem is the desk being too full, not it being tired).

6. **[Basic · Hands-on]** If the product you usually use offers "memory / custom instructions / project" features, go fill in a long-term preference you state every time (such as "answer in Chinese, professional tone, I work in education") (**for the exact location and behavior, refer to the official docs**). Then open two or three brand-new conversations and observe whether it "knows" this preference from the start. At the same time, think about: which information **shouldn't** be stored this way long-term?
   > **What you should notice:** Once filled in, new conversations often follow this preference from the start, but this isn't "the model remembering you" — it's **the product spreading this preference back into this conversation's context for you each time** (that desk from Chapter 3). So what it can "remember" is always only the part the product puts back. Also be careful: since preferences get re-fed into every conversation, **sensitive information (passwords, ID numbers, trade secrets) should never be stored as a preference** (Chapter 37). Features differ by vendor and keep changing, so refer to the official docs.
