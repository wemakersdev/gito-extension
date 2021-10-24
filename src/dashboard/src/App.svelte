<script>
  import Router from 'svelte-spa-router'
  import Layout from './lib/routes/__layout.svelte';
  import BlogsIndex from './lib/routes/blogs/index.svelte';
  import BlogItem from './lib/routes/blogs/[post].svelte'

  import GitosIndex from './lib/routes/gitos/index.svelte';
  import GitoItem from './lib/routes/gitos/[gito].svelte'
  import Feed from './lib/routes/feed.svelte'
  
  import './lib/TailwindCSS.svelte'

  const routes = {
    "/blogs/:id": BlogItem,
    "/feed": Feed,
    "/gitos/:id": GitoItem,
    "/gitos": GitosIndex,
    "/blogs": BlogsIndex
  }

</script>
  
<Layout>
  <Router {routes}/>
</Layout>