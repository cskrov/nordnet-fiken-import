import { type FlowComponent, mergeProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

interface Props {
  spacing?: boolean;
  class?: string;
}

export const Header: FlowComponent<Props> = (rawProps) => {
  const props = mergeProps({ spacing: false }, rawProps);

  return <header class={twMerge('flex flex-col', props.class, props.spacing ? 'mb-8' : null)}>{props.children}</header>;
};
