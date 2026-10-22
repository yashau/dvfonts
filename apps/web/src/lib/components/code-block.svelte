<script lang="ts">
	import CopyButton from '#lib/components/copy-button.svelte';

	let { code, title }: { code: string; title: string } = $props();
</script>

<div class="overflow-hidden rounded-lg border">
	<div class="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-1.5">
		<span class="text-sm font-medium">{title}</span>
		<CopyButton text={code} />
	</div>
	<pre class="overflow-x-auto p-3 text-[13px] leading-relaxed"><code>{code}</code></pre>
</div>
