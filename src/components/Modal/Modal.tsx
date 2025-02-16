import { ModalFooter } from '@app/components/Modal/ModalFooter';
import { ModalHeading } from '@app/components/Modal/ModalHeading';
import { ModalVariant } from '@app/components/Modal/types';
import { type Accessor, type FlowComponent, createEffect, createSignal, onCleanup } from 'solid-js';

interface Props {
  isOpen: Accessor<boolean>;
  onClose?: () => void;
  variant?: ModalVariant;
}

export const Modal: FlowComponent<Props> = ({ isOpen, onClose, variant = ModalVariant.PRIMARY, children }) => {
  let dialogRef: HTMLDialogElement;

  createEffect(() => {
    if (isOpen()) {
      dialogRef.showModal();
    } else {
      dialogRef.close();
    }
  });

  const closeModal = () => {
    dialogRef.close();
    onClose?.();
  };

  const [startX, setStartX] = createSignal(0);
  const [startY, setStartY] = createSignal(0);

  const onMouseDown = (event: MouseEvent) => {
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const onClick = (event: MouseEvent) => {
    if (event.target === dialogRef) {
      const { left, right, top, bottom } = dialogRef.getBoundingClientRect();

      if (
        (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) &&
        (startX() < left || startX() > right || startY() < top || startY() > bottom)
      ) {
        closeModal();
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  createEffect(() => {
    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);

    onCleanup(() => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onMouseDown);
    });
  });

  return (
    <dialog
      class={`absolute m-auto rounded-lg border-1 ${BORDER_COLOR[variant]} bg-surface-900 not-italic text-base text-text-default overflow-x-hidden overflow-y-auto max-w-[90%] w-fit min-w-3xl backdrop:backdrop-blur-xs`}
      ref={(ref) => {
        dialogRef = ref;
      }}
      onClose={onClose}
    >
      <section class="flex flex-col gap-4 px-4 pt-20 pb-4">
        <ModalHeading variant={variant} />
        {children}
      </section>
      <ModalFooter closeModal={closeModal} />
    </dialog>
  );
};

const BORDER_COLOR: Record<ModalVariant, string> = {
  [ModalVariant.PRIMARY]: 'border-primary-500',
  [ModalVariant.SECONDARY]: 'border-secondary-500',
  [ModalVariant.WARNING]: 'border-warning-500',
  [ModalVariant.ERROR]: 'border-error-500',
};
