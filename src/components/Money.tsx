import { prettyFormatMoney } from '@app/lib/money';
import type { Component, JSX } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  children: number;
  reversed?: boolean;
}

export const Money: Component<Props> = ({ children, reversed = false }) => (
  <StyledMoney amount={children} reversed={reversed}>
    {prettyFormatMoney(children)}
  </StyledMoney>
);

interface StyledMoneyProps {
  amount: number;
  reversed: boolean;
}

const StyledMoney = styled.span<StyledMoneyProps>`
  color: ${({ amount, reversed }) => (reversed ? getReversedColor(amount) : getColor(amount))};
`;

const getColor = (amount: number): JSX.CSSProperties['color'] => {
  switch (Math.sign(amount)) {
    case 1:
      return 'lightgreen';
    case -1:
      return 'orangered';
    default:
      return 'darkgray';
  }
};

const getReversedColor = (amount: number): JSX.CSSProperties['color'] => {
  switch (Math.sign(amount)) {
    case 1:
      return 'orangered';
    case -1:
      return 'lightgreen';
    default:
      return 'darkgray';
  }
};
