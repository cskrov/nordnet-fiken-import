<script lang="ts">
  import Heading from "@app/components/heading.svelte";
  import Table from "@app/components/table.svelte";
  import Section from "@app/components/section.svelte";
  import type { Csv } from "@app/lib/csv";
  import CsvIcon from "virtual:icons/mdi/file-csv";
  import ExpandIcon from "virtual:icons/mdi/expand-more";
  import CollapseIcon from "virtual:icons/mdi/expand-less";
  import DeleteIcon from "virtual:icons/mdi/delete";
  import NordnetRow from "@app/components/nordnet/nordnet-row.svelte";

  interface Props {
    fileName: string;
    data: Csv;
    onDelete: () => void;
  }

  let { fileName, data, onDelete }: Props = $props();

  let isOpen = $state(false);

  const headers = data.headers;
  const rows = data.rows;

  const onclick = () => {
    isOpen = !isOpen;
  };
</script>

<Section variant={rows.length === 0 ? "inactive" : "surface"}>
  <Heading level={1} size="xsmall">
    <button {onclick} class="expand">
      {#if isOpen}
        <CollapseIcon />
      {:else}
        <ExpandIcon />
      {/if}
      <CsvIcon />
      <span>{fileName} ({rows.length} linjer)</span>
    </button>
    <button class="delete" onclick={onDelete}>
      <DeleteIcon />
    </button>
  </Heading>

  {#if isOpen}
    {#if rows.length === 0}
      <p><em>Ingen transaksjoner</em></p>
    {:else}
      <Table {headers} rowCount={rows.length} showLineNumbers>
        {#each rows as line, lineNumber}
          <NordnetRow {line} {lineNumber} />
        {/each}
      </Table>
    {/if}
  {/if}
</Section>

<style>
  button {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: left;
    column-gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    text-align: inherit;
    padding: 0;
  }

  .expand {
    flex-grow: 1;
  }

  .delete {
    flex-grow: 0;
    flex-shrink: 0;
    color: red;
  }
</style>
