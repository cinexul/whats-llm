# Local interactive lessons

The `/labs/` route contains a tokenizer lab and three deterministic simulations in Chinese, Japanese, and English. They use the existing language store, reader theme, and type scales. No lesson invokes a model, network API, real filesystem, shell, or native command, and nothing the reader types leaves the device. State lives in Svelte component memory and resets on leaving the route; each experiment has its own reset.

## Linking from chapters

| Route | Suggested chapters |
| --- | --- |
| `/labs/#tokens` | `token-and-context`, `cost-quota-context`, `appendix-numbers` |
| `/labs/#context` | `token-and-context`, `multi-turn-and-context`, `cost-quota-context`, `long-text-and-summary` |
| `/labs/#rag` | `rag`, `hallucination-knowledge-memory`, `vectors-and-embedding` |
| `/labs/#permissions` | `permissions-and-rollback`, `what-is-agent`, `coding-agent-intro`, `diff-test-rollback-review` |

Prefix internal links with SvelteKit's `base`. Every section has a heading and focusable anchor. Citation links return to the exact source card. The page links back to the three primary chapters. Home and contents navigation are integrated by the primary feature owner.

## What each simulation teaches

**Tokens:** Two real, openly published tokenizers run in the browser: OpenAI's `o200k_base` (via `js-tiktoken`; tiktoken maps GPT-4o, GPT-4.1, GPT-5 and the o-series to it) and Qwen3.8-27B's (via `@huggingface/tokenizers`, data in `static/tokenizers/qwen38.json.gz`, Apache-2.0, see the NOTICE file there). Nine multilingual preset groups (the five appendix groups and four original lab groups) can be edited freely. The table compares counts per language and tokenizer; the pieces view groups tokens that only make sense together (one character split into several byte tokens, shown as ×2/×3). Counts were checked token for token against the official Python libraries (`tiktoken`, `tokenizers`), and the browser test compares the page against the same libraries' JavaScript ports. The tokenizers load only when the page opens (bundled tokenizer data, cached by the offline download).

**Context:** A fictional capacity of 1,600 tokens, instructions of 160, and selectable reply reservations of 200/400/600. The request, file, and tool result have explicitly assigned full and compact costs; they are not token counts measured from localized prose. Adding the tool result overflows the default proposal by 120. Summarizing the request frees 160, but loses the exact deadline and budget. The inventory names retained and absent details. Overflow blocks the proposed request; it does not silently choose a truncation policy. Reloading a source restores details explicitly. A real model can overlook details even when they fit.

**Evidence:** The same fictional returns question is dated 1 October 2026. Four selectable documents include a 30-day policy, irrelevant shipping guide, conflicting 7-day FAQ, and expired 14-day policy. Rules exclude irrelevant/expired evidence, answer from consistent current evidence, and abstain otherwise. Every response has a visible selection/evaluation trace and relevant source links. The fixture makes no assertion about source authority, retrieval quality, or a model's ability to follow evidence. The question date is fixed, so future visits reproduce the lesson.

**Permissions:** Default-deny grants apply separately to reading one project file, writing one draft, and running one named check. A private file and publish command remain outside those scopes. The check can run but fail before the draft has been updated. No command actually executes. Undo restores the latest mock file edit and appends an audit event; it does not erase prior history. Reset clears grants, files, history, and events. External real-world actions are not assumed reversible.

## Implementation and verification

- `src/lib/labs/scenarios.ts`: pure scenario logic and fixed fixtures.
- `src/lib/labs/copy.ts`: complete localized copy.
- `TokenLab.svelte`, `tokenizers.ts`, `token-samples.ts`, `token-samples.json`: the tokenizer lab, lazy loading, and its example sentences.
- `ContextLab.svelte`, `EvidenceLab.svelte`, `PermissionLab.svelte`: interactions.
- `src/lib/labs/labs.css`: styles scoped under `.labs`, including dark theme variables, visible keyboard focus, touch targets, narrow layouts, and scalable text.

Run `npm run check`, `npm run build` and `npm run test:e2e -- tests/e2e/labs.spec.ts`, then inspect `/labs/` using `npm run preview`. Verify overflow/compaction, missing or conflicting evidence, permission grants/revocation, undo, and reset. Check keyboard operation, citation links, and all three languages at 320px with 150% text. No model or external API is needed.

## Tokenizer revision review — 2026-10-30

The canonical examples in `src/lib/labs/token-samples.json` retain all original sentences. The five appendix groups, chapter counts and figures were recomputed using the pinned Qwen/Qwen3.8-27B tokenizer, and all 27 sample ID arrays were checked against official Python `tokenizers` and `tiktoken`. Chapter, appendix and diagrams were reviewed in Chinese, Japanese and English; conclusions now reflect the changed language rankings. Old corpus-wide ratio estimates were removed rather than attributed to the new tokenizer. Exact source revision, hashes and Apache-2.0 license are in `static/tokenizers/NOTICE.txt`. Actual vocabulary is 248,044 base + 33 added = 248,077 tokens; model configuration capacity 248,320 is distinct.

Input policy: o200k_base encodes literal special-marker strings as ordinary text. Qwen3.8 follows the official NFC normalization and added-token recognition, without automatic postprocessor special tokens; this is not a chat-template counter. The lab therefore does not claim identical special-string behavior between tokenizers.

## Historical multilingual-tokenization note — 2026-10-30

Chapter3 now explains that some earlier vocabularies split Chinese/Japanese more finely, while later multilingual coverage can reduce counts, without implying universal improvement or increased model intelligence. Recomputed two exact strings using js-tiktoken1.0.21: canonical everyday.zh gives50/28/21 and お誕生日おめでとう gives14/9/8 under r50k_base/cl100k_base/o200k_base. `tests/unit/labs/tokenizer-history.test.ts` locks these values and checks all three editions. Primary context: https://openai.com/index/hello-gpt-4o/ and https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken . No historical tokenizer was added to the lab UI.

## Optional Claude community estimate — 2026-10-30

The lab adds a separate count-only estimate from [sanderland/ctok](https://github.com/sanderland/ctok), pinned to commit `8c43ffd3c7be467622a540f025516e49ef78d8b1`. Only its Opus 4.8-family v4.8 method is supported. This is community reverse engineering, not an official Anthropic tokenizer, and exposes neither token IDs nor real token pieces. The UI separates the single-user-message total from a content estimate obtained by subtracting its fixed overhead of 6. Content-boundary rules remain: the result is not guaranteed to be a raw-text token count. Opus 5/5.5 differences are not modeled. The three-language chapter and appendix disclose this limitation; their verified o200k_base/Qwen3.8 comparison tables remain unchanged. No Claude sample counts are asserted in the teaching material.

Verification: 569 representative/edge/fuzz cases match the pinned community Python implementation; a separate 38,174-case Unicode/count sweep also had zero mismatches. This validates the port, not Anthropic API accuracy. The bundled golden and `scripts/verify-ctok-reference.py` reproduce the 569-case check against a pinned upstream checkout (source hashes enforced). Unicode normalization compatibility data and licenses are recorded in ctok-NOTICE.txt. The UI keeps this estimate after the editable text cards so the additional explanation does not obstruct the existing editing flow.
