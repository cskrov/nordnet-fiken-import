<script lang="ts">
  import type { CsvFile } from "@app/lib/csv";
  import { parseCsvFiles } from "@app/lib/csv";
  import type { Snippet } from "svelte";

  type OnFiles = (files: CsvFile[]) => void;

  interface Props {
    onFiles: OnFiles;
    children: Snippet;
  }

  let { onFiles, children }: Props = $props();

  let isDragOver = $state<boolean>(false);

  let onDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    isDragOver = false;

    if (event.dataTransfer === null) {
      return;
    }

    const parsed = await parseCsvFiles(event.dataTransfer.files);

    onFiles(parsed);
  };
</script>

<main
  ondrop={onDrop}
  ondragover={(e) => {
    e.preventDefault();
    isDragOver = true;
  }}
  ondragexit={() => {
    isDragOver = false;
  }}
  ondragleave={() => {
    isDragOver = false;
  }}
  class:drag-over={isDragOver}
>
  {@render children()}
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    padding: 16px;
    border-radius: 16px;
    border-width: 3px;
    border-style: dashed;
    border-color: transparent;
    transition: border-color 0.2s ease-in-out;
    overflow: auto;
    position: relative;

    &.drag-over {
      border-color: var(--primary-500);

      &::before {
        content: "Slipp filene her";
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        color: var(--primary-500);
        backdrop-filter: blur(4px);
        transition: backdrop-filter 0.2s ease-in-out;
      }
    }
  }
</style>
