import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Test against the core's source, so tests don't depend on its dist/ being built.
	resolve: { alias: { '@yashau/thaana': fileURLToPath(new URL('../thaana/src/index.ts', import.meta.url)) } }
});
