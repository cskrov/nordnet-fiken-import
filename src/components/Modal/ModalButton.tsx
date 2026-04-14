import { createSignal, type FlowComponent, type JSX, mergeProps } from 'solid-js';
import { Button, type ButtonProps, ButtonVariant } from '@/components/Button';
import { Modal } from '@/components/Modal/Modal';
import { ModalVariant } from '@/components/Modal/types';

interface Props extends ButtonProps {
  buttonText: string;
  defaultOpen?: boolean;
  onClose?: () => void;
  footerContent?: JSX.Element;
}

export const ModalButton: FlowComponent<Props> = (rawProps) => {
  const props = mergeProps({ variant: ButtonVariant.PRIMARY, defaultOpen: false }, rawProps);

  const [isOpen, setIsOpen] = createSignal(props.defaultOpen);

  const close = () => {
    setIsOpen(false);
    props.onClose?.();
  };

  return (
    <>
      <Button variant={props.variant} size={props.size} onClick={() => setIsOpen(true)} icon={props.icon}>
        {props.buttonText}
      </Button>
      <Modal
        variant={BUTTON_VARAINT_TO_MODAL_VARIANT[props.variant]}
        isOpen={isOpen}
        onClose={close}
        footerContent={props.footerContent}
      >
        {props.children}
      </Modal>
    </>
  );
};

const BUTTON_VARAINT_TO_MODAL_VARIANT: Record<ButtonVariant, ModalVariant> = {
  [ButtonVariant.PRIMARY]: ModalVariant.PRIMARY,
  [ButtonVariant.SECONDARY]: ModalVariant.SECONDARY,
  [ButtonVariant.WARNING]: ModalVariant.WARNING,
  [ButtonVariant.ERROR]: ModalVariant.ERROR,
  [ButtonVariant.NEUTRAL]: ModalVariant.SECONDARY,
};
