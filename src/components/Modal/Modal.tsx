import { ModalFooter } from '@app/components/Modal/ModalFooter';
import { ModalHeading } from '@app/components/Modal/ModalHeading';
import { ModalVariant } from '@app/components/Modal/types';
import { type Accessor, type FlowComponent, createEffect, createSignal, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';

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
    <StyledDialog
      ref={(ref) => {
        dialogRef = ref;
      }}
      onClose={onClose}
      $variant={variant}
    >
      <ModalContent>
        <ModalHeading variant={variant} />
        {children}
      </ModalContent>
      <ModalFooter closeModal={closeModal} />
    </StyledDialog>
  );
};

interface StyledDialogProps {
  $variant: ModalVariant;
}

const StyledDialog = styled.dialog<StyledDialogProps>`
  position: absolute;
  font-weight: normal;
  font-style: normal;
  font-size: 1rem;
  padding: 0;
  border-radius: var(--border-radius);
  color: inherit;
  background-color: var(--surface-900);
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $variant }) => getBorderColor($variant)};
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
  overflow-x: hidden;
  overflow-y: auto;
  max-width: 90%;
  width: fit-content;
  min-width: 700px;

  &::backdrop {
    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const getBorderColor = (variant: ModalVariant) => {
  switch (variant) {
    case ModalVariant.PRIMARY:
      return 'var(--primary-500)';
    case ModalVariant.SECONDARY:
      return 'var(--secondary-500)';
    case ModalVariant.WARNING:
      return 'var(--warning-500)';
    case ModalVariant.ERROR:
      return 'var(--error-500)';
  }
};

const ModalContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 2em;
  padding-top: 5em;
  padding-bottom: 2em;
`;
