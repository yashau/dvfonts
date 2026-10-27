<script lang="ts">
	import { INSTALLABLE, installCommand, type Shell } from '#lib/install.js';
	import CodeBlock from '#lib/components/code-block.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Label } from '#lib/components/ui/label/index.js';

	let bundleId = $state('essentials');
	let shell = $state<Shell>('sh');
	const bundle = $derived(INSTALLABLE.find((b) => b.id === bundleId) ?? INSTALLABLE[0]);

	// The prerendered page shows the macOS/Linux command; switch to PowerShell on Windows.
	$effect(() => {
		const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
		const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent;
		if (/win/i.test(platform)) shell = 'ps1';
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Install with one command</Card.Title>
		<Card.Description>
			Downloads a bundle, checks it and installs its fonts for your user account; no admin rights needed. Running it
			again, or for another bundle, updates the fonts in place.
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4">
		<div class="flex flex-wrap items-center gap-3">
			<Label for="install-bundle">Bundle</Label>
			<Select.Root type="single" bind:value={bundleId}>
				<Select.Trigger id="install-bundle" class="w-56">{bundle.name}</Select.Trigger>
				<Select.Content>
					{#each INSTALLABLE as b (b.id)}
						<Select.Item value={b.id} label={b.name}>{b.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<Tabs.Root bind:value={shell}>
			<Tabs.List>
				<Tabs.Trigger value="sh">macOS / Linux</Tabs.Trigger>
				<Tabs.Trigger value="ps1">Windows</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="sh" class="mt-3 flex flex-col gap-2">
				<CodeBlock title="Terminal" lang="bash" code={installCommand(bundle, 'sh')} />
				<p class="text-sm text-muted-foreground">
					Fonts go to <code>~/Library/Fonts/fonts.mv</code> on macOS and <code>~/.local/share/fonts/fonts.mv</code> on Linux.
				</p>
			</Tabs.Content>
			<Tabs.Content value="ps1" class="mt-3 flex flex-col gap-2">
				<CodeBlock title="PowerShell" lang="powershell" code={installCommand(bundle, 'ps1')} />
				<p class="text-sm text-muted-foreground">
					Fonts go to <code>%LOCALAPPDATA%\Microsoft\Windows\Fonts\fonts.mv</code> and are registered for your account. The
					same command works in PowerShell 7 on macOS and Linux.
				</p>
			</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>
