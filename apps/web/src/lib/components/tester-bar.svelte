<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
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

<div class="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs lg:flex-row lg:items-center">
	<div class="flex min-w-0 flex-1 items-center gap-2">
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
					ދިވެހި turns Latin keys into Thaana using the Divehi Phonetic layout (h→ހ, a→ަ, …). Pick EN to use your own
					keyboard as-is.
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<Input
			bind:ref={inputEl}
			bind:value={tester.text}
			{dir}
			lang={tester.dv ? 'dv' : undefined}
			placeholder={tester.dv ? 'އަކުރުތައް ލިޔެ ބައްލަވާ…' : 'Type to preview…'}
			class="h-9 min-w-0 flex-1 text-base [unicode-bidi:plaintext]"
			autocomplete="off"
			autocapitalize="none"
			spellcheck={false}
			{...{ autocorrect: 'off' }}
			aria-label="Preview text"
		/>
		{#if tester.text}
			<Button variant="ghost" size="icon-sm" onclick={() => (tester.text = '')} aria-label="Reset preview text">
				<RotateCcwIcon />
			</Button>
		{/if}
	</div>
	<div class="flex items-center gap-3 lg:w-64">
		<span class="w-12 shrink-0 text-right text-sm text-muted-foreground tabular-nums">{tester.size}px</span>
		<Slider type="single" bind:value={tester.size} min={12} max={128} step={1} aria-label="Preview size" />
	</div>
	{@render extra?.()}
</div>
