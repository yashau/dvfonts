import { error } from '@sveltejs/kit';
import { authors } from '#lib/catalog.js';
import { authorBySlug, FEATURED_AUTHORS } from '#lib/authors.js';
import { families } from '#lib/server/catalog.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => FEATURED_AUTHORS.map((a) => ({ slug: a.slug }));

export const load: PageServerLoad = ({ params }) => {
	const bio = authorBySlug(params.slug);
	if (!bio?.page) error(404, 'No such author');
	return {
		bio,
		families: families
			.filter((f) => !f.hidden && authors(f).includes(bio.name))
			.map((f) => ({ id: f.id, name: f.name, category: f.category, styles: f.styles.length, designer: f.designer }))
			.toSorted((a, b) => a.name.localeCompare(b.name))
	};
};
