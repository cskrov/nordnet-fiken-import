import { AppFooter } from '@app/components/AppFooter';
import { Button, ButtonVariant } from '@app/components/Button';
import { DropZone } from '@app/components/DropZone';
import { FikenSection } from '@app/components/FikenSection';
import { Header } from '@app/components/Header';
import { Heading, HeadingSize } from '@app/components/Heading';
import { NordnetSection } from '@app/components/NordnetSection';
import { Row } from '@app/components/Row';
import { UploadButton } from '@app/components/UploadButton';
import type { CsvFile } from '@app/lib/csv';
import { For, Show, type VoidComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import DeleteAllIcon from '~icons/mdi/delete-sweep';

export const App: VoidComponent = () => {
  const [csvFileMap, setCsvFileMap] = createSignal(new Map<string, CsvFile>());
  const csvFiles = () => [...csvFileMap().values()].sort((a, b) => a.fileName.localeCompare(b.fileName));

  const onUpload = (files: CsvFile[]) => {
    const updated = new Map(csvFileMap());
    for (const file of files) {
      updated.set(file.fileName, file);
    }
    setCsvFileMap(updated);
  };

  const hasFiles = () => csvFileMap().size !== 0;

  return (
    <DropZone onFiles={onUpload}>
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
            <UploadButton onFiles={onUpload} />

            <Show when={hasFiles()}>
              <Button variant={ButtonVariant.ERROR} icon={<DeleteAllIcon />} onClick={() => setCsvFileMap(new Map())}>
                Slett alle
              </Button>
            </Show>
          </Row>

          <Show when={!hasFiles()}>
            <Description>
              Dra og slipp CSV-filer fra Nordnet hvor som helst for å få de oversatt til et format Fiken forstår.
            </Description>
          </Show>

          <For each={csvFiles()}>
            {({ fileName, data }) => (
              <NordnetSection
                fileName={fileName}
                data={data}
                onDelete={() => {
                  const updated = new Map(csvFileMap());
                  updated.delete(fileName);
                  setCsvFileMap(updated);
                }}
              />
            )}
          </For>
        </section>

        <FikenSection csvFiles={csvFiles} />
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
