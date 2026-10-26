# @yashau/thaana-svelte

Thaana (Dhivehi) for Svelte 5: an action, an attachment and ready inputs. Includes everything from [`@yashau/thaana`](https://www.npmjs.com/package/@yashau/thaana).

```sh
npm i @yashau/thaana-svelte
```

```svelte
<script>
	import { ThaanaInput, thaana, thaanaKeyboard, fontStack, loadFonts } from '@yashau/thaana-svelte';
	let name = $state('');
	let dv = $state(true);
	loadFonts({ family: 'Faruma' });
</script>

<ThaanaInput {dv} bind:value={name} style="font-family: {fontStack('Faruma')}" />

<!-- or on any element -->
<textarea use:thaana={{ enabled: dv }}></textarea>
<div contenteditable {@attach thaanaKeyboard({ enabled: dv })}></div>
```

The action and attachment set `dir="rtl"`, `lang="dv"` and turn off autocorrect when the element doesn't set them, then keep `dir` in step with the text (left-to-right for an empty field while the keyboard is off). Let them manage `dir`: a `dir` you also put on a component that spreads its props is re-applied whenever the attachment changes, for example when `dv` flips. If you manage `dir` yourself, pass `autoDirection: false`.

Show Thaana text correctly (RTL even when it starts with a Latin word, numbers isolated):

```svelte
<ThaanaText as="p" text="ގުޅާލައްވާ: +960 333-1234" />
```

Fonts vary a lot in size at the same `font-size`. `loadFonts({ family: 'Faruma' }, { normalize: true })` scales a family so its Thaana letters look as big as Faruma's; the font files are unchanged.

To serve the font files yourself instead of from fonts.mv, pass them by weight: `loadFonts({ family: 'Faruma', files: { 400: '/fonts/faruma-400.woff2' } })`. `fontFaceCss()` writes the `@font-face` rules for a stylesheet. See [@yashau/thaana](https://www.npmjs.com/package/@yashau/thaana#your-own-font-files).
