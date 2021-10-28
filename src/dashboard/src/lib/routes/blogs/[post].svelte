<script lang="ts">

	import {} from 'svelte-navigator';
	import { actions } from '../../overmind/store';
	import marked from 'marked'
	export let id:string;

</script>

<div class="px-8 py-5">
	{#await actions.blog.getBlog({blogId: id})}
		<div class="alert">
		<div class="flex-1">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" class="w-6 h-6 mx-2">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
			</svg> 
			<label>Loading...</label>
		</div>
		</div>

	{:then blog}
		<div class="">
			<div class="card-title">{blog.title}</div>
			<div class="text-xs">@{blog.author} <span class="opacity-50">12 January 2021</span></div>
	
			<div class="py-6 text-sm">
				{@html marked.parse(blog.content)}
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

</div>
