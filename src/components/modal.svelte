<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./button.svelte";
  import CloseIcon from "virtual:icons/mdi/window-close";
  import HelpIcon from "virtual:icons/mdi/help-circle";
  import ErrorIcon from "virtual:icons/mdi/error";

  interface Props {
    children: Snippet;
    isOpen: boolean;
    onClose?: () => void;
    variant?: "primary" | "secondary" | "error";
  }

  let { children, isOpen, onClose, variant = "primary" }: Props = $props();

  let modal: HTMLDialogElement;

  $effect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    window.addEventListener("mousedown", onMouseDown);
    
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousedown", onMouseDown);
    };
  })

  const close = () => {
    modal.close();
    onClose?.();
  };

  $effect(() => {
    if (isOpen && !modal.open) {
      modal.showModal();
    } else if (modal.open) {
      close();
    }
  });

  let startX = 0;
  let startY = 0;

  const onMouseDown = (event: MouseEvent) => {
    startX = event.clientX;
    startY = event.clientY;
  };

  const onClick = (event: MouseEvent) => {
    if (event.target === modal) {
      const { left, right, top, bottom } = modal.getBoundingClientRect();
      
      if (
        (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) && 
        (startX < left || startX > right || startY < top || startY > bottom)
      ) {
        close();
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
    }
  };
</script>

<dialog bind:this={modal} class={variant}>
  <section class="modal-content">
    <h1 class="heading">
      {#if variant === "primary"}
        {@render helpIcon()} Info
      {:else if variant === "secondary"}
        {@render helpIcon()} Info
      {:else if variant === "error"}
        {@render errorIcon()} Feil
      {/if}
    </h1>

    {@render children()}
    
    <footer>
      <Button variant="secondary" size="small" onclick={close} icon={closeIcon}>
        Lukk
      </Button>
    </footer>
  </section>
</dialog>

{#snippet closeIcon()}
  <CloseIcon />
{/snippet}

{#snippet helpIcon()}
  <HelpIcon />
{/snippet}

{#snippet errorIcon()}
  <ErrorIcon />
{/snippet}

<style>
  dialog {
    position: absolute;
    font-weight: normal;
    font-style: normal;
    font-size: 1rem;
    border-radius: var(--border-radius);
    color: inherit;
    background-color: var(--surface-900);
    border-width: 1px;
    border-style: solid;
    padding: 2em;
    padding-top: 3em;
    padding-bottom: 3em;
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
    
    &.primary {
      border-color: var(--primary-500);
    }
    
    &.secondary {
      border-color: var(--secondary-500);
    }

    &.error {
      border-color: var(--error-500);
    }

    .heading {
      position: absolute;
      left: 0.5rem;
      top: 0.5rem;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1em;

      footer {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: 0.5em;
        padding-right: 0.5em;
        padding-left: 0.5em;
      }
    }

    &::backdrop {
      backdrop-filter: blur(4px);
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
</style>