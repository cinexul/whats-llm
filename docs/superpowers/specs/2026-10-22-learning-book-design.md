# A portable, maintained learning book

The user approved all six proposed improvements and parallel implementation, retaining the paper-style mobile reader and Chinese, English, and Japanese. Existing authorization includes pushing verified work directly to main.

## Outcomes

1. Every chapter has structured review/source metadata, an explicit content revision, and translation alignment. Stable concepts and fast-changing product instructions have different review intervals. Checks detect unacknowledged source edits and missing translations; external link checks run separately from deterministic CI.
2. Browser readers can install the PWA, download the complete book for offline use, see download/update state, and resume within a chapter. Desktop Tauri remains functional without a service worker.
3. Readers can export/import a versioned JSON backup of annotations, study cards and reviews, read chapters, reading positions, learning-path checkpoints, and reader preferences. Validate before writing, preview counts, preserve existing data through merging, and report storage failures honestly. Native study restoration uses a SQLite transaction.
4. Three local interactive lessons demonstrate context budgets, RAG evidence quality, and scoped agent permissions. They are explicitly simulations, usable without keys or network, accessible by keyboard and on mobile, and have meaningful feedback/reset controls.
5. Three localized learning paths reuse existing chapters: a short conceptual introduction, an everyday-work task, and a first project. Each has practical deliverables, self-check criteria, and persistent checkpoints.
6. Quiz identity survives wording edits through explicit stable IDs and revisions; legacy records remain usable. Changed answers/options can be versioned without silently reusing old mastery. Readers can practice mistakes by topic, and statistics name historical answer accuracy correctly.

## Boundaries

No account system, hosted synchronization, paid API requirement, or native mobile packaging. A PWA requires HTTPS (or localhost) and a static host with SPA fallback; deployment instructions will be included. User data remains local until explicitly exported. Sources and review dates describe actual review evidence, not invented new verification.

## Integration contracts

- New routes: `/library/` for backup and offline controls, `/learn/` for paths, `/labs/` for experiments; retain the current four mobile tabs and expose additions through home and contents navigation.
- `reading-positions-v1`: partial language map of chapter maps, each position `{ anchor: string, offset: number, progress: number, updatedAt: number }`; anchor identifies a prose block, offset is a fractional position within it, progress is 0–1 fallback.
- `learning-paths-v1`: record of stable path IDs to arrays of completed stable checkpoint IDs.
- New components may own localized copy rather than competing over the global UI file.
- Shared layout, home, chapter route and README integration belong to the primary agent. Feature agents own distinct files and report integration instructions. No agent commits or pushes independently.

## Verification

Use focused unit tests for backup validation/merge, quiz compatibility/revisions, content metadata drift, simulation outcomes, and reading-position recovery. Verify real browser flows at mobile widths, large type, all three languages, and production offline/reload. Run Svelte checks, the complete unit and browser suites, production build, and affected Rust core tests before pushing.
