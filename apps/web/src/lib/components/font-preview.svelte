<script lang="ts">
	import { previewLineHeight, type Family } from '#lib/catalog.js';
	import { previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { isolateNumbers, resolveDirection } from '@yashau/thaana';
	import { SYMBOL_SAMPLE } from '#lib/thaana.js';
	import { cn } from '#lib/utils.js';
	import { legacyEncoding, toLegacy } from '#lib/legacy.js';

	let {
		family,
		weight,
		size = tester.size,
		text,
		class: className
	}: { family: Family; weight: number; size?: number; text?: string; class?: string } = $props();

	const symbols = $derived(family.category === 'symbols');
	// Symbol fonts keep their glyphs on ASCII keys, so typed Thaana would only
	// show fallback text; preview their own glyphs unless the user typed Latin.
	const content = $derived(
		text ?? (symbols ? (tester.text && !tester.dv ? tester.text : SYMBOL_SAMPLE) : tester.preview)
	);
	const lineHeight = $derived(previewLineHeight(family.styles.find((s) => s.weight === weight)));
	// Pre-Unicode fonts draw Thaana from Latin keys: write the sample in their
	// encoding and force it right to left, unless the user typed Latin themselves.
	const legacy = $derived(legacyEncoding(family));
	const legacyText = $derived(legacy && !(tester.text && !tester.dv && !text) ? toLegacy(content, legacy) : null);
	const dir = $derived(legacyText !== null ? 'rtl' : symbols ? 'ltr' : resolveDirection(content, null, 'rtl'));
</script>

<p
	class={cn('preview-text text-foreground', className)}
	{dir}
	lang={symbols || legacyText !== null ? undefined : 'dv'}
	style:font-family="'{previewFamily(family)}', 'dv-ui', sans-serif"
	style:font-weight={weight}
	style:font-size="{size}px"
	style:unicode-bidi={legacyText !== null ? 'bidi-override' : undefined}
	style:line-height={lineHeight}
>
	{legacyText ?? (symbols ? content : isolateNumbers(content))}
</p>
