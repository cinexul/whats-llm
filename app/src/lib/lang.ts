// 表示言語(中文 / 日本語)を保持するストア。localStorage に永続化する。
// SSR / window の無い環境でも壊れないようガードする。
import { writable } from 'svelte/store';
import type { Lang } from './manifest';

const KEY = 'lang';
const DEFAULT: Lang = 'zh';

function load(): Lang {
	if (typeof localStorage === 'undefined') return DEFAULT;
	const v = localStorage.getItem(KEY);
	return v === 'zh' || v === 'ja' || v === 'en' ? v : DEFAULT;
}

export const lang = writable<Lang>(load());

export function setLang(next: Lang) {
	lang.set(next);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(KEY, next);
	}
}
