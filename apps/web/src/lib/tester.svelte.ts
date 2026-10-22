// Shared type-tester state: the text, size and keyboard mode follow you from
// the catalogue to a family page, like Google Fonts.

import { browser } from '$app/env';
import { randomPangram } from '#lib/thaana.js';

const KEY = 'dvfonts:tester';

class Tester {
	/** What the user typed; empty means "show the pangram". */
	text = $state('');
	size = $state(36);
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
		try {
			const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
			if (typeof saved.size === 'number') this.size = saved.size;
			if (typeof saved.dv === 'boolean') this.dv = saved.dv;
		} catch {
			// storage unavailable: defaults are fine
		}
	}

	persist() {
		if (!browser) return;
		try {
			localStorage.setItem(KEY, JSON.stringify({ size: this.size, dv: this.dv }));
		} catch {
			// ignore
		}
	}
}

export const tester = new Tester();
