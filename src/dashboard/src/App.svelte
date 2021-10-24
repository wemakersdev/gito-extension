<script>
  import Layout from "./lib/routes/__layout.svelte";
  import BlogsIndex from "./lib/routes/blogs/index.svelte";
  import Blog from "./lib/routes/blogs/[post].svelte";

  import GitosIndex from "./lib/routes/gitos/index.svelte";
  import Feed from "./lib/routes/feed.svelte";

  import "./lib/TailwindCSS.svelte";
  import { actions, state } from "./lib/overmind/store";
  import { Router, Route } from "svelte-navigator";
  import Gito from "./lib/routes/gitos/[gito].svelte";
  </script>

<Router>
<Layout>
  <div>
    {#if !$state.feedItems.length}
      <button on:click={actions.fetchFeedItems}>Fetch List</button>
    {:else}
      {#each $state.feedItems as item}
        <p>
          <span>url: {item.url}</span>
          <span>type: {item.type}</span>
        </p>
      {/each}
    {/if}
  </div>

    <Route path="blogs/*">
      <Route path="/">
        <BlogsIndex />
      </Route>
      <Route path=":id" component={Blog} />
    </Route>

    <Route path="feed/*">
      <Route path="/">
        <Feed />
      </Route>
    </Route>

    <Route path="gitos/*">
      <Route path="/">
        <GitosIndex />
      </Route>
      <Route path=":id" component={Gito} />
    </Route>
  </Layout>
</Router>

<style>
  :global(:root) {
    --colors-background: #1e1e1e !important;
    --colors-foreground: #333333 !important;
    --colors-border: #3c3c3c !important;
    --colors-text: #d4d4d4 !important;
    --colors-highlight: #e0e0e0 !important;
  }
</style>
