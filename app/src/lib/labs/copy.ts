// Content is data, shared by all renderers; this file only checks its locale shape.
import data from './copy.json' with { type: 'json' };
import type { Lang } from '$lib/manifest';
export const labsCopy:Record<Lang,typeof data.en>=data;
