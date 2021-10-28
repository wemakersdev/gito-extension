<script>
  import { actions } from "../overmind/store";
  import downvote from './../../assets/upvote.svg?raw'
  import upvote from './../../assets/downvote.svg?raw'
</script>


<style>
	.clicked path{
		fill: yellow !important;
	}
</style>
<div class="px-6 py-5">
  {#await actions.blog.fetchBlogFeedWithContent({ userId: "sadsad" })}
    <div class="alert">
		<div class="flex-1">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" class="w-6 h-6 mx-2">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
			</svg> 
			<label>Loading...</label>
		</div>
		</div>
  {:then feed}
    {#each feed as feedItem}

		<div class="flex flex-row">

			<div class="flex flex-col items-center justify-center px-3 bg-colors-foreground rounded-box" style="margin: 20px 0px">
				<button class="clicked">{@html upvote}</button>
				<span class="py-3">{feedItem.upvotes}</span>
				<button>{@html downvote}</button>
			</div>

			<div class="mt-0 card lg:card-side bordered">
				
			  <div class="card-body">

				<h2 class="card-title" >
					<button class="link link-hover" on:click={() => actions.navigate({to:`/blog/${feedItem.id}`})}>
						<span>
						  {feedItem.title}
						</span>
					</button>
				  <p class="text-xs font-normal opacity-50">
					<button class="link link-hover" on:click={() => actions.navigate({to:`/author/${feedItem.author}`})}>
					  <span>
						{feedItem.author}
					  </span>
					</button>
				  </p>
				</h2>
				<p class="text-xs">{feedItem.content.slice(0, 200) + "..."}</p>
			  </div>
			</div>
		</div>
      <div class="py-0 my-2 divider" />
    {/each}
  {:catch err}
    {err.message}
  {/await}
</div>
