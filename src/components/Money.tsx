import { Money, prettyFormatMoney, Sign } from '@app/lib/money';
import type { Component } from 'solid-js';

interface Props {
  children: bigint;
  reversed?: boolean;
}

export const DisplayMoney: Component<Props> = ({ children, reversed = false }) => (
  <span class={COLOR[Money.sign(children, reversed)]}>{prettyFormatMoney(children)}</span>
);

const COLOR: Record<Sign, string> = {
  [Sign.POSITIVE]: 'text-green-300',
  [Sign.NEGATIVE]: 'text-red-300',
  [Sign.ZERO]: 'text-gray-300',
};
