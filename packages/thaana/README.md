# @yashau/thaana

Everything to make Thaana (Dhivehi) work on the web, in ~3 KB. No dependencies.

```sh
npm i @yashau/thaana
```

React, Svelte or Vue? Use [`@yashau/thaana-react`](https://www.npmjs.com/package/@yashau/thaana-react), [`@yashau/thaana-svelte`](https://www.npmjs.com/package/@yashau/thaana-svelte) or [`@yashau/thaana-vue`](https://www.npmjs.com/package/@yashau/thaana-vue). They re-export everything below.

## Keyboard: type Thaana on any keyboard

Most people have no Dhivehi keyboard installed. This rewrites Latin keystrokes to Thaana with the standard **Divehi Phonetic** layout (Microsoft's kbddiv1, the one Maldivian sites use): `h`→ހ, `a`→ަ, `q`→ް, `w`→އ, `,`→،, `?`→؟.

```js
import { attachKeyboard } from '@yashau/thaana';

let dv = true; // e.g. bound to a DV/EN toggle
const detach = attachKeyboard(document.querySelector('#name'), { enabled: () => dv });
```

Or with no JS of your own:

```html
<script type="module">
	import '@yashau/thaana/auto';
</script>
<input data-thaana />
<textarea data-thaana></textarea>
```

Or with no build step at all:

```html
<script src="https://fonts.mv/thaana.iife.js"></script>
<!-- window.Thaana -->
```

- Only single typed characters are rewritten. Paste, IME composition, autocorrect, deletion and real Dhivehi keyboards pass through.
- Inserts through the browser's editing command, so `input` events fire (controlled inputs keep working) and undo works.
- Sets `dir="rtl"`, `lang="dv"` and turns off autocorrect/autocapitalize/spellcheck unless you set them, then keeps `dir` in step with the text (RTL if it contains any Thaana, LTR for pure Latin, and for an empty field RTL while the keyboard is on, LTR while it's off; `autoDirection: false` to opt out).
- Bracket pairs are swapped like Microsoft's layout: press the key that looks right in RTL (`)` to open on the right) and the stored text keeps `(` before the enclosed text, which the browser mirrors.
- Rich-text editors (Lexical, TipTap, ProseMirror): call `thaanaForInputEvent(event)` in the editor's `beforeinput` hook and insert the result through the editor's API.

## Text helpers

| Function                                                                      | What it's for                                                                                                                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transliterate('divehi')`                                                     | `"ދިވެހި"`: replays keystrokes in the layout.                                                                                                                                                  |
| `convertLegacy(text, { layout })`                                             | Converts text typed in old pre-Unicode A_ fonts (it looks like `ihevid`) to Unicode.                                                                                                        |
| `repairPdfText(text)`                                                         | Fixes Thaana copied out of PDFs: reversed dates/times, stray spaces, jumped list markers.                                                                                                   |
| `normalizePunctuation(text)`                                                  | `"ބަސް ، ބުދަ ?"` → `"ބަސް، ބުދަ؟"`, tightens brackets.                                                                                                                                             |
| `isolateNumbers(text)`                                                        | Keeps `-5`, `+960 333-1234`, `9:00`, `1,000`, `50%` readable inside RTL text. Display only; the framework packages wrap it in `<ThaanaText>`.                                               |
| `isolate(value)`                                                              | Wraps a URL, email or name so it can't scramble the sentence around it.                                                                                                                     |
| `stripBidiControls(text)`                                                     | Removes bidi controls before saving or comparing.                                                                                                                                           |
| `hasThaana`, `hasRtl`, `isMixedScript`, `detectDirection`, `resolveDirection` | Script and direction detection.                                                                                                                                                             |
| `fontStack('Faruma')`                                                         | `'Faruma', system-ui, 'Noto Sans Thaana', 'MV Boli', sans-serif`                                                                                                                            |
| `loadFonts({ family: 'Faruma' })`                                             | Loads a font from [fonts.mv](https://fonts.mv), or from your own `files`, and resolves when it can be drawn. `{ normalize: true }` scales it so its Thaana letters look as big as Faruma's. |
| `fontFaceCss({ family, files })`                                              | `@font-face` CSS for your own copies of the files. `{ thaanaOnly: true }` limits them to Thaana.                                                                                            |
| `PANGRAMS`, `LETTERS`, `FILI`, …                                              | Sample text and the alphabet.                                                                                                                                                               |

## Your own font files

Don't want to depend on fonts.mv's hosting? Download the files (each family's page, the [downloads](https://fonts.mv/downloads) page, or `fonts.json`), serve them yourself and pass `files`, by weight. Nothing is then loaded from fonts.mv:

```js
import { loadFonts, fontFaceCss } from '@yashau/thaana';

await loadFonts({ family: 'Faruma', files: { 400: '/fonts/faruma-400.woff2' } });

// Or write the @font-face rules into your own stylesheet:
fontFaceCss({ family: 'Bolhu', files: { 400: '/fonts/bolhu-400.woff2', 700: '/fonts/bolhu-700.woff2' } });
```

For `{ normalize: true }` with your own files, also pass the family's `sizeAdjust` from `fonts.json`. Families with and without `files` can be mixed in one `loadFonts` call.

Fonts that ship unmodified get their line spacing fixed in CSS. Pass each file's `cssOverrides` from `fonts.json` (one object, or one per weight) and the rules get the same `ascent-override`, `descent-override` and `line-gap-override` that fonts.mv's stylesheet uses. `fonts.json` has a `version` that changes whenever any font file may have, and its file URLs carry it as `?v=`, so you can tell when to download again.

## Thaana only

To put a Thaana font first in a site-wide font stack, pass `{ thaanaOnly: true }` (to `loadFonts`, `fontFaceCss`, `fontCssUrl` or `useDhivehiFont`; `&subset=thaana` on the CSS API). Every `@font-face` then gets `unicode-range: THAANA_ONLY_RANGE` (Thaana, `،` `؛` `؟`, `ﷲ`, ZWNJ/ZWJ/LRM/RLM), so Latin letters, digits, punctuation and spaces fall through to the next font:

```js
fontFaceCss(
	{
		family: 'MV Faseyha',
		files: { 400: '/fonts/mv-faseyha-400.woff2' },
		cssOverrides: { 400: { ascent: 0.865, descent: -0.458, lineGap: 0 } }
	},
	{ thaanaOnly: true }
);
// :root { --font-sans: 'MV Faseyha', system-ui, sans-serif; }
```

## CSS defaults

```js
import '@yashau/thaana/thaana.css';
```

Applies to `:lang(dv)`: RTL, line height that doesn't clip fili, no synthetic italics/bold, `unicode-bidi: plaintext` for displayed paragraphs (not inputs, whose caret stays on the right), LTR for code/URLs/emails.

Guide: https://fonts.mv/docs · Agent guide: https://fonts.mv/llms.txt
