import { redirect } from '@sveltejs/kit';

// The guide moved into the docs area.
export const prerender = true;
export const load = () => redirect(308, '/docs/thaana');
