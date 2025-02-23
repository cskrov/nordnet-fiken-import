import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { FikenRow } from '@app/components/Fiken/FikenRow';
import { Heading, HeadingSize } from '@app/components/Heading';
import { Modal } from '@app/components/Modal/Modal';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { ModalHeading } from '@app/components/Modal/ModalHeading';
import { ModalVariant } from '@app/components/Modal/types';
import { Section, SectionVariant } from '@app/components/Section';
import { Table } from '@app/components/Table';
import { downloadFikenLinesCsv } from '@app/lib/download';
import { FIKEN_TABLE_HEADERS } from '@app/lib/fiken/fiken-csv';
import type { FikenFileData } from '@app/lib/fiken/fiken-files';
import { MONTHS, isMonth } from '@app/lib/month';
import { isLastDayOfMonth } from 'date-fns';
import { Index, Show, type VoidComponent, createSignal } from 'solid-js';
import DeleteIcon from '~icons/mdi/Delete';
import DownloadIcon from '~icons/mdi/Download';
import HelpIcon from '~icons/mdi/HelpCircle';
import WarningIcon from '~icons/mdi/Warning';

interface FikenSectionProps {
  fikenFile: FikenFileData;
  onRemove?: () => void;
}

export const FikenFile: VoidComponent<FikenSectionProps> = ({ fikenFile, onRemove }) => {
  const { month, year, rows, fileName } = fikenFile;
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);

  const onCloseError = () => setShowErrorModal(false);

  const onDownloadClick = () => {
    umami.track('Download single');

    try {
      downloadFikenLinesCsv(rows, fileName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message);
        setShowErrorModal(true);
      }
    }
  };

  const isGenerated = () => rows.every((row) => row.generated);
  const hasUnexpectedSaldo = () => isGenerated() && rows.some((row) => row.unexpectedSaldo);

  const isCurrentMonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return year === currentYear && month === currentMonth && !isLastDayOfMonth(now);
  };

  return (
    <Section variant={SectionVariant.SURFACE}>
      <header class="flex flex-row items-center justify-between">
        <Heading level={1} size={HeadingSize.XSMALL}>
          {year} {isMonth(month) ? MONTHS.get(month) : 'Ukjent måned'}
        </Heading>

        <span class="font-mono italic text-base ml-4 mr-auto" aria-label="filnavn">
          {fileName}
        </span>

        <div class="flex gap-2">
          <Show when={isCurrentMonth()}>
            <ModalButton text="Inneværende" variant={ButtonVariant.WARNING} size={ButtonSize.SMALL} icon={WarningIcon}>
              <span>Dette er inneværende måned og er derfor ufullstendig.</span>
              <span>Fiken anbefaler å vente til én uke etter måneden er over.</span>
              <span>Fiken vil ikke kunne avstemme måneden før måneden er over.</span>
            </ModalButton>
          </Show>

          <Show when={onRemove}>
            {(_onRemove) => (
              <Button onClick={_onRemove()} variant={ButtonVariant.ERROR} size={ButtonSize.SMALL} icon={DeleteIcon}>
                Slett
              </Button>
            )}
          </Show>
          <Show when={hasUnexpectedSaldo()}>
            <ModalButton variant={ButtonVariant.ERROR} size={ButtonSize.SMALL} icon={WarningIcon} text="Uventet saldo">
              <span>Utgående saldo for denne måneden stemmer ikke overens med inngående saldo for neste måned.</span>
              <span>Har du glemt å laste opp en fil fra Nordnet?</span>
            </ModalButton>
          </Show>
          <Show when={isGenerated()}>
            <ModalButton text="Generert" variant={ButtonVariant.SECONDARY} size={ButtonSize.SMALL} icon={HelpIcon}>
              Denne måneden er fylt inn for at Fiken skal kunne avstemme måneden.
            </ModalButton>
          </Show>

          <Button onClick={onDownloadClick} variant={ButtonVariant.PRIMARY} size={ButtonSize.SMALL} icon={DownloadIcon}>
            Last ned
          </Button>

          <Modal
            isOpen={showErrorModal}
            onClose={onCloseError}
            variant={ModalVariant.ERROR}
            heading="Feil"
            icon={WarningIcon}
          >
            <ModalHeading variant={ModalVariant.ERROR} />
            <span>{errorMessage()}</span>
          </Modal>
        </div>
      </header>

      <Table headers={FIKEN_TABLE_HEADERS} showLineNumbers rowCount={rows.length}>
        <Index each={rows}>{(line, lineNumber) => <FikenRow line={line} lineNumber={lineNumber} />}</Index>
      </Table>
    </Section>
  );
};
