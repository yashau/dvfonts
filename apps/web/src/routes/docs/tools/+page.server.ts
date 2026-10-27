import { getFamily } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

// The output preview renders in Faruma.
export const load: PageServerLoad = () => ({
	faruma: getFamily('faruma')!
});
