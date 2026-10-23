<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import KeyboardIcon from '@lucide/svelte/icons/keyboard';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import { tester } from '#lib/tester.svelte.js';
	import { resolveDirection } from '@yashau/thaana';
	import { thaanaKeyboard } from '#lib/thaana.js';

	let { extra }: { extra?: Snippet } = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (!inputEl) return;
		return thaanaKeyboard(inputEl, () => tester.dv).destroy;
	});

	// Same rule as the previews: RTL when typing Thaana (or about to), LTR only
	// for pure Latin. Explicit, not unicode-bidi: plaintext, which would flip
	// "Apple ގެ …" left-to-right because its first letter is Latin.
	const dir = $derived(resolveDirection(tester.text, null, tester.dv ? 'rtl' : 'ltr'));

	$effect(() => {
		void tester.size;
		void tester.dv;
		tester.persist();
	});
</script>

<Card.Root size="sm" class="py-3">
	<Card.Content class="flex flex-col gap-3 px-3 lg:flex-row lg:items-center">
		<InputGroup.Root class="min-w-0 flex-1">
			<!-- A flush, full-height segment at the start of the field (the ypad pattern). -->
			<InputGroup.Addon class="self-stretch p-0 has-[>button]:ml-0">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button
								{...props}
								variant="ghost"
								class="h-full w-16 rounded-none rounded-l-[calc(var(--radius-md)-1px)] border-0 border-r border-r-input bg-muted/50 font-medium tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-muted/40"
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
			</InputGroup.Addon>
			<InputGroup.Input
				bind:ref={inputEl}
				bind:value={tester.text}
				{dir}
				lang={tester.dv ? 'dv' : undefined}
				placeholder={tester.dv ? 'އަކުރުތައް ލިޔެ ބައްލަވާ…' : 'Type to preview…'}
				class="text-base"
				autocomplete="off"
				autocapitalize="none"
				spellcheck={false}
				{...{ autocorrect: 'off' }}
				aria-label="Preview text"
			/>
			{#if tester.text}
				<InputGroup.Addon align="inline-end">
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
				</InputGroup.Addon>
			{/if}
		</InputGroup.Root>
		<div class="flex items-center gap-3 lg:w-64">
			<span class="w-12 shrink-0 text-right text-sm text-muted-foreground tabular-nums">{tester.size}px</span>
			<Slider
				type="single"
				bind:value={tester.size}
				onValueChange={() => (tester.sizeChosen = true)}
				min={12}
				max={128}
				step={1}
				aria-label="Preview size"
			/>
		</div>
		{@render extra?.()}
	</Card.Content>
</Card.Root>
