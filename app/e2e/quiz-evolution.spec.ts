import { test, expect } from '@playwright/test';
import registry from '../src/lib/question-registry.json' with { type: 'json' };

const hash = registry.en['what-is-llm'].q01.legacyHash;
const jaHash = registry.ja['what-is-llm'].q01.legacyHash;
const ragHash = registry.en.rag.q01.legacyHash;

async function seed(page: import('@playwright/test').Page) {
	await page.addInitScript(({ hash, jaHash, ragHash }) => {
		if (localStorage.getItem('quiz-fixture')) return;
		localStorage.setItem('quiz-fixture', '1');
		localStorage.setItem('lang', 'en');
		localStorage.setItem('study-migrated', '1');
		const rows = [['en', 'what-is-llm', hash], ['ja', 'what-is-llm', jaHash], ['en', 'rag', ragHash]];
		const cards = rows.map(([lang, slug, qhash], i) => {
			const id = `${lang}:${slug}:${qhash}`;
			return { id, lang, slug, qhash, qn: 1, stability: 3, difficulty: 5, state: 3, due: i === 2 ? Date.now() + 86400000 : 1, lastReview: 1, reps: 0, lapses: 0 };
		});
		localStorage.setItem('study-v1', JSON.stringify({
			cards: Object.fromEntries(cards.map((c) => [c.id, c])),
			reviews: cards.map((c) => ({ cardId: c.id, ts: 1, rating: 1, elapsedMs: null, scheduledDays: 1 })),
			read: {}
		}));
	}, { hash, jaHash, ragHash });
}

test('mistake practice includes future cards and filters by topic and chapter', async ({ page }) => {
	await seed(page);
	await page.goto('/review/');
	await expect(page.locator('.counter')).toHaveText('1 / 1');
	await page.getByRole('link', { name: 'Practice mistakes', exact: true }).click();
	await expect(page.locator('.counter')).toHaveText('1 / 2');
	await page.getByLabel('Chapter', { exact: true }).selectOption('rag');
	await expect(page.locator('.counter')).toHaveText('1 / 1');
	await expect(page.locator('.from')).toContainText('RAG');
	await page.getByLabel('Topic', { exact: true }).selectOption('ai-ml-llm-relationship');
	await expect(page.getByLabel('Chapter', { exact: true })).toHaveValue('');
	await expect(page.locator('.from')).not.toContainText('RAG');
	await page.getByLabel('Topic', { exact: true }).selectOption('');
	await page.getByLabel('Chapter', { exact: true }).selectOption('what-is-llm');
	await page.locator('.opt').nth(1).click();
	await page.getByRole('button', { name: 'Finish', exact: true }).click();
	await page.reload();
	await page.getByLabel('Chapter', { exact: true }).selectOption('what-is-llm');
	await expect(page.locator('.empty-title')).toHaveText('No mistakes to practice');
});

test('progress calls the observed metric historical answer accuracy', async ({ page }) => {
	await seed(page);
	await page.goto('/progress/');
	await expect(page.locator('.stats')).toContainText('Historical answer accuracy');
	await expect(page.getByRole('link', { name: /Practice mistakes/ })).toBeVisible();
});

test('a delayed previous language cannot replace the active review session', async ({ page }) => {
	await seed(page);
	let unblock!: () => void;
	const blocked = new Promise<void>((resolve) => (unblock = resolve));
	await page.route('**/src/lib/content/en/what-is-llm.md*', async (route) => {
		await blocked;
		await route.continue();
	});
	await page.goto('/review/', { waitUntil: 'domcontentloaded' });
	await page.getByRole('button', { name: '日本語', exact: true }).click();
	await expect(page.locator('.q-text')).toContainText('パラメータ');
	unblock();
	await page.waitForLoadState('networkidle');
	await expect(page.locator('.q-text')).toContainText('パラメータ');
	await page.locator('.opt').first().click();
	const last = await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!).reviews.at(-1));
	expect(last.cardId).toBe(`ja:what-is-llm:${jaHash}`);
});

test('a failed quiz save reports the failure and can retry without duplicate answers', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('lang', 'en'));
	await page.goto('/chapter/what-is-llm/');
	await expect(page.locator('.quiz .q').first()).toBeVisible();
	await page.evaluate(() => {
		const original = Storage.prototype.setItem;
		let failed = false;
		Storage.prototype.setItem = function (key, value) {
			if (key === 'study-v1' && !failed) { failed = true; throw new Error('Quota exceeded'); }
			return original.call(this, key, value);
		};
	});
	const question = page.locator('.quiz .q').first();
	await question.locator('.opt').first().click();
	await expect(question.getByRole('status').last()).toContainText('Could not save');
	await question.getByRole('button', { name: 'Try saving again' }).click();
	await expect(question.getByRole('status').last()).toHaveText('Answer saved');
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!).reviews.length)).toBe(1);
	await page.locator('.quiz .retry').click();
	await question.locator('.opt').nth(1).click();
	await expect(question.getByRole('status').last()).toContainText('Practice answer');
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')!).reviews.length)).toBe(1);
});

for (const locale of ['zh', 'ja', 'en']) {
	test(`mistake filters fit a 320px screen with large text in ${locale}`, async ({ page }) => {
		await seed(page);
		await page.addInitScript((locale) => localStorage.setItem('lang', locale), locale);
		await page.setViewportSize({ width: 320, height: 740 });
		await page.goto('/review/?mode=mistakes');
		await expect(page.locator('.filters select')).toHaveCount(2);
		await page.evaluate(() => document.documentElement.style.setProperty('--scale-body', '1.4'));
		const geometry = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, mainWidth: document.querySelector('main')!.clientWidth, mainContent: document.querySelector('main')!.scrollWidth }));
		expect(geometry.width).toBeLessThanOrEqual(geometry.viewport + 1);
		expect(geometry.mainContent).toBeLessThanOrEqual(geometry.mainWidth + 1);
		await page.screenshot({ path: `/tmp/whats-next/quiz-${locale}-mobile.png`, fullPage: true });
	});
}
