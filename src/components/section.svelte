<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "primary" | "secondary" | "surface" | "inactive";
    children: Snippet;
  }

  let { children, variant = "primary" }: Props = $props();

  const className = $derived(`background-${variant}`);
</script>

<section class={className}>{@render children()}</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    row-gap: 1em;
    margin-bottom: 1em;
    padding: 1em;
    border-radius: var(--border-radius);
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

  .background-inactive {
    background-color: var(--surface-400);
  }
</style>
