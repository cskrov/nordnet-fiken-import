<script lang="ts">
  import { FromAccountEvent, ToAccountEvent } from "@app/lib/account-event";
  import {
    removeLocalStorageAccountNumber,
    setLocalStorageAccountNumber,
  } from "@app/lib/fiken/account-number";
  import type { FikenLineInnskudd, FikenLineUttak } from "@app/lib/fiken/types";
  import { NordnetType } from "@app/lib/nordnet/types";

  interface Props {
    account: string | null;
    line: FikenLineInnskudd | FikenLineUttak;
  }

  let { account, line }: Props = $props();

  let inputElement: HTMLInputElement;

  const isFromAccount = $derived(line.type === NordnetType.INNSKUDD);
  let localAccount = $state(account ?? "");

  $effect(() => {
    if (localAccount === account) {
      return;
    }

    if (localAccount.length === 0) {
      removeLocalStorageAccountNumber(line.referanse);
    } else {
      setLocalStorageAccountNumber(line.referanse, localAccount.trim());
    }

    const event = isFromAccount
      ? new FromAccountEvent(localAccount.trim(), line)
      : new ToAccountEvent(localAccount.trim(), line);

    inputElement.dispatchEvent(event);
  });
</script>

<input
  type="text"
  maxlength="50"
  required
  bind:value={localAccount}
  bind:this={inputElement}
/>

<style>
  input {
    justify-self: left;
    width: 10em;
    font-size: 1em;
    color: var(--text-color);
    border-radius: 9999px;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    border-style: solid;
    border-width: 1px;
    background-color: var(--surface-700);
    border-color: var(--surface-500);

    &:invalid {
      border-color: var(--error-500);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }
</style>
