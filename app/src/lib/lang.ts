// Display language, persisted locally when storage is available.
// SSR / window の無い環境でも壊れないようガードする。
import { writable } from 'svelte/store';
import type { Lang } from './manifest';

const KEY = 'lang';
const DEFAULT: Lang = 'zh';

function load(): Lang {
	try {
		const v = localStorage.getItem(KEY);
		return v === 'zh' || v === 'ja' || v === 'en' ? v : DEFAULT;
	} catch { return DEFAULT; }
}

export const lang = writable<Lang>(load());

export function setLang(next: Lang) {
	lang.set(next);
	try { localStorage.setItem(KEY, next); } catch { /* Keep language switching available for this session. */ }
}
