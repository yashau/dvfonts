import { json } from '@sveltejs/kit';
import { THAANA_ONLY_RANGE } from '@yashau/thaana';
import { apiFamilies, DATA_VERSION } from '#lib/server/api.js';
import { SITE_ORIGIN } from '#lib/site.js';

export const prerender = true;

export const GET = () =>
	json({
		/** Changes whenever any font file may have; the files' URLs carry it as ?v=. */
		version: DATA_VERSION,
		cssApi: `${SITE_ORIGIN}/css2?family=Name:wght@400;700&display=swap`,
		cssApiNormalize:
			"Add &normalize=1 to scale each family (size-adjust) so its Thaana letters look as big as Faruma's.",
		cssApiThaanaOnly: `Add &subset=thaana to limit every @font-face to Thaana (unicode-range: ${THAANA_ONLY_RANGE}), so Latin letters, digits, punctuation and spaces fall through to the next font in your stack.`,
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
