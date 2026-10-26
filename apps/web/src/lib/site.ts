import { browser } from '$app/env';

/** Canonical public origin, used in embed snippets on prerendered pages.
 *  In the browser the actual origin wins, so preview deployments show working URLs. */
export const SITE_ORIGIN = 'https://fonts.mv';

/** The open-source repository behind the site, fonts pipeline and packages. */
export const REPO_URL = 'https://github.com/yashau/dvfonts';

export function origin(): string {
	return browser ? location.origin : SITE_ORIGIN;
}

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
