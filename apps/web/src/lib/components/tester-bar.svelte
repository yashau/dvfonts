<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import { tester } from '#lib/tester.svelte.js';
	import { thaanaKeyboard, hasThaana } from '#lib/thaana.js';

	let { extra }: { extra?: Snippet } = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (!inputEl) return;
		return thaanaKeyboard(inputEl, () => tester.dv).destroy;
	});

	// RTL while typing Thaana (or about to); otherwise follow the text.
	const dir = $derived(tester.dv || hasThaana(tester.text) ? 'rtl' : 'auto');

	$effect(() => {
		void tester.size;
		void tester.dv;
		tester.persist();
	});
</script>

<Card.Root size="sm" class="py-3">
	<Card.Content class="flex flex-col gap-3 px-3 lg:flex-row lg:items-center">
		<InputGroup.Root class="min-w-0 flex-1">
			<InputGroup.Addon>
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<ToggleGroup.Root
									{...props}
									type="single"
									variant="outline"
									size="sm"
									value={tester.dv ? 'dv' : 'en'}
									onValueChange={(v) => {
										if (v) tester.dv = v === 'dv';
									}}
									aria-label="Keyboard"
								>
									<ToggleGroup.Item value="dv" aria-label="Dhivehi phonetic keyboard" class="px-2.5" lang="dv"
										>ދިވެހި</ToggleGroup.Item
									>
									<ToggleGroup.Item value="en" aria-label="Your system keyboard" class="px-2.5">EN</ToggleGroup.Item>
								</ToggleGroup.Root>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content class="max-w-64">
							ދިވެހި turns Latin keys into Thaana using the Divehi Phonetic layout (h→ހ, a→ަ, …). Pick EN to use your
							own keyboard as-is.
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</InputGroup.Addon>
			<InputGroup.Input
				bind:ref={inputEl}
				bind:value={tester.text}
				{dir}
				lang={tester.dv ? 'dv' : undefined}
				placeholder={tester.dv ? 'އަކުރުތައް ލިޔެ ބައްލަވާ…' : 'Type to preview…'}
				class="text-base [unicode-bidi:plaintext]"
				autocomplete="off"
				autocapitalize="none"
				spellcheck={false}
				{...{ autocorrect: 'off' }}
				aria-label="Preview text"
			/>
			{#if tester.text}
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs" onclick={() => (tester.text = '')} aria-label="Reset preview text">
						<RotateCcwIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			{/if}
		</InputGroup.Root>
		<div class="flex items-center gap-3 lg:w-64">
			<span class="w-12 shrink-0 text-right text-sm text-muted-foreground tabular-nums">{tester.size}px</span>
			<Slider type="single" bind:value={tester.size} min={12} max={128} step={1} aria-label="Preview size" />
		</div>
		{@render extra?.()}
	</Card.Content>
</Card.Root>
