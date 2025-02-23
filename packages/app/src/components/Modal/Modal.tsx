import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { Heading, HeadingSize } from '@app/components/Heading';
import { ModalVariant } from '@app/components/Modal/types';
import {
  type Accessor,
  type ComponentProps,
  type FlowComponent,
  type JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';
import CloseIcon from '~icons/mdi/WindowClose';

interface Props {
  isOpen: Accessor<boolean>;
  onClose?: () => void;
  variant?: ModalVariant;
  heading: string;
  icon: (props: ComponentProps<'svg'>) => JSX.Element;
  className?: string;
  actions?: JSX.Element;
  onRef?: (ref: HTMLDialogElement) => void;
}

export const Modal: FlowComponent<Props> = ({
  isOpen,
  onClose,
  variant = ModalVariant.PRIMARY,
  children,
  heading,
  icon: Icon,
  className,
  actions,
  onRef,
}) => {
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
      class={twMerge(
        `absolute m-auto rounded-lg border-1 ${BORDER_COLOR[variant]} bg-surface-900 not-italic text-base text-text-default max-w-[95%] w-fit backdrop:backdrop-blur-xs backdrop:backdrop-brightness-50 open:flex flex-col`,
        className,
      )}
      ref={(ref) => {
        dialogRef = ref;
        onRef?.(ref);
      }}
      onClose={onClose}
    >
      <header class="flex items-center p-4 bg-surface-800 border-b-1 border-surface-700 shrink-0">
        <Heading level={1} size={HeadingSize.XSMALL}>
          <Icon />
          <span>{heading}</span>
        </Heading>

        <Button
          variant={ButtonVariant.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={closeModal}
          icon={CloseIcon}
          className="ml-auto"
        >
          Lukk
        </Button>
      </header>

      <div class="p-4 grow">{children}</div>

      <Show when={actions}>
        <footer class="flex justify-end p-4 w-full gap-4 shrink-0">{actions}</footer>
      </Show>
    </dialog>
  );
};

const BORDER_COLOR: Record<ModalVariant, string> = {
  [ModalVariant.PRIMARY]: 'border-primary-500',
  [ModalVariant.SECONDARY]: 'border-secondary-500',
  [ModalVariant.WARNING]: 'border-warning-500',
  [ModalVariant.ERROR]: 'border-error-500',
};
