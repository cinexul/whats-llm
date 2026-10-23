// 界面显示语言；存储可用时保存到本地。
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
	try { localStorage.setItem(KEY, next); } catch { /* 本次会话仍可切换语言。 */ }
}
