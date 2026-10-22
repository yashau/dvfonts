import { error } from '@sveltejs/kit';
import { families, getFamily } from '#lib/server/catalog.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => families.map((f) => ({ id: f.id }));

export const load: PageServerLoad = ({ params }) => {
	const family = getFamily(params.id);
	if (!family) error(404, 'Font not found');
	return { family };
};
