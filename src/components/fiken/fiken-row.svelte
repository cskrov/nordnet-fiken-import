<script lang="ts">
  import { isInnskuddLine, isUttakLine } from "@app/lib/fiken/guards";
  import type { FikenLine } from "@app/lib/fiken/types";
  import Money from "@app/components/fiken/money.svelte";
  import DateElement from "@app/components/fiken/date-element.svelte";
  import Account from "@app/components/fiken/account.svelte";
  import HelpIcon from "virtual:icons/mdi/help-circle";
  import ModalButton from "@app/components/modal-button.svelte";

  interface Props {
    line: FikenLine;
    lineNumber: number;
  }

  let { line, lineNumber }: Props = $props();

  const source = $derived(
    line.source.fileName === null
      ? null
      : `${line.source.fileName} (${line.source.rowNumber + 1})`,
  );
</script>

<tr class={line.generated ? 'generated' : undefined}>
  <td>{lineNumber + 1}</td>
  <td><DateElement date={line.bokførtDato} /></td>
  <td>
    {#if isInnskuddLine(line)}
      <Account account={line.fraKonto} {line} />
    {:else if line.fraKonto === null}
      <span class="ignored">Ikke relevant</span>
    {:else}
      <span>{line.fraKonto}</span>
    {/if}
  </td>
  <td>
    {#if isUttakLine(line)}
      <Account account={line.tilKonto} {line} />
    {:else if line.tilKonto === null}
      <span class="ignored">Ikke relevant</span>
    {:else}
      <span>{line.tilKonto}</span>
    {/if}
  </td>
  <td>{line.forklarendeTekst}</td>
  <td>{line.isin}</td>
  <td><Money amount={line.inngående} /></td>
  <td><Money amount={line.ut} reversed /></td>
  <td><Money amount={line.inn} /></td>
  <td><Money amount={line.saldo} /></td>
  <td>{line.referanse}</td>
  <td>
    {#if line.generated}
      <ModalButton
        variant="secondary"
        size="small"
        icon={helpIcon}
        buttonText="Generert"
      >
        Denne raden er fylt inn for at Fiken skal kunne avstemme måneden.
      </ModalButton>
    {:else}
      <span class="fadeout">{source}</span>
    {/if}
  </td>
</tr>

{#snippet helpIcon()}
  <HelpIcon />
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

    &.generated {
      opacity: 0.5;
    }
  }

  td {
    padding: 0.5em;
    white-space: nowrap;
  }
  
  .fadeout {
    color: darkgray;
  }

  .ignored {
    font-style: italic;
    color: darkgray;
  }
</style>
