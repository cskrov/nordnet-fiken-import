import type { FlowComponent } from 'solid-js';
import { styled } from 'solid-styled-components';

export enum SectionVariant {
  PRIMARY = 0,
  SECONDARY = 1,
  SURFACE = 2,
  INACTIVE = 3,
}

export interface Props {
  variant?: SectionVariant;
}

export const Section: FlowComponent<Props> = ({ variant = SectionVariant.PRIMARY, children }) => (
  <StyledSection $variant={variant}>{children}</StyledSection>
);

interface StyledSectionProps {
  $variant: SectionVariant;
}

const StyledSection = styled.section<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  row-gap: 1em;
  margin-bottom: 1em;
  padding: 1em;
  border-radius: var(--border-radius);
  background-color: ${({ $variant }) => backgroundColor($variant)};
`;

const backgroundColor = (variant: SectionVariant) => {
  switch (variant) {
    case SectionVariant.PRIMARY:
      return 'var(--primary-800)';
    case SectionVariant.SECONDARY:
      return 'var(--secondary-800)';
    case SectionVariant.SURFACE:
      return 'var(--surface-800)';
    case SectionVariant.INACTIVE:
      return 'var(--surface-400)';
  }
};
