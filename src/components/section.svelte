<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "primary" | "secondary" | "surface";
    children: Snippet;
  }

  let { children, variant = "primary" }: Props = $props();
</script>

<section class={`background-${variant}`}>{@render children()}</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    row-gap: 1em;
    margin-bottom: 1em;
    background-color: var(--card-background);
    padding: 1em;
    border-radius: var(--card-border-radius);
  }

  .background-primary {
    background-color: var(--primary-800);
  }

  .background-secondary {
    background-color: var(--secondary-800);
  }

  .background-surface {
    background-color: var(--surface-800);
  }
</style>
