import { redirect } from '@sveltejs/kit';

// The converter moved into the docs area's tools page.
export const prerender = true;
export const load = () => redirect(308, '/docs/tools');
