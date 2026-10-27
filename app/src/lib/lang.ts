// 界面显示语言；存储可用时保存到本地。
// 没选过语言时，按浏览器（桌面版是系统）的语言设置决定。
import { writable } from 'svelte/store';
import type { Lang } from './manifest';

const KEY = 'lang';

function detect(): Lang {
	const preferred = typeof navigator === 'undefined' ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];
	for (const tag of preferred) {
		const code = tag.toLowerCase();
		if (code.startsWith('zh')) return 'zh';
		if (code.startsWith('ja')) return 'ja';
		if (code.startsWith('en')) return 'en';
	}
	return 'en';
}

function load(): Lang {
	try {
		const v = localStorage.getItem(KEY);
		if (v === 'zh' || v === 'ja' || v === 'en') return v;
	} catch { /* 读不到存储时按浏览器语言显示。 */ }
	return detect();
}

export const lang = writable<Lang>(load());

export function setLang(next: Lang) {
	lang.set(next);
	try { localStorage.setItem(KEY, next); } catch { /* 本次会话仍可切换语言。 */ }
}
