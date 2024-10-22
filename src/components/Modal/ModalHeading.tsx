import { ModalVariant } from '@app/components/Modal/types';
import type { VoidComponent } from 'solid-js';
import { styled } from 'solid-styled-components';
import ErrorIcon from '~icons/mdi/Error';
import HelpIcon from '~icons/mdi/HelpCircle';
import WarningIcon from '~icons/mdi/Warning';

interface HeadingProps {
  variant: ModalVariant;
}

export const ModalHeading: VoidComponent<HeadingProps> = ({ variant }) => {
  switch (variant) {
    case ModalVariant.PRIMARY:
    case ModalVariant.SECONDARY:
      return (
        <Heading>
          <HelpIcon /> Info
        </Heading>
      );
    case ModalVariant.WARNING:
      return (
        <Heading>
          <WarningIcon /> Advarsel
        </Heading>
      );
    case ModalVariant.ERROR:
      return (
        <Heading>
          <ErrorIcon /> Feil
        </Heading>
      );
  }
};

const Heading = styled.h1`
  position: absolute;
  left: 2rem;
  top: 2rem;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1em;
`;
