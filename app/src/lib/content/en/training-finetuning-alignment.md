By now you know how the model cuts text into tokens (Chapter 3), how it adds words one at a time (Chapter 4), and how it underlines what matters with attention (Chapter 6). But a more basic question hasn't been answered: **it started out knowing nothing, so how was it "taught" into what it is now**?

A model gets its capabilities through training. This chapter uses **pre-training, fine-tuning, and alignment** to explain how it becomes an assistant, but these are not three separate stages that every model must follow in order. Understanding them also helps explain format-following, cautious responses, and differences in tone across products.

## 1. Three concepts, one table

Start with a simplified training route: pre-training develops broad capabilities, later training improves task performance, and alignment is a goal of matching human intent that can span several parts of training.

| Concept | In one sentence | What it learns | An analogy |
| --- | --- | --- | --- |
| **Pre-training** | Read huge amounts of text, practice "guess the next word" | **A feel for language**: how words connect, roughly how the world is | A widely read person who has read everything |
| **Fine-tuning** | Catch up using "instruction, then good answer" examples | **Doing as told**: understanding instructions, answering to spec and format | Teaching that well-read person how to "answer properly, your way" |
| **Alignment** | Use human feedback to teach it judgment | **Tact**: helpful, honest, harmless | Setting rules: what to say, what not to, and how to say it appropriately |

**These concepts overlap, and training recipes vary.** Instruction fine-tuning is one kind of fine-tuning; alignment can use supervised or preference-based learning, among other methods. Base models can be useful for completion, research, or tasks demonstrated in a prompt, even if they are less reliable as conversational assistants.

## 2. Pre-training: read huge amounts of text, learn a "feel for language"

The first step, and the most time-consuming and expensive: have the model read **huge amounts of text** (web pages, books, code, and so on) and repeatedly practice that thing from Chapter 4, **guessing the most likely next word given what came before**.

Training compares the predicted probabilities with the actual next token, measures the error, and adjusts the parameters in a direction that reduces it; a wrong guess does not undo the previous update. After billions of guesses, the patterns of language (how words go together, how sentences flow, roughly what common sense about the world looks like) get "pressed" bit by bit into its parameters. The product of this step is called the **base model**.

But here's the key, and most counterintuitive, point:

> **Key point:** Pre-training primarily predicts subsequent text; **it does not guarantee reliable instruction-following in chat**. Asked “What is the capital of France?”, a base model might answer “Paris” or continue listing similar questions, depending on the model and context. It is not incapable of answering, but that ability alone does not make it a reliable chat assistant.

Later training helps apply existing capabilities more consistently to instructions, formats, and tasks; it does not create all question-answering ability from scratch.

## 3. Fine-tuning: from "knows how to add words" to "knows how to do as told"

**Fine-tuning** means further training an existing model. This section uses **instruction fine-tuning** as an example, with carefully prepared instruction-and-answer pairs. Fine-tuning can also change knowledge, specialist skills, and task performance, not just style; it is not a reliably searchable database whose facts can be updated one by one.

These examples look like this: show it lots of pairs of "**a person made a request → a good response**", such as "please summarize this passage into three points → (a nicely done three-point summary)", "help me write an apology email → (a tactful email)". After seeing enough examples like this, it shifts from "carry on whatever it sees" to "**receive an instruction, give the matching response**."

An analogy: pre-training brought in a widely read person, but he only rambles on to himself; fine-tuning is teaching him hand over hand, "when someone speaks to you, you **respond**, and in the way they asked for."

> **How you'll actually run into this:** Later training such as instruction fine-tuning often improves requests like “list this in a table” or “keep it under two hundred words.” Pre-training, prompts, tools, and product settings also influence the result. Not every chat model follows the same three-stage recipe.

## 4. Alignment: teaching it "helpful, honest, harmless"

**Alignment** is the goal of making behavior better match human intentions and requirements, including helpfulness, honesty, and safety. Fine-tuning and other training methods can contribute to it; it need not be a separate third stage after fine-tuning.

A common method is to have **people** give feedback: for the same question, the model gives several different answers, and people rank them — which is better, which should be thrown out; then these "human preferences" are used to train it further, so it's more inclined to give the kind of answer people like and trust (this mainstream method is called "reinforcement learning from human feedback," RLHF in English, and knowing the name exists is enough).

Why is this step a must? Because a model that has only learned a feel for language and then learned to do as told, but **hasn't been through alignment**, will "talk nonsense":

- Ask it something dangerous or harmful and it might just teach you, step by step;
- Ask it something it's unsure of and it tends to **make up a plausible answer** rather than say "I'm not sure";
- It soaks up and spits out all kinds of bias and profanity wholesale.

