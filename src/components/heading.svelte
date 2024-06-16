<script lang="ts">
  import type { Snippet } from "svelte";
  
  interface Props {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    size: "xsmall" | "small" | "medium" | "large";
    spacing?: boolean;
    centered?: boolean;
    children: Snippet;
  }

  let { level = 1, size = "medium", spacing = false, centered = false, children }: Props = $props();

  let className = $derived(`heading ${size} ${spacing ? "spacing" : "no-spacing"} ${centered ? "centered" : ""}`);
</script>

{#if level === 1}
  <h1 class={className}>{@render children()}</h1>
{:else if level === 2}
  <h2 class={className}>{@render children()}</h2>
{:else if level === 3}
  <h3 class={className}>{@render children()}</h3>
{:else if level === 4}
  <h4 class={className}>{@render children()}</h4>
{:else if level === 5}
  <h5 class={className}>{@render children()}</h5>
{:else if level === 6}
  <h6 class={className}>{@render children()}</h6>
{/if}

<style>
  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    column-gap: 0.25em;
    font-size: 2rem;
    margin-top: 0;
  }

  .spacing {
    margin-bottom: 1em;
  }

  .no-spacing {
    margin-bottom: 0;
  }

  .centered {
    justify-content: center;
  }

  .xsmall {
    font-size: 1rem;
  }

  .small {
    font-size: 1.5rem;
  }

  .medium {
    font-size: 2rem;
  }

  .large {
    font-size: 2.5rem;
  }
</style>
