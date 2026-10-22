import { json } from '@sveltejs/kit';
import { KEYMAP } from '@yashau/thaana';
import { SITE_ORIGIN } from '#lib/site.js';

export const prerender = true;

export const GET = () =>
	json({
		name: 'Divehi Phonetic (Microsoft kbddiv1 layout, as used by aharen/thaana-keyboard and most Maldivian sites)',
		description:
			"Latin key -> Thaana character. Keys not listed (digits, other punctuation) insert themselves. Bracket pairs are swapped as in Microsoft's layout: browsers mirror brackets in RTL text, so the key that looks right on screen stores the logically correct bracket. Apply per keystroke.",
		module: `${SITE_ORIGIN}/thaana.js`,
		npm: '@yashau/thaana',
		docs: `${SITE_ORIGIN}/docs#keyboard`,
		keymap: KEYMAP
	});
