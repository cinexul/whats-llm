Ask the same question twice and you may get two different answers. That isn't necessarily "temperature." It might just be the randomness of sampling, or the context changed, different material was retrieved, the model got updated, or a tool came back with something else. Blame everything on temperature and you'll often get the cause wrong.

This chapter covers two settings people like to adjust. **Temperature** controls how loosely the model picks among candidate words; **reasoning effort** controls how much a model that can think does so before it answers. Neither is a "be correct" switch, and not every product lets you change them: many chat products don't show temperature at all, and reasoning effort usually shows up as a switch like "deep thinking" or "thinking mode."

## 1. Temperature: how "loosely" it picks among candidates

Go back to the probability list from Chapter 4. With the text "The capital of Japan is," the model scores the next token roughly like this: Tokyo 92%, Japan 2%, Osaka 1.5%, Edo 0.8%, and the remaining 3.7% is shared by thousands of unlikely candidates (the numbers are made up for illustration). Now one has to be picked from the list, and temperature is the dial for how:

- At a low temperature, high-scoring candidates gain an even bigger edge and the list gets "steeper." Tokyo is picked almost every time, and answers are steadier and more conservative.
- At a high temperature, the scores get "flatter." Candidates that had only 1 or 2% get more chances, and the huge crowd of unlikely candidates starts to add up. Answers are more varied, and more likely to go off track.

Here's the same list actually worked out (to keep the math simple, assume the remaining 3.7% is split evenly among 37 unlikely candidates):

```text
                              Temp 0.5    Temp 1 (as is)   Temp 1.5
  Tokyo                        99.9%          92%           ~64%
  Japan                        <0.1%           2%            ~5%
  Osaka                        <0.1%          1.5%           ~4%
  Edo                          <0.1%          0.8%           ~3%
  37 unlikely candidates total  ~0            3.7%          ~25%
```

Look at the last row: raising the temperature from 1 to 1.5 lifts the combined chance of the unlikely candidates from 3.7% to about 25%, so roughly one pick in four lands on a word that would almost never have shown up. A long piece of writing is picked like this one word at a time, so the longer it writes, the more likely it is to wander.

So temperature only changes how it picks; the candidates stay the same. A high temperature doesn't make it know more, and a low one doesn't make wrong knowledge right: if the model learned something wrong, a low temperature just makes it wrong more consistently.

When you can adjust temperature, here's what to try by task:

| Task | Try this | Still check |
| --- | --- | --- |
| Pull a fixed set of fields from material | Turn the temperature down and have it fill in a fixed table | Whether the numbers are in the source, how missing items are marked |
| Come up with several titles | Turn it up a little, and say who it's for and what the limits are | Duplicates, accuracy, and whether the style fits |
| Solve a complex problem | First give it all the material and conditions, then try reasoning settings | Its assumptions, key steps, and the final result |

The dials on offer differ between providers too. As of October 2026, OpenAI's API lets you set temperature anywhere from 0 to 2, while Anthropic's Claude Opus 5.5 doesn't take a temperature parameter at all anymore; Anthropic suggests saying what kind of output you want in the prompt instead.

Even a temperature of 0 doesn't guarantee the exact same words every time. Server-side implementation details and model updates can both cause differences, and Anthropic's migration guide points out that temperature 0 never guaranteed identical outputs on earlier models either. Some APIs have a parameter called a seed, which tries to pin down the randomness of sampling so the same input gives the same output, but OpenAI says plainly that this is only best effort. If you need results you can check later, save the input, model name, settings, and output, and test them. Writing down a temperature value isn't enough.

## 2. Reasoning effort: how much it "thinks" before answering

A **reasoning model** "thinks" for a while before it answers: breaking the problem down, comparing a few approaches, checking intermediate results. That thinking is also generated token by token, as reasoning tokens (also called thinking tokens). Many products don't show you all of it; some show a summary, some show nothing. But the tokens are still generated, so:

- They usually count toward usage. APIs that bill by the token generally count them as output tokens; as of October 2026, Anthropic's documentation says that even when only a summary is shown, you're billed for the full thinking tokens.
- They also use up the output limit and the context window (Chapter 3). The more it thinks, the less room is left for the answer, and the longer you wait.

