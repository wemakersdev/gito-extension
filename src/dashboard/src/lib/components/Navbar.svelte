<script lang="ts">
  import { actions, state } from "./../overmind/store";
  import { Link } from "svelte-navigator";
  import {slide, fade} from 'svelte/transition'

  let offsetHeight;


</script>

<div in:slide={{duration: 200}} out:fade={{duration: 200}} bind:offsetHeight class="absolute flex items-center justify-center w-full">
  <ul
    class="items-stretch px-3 overflow-visible text-sm shadow-lg menu bg-colors-foreground horizontal rounded-box"
  >
    {#each $state.app.navbar.tabs as tab}
      <li class:bordered={$state.app.navbar.active === tab.name}>
        <Link on:click={() => actions.navbar.setActive({name: tab.name})} data-tip="{tab.tooltip}" class="text-xs tooltip tooltip-bottom" to="/{tab.name}">{tab.label}</Link>
      </li>
    {/each}
  </ul>
</div>

<div class="w-full" style="height: {offsetHeight}px" />
