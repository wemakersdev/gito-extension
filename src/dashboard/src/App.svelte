

<script>
  import Layout from "./lib/routes/__layout.svelte";
  import BlogsIndex from "./lib/routes/blogs/index.svelte";
  import Blog from "./lib/routes/blogs/[post].svelte";

  import GitosIndex from "./lib/routes/gitos/index.svelte";
  import Feed from "./lib/routes/feed.svelte";
  import Introduction from "./lib/components/Introduction.svelte";

  import "./lib/TailwindCSS.svelte";
  // import {} from './lib/helpers/BackendConnector'
  import { actions, state } from "./lib/overmind/store";
  import { Router, Route, navigate, Link } from "svelte-navigator";
  import Gito from "./lib/routes/gitos/[gito].svelte";

  import { createHistory, createMemorySource } from "svelte-navigator";

	const memoryHistory = createHistory(createMemorySource());


  $: if(!$state.app.skipIntro){
    // console.log({navigating: true})
    navigate("/introduction")
  }
</script>

<Router history={memoryHistory}>
  <Layout>
    
      <button on:click={() => navigate("/introduction")}>click</button>
    
      <Link to="/introduction">link</Link>
    <div>
      <Route path="introduction">
        <Introduction />
      </Route>


      <Route path="blog/*">
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

      <Route path="gito/*">
        <Route path="/">
          <GitosIndex />
        </Route>
        <Route path=":id" component={Gito} />
      </Route>
    </div>
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
