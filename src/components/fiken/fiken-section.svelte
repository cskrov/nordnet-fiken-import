<script lang="ts">
  import Section from "@app/components/section.svelte";
  import Header from "@app/components/header.svelte";
  import Heading from "@app/components/heading.svelte";
  import Button from "@app/components/button.svelte";
  import Modal from "@app/components/modal.svelte";
  import Table from "@app/components/table.svelte";
  import { FIKEN_TABLE_HEADERS } from "@app/lib/fiken/fiken-csv";
  import { downloadFikenLinesCsv } from "@app/lib/download";
  import type { FikenFile } from "@app/lib/fiken/fiken-files";
  import DownloadIcon from "virtual:icons/mdi/download";
  import HelpIcon from "virtual:icons/mdi/help-circle";
  import WarningIcon from "virtual:icons/mdi/warning";
  import FikenRow from "@app/components/fiken/fiken-row.svelte";
  import { isLastDayOfMonth } from "date-fns";
  import ModalButton from "@app/components/modal-button.svelte";
  import { MONTHS, isMonth } from "@app/lib/month";

  let { fileName, month, year, rows }: FikenFile = $props();

  let errorMessage = $state<string | null>(null);
  let showErrorModal = $state(false);
    
  const closeError = () => { showErrorModal = false; };

  const onClick = () => {
    try {
      downloadFikenLinesCsv(rows, fileName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        errorMessage = error.message;
        showErrorModal = true;
      }
    }
  };

  const isCurrentMonth = $derived.by(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return year === currentYear && month === currentMonth && !isLastDayOfMonth(now);
  });

  const isGenerated = $derived(rows.every((row) => row.generated));
</script>

<Section variant={"surface"}>
  <Header>
    <Heading level={1} size="small">
      <span>{year} {isMonth(month) ? MONTHS.get(month) : 'Ukjent måned'}</span>
    </Heading>
    
    <span class="filename" aria-label="filnavn">{fileName}</span>

    <div class="button-container">
      {#if isCurrentMonth}
        <ModalButton buttonText="Inneværende" variant="warning" size="small" icon={warningIcon}>
          <span>
            Dette er inneværende måned og er derfor ufullstendig.
          </span>
          <span>
            Fiken anbefaler å vente til én uke etter måneden er over.
          </span>
          <span>
            Fiken vil ikke kunne avstemme måneden før måneden er over.
          </span>
        </ModalButton>
      {/if}

      {#if isGenerated}
        <ModalButton buttonText="Generert" variant="secondary" size="small" icon={helpIcon}>
          Denne måneden er fylt inn for at Fiken skal kunne avstemme måneden.
        </ModalButton>
      {/if}

      <Button onclick={onClick} variant="primary" size="small" icon={downloadIcon}>
        Last ned
      </Button>
      <Modal isOpen={showErrorModal} onClose={closeError} variant="error">
        {errorMessage}
      </Modal>
    </div>
  </Header>
  
  <Table
    headers={FIKEN_TABLE_HEADERS}
    showLineNumbers
    rowCount={rows.length}
  >
    {#each rows as line, lineNumber}
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

{#snippet warningIcon()}
  <WarningIcon />
{/snippet}

<style>
  .button-container {
    display: flex;
    gap: 0.5rem;
  }

  .filename {
    font-family: monospace;
    font-style: italic;
    font-size: 1rem;
    margin-left: 1em;
    margin-right: auto;
  }
</style>
