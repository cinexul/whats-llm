import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { test, expect } from '@playwright/test';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k from 'js-tiktoken/ranks/o200k_base';
import { Tokenizer } from '@huggingface/tokenizers';
import { TOKEN_SAMPLES } from '../../src/lib/labs/token-samples';

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('lang', 'en'));
});

test('context compaction frees space while visibly losing a deadline', async ({ page }) => {
	await page.goto('/labs/#context');
	const context = page.locator('#context');
	await expect(page.locator('.labs h1')).toBeVisible();
	await page.context().setOffline(true);
	await context.getByRole('checkbox', { name: 'Include: Venue lookup' }).check();
	await expect(context.getByTestId('context-result')).toContainText('too large');
	await context.getByRole('button', { name: 'Use a short summary: Your request' }).click();
	await expect(context.getByTestId('context-result')).toContainText('exact deadline is absent');
	await expect(context.getByTestId('context-total')).toContainText('1,560');
	await context.getByRole('button', { name: 'Reload original source: Your request' }).click();
	await context.getByRole('checkbox', { name: 'Include: Venue lookup' }).uncheck();
	await expect(context.getByTestId('context-result')).toContainText('18:00 on 20 October');
});

test('RAG cites selected evidence and abstains for all three evidence failures', async ({ page }) => {
	await page.goto('/labs/#rag');
	const rag = page.locator('#rag');
	await expect(page.locator('.labs h1')).toBeVisible();
	await page.context().setOffline(true);
	await expect(rag.getByTestId('rag-result')).toContainText('30 days');
	await rag.getByRole('button', { name: 'Conflicting', exact: true }).click();
	await expect(rag.getByTestId('rag-result')).toContainText('sources disagree');
	await expect(rag.getByTestId('rag-result').getByRole('link')).toHaveCount(2);
	await rag.getByRole('button', { name: 'Outdated', exact: true }).click();
	await expect(rag.getByTestId('rag-result')).toContainText('expired');
	await rag.getByRole('button', { name: 'Missing', exact: true }).click();
	await expect(rag.getByTestId('rag-result')).toContainText('no current returns rule');
	await rag.getByRole('button', { name: 'Reset experiment', exact: true }).click();
	await rag.getByTestId('rag-result').getByRole('link', { name: 'A · Returns policy' }).click();
	await expect(page).toHaveURL(/#rag-source-policy$/);
});

test('scoped grants gate mock actions, checks report failures, and undo preserves logs', async ({ page }) => {
	await page.goto('/labs/#permissions');
	const lab = page.locator('#permissions');
	await expect(page.locator('.labs h1')).toBeVisible();
	await page.context().setOffline(true);
	await lab.getByRole('button', { name: 'Update the draft', exact: true }).click();
	await expect(lab.getByTestId('permission-log')).toContainText('Required grant is off');
	await lab.getByRole('checkbox', { name: 'Run only check-invitation', exact: true }).check();
	await lab.getByRole('button', { name: 'Check the draft', exact: true }).click();
	await expect(lab.getByTestId('permission-log')).toContainText('Check failed');
	await lab.getByRole('checkbox', { name: 'Write /project/invitation.txt', exact: true }).check();
	await lab.getByRole('button', { name: 'Update the draft', exact: true }).click();
	await expect(lab.getByTestId('mock-draft')).toHaveText('Welcome, volunteers!');
	await lab.getByRole('button', { name: 'Check the draft', exact: true }).click();
	await expect(lab.getByTestId('permission-log')).toContainText('Check passed');
	await lab.getByRole('button', { name: 'Run publish-site', exact: true }).click();
	await expect(lab.getByTestId('permission-log')).toContainText('Outside every grant');
	await lab.getByRole('button', { name: 'Undo latest file change', exact: true }).click();
	await expect(lab.getByTestId('mock-draft')).toHaveText('Welcome!');
	await expect(lab.getByTestId('permission-log').locator('li')).toHaveCount(6);
	await lab.getByRole('button', { name: 'Reset experiment', exact: true }).click();
	await expect(lab.getByTestId('permission-log').locator('li')).toHaveCount(0);
	await expect(lab.getByRole('checkbox').first()).not.toBeChecked();
});

for (const language of ['zh', 'ja', 'en']) {
	test(`labs fit 320px at large type in ${language}, with keyboard controls`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 740 });
		await page.addInitScript((value) => {
			localStorage.setItem('lang', value);
			localStorage.setItem('font-scales', JSON.stringify({ nav: 1.5, heading: 1.5, body: 1.5 }));
		}, language);
		await page.goto('/labs/');
		await expect(page.locator('html')).toHaveAttribute('lang', language === 'zh' ? 'zh-CN' : language);
		await expect(page.getByTestId('token-table')).toBeVisible({ timeout: 30_000 });
		for (const id of ['tokens', 'context', 'rag', 'permissions']) {
			await page.locator(`.lab-jump a[href="#${id}"]`).click();
			await expect(page.locator(`#${id}`)).toBeInViewport();
			const dimensions = await page.evaluate(() => {
				const main = document.querySelector('main')!;
				return { window: innerWidth, document: document.documentElement.scrollWidth, main: main.clientWidth, content: main.scrollWidth };
			});
			expect(dimensions.document).toBeLessThanOrEqual(dimensions.window + 1);
			expect(dimensions.content).toBeLessThanOrEqual(dimensions.main + 1);
		}
		const grant = page.locator('#permissions input[type="checkbox"]').first();
		await grant.focus();
		await page.keyboard.press('Space');
		await expect(grant).toBeChecked();
	});
}

test('the token lab shows the same counts as the reference tokenizers and updates while typing', async ({ page }) => {
	const gpt = new Tiktoken(o200k);
	const qwen = new Tokenizer(JSON.parse(gunzipSync(readFileSync('static/tokenizers/qwen3.json.gz')).toString('utf8')), {});
	const counts = (text: string) => ({ o200k: gpt.encode(text).length, qwen3: qwen.encode(text, { add_special_tokens: false }).ids.length });
	await page.goto('/labs/#tokens');
	const lab = page.locator('#tokens');
	await expect(lab.getByTestId('token-table')).toBeVisible({ timeout: 30_000 });
	for (const [preset, name] of [['everyday', 'Everyday request'], ['code', 'A line of code']] as const) {
		await lab.getByRole('button', { name, exact: true }).click();
		for (const lang of ['zh', 'ja', 'en'] as const) {
			const expected = counts(TOKEN_SAMPLES[preset][lang]);
			await expect(lab.getByTestId(`count-o200k-${lang}`)).toHaveText(String(expected.o200k));
			await expect(lab.getByTestId(`count-qwen3-${lang}`)).toHaveText(String(expected.qwen3));
		}
	}
	await lab.getByLabel(/^English/).fill('Hello world');
	await expect(lab.getByTestId('count-o200k-en')).toHaveText('2');
	await expect(lab.getByRole('button', { name: 'A line of code', exact: true })).toHaveAttribute('aria-pressed', 'false');
});
