<script lang="ts">
	import { CATEGORIES, WEIGHT_NAMES, authors, defaultStyle, fontUrl, formatBytes } from '#lib/catalog.js';
	import { registerFamily, previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { glyphGroups } from '#lib/glyphs.js';
	import { CONTACT_EMAIL, cssApiUrl, SITE_ORIGIN } from '#lib/site.js';
	import FontPreview from '#lib/components/font-preview.svelte';
	import RichTester from '#lib/components/rich-tester.svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import CreditLine from '#lib/components/credit-line.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import WrenchIcon from '@lucide/svelte/icons/wrench';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { toggleOn } from '#lib/toggle.js';
	import { cn } from '#lib/utils.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Kbd } from '#lib/components/ui/kbd/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const family = $derived(data.family);
	const symbols = $derived(family.category === 'symbols');
	const main = $derived(defaultStyle(family));
	// The weight shown in the preview card.
	let weightChoice = $state('');
	$effect(() => {
		weightChoice = String(defaultStyle(family).weight);
	});
	const shown = $derived(family.styles.find((s) => String(s.weight) === weightChoice) ?? main);
	const category = $derived(CATEGORIES.find((c) => c.id === family.category)?.label);

	$effect(() => registerFamily(family));

	let selected = $state<string[]>([]);
	$effect(() => {
		selected = family.styles.map((s) => String(s.weight));
	});
	const weights = $derived(selected.length ? selected.map(Number) : [main.weight]);
	// Opt-in: size-adjust so the letters look as big as Faruma's (the files are unchanged).
	let normalize = $state(false);
	const canNormalize = $derived(family.styles.some((s) => s.sizeAdjust && s.sizeAdjust !== 1));
	// Opt-in: limit the font to Thaana so it can lead a site-wide stack. Not for symbol
	// fonts, whose glyphs sit on ASCII keys.
	let thaanaOnly = $state(false);
	const canThaanaOnly = $derived(family.category !== 'symbols');
	const href = $derived(
		cssApiUrl(SITE_ORIGIN, [{ name: family.name, weights }], {
			normalize: normalize && canNormalize,
			thaanaOnly: thaanaOnly && canThaanaOnly
		})
	);
	const linkSnippet = $derived(`<link rel="stylesheet" href="${href}">`);
	const importSnippet = $derived(`@import url('${href}');`);
	// Self-hosting: the same weights from your own copies of the files (the WOFF2s above).
	const ownSnippet = $derived.by(() => {
		const scaled = normalize && canNormalize;
		const list = (items: string[], indent: string) =>
			items.map((line, i) => `${indent}${line}${i < items.length - 1 ? ',' : ''}`);
		// Unmodified fonts get their line spacing fixed in CSS; self-hosting needs the same fix.
		const fixes = weights.flatMap((w) => {
			const o = family.styles.find((s) => s.weight === w)?.cssOverrides;
			return o ? [`${w}: { ascent: ${o.ascent}, descent: ${o.descent}, lineGap: ${o.lineGap} }`] : [];
		});
		const fields = [
			`family: '${family.name}'`,
			`files: {\n${list(
				weights.map((w) => `${w}: '/fonts/${family.id}-${w}.woff2'`),
				'    '
			).join('\n')}\n  }`,
			...(fixes.length ? [`cssOverrides: {\n${list(fixes, '    ').join('\n')}\n  }`] : []),
			...(scaled ? [`sizeAdjust: ${main.sizeAdjust}`] : [])
		];
		const options = [
			...(scaled ? ['normalize: true'] : []),
			...(thaanaOnly && canThaanaOnly ? ['thaanaOnly: true'] : [])
		];
		return `import { loadFonts } from '@yashau/thaana';\n\nawait loadFonts({\n${list(fields, '  ').join('\n')}\n}${options.length ? `, { ${options.join(', ')} }` : ''});`;
	});
	// Thaana-only fonts can lead the whole page's stack; otherwise use them for Dhivehi text.
	const cssSnippet = $derived(
		thaanaOnly && canThaanaOnly
			? `body {\n  font-family: '${family.name}', system-ui, sans-serif;\n}`
			: `:lang(dv) {\n  font-family: '${family.name}', sans-serif;\n}`
	);

	const changes = $derived.by(() => {
		const out: string[] = [];
		if (family.unmodified) {
			out.push(
				family.unmodifiedReason === 'designer'
					? 'Distributed exactly as published, as its designer requires. Only converted to WOFF/WOFF2.'
					: 'Distributed exactly as published: the license does not allow derivatives. Only converted to WOFF/WOFF2.'
			);
			return out;
		}
		const remapped = family.styles.find((s) => s.legacyLayout)?.legacyLayout;
		if (remapped)
			out.push(
				`Remapped from the pre-Unicode ${remapped === 'typewriter' ? 'typewriter (A_ font)' : 'phonetic'} encoding to Unicode Thaana, so it works with any Dhivehi keyboard and on the web.`
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
				// The first release only when it differs from this one.
				[
					'First released',
					family.firstYear && family.firstYear !== family.versionYear ? String(family.firstYear) : null
				],
				['Release date', family.versionYear ? String(family.versionYear) : null],
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

	const glyphSets = $derived(glyphGroups(family.chars, family.keyGlyphs, symbols));
</script>

<svelte:head>
	<title>{family.name} — fonts.mv</title>
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
			<p class="mt-1 text-muted-foreground"><CreditLine {family} /></p>
			{#if !authors(family).length}
				<p class="mt-1 text-sm text-pretty text-muted-foreground">
					We don't know who designed {family.name}. If you do,
					<a
						class="underline underline-offset-4 hover:text-foreground"
						href="mailto:{CONTACT_EMAIL}?subject={encodeURIComponent(`fonts.mv: who designed ${family.name}?`)}"
						>email us</a
					> and we'll credit them.
				</p>
			{/if}
			<div class="mt-3 flex flex-wrap items-center gap-2">
				<Badge variant="secondary">{category}</Badge>
				<Badge variant="outline">{family.license}</Badge>
				<span class="text-sm text-muted-foreground"
					>{family.styles.length}
					{family.styles.length === 1
						? 'style'
						: 'styles'}{#if family.firstYear && family.firstYear !== family.versionYear}{' · '}first released {family.firstYear}{/if}{#if family.versionYear}{' · '}released
						{family.versionYear}{/if}</span
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
		<Card.Header class="flex flex-wrap items-center justify-between gap-x-1 gap-y-2 px-4 sm:px-10">
			{#if family.styles.length > 1}
				<Select.Root type="single" bind:value={weightChoice}>
					<Select.Trigger class="w-36 shrink-0 sm:w-44" aria-label="Preview weight"
						>{WEIGHT_NAMES[shown.weight]} {shown.weight}</Select.Trigger
					>
					<Select.Content>
						{#each family.styles as style (style.weight)}
							{@const label = `${WEIGHT_NAMES[style.weight]} ${style.weight}`}
							<Select.Item value={String(style.weight)} {label}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{:else}
				<Card.Description>{WEIGHT_NAMES[shown.weight]} {shown.weight}</Card.Description>
			{/if}
			<div class="flex shrink-0">
				{#each Object.keys(shown.sizes).filter((k) => k !== 'woff') as kind (kind)}
					<Button
						href="{fontUrl(family, shown.weight, kind)}?download={encodeURIComponent(
							`${family.name.replace(/\s+/g, '')}-${WEIGHT_NAMES[shown.weight]}.${kind}`
						)}"
						variant="ghost"
						size="sm"
						class="px-1.5 sm:px-3"
						aria-label="Download {family.name} {WEIGHT_NAMES[shown.weight]} as {kind.toUpperCase()}"
					>
						<DownloadIcon />
						{kind.toUpperCase()}
					</Button>
				{/each}
			</div>
		</Card.Header>
		<Card.Content class="px-4 sm:px-10 sm:pb-4">
			<FontPreview {family} weight={shown.weight} size={Math.max(tester.size, 48)} />
		</Card.Content>
	</Card.Root>

	<section class="mt-10">
		<h2 class="mb-1 text-xl font-semibold tracking-tight">Try it in a layout</h2>
		<p class="mb-4 text-sm text-muted-foreground">
			Edit the text and pick a block to change its style, size, weight, alignment and colours.
		</p>
		<RichTester {family} />
	</section>

	<section class="mt-10">
		<h2 class="mb-4 text-xl font-semibold tracking-tight">Glyphs</h2>
		{#each glyphSets as set (set.title)}
			<h3 class="mt-6 mb-2 text-sm font-medium text-muted-foreground">{set.title}</h3>
			{#if set.cells.some((c) => c.wide)}
				<!-- Calligraphy and emblems: each tile grows to fit its drawing. -->
				<div class="flex flex-wrap gap-2">
					{#each set.cells as cell (cell.text)}
						<Card.Root size="sm" class="max-w-full min-w-24 gap-1 rounded-xl py-3 sm:min-w-32">
							<Card.Content
								class="flex items-center justify-center overflow-hidden px-4 text-4xl leading-[1.6] sm:px-5 sm:text-6xl"
								dir="rtl"
								style="font-family: '{previewFamily(family)}', sans-serif; font-weight: {main.weight}"
							>
								{cell.text}
							</Card.Content>
							{#if cell.label}
								<Card.Footer class="justify-center px-0 text-xs text-muted-foreground">
									<span>key <Kbd>{cell.label}</Kbd></span>
								</Card.Footer>
							{/if}
						</Card.Root>
					{/each}
				</div>
			{:else}
				<div
					class="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] sm:gap-2"
				>
					{#each set.cells as cell (cell.text)}
						<Card.Root size="sm" class="aspect-square justify-center rounded-md py-0 sm:rounded-xl">
							<Card.Content
								class="flex items-center justify-center px-0 text-2xl sm:text-4xl"
								dir="rtl"
								style="font-family: '{previewFamily(family)}', sans-serif; font-weight: {main.weight}"
							>
								{cell.text}
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}
		{/each}
	</section>

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
							<ToggleGroup.Item value={String(style.weight)} class={cn('px-3', toggleOn)}
								>{style.weight}</ToggleGroup.Item
							>
						{/each}
					</ToggleGroup.Root>
				{/if}
				{#if canNormalize}
					<div class="flex items-center gap-2">
						<Switch id="embed-normalize" bind:checked={normalize} />
						<Label for="embed-normalize" class="font-normal text-muted-foreground">
							Same size as Faruma (scales this font {Math.round((main.sizeAdjust ?? 1) * 100)}%)
						</Label>
					</div>
				{/if}
				{#if canThaanaOnly}
					<div class="flex items-center gap-2">
						<Switch id="embed-thaana-only" bind:checked={thaanaOnly} />
						<Label for="embed-thaana-only" class="font-normal text-muted-foreground">
							Thaana only (Latin letters, digits and spaces use the next font)
						</Label>
					</div>
				{/if}
				<CodeBlock title="In <head>" lang="html" code={linkSnippet} />
				<CodeBlock title="Or in CSS" lang="css" code={importSnippet} />
				<CodeBlock title="Then use" lang="css" code={cssSnippet} />
				<CodeBlock title="Or host the files yourself" lang="javascript" code={ownSnippet} />
				<p class="text-sm text-muted-foreground">
					Download the WOFF2 files above and the packages load them from your server, with nothing from fonts.mv. More
					in the <a class="underline underline-offset-4" href="/docs#own-files">docs</a>.
				</p>
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
											class="h-auto p-0 text-left align-top break-words whitespace-normal has-[>svg]:px-0"
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
					<Alert.Title>What fonts.mv changed</Alert.Title>
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
