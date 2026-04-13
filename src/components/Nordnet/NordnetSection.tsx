import { Heading, HeadingSize } from '@app/components/Heading';
import { NordnetRow } from '@app/components/Nordnet/NordnetRow';
import { Section, SectionVariant } from '@app/components/Section';
import { Table } from '@app/components/Table';
import type { Csv } from '@app/lib/csv';
import {
  createSignal,
  type FlowComponent,
  Index,
  type JSX,
  mergeProps,
  Show,
  splitProps,
  type VoidComponent,
} from 'solid-js';
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

export const NordnetSection: VoidComponent<Props> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Section variant={props.data.rows.length === 0 ? SectionVariant.INACTIVE : SectionVariant.SURFACE}>
      <Heading level={1} size={HeadingSize.XSMALL} class="font-normal">
        <HeadingButton class="grow" onClick={() => setIsOpen((o) => !o)}>
          {isOpen() ? <ExpandLessIcon /> : <ExpandMore />}
          <CsvIcon />
          <span>
            {props.fileName} ({props.data.rows.length} linjer)
          </span>
        </HeadingButton>
        <HeadingButton class="text-red-500" onClick={props.onDelete}>
          <DeleteIcon />
        </HeadingButton>
      </Heading>
      <Show when={isOpen()}>
        <Show when={props.data.rows.length !== 0} fallback={<NoTransactions />}>
          <Table headers={props.data.headers} rowCount={props.data.rows.length} showLineNumbers>
            <Index each={props.data.rows}>{(line, index) => <NordnetRow line={line} lineNumber={index} />}</Index>
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
  class?: string;
}

const HeadingButton: FlowComponent<HeadingButtonProps> = (allProps) => {
  const [props, rest] = splitProps(allProps, ['children', 'class', 'type']);
  const merged = mergeProps({ type: 'button' as const }, props);

  return (
    <button
      {...rest}
      type={merged.type}
      class={twMerge('flex items-center justify-start gap-x-1 cursor-pointer', merged.class)}
    >
      {merged.children}
    </button>
  );
};
