By now you know how the model cuts text into tokens (Chapter 3), how it adds words one at a time (Chapter 4), and how it underlines what matters with attention (Chapter 6). But a more basic question hasn't been answered: **it started out knowing nothing, so how was it "taught" into what it is now**?

A model gets its capabilities through training. This chapter uses **pre-training, fine-tuning, and alignment** to explain how it becomes an assistant, but these are not three separate stages that every model must follow in order. Understanding them also helps explain format-following, cautious responses, and differences in tone across products.

## 1. Three concepts, one table

Start with a simplified training route: pre-training develops broad capabilities, later training improves task performance, and alignment is a goal of matching human intent that can span several parts of training.

| Concept | In one sentence | What it learns | An analogy |
| --- | --- | --- | --- |
| **Pre-training** | Read huge amounts of text, practice "guess the next word" | **A feel for language**: how words connect, roughly how the world is | A widely read person who has read everything |
| **Fine-tuning** | Catch up using "instruction, then good answer" examples | **Doing as told**: understanding instructions, answering to spec and format | Teaching that well-read person how to "answer properly, your way" |
| **Alignment** | Make its behavior match human intentions (a goal, reached by several methods) | **Tact**: helpful, honest, harmless | Setting rules: what to say, what not to, and how to say it appropriately |

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

There's more than one way to pursue alignment. An early, well-known method is **reinforcement learning from human feedback** (RLHF): people rank several of the model's answers to the same question, and those preferences are used to train it further, so it leans toward answers people approve of and trust. Later came methods where an AI compares answers against a written set of principles, replacing part of the human labeling (AI feedback, RLAIF), and preference optimization methods such as DPO that learn directly from pairs of "this answer is better than that one" without training a separate scoring model. Reasoning models are also often trained with reinforcement learning on tasks whose answers can be checked automatically, like math and coding, rewarded when they get it right; this mainly builds reasoning ability. How each company combines these is usually not fully disclosed, so knowing the names is enough.

Why is this step a must? Because a model that has only learned a feel for language and then learned to do as told, but **hasn't been through alignment**, will "talk nonsense":

- Ask it something dangerous or harmful and it might just teach you, step by step;
- Ask it something it's unsure of and it may lean toward **making up a plausible answer** rather than saying "I'm not sure";
- It soaks up and spits out all kinds of bias and profanity wholesale.

Alignment is setting rules for this "well-read, obedient, but tactless" assistant: what it can't say, when it should admit "I don't know," and how to say things without offending people.

> **Key point:** "An unaligned model talks nonsense" traces back to Chapter 4: pre-training aims at producing a plausible continuation, not at checking what's true. Alignment can largely hold down this tendency, making it more honest and safer; but it **only lowers the risk — it doesn't remove it**. So even with an aligned model, you still have to double-check important facts yourself (Chapter 9 covers this in detail).

### A side effect of alignment: those "little quirks" that annoy you

Here's something often misunderstood, spelled out for you. While alignment keeps risks in check, it **also brings side effects**. A lot of the quirks that annoy you come precisely from this step being "overdone" or "playing it safe":

| What you run into | Is actually a side effect of alignment |
| --- | --- |
| Slapping on a long string of disclaimers at the drop of a hat | Trained to "rather over-warn than take the blame" |
| Over-politeness, going in circles, refusing to give a straight answer | Trained to "rather be roundabout than offend" |
| Clearly able to answer, yet dodging with "I'm just an AI" | Trained to "if unsure, don't answer, don't cause trouble" |

Knowing these **aren't it being dumb or malfunctioning, but caution deliberately tuned in**, you won't be puzzled, and you can treat the cause: spell out the boundaries in your prompt ("this is for general-audience explanation, please give the conclusion directly, no need for disclaimers") and it'll often loosen up (Chapter 11 covers how to phrase it). How far each company tunes this "tact" varies and keeps changing, so refer to the provider's official documentation.

## 5. The question most worth thinking through: does it have its own stance?

This is the chapter's most important section.

When it politely declines a request, or weighs every word on a sensitive topic, it's easy to feel: **it has its own values and stance; it "doesn't want" to say this.** That's a very natural feeling, but you can't draw that conclusion from this kind of behavior.

The "attitudes" it shows (gentle, cautious, evasive, holding to some bottom line) are mainly **behavior patterns shaped by training (especially alignment-related training) and product instructions**. As Chapter 4 showed, at every step it computes probabilities from what came before and picks the next word; what alignment changes is which kinds of things it tends to say in various situations. Whether there's anything like human beliefs, likes and dislikes, or consciousness inside it is an open question, and at the very least it can't be inferred from "it turned me down" or "it's so polite."

