import {
  type Accessor,
  createEffect,
  createSignal,
  type FlowComponent,
  type JSX,
  mergeProps,
  onCleanup,
} from 'solid-js';
import { ModalFooter } from '@/components/Modal/ModalFooter';
import { ModalHeading } from '@/components/Modal/ModalHeading';
import { ModalVariant } from '@/components/Modal/types';

interface Props {
  isOpen: Accessor<boolean>;
  onClose?: () => void;
  variant?: ModalVariant;
  footerContent?: JSX.Element;
}

export const Modal: FlowComponent<Props> = (rawProps) => {
  const props = mergeProps({ variant: ModalVariant.PRIMARY }, rawProps);

  let dialogRef: HTMLDialogElement;

  createEffect(() => {
    if (props.isOpen()) {
      dialogRef.showModal();
    } else {
      dialogRef.close();
    }
  });

  const closeModal = () => {
    dialogRef.close();
    props.onClose?.();
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
      class={`absolute m-auto rounded-lg border-1 ${BORDER_COLOR[props.variant]} bg-surface-900 not-italic text-base text-text-default overflow-x-hidden overflow-y-auto max-w-[90%] w-fit min-w-3xl backdrop:backdrop-blur-xs`}
      ref={(ref) => {
        dialogRef = ref;
      }}
      onClose={props.onClose}
    >
      <section class="flex flex-col gap-4 px-4 pt-20 pb-4">
        <ModalHeading variant={props.variant} />
        {props.children}
      </section>
      <ModalFooter closeModal={closeModal}>{props.footerContent}</ModalFooter>
    </dialog>
  );
};

const BORDER_COLOR: Record<ModalVariant, string> = {
  [ModalVariant.PRIMARY]: 'border-primary-500',
  [ModalVariant.SECONDARY]: 'border-secondary-500',
  [ModalVariant.WARNING]: 'border-warning-500',
  [ModalVariant.ERROR]: 'border-error-500',
};
