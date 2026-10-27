import { families } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	// The whole catalogue, hidden families included (they're still served and downloadable).
	total: { families: families.length, styles: families.reduce((n, f) => n + f.styles.length, 0) },
	// Only what the cards and filters need; the full record lives on family pages. Hidden
	// families (Bismi, A_Nishan) come too, for search; the list leaves them out otherwise.
	families: families.map((f) => ({
		...f,
		licenseText: null,
		description: null,
		// Symbol fonts preview their own keys.
		chars: f.category === 'symbols' ? f.chars : '',
		keyGlyphs: '',
		styles: f.styles.map((s) => ({ ...s, upstream: null }))
	}))
});
