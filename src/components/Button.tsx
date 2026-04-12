import { type JSX, mergeProps, type ParentComponent } from 'solid-js';

export enum ButtonVariant {
  PRIMARY = 0,
  SECONDARY = 1,
  WARNING = 2,
  ERROR = 3,
  NEUTRAL = 4,
}

export enum ButtonSize {
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
}

export interface ButtonProps {
  class?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: JSX.Element;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  spacing?: boolean;
}

const BASE_CLASSES =
  'flex items-center flex-row rounded-lg border-none text-center text-decoration-none cursor-pointer gap-x-1';

export const Button: ParentComponent<ButtonProps> = (rawProps) => {
  const props = mergeProps({ variant: ButtonVariant.PRIMARY, size: ButtonSize.MEDIUM, spacing: false }, rawProps);

  return (
    <button
      type="button"
      class={`${BASE_CLASSES} ${TEXT_SIZE[props.size]} ${COLOR_CLASSES[props.variant]} ${BACKGROUND_COLOR[props.variant]} ${HOVER_BACKGROUND_COLOR[props.variant]} ${PADDING[props.size]} ${props.spacing ? 'mb-4' : ''} ${props.class ?? ''}`}
      onClick={props.onClick}
    >
      {props.icon === undefined ? null : props.icon}
      {props.children !== undefined ? <span>{props.children}</span> : null}
    </button>
  );
};

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
  [ButtonVariant.NEUTRAL]: 'text-default',
};

const BACKGROUND_COLOR: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'bg-primary-500',
  [ButtonVariant.SECONDARY]: 'bg-secondary-500',
  [ButtonVariant.WARNING]: 'bg-warning-500',
  [ButtonVariant.ERROR]: 'bg-error-500',
  [ButtonVariant.NEUTRAL]: 'bg-surface-500',
};

const HOVER_BACKGROUND_COLOR: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'hover:bg-primary-400',
  [ButtonVariant.SECONDARY]: 'hover:bg-secondary-400',
  [ButtonVariant.WARNING]: 'hover:bg-warning-400',
  [ButtonVariant.ERROR]: 'hover:bg-error-400',
  [ButtonVariant.NEUTRAL]: 'hover:bg-surface-400',
};

const PADDING: Record<ButtonSize, string> = {
  [ButtonSize.SMALL]: 'py-0.5 px-2 min-h-6',
  [ButtonSize.MEDIUM]: 'py-2 px-4 min-h-10',
  [ButtonSize.LARGE]: 'py-2 px-4 min-h-10',
};
