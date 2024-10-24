import { Button, ButtonVariant } from '@app/components/Button';
import { FikenFile } from '@app/components/Fiken/FikenFile';
import { Heading, HeadingSize } from '@app/components/Heading';
import type { CsvFile } from '@app/lib/csv';
import { fikenLinesToFikenFiles, nordnetLinesToFikenLines } from '@app/lib/fiken/fiken-files';
import type { FikenLine } from '@app/lib/fiken/types';
import { fixNordnetLines, toNordnetLines } from '@app/lib/nordnet/csv-to-nordnet-lines';
import { NordnetType } from '@app/lib/nordnet/types';
import { pad } from '@app/lib/pad-number';
import { endOfMonth, format, subMonths } from 'date-fns';
import { nb } from 'date-fns/locale/nb';
import { type Accessor, For, Show, type VoidComponent, createEffect, createMemo, createSignal } from 'solid-js';
import CreationIcon from '~icons/mdi/creation';

interface FikenFilesProps {
  csvFiles: Accessor<CsvFile[]>;
}

export const FikenSection: VoidComponent<FikenFilesProps> = ({ csvFiles }) => {
  const convertedFikenLines = createMemo(() => nordnetLinesToFikenLines(fixNordnetLines(toNordnetLines(csvFiles()))));
  const [generatedFikenLines, setGeneratedFikenLines] = createSignal<FikenLine[]>([]);

  const firstLine: Accessor<FikenLine | undefined> = () => generatedFikenLines().at(0) ?? convertedFikenLines().at(0);

  const addGeneratedFikenLine = (newLine: FikenLine) => setGeneratedFikenLines([newLine, ...generatedFikenLines()]);

  const removeGeneratedFikenLines = (lines: FikenLine[]) =>
    setGeneratedFikenLines(generatedFikenLines().filter((l) => !lines.includes(l)));

  // If there are no converted lines, remove all generated lines.
  createEffect(() => {
    if (convertedFikenLines().length === 0) {
      setGeneratedFikenLines([]);
    }
  });

  return (
    <Show when={firstLine()}>
      {(_firstLine) => (
        <WithFirstLine
          firstLine={_firstLine}
          convertedFikenLines={convertedFikenLines}
          generatedFikenLines={generatedFikenLines}
          addGeneratedFikenLine={addGeneratedFikenLine}
          removeGeneratedFikenLines={removeGeneratedFikenLines}
        />
      )}
    </Show>
  );
};

interface FikenSectionWithFirstLineProps {
  convertedFikenLines: Accessor<FikenLine[]>;
  generatedFikenLines: Accessor<FikenLine[]>;
  firstLine: Accessor<FikenLine>;
  addGeneratedFikenLine: (line: FikenLine) => void;
  removeGeneratedFikenLines: (lines: FikenLine[]) => void;
}

const WithFirstLine: VoidComponent<FikenSectionWithFirstLineProps> = ({
  convertedFikenLines,
  generatedFikenLines,
  firstLine,
  addGeneratedFikenLine,
  removeGeneratedFikenLines,
}) => {
  const previousDate = createMemo(() => endOfMonth(subMonths(firstLine().bokførtDato, 1)));

  const generatePreviousMonth = () => {
    const _firstLine = firstLine();

    const bokførtDato = endOfMonth(subMonths(_firstLine.bokførtDato, 1));
    const month = bokførtDato.getMonth() + 1;
    const year = bokførtDato.getFullYear();
    const { nordnetKonto } = _firstLine;

    const [konto, setKonto] = createSignal<string>(nordnetKonto);

    addGeneratedFikenLine({
      type: NordnetType.SALDO,
      fraKonto: konto,
      setFraKonto: setKonto,
      tilKonto: konto,
      setTilKonto: setKonto,
      nordnetKonto: _firstLine.nordnetKonto,
      referanse: `generert-saldo-${year}-${pad(month)}`,
      bokførtDato: bokførtDato,
      forklarendeTekst: () => 'Saldo',
      generated: true,
      inn: 0,
      ut: 0,
      inngående: _firstLine.inngående,
      saldo: _firstLine.inngående,
      month,
      year,
      source: { fileName: null, rowNumber: -1 },
      isin: null,
    });
  };

  const generatedFikenFiles = createMemo(() => fikenLinesToFikenFiles(generatedFikenLines()));
  const convertedFikenFiles = createMemo(() => fikenLinesToFikenFiles(convertedFikenLines()));

  return (
    <Show when={convertedFikenFiles().length !== 0}>
      <section>
        <Heading level={1} size={HeadingSize.SMALL} spacing>
          Fiken
        </Heading>

        <Button onClick={generatePreviousMonth} variant={ButtonVariant.SECONDARY} icon={<CreationIcon />} spacing>
          Generer saldo for {format(previousDate(), 'MMMM yyyy', { locale: nb })}
        </Button>

        <For each={generatedFikenFiles()}>
          {(fikenFile, index) => (
            <FikenFile
              fikenFile={fikenFile}
              // Only allow removing the first generated file, to prevent accidental holes.
              onRemove={index() === 0 ? () => removeGeneratedFikenLines(fikenFile.rows) : undefined}
            />
          )}
        </For>

        <For each={convertedFikenFiles()}>{(fikenFile) => <FikenFile fikenFile={fikenFile} />}</For>
      </section>
    </Show>
  );
};
