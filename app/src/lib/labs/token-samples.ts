// 分词实验的例句：同一个意思的中文、日文、英文版本。
import type { Lang } from '../manifest';

export type TokenPreset = 'everyday' | 'technical' | 'numbers' | 'code';
export const TOKEN_SAMPLES: Record<TokenPreset, Record<Lang, string>> = {
	everyday: {
		zh: '请帮我写一封邮件，告诉同事明天的会议改到下午三点。',
		ja: '明日の会議が午後3時に変更になったことを、同僚に伝えるメールを書いてください。',
		en: "Please write an email telling my colleagues that tomorrow's meeting has moved to 3 p.m."
	},
	technical: {
		zh: '大语言模型使用Transformer架构，一次预测一个token。',
		ja: '大規模言語モデルはTransformerアーキテクチャを使い、一度に1トークンずつ予測します。',
		en: 'Large language models use the Transformer architecture and predict one token at a time.'
	},
	numbers: {
		zh: '2026年10月28日，订单号A-10293，金额3,450.75美元。',
		ja: '2026年10月28日、注文番号A-10293、金額3,450.75ドル。',
		en: 'On October 28, 2026, order A-10293 came to $3,450.75.'
	},
	code: {
		zh: 'for (let i = 0; i < 10; i++) console.log(i); // 打印0到9',
		ja: 'for (let i = 0; i < 10; i++) console.log(i); // 0から9を表示',
		en: 'for (let i = 0; i < 10; i++) console.log(i); // print 0 to 9'
	}
};
