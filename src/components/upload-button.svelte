<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";
  import UploadIcon from "virtual:icons/mdi/upload";
  import { parseCsvFiles } from "@app/lib/csv";
  import type { CsvFile } from "@app/lib/csv";
  import Button from "@app/components/button.svelte";

  type OnFiles = (files: CsvFile[]) => void;

  interface Props {
    onFiles: OnFiles;
  }

  let { onFiles }: Props = $props();

  let inputElement: HTMLInputElement;

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ): Promise<void> => {
    const { files } = event.currentTarget;

    if (files === null) {
      return;
    }

    onFiles(await parseCsvFiles(files));
  };
</script>

<input
  bind:this={inputElement}
  type="file"
  accept=".csv"
  multiple
  onchange={onChangeHandler}
/>
<Button onclick={() => inputElement.click()} variant="secondary" icon={uploadIcon}>
  Last opp
</Button>

{#snippet uploadIcon()}
  <UploadIcon />
{/snippet}

<style>
  input {
    display: none;
  }
</style>

