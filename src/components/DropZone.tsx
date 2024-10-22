import { type CsvFile, parseCsvFiles } from '@app/lib/csv';
import { type Accessor, type FlowComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';

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
    console.log('drag exit');
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver} onDragExit={onDragExit} $isDragOver={isDragOver}>
      {children}
    </Container>
  );
};

interface StyledProps {
  $isDragOver: Accessor<boolean>;
}

const Container = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &::before {
    content: 'Slipp filene her';
    font-size: 2rem;
    font-weight: bold;
    display: ${({ $isDragOver }) => ($isDragOver() ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-style: dashed;
    border-color: var(---text-color);
    border-width: 4px;
    transition: border-color .2s ease-in-out;
  }
`;
