<script>
	
	let feedItems = [
		{
			type: "blog",
			href: "/blogs/sadsad",
			description: "sadasdsad",
			title: "blog title",
			author: "author1",
			tags: ["javascript", "svelte"]
		},

		{
			type: "blog",
			href: "/blogs/sadsad",
			description: "sadasdsad",
			title: "blog title",
			author: "author1",
			tags: ["javascript", "svelte"]
		},
		{
			type: "blog",
			href: "/blogs/sadsad",
			description: "sadasdsad",
			title: "blog title",
			author: "author1",
			tags: ["javascript", "svelte"]
		},
		{
			type: "blog",
			href: "/blogs/sadsad",
			description: "sadasdsad",
			title: "blog title",
			author: "author1",
			tags: ["javascript", "svelte"]
		},
		{
			type: "blog",
			href: "/blogs/sadsad",
			description: "sadasdsad",
			title: "blog title",
			author: "author1",
			tags: ["javascript", "svelte"]
		},
	]
</script>
{#each feedItems as feedItem}
	<div class="mt-0 card lg:card-side bordered">
		<div class="card-body">
			<h2 class="card-title">
				<span>
					{feedItem.title}
				</span>
				<p class="text-xs font-normal opacity-50">
					<a href="/user/{feedItem.author}">
						<span>
							{feedItem.author}
						</span>
					</a>
				</p>
			</h2> 
			<p>{feedItem.description}</p> 
		</div>
	</div>

	<div class="py-0 my-2 divider"></div> 
{/each}
