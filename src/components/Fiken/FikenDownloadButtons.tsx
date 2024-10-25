import { Button, ButtonSize, ButtonVariant } from '@app/components/Button';
import { Modal } from '@app/components/Modal/Modal';
import { ModalVariant } from '@app/components/Modal/types';
import { Row } from '@app/components/Row';
import { downloadFikenMapMultipleCsv, downloadFikenMapSingleCsv } from '@app/lib/download';
import type { FikenFileData } from '@app/lib/fiken/fiken-files';
import { type Accessor, type VoidComponent, createSignal } from 'solid-js';
import DownloadIcon from '~icons/mdi/Download';
import DownloadMultipleIcon from '~icons/mdi/DownloadMultiple';

interface FikenDownloadButtonsProps {
  fikenFiles: Accessor<FikenFileData[]>;
}

export const FikenDownloadButtons: VoidComponent<FikenDownloadButtonsProps> = ({ fikenFiles }) => {
  const [modalErrorMessage, setModalErrorMessage] = createSignal<string | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);

  const onClickDownloadSingle = () => {
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

  const onCLickDownloadSeparate = () => {
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
        Last ned alle - én fil
      </Button>
      <Button
        onClick={onCLickDownloadSeparate}
        variant={ButtonVariant.PRIMARY}
        size={ButtonSize.LARGE}
        icon={<DownloadMultipleIcon />}
      >
        Last ned alle - én fil per måned
      </Button>
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} variant={ModalVariant.ERROR}>
        <span>{modalErrorMessage()}</span>
      </Modal>
    </Row>
  );
};
