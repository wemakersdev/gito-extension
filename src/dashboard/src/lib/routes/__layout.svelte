<script lang="ts">
	// import './../tailwind.css'
	// import '../app.css';
import Navbar from '../components/Navbar.svelte';
</script>

<style>
	:global(html, body){
		height: 100%;
		width: 100%;
	}
</style>
<div class="w-full h-full overflow-auto bg-neutral-focus text-neutral-content" data-theme="dracula">
	<Navbar />
	<slot />
</div>
