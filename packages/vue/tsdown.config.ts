import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: { index: 'src/index.ts' },
	format: 'esm',
	platform: 'browser',
	dts: true,
	deps: { neverBundle: ['vue', '@yashau/thaana'] }
});
