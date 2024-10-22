import { Button, ButtonVariant } from '@app/components/Button';
import { type CsvFile, parseCsvFiles } from '@app/lib/csv';
import { type VoidComponent, onCleanup } from 'solid-js';
import UploadMultipleIcon from '~icons/mdi/upload-multiple';

interface Props {
  onFiles: (files: CsvFile[]) => void;
}

export const UploadButton: VoidComponent<Props> = ({ onFiles }) => {
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '.csv';
  inputElement.multiple = true;

  const onChangeHandler = async (): Promise<void> => {
    const { files } = inputElement;

    if (files !== null) {
      onFiles(await parseCsvFiles(files));
    }
  };

  inputElement.addEventListener('change', onChangeHandler);

  onCleanup(() => {
    inputElement.removeEventListener('change', onChangeHandler);
  });

  return (
    <Button onClick={() => inputElement.click()} variant={ButtonVariant.SECONDARY} icon={<UploadMultipleIcon />}>
      Last opp
    </Button>
  );
};
