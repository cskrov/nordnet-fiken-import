<script lang="ts">
  import { isInnskuddLine, type FikenLine } from "@app/lib/fiken";
  import Money from "@app/components/fiken/money.svelte";
  import DateElement from "@app/components/fiken/date-element.svelte";
  import Account from "@app/components/fiken/account.svelte";
  import Button from "@app/components/button.svelte";
  import Modal from "@app/components/modal.svelte";
  import HelpIcon from "virtual:icons/mdi/help-circle";

  interface Props {
    line: FikenLine;
    lineNumber: number;
  }

  let { line, lineNumber }: Props = $props();
  let showModal = $state(false);

  const close = () => { showModal = false; };
  const open = () => { showModal = true; };

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
      <Account account={line.fraKonto} referanse={line.referanse} {line} />
    {:else if line.fraKonto === null}
      <span class="ignored">Ikke relevant</span>
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
  <td>
    {#if line.generated}
      <Button
        variant="secondary"
        size="small"
        icon={helpIcon}
        onclick={open}
      >
        Generert
      </Button>
      <Modal isOpen={showModal} onClose={close}>
        Denne raden er fylt inn for at Fiken skal kunne avstemme måneden.
      </Modal>
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
