# Maintaining quiz identity and revisions

Every quiz question carries an invisible marker on its numbered prompt line, for example `<!-- quiz: q01 revision: 1 -->`. The ID is stable within its chapter and shared across translations. Keep it when rewording or reordering a question; assign a new ID when replacing the concept being assessed. Display numbers are independent of IDs. Each language has its own content revision and study history.

`app/src/lib/question-registry.json` records the current content fingerprint/revision and an immutable compatibility baseline for existing questions. Its `legacyHash` and `legacyAssessment` fields preserve all 205 previously scored question IDs in each language. Never regenerate or overwrite those fields from revised source text.

For any prompt, explanation, tag, option, or answer change:

1. Edit the source question, retaining its ID when the learning objective is the same.
2. Increment the question's `revision` marker. Review the corresponding translations and update their markers when their content changes.
3. From `app`, run `node scripts/check-quiz-registry.mjs --write`. It refuses to acknowledge a changed question without a higher revision and preserves compatibility fields. New IDs receive new assessment identities.
4. Run `node scripts/check-quiz-registry.mjs`, `npm run check`, and the content-maintenance checks. If the chapter metadata reports drift, update it using the content-maintenance workflow too.

Prompt/explanation-only edits retain the existing study identity even after the content revision increases. Changes to options (including order/text) or the correct answer automatically produce a new assessment identity based on the stable ID and the options/answer fingerprint. This happens even if an editor forgets to bump a revision; the maintenance check additionally rejects unacknowledged changes. Old cards and review logs remain stored and exportable, but obsolete assessments leave active mastery/due/mistake lists. Returning to an exactly identical former assessment also returns to that assessment's history.

Practice mistakes means the latest recorded answer for a current question was incorrect. A correct practice answer clears that mistake and updates the normal review schedule. Topic/chapter filters operate on the current edition. Historical answer accuracy counts all recorded answers in that language, including old question revisions; it is not a prediction of retention.

Both browser storage and native SQLite retain their existing `lang:slug:qhash` card shape. Here `qhash` is an opaque identity string: legacy hash for unchanged baseline assessments, or `stable-id~assessment-fingerprint` for new/revised assessments. No database migration or backup format change is needed.
