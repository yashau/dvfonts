import { useEffect, useState } from 'react';
import { loadFonts, type FontRequest, type FontCssOptions } from '@yashau/thaana';

/** CSS options, plus `files` (your own copies, by weight) and `sizeAdjust` to skip fonts.mv's hosting. */
export type DhivehiFontOptions = FontCssOptions & Pick<FontRequest, 'files' | 'sizeAdjust'>;

/**
 * Load a Dhivehi font from fonts.mv, or from your own files, and report when it's ready.
 *
 *   const ready = useDhivehiFont('Faruma');
 *   const ready = useDhivehiFont('Faruma', undefined, { files: { 400: '/fonts/faruma-400.woff2' } });
 *   <p lang="dv" dir="rtl" style={{ fontFamily: "'Faruma', system-ui" }}>…</p>
 */
export function useDhivehiFont(family: string, weights?: number[], options?: DhivehiFontOptions): boolean {
	const [ready, setReady] = useState(false);
	const key = JSON.stringify([family, weights, options]);
	useEffect(() => {
		let live = true;
		setReady(false);
		const { files, sizeAdjust, ...css } = options ?? {};
		const req: FontRequest = { family, weights, files, sizeAdjust };
		loadFonts(req, css).then(
			() => live && setReady(true),
			() => live && setReady(false)
		);
		return () => {
			live = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);
	return ready;
}
