import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: { index: 'src/index.ts' },
	format: 'esm',
	platform: 'browser',
	dts: true,
	deps: { neverBundle: ['react', 'react/jsx-runtime', '@yashau/thaana'] },
	// Hooks and components need the client in React Server Components apps.
	banner: { js: "'use client';" }
});
