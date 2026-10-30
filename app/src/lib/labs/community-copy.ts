import type { Lang } from '$lib/manifest';
const en = {
 title: 'Claude / Anthropic (community reconstruction)',
 model: 'ctok · Claude Opus 4.8 counting rules',
 warning: 'Community estimate, not an official Anthropic tokenizer or billing result.',
 content: 'Text estimate (excluding +6)', message: 'Single user-message estimate',
 policy: 'ctok’s reconstructed rules include text-boundary conventions. The first row subtracts its fixed 6-token message overhead; the second includes it. These are not guaranteed raw-token counts comparable to the official tokenizers above. No token IDs or boundaries are displayed.',
 scope: 'Text only, for the pinned community Opus 4.8 rules—not every Claude model; Opus 5 and 5.5 differences are not modeled. No system prompt, tools, images or chat history. Use Anthropic’s official count endpoint for an actual request.',
 source: 'Community source: sanderland/ctok', loading: 'Loading the offline community counter…', failed: 'Community counter unavailable; official results are unaffected.', unavailable: 'Unavailable',
};
export const communityCopy: Record<Lang, typeof en> = {
 en,
 zh: {
  title:'Claude / Anthropic（社区重建）',model:'ctok · Claude Opus 4.8计数规则',
  warning:'社区估算，不是Anthropic官方分词器或账单用量。',
  content:'文本估算（不含+6）',message:'单条用户消息估算',
  policy:'ctok的重建规则含文本边界约定。第一行减去了固定6 token的消息开销，第二行包含该开销；不能保证等同于上方官方分词器的裸文本计数。不展示token ID或切分边界。',
  scope:'仅适用于固定社区版本的Opus 4.8文本规则，不代表所有Claude模型，未实现Opus 5和5.5的差异。不含系统提示、工具、图片或聊天历史；实际请求请用Anthropic官方计数接口核对。',
  source:'社区来源：sanderland/ctok',loading:'正在加载离线社区计数器…',failed:'社区计数器不可用，不影响上方官方结果。',unavailable:'不可用',
 },
 ja: {
  title:'Claude / Anthropic（コミュニティによる再構築）',model:'ctok · Claude Opus 4.8の計数規則',
  warning:'コミュニティによる推定値です。Anthropic公式のトークナイザや課金使用量ではありません。',
  content:'テキスト推定（+6を除く）',message:'ユーザーメッセージ1件の推定',
  policy:'ctokの再構築規則にはテキスト境界の扱いが含まれます。1行目は固定6トークンのメッセージ分を除き、2行目は含みます。上の公式トークナイザの生テキスト計数と同じとは保証しません。トークンIDや区切りは表示しません。',
  scope:'固定したコミュニティ版のOpus 4.8テキスト規則のみで、すべてのClaudeモデルを表しません。Opus 5と5.5の差分は未対応です。システムプロンプト、ツール、画像、会話履歴は含みません。実際のリクエストはAnthropic公式の計数APIで確認してください。',
  source:'コミュニティの出典：sanderland/ctok',loading:'オフラインのコミュニティ計数器を読み込み中…',failed:'コミュニティ計数器を利用できません。上の公式結果には影響しません。',unavailable:'利用不可',
 },
};
