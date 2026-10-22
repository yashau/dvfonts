// Fail the build if the drop-in bundles lost auto-attach to tree-shaking
// (it happened once: the side-effect import was dropped from both bundles).
import { readFileSync } from 'node:fs';

for (const file of ['dist/cdn/thaana.js', 'dist/thaana.iife.js']) {
	const code = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
	for (const needle of ['[data-thaana]', 'readyState', 'MutationObserver']) {
		if (!code.includes(needle)) {
			console.error(`${file} is missing ${needle}: auto-attach was tree-shaken out.`);
			process.exit(1);
		}
	}
}
console.log('drop-in bundles include auto-attach');
