Why can the same question produce different answers? Sampling can be one reason, but the context, retrieved material, model version, or tool state may also have changed. Attributing every difference to temperature would be a mistake.

This chapter separates two concepts: **temperature** changes the sampling distribution during generation; **reasoning effort** changes how much reasoning work a supported model performs. Neither is an accuracy switch, and not every product lets you adjust both.

## 1. Temperature: choosing among candidates

As Chapter 4 explained, the model assigns probabilities to candidate tokens, then a generation strategy selects one. Lower temperature usually gives higher-probability candidates more weight; higher temperature usually flattens the distribution and increases variety. A high temperature does not create new knowledge, and a low temperature does not make an answer true.

| Task | A useful starting point | What to check |
| --- | --- | --- |
| Extract fixed fields | If supported, lower temperature; use structured output and field validation | Do numbers match the source? How are missing values represented? |
| Generate several titles | Try more variety, with a clear audience and constraints | Are titles distinct, factual, and in the right style? |
| Solve a difficult problem | Supply the evidence and constraints, then evaluate reasoning settings | Assumptions, critical steps, and the final result |

**Even temperature 0 does not guarantee identical text every time.** Serving implementations, model updates, and other settings may affect the result. Even when a product supports a seed, check its specific reproducibility guarantees. For reliable comparisons, record the input, model identifier, settings, and output, and test the result.

## 2. Reasoning effort: a computation budget for harder work

Reasoning models can use additional computation to compare approaches, break down a problem, or check results. Higher effort often increases latency and token use, but the benefit depends on the task. More thinking cannot reliably repair missing evidence, an unclear goal, or incorrect tool data.

Reasoning effort, extended thinking, and thinking budgets are related product concepts, **not interchangeable parameters shared by every provider**. Some interfaces allocate the budget automatically. Some APIs support only certain levels, and some models restrict temperature under particular reasoning settings. Copying parameters from a different model can cause an error.

Start with defaults on a small set of tasks with known answers. Compare quality, elapsed time, and actual usage. Simple tasks need not use maximum effort; harder tasks may benefit from a larger budget, but still need verification.

## 3. Ask for evidence, not a long story about thinking

Ask for **key assumptions, calculation steps, sources, and a way to verify the result**. These are usually more useful than demanding every internal thought. A reasoning summary is an explanation you can inspect, not a complete, auditable record of internal computation. More words do not prove correctness.

For a price calculation, provide quantities, tax rates, and rounding rules; ask for the formula and check it with a calculator. For a code change, ask for specific tests and their results. External evidence and repeatable checks are stronger grounds for trust than time spent thinking.

## 4. Change one variable at a time

Take five to ten representative tasks and keep the inputs, evidence, and acceptance criteria fixed. Run the defaults first, then change just one supported setting. Record the pass rate, time, and usage; choose a configuration that meets your needs. Diversity can help when searching for alternative solutions and hurt when a rigid output is needed. Test the relationship on your tasks instead of assuming higher is always better, or that temperature has no effect on quality.

## Summary

- Temperature changes sampling diversity. It does not add knowledge or guarantee correctness or reproducibility.
- Reasoning settings affect the work budget; available controls and combinations depend on the model and product.
- Supply the right evidence and constraints, then evaluate a sample rather than turning every setting up.

## Sources and verification date

Checked 2026-10-22: [OpenAI SDK temperature documentation](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_create_params.py), [reasoning parameters and model-specific support](https://github.com/openai/openai-python/blob/main/src/openai/types/shared_params/reasoning.py), and the [official Cookbook on seed and reproducibility limits](https://github.com/openai/openai-cookbook/blob/main/examples/Reproducible_outputs_with_the_seed_parameter.ipynb). These illustrate controls and limitations; they do not promise that every model supports the same settings.

---

## Quiz

1. What does temperature primarily change? <!-- quiz: q01 revision: 1 -->
   - A. The amount of training data
   - B. The computer’s cooling
   - C. The distribution used to sample the next token
   - D. The account’s memory capacity
   > **Answer: C.** It changes the relative chance of selecting candidate tokens; it does not add knowledge.

2. What is a reasonable expectation when increasing reasoning effort? <!-- quiz: q02 revision: 1 -->
   - A. It may use more computation, time, and tokens, but can still be wrong
   - B. Every answer is guaranteed correct
   - C. The conversation is remembered permanently
   - D. All models support the same parameters
   > **Answer: A.** It is one control over the work budget; the benefit depends on the model and task.

3. Two outputs differ at temperature 0. What should you conclude? <!-- quiz: q03 revision: 1 -->
   - A. The service must be broken
   - B. The model secretly trained on your input
   - C. Low temperature is unusable
   - D. Check inputs, the model, and serving behavior; low temperature does not guarantee identical text
   > **Answer: D.** Factors beyond sampling settings can affect the result. A single setting cannot guarantee reproducibility.

4. Which approach is more reliable for extracting a fixed set of fields? <!-- quiz: q04 revision: 1 -->
   - A. Turn every setting to its maximum
   - B. Define fields and missing-value rules, use supported structured output, and check against the source
   - C. Judge only how fluent the answer sounds
   - D. Demand all internal thoughts
   > **Answer: B.** Format validation and factual checking are separate jobs; both are needed. Settings cannot replace them.

5. Why might copying another model’s temperature and reasoning settings fail? <!-- quiz: q05 revision: 1 -->
   - A. Models never allow parameters
   - B. Only paying users can read documentation
   - C. Supported parameters, levels, and combinations may differ
   - D. Every provider’s parameters are equivalent
   > **Answer: C.** Check the selected model’s supported settings, then evaluate a small sample.

6. Choose a task with a checkable answer. Record the default result, time, and usage, then change only one supported setting and compare. <!-- quiz: q06 revision: 1 -->
   > **What to observe:** Compare performance on the same task, not answer length. Record the model, input, and settings, repeat a few times, and look for variation.
