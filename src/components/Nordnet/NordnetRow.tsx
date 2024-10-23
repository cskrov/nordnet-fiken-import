import { type Accessor, Index, type VoidComponent } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  line: Accessor<string[]>;
  lineNumber: number;
}

export const NordnetRow: VoidComponent<Props> = ({ line, lineNumber }) => (
  <StyledRow>
    <StyledCell>{lineNumber + 1}</StyledCell>
    <Index each={line()}>{(cell) => <StyledCell>{cell()}</StyledCell>}</Index>
  </StyledRow>
);

const StyledRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: var(--table-odd-row);
  }

  &:nth-of-type(even) {
    background-color: var(--table-even-row);
  }

  &:hover {
    background-color: var(--table-hover-row);
  }
`;

const StyledCell = styled.td`
  padding: 0.5em;
  white-space: nowrap;
`;
