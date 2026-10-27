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
		size,
		text,
		class: className
	}: { family: Family; weight: number; size?: number; text?: string; class?: string } = $props();

	const symbols = $derived(family.category === 'symbols');
	// Until a size is picked, the CSS default (36px, 20px on phones) applies from first paint.
	const fontSize = $derived(size ? `${size}px` : tester.sizeChosen ? `${tester.size}px` : 'var(--tester-size)');
	// Symbol fonts keep their glyphs on ASCII keys, so typed Thaana would only
	// show fallback text; preview their own glyphs unless the user typed Latin.
	const content = $derived(
		text ??
			(symbols
				? tester.text && !tester.dv
					? tester.text
					: family.sample
						? [family.sample.heading, family.sample.subheading, family.sample.text].filter(Boolean).join(' ')
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
		)}', 'dv-ui', sans-serif; font-weight: {weight}; font-size: {fontSize}; line-height: {lineHeight}"
	/>
{:else}
	<!-- Symbol fonts: glyphs on ASCII keys, at no less than 48px (as on their own page), since
	     they draw small for their em. -->
	<p
		class={cn('preview-text text-foreground', className)}
		dir="ltr"
		style:font-family="'{previewFamily(family, normalized)}', 'dv-ui', sans-serif"
		style:font-weight={weight}
		style:font-size="max({fontSize}, 48px)"
		style:line-height={lineHeight}
	>
		{content}
	</p>
{/if}
