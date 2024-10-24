import type { FlowComponent, JSX } from 'solid-js';
import { styled } from 'solid-styled-components';

export enum ButtonVariant {
  PRIMARY = 0,
  SECONDARY = 1,
  WARNING = 2,
  ERROR = 3,
}

export enum ButtonSize {
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
}

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: JSX.Element;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  spacing?: boolean;
}

export const Button: FlowComponent<ButtonProps> = ({
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.MEDIUM,
  icon,
  children,
  onClick,
  spacing = false,
}) => {
  return (
    <StyledButton type="button" onClick={onClick} $variant={variant} $size={size} $spacing={spacing}>
      {icon === undefined ? null : icon}
      <span>{children}</span>
    </StyledButton>
  );
};

interface StyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $spacing: boolean;
}

const StyledButton = styled.button<StyleProps>`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-radius: var(--border-radius);
  border: none;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  font-size: 1rem;
  column-gap: 0.25em;
  
  color: ${({ $variant }) => color($variant)};
  background-color: ${({ $variant }) => backgroundColor($variant)};
  padding: ${({ $size }) => padding($size)};

  margin-bottom: ${({ $spacing }) => ($spacing ? '1rem' : '0')};

  &:hover {
    background-color: ${({ $variant }) => hoverBackgroundColor($variant)};
  }
`;

const color = (variant: ButtonVariant) => {
  switch (variant) {
    case ButtonVariant.WARNING:
      return 'var(--text-color-inverted)';
    default:
      return 'var(--text-color)';
  }
};

const backgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case ButtonVariant.PRIMARY:
      return 'var(--primary-500)';
    case ButtonVariant.SECONDARY:
      return 'var(--secondary-500)';
    case ButtonVariant.WARNING:
      return 'var(--warning-500)';
    case ButtonVariant.ERROR:
      return 'var(--error-500)';
  }
};

const hoverBackgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case ButtonVariant.PRIMARY:
      return 'var(--primary-400)';
    case ButtonVariant.SECONDARY:
      return 'var(--secondary-400)';
    case ButtonVariant.WARNING:
      return 'var(--warning-400)';
    case ButtonVariant.ERROR:
      return 'var(--error-400)';
  }
};

const padding = (size: ButtonSize) => {
  switch (size) {
    case ButtonSize.SMALL:
      return '0.25em 0.5em';
    case ButtonSize.MEDIUM:
      return '0.5em 1em';
    case ButtonSize.LARGE:
      return '0.75em 1.5em';
  }
};
