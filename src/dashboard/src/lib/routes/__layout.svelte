<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
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
	<Navbar />
	<slot />
</div>
