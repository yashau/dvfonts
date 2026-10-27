/** Public origin. Embed snippets, canonical links and the JSON APIs always use it,
 *  whichever host serves the page. */
export const SITE_ORIGIN = 'https://fonts.mv';

/** The open-source repository behind the site, fonts pipeline and packages. */
export const REPO_URL = 'https://github.com/yashau/fonts.mv';

/** Where credits, corrections and missing details go. */
export const CONTACT_EMAIL = 'contact@fonts.mv';

/** Google-Fonts-style CSS API URL: /css2?family=Name:wght@400;700&display=swap */
export function cssApiUrl(
	base: string,
	families: { name: string; weights: number[] }[],
	{ normalize = false }: { normalize?: boolean } = {}
): string {
	const params = families
		.map(
			(f) =>
				`family=${encodeURIComponent(f.name).replace(/%20/g, '+')}:wght@${f.weights.toSorted((a, b) => a - b).join(';')}`
		)
		.join('&');
	return `${base}/css2?${params}&display=swap${normalize ? '&normalize=1' : ''}`;
}
