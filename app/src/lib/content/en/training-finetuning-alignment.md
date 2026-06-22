By now you know how the model cuts text into tokens (Chapter 3), how it adds words one at a time (Chapter 4), and how it underlines what matters with attention (Chapter 6). But a more basic question hasn't been answered: **it started out knowing nothing, so how was it "taught" into what it is now**?

A freshly "born" model has random parameters and can't do anything. The one you see today, the one that understands plain speech, answers in the right format, and is rather polite, isn't born that way. It's **tuned into shape step by step across three stages**. Understand these three steps and you'll suddenly make sense of a lot of odd things: why it's sometimes overly polite, slaps on disclaimers at the drop of a hat, and likes to dodge; why people say "an unaligned model talks nonsense"; and why "it has its own stance" is a misunderstanding.

## 1. Three stages, one table

Turning a "bare model" into a usable assistant takes three steps. Here's the whole picture first:

| Stage | In one line | What it's learning | An analogy |
| --- | --- | --- | --- |
| **Pre-training** | Read huge amounts of text, practice "guess the next word" | **A feel for language**: how words connect, roughly how the world is | A widely read person who has read everything |
| **Fine-tuning** | Catch up using "instruction, then good answer" examples | **Doing as told**: understanding instructions, answering to spec and format | Teaching that well-read person how to "answer properly, your way" |
| **Alignment** | Use human feedback to teach it judgment | **Tact**: helpful, honest, harmless | Setting rules: what to say, what not to, and how to say it appropriately |

Let's take them apart one by one. They're **stacked layer on layer**: without the feel for language from step one, the later two have nothing to stand on; without the later two, what step one learned **can't be used directly at all**.

## 2. Pre-training: read huge amounts of text, learn a "feel for language"

The first step, and the most time-consuming and expensive: have the model read **huge amounts of text** (web pages, books, code, and so on) and repeatedly practice that thing from Chapter 4, **guessing the most likely next word given what came before**.

Guess right and its parameters get nudged so it's more accurate next time; guess wrong and they get nudged back. After billions of guesses, the patterns of language (how words go together, how sentences flow, roughly what common sense about the world looks like) get "pressed" bit by bit into its parameters. The product of this step is called the **base model**.

But here's the key, and most counterintuitive, point:

> **Key point:** A model fresh out of pre-training has learned "**how to carry on a piece of text convincingly**," **not** "how to answer your question." Ask it "what's the capital of France?" and it may well not answer "Paris" directly but instead carry on with "…and what's the capital of Germany? what's the capital of Italy?", because on the web pages it has read, sentences like this are **often** followed by more questions of the same kind. It's **continuing the text**, not **responding**. That's why a base model used straight for chat tends to be "disobedient."

Now it's clear why the next two steps are needed: with a feel for language alone, it only "carries on," it **doesn't "do what you say."**

## 3. Fine-tuning: from "knows how to add words" to "knows how to do as told"

The second step, **fine-tuning**: on top of the base model, train further on a batch of **carefully prepared "instruction, then good answer" examples**.

These examples look like this: show it lots of pairs of "**a person made a request → a good response**", such as "please summarize this passage into three points → (a nicely done three-point summary)", "help me write an apology email → (a tactful email)". After seeing enough examples like this, it shifts from "carry on whatever it sees" to "**receive an instruction, give the matching response**."

An analogy: pre-training brought in a widely read person, but he only talks on to himself; fine-tuning is teaching him hand over hand, "when someone speaks to you, you **respond**, and in the way they asked for."

> **How you'll actually run into this:** The reason you can talk with it like talking to a person, the reason you can have it "list this in a table," "keep it under two hundred words," or "play the interviewer," these "obedient, format-respecting" skills mostly come from fine-tuning. Every chat product you use day to day is built on a model that has been through this step (and the next one), not the "bare model" from section 2 that can only carry on text.

## 4. Alignment: teaching it "helpful, honest, harmless"

Doing as told still isn't enough. The third step, **alignment**: tune its behavior toward the three directions of "**helpful, honest, harmless**," so its answers fit human intent and bottom-line values better.

A common method is to have **people** give feedback: for the same question, the model gives several different answers, and people rank them, which is better, which should be killed; then these "human preferences" are used to train it further, so it's more inclined to give the kind of answer people like and trust (this mainstream method is called "reinforcement learning from human feedback," RLHF in English, and knowing the name exists is enough).

Why is this step a must? Because a model that has only learned a feel for language and then learned to do as told, but **hasn't been through alignment**, will "talk nonsense":

- Ask it something dangerous or harmful and it might just teach you, step by step;
- Ask it something it's unsure of and it tends to **make up a plausible answer** rather than say "I'm not sure";
- It soaks up and spits out all kinds of bias and profanity wholesale.