| | Looks like | A sounder reading |
| --- | --- | --- |
| It "holds" a stance | It has beliefs | Training tuned "respond this way on this topic" to high probability |
| It "refuses" you | It's "unwilling" | This kind of request was marked as one to avoid, in training or in product rules |
| It's "very polite" | It "has a good personality" | Polite wording got rewarded over and over and became its default |

> **Key point:** Understanding its "attitude" first as **behavior shaped by training and product instructions**, rather than as someone's conviction, has two benefits: first, you won't be led around by its tone into thinking it's speaking for someone; second, it explains why its "personality" changes across products and versions, because that was tuned by each company in the first place. This isn't a claim that there's "nothing" inside; it just means you can use it well without settling that hard question.

## 6. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| The model was made by people writing out rules one by one | It's **trained**: read huge amounts of text for a feel for language, then tune behavior with examples, preference feedback, and other methods; nobody writes out line by line how it should answer |
| Pre-training guarantees a reliable chat assistant | A base model may answer questions, but pre-training does not guarantee reliable instruction-following; later training often improves task performance and safety |
| Fine-tuning only changes style, or works as a reliable fact database | It can also change knowledge and capabilities, but may learn facts incompletely or introduce errors. For changing private material that needs citations, usually consider RAG first (Chapter 20); the two can also be combined |
| After alignment it's absolutely safe and reliable | Alignment only **lowers** the risk, doesn't remove it; and it brings side effects like over-politeness, overuse of disclaimers, and a habit of dodging |
| If it shows a stance, it must have its own consciousness and values | These attitudes are mainly **behavior shaped by training and product instructions**; whether anything like human beliefs or consciousness lies inside is unsettled, and at least can't be inferred from this behavior |

## Summary

- **Pre-training, fine-tuning, and alignment** describe developing broad capabilities, adapting to tasks, and matching human intentions. They overlap, and there is more than one training recipe.
- A **base model** primarily learns text continuation and may answer questions or perform other tasks. Reliable instruction-following is not guaranteed; later training can improve it.
- **Alignment** is a goal; methods include human feedback (RLHF), AI feedback (RLAIF), and preference optimization (such as DPO), and reasoning models also use reinforcement learning on tasks with checkable answers. Alignment makes it safer and more honest, but only lowers the risk, doesn't remove it; it also brings **side effects** like over-politeness, overuse of disclaimers, and a habit of dodging.
- The thing most worth thinking through: its "attitude / stance" is first of all **behavior shaped by training and product instructions**, and you can't conclude from it that it has consciousness or convictions. Its "personality" changes across versions precisely because it was tuned.
- Even after alignment, verify important facts (Chapter 9). Fine-tuning and RAG serve different purposes; for current private material with traceable sources, usually consider RAG first, possibly combined with fine-tuning (Chapter 20).

In the next chapter we move from "how it was taught" to "what you can adjust when you use it" — the two knobs most worth knowing: temperature and reasoning effort.

## Sources and verification

