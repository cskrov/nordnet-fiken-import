import { Button, type ButtonProps, ButtonVariant } from '@app/components/Button';
import { Modal } from '@app/components/Modal/Modal';
import { ModalVariant } from '@app/components/Modal/types';
import { type FlowComponent, createSignal } from 'solid-js';

interface Props extends ButtonProps {
  buttonText: string;
  defaultOpen?: boolean;
  onClose?: () => void;
}

export const ModalButton: FlowComponent<Props> = ({
  buttonText,
  variant = ButtonVariant.PRIMARY,
  size,
  icon,
  defaultOpen = false,
  onClose,
  children,
}) => {
  const [isOpen, setIsOpen] = createSignal(defaultOpen);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)} icon={icon}>
        {buttonText}
      </Button>
      <Modal variant={BUTTON_VARAINT_TO_MODAL_VARIANT[variant]} isOpen={isOpen} onClose={close}>
        {children}
      </Modal>
    </>
  );
};

const BUTTON_VARAINT_TO_MODAL_VARIANT: Record<ButtonVariant, ModalVariant> = {
  [ButtonVariant.PRIMARY]: ModalVariant.PRIMARY,
  [ButtonVariant.SECONDARY]: ModalVariant.SECONDARY,
  [ButtonVariant.WARNING]: ModalVariant.WARNING,
  [ButtonVariant.ERROR]: ModalVariant.ERROR,
};