Alignment is setting rules for this "well-read, obedient, but tactless" assistant: what it can't say, when it should admit "I don't know," and how to say things without offending people.

> **Key point:** "An unaligned model talks nonsense" traces back to Chapter 4: its nature is to chase "**looking real, looking right**," not "being real, being right." Alignment can largely hold down this tendency, making it more honest and safer; but it **only lowers the risk, it doesn't remove it**. So even with an aligned model, you still have to double-check important facts yourself (Chapter 9 covers this in detail).

### A side effect of alignment: those "little quirks" that annoy you

Here's something often misunderstood, spelled out for you. While alignment keeps risks in check, it **also brings side effects**. A lot of the quirks that annoy you come precisely from this step being "overdone" or "playing it safe":

| What you run into | Is actually a side effect of alignment |
| --- | --- |
| Slapping on a long string of disclaimers at the drop of a hat | Trained to "rather over-warn than take the blame" |
| Over-politeness, going in circles, refusing to give a straight answer | Trained to "rather be roundabout than offend" |
| Clearly able to answer, yet dodging with "I'm just an AI" | Trained to "if unsure, don't answer, don't cause trouble" |

Knowing these **aren't it being dumb or malfunctioning, but caution deliberately tuned in**, you won't be puzzled, and you can treat the cause: spell out the boundaries in your prompt ("this is for general-audience explanation, please give the conclusion directly, no need for disclaimers") and it'll often loosen up (Chapter 11 covers how to phrase it). How far each company tunes this "tact" varies and keeps changing, so check the official docs.

## 5. The misconception most worth clearing up: does it have its own stance?

This is the chapter's most important section.

When it politely declines a request, or weighs every word on a sensitive topic, it's easy to feel: **it has its own values / stance / consciousness, it "doesn't want" to say this.** That's a very natural feeling, but not accurate.

Every "attitude" it shows (gentle, cautious, evasive, holding to some bottom line) is **a behavior pattern tuned by the three training steps above (especially alignment)**, not what it "wants" or "believes" inside. Lift the lid and underneath is still that thing from Chapter 4: **a system that computes probabilities from what came before and picks the next word.** What alignment changes is "which kind of words it tends to put out" in various situations, not installing a heart that judges right from wrong or has likes and dislikes.

| | Looks like | Actually is |
| --- | --- | --- |
| It "holds" a stance | It has beliefs | Training tuned "respond this way on this topic" to high probability |
| It "refuses" you | It's "unwilling" | This kind of request was marked by alignment as one to avoid |
| It's "very polite" | It "has a good personality" | Polite wording got rewarded over and over and became its default |

> **Key point:** Understanding its "attitude" as **trained behavior** rather than **its own conviction** has two benefits: first, you won't be led around by its tone into thinking it's speaking for someone or really has a stance; second, it explains why its "personality" changes across products and versions, because that was **tuned** by each company in the first place, not something inherent to "itself." It has no "self."

## 6. Common misconceptions, set straight

| Common misconception | Reality |
| --- | --- |
| The model was made by people writing out rules one by one | It's **trained**: read huge amounts of text for a feel for language, then tune behavior with examples and human feedback; nobody writes out line by line how it should answer |
| After pre-training it can be used as a chat assistant directly | That's just a base model that can "carry on text," it **doesn't respond**; it still needs fine-tuning (learning to do as told) and alignment (learning tact) |
| Fine-tuning "stores" new knowledge into the model as fact | Fine-tuning mainly tunes **behavior and style** (obedient, format-respecting); to have it use your private material, RAG (Chapter 20) is the better fit |
| After alignment it's absolutely safe and reliable | Alignment only **lowers** the risk, doesn't remove it; and it brings side effects like over-politeness, overuse of disclaimers, and a habit of dodging |
| It has its own stance / consciousness / values | That's **behavior tuned by training**, not what it "wants." Underneath it's still a system picking words by probability, with no conviction and no "self" |

## Summary

- Turning a bare model into a usable assistant takes three steps: **pre-training** (read huge amounts of text for a feel for language) → **fine-tuning** (learn to do as told and respect format using examples) → **alignment** (learn helpful, honest, harmless using human feedback).
- The **base model** after pre-training only "carries on text," it doesn't "respond." Used straight for chat it's disobedient, which is exactly why the latter two steps exist.
- **Alignment** makes it safer and more honest, but only lowers the risk, doesn't remove it; it also brings **side effects** like over-politeness, overuse of disclaimers, and a habit of dodging.
- The thing most worth clearing up: its "attitude / stance" is **behavior tuned by training**, not consciousness or conviction. Its "personality" changes across versions precisely because it was tuned.
- Even after alignment, important facts still need your own double-check (Chapter 9); to feed it private material, use RAG rather than counting on fine-tuning (Chapter 20).