Alignment is setting rules for this "well-read, obedient, but tactless" assistant: what it can't say, when it should admit "I don't know," and how to say things without offending people.

> **Key point:** "An unaligned model talks nonsense" traces back to Chapter 4: its nature is to chase "**looking real, looking right**," not "being real, being right." Alignment can largely hold down this tendency, making it more honest and safer; but it **only lowers the risk — it doesn't remove it**. So even with an aligned model, you still have to double-check important facts yourself (Chapter 9 covers this in detail).

### A side effect of alignment: those "little quirks" that annoy you

Here's something often misunderstood, spelled out for you. While alignment keeps risks in check, it **also brings side effects**. A lot of the quirks that annoy you come precisely from this step being "overdone" or "playing it safe":

| What you run into | Is actually a side effect of alignment |
| --- | --- |
| Slapping on a long string of disclaimers at the drop of a hat | Trained to "rather over-warn than take the blame" |
| Over-politeness, going in circles, refusing to give a straight answer | Trained to "rather be roundabout than offend" |
| Clearly able to answer, yet dodging with "I'm just an AI" | Trained to "if unsure, don't answer, don't cause trouble" |

Knowing these **aren't it being dumb or malfunctioning, but caution deliberately tuned in**, you won't be puzzled, and you can treat the cause: spell out the boundaries in your prompt ("this is for general-audience explanation, please give the conclusion directly, no need for disclaimers") and it'll often loosen up (Chapter 11 covers how to phrase it). How far each company tunes this "tact" varies and keeps changing, so refer to the provider's official documentation.

## 5. The misconception most worth clearing up: does it have its own stance?

This is the chapter's most important section.

When it politely declines a request, or weighs every word on a sensitive topic, it's easy to feel: **it has its own values / stance / consciousness, it "doesn't want" to say this.** That's a very natural feeling, but not accurate.

Every "attitude" it shows (gentle, cautious, evasive, holding to some bottom line) is **a behavior pattern tuned by training (especially alignment-related training) and product instructions**, not what it "wants" or "believes" inside. Lift the lid and underneath is still that thing from Chapter 4: **a system that computes probabilities from what came before and picks the next word.** What alignment changes is "which kind of words it tends to put out" in various situations, not installing a heart that judges right from wrong or has likes and dislikes.

| | Looks like | Actually is |
| --- | --- | --- |
| It "holds" a stance | It has beliefs | Training tuned "respond this way on this topic" to high probability |
| It "refuses" you | It's "unwilling" | This kind of request was marked by alignment as one to avoid |
| It's "very polite" | It "has a good personality" | Polite wording got rewarded over and over and became its default |

> **Key point:** Understanding its "attitude" as **trained behavior** rather than **its own conviction** has two benefits: first, you won't be led around by its tone into thinking it's speaking for someone or really has a stance; second, it explains why its "personality" changes across products and versions, because that was **tuned** by each company in the first place, not something inherent to "itself." It has no "self."

## 6. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| The model was made by people writing out rules one by one | It's **trained**: read huge amounts of text for a feel for language, then tune behavior with examples and human feedback; nobody writes out line by line how it should answer |
| Pre-training guarantees a reliable chat assistant | A base model may answer questions, but pre-training does not guarantee reliable instruction-following; later training often improves task performance and safety |
| Fine-tuning only changes style, or works as a reliable fact database | It can also change knowledge and capabilities, but may learn facts incompletely or introduce errors. For changing private material that needs citations, usually consider RAG first (Chapter 20); the two can also be combined |
| After alignment it's absolutely safe and reliable | Alignment only **lowers** the risk, doesn't remove it; and it brings side effects like over-politeness, overuse of disclaimers, and a habit of dodging |
| It has its own stance / consciousness / values | That's **behavior tuned by training**, not what it "wants." Underneath it's still a system picking words by probability, with no conviction and no "self" |

## Summary

- **Pre-training, fine-tuning, and alignment** describe developing broad capabilities, adapting to tasks, and matching human intentions. They overlap, and there is more than one training recipe.
- A **base model** primarily learns text continuation and may answer questions or perform other tasks. Reliable instruction-following is not guaranteed; later training can improve it.
- **Alignment** makes it safer and more honest, but only lowers the risk, doesn't remove it; it also brings **side effects** like over-politeness, overuse of disclaimers, and a habit of dodging.
- The thing most worth clearing up: its "attitude / stance" is **behavior tuned by training**, not consciousness or conviction. Its "personality" changes across versions precisely because it was tuned.
- Even after alignment, verify important facts (Chapter 9). Fine-tuning and RAG serve different purposes; for current private material with traceable sources, usually consider RAG first, possibly combined with fine-tuning (Chapter 20).

