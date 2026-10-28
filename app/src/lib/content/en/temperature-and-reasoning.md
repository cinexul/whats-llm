Why can the same question produce different answers? Sampling can be one reason, but the context, retrieved material, model version, or tool state may also have changed. Attributing every difference to temperature would be a mistake.

This chapter looks at two settings people often adjust: **temperature** controls "how loosely it picks from the candidate words," and **reasoning effort** controls "how much a supporting model thinks before it answers." Neither is an accuracy switch, and not every product lets you adjust both. Many chat products don't show temperature at all; reasoning effort often appears as a switch or option such as "think deeper" or "thinking mode." Check the product's own documentation for specifics.

## 1. Temperature: how "loosely" it picks among candidates

Go back to the probability list from Chapter 4: when the text so far is "The capital of Japan is," the scores the model gives the next token look roughly like "Tokyo 92%, Japan 2%, Osaka 1.5%…" (made-up numbers). Next, one entry has to be picked, and temperature is the knob for how that pick is made:

- **Low temperature:** high-scoring candidates get even more of an edge, so the list becomes "steeper." Tokyo gets picked almost every time, and answers are steadier and more conservative.
- **High temperature:** the scores get "flattened," so candidates that had only a percent or two get a real chance. Answers are more varied, and also more likely to wander off.

```text
The same list at different temperatures (made-up numbers):

            Low         Original       High
  Tokyo     ~99%          92%          ~70%
  Japan     rarely         2%          noticeably more
  Osaka     rarely        1.5%         noticeably more
```

So temperature changes how it picks from the candidates it already has, not the candidates themselves: a high temperature doesn't make it know more, and a low one doesn't make wrong knowledge right. If what the model learned is wrong, a low temperature just makes it wrong more consistently.

| Task | A useful starting point | What to check |
| --- | --- | --- |
| Pull a fixed set of items out of a document | If you can, lower temperature; have it answer in a fixed table format, then check each item | Do numbers match the source? How are missing items marked? |
| Generate several titles | Try more variety, with a clear audience and constraints | Are titles distinct, factual, and in the right style? |
| Solve a difficult problem | Supply the evidence and constraints, then try reasoning settings | Assumptions, critical steps, and the final result |

**Even temperature 0 does not guarantee identical text every time.** Details of how the service runs, model updates, and other settings can all make a difference. Some APIs offer a **seed** parameter, which tries to pin down the randomness in sampling so results are **reproducible** (the same input gives the same output); but the official documentation itself calls this best effort, not a guarantee. For reliable results, record the input, model name, settings, and output, and test the result, rather than just noting a temperature value.

## 2. Reasoning effort: how much it "thinks" before answering

A **reasoning model** first generates some "thinking" before its final answer: breaking the problem down, comparing approaches, checking intermediate results. That thinking is generated token by token too; these are called **reasoning tokens** (or thinking tokens). Many products don't show it to you in full; some show only a summary, some show nothing. But the tokens are still generated, so:

- They usually **count toward usage**. APIs that bill by token generally count them as output tokens. For example, as of October 2026, Anthropic's documentation states that even when only a summary of the thinking is displayed, you're billed for the full thinking tokens.
- They also **take up the output limit and the context window** (Chapter 3). The more it thinks, the less room is left for the answer, and the longer you wait.

**Reasoning effort** is the setting for "how much to think." Products name it differently: some call it a "thinking budget" and take a number of tokens; some offer a few **levels**, such as low, medium, and high; some let the model decide whether and how much to think. Raising reasoning effort usually makes it slower and uses more, which can help on complex problems, but the benefit depends on the task: if the question lacks evidence, the goal is vague, or a tool fetched the wrong data, more thinking can't make up for it.

Reasoning effort, extended thinking, and thinking budgets are related product concepts, **not interchangeable parameters shared by every provider**. Some models don't allow temperature changes under certain reasoning settings, and copying parameters from a different model can cause an error.

Start with defaults on a few small tasks with known answers. Compare quality, elapsed time, and actual usage. Simple tasks need not use maximum effort; harder tasks may benefit from more, but still need verification.

## 3. Ask for evidence, not a long story about thinking

Ask for **key assumptions, calculation steps, sources, and a way to verify the result**. These are usually more useful than demanding every internal thought. A reasoning summary is an explanation you can inspect, not a complete, auditable record of internal computation. More words do not prove correctness.

For a price calculation, provide quantities, tax rates, and rounding rules; ask for the formula and check it with a calculator. For a code change, ask for specific tests and their results. External evidence and repeatable checks are stronger grounds for trust than time spent thinking.

## 4. Change one variable at a time

Take five to ten representative tasks and keep the inputs, evidence, and acceptance criteria fixed. Run the defaults first, then change just one setting you're able to adjust. Record the pass rate, time, and usage; choose a configuration that meets your needs. More varied output can help when you're looking for alternative ideas and hurt when you need a fixed format. Test the relationship on your own tasks instead of assuming higher is always better, or that it has nothing to do with quality.

## 5. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A lower temperature makes answers more accurate | Temperature only affects how loosely it picks; if the knowledge itself is wrong, a low temperature just repeats the error more consistently |
| At temperature 0, the output is identical every time | Service details, model updates, and more can cause differences; a seed only tries to pin things down |
| A higher temperature makes it more knowledgeable | High temperature adds variety, not knowledge, and makes going off track or erring more likely |
| More reasoning effort is always better; max it out for everything | It's slower and uses more, with little benefit on simple tasks; more thinking can't fix missing evidence |
| If I can't see the thinking, it doesn't add to my usage | Hidden or summarized reasoning tokens usually still count toward usage |
| The longer the thinking summary, the more reliable the answer | A summary isn't a complete internal record, and length isn't correctness; look for evidence you can check |

## Summary

- Temperature decides how loosely it picks from candidate words: low is steadier, high is more varied. It doesn't add knowledge or guarantee correctness or full reproducibility.
- Reasoning models generate reasoning tokens before answering; these usually count toward usage and take up the output limit and context window. Reasoning effort sets "how much to think," and its name, levels, and availability depend on the model and product.
- To improve reliability, supply the right evidence and constraints first, then test on a small sample, rather than turning every setting up.

## Sources and verification

- Checked 2026-10-22: [OpenAI SDK temperature documentation](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_create_params.py), [reasoning parameters and model-specific support](https://github.com/openai/openai-python/blob/main/src/openai/types/shared_params/reasoning.py), and the [official Cookbook on seed and reproducibility limits](https://github.com/openai/openai-cookbook/blob/main/examples/Reproducible_outputs_with_the_seed_parameter.ipynb) (which describes seed as best effort, with determinism not guaranteed).
- Checked 2026-10-27: [Anthropic documentation, "Steering thinking"](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost), which states that thinking tokens are billed as output tokens, that you're billed for the full thinking tokens even when only a summary is shown, and lists reasoning levels such as low, medium, and high.

These illustrate controls and limitations; they do not promise that every model supports the same settings.

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
