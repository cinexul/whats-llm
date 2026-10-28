#!/usr/bin/env node
/** 可选的网络诊断，不修改审阅日期，也不判断内容是否符合事实。 */
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { isHttpsUrl } from '../src/lib/content-metadata-rules.ts';

const { values } = parseArgs({ options: { 'timeout-ms': { type: 'string', default: '10000' }, output: { type: 'string' } } });
const timeout = Number(values['timeout-ms']);
if (!Number.isInteger(timeout) || timeout < 100 || timeout > 60000) throw new Error('Use --timeout-ms between 100 and 60000.');
const metadata = JSON.parse(await readFile(new URL('../src/lib/content-metadata.json', import.meta.url), 'utf8'));
const urls = [...new Set(Object.values(metadata.sources).flatMap((source) => [source.url, source.snapshot].filter(Boolean)))];
const results = [];
let next = 0;

async function check(url) {
	const startedAt = new Date().toISOString();
	try {
		if (!isHttpsUrl(url)) throw new Error('Only public HTTPS source links are supported.');
		const options = { redirect: 'follow', signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'WhatsLLM-source-link-check/1.0' } };
		let response = await fetch(url, { ...options, method: 'HEAD' });
		if (response.status === 405 || response.status === 501) {
			response = await fetch(url, { ...options, method: 'GET', signal: AbortSignal.timeout(timeout) });
			await response.body?.cancel();
		}
		const outcome = response.ok ? 'reachable' : [401, 403, 429].includes(response.status) ? 'unconfirmed-access' : 'http-error';
		return { url, startedAt, outcome, status: response.status, finalUrl: response.url };
	} catch (error) {
		return { url, startedAt, outcome: 'unconfirmed-network', error: error.message };
	}
}

await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
	while (next < urls.length) {
		const result = await check(urls[next++]);
		results.push(result);
		console.log(`${result.outcome}${result.status ? ` (${result.status})` : ''} ${result.url}`);
	}
}));
results.sort((a, b) => a.url.localeCompare(b.url));
if (values.output) await writeFile(values.output, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n');
console.log('Reachability is not factual review. No source verification or translation dates were changed.');
// 401/403/429多半是网站拦下了自动请求（openai.com一直如此），只提醒人工用浏览器打开确认，不算失败
for (const result of results.filter((r) => r.outcome === 'unconfirmed-access')) console.log(`::warning::Open in a browser to confirm: ${result.url}`);
if (results.some((result) => result.outcome === 'http-error' || result.outcome === 'unconfirmed-network')) process.exitCode = 1;
