<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import AuthorHero from '#lib/components/author-hero.svelte';
	import { byImportance } from '#lib/authors.js';
	import {
		CATEGORIES,
		DEFAULT_CATEGORIES,
		FEATURED,
		UNKNOWN_AUTHOR,
		authorsOrUnknown,
		credit,
		type Category
	} from '#lib/catalog.js';
	import FontRow from '#lib/components/font-row.svelte';
	import BrowsePanel, { type Sort } from '#lib/components/browse-panel.svelte';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import SearchXIcon from '@lucide/svelte/icons/search-x';
	import SearchIcon from '@lucide/svelte/icons/search';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state('');
	let categories = $state<Category[]>([...DEFAULT_CATEGORIES]);
	let sort = $state<Sort>('featured');
	let panelOpen = $state(false);

	let author = $state<string | null>(null);

	// Author names on cards and font pages link to /?author=<name>. Read in an effect,
	// since the prerendered page has no query string.
	let urlRead = $state(false);
	$effect(() => {
		// No ?author= (the logo, the Fonts link) clears the filter.
		author = page.url.searchParams.get('author');
		urlRead = true;
	});

	// Keep the address in step with the author picker, so a filtered list can be shared.
	$effect(() => {
		if (!urlRead) return;
		const wanted = author === null ? '/' : `/?author=${encodeURIComponent(author)}`;
		if (`${page.url.pathname}${page.url.search}` !== wanted) {
			goto(wanted, { replace: true, reset: false });
		}
	});

	const authorList = $derived.by(() => {
		const count = new Map<string, number>();
		for (const f of data.families) for (const a of authorsOrUnknown(f)) count.set(a, (count.get(a) ?? 0) + 1);
		// The Authors page's order (importance to Maldivian typography), with Unknown last.
		const rank = (n: string) => (n === UNKNOWN_AUTHOR ? 1 : 0);
		return [...count]
			.map(([name, n]) => ({ name, count: n }))
			.toSorted((a, b) => rank(a.name) - rank(b.name) || byImportance(a.name, b.name));
	});

	const authorCount = $derived(author ? (authorList.find((a) => a.name === author)?.count ?? 0) : 0);

	const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
	const featuredRank = (id: string) => {
		const i = FEATURED.indexOf(id);
		return i === -1 ? FEATURED.length : i;
	};

	const counts = $derived(
		Object.fromEntries(CATEGORIES.map((c) => [c.id, data.families.filter((f) => f.category === c.id).length]))
	);

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const list = data.families.filter(
			(f) =>
				// A typed search or an author looks in every category; the filter narrows browsing.
				(!!q || !!author || categories.length === 0 || categories.includes(f.category)) &&
				(!author || authorsOrUnknown(f).includes(author)) &&
				(!q ||
					f.name.toLowerCase().includes(q) ||
					f.aliases.some((a) => a.toLowerCase().includes(q)) ||
					(credit(f) ?? '').toLowerCase().includes(q) ||
					(f.source ?? '').toLowerCase().includes(q))
		);
		if (sort === 'name') return list.toSorted(byName);
		if (sort === 'styles') return list.toSorted((a, b) => b.styles.length - a.styles.length || byName(a, b));
		// Years: first release or this version's release date; unknown years go last either way.
		const byYear = (key: 'firstYear' | 'versionYear', dir: 1 | -1) =>
			list.toSorted((a, b) => dir * ((a[key] ?? dir * 9999) - (b[key] ?? dir * 9999)) || byName(a, b));
		if (sort === 'first-newest') return byYear('firstYear', -1);
		if (sort === 'first-oldest') return byYear('firstYear', 1);
		if (sort === 'release-newest') return byYear('versionYear', -1);
		if (sort === 'release-oldest') return byYear('versionYear', 1);
		return list.toSorted((a, b) => featuredRank(a.id) - featuredRank(b.id) || byName(a, b));
	});
</script>

<svelte:head>
	<title>fonts.mv — open Dhivehi fonts</title>
	<meta
		name="description"
		content="Free Dhivehi (Thaana) fonts for the web: a Google Fonts–style embed API, downloads, and agent-ready packages for React, Svelte, Vue and plain JavaScript."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
	{#if author}
		<AuthorHero name={author} count={authorCount} onclear={() => (author = null)} />
	{:else}
		<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Open Dhivehi fonts</h1>
		<p class="mt-2 text-pretty text-muted-foreground">
			{data.total.families} families and {data.total.styles} styles that have circulated freely in the Maldives for years,
			ready to embed on the web. Agent-ready, with
			<a class="underline underline-offset-4" href="/docs#packages">packages</a> for React, Svelte, Vue and plain
			JavaScript that handle Thaana typing and display, and an
			<a class="underline underline-offset-4" href="/llms.txt">llms.txt</a> for AI agents.
		</p>
	{/if}
</section>

<!-- Google Fonts layout: the preview and filters live in a sticky sidebar on wide
     screens and in a sheet from the left on small ones; search and sort stay above the list. -->
<div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
	<aside class="hidden lg:block">
		<!-- Padding on every side (offset by -mx-1) leaves room for the 3px focus rings, which the
		     scroll container would otherwise clip. -->
		<div class="sticky top-20 -mx-1 max-h-[calc(100svh-6rem)] overflow-y-auto px-1 pt-1 pb-6">
			<BrowsePanel bind:categories bind:sort bind:author authors={authorList} {counts} shown={visible.length} />
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
						<BrowsePanel bind:categories bind:sort bind:author authors={authorList} {counts} shown={visible.length} />
					</div>
				</Sheet.Content>
			</Sheet.Root>
			<InputGroup.Root class="min-w-0 flex-1">
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
				<InputGroup.Input bind:value={query} placeholder="Search fonts, designers, old names…" aria-label="Search" />
			</InputGroup.Root>
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
								author = null;
								categories = [];
							}}>Clear search and filters</Button
						>
					</Empty.Content>
				</Empty.Root>
			{/if}
		</div>
	</div>
</div>
