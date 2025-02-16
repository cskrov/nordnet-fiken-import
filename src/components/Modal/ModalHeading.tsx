import { ModalVariant } from '@app/components/Modal/types';
import type { FlowComponent, VoidComponent } from 'solid-js';
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

const Heading: FlowComponent = (props) => (
  <h1 {...props} class="absolute left-8 top-8 m-0 p-0 flex items-center gap-2 text-base" />
);
