<script lang="ts">
	import './layout.css';
	import faviconDark from '#lib/assets/favicon-dark.svg';
	import faviconLight from '#lib/assets/favicon-light.svg';
	import { onMount } from 'svelte';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { tester } from '#lib/tester.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => tester.init());
	import { page } from '$app/state';
	import { REPO_URL, SITE_ORIGIN } from '#lib/site.js';
</script>

<svelte:head>
	<!-- A light icon on the dark theme and a dark one on the light theme. Until the theme is
	     known (prerendered HTML, before hydration) the OS colour scheme picks. -->
	{#if mode.current}
		<link rel="icon" type="image/svg+xml" href={mode.current === 'dark' ? faviconLight : faviconDark} />
	{:else}
		<link rel="icon" type="image/svg+xml" href={faviconDark} media="(prefers-color-scheme: light)" />
		<link rel="icon" type="image/svg+xml" href={faviconLight} media="(prefers-color-scheme: dark)" />
	{/if}
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<!-- The old domain (dvfonts.yashau.com) serves the same pages until its redirect is in place. -->
	<link rel="canonical" href="{SITE_ORIGIN}{page.url.pathname}" />
	<!-- Link previews (Telegram, WhatsApp, Slack, X…). They fall back to each page's <title> and description. -->
	<meta property="og:site_name" content="fonts.mv" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{SITE_ORIGIN}{page.url.pathname}" />
	<meta property="og:image" content="{SITE_ORIGIN}/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="fonts.mv: open Dhivehi fonts for the web" />
	<meta name="twitter:card" content="summary_large_image" />
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
					Open Dhivehi fonts for the web. fonts.mv is open source:
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
