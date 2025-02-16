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
      <Header className="pt-4 px-4" spacing>
        <Heading level={1} size={HeadingSize.LARGE} centered>
          Nordnet til Fiken
        </Heading>

        <p class="m-0 italic text-center">Konverter CSV eksportert fra Nordnet til et format Fiken forstår.</p>
      </Header>

      <main class="flex flex-col gap-y-8 grow px-4 pb-16">
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
            <p class="m-0 italic">Dra og slipp CSV-filer fra Nordnet hvor som helst.</p>
          </Show>

          <Show when={hasFiles()}>
            <div class="flex flex-col gap-y-4">
              <For each={csvFileList()}>
                {({ fileName, data }) => (
                  <NordnetSection fileName={fileName} data={data} onDelete={() => removeFile(fileName)} />
                )}
              </For>
            </div>
          </Show>
        </section>

        <FikenSection csvFiles={csvFileList} />
      </main>

      <AppFooter />
    </DropZone>
  );
};
