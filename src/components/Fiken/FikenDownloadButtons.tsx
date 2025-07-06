import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { Modal } from '@app/components/Modal/Modal';
import { ModalVariant } from '@app/components/Modal/types';
import { Row } from '@app/components/Row';
import { downloadFikenMapMultipleCsv, downloadFikenMapSingleCsv } from '@app/lib/download';
import type { FikenFileData } from '@app/lib/fiken/fiken-files';
import { type Accessor, createSignal, type VoidComponent } from 'solid-js';
import DownloadIcon from '~icons/mdi/Download';
import DownloadMultipleIcon from '~icons/mdi/DownloadMultiple';

interface FikenDownloadButtonsProps {
  fikenFiles: Accessor<FikenFileData[]>;
}

export const FikenDownloadButtons: VoidComponent<FikenDownloadButtonsProps> = ({ fikenFiles }) => {
  const [modalErrorMessage, setModalErrorMessage] = createSignal<string | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);

  const onClickDownloadSingle = () => {
    umami.track('Download all (single file)', getEventData(fikenFiles()));

    try {
      downloadFikenMapSingleCsv(fikenFiles().flatMap((f) => f.rows));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setModalErrorMessage(error.message);
        setShowErrorModal(true);
      }
    }
  };

  const onClickDownloadSeparate = () => {
    umami.track('Download all (separate files)', getEventData(fikenFiles()));

    try {
      downloadFikenMapMultipleCsv(fikenFiles());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setModalErrorMessage(error.message);
        setShowErrorModal(true);
      }
    }
  };

  return (
    <Row>
      <Button
        onClick={onClickDownloadSingle}
        variant={ButtonVariant.PRIMARY}
        size={ButtonSize.LARGE}
        icon={<DownloadIcon />}
      >
        Last ned alle i én fil
      </Button>
      <Button
        onClick={onClickDownloadSeparate}
        variant={ButtonVariant.PRIMARY}
        size={ButtonSize.LARGE}
        icon={<DownloadMultipleIcon />}
      >
        Last ned alle i separate filer
      </Button>
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} variant={ModalVariant.ERROR}>
        <span>{modalErrorMessage()}</span>
      </Modal>
    </Row>
  );
};

const getEventData = (allFiles: FikenFileData[]) => {
  const fromYear = allFiles.reduce((acc, file) => Math.min(acc, file.year), Number.POSITIVE_INFINITY);
  const toYear = allFiles.reduce((acc, file) => Math.max(acc, file.year), Number.NEGATIVE_INFINITY);
  const fromMonth = allFiles.reduce((acc, file) => Math.min(acc, file.month), Number.POSITIVE_INFINITY);
  const toMonth = allFiles.reduce((acc, file) => Math.max(acc, file.month), Number.NEGATIVE_INFINITY);
  const totalRows = allFiles.reduce((acc, file) => acc + file.rows.length, 0);
  const monthCount = allFiles.length;
  const generatedMonthCount = allFiles.filter((f) => f.rows.every((r) => r.generated)).length;

  return { fromYear, toYear, fromMonth, toMonth, totalRows, monthCount, generatedMonthCount };
};
