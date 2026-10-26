<script lang="ts">
	import { CATEGORIES, DEFAULT_CATEGORIES, FEATURED, credit, type Category } from '#lib/catalog.js';
	import FontRow from '#lib/components/font-row.svelte';
	import BrowsePanel from '#lib/components/browse-panel.svelte';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import SearchXIcon from '@lucide/svelte/icons/search-x';
	import * as Select from '#lib/components/ui/select/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state('');
	let categories = $state<Category[]>([...DEFAULT_CATEGORIES]);
	let sort = $state<'featured' | 'name' | 'styles'>('featured');
	let panelOpen = $state(false);

	const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
	const featuredRank = (id: string) => {
		const i = FEATURED.indexOf(id);
		return i === -1 ? FEATURED.length : i;
	};

	const sortLabels = { featured: 'Featured', name: 'Name', styles: 'Number of styles' };

	const counts = $derived(
		Object.fromEntries(CATEGORIES.map((c) => [c.id, data.families.filter((f) => f.category === c.id).length]))
	);

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const list = data.families.filter(
			(f) =>
				// A typed search looks in every category; the filter narrows browsing.
				(!!q || categories.length === 0 || categories.includes(f.category)) &&
				(!q ||
					f.name.toLowerCase().includes(q) ||
					f.aliases.some((a) => a.toLowerCase().includes(q)) ||
					(credit(f) ?? '').toLowerCase().includes(q) ||
					(f.source ?? '').toLowerCase().includes(q))
		);
		if (sort === 'name') return list.toSorted(byName);
		if (sort === 'styles') return list.toSorted((a, b) => b.styles.length - a.styles.length || byName(a, b));
		return list.toSorted((a, b) => featuredRank(a.id) - featuredRank(b.id) || byName(a, b));
	});

	const totalStyles = $derived(data.families.reduce((n, f) => n + f.styles.length, 0));
</script>

<svelte:head>
	<title>dvfonts — open Dhivehi fonts</title>
	<meta
		name="description"
		content="Free Dhivehi (Thaana) fonts, cleaned up and ready for the web: Unicode, WOFF2, fixed metrics and a Google Fonts–style embed API."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Open Dhivehi fonts</h1>
	<p class="mt-2 text-pretty text-muted-foreground">
		{data.families.length} families and {totalStyles} styles that have circulated freely in the Maldives for years — now Unicode,
		web-ready and easy to embed.
	</p>
</section>

<!-- Google Fonts layout: the preview and filters live in a sticky sidebar on wide
     screens and in a sheet from the left on small ones; search and sort stay above the list. -->
<div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
	<aside class="hidden lg:block">
		<div class="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pt-1 pr-1 pb-6">
			<BrowsePanel bind:categories {counts} />
		</div>
	</aside>

	<div class="min-w-0">
		<div class="sticky top-14 z-30 flex flex-wrap items-center gap-3 border-b bg-background/90 py-3 backdrop-blur">
			<Sheet.Root bind:open={panelOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="lg:hidden">
							<SlidersHorizontalIcon /> Filters
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<!-- No autofocus: on phones it would pop the keyboard up over the panel. -->
				<Sheet.Content side="left" class="w-80 overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
					<Sheet.Header>
						<Sheet.Title>Preview &amp; filters</Sheet.Title>
					</Sheet.Header>
					<div class="px-4 pb-6">
						<BrowsePanel bind:categories {counts} />
					</div>
				</Sheet.Content>
			</Sheet.Root>
			<InputGroup.Root class="min-w-0 flex-1 md:max-w-80">
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
				<InputGroup.Input bind:value={query} placeholder="Search fonts, designers, old names…" aria-label="Search" />
			</InputGroup.Root>
			<div class="flex items-center gap-3 md:ml-auto">
				<span class="text-sm text-muted-foreground tabular-nums">{visible.length} families</span>
				<Select.Root type="single" bind:value={sort}>
					<Select.Trigger size="sm" class="w-44" aria-label="Sort">{sortLabels[sort]}</Select.Trigger>
					<Select.Content>
						{#each Object.entries(sortLabels) as [value, label] (value)}
							<Select.Item {value} {label}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="pt-2">
			{#if visible.length}
				<Item.Group class="gap-0">
					{#each visible as family (family.id)}
						<FontRow {family} />
					{/each}
				</Item.Group>
			{:else}
				<Empty.Root class="py-20">
					<Empty.Header>
						<Empty.Media variant="icon"><SearchXIcon /></Empty.Media>
						<Empty.Title>No fonts match “{query}”</Empty.Title>
						<Empty.Description>Try another name. Old names like A_Waheed work too.</Empty.Description>
					</Empty.Header>
					<Empty.Content>
						<Button
							variant="outline"
							onclick={() => {
								query = '';
								categories = [];
							}}>Clear search and filters</Button
						>
					</Empty.Content>
				</Empty.Root>
			{/if}
		</div>
	</div>
</div>
