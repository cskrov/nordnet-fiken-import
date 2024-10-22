import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { FikenRow } from '@app/components/FikenRow';
import { Heading, HeadingSize } from '@app/components/Heading';
import { Modal } from '@app/components/Modal/Modal';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { ModalVariant } from '@app/components/Modal/types';
import { Section, SectionVariant } from '@app/components/Section';
import { Table } from '@app/components/Table';
import { downloadFikenLinesCsv } from '@app/lib/download';
import { FIKEN_TABLE_HEADERS } from '@app/lib/fiken/fiken-csv';
import { type NordnetMonth, nordnetMonthToFikenMonth } from '@app/lib/fiken/fiken-files';
import { MONTHS, isMonth } from '@app/lib/month';
import { isLastDayOfMonth } from 'date-fns';
import { Index, Show, type VoidComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import DownloadIcon from '~icons/mdi/Download';
import HelpIcon from '~icons/mdi/HelpCircle';
import WarningIcon from '~icons/mdi/Warning';

interface FikenSectionProps {
  nordnetMonth: NordnetMonth;
}

export const FikenFile: VoidComponent<FikenSectionProps> = ({ nordnetMonth }) => {
  const fikenMonth = nordnetMonthToFikenMonth(nordnetMonth);
  const { month, year, rows, fileName } = fikenMonth;
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);

  const onCloseError = () => setShowErrorModal(false);

  const onClick = () => {
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

  const isCurrentMonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return year === currentYear && month === currentMonth && !isLastDayOfMonth(now);
  };

  return (
    <Section variant={SectionVariant.SURFACE}>
      <Header>
        <Heading level={1} size={HeadingSize.XSMALL}>
          {year} {isMonth(month) ? MONTHS.get(month) : 'Ukjent måned'}
        </Heading>

        <FileName aria-label="filnavn">{fileName}</FileName>

        <ButtonContainer>
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

          <Button onClick={onClick} variant={ButtonVariant.PRIMARY} size={ButtonSize.SMALL} icon={<DownloadIcon />}>
            Last ned
          </Button>

          <Modal isOpen={showErrorModal} onClose={onCloseError} variant={ModalVariant.ERROR}>
            <span>{errorMessage()}</span>
          </Modal>
        </ButtonContainer>
      </Header>

      <Table headers={FIKEN_TABLE_HEADERS} showLineNumbers rowCount={rows.length}>
        <Index each={rows}>{(line, lineNumber) => <FikenRow line={line} lineNumber={lineNumber} />}</Index>
      </Table>
    </Section>
  );
};

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const FileName = styled.span`
  font-family: "Roboto Mono", monospace;
  font-style: italic;
  font-size: 1rem;
  margin-left: 1em;
  margin-right: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;