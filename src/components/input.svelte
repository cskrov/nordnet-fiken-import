<script lang="ts">
  import Section from "./section.svelte";

  interface Props {
    value: string;
    label: string;
    placeholder: string;
    onchange: (value: string) => void;
  }

  const { label, onchange, ...rest }: Props = $props();
</script>

<Section variant="secondary">
  <label for="from_account">{label}</label>
  <input
    id="from_account"
    type="text"
    {...rest}
    onchange={({ currentTarget }) => onchange(currentTarget.value)}
  />
</Section>

<style>
  input {
    justify-self: left;
    width: 20em;
    font-size: 1em;
    color: var(--text-color);
    border-radius: 9999px;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    border-style: solid;
    border-width: 1px;
    background-color: var(--surface-700);
    border-color: var(--surface-500);

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }
</style>
