<script lang="ts">
  import AppContainer from "@app/components/app-container.svelte";
  import Heading from "@app/components/heading.svelte";
  import Button from "@app/components/button.svelte";
  import Row from "@app/components/row.svelte";
  import NordnetSection from "@app/components/nordnet/nordnet-section.svelte";
  import UploadButton from "@app/components/upload-button.svelte";
  import { toNordnetLines, fixNordnetLines } from "@app/lib/nordnet/csv-to-nordnet-lines";
  import { toFikenFiles, type FikenFile } from "@app/lib/fiken/fiken-files";
  import { downloadFikenMapMultipleCsv, downloadFikenMapSingleCsv } from "@app/lib/download";
  import DownloadIcon from "virtual:icons/mdi/download";
  import DownloadMultipleIcon from "virtual:icons/mdi/download-multiple";
  import DeleteMultipleIcon from "virtual:icons/mdi/delete-sweep";
  import type { CsvFile } from "@app/lib/csv";
  import FikenSection from "@app/components/fiken/fiken-section.svelte";
  import { SvelteMap } from 'svelte/reactivity';
  import { FROM_ACCOUNT_EVENT, FromAccountEvent, TO_ACCOUNT_EVENT } from "@app/lib/account-event";
  import Modal from "@app/components/modal.svelte";
  import { getForklarendeTekst } from "@app/lib/fiken/text";
  import { type NordnetLine } from "@app/lib/nordnet/types";

  let errorMessage = $state<string | null>(null);
  let csvFileMap = $state<SvelteMap<string, CsvFile>>(new SvelteMap());
  let rawNordnetLines = $state<NordnetLine[]>([]);
  let nordnetLines = $state<NordnetLine[]>([]);
  let fikenFiles = $state<FikenFile[]>([]);

  const setFiles = (files: CsvFile[]) => {
    for (const file of files) {
      csvFileMap.set(file.fileName, file);
    }
  };

  $effect(() => {
    try {
      const sortedCsvFiles = [...csvFileMap.values()].sort((a, b) => a.fileName.localeCompare(b.fileName));
      rawNordnetLines = toNordnetLines(sortedCsvFiles);
    } catch (e) {
      rawNordnetLines = [];
      nordnetLines = [];
      fikenFiles = [];
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = "Ukjent feil";
      }
    }
  });

  $effect(() => {
    try {
      nordnetLines = fixNordnetLines(rawNordnetLines);
    } catch (e) {
      nordnetLines = [];
      fikenFiles = [];
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = "Ukjent feil";
      }
    }
  });

  $effect(() => {
    try {
      fikenFiles = toFikenFiles(nordnetLines);
    } catch (e) {
      fikenFiles = [];
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = "Ukjent feil";
      }
    }
  });

  let fikenSectionElement = $state<HTMLElement | null>(null);

  const fromAccountListener = (event: Event) => {
    if (event instanceof FromAccountEvent) {
      event.stopPropagation();
      console.log('from', event.account);
      const { account, line } = event;
      const nordnetLine = nordnetLines.find((n) => n.id === line.referanse);
      const forklarendeTekst = nordnetLine === undefined ? line.forklarendeTekst : getForklarendeTekst(nordnetLine, account, line.tilKonto);

      fikenFiles = fikenFiles.map((f) => {
        if (!f.rows.includes(line)) {
          return f;
        }

        return ({
          ...f,
          rows: f.rows.map((r) => r === line ? { ...r, fraKonto: account, forklarendeTekst } : r)
        });
      })
    }
  };

  const toAccountListener = (event: Event) => {
    if (event instanceof FromAccountEvent) {
      event.stopPropagation();
      console.log('to', event.account);
      const { account, line } = event;
      const nordnetLine = nordnetLines.find((n) => n.id === line.referanse);
      const forklarendeTekst = nordnetLine === undefined ? line.forklarendeTekst : getForklarendeTekst(nordnetLine, line.fraKonto, account);

      fikenFiles = fikenFiles.map((f) => {
        if (!f.rows.includes(line)) {
          return f;
        }

        return ({
          ...f,
          rows: f.rows.map((r) => r === line ? { ...r, tilKonto: account, forklarendeTekst } : r)
        });
      })
    }
  };

  $effect(() => {
    fikenSectionElement?.addEventListener(FROM_ACCOUNT_EVENT, fromAccountListener);
    fikenSectionElement?.addEventListener(TO_ACCOUNT_EVENT, toAccountListener);

    return () => {
      fikenSectionElement?.removeEventListener(FROM_ACCOUNT_EVENT, fromAccountListener);
      fikenSectionElement?.removeEventListener(TO_ACCOUNT_EVENT, toAccountListener);
    };
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
  <DeleteMultipleIcon  />
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