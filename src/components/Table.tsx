import { For, type ParentComponent, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  headers: string[];
  showLineNumbers?: boolean;
  rowCount: number;
}

export const Table: ParentComponent<Props> = ({ headers, showLineNumbers, rowCount, children }) => {
  return (
    <Container>
      <StyledTable>
        <StyledThead>
          <tr>
            <Show when={showLineNumbers}>
              <StyledTh>#</StyledTh>
            </Show>
            <For each={headers}>{(header) => <StyledTh>{header}</StyledTh>}</For>
          </tr>
        </StyledThead>
        <tbody>{children}</tbody>
        <StyledTFoot>
          <tr>
            <td>{rowCount} rader</td>
          </tr>
        </StyledTFoot>
      </StyledTable>
    </Container>
  );
};

const Container = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-color: var(--table-border-color);
  border-radius: 4px;
  margin-bottom: 1em;
  overflow: hidden;
`;

const StyledThead = styled.thead`
  background-color: var(--table-header);
`;

const StyledTh = styled.th`
  text-align: left;
  padding: 0.5em;
  white-space: nowrap;

  &:not(:last-child) {
    width: fit-content;
  }
`;

const StyledTFoot = styled.tfoot`
  background-color: var(--table-footer);
  font-style: italic;
  font-size: 0.8em;
  white-space: nowrap;

  td {
    position: sticky;
    left: 0;
  }
`;
