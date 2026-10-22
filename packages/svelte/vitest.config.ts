import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
		// Test against the core's source, so tests don't depend on its dist/ being built.
		alias: { '@yashau/thaana': fileURLToPath(new URL('../thaana/src/index.ts', import.meta.url)) }
	},
	test: { environment: 'jsdom' }
});
