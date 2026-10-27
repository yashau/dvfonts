<script lang="ts" module>
	export type Sort = 'featured' | 'name' | 'styles' | 'newest' | 'oldest';
	export const SORT_LABELS: Record<Sort, string> = {
		featured: 'Featured',
		name: 'Name',
		styles: 'Number of styles',
		newest: 'Newest first',
		oldest: 'Oldest first'
	};
</script>

<script lang="ts">
	import { CATEGORIES, DEFAULT_CATEGORIES, type Category } from '#lib/catalog.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import TesterSize from '#lib/components/tester-size.svelte';
	import AuthorCombobox from '#lib/components/author-combobox.svelte';
	import KeyboardIcon from '@lucide/svelte/icons/keyboard';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import { tester } from '#lib/tester.svelte.js';
	import { resolveDirection } from '@yashau/thaana';
	import { thaanaKeyboard } from '@yashau/thaana-svelte';

	// The browse page's controls, Google Fonts style: what to preview, how big,
	// which categories and in what order. A sticky sidebar on wide screens, a sheet on small ones.
	let {
		categories = $bindable(),
		sort = $bindable(),
		author = $bindable(),
		authors,
		counts,
		shown
	}: {
		categories: Category[];
		sort: Sort;
		author: string | null;
		authors: { name: string; count: number }[];
		counts: Record<string, number>;
		shown: number;
	} = $props();

	const dir = $derived(resolveDirection(tester.text, null, tester.dv ? 'rtl' : 'ltr'));

	$effect(() => {
		void tester.size;
		void tester.dv;
		void tester.normalize;
		tester.persist();
	});

	const isDefault = $derived(
		!tester.text &&
			tester.normalize &&
			!tester.sizeChosen &&
			sort === 'featured' &&
			author === null &&
			categories.length === DEFAULT_CATEGORIES.length &&
			DEFAULT_CATEGORIES.every((c) => categories.includes(c))
	);

	function resetAll() {
		tester.text = '';
		tester.normalize = true;
		tester.resetSize();
		categories = [...DEFAULT_CATEGORIES];
		sort = 'featured';
		author = null;
	}
</script>

<div class="flex flex-col gap-6">
	<section class="flex flex-col gap-3">
		<div class="flex items-center justify-between gap-2">
			<h2 class="text-sm font-medium">Preview</h2>
			<Button variant="ghost" size="sm" onclick={resetAll} disabled={isDefault}>
				<RotateCcwIcon /> Reset all
			</Button>
		</div>
		<InputGroup.Root>
			<InputGroup.Textarea
				{@attach thaanaKeyboard({ enabled: tester.dv, setAttributes: false, autoDirection: false })}
				bind:value={tester.text}
				{dir}
				lang={tester.dv ? 'dv' : undefined}
				rows={4}
				placeholder={tester.dv ? 'އަކުރުތައް ލިޔެ ބައްލަވާ…' : 'Type to preview…'}
				class="min-h-28 resize-none text-base"
				autocomplete="off"
				autocapitalize="none"
				spellcheck={false}
				{...{ autocorrect: 'off' }}
				aria-label="Preview text"
			/>
			<InputGroup.Addon align="block-end" class="justify-between border-t">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button
								{...props}
								variant="secondary"
								class="font-medium tracking-wide"
								aria-label="Dhivehi phonetic keyboard"
								aria-pressed={tester.dv}
								onclick={() => (tester.dv = !tester.dv)}
							>
								<KeyboardIcon />
								{tester.dv ? 'DV' : 'EN'}
							</InputGroup.Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="bottom" align="start" class="max-w-64">
						{tester.dv
							? 'Typing Thaana with the Divehi Phonetic layout. Click to use your own keyboard.'
							: 'Typing with your own keyboard. Click to type Thaana with the Divehi Phonetic layout.'}
					</Tooltip.Content>
				</Tooltip.Root>
				{#if tester.text}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button
									{...props}
									size="icon-xs"
									onclick={() => (tester.text = '')}
									aria-label="Reset preview text"
								>
									<RotateCcwIcon />
								</InputGroup.Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>Back to the sample sentences</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</InputGroup.Addon>
		</InputGroup.Root>
		<TesterSize />
	</section>

	<Separator />

	<section class="flex flex-col gap-3">
		<div class="flex items-baseline justify-between gap-2">
			<h2 class="text-sm font-medium">Categories</h2>
			<span class="text-sm text-muted-foreground tabular-nums">{shown} families</span>
		</div>
		<ToggleGroup.Root
			type="multiple"
			variant="outline"
			orientation="vertical"
			spacing={1}
			bind:value={categories}
			class="w-full flex-col items-stretch"
			aria-label="Categories"
		>
			{#each CATEGORIES.filter((c) => counts[c.id] > 0) as c (c.id)}
				<ToggleGroup.Item value={c.id} class="w-full justify-between px-3">
					{c.label}
					<span class="text-xs text-muted-foreground tabular-nums">{counts[c.id]}</span>
				</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</section>

	<Separator />

	<section class="flex flex-col gap-3">
		<!-- An author shows all their families, whatever the categories, like a search. -->
		<h2 class="text-sm font-medium">Author</h2>
		<AuthorCombobox bind:value={author} {authors} />
	</section>

	<Separator />

	<section class="flex flex-col gap-3">
		<h2 class="text-sm font-medium">Sort</h2>
		<Select.Root type="single" bind:value={sort}>
			<Select.Trigger class="w-full" aria-label="Sort">{SORT_LABELS[sort]}</Select.Trigger>
			<Select.Content>
				{#each Object.entries(SORT_LABELS) as [value, label] (value)}
					<Select.Item {value} {label}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</section>
</div>
