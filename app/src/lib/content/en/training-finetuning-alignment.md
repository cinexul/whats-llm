By now you know how the model cuts text into tokens (Chapter 3), adds words one at a time (Chapter 4), and picks out what matters with attention (Chapter 6). A more basic question remains: it started out knowing nothing, so how was it "taught" into what it is now?

The answer is training. This chapter uses three concepts, pre-training, fine-tuning, and alignment, to explain how a model becomes an assistant. Along the way they also explain why it follows formats, speaks cautiously, and sounds different from one product to another.

## 1. Three concepts, one table

Roughly: pre-training lays the foundation, and later training makes the model better at getting things done. Alignment names a goal, making the model behave the way people intend, and several stages of training can work toward it.

| Concept | In a sentence | What it learns | Analogy |
| --- | --- | --- | --- |
| Pre-training | Read huge amounts of text and practice guessing the next word | A feel for language: how words connect, roughly what the world is like | Someone extremely well read who has read everything |
| Fine-tuning | Extra lessons from "instruction → good answer" examples | Following instructions: understanding requests and answering in the format asked | Teaching that well-read person to answer properly and do what you say |
| Alignment | Make behavior match what people intend (a goal, with several methods) | Judgment: helpful, honest, harmless | Setting ground rules: what to say, what not to say, and how to say it appropriately |

The three overlap, and every developer's training route is different. Alignment, for example, can be taught with example answers or with comparisons of "which answer is better." Let's take them one at a time.

## 2. Pre-training: read huge amounts of text, learn a "feel for language"

The first step is also the slowest and most expensive: have the model read huge amounts of text (web pages, books, code, and so on) and practice the thing from Chapter 4 over and over, guessing the next word from what came before.

After each guess, the training program compares the probabilities the model gave with the actual next token, measures how far off it was, and nudges the parameters slightly in the direction that reduces the error. Repeat this billions of times, and how words combine, how sentences flow, and roughly how the world works get pressed, bit by bit, into the parameters. The result of this step is called a **base model**.

For a sense of scale, take a public example. DeepSeek's technical report for DeepSeek-V3, released in December 2024, says pre-training read 14.8 trillion tokens and used about 2.66 million GPU hours, roughly $5.33 million at a rental price of $2 per hour; the later fine-tuning, alignment, and other post-training used only about 5,000 GPU hours. These figures cover only the official training run, not earlier research and experiments, but they show how different the two steps are in weight.

The counterintuitive part: pre-training only practices producing a plausible continuation, which doesn't guarantee that the model will reliably follow instructions. Ask a base model "What's the capital of France?" and it may answer "Paris," or it may keep listing similar questions, depending on the model and the context. Base models can still continue text, be used for research, or handle tasks set up with examples in the prompt; they just aren't steady enough to use directly as a chat assistant. What later training does is make those existing abilities work reliably with instructions and formats; the groundwork for answering questions is already laid in pre-training.

## 3. Fine-tuning: from "knows how to add words" to "knows how to do as told"

**Fine-tuning** means training an existing model further. Take instruction tuning as the example: the model is shown a large number of pairs of "someone makes a request → a good response," such as "summarize this passage in three points → (a clear three-point summary)" or "help me write an apology email → (a well-judged email)." After enough of them, it gradually shifts from "continue whatever it sees" to "when given an instruction, respond to it."

As an analogy: pre-training brings in someone extremely well read who just keeps talking on their own; fine-tuning teaches them, step by step, that when someone speaks to them they should respond, and in the form the person wants. When you ask for "a table" or "under 200 words" and it complies, that is largely thanks to this kind of later training, though prompts, tools, and product settings matter too.

Fine-tuning changes more than style; knowledge, specialist skills, and how well the model does a task can all shift too. But don't treat it as a fact database you can update entry by entry and look things up in reliably: facts it learns may be incomplete or wrong. For material that changes often and needs sources, RAG (Chapter 20) is usually the first thing to try.

## 4. Alignment: teaching it "helpful, honest, harmless"

**Alignment** means bringing the model's behavior closer to what people intend and ask for; the goals usually named are "helpful, honest, harmless." It can be achieved through fine-tuning or other training methods, so it isn't necessarily a separate third step after fine-tuning.

There's more than one method. These are the names you'll hear most:

- Reinforcement learning from human feedback (RLHF): an early, well-known method. People rank several of the model's answers to the same question, and those preferences are used to keep training it so it leans toward answers people approve of.
- AI feedback (RLAIF): an AI compares answers against a written set of principles, replacing part of the human labeling.
- Preference optimization (such as DPO): learns directly from pairs of "which of these two answers is better," without training a separate scoring model.
- Reinforcement learning on checkable answers: reasoning models practice on problems whose answers can be checked automatically, such as math and programming, and get a reward for correct answers. This mainly improves reasoning.

How each developer combines these is usually not fully public; knowing the names is enough.

Why is this step needed? A model that has learned a feel for language and learned to follow instructions, but hasn't been aligned, might:

- explain a dangerous or harmful request in full detail;
- make up a plausible answer to something it's unsure about, rather than say "I'm not sure";
- pick up the biases and abuse in its training text and repeat them.

Alignment sets ground rules for this well-read, obedient, but tactless assistant: what not to say, when to admit "I don't know," and how to say things without offending. The root goes back to Chapter 4: pre-training aims at a plausible continuation, not at checking what's true. Alignment can suppress that tendency to a large extent, but it only lowers the risk and can't remove it, so you still need to check important facts from an aligned model yourself (Chapter 9).

