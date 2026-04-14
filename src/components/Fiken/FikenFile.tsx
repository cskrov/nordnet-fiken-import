import { format as formatDate, isLastDayOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale/nb';
import { createEffect, createResource, createSignal, Index, Show, type VoidComponent } from 'solid-js';
import { Button, ButtonSize, ButtonVariant } from '@/components/Button';
import { FikenRow } from '@/components/Fiken/FikenRow';
import { Heading, HeadingSize } from '@/components/Heading';
import { Modal } from '@/components/Modal/Modal';
import { ModalButton } from '@/components/Modal/ModalButton';
import { ModalVariant } from '@/components/Modal/types';
import { Section, SectionVariant } from '@/components/Section';
import { Table } from '@/components/Table';
import { downloadFikenLinesCsv } from '@/lib/download';
import { computeContentHash, getDownloadRecord, markAsDownloaded } from '@/lib/fiken/download-history';
import { FIKEN_TABLE_HEADERS } from '@/lib/fiken/fiken-csv';
import type { FikenFileData } from '@/lib/fiken/fiken-files';
import { isMonth, MONTHS } from '@/lib/month';
import CheckIcon from '~icons/mdi/Check';
import DeleteIcon from '~icons/mdi/Delete';
import DownloadIcon from '~icons/mdi/Download';
import HelpIcon from '~icons/mdi/HelpCircle';
import UpdateIcon from '~icons/mdi/Update';
import WarningIcon from '~icons/mdi/Warning';

interface FikenSectionProps {
  fikenFile: FikenFileData;
  onRemove?: () => void;
}

export const FikenFile: VoidComponent<FikenSectionProps> = (props) => {
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);

  const onCloseError = () => setShowErrorModal(false);

  const hasUnexpectedSaldo = () => isGenerated() && props.fikenFile.rows.some((row) => row.unexpectedSaldo);
  const isGenerated = () => props.fikenFile.rows.every((row) => row.generated);
  const isCurrentMonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return props.fikenFile.year === currentYear && props.fikenFile.month === currentMonth && !isLastDayOfMonth(now);
  };

  const [currentHash] = createResource(() => props.fikenFile, computeContentHash);

  const downloadRecord = () => getDownloadRecord(props.fikenFile.fileName);

  const hasChanged = () => {
    const record = downloadRecord();
    const hash = currentHash();
    return record !== undefined && hash !== undefined && record.hash !== hash;
  };

  createEffect(() => {
    if (hasUnexpectedSaldo()) {
      umami.track('Unexpected saldo', {
        year: props.fikenFile.year,
        month: props.fikenFile.month,
        rows: props.fikenFile.rows.length,
        generated: isGenerated(),
      });
    }
  });

  const onDownloadClick = async () => {
    umami.track('Download single', {
      year: props.fikenFile.year,
      month: props.fikenFile.month,
      rows: props.fikenFile.rows.length,
      generated: isGenerated(),
    });

    try {
      downloadFikenLinesCsv(props.fikenFile.rows, props.fikenFile.fileName);
      await markAsDownloaded(props.fikenFile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message);
        setShowErrorModal(true);
      }
    }
  };

  return (
    <Section variant={SectionVariant.SURFACE}>
      <header class="flex flex-row items-center justify-between">
        <Heading level={1} size={HeadingSize.XSMALL}>
          {props.fikenFile.year} {isMonth(props.fikenFile.month) ? MONTHS.get(props.fikenFile.month) : 'Ukjent måned'}
        </Heading>

        <span class="font-mono italic text-base ml-4 mr-auto">{props.fikenFile.fileName}</span>

        <div class="flex gap-2">
          <Show when={downloadRecord()}>
            {(record) => {
              const date = formatDate(new Date(record().downloadedAt), 'd. MMM yyyy HH:mm', { locale: nb });

              return (
                <span
                  class={`flex items-center gap-x-1 text-sm ${hasChanged() ? 'text-warning-600' : 'text-success-600'}`}
                >
                  {hasChanged() ? <UpdateIcon /> : <CheckIcon />}
                  {hasChanged() ? `Endret siden ${date}` : `Lastet ned ${date}`}
                </span>
              );
            }}
          </Show>

          <Show when={isCurrentMonth()}>
            <ModalButton
              buttonText="Inneværende"
              variant={ButtonVariant.WARNING}
              size={ButtonSize.SMALL}
              icon={<WarningIcon />}
            >
              <span>Dette er inneværende måned og er derfor ufullstendig.</span>
              <span>Fiken anbefaler å vente til én uke etter måneden er over.</span>
              <span>Fiken vil ikke kunne avstemme måneden før måneden er over.</span>
            </ModalButton>
          </Show>

          <Show when={props.onRemove}>
            {(_onRemove) => (
              <Button onClick={_onRemove()} variant={ButtonVariant.ERROR} size={ButtonSize.SMALL} icon={<DeleteIcon />}>
                Slett
              </Button>
            )}
          </Show>
          <Show when={hasUnexpectedSaldo()}>
            <ModalButton
              variant={ButtonVariant.ERROR}
              size={ButtonSize.SMALL}
              icon={<WarningIcon />}
              buttonText="Uventet saldo"
            >
              <span>Utgående saldo for denne måneden stemmer ikke overens med inngående saldo for neste måned.</span>
              <span>Har du glemt å laste opp en fil fra Nordnet?</span>
            </ModalButton>
          </Show>
          <Show when={isGenerated()}>
            <ModalButton
              buttonText="Generert"
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.SMALL}
              icon={<HelpIcon />}
            >
              Denne måneden er fylt inn for at Fiken skal kunne avstemme måneden.
            </ModalButton>
          </Show>

          <Button
            onClick={onDownloadClick}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SMALL}
            icon={<DownloadIcon />}
          >
            Last ned
          </Button>

          <Modal isOpen={showErrorModal} onClose={onCloseError} variant={ModalVariant.ERROR}>
            <span>{errorMessage()}</span>
          </Modal>
        </div>
      </header>

      <Table headers={FIKEN_TABLE_HEADERS} showLineNumbers rowCount={props.fikenFile.rows.length}>
        <Index each={props.fikenFile.rows}>
          {(line, lineNumber) => <FikenRow line={line} lineNumber={lineNumber} />}
        </Index>
      </Table>
    </Section>
  );
};
