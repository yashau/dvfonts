<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';

	let { text, label = 'Copy' }: { text: string; label?: string } = $props();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success('Copied to clipboard');
			setTimeout(() => (copied = false), 1500);
		} catch {
			toast.error('Could not access the clipboard');
		}
	}
</script>

<Button variant="outline" size="sm" onclick={copy}>
	{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
	{label}
</Button>
