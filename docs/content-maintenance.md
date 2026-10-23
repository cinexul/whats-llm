# Maintaining the three editions

The maintained inventory lives in `app/src/lib/content-metadata.json`. Every chapter has a stable slug, a monotonically increasing revision for each edition, a SHA-256 hash of its complete Markdown, an editorial review date and evidence, a revision history, and explicit source references. Japanese and English also record the Chinese revision **and hash** against which their meaning was checked. Only CRLF line endings are normalized before hashing; wording, quiz markers, examples, and answers all count as changes.

The initial 45 chapters and 135 edition records inherit the **2026-10-22 book editorial review** in [the review report](content-review-2026-10-22.md). Their scope is `edition`, not a claim that every chapter received a new independent factual review during metadata registration. The report documents review of English and Japanese meaning and terminology. Invisible quiz identity markers were included when capturing the baseline; they do not represent new source research. Initial revisions are `1` and remain stable until explicitly acknowledged updates.

The source registry preserves the URLs already cited in the chapters. A source's `checkedAt` is populated only when a dated chapter record documents that source check. The `evidence` link points to that pre-metadata chapter revision. The 2026-10-22 report supplies additional pinned snapshots for Codex, Claude Code, Agent Skills, and MCP. Vendor documentation and other links without individual accessible verification remain `checkedAt: null`. A blank check date is intentional. **Adding metadata and testing reachability do not renew verification dates.**

## Review cadence

`concept` chapters use a 365-day review interval. `product-guide` chapters use 90 days because interfaces, installation, permissions, account policies, or SDK integrations can change quickly. The initial product group includes the product overview, model/product/API distinction, coding agents, Claude Code/Codex workflow and hands-on chapters, local models, Skills/MCP, permissions, privacy/team policies, API/MCP/agent projects, cost/quota guidance, and the detailed tool appendix. Classification is explicit per chapter; change it when the chapter's emphasis changes.

An interval is an editorial reminder, not a guarantee of accuracy or availability. The reader shows the next suggested review date and translation status. An overdue chapter remains readable. Source check dates are independent of the editorial interval. Editorial changes also do not change quiz revisions automatically; follow the [quiz identity guidance](quiz-maintenance.md) when answers, options, or meaning change.

## Deterministic checks

From `app/`, with the repository's supported Node version:

```bash
node scripts/content-maintenance.mjs check
```

The first command checks the table of contents, all three file inventories, required metadata, revisions and histories, hashes, translation alignment, source references, dates, and local evidence-file existence. It needs no package installation, network, or system clock. Missing chapters, missing translations, edits without acknowledgement, and stale translations fail the command.

Pass a date explicitly to inspect the review queue:

```bash
node scripts/content-maintenance.mjs check --as-of 2027-01-20
node scripts/content-maintenance.mjs check --as-of 2027-01-20 --fail-overdue
```

The first command reports due reviews without making age alone a failure; the second is suitable for a scheduled editorial check. Do not put a moving date requirement into ordinary pull-request checks. CI runs `node scripts/content-maintenance.mjs check` after installation and before the production build.

## Updating a chapter

1. Edit the Chinese source and, where appropriate, its quiz metadata. Review the actual claims against relevant primary sources. Record what you checked, its limitations, and any fixed source snapshots in a new `docs/*.md` review note or an accessible HTTPS review record.
2. Update the source registry for any added/removed citations. Give every source a title in all three UI languages. Set a source's individual `checkedAt` and evidence **only after actually checking it**; never bulk-refresh these fields. A non-changing reference can remain on its previous verified date.
3. Preview the Chinese acknowledgement, using the actual date and a Chinese change note. This records a chapter review and increments that edition's revision. It leaves both translations unchanged and therefore stale.

```bash
node scripts/content-maintenance.mjs review \
  --slug codex-handson --lang zh --date YYYY-MM-DD \
  --evidence docs/your-review-note.md --note '用中文简述本次核对与修改。' \
  --ack-reviewed
```

4. Inspect the preview, then repeat with `--write` to save it. The evidence file must already exist when using a repository path. Dates must be real, cannot move backward, and the CLI refuses future dates. The write uses a temporary file and rename; it changes one edition's metadata only. Review the Git diff before continuing.
5. Update and compare each translation against the current Chinese source, including examples, quiz choices, correct answers, and explanations. A translation may need no text change after comparison, but that conclusion still requires explicit acknowledgement. Preview, then add `--write` for each edition:

```bash
node scripts/content-maintenance.mjs review \
  --slug codex-handson --lang en --date YYYY-MM-DD \
  --evidence docs/your-review-note.md --note 'Describe the English changes and meaning check.' \
  --ack-reviewed --ack-translation

node scripts/content-maintenance.mjs review \
  --slug codex-handson --lang ja --date YYYY-MM-DD \
  --evidence docs/your-review-note.md --note '日本語で変更点と意味の確認を記録。' \
  --ack-reviewed --ack-translation
```

The CLI refuses to align a translation if the Chinese file has unacknowledged edits. It does not copy source text, translate automatically, infer that unchanged text is correct, or refresh other editions. It also never changes individual external-source verification dates. The acknowledgements attest to work the maintainer has done; a hash only detects changes and cannot establish translation quality.

6. Run the deterministic check, Svelte check and production build. Review all affected languages in the reader. Commit source edits, review evidence and metadata together. Do not resolve a failed drift check by copying new hashes into the JSON: use the explicit review workflow so translations and the revision history remain honest.

For a new chapter, register it in all three tables of contents and add all three files and metadata records. There is deliberately no bulk “mark everything current” command. A new translation should identify the source revision actually compared, rather than borrowing another chapter's alignment.

## Optional external link diagnostics

```bash
node scripts/check-content-links.mjs --timeout-ms 10000 --output /tmp/content-link-report.json
```

This checks unique cited URLs and stored snapshots with bounded concurrency and timeouts. It uses `HEAD` and falls back to `GET` only when the server does not support `HEAD`. It preserves TLS verification. HTTP 401/403/429 are reported as **unconfirmed access**; connection failures and timeouts are **unconfirmed network**. These are not evidence that a citation disappeared. Any unconfirmed or unsuccessful result exits nonzero for manual follow-up.

If the execution environment supplies an HTTP/HTTPS proxy and direct Node requests cannot connect, a supported Node runtime can use that existing configuration via `NODE_USE_ENV_PROXY=1 node scripts/check-content-links.mjs`. Do not print proxy variable values, which may contain credentials. Retry after correcting the network configuration; retain unconfirmed outcomes if access is still unavailable.

This command is separate from deterministic CI. It does not edit the metadata, prove a source supports a claim, or mark a translation current. Keep dated network reports distinct from editorial source-review evidence. The metadata implementation itself made no fresh external-network verification claim.

## Reader integration

```svelte
<script lang="ts">
  import ChapterMetadata from '$lib/ChapterMetadata.svelte';
</script>

<ChapterMetadata {slug} lang={$lang} />
```

Place the panel near the chapter title or after the article and before its quiz. Its native `<details>` control works by keyboard, and all labels, scope explanations, source status, and revision messages support Chinese, English, and Japanese. It inherits paper theme variables and body text scaling. The optional `asOf="YYYY-MM-DD"` prop is useful for reproducible UI checks; production uses the current UTC date. No Markdown needs to be fetched to display metadata, so it remains available in an installed offline book.
