import { type FlowComponent, Show } from 'solid-js';
import { Button, ButtonSize, ButtonVariant } from '@/components/Button';
import CloseIcon from '~icons/mdi/WindowClose';

interface ModalFooterProps {
  closeModal: () => void;
}

export const ModalFooter: FlowComponent<ModalFooterProps> = (props) => (
  <footer class="flex items-center gap-4 bottom-0 left-0 right-0 pb-8 px-8">
    <Show when={props.children}>
      <div>{props.children}</div>
    </Show>

    <Button
      class="ml-auto"
      variant={ButtonVariant.SECONDARY}
      size={ButtonSize.SMALL}
      onClick={props.closeModal}
      icon={<CloseIcon />}
    >
      Lukk
    </Button>
  </footer>
);
