<script lang="ts">
  import Button from "@app/components/button.svelte";
    import Modal from "@app/components/modal.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    buttonText: string;
    variant: "primary" | "secondary" | "warning" | "error";
    size?: "small" | "medium" | "large";
    icon?: Snippet;
    children: Snippet;
  }

  let { buttonText, children, variant, ...buttonProps }: Props = $props();

  let isOpen = $state<boolean>(false);

  const close = () => {
    isOpen = false;
  };

  const open = () => {
    isOpen = true;
  };
</script>

<Button {...buttonProps} variant={variant} onclick={open}>
  {buttonText}
</Button>

<Modal variant={variant} isOpen={isOpen} onClose={close}>
  {@render children()}
</Modal>
