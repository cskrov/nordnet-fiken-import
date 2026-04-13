import { type FlowComponent, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

interface Props {
  class?: string;
}

export const Row: FlowComponent<Props> = (allProps) => {
  const [props, rest] = splitProps(allProps, ['children', 'class']);

  return (
    <div {...rest} class={twMerge('flex flex-row flex-wrap gap-4', props.class)}>
      {props.children}
    </div>
  );
};
