<script lang="ts">
	import { CATEGORIES, credit, defaultStyle, formatBytes, type Family } from '#lib/catalog.js';
	import { lazyFont } from '#lib/fonts.js';
	import FontPreview from '#lib/components/font-preview.svelte';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let { family }: { family: Family } = $props();

	const style = $derived(defaultStyle(family));
	const by = $derived(credit(family));
	const category = $derived(CATEGORIES.find((c) => c.id === family.category)?.label);
</script>

<div use:lazyFont={family}>
	<Item.Root
		class="relative flex-col flex-nowrap items-stretch rounded-none border-0 border-b px-1 py-6 hover:bg-muted/40 sm:px-3"
	>
		<Item.Header class="flex-wrap gap-y-1">
			<!-- Grows into the free space from a small basis, so a long credit truncates instead of
			     pushing the badges onto their own line. -->
			<div class="flex min-w-0 flex-1 basis-48 items-baseline gap-2">
				<Item.Title class="shrink-0 text-base whitespace-nowrap">
					<!-- Stretched link: the whole row is clickable; the download button sits above it. -->
					<a href="/fonts/{family.id}" class="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
						>{family.name}</a
					>
				</Item.Title>
				<Item.Description class="min-w-0 truncate">{by ?? family.source ?? ''}</Item.Description>
			</div>
			<Item.Actions>
				<Badge variant="secondary">{category}</Badge>
				<Badge variant="outline">{family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}</Badge>
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
			</Item.Actions>
		</Item.Header>
		<Item.Content class="min-w-0">
			<FontPreview {family} weight={style.weight} class="line-clamp-6 sm:line-clamp-4" />
		</Item.Content>
	</Item.Root>
</div>
