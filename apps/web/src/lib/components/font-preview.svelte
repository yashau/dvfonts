<script lang="ts">
	import { previewLineHeight, type Family } from '#lib/catalog.js';
	import { previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { ThaanaText } from '@yashau/thaana-svelte';
	import { SYMBOL_SAMPLE } from '#lib/thaana.js';
	import { cn } from '#lib/utils.js';

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
		text ??
			(symbols
				? tester.text && !tester.dv
					? tester.text
					: family.chars
						? [...family.chars].join(' ')
						: SYMBOL_SAMPLE
				: tester.preview)
	);
	const style = $derived(family.styles.find((s) => s.weight === weight));
	const normalized = $derived(tester.normalize && !!style?.sizeAdjust);
	const lineHeight = $derived(previewLineHeight(style, normalized ? (style?.sizeAdjust ?? 1) : 1));
</script>

{#if !symbols}
	<!-- Ordinary Thaana text: exactly what the package gives every developer. -->
	<ThaanaText
		as="p"
		text={content}
		class={cn('preview-text text-foreground', className)}
		style="font-family: '{previewFamily(
			family,
			normalized
		)}', 'dv-ui', sans-serif; font-weight: {weight}; font-size: {size}px; line-height: {lineHeight}"
	/>
{:else}
	<!-- Symbol fonts: glyphs on ASCII keys. -->
	<p
		class={cn('preview-text text-foreground', className)}
		dir="ltr"
		style:font-family="'{previewFamily(family, normalized)}', 'dv-ui', sans-serif"
		style:font-weight={weight}
		style:font-size="{size}px"
		style:line-height={lineHeight}
	>
		{content}
	</p>
{/if}
