import type { FlowComponent, JSX } from 'solid-js';

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

const BASE_CLASSES =
  'flex items-center flex-row rounded-lg border-none text-center text-decoration-none cursor-pointer gap-x-1';

export const Button: FlowComponent<ButtonProps> = ({
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.MEDIUM,
  icon,
  children,
  onClick,
  spacing = false,
}) => (
  <button
    type="button"
    class={`${BASE_CLASSES} ${TEXT_SIZE[size]} ${COLOR_CLASSES[variant]} ${BACKGROUND_COLOR[variant]} ${HOVER_BACKGROUND_COLOR[variant]} ${PADDING[size]} ${spacing ? 'mb-4' : ''}`}
    onClick={onClick}
  >
    {icon === undefined ? null : icon}
    <span>{children}</span>
  </button>
);

const TEXT_SIZE: Record<ButtonSize, string> = {
  [ButtonSize.SMALL]: 'text-sm',
  [ButtonSize.MEDIUM]: 'text-base',
  [ButtonSize.LARGE]: 'text-base',
};

const COLOR_CLASSES: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'text-default',
  [ButtonVariant.SECONDARY]: 'text-default',
  [ButtonVariant.WARNING]: 'text-inverted',
  [ButtonVariant.ERROR]: 'text-default',
};

const BACKGROUND_COLOR: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'bg-primary-500',
  [ButtonVariant.SECONDARY]: 'bg-secondary-500',
  [ButtonVariant.WARNING]: 'bg-warning-500',
  [ButtonVariant.ERROR]: 'bg-error-500',
};

const HOVER_BACKGROUND_COLOR: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'hover:bg-primary-400',
  [ButtonVariant.SECONDARY]: 'hover:bg-secondary-400',
  [ButtonVariant.WARNING]: 'hover:bg-warning-400',
  [ButtonVariant.ERROR]: 'hover:bg-error-400',
};

const PADDING: Record<ButtonSize, string> = {
  [ButtonSize.SMALL]: 'py-0.5 px-2',
  [ButtonSize.MEDIUM]: 'py-2 px-4',
  [ButtonSize.LARGE]: 'py-2 px-4',
};