### A side effect of alignment: those "little quirks" that annoy you

While alignment keeps risk in check, it has side effects. Many of the habits that annoy you come from this step being pushed too far, or from erring on the side of caution:

| What you run into | What's behind it |
| --- | --- |
| Long disclaimers at every turn | Trained to warn too much rather than take responsibility |
| Overly polite, roundabout, won't give a straight answer | Trained to be indirect rather than risk offending |
| Could answer, but dodges with "I'm just an AI" | Trained to skip anything uncertain and avoid trouble |

All of this is caution tuned in on purpose; it says nothing about the model being incapable or broken. Once you know the cause, you can work with it: state the purpose and limits in your prompt, for example "This is for a general-audience explainer; please give the conclusion directly, no disclaimers needed," and it often loosens up (Chapter 11 covers how to write this). How far each developer sets this dial varies, and it changes between versions from the same developer.

## 5. The question most worth thinking through: does it have its own stance?

When it politely turns down a request, or weighs every word on a sensitive topic, it's easy to feel that it has its own values and "doesn't want" to say something. That's a natural feeling, but the behavior doesn't support the conclusion.

The "attitudes" it shows, gentle, cautious, evasive, holding to some line, are mainly behavior shaped by training (especially alignment-related training) and product instructions. As Chapter 4 explained, at each step it computes probabilities from what came before and picks the next word; alignment changes which kinds of things it tends to say in different situations. Whether it has anything like human beliefs, likes, or consciousness inside is not settled, and in any case can't be inferred from "it refused me" or "it's very polite."

| | Looks like | A sounder reading |
| --- | --- | --- |
| It "holds" a stance | It has beliefs | Training made "respond to this topic this way" highly probable |
| It "refuses" you | It's "unwilling" | Training or product rules marked this kind of request as one to avoid |
| It's "very polite" | It "has a nice personality" | Polite wording was rewarded again and again and became its default |

Read this way, its tone won't carry you into thinking it speaks for someone, and it's clear why its "personality" changes from product to product and version to version: each developer tuned it. This doesn't claim there's "nothing" inside; it just means you can use it well without answering that hard question.

## 6. Common misconceptions, cleared up

| Misconception | Reality |
| --- | --- |
| A model is built by people writing rules one by one | It's trained: it learns a feel for language from huge amounts of text, then its behavior is adjusted with examples, preference feedback, and other methods; nobody writes its answers rule by rule |
| Fine-tuning only changes style, or works as a reliable fact database | Fine-tuning can change knowledge and abilities too, but learned facts may be incomplete or wrong; for material that changes often and needs sources, consider RAG first (Chapter 20); the two can also be combined |
| Once aligned, it's completely safe and reliable | Alignment only lowers risk, it doesn't remove it, and it brings side effects like over-politeness, piles of disclaimers, and evasiveness |
| It showed a stance, so it has its own consciousness and values | These attitudes are mainly behavior shaped by training and product instructions; whether it has anything like human beliefs is unsettled, and in any case can't be inferred from them |

## Summary

- Pre-training, fine-tuning, and alignment correspond to learning basic abilities, adapting to tasks, and making behavior match what people intend. They overlap, and there's more than one training route.
- Pre-training takes the most resources: DeepSeek-V3's pre-training read 14.8 trillion tokens, and its post-training used less than 1% of that compute.
- A base model mainly learns to continue text. It may answer questions correctly, but isn't guaranteed to follow instructions reliably; later training makes it better at doing as told.
- Alignment is a goal, pursued with RLHF, RLAIF, preference optimization (such as DPO), and more; reasoning models also get reinforcement learning on tasks with checkable answers. Alignment lowers risk without removing it, and brings side effects like over-politeness, piles of disclaimers, and evasiveness, which clear prompts can ease.
- Its "attitudes" and "stances" are first of all behavior shaped by training and product instructions, not evidence of consciousness or convictions; its "personality" changes between versions precisely because it was tuned.

The next chapter moves from "how it was taught" to "what you can adjust when using it": the two dials of temperature and reasoning effort.

## Sources and verification

- Ouyang et al., *Training language models to follow instructions with human feedback* (InstructGPT, 2022): [arXiv paper page](https://arxiv.org/abs/2203.02155). Supervised fine-tuning on human-written demonstrations first, then reinforcement learning from human rankings of answers.
- Bai et al., *Constitutional AI: Harmlessness from AI Feedback* (2022): [arXiv paper page](https://arxiv.org/abs/2212.08073). Replaces part of the human labeling with a written set of principles and AI comparisons, which the paper calls RLAIF.
- DeepSeek-AI, *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning* (2025): [arXiv paper page](https://arxiv.org/abs/2501.12948). Uses reinforcement learning on tasks with checkable answers, such as math and programming, to improve reasoning.
- DeepSeek-AI, *DeepSeek-V3 Technical Report* (2024): [arXiv paper page](https://arxiv.org/abs/2412.19437). The abstract says pre-training used 14.8 trillion tokens and full training took 2.788M H800 GPU hours; Table 1 lists 2,664K GPU hours for pre-training and 5K for post-training at $2 per GPU hour, noting that prior research and ablation experiments are excluded.

Sources checked: the first three on 2026-10-27, the fourth on 2026-10-28.

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