In the next chapter we move from "how it was taught" to "what you can adjust when you use it" — the two knobs most worth knowing: temperature and reasoning effort.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** In this chapter's simplified introductory example, which option best describes the main roles along a common training route? <!-- quiz: q01 revision: 1 -->
   - A. Pre-training (learn a feel for language) → fine-tuning (learn to do as told) → alignment (learn tact)
   - B. Alignment → fine-tuning → pre-training
   - C. Pre-training alone is enough
   - D. Pre-training (learn politeness) → alignment (learn grammar) → fine-tuning (learn knowledge)
   > **Answer: A.** This is a simplified common route: develop broad capabilities, then improve instruction-following and behavioral preferences. Alignment is a goal that can overlap with fine-tuning; not every model passes through three separate stages. B and D do not match this example; C equates pre-training with a reliable chat assistant.

2. **[Basic · Concept]** Which statement about the base model produced by "pre-training" is correct? <!-- quiz: q02 revision: 1 -->
   - A. It is already guaranteed to follow every instruction reliably like a chat assistant
   - B. It is already guaranteed to be polite and use disclaimers appropriately in every situation
   - C. It stored the full text of the web pages it read, available for lookup
   - D. It mainly "carries text on" (continuation), and won't necessarily respond to your instructions directly
   > **Answer: D.** Pre-training mainly predicts subsequent text; a model might answer a question or continue listing questions. A and B wrongly claim guarantees; later training can improve those behaviors. C treats parameters as a complete searchable document archive: some original wording may be memorized, but complete storage and accurate retrieval are not guaranteed.

3. **[Advanced · Misconception]** It politely declined a request of yours, and someone says "see, it has its own values and stance." What's wrong with this judgment? <!-- quiz: q03 revision: 1 -->
   - A. Nothing, this shows it has consciousness
   - B. It declined only after consulting a "moral rulebook"
   - C. That's a behavior pattern tuned by training (especially alignment-related training) and product instructions; underneath it's still a system picking words by probability, with no "wanting" or "believing"
   - D. It must have malfunctioned to decline
   > **Answer: C.** Its "attitude" is high or low probability tuned by reward/penalty in training, not an inner conviction, which also explains why its "personality" changes across versions. A is classic anthropomorphizing; B imagines it as a rule-checking program (its behavior comes from training, not line-by-line rules); D mistakes normal alignment behavior for a malfunction.

4. **[Advanced · Misconception]** "It always loves to pile on disclaimers and go in circles instead of giving a straight answer, which shows this model is dumb." What's wrong? <!-- quiz: q04 revision: 1 -->
   - A. Completely correct, it's just dumb
   - B. This is mostly a **side effect of alignment**, trained to "rather play it safe than take the blame," not a capability problem, and it can be eased by spelling out the boundaries in your prompt
   - C. It's because the context window is full
   - D. It's because it isn't connected to the internet
   > **Answer: B.** Over-politeness, overuse of disclaimers, and a habit of dodging come precisely from alignment's "rather play it safe" tuning, not from being dumb. Treating it as dumb makes you underrate it; understanding it as "tuned to be cautious," you'll use your prompt to spell out the purpose and boundaries (Chapter 11). D and C are phenomena from other chapters and have nothing to do with this.

5. **[Basic · Scenario]** You need it to give the conclusion directly, for general-audience explanation, but every time it leads with a long "I'm just an AI, please consult a professional." What's the most effective move? <!-- quiz: q05 revision: 1 -->
   - A. Repeatedly scold it to "cut the nonsense"
   - B. Conclude it's unusable and switch products
   - C. State the purpose and requirements in your prompt, for example "this is general-audience explanation, please give the conclusion directly, no need for disclaimers"
   - D. Send the same sentence ten times in a row
   > **Answer: C.** Its caution is a default tuned by alignment; spell out the scenario and boundaries and it'll often loosen up and give the conclusion directly. A is emotional and ineffective; B overreacts (this is tunable behavior, not a defect); D ignores that output carries randomness, so resending doesn't fix it (Chapter 8).

6. **[Basic · Hands-on]** Take the same slightly sensitive or boundary-blurry question and ask it two ways: **as a single bare sentence**, and **with the "purpose, audience, and degree you want" spelled out**, then compare the two answers. Observe: after you add context, does its "level of caution" and "whether it gives the conclusion directly" change? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** In most cases, once you spell out the purpose and boundaries, it'll be noticeably more direct with fewer disclaimers, which confirms that its "attitude" is **behavior tuned by training and also influenceable by your prompt**, not an inherent stance of its own. How far each company tunes this tact varies and keeps changing, so refer to the provider's official documentation. Compare it once yourself and you'll get that "how you say it" matters far more than "whether it's dumb."
