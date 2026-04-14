import { For, type ParentComponent, Show } from 'solid-js';

interface Props {
  headers: string[];
  showLineNumbers?: boolean;
  rowCount: number;
}

export const Table: ParentComponent<Props> = (props) => (
  <div class="overflow-x-auto">
    <table class="w-full border-collapse border-table-border-color rounded-sm overflow-hidden">
      <thead class="bg-table-header">
        <tr>
          <Show when={props.showLineNumbers === true}>
            <th class="text-left p-2 whitespace-nowrap not-last:w-fit">#</th>
          </Show>
          <For each={props.headers}>
            {(header) => <th class="text-left p-2 whitespace-nowrap not-last:w-fit">{header}</th>}
          </For>
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  </div>
);
