import { prettyFormatMoney } from '@app/lib/money';
import type { Component } from 'solid-js';

interface Props {
  children: number;
  reversed?: boolean;
}

export const Money: Component<Props> = ({ children, reversed = false }) => (
  <span class={COLOR[sign(children, reversed)]}>{prettyFormatMoney(children)}</span>
);

enum Sign {
  POSITIVE = 1,
  NEGATIVE = -1,
  ZERO = 0,
}

const sign = (amount: number, reverse: boolean): Sign => {
  switch (Math.sign(amount)) {
    case 1:
      return reverse ? Sign.NEGATIVE : Sign.POSITIVE;
    case -1:
      return reverse ? Sign.POSITIVE : Sign.NEGATIVE;
    default:
      return Sign.ZERO;
  }
};

const COLOR: Record<Sign, string> = {
  [Sign.POSITIVE]: 'text-green-300',
  [Sign.NEGATIVE]: 'text-red-300',
  [Sign.ZERO]: 'text-gray-300',
};
