# Local interactive lessons

The `/labs/` route contains three deterministic simulations in Chinese, Japanese, and English. They use the existing language store, reader theme, and type scales. No lesson invokes a model, network API, real filesystem, shell, or native command. State lives in Svelte component memory and resets on leaving the route; each experiment has its own reset.

## Linking from chapters

| Route | Suggested chapters |
| --- | --- |
| `/labs/#context` | `token-and-context`, `multi-turn-and-context`, `cost-quota-context`, `long-text-and-summary` |
| `/labs/#rag` | `rag`, `hallucination-knowledge-memory`, `vectors-and-embedding` |
| `/labs/#permissions` | `permissions-and-rollback`, `what-is-agent`, `coding-agent-intro`, `diff-test-rollback-review` |

Prefix internal links with SvelteKit's `base`. Every section has a heading and focusable anchor. Citation links return to the exact source card. The page links back to the three primary chapters. Home and contents navigation are integrated by the primary feature owner.

## What each simulation teaches

**Context:** A fictional capacity of 1,600 tokens, instructions of 160, and selectable reply reservations of 200/400/600. The request, file, and tool result have explicitly assigned full and compact costs; they are not token counts measured from localized prose. Adding the tool result overflows the default proposal by 120. Summarizing the request frees 160, but loses the exact deadline and budget. The inventory names retained and absent details. Overflow blocks the proposed request; it does not silently choose a truncation policy. Reloading a source restores details explicitly. A real model can overlook details even when they fit.

**Evidence:** The same fictional returns question is dated 1 October 2026. Four selectable documents include a 30-day policy, irrelevant shipping guide, conflicting 7-day FAQ, and expired 14-day policy. Rules exclude irrelevant/expired evidence, answer from consistent current evidence, and abstain otherwise. Every response has a visible selection/evaluation trace and relevant source links. The fixture makes no assertion about source authority, retrieval quality, or a model's ability to follow evidence. The question date is fixed, so future visits reproduce the lesson.

**Permissions:** Default-deny grants apply separately to reading one project file, writing one draft, and running one named check. A private file and publish command remain outside those scopes. The check can run but fail before the draft has been updated. No command actually executes. Undo restores the latest mock file edit and appends an audit event; it does not erase prior history. Reset clears grants, files, history, and events. External real-world actions are not assumed reversible.

## Implementation and verification

- `src/lib/labs/scenarios.ts`: pure scenario logic and fixed fixtures.
- `src/lib/labs/copy.ts`: complete localized copy.
- `ContextLab.svelte`, `EvidenceLab.svelte`, `PermissionLab.svelte`: interactions.
- `src/lib/labs/labs.css`: styles scoped under `.labs`, including dark theme variables, visible keyboard focus, touch targets, narrow layouts, and scalable text.

Run `npm run check` and `npm run build`, then inspect `/labs/` using `npm run preview`. Verify overflow/compaction, missing or conflicting evidence, permission grants/revocation, undo, and reset. Check keyboard operation, citation links, and all three languages at 320px with 150% text. These are local simulations; no model or external API is needed.
