# Content revision — 2026-10-27

This revision fixes problems found in a full read-through of the book on 2026-10-27. All 45 chapters were edited in Chinese, Japanese and English, and every edition was compared against the revised Chinese text before its review was recorded.

## What changed

- **Typography.** Chinese and Japanese text no longer has spaces between CJK characters and English letters or digits. Chinese uses full-width punctuation and curly quotes. Code, URLs and Markdown syntax were left untouched.
- **Quizzes.** In the previous edition the correct option was the longest one in 150 of 154 scored Chinese questions, bold text appeared only in correct options, and several chapters had every answer on B. All scored questions were rewritten: options of similar length, no emphasis inside options, distractors based on real beginner misconceptions, and answer letters spread across A–D. Question IDs were kept; every changed question has a higher revision, so the registry gives revised options a new assessment identity while old study history stays readable.
- **Consistency between chapters.** Chapters 4, 6, 7 and 9 now share the careful stance of chapters 1–3: fluency and confidence are not proof of correctness, models can say they are unsure, and getting a pronoun right does not prove human-like understanding. Chapter 9 now matches chapter 3 on what happens near the context limit. Chapters 12 and 13 no longer attribute to chapter 3 claims it does not make. The workflow loop is called 调查→计划→动手→验收 throughout.
- **Practical steps.** Chapter 26 gained a short Git section (install, first commit, `status`/`diff`, `restore`/`revert`, and what Git cannot undo), and appendix C a Git command table. Chapters 31–36 now give a minimal path a beginner can follow and a completion checklist. Chapter 36 lists where skills live for Claude Code and Codex, the required `SKILL.md` fields, and how to add an MCP server.
- **Safety.** Chapter 26 warns beginners not to use options that skip approvals. Chapters 35, 37 and 40 explain keeping API keys in environment variables or a `.env` file listed in `.gitignore`, and that coding agents may read `.env`. Chapter 34 treats tool permissions, not prompt rules, as the first brake. Chapter 38 explains that spending alerts are not always hard limits.
- **Product facts.** Memory features (Claude, ChatGPT and others), Claude Code and Codex installation, account requirements and slash commands, Ollama local-only mode, the Agent Skills naming rules and the MCP version were checked against official pages and dated “as of October 2026”.
- **Cross-references.** Every chapter and appendix reference was checked against the table of contents. Wrong references (for example installation pointing to chapter 25 instead of 28–29) were corrected in all three languages.
- **Beginner readability.** Chapter 8 was rewritten around chapter 4's probability example and now explains reasoning tokens. Chapters 17–22 explain new terms in one sentence on first use and separate the two meanings of 推理 (reasoning and running a model).

## Sources checked

Sources were opened on 2026-10-27 unless noted. The main ones:

- Claude Code documentation: setup, quickstart, commands, permission modes, permissions, settings, skills, MCP and checkpointing on code.claude.com; Claude memory and API payment articles on support.claude.com; rate limits, getting started and thinking costs on platform.claude.com.
- Codex: the [README](https://github.com/openai/codex/blob/main/README.md) and slash-command source in the openai/codex repository; skills, MCP, permissions, approvals and pricing pages (developers.openai.com/codex now redirects to learn.chatgpt.com).
- OpenAI API quickstart and spend-limits guide on developers.openai.com.
- Git documentation on git-scm.com for installation, `add`, `restore`, `revert` and `switch`.
- The Agent Skills specification at commit 69ef37e and the MCP schema for 2026-07-28 at commit 54b91cd.
- Ollama FAQ and LM Studio offline documentation; the Gemini CLI README.
- Research: Vaswani et al. 2017, InstructGPT, Constitutional AI, DPO, DeepSeek-R1, Mikolov et al. 2013 (NAACL), the Winograd schema collection, and Kalai et al. 2025 “Why Language Models Hallucinate”.
- Model facts: the Kimi K2 repository and the Qwen3-Next model card.
- Chapter 39: the 2025 labeling measures published by the Cyberspace Administration of China, the U.S. Copyright Office AI reports, and the OSI license list.

## Limits

- help.openai.com, openai.com and platform.openai.com returned access errors from the review environment. The ChatGPT memory FAQ, OpenAI's hallucination post and the OpenAI Tokenizer page are cited but their source entries are not marked as checked. ChatGPT-specific memory details rely on search results and secondary reporting; Claude's memory page was read directly.
- Product availability differs by account, region and plan. The book keeps its rule of pointing to official documentation for anything that changes quickly.
- Reading the revised text in the app (all three languages, light and dark themes, phone and desktop widths) and the automated checks do not replace a reader actually following the project chapters with a real coding agent.
