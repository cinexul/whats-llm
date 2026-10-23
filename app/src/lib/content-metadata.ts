import data from './content-metadata.json';
import type { Lang } from './manifest';
import type { ContentMetadata } from './content-metadata-rules';

export * from './content-metadata-rules';
export const contentMetadata = data as ContentMetadata;

export function chapterMetadata(slug: string, lang: Lang) {
	const chapter = contentMetadata.chapters[slug];
	const edition = chapter?.editions[lang];
	return chapter && edition ? { chapter, edition } : null;
}
