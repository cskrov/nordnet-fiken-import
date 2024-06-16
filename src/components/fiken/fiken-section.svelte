<script lang="ts">
  import Section from "@app/components/section.svelte";
  import Header from "@app/components/header.svelte";
  import Heading from "@app/components/heading.svelte";
  import Button from "@app/components/button.svelte";
  import Modal from "@app/components/modal.svelte";
  import Table from "@app/components/table.svelte";
  import { FIKEN_TABLE_HEADERS } from "@app/lib/fiken";
  import { downloadFikenLinesCsv } from "@app/lib/download";
  import type { FikenFile } from "@app/lib/fiken";
  import DownloadIcon from "virtual:icons/mdi/download";
  import HelpIcon from "virtual:icons/mdi/help-circle";
  import ErrorIcon from "virtual:icons/mdi/error";
  import FikenRow from "@app/components/fiken/fiken-row.svelte";

  let { fileName, rows }: FikenFile = $props();

  let showModal = $state(false);
</script>

<Section variant="surface">
  <Header>
    <Heading level={3} size="small">
      <span>{fileName}</span>
    </Heading>
    
    <div class="button-container">
      {#if rows.length === 1 && rows[0]!.referanse === null}
        <Button variant="secondary" size="small" icon={helpIcon} onclick={() => {showModal = true;}} />
        <Modal isOpen={showModal} onClose={() => {showModal = false;}}>
          Denne måneden er fylt inn for at Fiken skal kunne avstemme måneden.
        </Modal>
      {/if}

      {#if rows.some(l => l.difference !== 0)}
        <Button variant="error" size="small" icon={errorIcon} onclick={() => {showModal = true;}} />
        <Modal isOpen={showModal} onClose={() => {showModal = false;}} variant="error">
          Det er forskjell i inngående beløp og forrige saldo.
        </Modal>
      {:else}
        <Button onclick={() => downloadFikenLinesCsv(rows, fileName)} variant="primary" size="small" icon={downloadIcon}>
          Last ned
        </Button>
      {/if}
    </div>
  </Header>
  
  <Table
    headers={FIKEN_TABLE_HEADERS}
    showLineNumbers
    rowCount={rows.length}
  >
    {#each rows.toSorted((a,b) => a.bokførtDato.getTime() - b.bokførtDato.getTime()) as line, lineNumber}
      <FikenRow {line} {lineNumber} />
    {/each}
  </Table>
</Section>

{#snippet downloadIcon()}
  <DownloadIcon  />
{/snippet}

{#snippet helpIcon()}
  <HelpIcon />
{/snippet}

{#snippet errorIcon()}
  <ErrorIcon />
{/snippet}

<style>
  .button-container {
    display: flex;
    gap: 0.5rem;
  }
</style>
