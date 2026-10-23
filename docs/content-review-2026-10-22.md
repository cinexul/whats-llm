# Content revision — 2026-10-22

This revision keeps the book's original audience: readers who use a computer but have no AI or programming background. Chinese, Japanese, and English editions retain the same chapter structure.

## What changed

- Replaced vague tool introductions with practical Codex/Claude Code workflows, supported installation examples, project instructions, a minimal skill example, and MCP concepts.
- Updated product selection, agent/tool orchestration, RAG, and local/cloud execution guidance. Capabilities are tied to sources and actual deployment/account conditions, not a universal model ranking.
- Separated subscriptions and usage allowances from API token billing and optional extras. Context selection, caching, compaction, and output/reasoning budgets are explained separately.
- Corrected categorical claims about training-text memorization, embedding privacy, generation, attention, temperature, and reasoning controls.
- Distinguished authorization, approval prompts, sandbox enforcement, Git branches, worktrees, and external side effects. Removing names is not automatically sufficient anonymization, and disabling training does not imply zero retention.
- Reviewed Japanese and English for meaning, terminology, naturalness, and contradictions with revised source material.
- Rebalanced predictable quiz answers and updated explanations consistently across all editions. The original corpus had 190 B answers out of 200 scored questions in each language.

## Evidence and date policy

Dated source sections appear before the quiz in substantially revised chapters, where readers can follow them. The date records when material was checked, not when every feature launched. Product availability can differ by account, region, platform, model, and release channel.

Primary material checked includes:

- [OpenAI Codex repository and documentation](https://github.com/openai/codex), including its CLI source and README.
- [Claude Code README and changelog](https://github.com/anthropics/claude-code), including the observed 2.1.308 changelog and native-install guidance.
- [Agent Skills specification](https://github.com/agentskills/agentskills) and [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol).
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python), [OpenAI Python SDK](https://github.com/openai/openai-python), and [OpenAI Cookbook](https://github.com/openai/openai-cookbook) for agent tools, model parameters, context handling, and reproducibility limits.
- [Ollama documentation](https://github.com/ollama/ollama/tree/main/docs) for local/cloud routing and resource considerations.
- [Git documentation](https://github.com/git/git/tree/master/Documentation) and [Anthropic sandbox runtime](https://github.com/anthropic-experimental/sandbox-runtime) for isolation and recovery limits.
- [Training-data extraction research](https://github.com/ftramer/LM_Memorization) and [embedding inversion research](https://github.com/jxmorris12/vec2text).

The available network allowed primary sources hosted on GitHub; several vendor documentation/news domains returned an access denial. This revision therefore does not claim an exhaustive review of every announcement in the previous two months. It includes verified current guidance and the qualified dated changes supported by the linked material.

Pinned snapshots for the most time-sensitive guidance:

| Guidance | Verified source snapshot |
| --- | --- |
| Codex interfaces and installation | [Codex README](https://github.com/openai/codex/blob/86e17e98c7f901277aeeb4649cf1b01462b082f2/README.md) |
| Claude Code installation and changes | [README](https://github.com/anthropics/claude-code/blob/5ed799e5cc56bea9efff57398ca43e31d82784ff/README.md), [changelog](https://github.com/anthropics/claude-code/blob/5ed799e5cc56bea9efff57398ca43e31d82784ff/CHANGELOG.md) |
| Skill file format | [Agent Skills specification](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx) |
| MCP protocol features | [2026-07-28 schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/80041ab0a139a8f4fb3adbc99f7ae9113ea59671/schema/2026-07-28/schema.ts) |
| Scoped Gemini CLI transition notice | [Gemini CLI README](https://github.com/google-gemini/gemini-cli/blob/09d81bf116b6f0ef084731dc996aa9d56438bb70/README.md) |

## Reader fixes and compatibility

New highlights record their language. Legacy highlights without a language remain usable under the previous text-matching behavior; their original language cannot be inferred reliably. Invalid stored annotation records are ignored, and native writes are queued so a slow older save cannot overwrite a newer edit. A pending local snapshot recovers edits and deletions after an interrupted or failed native save.

Study-data callers now wait for the same in-flight load and can retry a failed load. Resetting progress invalidates pending loads so they cannot restore old progress. The search dialog keeps keyboard focus inside while open, exposes its accessible name, and restores focus when dismissed.

Existing study data is retained. Rewriting a question's prompt changes its existing prompt-based study identity; obsolete question records are excluded from active progress and due counts while their stored cards and review history remain intact. Historical scores are not a certification of the revised content. Embedding search indices, if used, must be regenerated after changing chapter text; model weights and generated indices are not committed.

## Maintenance and validation

The commands and test coverage below describe the 2026-10-22 revision. For commands available in the current checkout, see the [project README](../README.en.md).

From `app/`, run `npm ci`, `npm run check`, `npm test`, and `npm run build`. The content suite checks all 135 sources against the table of contents, question/answer structure, alignment between translations, and a non-dominant answer distribution. When a question changes, revise its options and every letter reference in the explanation in all three editions.

Run browser regressions with `npm run test:e2e` after `npx playwright install chromium`. Existing Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The tests cover reading and language switching, answer persistence, language-scoped highlights, keyboard navigation in search, and retirement of obsolete cards without deleting history.

From `app/src-tauri/`, run `cargo test --locked -p search-core -p study-core`. These exercise search/index logic and SQLite/FSRS behavior without the embedding runtime or a GUI. CI runs the web and Rust-core checks. Native Tauri startup, Windows NSIS packaging, and optional embedding inference require separate platform validation; browser tests do not establish desktop installer readiness.
