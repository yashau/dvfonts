import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';

// Changes whenever the font pipeline's output does. The Worker adds it to its
// edge-cache keys, so a rebuilt zip or font isn't served stale from the old
// entry under the same URL (src/lib/server/r2.ts).
const dataDir = new URL('src/lib/data/', import.meta.url);
const dataHash = createHash('sha256');
for (const f of readdirSync(dataDir).sort()) dataHash.update(f).update(readFileSync(new URL(f, dataDir)));

export default defineConfig({
	// The beta deploy (.github/workflows/beta.yml) builds with FONTS_MV_BETA=1.
	define: {
		__FONTS_MV_BETA__: JSON.stringify(process.env.FONTS_MV_BETA === '1'),
		__FONTS_MV_DATA__: JSON.stringify(dataHash.digest('hex').slice(0, 16))
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			adapter: adapter()
		})
	]
});
