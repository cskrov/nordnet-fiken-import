<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    headers: string[];
    rows: (string | null)[][];
  }

  let { headers = [], rows = [] }: Props = $props();
</script>

<div class="container">
  <table>
    <thead>
      <tr>
        {#each headers as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each row as cell}
            <td>
              {#if cell === null}
                <em>&lt;ingen&gt;</em>
              {:else}
                <span>{cell}</span>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td>{rows.length} rader</td>
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

    & td,
    th {
      text-align: left;
      padding: 0.5em;
      white-space: nowrap;
    }

    & thead {
      background-color: var(--table-header);
    }

    & tbody {
      & tr {
        &:nth-of-type(odd) {
          background-color: var(--table-odd-row);
        }

        &:nth-of-type(even) {
          background-color: var(--table-even-row);
        }

        &:hover {
          background-color: var(--table-hover-row);
        }
      }
    }

    & tfoot {
      background-color: var(--table-footer);
      font-style: italic;
      font-size: 0.8em;

      td {
        position: sticky;
        left: 0;
      }
    }
  }
</style>
