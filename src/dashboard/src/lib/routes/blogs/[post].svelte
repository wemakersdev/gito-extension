<script lang="ts">

	import {} from 'svelte-navigator';
	import { actions } from '../../overmind/store';
	export let id:string;

</script>

{#await actions.blog.getBlog({blogId: id})}
	loading...
{:then blog}
	<div class="px-8 pt-8">
		<div class="card-title">{blog.title}</div>
		<div class="text-xs">@{blog.author} <span class="opacity-50">12 January 2021</span></div>

		<div class="py-6 text-sm">
			{blog.content}
		</div>
	</div>
{:catch err}
	
	<div class="alert alert-error">
	<div class="flex-1">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">    
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>                      
		</svg> 
		<label>{err.message}</label>
	</div>
	</div>
{/await}