/** Load Dhivehi fonts from dvfonts (Google-Fonts-compatible CSS API). */

export const DVFONTS_ORIGIN = 'https://dvfonts.yashau.com';

export interface FontRequest {
	/** Family name, e.g. "Faruma" or "MV Faseyha" (old names like "A_Waheed" work too). */
	family: string;
	/** Weights to load. Default: the family's default weight. */
	weights?: number[];
}

/** URL of the CSS for one or more families. */
export function fontCssUrl(
	fonts: FontRequest | FontRequest[],
	{ display = 'swap', origin = DVFONTS_ORIGIN }: { display?: string; origin?: string } = {}
): string {
	const list = Array.isArray(fonts) ? fonts : [fonts];
	const params = list
		.map(({ family, weights }) => {
			const name = encodeURIComponent(family).replace(/%20/g, '+');
			return `family=${name}${weights?.length ? `:wght@${weights.toSorted((a, b) => a - b).join(';')}` : ''}`;
		})
		.join('&');
	return `${origin}/css2?${params}&display=${display}`;
}

/**
 * Add the stylesheet for the given families to <head> (once per URL) and
 * resolve when the fonts are ready to draw with. Use the family name in CSS
 * afterwards: font-family: 'Faruma', system-ui, sans-serif.
 */
export function loadFonts(
	fonts: FontRequest | FontRequest[],
	options?: { display?: string; origin?: string }
): Promise<void> {
	const href = fontCssUrl(fonts, options);
	let link = document.querySelector<HTMLLinkElement>(`link[data-dvfonts][href="${CSS.escape(href)}"]`);
	if (!link) {
		link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;
		link.dataset.dvfonts = '';
		document.head.append(link);
	}
	const list = Array.isArray(fonts) ? fonts : [fonts];
	const ready = new Promise<void>((resolve, reject) => {
		if (link.sheet) return resolve();
		link.addEventListener('load', () => resolve(), { once: true });
		link.addEventListener('error', () => reject(new Error(`Could not load ${href}`)), { once: true });
	});
	// Fonts download lazily; ask for the Thaana subset of each weight explicitly
	// so canvas/SVG drawing can rely on them.
	return ready.then(() =>
		Promise.all(
			list.flatMap(({ family, weights = [400] }) =>
				weights.map((w) => document.fonts.load(`${w} 16px "${family}"`, 'ދ'))
			)
		).then(() => undefined)
	);
}
