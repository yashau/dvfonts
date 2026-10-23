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

> Free Dhivehi (Thaana script, language code "dv") fonts for the web, with a Google-Fonts-compatible CSS API, a drop-in Thaana phonetic keyboard, and the @yashau/thaana packages (vanilla, React, Svelte, Vue) that make Thaana display and input work correctly. ${fams.length} families. Everything below is copy-paste ready; all URLs are absolute.

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
- Fonts differ a lot in size at the same font-size. Optional: add \`&normalize=1\` to scale each family (CSS \`size-adjust\`) so its Thaana letters look as big as Faruma's; the files are unchanged. Packages: \`fontCssUrl(fonts, { normalize: true })\`, \`loadFonts(fonts, { normalize: true })\`, \`useDhivehiFont(family, weights, { normalize: true })\`.
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

In an app, install the package instead of using the CDN script (same API, typed):

\`\`\`sh
npm i @yashau/thaana          # vanilla JS / any framework
npm i @yashau/thaana-react    # React 18/19: useThaanaKeyboard, <ThaanaInput>, <ThaanaTextarea>, <ThaanaText>, useDhivehiFont
npm i @yashau/thaana-svelte   # Svelte 5: use:thaana action, {@attach thaanaKeyboard()}, <ThaanaInput bind:value>, <ThaanaText>
npm i @yashau/thaana-vue      # Vue 3: v-thaana directive, <ThaanaInput v-model>, <ThaanaText>, useDhivehiFont, ThaanaPlugin
\`\`\`

The framework packages re-export everything from @yashau/thaana, so install only one.

To DISPLAY Thaana (labels, titles, user content), use \`<ThaanaText text={value} as="p" />\` from the framework package: it applies dir (RTL if the text contains any Thaana, even when it starts with a Latin word), lang="dv", and isolates numbers/phone numbers/percentages so they don't scramble. Display-only: the stored text is never changed.

\`\`\`tsx
// React
import { ThaanaInput, useDhivehiFont, fontStack } from '@yashau/thaana-react';
useDhivehiFont('Faruma');
<ThaanaInput value={name} onChange={(e) => setName(e.target.value)} style={{ fontFamily: fontStack('Faruma') }} />
\`\`\`

\`\`\`svelte
<!-- Svelte 5 -->
<script>import { ThaanaInput } from '@yashau/thaana-svelte'; let name = $state('');</script>
<ThaanaInput bind:value={name} />
\`\`\`

\`\`\`vue
<!-- Vue 3 -->
<script setup>import { ref } from 'vue'; import { ThaanaInput } from '@yashau/thaana-vue'; const name = ref('');</script>
<template><ThaanaInput v-model="name" /></template>
\`\`\`

Rich-text editors (Lexical, TipTap/ProseMirror, Slate): in the editor's beforeinput handler call \`thaanaForInputEvent(event)\`; if it returns a string, preventDefault and insert it through the editor's API.

Behaviour you can rely on:
- Only single-character typing is rewritten. Paste, IME composition, autocorrect, deletion and text typed on a real Dhivehi keyboard pass through unchanged.
- Text is inserted with the browser's own editing command, so normal \`input\` events fire (controlled inputs work) and undo works.
- \`attachKeyboard\` sets dir="rtl", lang="dv" and turns off autocorrect/autocapitalize/spellcheck unless you set them yourself.
- \`data-thaana="off"\` opts a field out of auto-attach.
- Bracket pairs are swapped like Microsoft's layout: the user presses the key that looks right in RTL (")" to open), and the stored text keeps "(" before the enclosed text.

## 3. Getting RTL text right (common mistakes)

Full guide with live examples: ${O}/guide

- Always set \`dir="rtl"\` and \`lang="dv"\` on Thaana text and inputs (or \`<html lang="dv" dir="rtl">\`). Without dir="rtl", trailing punctuation (".", "،", "؟") appears on the wrong side.
- \`dir="auto"\` turns "Apple ގެ ފޯނު" left-to-right because the first letter is Latin. If text contains any Thaana, render it RTL: \`resolveDirection(text)\`. For displayed multi-paragraph user content use \`unicode-bidi: plaintext\`, but never on inputs, textareas or contenteditable: an empty field becomes left-to-right and the caret starts on the left. Give inputs \`dir\` from \`resolveDirection(value, null, 'rtl')\` (attachKeyboard does this).
- Numbers inside Thaana: phone numbers swap their groups and "-5" shows as "5-". Wrap them in \`<bdi dir="ltr">\`, or use \`isolateNumbers(text)\` for plain strings (titles, notifications, canvas). Remove the invisible isolates with \`stripBidiControls()\` before saving.
- Brackets: store them in logical order, "(" before the enclosed text, exactly as in English. The browser mirrors ( ) [ ] { } < > in RTL text. Do NOT swap bracket pairs in stored text (the keyboard swaps keystrokes, not text).
- Dhivehi punctuation: comma ، (U+060C), semicolon ؛ (U+061B), question mark ؟ (U+061F). Full stop and digits are ASCII. No space before punctuation. \`normalizePunctuation(text)\` fixes both.
- Fili (vowel marks, U+07A6–U+07B0) sit above/below letters: use line-height ≈ 1.75 and avoid \`overflow: hidden\` with tight line heights, or they get clipped.
- Most Dhivehi fonts have no Latin letters: always give a Latin fallback. \`fontStack('Faruma')\` → "'Faruma', system-ui, 'Noto Sans Thaana', 'MV Boli', sans-serif".
- No italics for Thaana (\`font-synthesis: none\`); emphasise with weight or colour.
- Canvas: \`await loadFonts({ family })\` before drawing, set \`ctx.direction = 'rtl'\`. SVG: \`direction="rtl"\`.
- \`@yashau/thaana/thaana.css\` (also ${O}/thaana.css) applies the CSS side of all this to \`:lang(dv)\`.
- \`transliterate()\` replays keystrokes in the Divehi Phonetic layout. It is not a romanisation converter: pass what a user would type (e.g. "divehi" for ދިވެހި).

## 3b. Repairing existing text

- Text typed with old pre-Unicode A_ fonts shows as Latin gibberish (e.g. "cswb ihevid" for ދިވެހި ބަސް): \`convertLegacy(text, { layout: 'typewriter' })\`; for the older casual fonts (Thaana, Akko, Athu Casual) use \`layout: 'phonetic'\`.
- Thaana copied out of a PDF has reversed dates/times ("2026/1/14" for 14/1/2026) and stray spaces: \`repairPdfText(text)\`. Never run it on typed text.
- Interactive converter: ${O}/convert

## 4. Sample text

Pangrams (all 24 native letters) for previews:
${PANGRAMS.map((p) => `- ${p}`).join('\n')}

## 5. About the fonts

- Fonts were collected from the community archives where they have circulated freely for years (dhivehi.mv, hassanhameed.com, thaana.com, thatmaldivesblog, dhivehifont.com).
- Pre-Unicode "A_" fonts that had Thaana on Latin keys were remapped to real Unicode Thaana. Where a modern Unicode version of the same design exists, only that is listed.
- Metrics were repaired (no clipped fili), names and weights normalised, and Thaana/Latin subsets generated.
- Fonts under CC BY-ND, and fonts whose designer requires it (all of Hassan Hameed's), are shipped unmodified: only converted to WOFF/WOFF2. OFL fonts include OFL.txt in the download.
- Pre-Unicode A_ fonts we may not remap are download-only, for opening old documents; the CSS API refuses them. Convert their text with \`convertLegacy()\`.
- Licenses vary per family; check \`license\` in fonts.json before redistributing.

## Families

${index}
`;
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
