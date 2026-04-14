import { onCleanup, type VoidComponent } from 'solid-js';
import { Button, ButtonVariant } from '@/components/Button';
import { type CsvFile, parseCsvFiles } from '@/lib/csv';
import UploadMultipleIcon from '~icons/mdi/upload-multiple';

interface Props {
  onFiles: (files: CsvFile[]) => void;
}

export const UploadButton: VoidComponent<Props> = (props) => {
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '.csv';
  inputElement.multiple = true;

  const onChangeHandler = async (): Promise<void> => {
    const { files } = inputElement;

    if (files !== null) {
      try {
        const csvFiles = await parseCsvFiles(files);
        umami.track('Files uploaded', { fileCount: csvFiles.length });
        props.onFiles(csvFiles);
      } catch (error) {
        umami.track('File parse error', { source: 'upload', error: String(error) });
      }
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
