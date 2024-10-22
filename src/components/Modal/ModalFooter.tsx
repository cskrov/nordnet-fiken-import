import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import type { VoidComponent } from 'solid-js';
import { styled } from 'solid-styled-components';
import CloseIcon from '~icons/mdi/WindowClose';

interface ModalFooterProps {
  closeModal: () => void;
}

export const ModalFooter: VoidComponent<ModalFooterProps> = ({ closeModal }) => (
  <StyledFooter>
    <Button variant={ButtonVariant.SECONDARY} size={ButtonSize.SMALL} onClick={closeModal} icon={<CloseIcon />}>
      Lukk
    </Button>
  </StyledFooter>
);

const StyledFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 2em;
  padding-right: 2em;
  padding-left: 2em;
`;
