// Shared type-tester state: the text, size and keyboard mode follow you from
// the catalogue to a family page, like Google Fonts.

import { browser } from '$app/env';
import { randomPangram } from '#lib/thaana.js';

// v2: the size is only stored once someone moves the slider (v1 stored the
// default too, which pinned phones to the desktop size).
const KEY = 'dvfonts:tester:v2';

/** Default preview sizes. At 20px on a phone every font shows a whole pangram
 *  within the six lines a row allows there (measured at 360 and 390px wide). */
export const DEFAULT_SIZE = 36;
export const DEFAULT_SIZE_PHONE = 20;
const PHONE = '(max-width: 639px)';

class Tester {
	/** What the user typed; empty means "show the pangram". */
	text = $state('');
	size = $state(DEFAULT_SIZE);
	/** Set once the user moves the size slider; until then the size follows the screen. */
	sizeChosen = false;
	/** Saved settings have been read; persisting earlier would overwrite them. */
	private ready = false;
	/** Latin keystrokes → Thaana (Divehi Phonetic layout). */
	dv = $state(true);
	/** Chosen per page load, client-side, so prerendered HTML stays stable. */
	pangram = $state('');

	get preview(): string {
		return this.text || this.pangram;
	}

	init() {
		if (!browser) return;
		this.pangram = randomPangram();
		if (matchMedia(PHONE).matches) this.size = DEFAULT_SIZE_PHONE;
		try {
			const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
			if (typeof saved.size === 'number') {
				this.size = saved.size;
				this.sizeChosen = true;
			}
			if (typeof saved.dv === 'boolean') this.dv = saved.dv;
		} catch {
			// storage unavailable: defaults are fine
		}
		this.ready = true;
	}

	persist() {
		if (!browser || !this.ready) return;
		try {
			localStorage.setItem(KEY, JSON.stringify(this.sizeChosen ? { size: this.size, dv: this.dv } : { dv: this.dv }));
		} catch {
			// ignore
		}
	}
}

export const tester = new Tester();
