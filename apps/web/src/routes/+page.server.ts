import { families } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	// The whole catalogue, hidden families included (they're still served and downloadable).
	total: { families: families.length, styles: families.reduce((n, f) => n + f.styles.length, 0) },
	// Only what the cards and filters need; the full record lives on family pages.
	families: families
		.filter((f) => !f.hidden)
		.map((f) => ({
			...f,
			licenseText: null,
			description: null,
			chars: '',
			keyGlyphs: '',
			styles: f.styles.map((s) => ({ ...s, upstream: null }))
		}))
});
