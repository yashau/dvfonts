import { families } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	// Only what the cards and filters need; the full record lives on family pages.
	families: families
		.filter((f) => !f.hidden)
		.map((f) => ({
			...f,
			licenseText: null,
			description: null,
			styles: f.styles.map((s) => ({ ...s, upstream: null }))
		}))
});
