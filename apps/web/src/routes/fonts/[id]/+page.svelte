<script lang="ts">
	import { onMount } from 'svelte';
	import { CATEGORIES, WEIGHT_NAMES, credit, defaultStyle, fontUrl, formatBytes } from '#lib/catalog.js';
	import { registerFamily, previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { DIGITS_PUNCT, FILI, LETTERS_ARABIC, LETTERS_NATIVE, ARABIC_LETTERS_SAMPLE } from '#lib/thaana.js';
	import { cssApiUrl, origin, SITE_ORIGIN } from '#lib/site.js';
	import TesterBar from '#lib/components/tester-bar.svelte';
	import FontPreview from '#lib/components/font-preview.svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import WrenchIcon from '@lucide/svelte/icons/wrench';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const family = $derived(data.family);
	const symbols = $derived(family.category === 'symbols');
	const main = $derived(defaultStyle(family));
	const by = $derived(credit(family));
	const category = $derived(CATEGORIES.find((c) => c.id === family.category)?.label);

	$effect(() => registerFamily(family));

	let base = $state(SITE_ORIGIN);
	onMount(() => (base = origin()));

	let selected = $state<string[]>([]);
	$effect(() => {
		selected = family.styles.map((s) => String(s.weight));
	});
	const weights = $derived(selected.length ? selected.map(Number) : [main.weight]);
	const href = $derived(cssApiUrl(base, [{ name: family.name, weights }]));
	const linkSnippet = $derived(`<link rel="stylesheet" href="${href}">`);
	const importSnippet = $derived(`@import url('${href}');`);
	const cssSnippet = $derived(`:lang(dv) {\n  font-family: '${family.name}', sans-serif;\n}`);

	const changes = $derived.by(() => {
		const out: string[] = [];
		if (family.unmodified) {
			out.push('Distributed exactly as published: the license does not allow derivatives. Only wrapped as WOFF/WOFF2.');
			return out;
		}
		const legacy = family.styles.find((s) => s.legacyLayout)?.legacyLayout;
		if (legacy)
			out.push(
				`Remapped from the pre-Unicode ${legacy === 'typewriter' ? 'typewriter (A_ font)' : 'phonetic'} encoding to Unicode Thaana, so it works with any Dhivehi keyboard and on the web.`
			);
		if (family.styles.some((s) => s.metrics.repaired))
			out.push('Repaired broken vertical metrics that clipped fili and lines in browsers.');
		out.push('Consistent line height across Windows, macOS and Linux (hhea, typo and win metrics aligned).');
		out.push('Fili marked as combining marks so they stack correctly over letters.');
		out.push('Cleaned names and weights so all styles install as one family.');
		if (!symbols) out.push('Split into small Thaana and Latin subsets for faster loading on the web.');
		return out;
	});

	const details = $derived(
		(
			[
				['Designer', family.designer],
				['Manufacturer', family.manufacturer],
				['Copyright', family.copyright],
				[
					'License',
					family.licenseText && family.license !== 'OFL-1.1'
						? `${family.license}: ${family.licenseText}`
						: family.license
				],
				['Version', family.version]
			] as [string, string | null][]
		).filter((d): d is [string, string] => Boolean(d[1]))
	);

	const glyphSets = $derived([
		{ title: 'Letters', chars: LETTERS_NATIVE },
		{ title: 'Arabic-derived letters', chars: LETTERS_ARABIC },
		{ title: 'Fili', chars: FILI.map((f) => 'އ' + f) },
		{ title: 'Digits & punctuation', chars: DIGITS_PUNCT }
	]);
</script>

<svelte:head>
	<title>{family.name} — dvfonts</title>
	<meta
		name="description"
		content="{family.name}: free Dhivehi font{family.styles.length > 1
			? ` in ${family.styles.length} styles`
			: ''}. Preview, download, or embed it on the web."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
	<Button href="/" variant="ghost" size="sm" class="-ml-2 text-muted-foreground"><ArrowLeftIcon /> All fonts</Button>

	<header class="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="min-w-0">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{family.name}</h1>
			<p class="mt-1 text-muted-foreground">{by ?? family.source ?? 'Unknown designer'}</p>
			<div class="mt-3 flex flex-wrap items-center gap-2">
				<Badge variant="secondary">{category}</Badge>
				<Badge variant="outline">{family.license}</Badge>
				<span class="text-sm text-muted-foreground"
					>{family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}</span
				>
				{#if family.aliases.length}
					<span class="text-sm text-muted-foreground">· also known as {family.aliases.join(', ')}</span>
				{/if}
			</div>
		</div>
		<Button href="/fonts/{family.id}/{family.id}.zip" download="{family.name}.zip">
			<DownloadIcon /> Download family <span class="opacity-70">({formatBytes(family.zipSize)})</span>
		</Button>
	</header>

	<Card.Root class="mt-8">
		<Card.Content class="sm:px-10 sm:py-4">
			<FontPreview {family} weight={main.weight} size={Math.max(tester.size, 48)} />
		</Card.Content>
	</Card.Root>

	<section class="mt-10">
		<h2 class="mb-4 text-xl font-semibold tracking-tight">Styles</h2>
		<TesterBar />
		<Item.Group class="mt-2 gap-0">
			{#each family.styles as style, i (style.weight)}
				{#if i > 0}<Item.Separator />{/if}
				<Item.Root class="flex-col flex-nowrap items-stretch px-0 py-5">
					<Item.Header class="flex-wrap">
						<Item.Description>{WEIGHT_NAMES[style.weight]} {style.weight}</Item.Description>
						<Item.Actions>
							{#each Object.keys(style.sizes).filter((k) => k !== 'woff') as kind (kind)}
								<Button
									href="{fontUrl(family, style.weight, kind)}?download={encodeURIComponent(
										`${family.name.replace(/\s+/g, '')}-${WEIGHT_NAMES[style.weight]}.${kind}`
									)}"
									variant="ghost"
									size="xs"
									aria-label="Download {family.name} {WEIGHT_NAMES[style.weight]} as {kind.toUpperCase()}"
								>
									<DownloadIcon />
									{kind.toUpperCase()}
								</Button>
							{/each}
						</Item.Actions>
					</Item.Header>
					<Item.Content class="min-w-0">
						<FontPreview {family} weight={style.weight} />
					</Item.Content>
				</Item.Root>
			{/each}
		</Item.Group>
	</section>

	{#if !symbols}
		<section class="mt-10">
			<h2 class="mb-4 text-xl font-semibold tracking-tight">Glyphs</h2>
			{#each glyphSets as set (set.title)}
				<h3 class="mt-6 mb-2 text-sm font-medium text-muted-foreground">{set.title}</h3>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
					{#each set.chars as ch (ch)}
						<Card.Root size="sm" class="aspect-square justify-center py-0">
							<Card.Content
								class="flex items-center justify-center px-0 text-4xl"
								dir="rtl"
								style="font-family: '{previewFamily(family)}', 'dv-ui', sans-serif; font-weight: {main.weight}"
							>
								{ch}
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/each}
			<Card.Root class="mt-6">
				<Card.Content>
					<FontPreview {family} weight={main.weight} size={28} text={ARABIC_LETTERS_SAMPLE} />
				</Card.Content>
			</Card.Root>
		</section>
	{/if}

	<!-- min-w-0 on the columns: grid items default to min-width:auto, so the code
	     blocks' long URLs would stretch the page instead of scrolling inside. -->
	<section class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card.Root class="min-w-0">
			<Card.Header>
				<Card.Title class="text-xl">Use on the web</Card.Title>
				<Card.Description>
					Pick the weights you need. The stylesheet loads only the Thaana or Latin parts a page actually uses.
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				{#if family.styles.length > 1}
					<ToggleGroup.Root type="multiple" variant="outline" size="sm" bind:value={selected} class="flex-wrap">
						{#each family.styles as style (style.weight)}
							<ToggleGroup.Item value={String(style.weight)} class="px-3">{style.weight}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				{/if}
				<CodeBlock title="In <head>" lang="html" code={linkSnippet} />
				<CodeBlock title="Or in CSS" lang="css" code={importSnippet} />
				<CodeBlock title="Then use" lang="css" code={cssSnippet} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="min-w-0">
			<Card.Header>
				<Card.Title class="text-xl">About this font</Card.Title>
				{#if family.notes}<Card.Description>{family.notes}</Card.Description>{/if}
			</Card.Header>
			<Card.Content class="flex flex-col gap-6">
				<Table.Root class="table-fixed">
					<Table.Body>
						{#each details as [label, value] (label)}
							<Table.Row>
								<Table.Head class="h-auto w-28 py-2 align-top text-muted-foreground">{label}</Table.Head>
								<Table.Cell class="align-top break-words whitespace-normal">{value}</Table.Cell>
							</Table.Row>
						{/each}
						{#if family.source}
							<Table.Row>
								<Table.Head class="h-auto w-28 py-2 align-top text-muted-foreground">Source</Table.Head>
								<Table.Cell class="align-top whitespace-normal">
									{#if family.upstream}
										<Button
											href={family.upstream}
											variant="link"
											size="sm"
											class="h-auto p-0 align-top has-[>svg]:px-0"
											rel="noopener noreferrer"
											target="_blank">{family.source} <ExternalLinkIcon /></Button
										>
									{:else}{family.source}{/if}
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>

				<Alert.Root>
					<WrenchIcon />
					<Alert.Title>What dvfonts changed</Alert.Title>
					<Alert.Description>
						<ul class="list-disc space-y-1 pl-4">
							{#each changes as c (c)}<li>{c}</li>{/each}
						</ul>
					</Alert.Description>
				</Alert.Root>

				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Style</Table.Head>
							<Table.Head>Files</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each family.styles as s (s.weight)}
							<Table.Row>
								<Table.Cell class="text-muted-foreground">{WEIGHT_NAMES[s.weight]}</Table.Cell>
								<Table.Cell class="whitespace-normal">
									<div class="flex flex-wrap gap-1">
										{#each Object.entries(s.sizes) as [kind, size] (kind)}
											<Button href={fontUrl(family, s.weight, kind)} download variant="outline" size="xs">
												{kind.toUpperCase()} <span class="text-muted-foreground">{formatBytes(size)}</span>
											</Button>
										{/each}
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</section>
</div>
