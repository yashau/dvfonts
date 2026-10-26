<script lang="ts">
	// A small layout to try a family in, like Google Fonts' specimen tester: a
	// stack of editable blocks, each with its own style (size, weight, alignment,
	// line spacing, colours). Formatting applies per block, not to selections.
	import { WEIGHT_NAMES, previewLineHeight, type Family } from '#lib/catalog.js';
	import { previewFamily } from '#lib/fonts.js';
	import { PANGRAMS, thaanaKeyboard } from '#lib/thaana.js';
	import { tester } from '#lib/tester.svelte.js';
	import { resolveDirection } from '@yashau/thaana';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as ButtonGroup from '#lib/components/ui/button-group/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import AlignRightIcon from '@lucide/svelte/icons/text-align-end';
	import AlignCenterIcon from '@lucide/svelte/icons/text-align-center';
	import AlignLeftIcon from '@lucide/svelte/icons/text-align-start';
	import AlignJustifyIcon from '@lucide/svelte/icons/text-align-justify';
	import BaselineIcon from '@lucide/svelte/icons/baseline';
	import HighlighterIcon from '@lucide/svelte/icons/highlighter';
	import ListChevronsUpDownIcon from '@lucide/svelte/icons/list-chevrons-up-down';

	import { tick } from 'svelte';

	let { family }: { family: Family } = $props();

	type Kind = 'heading' | 'subheading' | 'paragraph';
	type Align = 'start' | 'center' | 'end' | 'justify';
	interface Block {
		id: number;
		kind: Kind;
		text: string;
		size: number;
		weight: number;
		align: Align;
		leading: number | null;
		color: string;
		highlight: string;
	}

	const KINDS: Record<Kind, { label: string; size: number; leading: number | null }> = {
		heading: { label: 'Heading', size: 40, leading: null },
		subheading: { label: 'Subheading', size: 28, leading: null },
		paragraph: { label: 'Paragraph', size: 18, leading: null }
	};
	// Fixed hues at a mid lightness, so they read on both light and dark backgrounds.
	const HUES = [
		{ label: 'Red', l: 0.62, c: 0.2, h: 25 },
		{ label: 'Orange', l: 0.7, c: 0.16, h: 55 },
		{ label: 'Green', l: 0.62, c: 0.15, h: 150 },
		{ label: 'Teal', l: 0.62, c: 0.11, h: 195 },
		{ label: 'Blue', l: 0.6, c: 0.16, h: 255 },
		{ label: 'Purple', l: 0.6, c: 0.19, h: 300 }
	];
	const COLORS = [
		{ id: '', label: 'Default' },
		{ id: 'var(--color-muted-foreground)', label: 'Grey' },
		...HUES.map((c) => ({ id: `oklch(${c.l} ${c.c} ${c.h})`, label: c.label }))
	];
	const HIGHLIGHTS = [
		{ id: '', label: 'None' },
		{ id: 'var(--color-muted)', label: 'Grey' },
		...HUES.map((c) => ({ id: `oklch(${c.l} ${c.c} ${c.h} / 0.22)`, label: c.label }))
	];
	const LEADINGS: (number | null)[] = [null, 1.4, 1.6, 1.8, 2, 2.4];

	const weights = $derived(family.styles.map((s) => s.weight));
	const regular = $derived(weights.reduce((a, b) => (Math.abs(b - 400) < Math.abs(a - 400) ? b : a)));
	const boldest = $derived(Math.max(...weights));

	// Sample text from the pangrams: the first clause of one as a heading, then more.
	const clause = (p: string) => p.split('،')[0];
	let nextId = 0;
	function block(kind: Kind, text: string, weight: number): Block {
		const k = KINDS[kind];
		return {
			id: nextId++,
			kind,
			text,
			size: k.size,
			weight,
			align: 'start',
			leading: k.leading,
			color: '',
			highlight: ''
		};
	}
	let blocks = $state<Block[]>([]);
	let activeId = $state(0);
	$effect.pre(() => {
		if (blocks.length) return;
		blocks = [
			block('heading', clause(PANGRAMS[0]), boldest),
			block('subheading', clause(PANGRAMS[2]), regular),
			block('paragraph', `${PANGRAMS[3]} ${PANGRAMS[4]}`, regular)
		];
		activeId = blocks[0].id;
	});
	const active = $derived(blocks.find((b) => b.id === activeId) ?? blocks[0]);

	function setKind(kind: Kind) {
		if (!active) return;
		active.kind = kind;
		active.size = KINDS[kind].size;
		active.weight = kind === 'heading' ? boldest : regular;
	}
	async function add() {
		const b = block('paragraph', '', regular);
		blocks.push(b);
		activeId = b.id;
		await tick();
		document.querySelector<HTMLTextAreaElement>(`[data-block="${b.id}"]`)?.focus();
	}
	function remove(id: number) {
		blocks = blocks.filter((b) => b.id !== id);
		if (activeId === id && blocks.length) activeId = blocks.at(-1)!.id;
	}

	const style = $derived(family.styles.find((s) => s.weight === active?.weight) ?? family.styles[0]);
	const normalized = (weight: number) => {
		const s = family.styles.find((st) => st.weight === weight);
		return tester.normalize && !!s?.sizeAdjust;
	};
	function lineHeight(b: Block) {
		if (b.leading) return b.leading;
		const s = family.styles.find((st) => st.weight === b.weight);
		return previewLineHeight(s, normalized(b.weight) ? (s?.sizeAdjust ?? 1) : 1);
	}

	/** Grow each block with its text. */
	function autosize(el: HTMLTextAreaElement) {
		const fit = () => {
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`;
		};
		fit();
		el.addEventListener('input', fit);
		const ro = new ResizeObserver(fit);
		ro.observe(el);
		return () => {
			el.removeEventListener('input', fit);
			ro.disconnect();
		};
	}
</script>

<Card.Root class="gap-0 py-0">
	<!-- Toolbar for the selected block. -->
	{#if active}
		<div class="flex flex-wrap items-center gap-2 border-b px-3 py-2">
			<Select.Root type="single" value={active.kind} onValueChange={(v) => v && setKind(v as Kind)}>
				<Select.Trigger size="sm" class="w-36" aria-label="Text style">{KINDS[active.kind].label}</Select.Trigger>
				<Select.Content>
					{#each Object.entries(KINDS) as [id, k] (id)}
						<Select.Item value={id} label={k.label}>{k.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<ButtonGroup.Root aria-label="Size">
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Smaller"
					onclick={() => (active.size = Math.max(10, active.size - 2))}><MinusIcon /></Button
				>
				<ButtonGroup.Text class="h-8 w-16 justify-center text-sm tabular-nums">{active.size}px</ButtonGroup.Text>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Bigger"
					onclick={() => (active.size = Math.min(160, active.size + 2))}><PlusIcon /></Button
				>
			</ButtonGroup.Root>

			{#if weights.length > 1}
				<Select.Root
					type="single"
					value={String(active.weight)}
					onValueChange={(v) => v && (active.weight = Number(v))}
				>
					<Select.Trigger size="sm" class="w-36" aria-label="Weight"
						>{WEIGHT_NAMES[active.weight]} {active.weight}</Select.Trigger
					>
					<Select.Content>
						{#each weights as w (w)}
							<Select.Item value={String(w)} label="{WEIGHT_NAMES[w]} {w}">{WEIGHT_NAMES[w]} {w}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}

			<ToggleGroup.Root
				type="single"
				variant="outline"
				size="sm"
				value={active.align}
				onValueChange={(v) => v && (active.align = v as Align)}
				aria-label="Alignment"
			>
				<!-- Thaana reads right to left: "start" is the right edge. -->
				<ToggleGroup.Item value="start" aria-label="Align to start (right)"><AlignRightIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="center" aria-label="Centre"><AlignCenterIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="end" aria-label="Align to end (left)"><AlignLeftIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="justify" aria-label="Justify"><AlignJustifyIcon /></ToggleGroup.Item>
			</ToggleGroup.Root>

			<DropdownMenu.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props: tip })}
							<DropdownMenu.Trigger {...tip}>
								{#snippet child({ props })}
									<Button {...props} variant="outline" size="icon-sm" aria-label="Line spacing"
										><ListChevronsUpDownIcon /></Button
									>
								{/snippet}
							</DropdownMenu.Trigger>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Line spacing</Tooltip.Content>
				</Tooltip.Root>
				<DropdownMenu.Content>
					<DropdownMenu.RadioGroup
						value={String(active.leading ?? 'auto')}
						onValueChange={(v) => (active.leading = v === 'auto' ? null : Number(v))}
					>
						{#each LEADINGS as l (l)}
							<DropdownMenu.RadioItem value={String(l ?? 'auto')} closeOnSelect
								>{l ?? 'Auto (fits the font)'}</DropdownMenu.RadioItem
							>
						{/each}
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#each [{ key: 'color', label: 'Text colour', icon: BaselineIcon, options: COLORS }, { key: 'highlight', label: 'Highlight', icon: HighlighterIcon, options: HIGHLIGHTS }] as const as menu (menu.key)}
				<DropdownMenu.Root>
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props: tip })}
								<DropdownMenu.Trigger {...tip}>
									{#snippet child({ props })}
										<Button {...props} variant="outline" size="icon-sm" aria-label={menu.label}>
											<menu.icon
												style="color: {menu.key === 'color' ? active.color || 'currentColor' : 'currentColor'}"
											/>
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>{menu.label}</Tooltip.Content>
					</Tooltip.Root>
					<DropdownMenu.Content>
						<DropdownMenu.RadioGroup value={active[menu.key]} onValueChange={(v) => (active[menu.key] = v)}>
							{#each menu.options as o (o.id)}
								<DropdownMenu.RadioItem value={o.id} closeOnSelect>
									<span
										class="size-3.5 rounded-full border"
										style="background: {o.id || (menu.key === 'color' ? 'var(--color-foreground)' : 'transparent')}"
									></span>
									{o.label}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/each}

			<Separator orientation="vertical" class="mx-1 h-6" />
			<Button variant="ghost" size="sm" onclick={add}><PlusIcon /> Add text</Button>
		</div>
	{/if}

	<Card.Content class="flex flex-col gap-2 p-3 sm:p-6">
		{#each blocks as b (b.id)}
			{@const isActive = b.id === activeId}
			{@const dir = resolveDirection(b.text, null, tester.dv ? 'rtl' : 'ltr')}
			<!-- dir on the wrapper puts the selection bar at the start of the text (the
			     right for Thaana) and the remove button at its end. -->
			<div
				{dir}
				class="group relative border-s-4 ps-3 pe-8 transition-colors {isActive
					? 'border-s-primary'
					: 'border-s-transparent hover:border-s-border'}"
				style:background={b.highlight || undefined}
			>
				<Textarea
					bind:value={b.text}
					rows={1}
					{dir}
					lang={tester.dv ? 'dv' : undefined}
					aria-label="{KINDS[b.kind].label} text"
					data-block={b.id}
					spellcheck={false}
					onfocus={() => (activeId = b.id)}
					class="min-h-0 resize-none overflow-hidden rounded-none border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
					style="font-family: '{previewFamily(
						family,
						normalized(b.weight)
					)}', 'dv-ui', sans-serif; font-weight: {b.weight}; font-size: {b.size}px; line-height: {lineHeight(
						b
					)}; text-align: {b.align}; color: {b.color || 'inherit'}"
					{@attach (el: HTMLTextAreaElement) => thaanaKeyboard(el, () => tester.dv).destroy}
					{@attach autosize}
				/>
				{#if blocks.length > 1}
					<Button
						variant="ghost"
						size="icon-xs"
						class="absolute end-0 top-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 {isActive
							? 'opacity-100'
							: ''}"
						aria-label="Remove this text"
						onclick={() => remove(b.id)}><XIcon /></Button
					>
				{/if}
			</div>
		{/each}
	</Card.Content>
</Card.Root>
