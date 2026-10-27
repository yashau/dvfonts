/**
 * Load Dhivehi fonts from fonts.mv (Google-Fonts-compatible CSS API), or from
 * your own copies of the files (`files`), in which case nothing is fetched from fonts.mv.
 */

export const DVFONTS_ORIGIN = 'https://fonts.mv';

export interface FontRequest {
	/** Family name, e.g. "Faruma" or "MV Faseyha" (old names like "A_Waheed" work too). */
	family: string;
	/** Weights to load. Default: the family's default weight, or every weight in `files`. */
	weights?: number[];
	/**
	 * Your own copies of the font files, by weight: `{ 400: '/fonts/faruma-400.woff2' }`.
	 * With these the family is registered from your URLs and nothing is loaded from fonts.mv.
	 * Download the files from the family's page or fonts.json (WOFF2 recommended).
	 */
	files?: Record<number, string>;
	/** The family's `sizeAdjust` from fonts.json, so `normalize` works with your own files. */
	sizeAdjust?: number;
}

export interface FontCssOptions {
	/** CSS font-display. Default: 'swap'. */
	display?: string;
	/** Where fonts.mv lives. Default: https://fonts.mv */
	origin?: string;
	/** Scale each family (CSS size-adjust) so its Thaana letters are as tall as
	 *  Faruma's at the same font-size. The font files are unchanged. Default: false. */
	normalize?: boolean;
}

/** URL of the CSS for one or more families. */
export function fontCssUrl(
	fonts: FontRequest | FontRequest[],
	{ display = 'swap', origin = DVFONTS_ORIGIN, normalize = false }: FontCssOptions = {}
): string {
	const list = Array.isArray(fonts) ? fonts : [fonts];
	const params = list
		.map(({ family, weights }) => {
			const name = encodeURIComponent(family).replace(/%20/g, '+');
			return `family=${name}${weights?.length ? `:wght@${weights.toSorted((a, b) => a - b).join(';')}` : ''}`;
		})
		.join('&');
	return `${origin}/css2?${params}&display=${display}${normalize ? '&normalize=1' : ''}`;
}

const FORMATS: Record<string, string> = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' };

function selfHosted(req: FontRequest): [number, string][] {
	const files = req.files ?? {};
	const weights = req.weights?.length ? req.weights : Object.keys(files).map(Number);
	return weights.map((w) => {
		const url = files[w];
		if (!url) throw new Error(`No file given for ${req.family} weight ${w}`);
		return [w, url];
	});
}

function source(url: string): string {
	const ext = /\.(\w+)(?:[?#].*)?$/.exec(url)?.[1]?.toLowerCase() ?? '';
	return `url(${JSON.stringify(url)})${FORMATS[ext] ? ` format('${FORMATS[ext]}')` : ''}`;
}

/**
 * @font-face CSS for your own copies of the files (requests with `files`), to put in a
 * stylesheet instead of loading anything from fonts.mv.
 *
 *   fontFaceCss({ family: 'Faruma', files: { 400: '/fonts/faruma-400.woff2' } })
 */
export function fontFaceCss(
	fonts: FontRequest | FontRequest[],
	{ display = 'swap', normalize = false }: Omit<FontCssOptions, 'origin'> = {}
): string {
	const list = Array.isArray(fonts) ? fonts : [fonts];
	return list
		.flatMap((req) =>
			selfHosted(req).map(([w, url]) =>
				[
					'@font-face {',
					`  font-family: ${JSON.stringify(req.family)};`,
					'  font-style: normal;',
					`  font-weight: ${w};`,
					`  font-display: ${display};`,
					`  src: ${source(url)};`,
					...(normalize && req.sizeAdjust ? [`  size-adjust: ${Math.round(req.sizeAdjust * 1000) / 10}%;`] : []),
					'}'
				].join('\n')
			)
		)
		.join('\n\n');
}

const faces = new Map<string, FontFace>();

function addFace(req: FontRequest, weight: number, url: string, display: string, normalize: boolean): Promise<unknown> {
	const sizeAdjust = normalize && req.sizeAdjust ? `${Math.round(req.sizeAdjust * 1000) / 10}%` : undefined;
	const key = [req.family, weight, url, display, sizeAdjust].join('|');
	let face = faces.get(key);
	if (!face) {
		face = new FontFace(req.family, source(url), {
			weight: String(weight),
			display: display as FontDisplay,
			...(sizeAdjust ? { sizeAdjust } : {})
		} as FontFaceDescriptors);
		faces.set(key, face);
		document.fonts.add(face);
	}
	return face.load();
}

/**
 * Load the given families and resolve when they're ready to draw with. Families with
 * `files` are registered from your URLs; the others come from the fonts.mv stylesheet,
 * added to <head> once per URL. Use the family name in CSS afterwards:
 * font-family: 'Faruma', system-ui, sans-serif.
 */
export function loadFonts(fonts: FontRequest | FontRequest[], options: FontCssOptions = {}): Promise<void> {
	const list = Array.isArray(fonts) ? fonts : [fonts];
	const own = list.filter((f) => f.files);
	const hosted = list.filter((f) => !f.files);
	const { display = 'swap', normalize = false } = options;
	let selfLoaded: Promise<unknown>;
	try {
		selfLoaded = Promise.all(
			own.flatMap((req) => selfHosted(req).map(([w, url]) => addFace(req, w, url, display, normalize)))
		);
	} catch (e) {
		return Promise.reject(e);
	}
	if (!hosted.length) return selfLoaded.then(() => undefined);
	return Promise.all([selfLoaded, loadHosted(hosted, options)]).then(() => undefined);
}

function loadHosted(list: FontRequest[], options: FontCssOptions): Promise<void> {
	const href = fontCssUrl(list, options);
	let link = document.querySelector<HTMLLinkElement>(`link[data-dvfonts][href="${CSS.escape(href)}"]`);
	if (!link) {
		link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;
		link.dataset.dvfonts = '';
		document.head.append(link);
	}
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
