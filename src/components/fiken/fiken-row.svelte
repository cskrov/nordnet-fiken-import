<script lang="ts">
  import SuccessIcon from "virtual:icons/mdi/success-circle";
  import { prettyFormatMoney } from "@app/lib/money";
  import type { FikenLine } from "@app/lib/fiken";
  import Money from "@app/components/fiken/money.svelte";
  import DateElement from "@app/components/fiken/date-element.svelte";
    import Account from "@app/components/fiken/account.svelte";
    import { NordnetType } from "@app/lib/nordnet/types";

  interface Props {
    line: FikenLine;
    lineNumber: number;
  }

  let { line, lineNumber }: Props = $props();

  const onAccountChange = (account: string) => {
    line.fraKonto = account;
  };
</script>

<tr>
  <td>{lineNumber + 1}</td>
  <td><DateElement date={line.bokførtDato} /></td>
  <td>
    {#if line.referanse === null}
      <span class="ignored">Ikke relevant</span>
    {:else if line.type === NordnetType.INNSKUDD}
      <Account account={line.fraKonto} referanse={line.referanse} onChange={onAccountChange} />
    {:else}
      <span>{line.fraKonto}</span>
    {/if}
  </td>
  <td>{line.tilKonto}</td>
  <td>{line.forklarendeTekst}</td>
  <td>{line.isin}</td>
  <td><Money amount={line.inngående} /></td>
  <td><Money amount={line.ut} reversed /></td>
  <td><Money amount={line.inn} /></td>
  <td><Money amount={line.saldo} /></td>
  <td>{line.referanse}</td>
  <td class="fadeout">{@render difference(line.difference)}</td>
  <td class="fadeout">{line.source.fileName === null ? null : `${line.source.fileName} (${line.source.rowNumber + 1})`}</td>
</tr>

{#snippet difference(difference: number)}
  {#if difference === 0}
    <SuccessIcon />
  {:else}
    <span>{prettyFormatMoney(difference)}</span>
  {/if}
{/snippet}

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

    &.fadeout {
      color: darkgray;
    }
  }

  .ignored {
    font-style: italic;
    color: darkgray;
  }
</style>
