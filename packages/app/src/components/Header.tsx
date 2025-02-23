import type { FlowComponent } from 'solid-js';
import { twMerge } from 'tailwind-merge';

interface Props {
  spacing?: boolean;
  className?: string;
}

export const Header: FlowComponent<Props> = ({ children, className, spacing = false }) => (
  <header class={twMerge('flex flex-col', className, spacing ? 'mb-8' : null)}>{children}</header>
);
