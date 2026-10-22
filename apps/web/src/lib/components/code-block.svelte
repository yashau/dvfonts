<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import CopyButton from '#lib/components/copy-button.svelte';

	let { code, title }: { code: string; title: string } = $props();
</script>

<Card.Root size="sm" class="min-w-0 gap-0 py-0">
	<Card.Header class="border-b py-2 [.border-b]:pb-2">
		<Card.Title class="text-sm">{title}</Card.Title>
		<Card.Action>
			<CopyButton text={code} />
		</Card.Action>
	</Card.Header>
	<Card.Content class="px-0">
		<ScrollArea orientation="horizontal">
			<pre class="p-4 text-[13px] leading-relaxed"><code>{code}</code></pre>
		</ScrollArea>
	</Card.Content>
</Card.Root>
