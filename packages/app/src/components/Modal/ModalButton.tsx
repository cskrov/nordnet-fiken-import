import { Button, type ButtonProps, ButtonVariant } from '@app/components/Button';
import { Modal } from '@app/components/Modal/Modal';
import { ModalVariant } from '@app/components/Modal/types';
import { type ComponentProps, type FlowComponent, type JSX, createSignal } from 'solid-js';

interface Props extends ButtonProps {
  text: string;
  defaultOpen?: boolean;
  onClose?: () => void;
  icon: (props: ComponentProps<'svg'>) => JSX.Element;
  actions?: JSX.Element;
  modalClassName?: string;
  modalRef?: (ref: HTMLDialogElement) => void;
}

export const ModalButton: FlowComponent<Props> = ({
  text,
  variant = ButtonVariant.PRIMARY,
  size,
  icon,
  defaultOpen = false,
  onClose,
  children,
  modalClassName,
  actions,
  modalRef,
}) => {
  const [isOpen, setIsOpen] = createSignal(defaultOpen);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)} icon={icon}>
        {text}
      </Button>

      <Modal
        variant={BUTTON_VARAINT_TO_MODAL_VARIANT[variant]}
        isOpen={isOpen}
        onClose={close}
        heading={text}
        icon={icon}
        className={modalClassName}
        actions={actions}
        onRef={modalRef}
      >
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
