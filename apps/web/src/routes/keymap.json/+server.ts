import { json } from '@sveltejs/kit';
import { BRACKET_SWAP, KEYMAP } from '@yashau/thaana';
import { SITE_ORIGIN } from '#lib/site.js';

export const prerender = true;

export const GET = () =>
	json({
		name: 'Divehi Phonetic (Microsoft kbddiv1 layout, as used by aharen/thaana-keyboard and most Maldivian sites)',
		description:
			"Latin key -> Thaana character. Keys not listed (digits, brackets, other punctuation) insert themselves; browsers mirror brackets in RTL text. Microsoft's layout additionally swaps bracket pairs; see bracketSwap. Apply per keystroke.",
		module: `${SITE_ORIGIN}/thaana.js`,
		npm: '@yashau/thaana',
		docs: `${SITE_ORIGIN}/docs#keyboard`,
		keymap: KEYMAP,
		bracketSwap: BRACKET_SWAP
	});
