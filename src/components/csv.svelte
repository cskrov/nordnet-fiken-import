<script lang="ts">
  import Heading from "./heading.svelte";
  import Table from "./table.svelte";
  import Section from "./section.svelte";
  import type { Csv } from "$lib/csv";
  import CsvIcon from "virtual:icons/mdi/file-csv";
  import ExpandIcon from "virtual:icons/mdi/expand-more";
  import CollapseIcon from "virtual:icons/mdi/expand-less";

  interface Props {
    fileName: string;
    data: Csv;
  }

  let { fileName, data }: Props = $props();

  let isOpen = $state(false);

  const headers = data.headers;
  const rows = data.rows;

  const onclick = () => {
    isOpen = !isOpen;
  };
</script>

<Section variant="surface">
  <Heading level={1} size="xsmall">
    <button {onclick}>
      {#if isOpen}
        <CollapseIcon />
      {:else}
        <ExpandIcon />
      {/if}
      <CsvIcon />
      <span>{fileName} ({rows.length})</span>
    </button>
  </Heading>

  {#if isOpen}
    {#if rows.length === 0}
      <p><em>Ingen transaksjoner</em></p>
    {:else}
      <Table {headers} {rows} />
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
    width: 100%;
  }
</style>