- Ouyang et al., *Training language models to follow instructions with human feedback* (InstructGPT, 2022): [arXiv paper page](https://arxiv.org/abs/2203.02155). Supervised fine-tuning on human-written demonstrations, followed by reinforcement learning from human rankings of answers.
- Bai et al., *Constitutional AI: Harmlessness from AI Feedback* (2022): [arXiv paper page](https://arxiv.org/abs/2212.08073). Replaces part of the human labeling with a written set of principles and AI comparisons, which the paper calls RLAIF.
- DeepSeek-AI, *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning* (2025): [arXiv paper page](https://arxiv.org/abs/2501.12948). Uses reinforcement learning on tasks with checkable answers, such as math and coding, to build reasoning ability.

Sources checked 2026-10-27.

---

## Quiz

> 6 questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** In this chapter's simplified introductory example, which option best describes the main roles along a common training route? <!-- quiz: q01 revision: 2 -->
   - A. Pre-training teaches manners, fine-tuning teaches grammar, alignment adds new knowledge
   - B. Pre-training builds a feel for language, fine-tuning teaches following, alignment fits intent
   - C. Alignment sets the rules first, then pre-training reads books, then fine-tuning learns to talk
   - D. Pre-training is enough; fine-tuning and alignment only adjust its tone of voice
   > **Answer: B.** This is a simplified common route: develop broad capabilities, then improve instruction-following and behavior. Alignment is a goal that can overlap with fine-tuning; not every model passes through three separate stages in order. A scrambles the roles; knowledge comes mainly from pre-training. C has the order backwards; pre-training is the first and most resource-hungry step. D underrates later training, which affects not just tone but whether it follows instructions reliably and behaves more safely.

2. **[Basic · Concept]** Which statement about the base model produced by "pre-training" is correct? <!-- quiz: q02 revision: 2 -->
   - A. It can already follow all your instructions reliably, just like a chat assistant
   - B. It can't answer questions at all; it needs fine-tuning before it can give any answer
   - C. It mainly continues text, and won't necessarily answer your instructions reliably
   - D. It stored the full text of the web pages it read, ready to look up whenever needed
   > **Answer: C.** Pre-training mainly learns to predict what comes next, so if you ask a question it might answer, or it might list more questions. A turns a possible ability into a guarantee. B overcorrects: base models can answer correctly, just not reliably. D treats parameters as a complete searchable document archive: some original wording may be memorized, but complete storage and accurate retrieval aren't guaranteed (chapter 2).

3. **[Advanced · Misconception]** It politely declined a request of yours, and someone says "see, it has its own values and stance." What's wrong with this judgment? <!-- quiz: q03 revision: 2 -->
   - A. Nothing; being able to refuse on its own shows it has consciousness and judgment
   - B. It checked a built-in moral rulebook line by line before deciding to refuse
   - C. Refusing must mean the program malfunctioned; a normal model answers everything
   - D. It's behavior shaped by training and product rules; it doesn't show it has beliefs
   > **Answer: D.** "Attitudes" like refusing or being cautious are mainly behavior shaped by training (especially alignment-related training) and product instructions, which is also why its "personality" changes across versions. Whether anything like human belief lies inside is unsettled, but it certainly can't be inferred from one refusal. A is exactly that inference. B imagines a rule-checking program, but its behavior comes from training, not line-by-line rules. C mistakes normal alignment behavior for a malfunction.

4. **[Advanced · Misconception]** "It always loves to pile on disclaimers and go in circles instead of giving a straight answer, which shows this model is dumb." What's wrong? <!-- quiz: q04 revision: 2 -->
   - A. It's mostly caution from alignment, not dumbness, and a clear prompt can ease it
   - B. It's right; piling on disclaimers shows it doesn't know, so it pads with stock phrases
   - C. The context window is nearly full, so it can only fall back on generic stock phrases
   - D. It isn't connected to the internet, so it can't look things up and adds a disclaimer
   > **Answer: A.** Over-politeness, overuse of disclaimers, and dodging often come from alignment's "rather play it safe" tuning, not a lack of ability; spelling out the purpose and boundaries in your prompt often eases it (Chapter 11). B mistakes caution for ignorance. C and D borrow phenomena from other chapters: a nearly full window shows up as losing track of information (Chapter 3), and being online or not doesn't decide whether it adds disclaimers.

5. **[Basic · Scenario]** You need it to give the conclusion directly, for general-audience explanation, but every time it leads with a long "I'm just an AI, please consult a professional." What's the most effective move? <!-- quiz: q05 revision: 2 -->
   - A. Keep telling it to "cut the nonsense"; the harsher your tone, the better it obeys
   - B. Decide this product is useless and switch to a different one right away
   - C. Explain the purpose and audience in your prompt and ask for a direct conclusion
   - D. Send the same sentence over and over until it stops adding the disclaimer
   > **Answer: C.** Its caution is a default tuned by alignment; spell out the setting, audience, and what you need (for example, "this is general-audience explanation, please give the conclusion directly, no need for disclaimers") and it'll often give the conclusion directly. A adds emotion but no information, so results are unreliable. B overreacts: this is tunable behavior, not a defect. D changes no information, and with output randomness, resending may not help (Chapter 8).

6. **[Basic · Hands-on]** Take the same slightly sensitive or boundary-blurry question and ask it two ways: **as a single bare sentence**, and **with the "purpose, audience, and degree you want" spelled out**, then compare the two answers. Observe: after you add context, does its "level of caution" and "whether it gives the conclusion directly" change? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** In most cases, once you spell out the purpose and boundaries, it becomes more direct, with fewer disclaimers. That shows its "attitude" is a default behavior tuned by training, and one your prompt can influence. How far each company tunes this tact varies and keeps changing, so refer to the provider's official documentation. Compare it once yourself and you'll see that "how you say it" matters far more than "whether it's dumb."