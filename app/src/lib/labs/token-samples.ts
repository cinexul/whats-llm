// Single source for lab presets and checked book examples. Keep all original sentences.
import samples from './token-samples.json' with { type: 'json' };
import type { Lang } from '../manifest';
export type TokenPreset = keyof typeof samples;
export const TOKEN_SAMPLES: Record<TokenPreset, Record<Lang, string>> = samples;
export const APPENDIX_PRESETS = ['everyday', 'api', 'meeting', 'python', 'paragraph'] as const;