In the next chapter we move from "how it was taught" to "what you can adjust when you use it," the two knobs most worth knowing: temperature and reasoning effort.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** Which one matches the order and division of labor of the three stages that turn a "bare model" into a usable assistant?
   - A. Alignment → fine-tuning → pre-training
   - B. Pre-training (learn a feel for language) → fine-tuning (learn to do as told) → alignment (learn tact)
   - C. Pre-training (learn politeness) → alignment (learn grammar) → fine-tuning (learn knowledge)
   - D. Pre-training alone is enough
   > **Answer: B.** First read huge amounts of text for a feel for language, then learn to do as told and respect format using examples, finally learn "helpful, honest, harmless" using human feedback. A reverses the order (without the earlier step, the later one has nothing to stand on); C mismatches what each step learns; D ignores that the base model only carries on text and doesn't respond.

2. **[Basic · Concept]** Which statement about the base model produced by "pre-training" is correct?
   - A. It can already respond to your questions like a chat assistant
   - B. It mainly "carries text on" (continuation), and won't necessarily respond to your instructions directly
   - C. It stored the full text of the web pages it read, available for lookup
   - D. It has already learned politeness and disclaimers
   > **Answer: B.** Pre-training teaches "how to carry on text convincingly," so when you ask it a question it may carry on with a string of similar questions rather than answer. A and D are filled in only by the later two steps (fine-tuning, alignment); C is a common misconception, since it learns patterns, not stored originals (there's no lookup-able archive of original documents in the parameters).

3. **[Advanced · Misconception]** It politely declined a request of yours, and someone says "see, it has its own values and stance." What's wrong with this judgment?
   - A. Nothing, this shows it has consciousness
   - B. That's a behavior pattern tuned by the three training steps (especially alignment); underneath it's still a system picking words by probability, with no "wanting" or "believing"
   - C. It declined only after consulting a "moral rulebook"
   - D. It must have malfunctioned to decline
   > **Answer: B.** Its "attitude" is high or low probability tuned by reward/penalty in training, not an inner conviction, which also explains why its "personality" changes across versions. A is classic anthropomorphizing; C imagines it as a rule-checking program (its behavior comes from training, not line-by-line rules); D mistakes normal alignment behavior for a malfunction.

4. **[Advanced · Misconception]** "It always loves to pile on disclaimers and go in circles instead of giving a straight answer, which shows this model is dumb." What's wrong?
   - A. Completely correct, it's just dumb
   - B. This is mostly a **side effect of alignment**, trained to "rather play it safe than take the blame," not a capability problem, and it can be eased by spelling out the boundaries in your prompt
   - C. It's because it isn't connected to the internet
   - D. It's because the context window is full
   > **Answer: B.** Over-politeness, overuse of disclaimers, and a habit of dodging come precisely from alignment's "rather play it safe" tuning, not from being dumb. Treating it as dumb makes you underrate it; understanding it as "tuned to be cautious," you'll use your prompt to spell out the purpose and boundaries (Chapter 11). C and D are phenomena from other chapters and have nothing to do with this.

5. **[Basic · Scenario]** You need it to give the conclusion directly, for general-audience explanation, but every time it leads with a long "I'm just an AI, please consult a professional." What's the most effective move?
   - A. Repeatedly scold it to "cut the nonsense"
   - B. State the purpose and requirements in your prompt, for example "this is general-audience explanation, please give the conclusion directly, no need for disclaimers"
   - C. Conclude it's unusable and switch products
   - D. Send the same sentence ten times in a row
   > **Answer: B.** Its caution is a default tuned by alignment; spell out the scenario and boundaries and it'll often loosen up and give the conclusion directly. A is emotional and ineffective; C overreacts (this is tunable behavior, not a defect); D ignores that output carries randomness, so resending doesn't fix it (Chapter 8).

6. **[Basic · Hands-on]** Take the same slightly sensitive or boundary-blurry question and ask it two ways: **as a single bare sentence**, and **with the "purpose, audience, and degree you want" spelled out**, then compare the two answers. Observe: after you add context, does its "level of caution" and "whether it gives the conclusion directly" change?
   > **What you should notice:** In most cases, once you spell out the purpose and boundaries, it'll be noticeably more direct with fewer disclaimers, which confirms that its "attitude" is **behavior tuned by training and also influenceable by your prompt**, not an inherent stance of its own. How far each company tunes this tact varies and keeps changing, so check the official docs. Compare it once yourself and you'll get that "how you say it" matters far more than "whether it's dumb."
