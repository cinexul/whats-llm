#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, readdir, access, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
	CONTENT_LANGUAGES, acknowledgeEdition, isReviewDate, reviewDueAt, reviewStatus,
	translationStatus, validateContentMetadata
} from '../src/lib/content-metadata-rules.ts';

export const appRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = resolve(appRoot, '..');
const metadataFile = resolve(appRoot, 'src/lib/content-metadata.json');

export async function readContentState() {
	const data = JSON.parse(await readFile(metadataFile, 'utf8'));
	const toc = JSON.parse(await readFile(resolve(appRoot, 'src/lib/toc.json'), 'utf8'));
	const inventory = {};
	const hashes = {};
	const inventoryProblems = [];
	for (const lang of CONTENT_LANGUAGES) {
		const directory = resolve(appRoot, 'src/lib/content', lang);
		const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
		inventory[lang] = files.map((file) => file.slice(0, -3));
		const expected = toc[lang].flatMap((part) => part.chapters.map((chapter) => chapter.slug)).sort();
		if (JSON.stringify(expected) !== JSON.stringify(inventory[lang])) {
			inventoryProblems.push({ code: 'toc-mismatch', path: lang, message: 'Table of contents and chapter files differ.' });
		}
		for (const file of files) {
			const text = (await readFile(resolve(directory, file), 'utf8')).replace(/\r\n/g, '\n');
			hashes[`${lang}/${file.slice(0, -3)}`] = createHash('sha256').update(text).digest('hex');
		}
	}
	return { data, inventory, hashes, inventoryProblems };
}

async function checkEvidenceFiles(data) {
	const references = new Set([
		...Object.values(data.chapters).flatMap((chapter) => Object.values(chapter.editions).map((edition) => edition.reviewEvidence)),
		...Object.values(data.sources).map((source) => source.evidence)
	]);
	const problems = [];
	for (const reference of references) {
		if (typeof reference !== 'string' || !reference.startsWith('docs/')) continue;
		try { await access(resolve(repoRoot, reference)); }
		catch { problems.push({ code: 'missing-evidence', path: reference, message: 'Review evidence file does not exist.' }); }
	}
	return problems;
}

const help = `Content maintenance (Node 22.22+, no dependencies or network)

  node scripts/content-maintenance.mjs check
  node scripts/content-maintenance.mjs check --as-of YYYY-MM-DD [--fail-overdue]
  node scripts/content-maintenance.mjs review --slug SLUG --lang zh|ja|en \\
    --date YYYY-MM-DD --evidence docs/review.md --note "Localized change note" \\
    --ack-reviewed [--ack-translation] [--write]

check is deterministic; dates affect results only when --as-of is supplied.
review previews by default. --write changes ONE edition after explicit acknowledgement.
Updating Chinese leaves translations stale. Review each translation with --ack-translation.
Source-link check dates are never automatically refreshed by either command.`;

export async function main(args = process.argv.slice(2)) {
	const { values, positionals } = parseArgs({
		args, allowPositionals: true, options: {
			help: { type: 'boolean' }, 'as-of': { type: 'string' }, 'fail-overdue': { type: 'boolean' },
			slug: { type: 'string' }, lang: { type: 'string' }, date: { type: 'string' },
			evidence: { type: 'string' }, note: { type: 'string' }, 'ack-reviewed': { type: 'boolean' },
			'ack-translation': { type: 'boolean' }, write: { type: 'boolean' }
		}
	});
	if (values.help) { console.log(help); return; }
	const command = positionals[0] ?? 'check';
	if (positionals.length > 1 || !['check', 'review'].includes(command)) throw new Error(help);
	const { data, inventory, hashes, inventoryProblems } = await readContentState();
	if (command === 'check') {
		if (values['as-of'] && !isReviewDate(values['as-of'])) throw new Error('--as-of must be a real YYYY-MM-DD date.');
		if (values['fail-overdue'] && !values['as-of']) throw new Error('--fail-overdue requires an explicit --as-of date.');
		const problems = [...inventoryProblems, ...validateContentMetadata(data, inventory, hashes)];
		if (!problems.length) problems.push(...await checkEvidenceFiles(data));
		let dueCount = 0;
		if (values['as-of'] && !problems.length) {
			for (const [slug, chapter] of Object.entries(data.chapters)) {
				for (const lang of CONTENT_LANGUAGES) {
					if (reviewStatus(chapter, lang, values['as-of']) === 'due') {
						dueCount++;
						console.log(`REVIEW DUE ${lang}/${slug}: ${reviewDueAt(chapter, lang)}`);
					}
				}
			}
		}
		for (const problem of problems) console.error(`${problem.code} ${problem.path}: ${problem.message}`);
		if (problems.length || (values['fail-overdue'] && dueCount)) process.exitCode = 1;
		else console.log(`Content metadata valid: ${Object.keys(data.chapters).length} chapters, ${Object.keys(hashes).length} editions, ${Object.keys(data.sources).length} source links${values['as-of'] ? `; ${dueCount} reviews due as of ${values['as-of']}` : ''}.`);
		return;
	}
	if (!values.slug || !CONTENT_LANGUAGES.includes(values.lang) || !values.date || !values.evidence || !values.note) {
		throw new Error('review requires --slug, --lang, --date, --evidence and --note. Use --help.');
	}
	if (values.date > new Date().toISOString().slice(0, 10)) throw new Error('A review cannot be recorded with a future date.');
	if (values.evidence.startsWith('docs/')) await access(resolve(repoRoot, values.evidence));
	const updated = acknowledgeEdition(data, hashes, {
		slug: values.slug, lang: values.lang, date: values.date, evidence: values.evidence, note: values.note,
		reviewed: values['ack-reviewed'] === true, translationReviewed: values['ack-translation'] === true
	});
	const before = data.chapters[values.slug].editions[values.lang];
	const after = updated.chapters[values.slug].editions[values.lang];
	console.log(`${values.write ? 'Write' : 'Preview'} ${values.lang}/${values.slug}: revision ${before.revision} → ${after.revision}, review ${after.reviewedAt}.`);
	for (const lang of ['ja', 'en']) console.log(`  ${lang}: ${translationStatus(updated, values.slug, lang)}`);
	if (!values.write) { console.log('No file changed. Add --write to save this acknowledged review.'); return; }
	const temporary = `${metadataFile}.${process.pid}.tmp`;
	await writeFile(temporary, JSON.stringify(updated, null, 2) + '\n', 'utf8');
	await rename(temporary, metadataFile);
	console.log('Saved one edition. Run check after reviewing all affected translations.');
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
	main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
