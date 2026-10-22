<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';

	let { wrong, right, note }: { wrong: Snippet; right: Snippet; note?: string } = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2">
	<div class="rounded-lg border border-destructive/40 p-4">
		<Badge variant="destructive" class="mb-3">Wrong</Badge>
		<div class="guide-sample">{@render wrong()}</div>
	</div>
	<div class="rounded-lg border border-emerald-600/40 p-4">
		<Badge class="mb-3 bg-emerald-600 text-white">Right</Badge>
		<div class="guide-sample">{@render right()}</div>
	</div>
</div>
{#if note}<p class="mt-2 text-sm text-muted-foreground">{note}</p>{/if}

<style>
	.guide-sample {
		font-family: 'dv-faruma', 'dv-ui', system-ui, sans-serif;
		font-size: 1.6rem;
	}
</style>
