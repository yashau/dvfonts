import { defineConfig } from 'tsdown';

export default defineConfig([
	{
		// npm / bundlers: tree-shakeable ESM with types.
		entry: { index: 'src/index.ts', auto: 'src/auto.ts' },
		format: 'esm',
		platform: 'browser',
		dts: true,
		clean: false
	},
	{
		// <script type="module" src=".../thaana.js">: one self-contained file for CDNs.
		entry: { thaana: 'src/cdn.ts' },
		format: 'esm',
		platform: 'browser',
		minify: true,
		dts: false,
		clean: false,
		outDir: 'dist/cdn'
	},
	{
		// <script src=".../thaana.iife.js">: window.Thaana + auto-attach to [data-thaana].
		format: 'iife',
		globalName: 'Thaana',
		platform: 'browser',
		minify: true,
		dts: false,
		clean: false,
		entry: { thaana: 'src/iife.ts' }
	}
]);
