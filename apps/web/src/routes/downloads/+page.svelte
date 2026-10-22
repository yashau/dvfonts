<script lang="ts">
	import bundles from '#lib/data/bundles.json';
	import { formatBytes } from '#lib/catalog.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	const desktop = bundles.filter((b) => b.format === 'ttf');
	const web = bundles.filter((b) => b.format === 'woff2');
</script>

<svelte:head>
	<title>Downloads — dvfonts</title>
	<meta
		name="description"
		content="Download Dhivehi font collections as zip files: essentials, full suite, by category or as a webfont kit."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Downloads</h1>
	<p class="mt-2 max-w-2xl text-muted-foreground">
		Whole collections in one zip. Every family folder carries its credits and license; individual families can be
		downloaded from their own pages.
	</p>

	{#each [{ title: 'For your computer', note: 'TrueType/OpenType fonts to install.', list: desktop }, { title: 'For self-hosting on the web', note: 'WOFF2 files with a ready-made fonts.css.', list: web }] as group (group.title)}
		<h2 class="mt-10 text-xl font-semibold tracking-tight">{group.title}</h2>
		<p class="mb-4 text-sm text-muted-foreground">{group.note}</p>
		<div class="divide-y rounded-xl border">
			{#each group.list as b (b.id)}
				<div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<h3 class="font-medium">{b.name}</h3>
							<Badge variant="secondary">{b.families} families</Badge>
						</div>
						<p class="mt-1 text-sm text-muted-foreground">{b.description}</p>
					</div>
					<Button href="/downloads/{b.file}" variant="outline" class="shrink-0" download>
						<DownloadIcon />
						{formatBytes(b.size)}
					</Button>
				</div>
			{/each}
		</div>
	{/each}
</div>
