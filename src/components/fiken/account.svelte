<script lang="ts">
  import { AccountEvent } from "@app/lib/account-event";
  import type { FikenLine } from "@app/lib/fiken";

  interface Props {
    account: string | null;
    line: FikenLine;
    referanse: string;
  }

  let { account, line, referanse }: Props = $props();

  let inputElement: HTMLInputElement;

  let localAccount = $state(
    account ?? localStorage.getItem(`account-${referanse}`) ?? "",
  );

  $effect(() => {
    if (localAccount.length === 0) {
      localStorage.removeItem(`account-${referanse}`);
    } else {
      localStorage.setItem(`account-${referanse}`, localAccount.trim());
    }
    inputElement.dispatchEvent(new AccountEvent(localAccount.trim(), line));
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
