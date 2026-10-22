import { useEffect, useState } from 'react';
import { loadFonts, type FontRequest } from '@yashau/thaana';

/**
 * Load a Dhivehi font from dvfonts and report when it's ready.
 *
 *   const ready = useDhivehiFont('Faruma');
 *   <p lang="dv" dir="rtl" style={{ fontFamily: "'Faruma', system-ui" }}>…</p>
 */
export function useDhivehiFont(family: string, weights?: number[], options?: { origin?: string }): boolean {
	const [ready, setReady] = useState(false);
	const key = `${family}|${weights?.join(';') ?? ''}|${options?.origin ?? ''}`;
	useEffect(() => {
		let live = true;
		setReady(false);
		const req: FontRequest = { family, weights };
		loadFonts(req, options).then(
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
