import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import type { VoidComponent } from 'solid-js';
import CloseIcon from '~icons/mdi/WindowClose';

interface ModalFooterProps {
  closeModal: () => void;
}

export const ModalFooter: VoidComponent<ModalFooterProps> = ({ closeModal }) => (
  <footer class="flex justify-end bottom-0 left-0 right-0 pb-8 px-8">
    <Button variant={ButtonVariant.SECONDARY} size={ButtonSize.SMALL} onClick={closeModal} icon={<CloseIcon />}>
      Lukk
    </Button>
  </footer>
);
