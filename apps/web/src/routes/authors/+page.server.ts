import { authors } from '#lib/catalog.js';
import { families } from '#lib/server/catalog.js';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => {
	const count = new Map<string, number>();
	for (const f of families.filter((f) => !f.hidden)) for (const a of authors(f)) count.set(a, (count.get(a) ?? 0) + 1);
	return {
		authors: [...count].map(([name, families]) => ({ name, families })).toSorted((a, b) => a.name.localeCompare(b.name))
	};
};
