<script lang="ts">
	import { tick } from 'svelte';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	// shadcn-svelte's combobox (Popover + Command): pick one author, or any. The trigger takes
	// the Select trigger's look so it matches the Sort dropdown beside it.
	let { value = $bindable(), authors }: { value: string | null; authors: { name: string; count: number }[] } = $props();

	let open = $state(false);
	let trigger = $state<HTMLButtonElement | null>(null);

	function choose(name: string | null) {
		value = name;
		open = false;
		tick().then(() => trigger?.focus());
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={trigger}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-full justify-between border-input bg-transparent font-normal hover:bg-transparent aria-expanded:bg-transparent dark:bg-input/30 dark:hover:bg-input/50 dark:aria-expanded:bg-input/50"
				role="combobox"
				aria-expanded={open}
				aria-label="Author"
			>
				<span class="truncate">{value ?? 'Any author'}</span>
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search authors…" />
			<Command.List>
				<Command.Empty>No author found.</Command.Empty>
				<Command.Group>
					<Command.Item value="Any author" data-checked={value === null} onSelect={() => choose(null)}>
						Any author
					</Command.Item>
					{#each authors as a (a.name)}
						<Command.Item value={a.name} data-checked={value === a.name} onSelect={() => choose(a.name)}>
							<span class="truncate">{a.name}</span>
							<span class="text-xs text-muted-foreground tabular-nums">{a.count}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
