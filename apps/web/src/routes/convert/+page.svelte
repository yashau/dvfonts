<script lang="ts">
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { convertLegacy, repairPdfText, normalizePunctuation, stripBidiControls } from '@yashau/thaana';
	import { registerFamily } from '#lib/fonts.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import CopyButton from '#lib/components/copy-button.svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import EraserIcon from '@lucide/svelte/icons/eraser';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CodeIcon from '@lucide/svelte/icons/code';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	$effect(() => registerFamily(data.faruma));

	type Mode = 'typewriter' | 'phonetic' | 'pdf';
	const modes: { id: Mode; label: string; hint: string; example: string }[] = [
		{
			id: 'typewriter',
			label: 'A_ fonts',
			hint: 'Typed in A_Waheed, A_Faseyha, A_Randhoo and the other A_ fonts. Without the font it shows as Latin letters.',
			example: 'cswb ihevid'
		},
		{
			id: 'phonetic',
			label: 'Phonetic fonts',
			hint: 'Typed in the older casual fonts: Thaana, Akko, Athu Casual, Avas Thaana and similar.',
			example: 'qsab ihevid'
		},
		{
			id: 'pdf',
			label: 'PDF text',
			hint: 'Copied out of a PDF: fixes reversed dates and times, stray spaces and jumped list numbers.',
			example: 'ތާރީޚް 2026/1/14 ، ހެނދުނު 00:9 ގައި'
		}
	];

	let mode = $state<Mode>('typewriter');
	// Each tab keeps its own text: switching tabs must never run one kind of text
	// through another tab's converter.
	const inputs = $state<Record<Mode, string>>({ typewriter: '', phonetic: '', pdf: '' });
	let tidy = $state(true);

	const current = $derived(modes.find((m) => m.id === mode)!);
	const output = $derived.by(() => {
		const text = stripBidiControls(inputs[mode]);
		if (!text) return '';
		const converted = mode === 'pdf' ? repairPdfText(text) : convertLegacy(text, { layout: mode });
		return tidy ? normalizePunctuation(converted) : converted;
	});
</script>

<svelte:head>
	<title>Convert old Thaana text — fonts.mv</title>
	<meta
		name="description"
		content="Turn text typed in old A_ fonts, or copied out of PDFs, into proper Unicode Thaana."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
	<div class="max-w-2xl">
		<h1 class="text-3xl font-semibold tracking-tight">Convert old Thaana text</h1>
		<p class="mt-2 text-muted-foreground">
			Paste text from an old document or a PDF and get proper Unicode Thaana you can use anywhere. Everything runs in
			your browser; nothing is uploaded. To open an old document as it is, install the original fonts from the
			<a class="underline underline-offset-4" href="/downloads/fonts-mv-legacy.zip" download>legacy bundle</a>.
		</p>
	</div>

	<Tabs.Root
		value={mode}
		onValueChange={(v) => {
			if (v) mode = v as Mode;
		}}
		class="mt-8"
	>
		<Tabs.List aria-label="Where the text came from" class="w-full sm:w-fit">
			{#each modes as m (m.id)}
				<Tabs.Trigger value={m.id} class="flex-1 sm:flex-none">{m.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>
	<p class="mt-3 text-sm text-muted-foreground">{current.hint}</p>

	<div class="mt-4 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
		<Card.Root class="min-w-0">
			<Card.Header>
				<Card.Title>
					<Label for="convert-in">Paste here</Label>
				</Card.Title>
				<Card.Description class="line-clamp-1">The text as it is now.</Card.Description>
				<Card.Action class="flex gap-1">
					<Button variant="outline" size="sm" onclick={() => (inputs[mode] = current.example)}>
						<SparklesIcon /> Example
					</Button>
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon-sm"
									onclick={() => (inputs[mode] = '')}
									disabled={!inputs[mode]}
									aria-label="Clear"
								>
									<EraserIcon />
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>Clear</Tooltip.Content>
					</Tooltip.Root>
				</Card.Action>
			</Card.Header>
			<Card.Content class="flex-1">
				<Textarea
					id="convert-in"
					bind:value={inputs[mode]}
					dir={mode === 'pdf' ? 'rtl' : 'ltr'}
					spellcheck={false}
					placeholder={current.example}
					class="max-h-[32rem] min-h-64 resize-none font-mono text-base"
				/>
			</Card.Content>
		</Card.Root>

		<div class="flex items-center justify-center text-muted-foreground" aria-hidden="true">
			<ArrowRightIcon class="hidden size-5 lg:block" />
			<ArrowDownIcon class="size-5 lg:hidden" />
		</div>

		<Card.Root class="min-w-0">
			<Card.Header>
				<Card.Title>
					<Label for="convert-out">Unicode Thaana</Label>
				</Card.Title>
				<Card.Description class="line-clamp-1">Ready to paste anywhere.</Card.Description>
				<Card.Action>
					<CopyButton text={output} />
				</Card.Action>
			</Card.Header>
			<Card.Content class="flex-1">
				<Textarea
					id="convert-out"
					value={output}
					readonly
					dir="rtl"
					lang="dv"
					placeholder="ދިވެހި"
					class="max-h-[32rem] min-h-64 resize-none text-xl"
					style="font-family: 'dv-faruma', 'dv-ui', system-ui, sans-serif; line-height: 1.75"
				/>
			</Card.Content>
			<Card.Footer class="gap-2">
				<Switch id="tidy" bind:checked={tidy} />
				<Label for="tidy" class="font-normal text-muted-foreground">Also fix punctuation and spacing</Label>
			</Card.Footer>
		</Card.Root>
	</div>

	<Item.Root variant="outline" class="mt-6">
		<Item.Media variant="icon"><CodeIcon /></Item.Media>
		<Item.Content class="min-w-48">
			<Item.Title>Use it in code</Item.Title>
			<Item.Description class="line-clamp-none">
				<code>convertLegacy(text)</code> and <code>repairPdfText(text)</code> from <code>@yashau/thaana</code>.
			</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button href="/docs#helpers" variant="outline" size="sm">Helpers <ArrowRightIcon /></Button>
		</Item.Actions>
	</Item.Root>
</div>
