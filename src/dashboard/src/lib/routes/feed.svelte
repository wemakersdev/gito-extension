<script>
  import { actions } from "../overmind/store";
  import downvote from './../../assets/upvote.svg?raw'
  import upvote from './../../assets/downvote.svg?raw'
  import {Link} from 'svelte-navigator'

  let feedItems = [];

  actions.blog.fetchBlogFeedWithContent({ userId: "sadsad" });
</script>


<style>
	.clicked path{
		fill: yellow !important;
	}
</style>
<div class="px-6 py-5 pt-10">
  {#await actions.blog.fetchBlogFeed({ userId: "sadsad" })}
    loading...
  {:then feed}
    {#each feed as feedItem}

		<div class="flex flex-row">

			<div class="flex flex-col items-center justify-center px-4 bg-colors-foreground rounded-box" style="margin: 20px 0px">
				<button class="clicked">{@html upvote}</button>
				<span class="py-3">{feedItem.upvotes}</span>
				<button>{@html downvote}</button>
			</div>

			<div class="mt-0 card lg:card-side bordered">
				
			  <div class="card-body">

				<h2 class="card-title" >
					<Link class="link link-hover" to="/blog/{feedItem.id}">
						<span>
						  {feedItem.title}
						</span>
					</Link>
				  <p class="text-xs font-normal opacity-50">
					<Link class="link link-hover" to="user/{feedItem.author}">
					  <span>
						{feedItem.author}
					  </span>
					</Link>
				  </p>
				</h2>
				<p>{feedItem.content.slice(0, 200) + "..."}</p>
			  </div>
			</div>
		</div>
      <div class="py-0 my-2 divider" />
    {/each}
  {:catch err}
    {err.message}
  {/await}
</div>