Reasoning effort is the setting for "how much to think," and providers handle it differently. As of October 2026, OpenAI's API has levels running from none and minimal all the way up to xhigh and max, and notes that not every model supports every level. Claude Opus 5.5 has five levels, from low to max, with medium as the default, and the model looks at each question and decides for itself whether to think and how much. Anthropic used to let you set a "thinking budget" directly as a token count (at least 1,024), but Claude 4.7 and later models no longer accept that.

Turning reasoning effort up usually makes things slower and uses more, and complex problems may get better answers, but it depends on the task. If material is missing, the goal is unclear, or a tool fetched the wrong data, more thinking won't fix it. Simple tasks don't need the maximum; complex ones can go higher, but you still need to check the results.

"Reasoning effort," "extended thinking," and "thinking budget" are related terms, not one shared set of parameters that works the same everywhere. Copy settings from another model or an older version, and the request may just fail with an error.

## 3. Ask for evidence, not a long story about thinking

Instead of asking it to write out all its internal thinking, ask it to lay out its key assumptions, calculation steps, sources, and how to check the result. Those you can go through one by one. A reasoning summary is just an explanation written for you, not a complete record of what happened inside, and a long one doesn't mean the work is right.

Say you want it to work out a quote: give it the quantities, tax rate, and rounding rule first, have it show the formula, and redo the math yourself with a calculator. Want it to fix a program? Have it run specific tests and paste the results. Checks you can compare against and repeat are far more reliable than "it thought for a long time." Chapter 9 covers how to check AI answers.

## 4. Change one variable at a time

To find out which settings suit you, run a small experiment. Pick 5 to 10 real tasks you actually have, and keep the inputs, material, and pass criteria fixed. Run them once with the default settings, then again with just one setting changed, and write down how many passed, how long it took, and how much it used. Then go with whatever setup is good enough.

More varied output might help you find a few more ideas, or it might mess up tasks that need a fixed format. How variety relates to quality is something you have to try on your own tasks; it's neither "higher is better" nor "makes no difference."

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| Lowering the temperature makes answers more accurate | Temperature only affects how loosely words are picked; if the knowledge is wrong, a low temperature just makes it wrong more consistently |
| At temperature 0, output is always word-for-word identical | Server implementation, model updates, and more can cause differences; a seed also only tries to pin things down |
| Raising the temperature makes it more knowledgeable | High temperature adds variety, not knowledge, and makes it more likely to wander or make mistakes |
| Higher reasoning effort is always better; max it out for everything | It's slower and uses more, with little gain on simple tasks; when material is missing, more thinking doesn't help |
| If you can't see the thinking, there's no extra usage | Hidden or summarized reasoning tokens usually still count toward usage |
| The longer the thinking summary, the more reliable the answer | A summary isn't a complete internal record, and long doesn't mean right; look for evidence you can check |

## Summary

- Temperature sets how loosely the model picks among candidate words: low is steadier, high is more varied, and as it goes up, unlikely words gain ground fast. It adds no knowledge, doesn't make answers right, and doesn't make them the same every time; some models no longer let you adjust it.
- Reasoning models generate reasoning tokens before answering. They count toward usage even when you can't see them, and they take up the output limit and the context window. Reasoning effort adjusts "how much to think," and the level names, whether you can adjust it, and how all vary by provider and model.
- To get more dependable results, first fill in the material and conditions, then try a few small tasks, instead of turning settings up right away.

## Sources and verification

