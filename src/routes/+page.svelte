<script lang="ts">
  import AppContainer from "../components/app-container.svelte";
  import Heading from "../components/heading.svelte";
  import Button from "../components/button.svelte";
  import Row from "../components/row.svelte";
  import CSV from "../components/csv.svelte";
  import UploadButton from "../components/upload-button.svelte";
  import { toNordnetLines } from "$lib/nordnet/csv-to-nordnet-lines";
  import { downloadFikenMapMultipleCsv, downloadFikenMapSingleCsv, toFikenLines } from "$lib/fiken";
  import DownloadIcon from "virtual:icons/mdi/download";
  import DownloadMultipleIcon from "virtual:icons/mdi/download-multiple";
  import type { CsvFile } from "$lib/csv";
  import Input from "../components/input.svelte";
  import { browser } from "$app/environment";
  import FikenSection from "../components/fiken-section.svelte";
  import { Map } from 'svelte/reactivity';

  let fromAccount = $state(browser ? window.localStorage.getItem("fromAccount") ?? "" : "");

  const onFromAccountChange = (value: string) => {
    fromAccount = value;
    localStorage.setItem("fromAccount", value);
  };

  let csvFileMap = $state<Map<string, CsvFile>>(new Map());

  const setFiles = (files: CsvFile[]) => {
    for (const file of files) {
      csvFileMap.set(file.fileName, file);
    }

    const sortedCsvFiles = [...csvFileMap.values()].sort((a, b) => a.fileName.localeCompare(b.fileName));
    const nordnetLines = toNordnetLines(sortedCsvFiles);
    toFikenLines()
  };
</script>

<AppContainer onFiles={setFiles}>
  <header class="header">
    <Heading level={1} size="large" centered>Nordnet til Fiken</Heading>
    <p class="description">Konverter CSV fra Nordnet til et format Fiken forstår.</p>
  </header>
  
  <section>
    <Heading level={1} size="small" spacing>Nordnet</Heading>
  
    <Row>
      <UploadButton onFiles={setFiles} />
    </Row>
  
    {#if sortedCsvFiles.length === 0}
      <p>
        <em>
          Dra og slipp CSV-filer fra Nordnet hvor som helst for å få de oversatt
          til et format Fiken forstår.
        </em>
      </p>
    {:else}
      {#each sortedCsvFiles as { fileName, data }}
        <CSV {fileName} {data} />
      {/each}
    {/if}
  </section>

  <section>
    {#if fikenMap.size !== 0}
      <Heading level={1} size="small" spacing>Fiken</Heading>

      <Input onchange={onFromAccountChange} value={fromAccount} label="Fra konto (kontonummer)" placeholder="Kontonummer" />
  
      {#each sortedFikenMonths as [key, fikenLines]}
        <FikenSection {key} {fikenLines} />
      {/each}

      <Row>
        <Button onclick={() => downloadFikenMapSingleCsv(sortedFikenMonths)} variant="primary" size="large" icon={downloadIcon}>
          Last ned alle samlet
        </Button>
        <Button onclick={() => downloadFikenMapMultipleCsv(fikenMap)} variant="primary" size="large" icon={downloadMultipleIcon}>
          Last ned alle delt
        </Button>
      </Row>
    {/if}
  </section>

</AppContainer>

{#snippet downloadIcon()}
  <DownloadIcon  />
{/snippet}

{#snippet downloadMultipleIcon()}
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
</style>