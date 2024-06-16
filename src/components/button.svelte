<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant: "primary" | "secondary" | "error";
    size?: "small" | "medium" | "large";
    icon?: Snippet;
    children?: Snippet;
    onclick: HTMLButtonElement["onclick"];
  }

  let { variant = "primary", icon, children, size = "medium", ...attributes }: Props = $props();
</script>

<button {...attributes} class={`${variant} ${size}`}>
  {#if icon !== undefined}
    {@render icon()}
  {/if}
  {#if children !== undefined}
    <span>
      {@render children()}
    </span>
  {/if}
</button>

<style>
  button {
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: var(--border-radius);
    border: none;
    color: var(--text-color);
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    font-size: 1rem;
    column-gap: 0.25em;

    &.primary {
      background-color: var(--primary-500);

      &:hover {
        background-color: var(--primary-400);
      }
    }

    &.secondary {
      background-color: var(--secondary-500);

      &:hover {
        background-color: var(--secondary-400);
      }
    }

    &.error {
      background-color: var(--error-500);

      &:hover {
        background-color: var(--error-400);
      }
    }
    

    &.small {
      padding: 0.25em .5em;
    }

    &.medium {
      padding: 0.5em 1em;
      
    }

    &.large {
      padding: 0.75em 1.5em;
    }
  }
</style>
