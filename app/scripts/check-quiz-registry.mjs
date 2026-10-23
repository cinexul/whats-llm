// node scripts/check-quiz-registry.mjs [--write]
// --write仅在提高修订号后，才确认内容变更。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { splitQuiz, contentFingerprint } from '../src/lib/quiz.ts';

const root = new URL('../src/lib/', import.meta.url);
const path = new URL('question-registry.json', root);
const registry = JSON.parse(readFileSync(path, 'utf8'));
const write = process.argv.includes('--write');
const errors = [];
let count = 0;
for (const lang of ['zh', 'ja', 'en']) {
	const directory = new URL(`content/${lang}/`, root);
	for (const file of readdirSync(directory).filter((file) => file.endsWith('.md')).sort()) {
		const slug = file.slice(0, -3);
		const questions = splitQuiz(readFileSync(new URL(file, directory), 'utf8')).quiz?.questions ?? [];
		const seen = new Set();
		for (const q of questions) {
			count++;
			const location = `${lang}/${slug} question ${q.n}`;
			if (!q.id || q.revision < 1 || seen.has(q.id)) {
				errors.push(`${location}: missing or duplicate stable ID/revision`);
				continue;
			}
			seen.add(q.id);
			const prior = registry[lang]?.[slug]?.[q.id];
			const content = contentFingerprint(q);
			if (prior?.content === content && prior.revision === q.revision) continue;
			if (!write) {
				errors.push(`${location} (${q.id}): content/revision differs from registry; review the change, bump its revision and run with --write`);
				continue;
			}
			if (prior && q.revision <= prior.revision) {
				errors.push(`${location} (${q.id}): revision must increase beyond ${prior.revision}`);
				continue;
			}
			registry[lang] ??= {};
			registry[lang][slug] ??= {};
			// 禁止改写legacyHash和legacyAssessment；它们用于保留旧卡片。
			registry[lang][slug][q.id] = { ...prior, revision: q.revision, content };
		}
	}
}
if (errors.length) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	if (write) writeFileSync(path, JSON.stringify(registry, null, 2) + '\n');
	console.log(`${count} quiz questions verified across three languages${write ? `; saved ${fileURLToPath(path)}` : ''}.`);
}
