<script lang="ts">
  interface Props {
    account: string | null;
    onChange: (account: string) => void;
    referanse: string;
  }

  let { account, onChange, referanse }: Props = $props();

  let localAccount = $state(
    account ?? localStorage.getItem(`account-${referanse}`) ?? "",
  );

  $effect(() => {
    localStorage.setItem(`account-${referanse}`, localAccount);
    onChange(localAccount);
  });
</script>

<input type="text" bind:value={localAccount} required />

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
