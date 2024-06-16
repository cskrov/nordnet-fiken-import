<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    headers: string[];
    showLineNumbers?: boolean;
    rowCount: number;
    children: Snippet;
  }

  let { headers = [], showLineNumbers = false, rowCount, children }: Props = $props();
</script>

<div class="container">
  <table>
    <thead>
      <tr>
        {#if showLineNumbers}
          <th>#</th>
        {/if}
        {#each headers as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {@render children()}
    </tbody>
    <tfoot>
      <tr>
        <td>{rowCount} rader</td>
      </tr>
    </tfoot>
  </table>
</div>

<style>
  .container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-color: var(--table-border-color);
    border-radius: 4px;
    margin-bottom: 1em;
    overflow: hidden;

    & th {
      text-align: left;
      padding: 0.5em;
      white-space: nowrap;

      &:not(:last-child) {
        width: fit-content;
      }
    }

    & thead {
      background-color: var(--table-header);
    }

    & tfoot {
      background-color: var(--table-footer);
      font-style: italic;
      font-size: 0.8em;
      white-space: nowrap;

      td {
        position: sticky;
        left: 0;
      }
    }
  }
</style>
