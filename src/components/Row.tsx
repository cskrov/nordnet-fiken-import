import type { FlowComponent } from 'solid-js';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const Row: FlowComponent<Props> = ({ children, className, ...rest }) => (
  <div {...rest} class={twMerge('flex flex-row flex-wrap mb-4 gap-4', className)}>
    {children}
  </div>
);
