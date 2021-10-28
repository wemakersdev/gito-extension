<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import { actions, state } from '../overmind/store';
	import {useLocation} from 'svelte-navigator';
import { onMount } from 'svelte';

	let appliedLocation:boolean = false

	const location = useLocation();

	onMount(() => {
		// if($state.app.location && !appliedLocation){
		// 	actions.navigate({to: $state.app.location.pathname})
		// }
		// location.subscribe(loc => actions.handleLocationChange(loc))
	})




</script>

<style>
	:global(html, body){
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
		font-size: 16px
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
