<script lang="ts">
	import type { Family } from '#lib/catalog.js';
	import { previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { SYMBOL_SAMPLE, hasThaana } from '#lib/thaana.js';
	import { cn } from '#lib/utils.js';

	let {
		family,
		weight,
		size = tester.size,
		text,
		singleLine = false,
		class: className
	}: { family: Family; weight: number; size?: number; text?: string; singleLine?: boolean; class?: string } = $props();

	const symbols = $derived(family.category === 'symbols');
	// Symbol fonts keep their glyphs on ASCII keys, so typed Thaana would only
	// show fallback text; preview their own glyphs unless the user typed Latin.
	const content = $derived(
		text ?? (symbols ? (tester.text && !tester.dv ? tester.text : SYMBOL_SAMPLE) : tester.preview)
	);
	// One-line rows fade out where the text runs off: the left edge for RTL.
	const rtl = $derived(!symbols && (hasThaana(content) || !content));
</script>

<p
	class={cn(
		'preview-text text-foreground',
		singleLine &&
			(rtl ? 'overflow-hidden mask-l-from-85% whitespace-nowrap' : 'overflow-hidden mask-r-from-85% whitespace-nowrap'),
		className
	)}
	dir={symbols ? 'ltr' : 'rtl'}
	lang={symbols ? undefined : 'dv'}
	style:font-family="'{previewFamily(family)}', 'dv-ui', sans-serif"
	style:font-weight={weight}
	style:font-size="{size}px"
>
	{content}
</p>
