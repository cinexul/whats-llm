# Local chapter edits

Choose **Edit chapter** below a chapter title to create your own version of its Markdown body. The editor offers editing, a sanitized preview, and a line diff. Save applies the local body immediately and rebuilds that chapter's section links. Chinese, Japanese, and English edits are independent.

Saved changes are visible in three places: the **Locally edited** label and save time below the title, a badge in the book contents, and the **My chapter edits** list in My library. The list includes every language and links directly to its corresponding chapter or diff. Diff sections use explicit Added/Removed labels and +/− marks as well as green/red backgrounds. Unchanged blocks are collapsible, keeping the changes easy to find.

The diff normally compares with the official body captured at the first local save. Later saves retain that baseline. If the bundled book changes, a notice appears and the comparison can switch to the current original; the app never silently rebases or rewrites local work. **Restore original** asks for confirmation and returns to the current bundled text. Editing again after a restore captures a fresh baseline.

Only chapter bodies are editable. Navigation titles, official quizzes, grading, practice cards, and book-wide search continue to use the original book. The revision/source footer describes the original book, not the local edit. Existing text highlights remain stored, though a highlight may no longer attach if its quoted passage has been changed or removed.

## Keeping work safe

- **Save changes** commits an IndexedDB transaction before reporting success. Failed saves retain the open draft, with a Markdown download available for recovery. Closing a changed draft or navigating away asks before discarding it.
- Opening an editor captures the saved revision. A newer edit, restore, or backup import causes a stale save to fail with a conflict message; it does not overwrite the newer record. Download the draft, reopen the editor, and compare before saving again. This is local editing, not a simultaneous collaborative editor.
- Saves, restores, and backup imports share an exclusive Web Lock across windows, including import rollback. A current browser on HTTPS (or localhost) is required for these writes. If locking is unavailable, writes fail explicitly and draft downloads remain available; reading continues to work.
- Both the browser and Tauri webview store local edits in the `whats-llm-chapter-edits` IndexedDB database. A legacy `chapter-edits-v1` localStorage snapshot is migrated once. Subsequent reads always use the database, avoiding stale per-window localStorage caches. Edits belong to that browser profile/application installation; clearing its data removes them. Unsaved drafts are not automatically recovered after a crash.
- Export a learning backup from My library to preserve saved edits and their original baselines. Version 2 backups include all languages and restore markers. Legacy version 1 imports preserve existing edits. See [portable learning backups](portable-learning-data.md) for bounds and merge behavior.
- Markdown downloads contain the editor's current draft. Learning backups contain saved chapter edits. Download a draft before closing if saving is unavailable.

Local content and imported Markdown pass through DOMPurify before rendering. Scripts, executable attributes, forms, styles that could cover the interface, and application CSS classes are removed; code highlighting stays available. Ordinary links and images still work and may access their destinations. The diff displays Markdown as text, never executable HTML. The original issue's `&quot;` heading is covered by renderer and browser regression checks.

## Verification

The automated coverage below records the 2026-10-22 implementation. For current checkout commands, see the [project README](../README.en.md).

Verified locally on 2026-10-22: Svelte check reports no errors or warnings; all 359 unit tests, 56 production-build browser tests, and 3 production PWA tests pass. The PWA checks include editing, reloading, and viewing the diff offline. Independent review also repeated the three concurrency cases six times (18 passes) and forced stale legacy-cache reads while confirming both saved chapters remained in IndexedDB. Content metadata and all 720 quiz registrations validate unchanged.

Storage tests cover independent editions, malformed snapshots, size limits, failure retention, revision conflicts, restore markers, and baseline behavior. Backup tests cover both versions, merge ties, reset precedence, native/browser rollback, and store refresh. Renderer and diff tests cover entity decoding, legacy anchors, HTML sanitization, exact reconstruction, and bounded work for large changes.

`e2e/local-edits.spec.ts` exercises editing, saved markers, language-specific library links, original quizzes, diff, restore, rejected writes, recovery downloads, cross-window conflicts, updated-original notices, safe preview, and all three languages at 320 px with 150% text. Browser validation does not replace testing an installed Tauri package.

Actual production-build screenshots: [chapter marker](local-edits/mobile-reading.png), [line diff](local-edits/mobile-diff.png), [all edited chapters](local-edits/mobile-library.png). The example edits are browser-local demonstration data, not changes to the textbook source.
