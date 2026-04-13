import { Money, prettyFormatMoney, Sign } from '@app/lib/money';
import { type Component, mergeProps } from 'solid-js';

interface Props {
  children: bigint;
  reversed?: boolean;
}

export const DisplayMoney: Component<Props> = (rawProps) => {
  const props = mergeProps({ reversed: false }, rawProps);

  return <span class={COLOR[Money.sign(props.children, props.reversed)]}>{prettyFormatMoney(props.children)}</span>;
};

const COLOR: Record<Sign, string> = {
  [Sign.POSITIVE]: 'text-green-300',
  [Sign.NEGATIVE]: 'text-red-300',
  [Sign.ZERO]: 'text-gray-300',
};
