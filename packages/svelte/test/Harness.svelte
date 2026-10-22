<script lang="ts">
	import { ThaanaInput } from '../src/lib/index.js';
	let { dv = true }: { dv?: boolean } = $props();
	let value = $state('');
</script>

<ThaanaInput {dv} bind:value />
<output>{value}</output>
