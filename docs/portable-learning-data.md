# Portable learning backups

Open **My library** (`/library/`) to download or restore your learning. This works in the browser and the desktop application without an account. A backup includes local chapter edits and all three languages, including study cards that are no longer active in the current book.

Choose a JSON file to see its counts before importing. Download the device's pre-import backup, then choose **Merge this backup**. The original recovery copy remains downloadable after the attempt. A failed import closes its preview; if storage also prevents rollback, the recovery download still contains the original data, not the partial result.

## Format version 2

New exports use version 2. The importer also accepts version 1 files; their missing `chapterEdits` section never removes existing local edits or reset records.

The root has these required fields:

| Field | Contents |
| --- | --- |
| `format` | Exactly `whats-llm-learning` |
| `version` | Exactly `2` for new exports; legacy `1` is also accepted |
| `exportedAt` | ISO date and time |
| `annotations` | Notes/highlights, including original creation and optional last-edit timestamps |
| `chapterEdits` | Local chapter Markdown, original source snapshots, and reset records; required in version 2 |
| `study` | Every card, every review, read chapters with timestamps, and native key/value settings |
| `readingChapter` | Last chapter per language |
| `readingPositions` | Chapter positions per language: `anchor`, fractional `offset`, fractional `progress`, `updatedAt` |
| `learningPaths` | Stable path IDs mapped to completed stable checkpoint IDs |
| `preferences` | Optional `lang`, `theme`, and `fontScales` (`nav`, `heading`, `body`) |

`study` contains `cards` and `reviews` arrays, a `read` array of `{lang, slug, ts}`, and a `kv` string map. Cards retain the existing study field names. Reviews retain their card ID, timestamp, rating, elapsed time, and scheduled interval, plus optional native stability/difficulty snapshots. Browser storage preserves native read timestamps and settings in `study-metadata-v1`, so they survive a browser-to-desktop round trip.

Notes edited in the current session are included even if their last storage write failed; deleting all notes exports an empty snapshot instead of reviving an older saved copy.

Each `chapterEdits` entry contains `lang`, `slug`, `markdown`, `original`, and `updatedAt` (milliseconds since the Unix epoch). `markdown` is the locally saved Markdown, or `null` for a reset to the book's source. The `original` text captures the source used when editing so changes can be compared later. Both text fields are validated before import. Reset records remain in backups to prevent an older file from reviving discarded edits; the preview count includes only active edited chapters. The browser and desktop app store the authoritative snapshot in IndexedDB (`whats-llm-chapter-edits`, store `chapters`, key `snapshot`). Existing `chapter-edits-v1` local-storage records migrate on the first read and remain an archive; later reads use IndexedDB. Local storage carries only a change notification for other tabs. Edits remain local until you export or share a backup.

The importer rejects the entire file before writing if its format/version is unsupported or a field is invalid. Checks include known language/edited-chapter/reading-chapter/path/checkpoint IDs, unique edited chapters per language, card identity (`lang:slug:qhash`), review references, duplicate IDs, timestamps, finite numbers, display limits, and bounded collection/text sizes. Unknown fields are rejected. Update the app before importing a backup that uses newer paths or a newer schema.

Files must fit within 32 MiB; export and import use the same limit. Maximum collection sizes are 20,000 annotations, 50,000 cards, 200,000 review events, 20,000 read chapters, and 135 chapter edit/reset records. Each edited Markdown body and original source is limited to 200,000 characters, with 2,000,000 characters across all chapter edit text. A combined import must also fit these limits.

## Merge rules

- For a shared annotation ID, use the newer `updatedAt`, or `createdAt` for legacy notes.
- For a chapter edit or reset with the same language and chapter, use the newer `updatedAt`, preserving its original source snapshot. A newer reset suppresses an older edit; a later edit can replace a reset.
- For a shared card ID, use the newer `lastReview`.
- For a shared reading position, use the newer `updatedAt`.
- Timestamp ties keep this device's record. The completion message reports conflicting records and ties.
- Read chapters and path checkpoints form a union. Read timestamps retain the newer value.
- Review events form a multiset union: importing the same file twice does not add events, while multiple identical events already recorded in one source remain intact.
- Existing preferences and native key/value settings win when both devices have a value. Missing values are imported.

Removing an item from a backup does not delete the item on another device. An explicit chapter reset is a timestamped record and can replace an older edit during a merge. Backups are snapshots rather than an account or continuous synchronization service.

Imports hold the same exclusive Web Lock as chapter saves and resets, from the recovery snapshot through persistence and any rollback. A current browser using HTTPS or localhost, or a current system WebView for the desktop app, is required for this write coordination. Browser settings and learning records are written first, followed by the chapter snapshot in one IndexedDB transaction. If the IndexedDB write fails, earlier browser writes are restored. Native study tables merge in one SQLite transaction after chapter edits and the annotation file are saved; native failures also restore the previous IndexedDB snapshot and browser values. Annotation files use their existing atomic write path. If unavailable storage also prevents recovery, the app reports the error and retains the original downloadable backup, including its original chapter edits.
