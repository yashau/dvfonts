<script lang="ts">
	import bundles from '#lib/data/bundles.json';
	import { formatBytes } from '#lib/catalog.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import PackageIcon from '@lucide/svelte/icons/package';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	const desktop = bundles.filter((b) => b.format === 'ttf');
	const web = bundles.filter((b) => b.format === 'woff2');
	const legacy = bundles.filter((b) => b.format === 'legacy');
	const groups = [
		{ title: 'For your computer', note: 'TrueType/OpenType fonts to install.', list: desktop },
		{ title: 'For self-hosting on the web', note: 'WOFF2 files with a ready-made fonts.css.', list: web },
		{
			title: 'For old documents',
			note: 'The original pre-Unicode files, untouched. Text typed in them only reads correctly in these fonts.',
			list: legacy
		}
	];
</script>

<svelte:head>
	<title>Downloads — fonts.mv</title>
	<meta
		name="description"
		content="Download Dhivehi font collections as zip files: essentials, full suite, by category, as a webfont kit, or the original pre-Unicode fonts."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Downloads</h1>
	<p class="mt-2 max-w-4xl text-pretty text-muted-foreground">
		Whole collections in one zip. Every family folder carries its credits and license; individual families can be
		downloaded from their own pages.
	</p>

	{#each groups as group (group.title)}
		<h2 class="mt-10 text-xl font-semibold tracking-tight">{group.title}</h2>
		<p class="mb-4 text-sm text-muted-foreground">{group.note}</p>
		<Card.Root class="py-0">
			<!-- py-6 matches the space around each separator (the group's gap-4 plus the separator's my-2), so the
			     first and last items sit as far from the card edge as the others do from a separator. -->
			<Item.Group class="py-6">
				{#each group.list as b, i (b.id)}
					{#if i > 0}<Item.Separator />{/if}
					<Item.Root class="flex-wrap">
						<Item.Media variant="icon"><PackageIcon /></Item.Media>
						<Item.Content class="min-w-48">
							<Item.Title>
								{b.name}
								<Badge variant="secondary">{b.families} {b.format === 'legacy' ? 'fonts' : 'families'}</Badge>
							</Item.Title>
							<Item.Description class="line-clamp-none">{b.description}</Item.Description>
						</Item.Content>
						<Item.Actions>
							<Button href="/downloads/{b.file}" variant="outline" download>
								<DownloadIcon />
								{formatBytes(b.size)}
							</Button>
						</Item.Actions>
					</Item.Root>
				{/each}
			</Item.Group>
		</Card.Root>
	{/each}
</div>
