<script lang="ts">
  import { state, actions } from "./../overmind/store";
</script>

<div class="min-h-screen hero">
  <div class="text-center hero-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
      <p class="mb-5">
        Welcome to <kbd class="kbd kbd-md">{$state.appMeta.name}</kbd> This is the
        place where you view and post your daily blogs and posts
      </p>
      <button class="btn btn-primary" on:click={actions.handleSkipInto}
        >Get Started</button
      >
    </div>
  </div>
</div>
