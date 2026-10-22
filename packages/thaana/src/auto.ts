// Side-effect entry: `import '@dvfonts/thaana/auto'` makes every [data-thaana]
// field type Thaana, including ones added later.
import { autoAttach } from './keyboard.js';

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', () => autoAttach(), { once: true });
	else autoAttach();
}
