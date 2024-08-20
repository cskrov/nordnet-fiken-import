<script lang="ts">
  import Heading from "@app/components/heading.svelte";
  import ModalButton from "@app/components/modal-button.svelte";
  import type { CsvFile } from "@app/lib/csv";
  import { parseCsvFiles } from "@app/lib/csv";
  import { NORDNET_TYPES } from "@app/lib/nordnet/types";
  import type { Snippet } from "svelte";

  type OnFiles = (files: CsvFile[]) => void;

  interface Props {
    onFiles: OnFiles;
    children: Snippet;
  }

  let { onFiles, children }: Props = $props();

  let isDragOver = $state<boolean>(false);

  let onDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    isDragOver = false;

    if (event.dataTransfer === null) {
      return;
    }

    const parsed = await parseCsvFiles(event.dataTransfer.files);

    onFiles(parsed);
  };

  const disclaimerShown = localStorage.getItem('disclaimer-shown') === 'true';

  const onDisclaimerClose = () => {
    localStorage.setItem('disclaimer-shown', 'true');
  };
</script>

<main
  ondrop={onDrop}
  ondragover={(e) => {
    e.preventDefault();
    isDragOver = true;
  }}
  ondragexit={() => {
    isDragOver = false;
  }}
  ondragleave={() => {
    isDragOver = false;
  }}
  class:drag-over={isDragOver}
>
  {@render children()}
</main>

<footer>
  <span>
    Denne tjenesten har ingen relasjon til Fiken eller Nordnet. Bruk på eget ansvar.
  </span>

  <ModalButton buttonText="Mer info" size="small" variant="primary" defaultOpen={!disclaimerShown} onClose={onDisclaimerClose}>
    <Heading level={2} size="small">Støttede Nordnet-transaksjoner</Heading>
    <p>
      <span>Følgende transaksjonstyper fra Nordnet støttes:</span>
      {#each NORDNET_TYPES as type}
        <span class="type">{type}</span>
      {/each}
    </p>
    <p>
      Om du har eksportert filer fra Nordnet med andre typer enn de nevnt over, meld fra på <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank">GitHub</a> med de typene som mangler og hva de gjelder.
      Inkluder gjerne en eksempelfil.
    </p>
    
    <Heading level={2} size="small">Databehandling</Heading>
    <p>
      Alt prosesseres i nettleseren din. Ingen data sendes til server.
    </p>
    <p>
      Ingen sporing, ingen cookies, ingen annonser.
    </p>
    <p>
      Kontonumre lagres på enheten din med <span class="pre">localStorage</span>.
    </p>
    <p>
      Feil kan rapporteres som issues på <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank">GitHub</a>.
    </p>
  </ModalButton>
</footer>

<style>
  main {
    width: 100%;
    padding: 16px;
    padding-bottom: 64px;
    border-radius: 16px;
    border-width: 3px;
    border-style: dashed;
    border-color: transparent;
    transition: border-color 0.2s ease-in-out;
    overflow: visible;
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;

    &.drag-over {
      border-color: var(--primary-500);

      &::before {
        content: "Slipp filene her";
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        color: var(--primary-500);
        backdrop-filter: blur(4px);
        transition: backdrop-filter 0.2s ease-in-out;
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: row;
    column-gap: 1em;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 16px;
    background-color: var(--surface-900);
    box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.1);
    font-style: italic;
    font-size: 14px;

    .pre {
      font-family: monospace;
      color: darkgrey;
    }
  }

  p {
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }

  .type {
    font-family: monospace;
    font-size: 0.8em;
    background-color: #444;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
</style>
