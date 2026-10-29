# Content revision — 2026-10-29

This revision went through every chapter and appendix again. Each chapter was compared across the Chinese, Japanese and English editions, its sources were reopened, and the author read it through. The per-chapter notes recorded in the chapter metadata say what changed in each edition.

## What changed

- **Shorter, plainer text.** Verbose chapters were cut by roughly 15–30%. Most bold text was removed, most "key point" boxes were folded into the prose, and repeated "check the official docs" pointers were dropped where the chapter already gives a dated fact and its source. All three editions were reworded to read like plain conversation rather than a textbook.
- **Wording.** Chinese text no longer uses regional slang, internet slang, or metaphors built on eating, bodily functions or injury. The Japanese and English editions were checked for the same kinds of wording and fixed to match. The same pass covered quiz questions and explanations; answer letters did not change.
- **New material.** A closing chapter (41) and appendix E (numbers at a glance) were added. Chapter 34 ends with a short set of code-architecture principles readers can paste into `CLAUDE.md` or `AGENTS.md`, shown in its own styled box. Figures were added to chapters 3–6, 19, 20, 24 and 26. The glossary (appendix A) gained seven entries (171 in total) and its Japanese and English editions now match the Chinese.
- **Rewritten editions.** The English edition of chapter 30 was rewritten to match the revised Chinese; the Japanese and English glossaries were brought up to date.
- **Corrections found while checking sources.**
  - Recent Claude Code versions start terminal and VS Code sessions in auto mode, not in Manual mode; chapters 26, 28, 32 and 34 now say how to switch to Manual mode.
  - Claude Console spend limits: the text no longer says requests resume in the next billing month, and the auto-reload sentence now states only what the documentation confirms.
  - Codex: the standalone installer is described without claiming anything about Node.js beyond the npm route; API-key usage is described as billed at API prices, without a claim about plan credits; the `.env` deny rule now uses the documented `"**/*.env" = "deny"` form.
  - Chapter titles 37 and 38 were reworded.
- **Typography.** Remaining half-width parentheses next to Japanese text and spaces between CJK text and Latin letters in example prompts were fixed.

## Sources checked

Sources were opened on 2026-10-29 unless noted; appendix E's numbers and the closing chapter were checked on 2026-10-28.

- Claude Code documentation on code.claude.com: setup, commands, permission modes, settings, memory, skills, MCP, checkpointing, costs and the Agent SDK overview; the Claude Code README.
- Anthropic API documentation on platform.claude.com: get started, API versioning, models overview, pricing and rate limits; the Claude help articles on memory, paid plans and API payment.
- Codex: the README, the slash-command, status-indicator and approval-preset source files in the openai/codex repository, and the CLI, pricing, skills, MCP, permissions and approvals pages (developers.openai.com/codex now redirects to learn.chatgpt.com).
- OpenAI API quickstart and spend-limits guide; the OpenAI Agents SDK tracing and guardrails documentation.
- Node.js command-line options; Git documentation on git-scm.com; GitHub Docs for Pages, file uploads and account creation.
- Ollama documentation (pinned commit and current main), the Ollama model library, LM Studio's offline documentation, the Agent Skills specification and the MCP specification 2026-07-28.
- Chapter 39: the labeling measures published on the Chinese government portal, the U.S. Copyright Office AI reports (Part 2 read in the original PDF) and the OSI license list. Chapter 40: OWASP LLM01:2025.
- Appendix D: Birgitta Böckeler's "Harness engineering for coding agent users" and Anthropic's "Effective harnesses for long-running agents".

## Limits

- help.openai.com and openai.com/api/pricing returned access errors from the review environment. Statements that could only be confirmed there were removed or narrowed rather than kept.
- Product behaviour differs by version, account, region and plan. Dated statements say "as of October 2026".
- The automated checks and reading the text do not replace a reader actually following the project chapters with a real coding agent.
