import { Button, ButtonVariant } from '@app/components/Button';
import { FikenDownloadButtons } from '@app/components/Fiken/FikenDownloadButtons';
import { FikenFile } from '@app/components/Fiken/FikenFile';
import { fikenLinesToFikenFiles, nordnetLinesToFikenLines } from '@app/lib/fiken/fiken-files';
import type { FikenLine } from '@app/lib/fiken/types';
import { fixNordnetLines } from '@app/lib/nordnet/csv-to-nordnet-lines';
import type { NordnetLine } from '@app/lib/nordnet/types';
import { NordnetType } from '@app/lib/nordnet/types';
import { pad } from '@app/lib/pad-number';
import { addMonths, endOfMonth, format, isBefore, startOfMonth, subMonths } from 'date-fns';
import { nb } from 'date-fns/locale/nb';
import { type Accessor, createEffect, createMemo, createSignal, For, Show, type VoidComponent } from 'solid-js';
import CreationIcon from '~icons/mdi/creation';

interface FikenFilesProps {
  nordnetLines: Accessor<NordnetLine[]>;
}

export const FikenSection: VoidComponent<FikenFilesProps> = (props) => {
  const convertedFikenLines = createMemo(() => nordnetLinesToFikenLines(fixNordnetLines(props.nordnetLines())));
  const [generatedFikenLines, setGeneratedFikenLines] = createSignal<FikenLine[]>([]);

  const firstLine: Accessor<FikenLine | undefined> = () => generatedFikenLines().at(0) ?? convertedFikenLines().at(0);

  const prependGeneratedFikenLine = (newLine: FikenLine) => setGeneratedFikenLines([newLine, ...generatedFikenLines()]);
  const appendGeneratedFikenLine = (newLine: FikenLine) => setGeneratedFikenLines([...generatedFikenLines(), newLine]);

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
          prependGeneratedFikenLine={prependGeneratedFikenLine}
          appendGeneratedFikenLine={appendGeneratedFikenLine}
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
  prependGeneratedFikenLine: (line: FikenLine) => void;
  appendGeneratedFikenLine: (line: FikenLine) => void;
  removeGeneratedFikenLines: (lines: FikenLine[]) => void;
}

const WithFirstLine: VoidComponent<FikenSectionWithFirstLineProps> = (props) => {
  const lastLine: Accessor<FikenLine> = createMemo(
    () => props.generatedFikenLines().at(-1) ?? props.convertedFikenLines().at(-1) ?? props.firstLine(),
  );

  const previousDate = createMemo(() => endOfMonth(subMonths(props.firstLine().bokførtDato, 1)));
  const nextDate = createMemo(() => endOfMonth(addMonths(lastLine().bokførtDato, 1)));
  const canGenerateNextMonth = createMemo(() => isBefore(nextDate(), startOfMonth(new Date())));

  const generatePreviousMonth = () => {
    const month = previousDate().getMonth() + 1;
    const year = previousDate().getFullYear();

    umami.track('Generate previous month', { month, year });

    const { nordnetKonto, inngående } = props.firstLine();

    const [konto, setKonto] = createSignal<string>(nordnetKonto);

    props.prependGeneratedFikenLine({
      type: NordnetType.SALDO,
      fraKonto: konto,
      setFraKonto: setKonto,
      tilKonto: konto,
      setTilKonto: setKonto,
      nordnetKonto,
      referanse: `generert-saldo-${year}-${pad(month)}`,
      bokførtDato: previousDate(),
      forklarendeTekst: () => 'Saldo',
      generated: true,
      inn: 0n,
      ut: 0n,
      inngående,
      saldo: inngående,
      month,
      year,
      source: { fileName: null, rowNumber: -1 },
      isin: null,
      unexpectedSaldo: false,
    });
  };

  const generateNextMonth = () => {
    const month = nextDate().getMonth() + 1;
    const year = nextDate().getFullYear();

    umami.track('Generate next month', { month, year });

    const { nordnetKonto, saldo } = lastLine();

    const [konto, setKonto] = createSignal<string>(nordnetKonto);

    props.appendGeneratedFikenLine({
      type: NordnetType.SALDO,
      fraKonto: konto,
      setFraKonto: setKonto,
      tilKonto: konto,
      setTilKonto: setKonto,
      nordnetKonto,
      referanse: `generert-saldo-${year}-${pad(month)}`,
      bokførtDato: nextDate(),
      forklarendeTekst: () => 'Saldo',
      generated: true,
      inn: 0n,
      ut: 0n,
      inngående: saldo,
      saldo,
      month,
      year,
      source: { fileName: null, rowNumber: -1 },
      isin: null,
      unexpectedSaldo: false,
    });
  };

  const generatedFikenFiles = createMemo(() => fikenLinesToFikenFiles(props.generatedFikenLines()));
  const convertedFikenFiles = createMemo(() => fikenLinesToFikenFiles(props.convertedFikenLines()));

  const firstConvertedFile = () => convertedFikenFiles().at(0);

  const generatedPreviousFikenFiles = createMemo(() => {
    const first = firstConvertedFile();
    if (first === undefined) {
      return [];
    }
    return generatedFikenFiles().filter((f) => f.year < first.year || (f.year === first.year && f.month < first.month));
  });

  const generatedNextFikenFiles = createMemo(() => {
    const first = firstConvertedFile();
    if (first === undefined) {
      return [];
    }
    return generatedFikenFiles().filter(
      (f) => f.year > first.year || (f.year === first.year && f.month >= first.month),
    );
  });

  return (
    <Show when={convertedFikenFiles().length !== 0}>
      <Button onClick={generatePreviousMonth} variant={ButtonVariant.SECONDARY} icon={<CreationIcon />} spacing>
        Generer saldo for {format(previousDate(), 'MMMM yyyy', { locale: nb })}
      </Button>

      <Show when={convertedFikenFiles().length !== 0 || props.generatedFikenLines().length !== 0}>
        <div class="flex flex-col gap-y-4">
          <For each={generatedPreviousFikenFiles()}>
            {(fikenFile, index) => (
              <FikenFile
                fikenFile={fikenFile}
                // Only allow removing the first generated file, to prevent accidental holes.
                onRemove={index() === 0 ? () => props.removeGeneratedFikenLines(fikenFile.rows) : undefined}
              />
            )}
          </For>

          <For each={convertedFikenFiles()}>{(fikenFile) => <FikenFile fikenFile={fikenFile} />}</For>

          <For each={generatedNextFikenFiles()}>
            {(fikenFile, index) => (
              <FikenFile
                fikenFile={fikenFile}
                // Only allow removing the last generated file, to prevent accidental holes.
                onRemove={
                  index() === generatedNextFikenFiles().length - 1
                    ? () => props.removeGeneratedFikenLines(fikenFile.rows)
                    : undefined
                }
              />
            )}
          </For>
        </div>

        <Show when={canGenerateNextMonth()}>
          <div class="mt-4">
            <Button onClick={generateNextMonth} variant={ButtonVariant.SECONDARY} icon={<CreationIcon />}>
              Generer saldo for {format(nextDate(), 'MMMM yyyy', { locale: nb })}
            </Button>
          </div>
        </Show>
      </Show>

      <FikenDownloadButtons fikenFiles={() => [...generatedFikenFiles(), ...convertedFikenFiles()]} />
    </Show>
  );
};
