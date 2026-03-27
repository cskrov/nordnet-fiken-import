import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { type FlowComponent, Show } from 'solid-js';
import CloseIcon from '~icons/mdi/WindowClose';

interface ModalFooterProps {
  closeModal: () => void;
}

export const ModalFooter: FlowComponent<ModalFooterProps> = ({ closeModal, children }) => (
  <footer class="flex items-center gap-4 bottom-0 left-0 right-0 pb-8 px-8">
    <Show when={children}>
      <div>{children}</div>
    </Show>

    <Button
      class="ml-auto"
      variant={ButtonVariant.SECONDARY}
      size={ButtonSize.SMALL}
      onClick={closeModal}
      icon={<CloseIcon />}
    >
      Lukk
    </Button>
  </footer>
);
