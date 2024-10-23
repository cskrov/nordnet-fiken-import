import { FikenFile } from '@app/components/Fiken/FikenFile';
import { Heading, HeadingSize } from '@app/components/Heading';
import type { CsvFile } from '@app/lib/csv';
import { groupByMonth } from '@app/lib/fiken/fiken-files';
import { fixNordnetLines, toNordnetLines } from '@app/lib/nordnet/csv-to-nordnet-lines';
import { type Accessor, For, Show, type VoidComponent, createMemo } from 'solid-js';

interface FikenFilesProps {
  csvFiles: Accessor<CsvFile[]>;
}

export const FikenSection: VoidComponent<FikenFilesProps> = ({ csvFiles }) => {
  const nordnetMonths = createMemo(() => groupByMonth(fixNordnetLines(toNordnetLines(csvFiles()))));

  return (
    <Show when={nordnetMonths().length !== 0}>
      <section>
        <Heading level={1} size={HeadingSize.SMALL} spacing>
          Fiken
        </Heading>

        <For each={nordnetMonths()}>{(nordnetMonth) => <FikenFile nordnetMonth={nordnetMonth} />}</For>
      </section>
    </Show>
  );
};
