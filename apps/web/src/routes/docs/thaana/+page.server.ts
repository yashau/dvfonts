import { getFamily } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

// Fonts the demos render with: Faruma, and MV Iyyu (no Latin letters) for the fallback demo.
export const load: PageServerLoad = () => ({
	faruma: getFamily('faruma')!,
	iyyu: getFamily('mv-iyyu')!
});
