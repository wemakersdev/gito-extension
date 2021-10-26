<script lang="ts">
  import { actions, state } from "./../overmind/store";
  import { Link } from "svelte-navigator";
  import {slide, fade} from 'svelte/transition'
import { action } from "overmind/lib/operator";

  let offsetHeight: number = 0

  function getProps({ href, isCurrent,isPartiallyCurrent }: any) {
    const activeTab = $state.app.navbar.tabs.find(tab => href.startsWith(`/${tab.name}`)) 
    
    if(href.match(/\/(\w+)/) && activeTab && (isCurrent || isPartiallyCurrent)){
      actions.navbar.setActive({name: activeTab.name})  
    }
		return {};
	}

  $: actions.navbar.setNavbarHeight({height: offsetHeight})
  
</script>

<div in:slide={{duration: 200}} out:fade={{duration: 200}} bind:offsetHeight class="absolute z-50 flex items-center justify-center w-full">
  <ul
    class="items-stretch px-3 overflow-visible text-sm shadow-lg menu bg-colors-foreground horizontal rounded-box"
  >
  {#each $state.app.navbar.tabs as tab}
  <li class:bordered={$state.app.navbar.active === tab.name}>
        <button
          on:click={e => {
            e.preventDefault();
            actions.navigate({
              to: tab.name
            });
          }}
          data-tip="{tab.tooltip}" class="text-xs btn btn-sm btn-ghost tooltip tooltip-bottom" 
        >
            {tab.label}
        </button>
      </li>
    {/each}
  </ul>
</div>

