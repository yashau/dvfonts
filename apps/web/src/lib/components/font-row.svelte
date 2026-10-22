<script lang="ts">
	import { CATEGORIES, credit, defaultStyle, formatBytes, type Family } from '#lib/catalog.js';
	import { lazyFont } from '#lib/fonts.js';
	import FontPreview from '#lib/components/font-preview.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let { family }: { family: Family } = $props();

	const style = $derived(defaultStyle(family));
	const by = $derived(credit(family));
	const category = $derived(CATEGORIES.find((c) => c.id === family.category)?.label);
</script>

<div
	use:lazyFont={family}
	class="group relative min-w-0 border-b px-1 py-6 transition-colors hover:bg-muted/40 sm:px-3"
>
	<div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
		<div class="flex min-w-0 items-baseline gap-2">
			<h2 class="font-medium">
				<!-- The stretched link makes the whole row clickable; the download button sits above it. -->
				<a
					href="/fonts/{family.id}"
					class="group-hover:underline group-hover:underline-offset-4 after:absolute after:inset-0">{family.name}</a
				>
			</h2>
			<span class="truncate text-sm text-muted-foreground">{by ?? family.source ?? ''}</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-sm text-muted-foreground"
				>{category} · {family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}</span
			>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								href="/fonts/{family.id}/{family.id}.zip"
								download="{family.name}.zip"
								variant="ghost"
								size="icon-sm"
								class="relative z-10"
								aria-label="Download {family.name}"
							>
								<DownloadIcon />
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Download {family.name} ({formatBytes(family.zipSize)})</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
	</div>
	<FontPreview {family} weight={style.weight} singleLine />
</div>
