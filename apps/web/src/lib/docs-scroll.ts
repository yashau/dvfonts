import { DOCS } from '#lib/docs-nav.js';

/** Where a section's heading lands when it's scrolled to: under the sticky header (scroll-mt-20). */
const HEADING_TOP = 80;

/**
 * The scroll position at which each section of a docs page becomes the current one. Normally
 * that's when its heading reaches the top. The last sections on a page are too short to ever
 * get there, so they share out the final stretch of scrolling, in order, and each still has
 * a position of its own to highlight it and to scroll to. The first section is at the very top.
 */
export function sectionStops(pathname: string): { id: string; y: number }[] {
	const doc = DOCS.find((d) => d.href === pathname);
	if (!doc) return [];
	const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
	const stops = doc.sections.flatMap((s) => {
		const el = document.getElementById(s.id);
		return el ? [{ id: s.id, y: Math.max(0, el.getBoundingClientRect().top + scrollY - HEADING_TOP) }] : [];
	});
	// The first section starts at the top of the page: it's current there anyway, and going to
	// it keeps the page title in view instead of scrolling it under the header.
	if (stops[0]) stops[0].y = 0;
	const k = stops.findIndex((s) => s.y > max);
	if (k === -1) return stops;
	const n = stops.length - k;
	if (k === 0) {
		// Nothing reaches the top (a short page): spread them from the top, the first at 0.
		stops.forEach((s, i) => (s.y = n > 1 ? (max * i) / (n - 1) : 0));
	} else {
		const start = stops[k - 1].y;
		for (let i = k; i < stops.length; i++) stops[i].y = start + ((max - start) * (i - k + 1)) / n;
	}
	return stops;
}

/** The section that's current at the present scroll position. */
export function currentSection(pathname: string): string {
	const stops = sectionStops(pathname);
	let id = stops[0]?.id ?? '';
	for (const s of stops) if (s.y <= scrollY + 16) id = s.id;
	return id;
}

/** Scroll to a section's position; false if it isn't on this page. */
export function scrollToSection(pathname: string, id: string): boolean {
	const stop = sectionStops(pathname).find((s) => s.id === id);
	if (!stop) return false;
	scrollTo({ top: stop.y, behavior: 'instant' });
	return true;
}
