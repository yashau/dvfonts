<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import XIcon from '@lucide/svelte/icons/x';
	import CheckIcon from '@lucide/svelte/icons/check';

	let { wrong, right, note }: { wrong: Snippet; right: Snippet; note?: string } = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2">
	<Card.Root size="sm" class="min-w-0 ring-destructive/30">
		<Card.Header>
			<Badge variant="destructive"><XIcon /> Wrong</Badge>
		</Card.Header>
		<Card.Content class="guide-sample">{@render wrong()}</Card.Content>
	</Card.Root>
	<Card.Root size="sm" class="min-w-0 ring-emerald-600/40">
		<Card.Header>
			<Badge class="bg-emerald-600 text-white"><CheckIcon /> Right</Badge>
		</Card.Header>
		<Card.Content class="guide-sample">{@render right()}</Card.Content>
	</Card.Root>
</div>
{#if note}<p class="mt-2 text-sm text-muted-foreground">{note}</p>{/if}

<style>
	:global(.guide-sample) {
		font-family: 'dv-faruma', 'dv-ui', system-ui, sans-serif;
		font-size: 1.6rem;
	}
</style>
