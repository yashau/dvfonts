import { json } from '@sveltejs/kit';
import { apiFamilies } from '#lib/server/api.js';
import { SITE_ORIGIN } from '#lib/site.js';

export const prerender = true;

export const GET = () =>
	json({
		cssApi: `${SITE_ORIGIN}/css2?family=Name:wght@400;700&display=swap`,
		keyboard: `${SITE_ORIGIN}/thaana.js`,
		npm: {
			core: '@yashau/thaana',
			react: '@yashau/thaana-react',
			svelte: '@yashau/thaana-svelte',
			vue: '@yashau/thaana-vue'
		},
		agentGuide: `${SITE_ORIGIN}/llms.txt`,
		families: apiFamilies()
	});
