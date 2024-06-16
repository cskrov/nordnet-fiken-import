<script lang="ts">
  interface Props {
    line: string[];
    lineNumber: number;
  }

  let { line, lineNumber }: Props = $props();
</script>

<tr>
  <td>{lineNumber + 1}</td>
  {#each line as column}
    <td>{column}</td>
  {/each}
</tr>

<style>
  tr {
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

  td {
    padding: 0.5em;
    white-space: nowrap;
  }
</style>
