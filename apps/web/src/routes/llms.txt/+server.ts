import { CATEGORIES } from '#lib/catalog.js';
import { apiFamilies } from '#lib/server/api.js';
import { SITE_ORIGIN as O } from '#lib/site.js';
import { PANGRAMS } from '#lib/thaana.js';

export const prerender = true;

export const GET = () => {
	const fams = apiFamilies();
	const index = CATEGORIES.map((c) => {
		const rows = fams
			.filter((f) => f.category === c.id)
			.map(
				(f) =>
					`- ${f.name} — weights ${f.weights.join(', ')}${f.hasLatin ? '' : ', no Latin glyphs'}; license ${f.license}${f.aliases.length ? `; also known as ${f.aliases.join(', ')}` : ''}. CSS: ${f.css}`
			);
		return `### ${c.label}\n\n${rows.join('\n')}`;
	}).join('\n\n');

	const body = `# dvfonts

> Free Dhivehi (Thaana script, language code "dv") fonts for the web, with a Google-Fonts-compatible CSS API and a drop-in Thaana phonetic keyboard. ${fams.length} families. Everything below is copy-paste ready; all URLs are absolute.

Machine-readable index of every family (names, weights, CSS URL, file URLs, license): ${O}/fonts.json
Keyboard keymap as JSON: ${O}/keymap.json

## 1. Use a Dhivehi font on a web page

Add the stylesheet, then use the family name in CSS. Pick weights that exist for the family (see fonts.json).

\`\`\`html
<link rel="stylesheet" href="${O}/css2?family=Faruma&display=swap">
<style>
  .dv { font-family: 'Faruma', sans-serif; }
</style>
<p class="dv" dir="rtl" lang="dv">ދިވެހިރާއްޖެ</p>
\`\`\`

Several families and weights in one request: \`${O}/css2?family=Bolhu:wght@400;700&family=MV+Faseyha:wght@400;700&display=swap\`

- Family names in the URL: spaces as "+", case-insensitive; aliases also work (e.g. "A_Waheed").
- Omit \`:wght@...\` to get the family's default (Regular) weight.
- An unknown family or weight returns HTTP 400 with a message listing what is available.
- The CSS uses unicode-range subsets: a Thaana-only page downloads only the small Thaana file.
- Many Dhivehi fonts have no Latin glyphs. Put a Latin fallback after the family: \`font-family: 'Faruma', system-ui, sans-serif;\`
- Self-hosting: download \`${O}/fonts/<id>/<id>.zip\`, or individual \`.woff2\` / \`.ttf\` files listed in fonts.json.

## 2. Let users type Thaana (phonetic keyboard)

Most users have no Dhivehi system keyboard. The module rewrites Latin keystrokes to Thaana using the standard Divehi Phonetic layout (Microsoft kbddiv1) (h→ހ, a→ަ, q→ް sukun, w→އ alifu …).

Zero-config: mark fields with \`data-thaana\`. Works for <input>, <textarea> and contenteditable, including elements added later.

\`\`\`html
<script type="module" src="${O}/thaana.js"></script>
<input data-thaana placeholder="ލިޔުއްވާ">
<textarea data-thaana></textarea>
\`\`\`

Programmatic (e.g. a DV/EN toggle):

\`\`\`js
import { attachKeyboard, transliterate, KEYMAP } from '${O}/thaana.js';
let dv = true;
const detach = attachKeyboard(document.querySelector('#name'), { enabled: () => dv });
transliterate('divehi'); // "ދިވެހި"
\`\`\`

React / Vue / Svelte: call \`attachKeyboard(element)\` when the element mounts and call the returned function on unmount. Controlled inputs keep working: the module inserts text with the browser's own editing command, so normal \`input\` events fire and undo works.

Behaviour you can rely on:
- Only single-character typing is rewritten. Paste, IME composition, autocorrect, deletion and text typed on a real Dhivehi keyboard pass through unchanged.
- \`attach\` sets dir="rtl", lang="dv" and turns off autocorrect/autocapitalize/spellcheck unless you set them yourself.
- \`data-thaana="off"\` opts a field out of auto-attach.

## 3. Getting RTL text right (common mistakes)

- Always set \`dir="rtl"\` and \`lang="dv"\` on Thaana text and inputs. Without dir="rtl", trailing punctuation (".", "،", "؟") appears on the wrong side.
- For text that may start with Latin or digits, add \`unicode-bidi: plaintext\` so each paragraph takes its direction from its first letter.
- Brackets: store them in logical order, "(" before the enclosed text, exactly as in English. The browser mirrors ( ) [ ] { } < > in RTL text, so they display correctly. Do NOT swap bracket pairs yourself. Some older Dhivehi keymaps do, and that makes brackets face outward and corrupts copied text.
- Dhivehi punctuation: comma ، (U+060C), semicolon ؛ (U+061B), question mark ؟ (U+061F). Full stop and digits are the ASCII ones.
- Fili (vowel marks, U+07A6–U+07B0) follow the consonant they sit on. A Thaana syllable is always consonant (or alifu އ) + fili; sukun ް marks no vowel.
- \`transliterate()\` replays keystrokes in the Divehi Phonetic layout. It is not a romanisation converter: it maps character by character, so pass it what a user would type on that layout (e.g. "divehi" for ދިވެހި), not arbitrary English spellings.

## 4. Sample text

Pangrams (all 24 native letters) for previews:
${PANGRAMS.map((p) => `- ${p}`).join('\n')}

## 5. About the fonts

- Fonts were collected from the community archives where they have circulated freely for years (dhivehi.mv, hassanhameed.com, thaana.com, thatmaldivesblog, dhivehifont.com).
- Pre-Unicode "A_" fonts that had Thaana on Latin keys were remapped to real Unicode Thaana. Where a modern Unicode version of the same design exists, only that is listed.
- Metrics were repaired (no clipped fili), names and weights normalised, and Thaana/Latin subsets generated.
- Fonts under CC BY-ND are shipped unmodified. OFL fonts include OFL.txt in the download.
- Licenses vary per family; check \`license\` in fonts.json before redistributing.

## Families

${index}
`;
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
