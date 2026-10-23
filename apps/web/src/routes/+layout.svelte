<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { tester } from '#lib/tester.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => tester.init());
	import { REPO_URL } from '#lib/site.js';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster position="bottom-center" />

<Tooltip.Provider>
	<div class="flex min-h-svh flex-col">
		<SiteHeader />
		<main class="flex-1">
			{@render children()}
		</main>
		<footer class="border-t">
			<div
				class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"
			>
				<p>
					Open Dhivehi fonts, cleaned up for the web. dvfonts is open source:
					<a class="underline underline-offset-4 hover:text-foreground" href={REPO_URL}>yashau/dvfonts on GitHub</a>.
				</p>
				<p>
					Rights holder? <a class="underline underline-offset-4 hover:text-foreground" href="/about#takedown"
						>Request a change or removal</a
					>.
				</p>
			</div>
		</footer>
	</div>
</Tooltip.Provider>
