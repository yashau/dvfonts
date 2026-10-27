import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
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

// Hard-coded /fonts/… URLs (the UI font in layout.css) must name a file the
// pipeline still produces: MV Faseyha going unmodified once removed its
// Thaana subset and every page 404'd. Fail the build instead.
const catalog: {
	families: { id: string; styles: { weight: number; sizes: object; subsets: object }[] }[];
} = JSON.parse(readFileSync(new URL('catalog.json', dataDir), 'utf8'));
const fontFiles = new Set<string>();
for (const { id, styles } of catalog.families) {
	fontFiles.add(`/fonts/${id}/${id}.zip`);
	for (const { weight, sizes, subsets } of styles) {
		for (const ext of Object.keys(sizes)) fontFiles.add(`/fonts/${id}/${id}-${weight}.${ext}`);
		for (const sub of Object.keys(subsets)) fontFiles.add(`/fonts/${id}/${id}-${weight}.${sub}.woff2`);
	}
}
const srcDir = new URL('src/', import.meta.url);
const fontProblems: string[] = [];
for (const rel of readdirSync(srcDir, { recursive: true }) as string[]) {
	if (!/\.(css|svelte|ts|js)$/.test(rel) || !statSync(new URL(rel, srcDir)).isFile()) continue;
	const text = readFileSync(new URL(rel, srcDir), 'utf8');
	for (const [url] of text.matchAll(/\/fonts\/[a-z0-9-]+\/[a-z0-9.-]+\.(?:woff2|woff|ttf|otf|zip)\b/g)) {
		if (!fontFiles.has(url)) fontProblems.push(`src/${rel}: ${url}`);
	}
}
if (fontProblems.length) throw new Error(`Missing font files:\n${fontProblems.join('\n')}`);

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
