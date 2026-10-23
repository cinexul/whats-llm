<script lang="ts">
	let { name, size = 22 }: { name: 'home' | 'book' | 'review' | 'progress' | 'search' | 'close' | 'arrow' | 'chevron'; size?: number } = $props();
	const paths = {
		home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
		book: 'M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z',
		review: 'M3 11a9 9 0 1 1 2.5 7M3 4v7h7M12 7v5l3 2',
		progress: 'M4 20V10m8 10V4m8 16v-7',
		search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
		close: 'm6 6 12 12M6 18 18 6',
		arrow: 'M4 12h16m-6-6 6 6-6 6',
		chevron: 'm9 5 7 7-7 7'
	};
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>
