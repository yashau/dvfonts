<script lang="ts">
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import EqualIcon from '@lucide/svelte/icons/equal';
	import EqualNotIcon from '@lucide/svelte/icons/equal-not';
	import { tester } from '#lib/tester.svelte.js';
	import { cn } from '#lib/utils.js';

	let { class: className }: { class?: string } = $props();

	// The registry Slider puts role="slider" on its thumb and passes no label to it, so name
	// the thumb here (screen readers and agents read the thumb, not the wrapper).
	let slider = $state<HTMLElement | null>(null);
	$effect(() => {
		slider?.querySelector('[role="slider"]')?.setAttribute('aria-label', 'Preview size');
	});

	const PRESETS = [12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];

	function choose(size: number) {
		tester.size = size;
		tester.sizeChosen = true;
	}
</script>

<!-- Preview size: preset sizes, a slider for anything between, and the same-size toggle.
     Invisible (space kept) until saved settings are read, so nothing jumps on load. -->
<div class={cn('flex items-center gap-2', className)} class:invisible={!tester.ready}>
	<Select.Root type="single" value={String(tester.size)} onValueChange={(v) => v && choose(Number(v))}>
		<Select.Trigger size="sm" class="w-20 shrink-0 tabular-nums" aria-label="Preview size presets"
			>{tester.size}px</Select.Trigger
		>
		<Select.Content>
			{#each PRESETS as size (size)}
				<Select.Item value={String(size)} label="{size}px" class="tabular-nums">{size}px</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Slider
		bind:ref={slider}
		type="single"
		bind:value={tester.size}
		onValueChange={() => (tester.sizeChosen = true)}
		min={12}
		max={128}
		step={1}
		class="mx-1"
		aria-label="Preview size"
	/>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Toggle
					{...props}
					variant="outline"
					size="sm"
					bind:pressed={tester.normalize}
					aria-label="Same size for every font"
				>
					<!-- = when every font is scaled to Faruma's size, ≠ when each keeps its own. -->
					{#if tester.normalize}<EqualIcon />{:else}<EqualNotIcon />{/if}
				</Toggle>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content class="max-w-64">
			{tester.normalize
				? "Same size: every font is scaled so its letters look as big as Faruma's. Click to show each at its own size."
				: "Each font at its own size. Click to scale them so their letters look as big as Faruma's."}
		</Tooltip.Content>
	</Tooltip.Root>
</div>
