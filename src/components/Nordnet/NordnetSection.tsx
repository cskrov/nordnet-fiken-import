import { Heading, HeadingSize } from '@app/components/Heading';
import { NordnetRow } from '@app/components/Nordnet/NordnetRow';
import { Section, SectionVariant } from '@app/components/Section';
import { Table } from '@app/components/Table';
import type { Csv } from '@app/lib/csv';
import { type FlowComponent, Index, type JSX, Show, type VoidComponent, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
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
      <Heading level={1} size={HeadingSize.XSMALL} className="font-normal">
        <HeadingButton className="grow" onClick={() => setIsOpen((o) => !o)}>
          {isOpen() ? <ExpandLessIcon /> : <ExpandMore />}
          <CsvIcon />
          <span>
            {fileName} ({rows.length} linjer)
          </span>
        </HeadingButton>
        <HeadingButton className="text-red-500" onClick={onDelete}>
          <DeleteIcon />
        </HeadingButton>
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

interface HeadingButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'class' | 'classList'> {
  className?: string;
}

const HeadingButton: FlowComponent<HeadingButtonProps> = ({ children, className, type = 'button', ...rest }) => (
  <button {...rest} type={type} class={twMerge('flex items-center justify-start gap-x-1 cursor-pointer', className)}>
    {children}
  </button>
);
