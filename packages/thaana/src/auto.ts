// Side-effect entry: `import '@yashau/thaana/auto'` makes every [data-thaana]
// field type Thaana, including ones added later.
import { autoAttach } from './keyboard.js';

/** Attach to [data-thaana] fields once the DOM is ready. Called explicitly by
 *  the CDN/IIFE builds so a bundler can't tree-shake it away. */
let started = false;

export function startAutoAttach(): void {
	if (started || typeof document === 'undefined') return;
	started = true;
	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', () => autoAttach(), { once: true });
	else autoAttach();
}

startAutoAttach();
