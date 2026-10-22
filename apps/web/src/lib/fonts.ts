// Client-side font loading for previews. Each family/weight is registered once
// as a FontFace per unicode-range subset, so a Thaana-only preview fetches just
// the small Thaana file and Latin text pulls in the Latin subset on demand.

import { browser } from '$app/env';
import { SUBSET_RANGES, fontUrl, type Family, type Style } from '#lib/catalog.js';

const registered = new Set<string>();

/** CSS family name used for previews (scoped so it never collides with an
 *  installed copy of the same font). */
export function previewFamily(f: Family): string {
	return `dv-${f.id}`;
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
	const faces = subsets.length
		? subsets.map(
				(name) =>
					new FontFace(previewFamily(f), `url(${fontUrl(f, s.weight, `${name}.woff2`)}) format('woff2')`, {
						...base,
						unicodeRange: SUBSET_RANGES[name]
					})
			)
		: [new FontFace(previewFamily(f), `url(${fontUrl(f, s.weight, 'woff2')}) format('woff2')`, base)];
	for (const face of faces) document.fonts.add(face);
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
