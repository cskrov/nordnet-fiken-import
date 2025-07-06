import { type CsvFile, parseCsvFiles } from '@app/lib/csv';
import { createSignal, type FlowComponent } from 'solid-js';

interface Props {
  onFiles: (files: CsvFile[]) => void;
}

export const DropZone: FlowComponent<Props> = ({ onFiles, children }) => {
  const [isDragOver, setIsDragOver] = createSignal(false);

  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    if (event.dataTransfer === null) {
      return;
    }

    const { files } = event.dataTransfer;
    const csvFiles = await parseCsvFiles(files);
    onFiles(csvFiles);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const onDragExit = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Drop zone
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragExit={onDragExit}
      data-label="Slipp her"
      class={`flex flex-col w-full h-full ${isDragOver() ? 'before:flex' : 'before:hidden'} ${beforeClasses}`}
    >
      {children}
    </div>
  );
};

const beforeClasses = `
before:content-[attr(data-label)]
before:text-4xl
before:items-center
before:justify-center
before:backdrop-blur-xs
before:absolute
before:top-0
before:left-0
before:right-0
before:bottom-0
before:border-dashed
before:border-white
before:border-4
before:transition-colors
before:duration-200
before:ease-in-out
`
  .trim()
  .replaceAll('\n', ' ');
