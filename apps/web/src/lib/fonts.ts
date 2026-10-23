// Client-side font loading for previews. Each family/weight is registered once
// as a FontFace per unicode-range subset, so a Thaana-only preview fetches just
// the small Thaana file and Latin text pulls in the Latin subset on demand.

import { browser } from '$app/env';
import { SUBSET_RANGES, fontUrl, type Family, type Style } from '#lib/catalog.js';

const registered = new Set<string>();

/** CSS family name used for previews (scoped so it never collides with an
 *  installed copy of the same font). `normalized` picks the copy registered
 *  with size-adjust, whose Thaana letters look as big as Faruma's. */
export function previewFamily(f: Family, normalized = false): string {
	return normalized ? `dv-${f.id}-n` : `dv-${f.id}`;
}

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

function overrideDescriptors(s: Style): FontFaceDescriptors {
	const o = s.cssOverrides;
	if (!o) return {};
	return { ascentOverride: pct(o.ascent), descentOverride: pct(-o.descent), lineGapOverride: pct(o.lineGap) };
}

export function registerStyle(f: Family, s: Style): void {
	const key = `${f.id}:${s.weight}`;
	if (!browser || registered.has(key)) return;
	registered.add(key);
	const base = { weight: String(s.weight), display: 'swap' as FontDisplay, ...overrideDescriptors(s) };
	const subsets = Object.keys(s.subsets) as ('thaana' | 'latin')[];
	// Two registrations of the same files: as published, and size-adjusted.
	// The browser downloads each file once, and only when a preview uses it.
	// sizeAdjust is in every current browser but not yet in TypeScript's DOM types.
	const variants: [string, FontFaceDescriptors & { sizeAdjust?: string }][] = [[previewFamily(f), base]];
	if (s.sizeAdjust) variants.push([previewFamily(f, true), { ...base, sizeAdjust: pct(s.sizeAdjust) }]);
	for (const [family, descriptors] of variants) {
		const faces = subsets.length
			? subsets.map(
					(name) =>
						new FontFace(family, `url(${fontUrl(f, s.weight, `${name}.woff2`)}) format('woff2')`, {
							...descriptors,
							unicodeRange: SUBSET_RANGES[name]
						})
				)
			: [new FontFace(family, `url(${fontUrl(f, s.weight, 'woff2')}) format('woff2')`, descriptors)];
		for (const face of faces) document.fonts.add(face);
	}
}

export function registerFamily(f: Family): void {
	for (const s of f.styles) registerStyle(f, s);
}

/** Svelte action: register a family's fonts once the element nears the viewport. */
export function lazyFont(el: HTMLElement, f: Family) {
	let family = f;
	if (!browser) return;
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				registerFamily(family);
				io.disconnect();
			}
		},
		{ rootMargin: '600px 0px' }
	);
	io.observe(el);
	return {
		update(next: Family) {
			family = next;
		},
		destroy() {
			io.disconnect();
		}
	};
}
