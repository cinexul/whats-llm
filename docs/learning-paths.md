# Goal-oriented learning paths

Open `/learn/` or follow a path link from the home page. Paths use existing chapters and always take chapter titles from `app/src/lib/manifest.ts`.

| Stable path ID | Goal | Selected steps |
| --- | --- | --- |
| `orientation` | A one-page conceptual explanation | Model generation, context, verification |
| `everyday-report` | A source-backed one-page work brief | Scope and permissions, evidence table, draft, source verification |
| `first-project` | A local personal web page and a restore rehearsal | Small plan, reversible work area, preview loop, acceptance and recovery |

The orientation's approximately 30 minutes cover selected passages and exercises, not reading three entire chapters. Other estimates are approximate and the project excludes tool installation time. Exercises can be done with existing tools or manually; a paid API is not required.

Every step has selected reading, a practical action, a deliverable, and concrete self-assessment criteria. Readers explicitly check “I produced the deliverable and checked every criterion.” Visiting a chapter and marking a chapter as read do not complete a path checkpoint. Written deliverables stay in the reader's own files; the app stores completion only.

## Integration and storage

- The home and contents feature navigation links to `/learn/`. The complete page is `app/src/routes/learn/+page.svelte` and uses the existing language store.
- Deep links use `/learn/?path=orientation#path-details` (and the other stable path IDs).
- `app/src/lib/learning-paths-data.ts` owns curated multilingual content. Shared structure keeps path IDs, checkpoint IDs, and reading order identical across Chinese, Japanese, and English. Localized chapter titles are resolved from the manifest.
- `app/src/lib/learning-paths.ts` exports `learningPaths`, `learningPathStore`, `pathProgress`, `normalizeLearningPathProgress`, `LEARNING_PATHS_KEY`, and types.
- The exact key is `learning-paths-v1`. Its value is a plain object mapping stable path IDs to arrays of completed stable checkpoint IDs, for example `{"orientation":["orientation-explain"]}`. Completion is intentionally shared across translations.
- `learningPathStore.setCheckpoint(pathId, checkpointId, complete)` rejects unknown IDs. `resetPath(pathId)` affects only one path; the UI first asks for explicit inline confirmation.
- `normalizeLearningPathProgress(unknown)` returns `{ progress, repaired }`. It rejects non-object roots, unknown paths, cross-path or unknown checkpoints, and non-string entries; it deduplicates valid checkpoints. Invalid arrays cannot invent completion. Reads preserve valid entries and expose a notice, without silently rewriting the original value.
- Storage failures are visible. A failed write retains the change for the current session and explains that it was not persisted. Do not interpret the visible session state as proof of a successful save.
- `learningPathStore.reload()` refreshes after restoration. The route reloads on mount and responds to `learning-data-imported` and browser storage events.

New paths or checkpoint replacements require explicit identity decisions. Rewording or translating a step must preserve its ID. Materially different learning requirements should receive new IDs; normalization will not award old completion to a new ID.

## Verification

Run from `app`:

```sh
npm run test -- src/lib/learning-paths.test.ts
npm run check
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test e2e/learning-paths.spec.ts
```

The unit suite checks real chapter references, translation identity, timing claims, manual completion, next-step choice, persistence, reset isolation, corrupt data, storage failures, and import reloads. Browser coverage checks keyboard completion, reloads, language switching, explicit reset confirmation, corrupt data notices, import notifications, failed writes, and all three paths at 320px with 150% type in each language.
