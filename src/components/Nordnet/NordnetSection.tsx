import { Heading, HeadingSize } from '@app/components/Heading';
import { NordnetRow } from '@app/components/Nordnet/NordnetRow';
import { Section, SectionVariant } from '@app/components/Section';
import { Table } from '@app/components/Table';
import type { Csv } from '@app/lib/csv';
import { Index, Show, type VoidComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import DeleteIcon from '~icons/mdi/Delete';
import ExpandLessIcon from '~icons/mdi/ExpandLess';
import ExpandMore from '~icons/mdi/ExpandMore';
import CsvIcon from '~icons/mdi/FileCsv';

interface Props {
  fileName: string;
  data: Csv;
  onDelete: () => void;
}

export const NordnetSection: VoidComponent<Props> = ({ fileName, data, onDelete }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const { headers, rows } = data;
  const rowCount = rows.length;

  return (
    <Section variant={rows.length === 0 ? SectionVariant.INACTIVE : SectionVariant.SURFACE}>
      <Heading level={1} size={HeadingSize.XSMALL}>
        <ExpandButton onClick={() => setIsOpen((o) => !o)}>
          {isOpen() ? <ExpandLessIcon /> : <ExpandMore />}
          <CsvIcon />
          <span>
            {fileName} ({rows.length} linjer)
          </span>
        </ExpandButton>
        <DeleteButton onClick={onDelete}>
          <DeleteIcon />
        </DeleteButton>
      </Heading>
      <Show when={isOpen()}>
        <Show when={rowCount !== 0} fallback={<NoTransactions />}>
          <Table headers={headers} rowCount={rowCount} showLineNumbers>
            <Index each={rows}>{(line, index) => <NordnetRow line={line} lineNumber={index} />}</Index>
          </Table>
        </Show>
      </Show>
    </Section>
  );
};

const NoTransactions: VoidComponent = () => (
  <p>
    <em>Ingen transaksjoner</em>
  </p>
);

const HeadingButton = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: left;
  column-gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  text-align: inherit;
  padding: 0;
`;

const ExpandButton = styled(HeadingButton)`
  flex-grow: 1;
`;

const DeleteButton = styled(HeadingButton)`
  flex-grow: 0;
  flex-shrink: 0;
  color: red;
`;
