<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<header>
  <div class="content">
    {@render children()}
  </div>
  
</header>

<style>
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>