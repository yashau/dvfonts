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
