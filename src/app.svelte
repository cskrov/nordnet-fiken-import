<script lang="ts">
  import AppContainer from "@app/components/app-container.svelte";
  import Heading from "@app/components/heading.svelte";
  import Button from "@app/components/button.svelte";
  import Row from "@app/components/row.svelte";
  import NordnetSection from "@app/components/nordnet/nordnet-section.svelte";
  import UploadButton from "@app/components/upload-button.svelte";
  import { toNordnetLines, fixNordnetLines } from "@app/lib/nordnet/csv-to-nordnet-lines";
  import { toFikenFiles, type FikenFile } from "@app/lib/fiken";
  import { downloadFikenMapMultipleCsv, downloadFikenMapSingleCsv } from "@app/lib/download";
  import DownloadIcon from "virtual:icons/mdi/download";
  import DownloadMultipleIcon from "virtual:icons/mdi/download-multiple";
  import type { CsvFile } from "@app/lib/csv";
  import FikenSection from "@app/components/fiken/fiken-section.svelte";
  import { SvelteMap } from 'svelte/reactivity';
  import { AccountEvent } from "@app/lib/account-event";
  import Modal from "@app/components/modal.svelte";

  let errorMessage = $state<string | null>(null);

  let csvFileMap = $state<SvelteMap<string, CsvFile>>(new SvelteMap());
  let fikenFiles = $state<FikenFile[]>([]);

  const setFiles = (files: CsvFile[]) => {
    for (const file of files) {
      csvFileMap.set(file.fileName, file);
    }
  };

  $effect(() => {
    const sortedCsvFiles = [...csvFileMap.values()].sort((a, b) => a.fileName.localeCompare(b.fileName));
    try {
      const allNordnetLines = toNordnetLines(sortedCsvFiles);
      const fixedNordnetLines = fixNordnetLines(allNordnetLines);
      fikenFiles = toFikenFiles(fixedNordnetLines);
    } catch (e) {
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = "Ukjent feil";
      }
    }
  });

  let fikenSectionElement = $state<HTMLElement | null>(null);

  $effect(() => {
    fikenSectionElement?.addEventListener('account', (event) => {
      if (event instanceof AccountEvent) {
        const { account, line } = event;
        line.fraKonto = account;
      }
    });
  });

  $effect(() => {
    if (csvFileMap.size === 0) {
      errorMessage = null;
    }
  });

  let modalErrorMessage = $state<string|null>(null);
  let showErrorModal = $state(false);

  const onClickDownloadSingle = () => {
    try {
      downloadFikenMapSingleCsv(fikenFiles.flatMap((f) => f.rows));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        modalErrorMessage = error.message;
        showErrorModal = true;
      }
    }
  };

  const onCLickDownloadSeparate = () => {
    try {
      downloadFikenMapMultipleCsv(fikenFiles);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        modalErrorMessage = error.message;
        showErrorModal = true;
      }
    }
  };
</script>

<AppContainer onFiles={setFiles}>
  <header class="header">
    <Heading level={1} size="large" centered>Nordnet til Fiken</Heading>
    <p class="description">Konverter CSV eksportert fra Nordnet til et format Fiken forstår.</p>
  </header>
  
  <section>
    <Heading level={1} size="small" spacing>Nordnet</Heading>
  
    <Row>
      <UploadButton onFiles={setFiles} />
      {#if csvFileMap.size !== 0}
        <Button variant="error" icon={deleteAllIcon} onclick={() => csvFileMap.clear()}>Slett alle</Button>
      {/if}
    </Row>
  
    {#if csvFileMap.size === 0}
      <p>
        <em>
          Dra og slipp CSV-filer fra Nordnet hvor som helst for å få de oversatt
          til et format Fiken forstår.
        </em>
      </p>
    {:else}
      {#each csvFileMap as [fileName, { data }]}
        <NordnetSection {fileName} {data} onDelete={() => csvFileMap.delete(fileName)} />
      {/each}
    {/if}
  </section>

  {#if errorMessage !== null}
    <section>
      <Heading level={1} size="small" spacing>Feil</Heading>
      <p class="error-messages">{errorMessage}</p>
    </section>
  {/if}

  {#if fikenFiles.length !== 0}
    <section bind:this={fikenSectionElement}>
      <Heading level={1} size="small" spacing>Fiken</Heading>
  
      {#each fikenFiles as fikenFile}
        <FikenSection {...fikenFile} />
      {/each}

      <Row>
        <Button onclick={onClickDownloadSingle} variant="primary" size="large" icon={downloadIcon}>
          Last ned alle - én fil
        </Button>
        <Button onclick={onCLickDownloadSeparate} variant="primary" size="large" icon={downloadMultipleIcon}>
          Last ned alle - én fil per måned
        </Button>
        <Modal isOpen={showErrorModal} onClose={() => {showErrorModal = false;}} variant="error">
          {modalErrorMessage}
        </Modal>
      </Row>
    </section>
  {/if}

</AppContainer>

{#snippet downloadIcon()}
  <DownloadIcon  />
{/snippet}

{#snippet downloadMultipleIcon()}
  <DownloadMultipleIcon  />
{/snippet}

{#snippet deleteAllIcon()}
  <DownloadMultipleIcon  />
{/snippet}

<style>
  .header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
  }

  .description {
    margin: 0;
    font-style: italic;
    text-align: center;
  }

  .error-messages {
    white-space: pre;
  }
</style>