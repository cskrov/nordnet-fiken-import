import { AppFooter } from '@app/components/AppFooter';
import { Button, ButtonVariant } from '@app/components/Button';
import { DropZone } from '@app/components/DropZone';
import { FikenSection } from '@app/components/Fiken/FikenSection';
import { Header } from '@app/components/Header';
import { Heading, HeadingSize } from '@app/components/Heading';
import { NordnetSection } from '@app/components/Nordnet/NordnetSection';
import { Row } from '@app/components/Row';
import { UploadButton } from '@app/components/UploadButton';
import type { CsvFile } from '@app/lib/csv';
import { For, Show, type VoidComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import DeleteAllIcon from '~icons/mdi/delete-sweep';

export const App: VoidComponent = () => {
  const [csvFileList, setCsvFileList] = createSignal<CsvFile[]>([]);

  const removeFile = (fileName: string) => setCsvFileList(csvFileList().filter((file) => file.fileName !== fileName));

  const addFiles = (files: CsvFile[]) => {
    const previousFileList = csvFileList();
    const newFileList = [...previousFileList.filter((e) => !files.some((n) => n.fileName === e.fileName)), ...files];

    umami.track('Files added', {
      addedFileCount: files.length,
      adddedRowCount: files.reduce((acc, file) => acc + file.data.rows.length, 0),
      newFileCount: newFileList.length,
      newRowCount: newFileList.reduce((acc, file) => acc + file.data.rows.length, 0),
      previousFileCount: previousFileList.length,
      previousRowCount: previousFileList.reduce((acc, file) => acc + file.data.rows.length, 0),
    });

    setCsvFileList(newFileList);
  };

  const clearFiles = () => setCsvFileList([]);

  const hasFiles = () => csvFileList().length !== 0;

  return (
    <DropZone onFiles={addFiles}>
      <AppHeader>
        <Heading level={1} size={HeadingSize.LARGE} centered>
          Nordnet til Fiken
        </Heading>

        <Subtitle>Konverter CSV eksportert fra Nordnet til et format Fiken forstår.</Subtitle>
      </AppHeader>

      <Main>
        <section>
          <Heading level={1} size={HeadingSize.SMALL} spacing>
            Nordnet
          </Heading>

          <Row>
            <UploadButton onFiles={addFiles} />

            <Show when={hasFiles()}>
              <Button variant={ButtonVariant.ERROR} icon={<DeleteAllIcon />} onClick={clearFiles}>
                Slett alle
              </Button>
            </Show>
          </Row>

          <Show when={!hasFiles()}>
            <Description>
              Dra og slipp CSV-filer fra Nordnet hvor som helst for å få de oversatt til et format Fiken forstår.
            </Description>
          </Show>

          <For each={csvFileList()}>
            {({ fileName, data }) => (
              <NordnetSection fileName={fileName} data={data} onDelete={() => removeFile(fileName)} />
            )}
          </For>
        </section>

        <FikenSection csvFiles={csvFileList} />
      </Main>

      <AppFooter />
    </DropZone>
  );
};

const AppHeader = styled(Header)`
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  flex-grow: 1;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 64px;
`;

const Description = styled.p`
  margin: 0;
  font-style: italic;
`;

const Subtitle = styled(Description)`
  text-align: center;
`;
