import type { Page } from '@playwright/test';
import type { LocalChapterEdit } from '../../src/lib/local-edits-schema';

/** Inspect committed data through the browser's public IndexedDB API. */
export async function savedChapterEdits(page: Page): Promise<LocalChapterEdit[]> {
	return page.evaluate(() => new Promise<LocalChapterEdit[]>((resolve, reject) => {
		const request = indexedDB.open('whats-llm-chapter-edits', 1);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction('chapters', 'readonly');
			const read = transaction.objectStore('chapters').get('snapshot');
			transaction.oncomplete = () => { db.close(); resolve(read.result ?? []); };
			transaction.onabort = () => { db.close(); reject(transaction.error); };
		};
	}));
}