- Checked 2026-10-29: the [temperature parameter description](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_create_params.py) in OpenAI's official SDK (range 0 to 2) and the [reasoning parameter description](https://github.com/openai/openai-python/blob/main/src/openai/types/shared_params/reasoning.py) (effort values none, minimal, low, medium, high, xhigh, max; not every reasoning model supports every value).
- Checked 2026-10-29: [official Cookbook: seed and the limits of reproducibility](https://github.com/openai/openai-cookbook/blob/main/examples/Reproducible_outputs_with_the_seed_parameter.ipynb), which explains that a seed is best effort and doesn't guarantee full determinism.
- Checked 2026-10-29: [Anthropic documentation: Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost), which says thinking tokens are billed as output tokens, that summarized thinking is still billed for the full thinking tokens, and lists five levels: low, medium, high, xhigh, max.
- Checked 2026-10-29: [Anthropic: Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide), which asks you to omit temperature, top_p, and top_k, notes that temperature 0 never guaranteed identical outputs on earlier models, rejects manual thinking budgets, and gives medium as the default effort.
- Checked 2026-10-29: [Anthropic documentation: Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking): the thinking budget `budget_tokens` has a minimum of 1,024, and Claude 4.7 and later models don't support it.

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** What does temperature primarily change? <!-- quiz: q01 revision: 2 -->
   - A. How much the model knows; the higher the temperature, the more it knows
   - B. How loosely it picks among candidate tokens, i.e. the sampling distribution
   - C. How often answers are right; a lower temperature always means more accuracy
   - D. How long it thinks before answering; the higher it is, the longer it thinks
   > **Answer: B.** Temperature adjusts the relative chance of each candidate token being picked: low temperature gives high scorers more of an edge, high temperature flattens the distribution. A and C are the two most common misconceptions: temperature adds no knowledge and guarantees no correctness, and if the knowledge is wrong, low temperature just errs more consistently. D confuses temperature with reasoning effort; "how much it thinks" belongs to reasoning settings.

2. **[Basic · Concept]** What is a reasonable expectation when increasing reasoning effort? <!-- quiz: q02 revision: 2 -->
   - A. Wait a little longer and it is guaranteed to get every answer right
   - B. Only the display changes; usage and waiting time stay the same
   - C. The model will remember this round of thinking permanently
   - D. It's usually slower and uses more, and it can still be wrong
   > **Answer: D.** Reasoning effort controls how much it thinks before answering; reasoning tokens usually count toward usage, and you wait longer. It can help on complex problems, but more thinking can't make up for missing evidence or a vague goal. A turns a possible benefit into a guarantee. B overlooks reasoning tokens: not seeing them doesn't mean they weren't generated. C confuses reasoning with memory; this doesn't make the model remember anything across conversations.

3. **[Advanced · Misconception]** Two outputs differ at temperature 0. What should you conclude? <!-- quiz: q03 revision: 2 -->
   - A. Check the input, model version, and so on; low temperature isn't word-for-word
   - B. The service must be broken; stop using it right away and contact support
   - C. The model secretly retrained itself on the input you just gave it
   - D. Temperature clearly does nothing, so adjusting it is pointless from now on
   > **Answer: A.** Beyond sampling settings, tiny differences in input, model updates, and how the service runs all affect the result; temperature 0 only makes high scorers almost always win and doesn't guarantee identical text. B treats a normal occurrence as a failure. C is wrong: ordinary use doesn't change the model's parameters (Chapter 2). D overgeneralizes from one difference; temperature still clearly affects how varied the output is.

4. **[Basic · Scenario]** Which approach is more reliable for extracting a fixed set of fields? <!-- quiz: q04 revision: 2 -->
   - A. Turn temperature and reasoning effort all the way up so it thinks hardest
   - B. If the answer reads smoothly and looks complete, you can use it as is
   - C. Set fields and how to mark gaps, get a fixed format, check against the source
   - D. Have it write out all its internal thinking as proof that the result is right
   > **Answer: C.** Decide which fields to extract and how to mark missing ones, have it answer in a fixed format, then check each item against the source: format checks and fact checks are separate jobs, and you need both. A backfires, since high temperature adds looseness. B only checks fluency and won't catch a miscopied number. D's thinking summary isn't a complete record, and length doesn't prove the result right.

5. **[Advanced · Misconception]** Why might copying another model's temperature and reasoning settings fail? <!-- quiz: q05 revision: 2 -->
   - A. Copying is fine in itself; it only works with a paid account, though
   - B. Supported parameters, levels, and combinations can differ by model
   - C. No model allows any parameter changes, so adjusting is pointless anyway
   - D. You actually can copy them, since every provider's parameters mean the same
   > **Answer: B.** "Reasoning effort," "thinking budget," and the like are each provider's own design: some use levels, some take a token count, and some don't allow temperature changes under certain reasoning settings, so copying can simply cause an error. Check the current model's documentation first, then test on a small sample. A shifts the issue to account type. C goes too far; many models let you adjust some parameters. D is the very misconception to correct.

6. **[Basic · Hands-on]** Choose a task with a checkable answer. Record the default result, time, and usage, then change only one setting you're able to adjust and compare. <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** Compare performance on the same task, not answer length. Record the model, input, and settings, repeat a few times, and look for variation; if your usage breakdown shows reasoning tokens, note how they change too.
