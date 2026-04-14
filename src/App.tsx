import { createSignal, For, Show, type VoidComponent } from 'solid-js';
import { AppFooter } from '@/components/AppFooter';
import { Button, ButtonVariant } from '@/components/Button';
import { DropZone } from '@/components/DropZone';
import { AccountSections } from '@/components/Fiken/AccountSections';
import { Header } from '@/components/Header';
import { Heading, HeadingSize } from '@/components/Heading';
import { NordnetSection } from '@/components/Nordnet/NordnetSection';
import { Row } from '@/components/Row';
import { UploadButton } from '@/components/UploadButton';
import type { CsvFile } from '@/lib/csv';
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
      filesPerUpload: files.length,
    });

    setCsvFileList(newFileList);
  };

  const clearFiles = () => setCsvFileList([]);

  const hasFiles = () => csvFileList().length !== 0;

  return (
    <DropZone onFiles={addFiles}>
      <Header class="pt-4 px-4" spacing>
        <Heading level={1} size={HeadingSize.LARGE} centered>
          Nordnet til Fiken
        </Heading>

        <p class="italic text-center">Konverter CSV eksportert fra Nordnet til et format Fiken forstår.</p>
      </Header>

      <main class="flex flex-col gap-y-8 grow px-4 pb-16">
        <section>
          <Heading level={1} size={HeadingSize.SMALL} spacing>
            Nordnet
          </Heading>

          <Row class="mb-4">
            <UploadButton onFiles={addFiles} />

            <Show when={hasFiles()}>
              <Button variant={ButtonVariant.ERROR} icon={<DeleteAllIcon />} onClick={clearFiles}>
                Slett alle
              </Button>
            </Show>
          </Row>

          <Show when={!hasFiles()}>
            <p class="italic">Dra og slipp CSV-filer fra Nordnet hvor som helst.</p>
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

        <AccountSections csvFiles={csvFileList} />
      </main>

      <AppFooter />
    </DropZone>
  );
};
