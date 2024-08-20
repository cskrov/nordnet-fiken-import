<script lang="ts">
  import Button from "@app/components/button.svelte";
  import Modal from "@app/components/modal.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    buttonText: string;
    variant: "primary" | "secondary" | "warning" | "error";
    size?: "small" | "medium" | "large";
    icon?: Snippet;
    defaultOpen?: boolean;
    onClose?: () => void;
    children: Snippet;
  }

  let { buttonText, children, variant, defaultOpen = false, onClose, ...buttonProps }: Props = $props();

  let isOpen = $state<boolean>(defaultOpen);

  const close = () => {
    isOpen = false;
    onClose?.();
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
