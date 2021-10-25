<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import { state, } from '../overmind/store';
</script>

<style>
	:global(html, body){
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
	
</style>
<div class="w-full h-full overflow-auto bg-colors-background text-colors-text" data-theme="dracula">
	{#if $state.app.navbar.visible}
		<Navbar />
	{/if}
	<div class="w-full h-full" style="padding-top: {$state.app.navbar.height}px">
		<slot />
	</div>
</div>
