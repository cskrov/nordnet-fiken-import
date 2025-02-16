import { For, type ParentComponent, Show } from 'solid-js';

interface Props {
  headers: string[];
  showLineNumbers?: boolean;
  rowCount: number;
}

export const Table: ParentComponent<Props> = ({ headers, showLineNumbers, rowCount, children }) => (
  <div class="overflow-x-auto">
    <table class="w-full border-collapse border-table-border-color rounded-sm overflow-hidden">
      <thead class="bg-table-header">
        <tr>
          <Show when={showLineNumbers}>
            <th class="text-left p-2 whitespace-nowrap not-last:w-fit">#</th>
          </Show>
          <For each={headers}>
            {(header) => <th class="text-left p-2 whitespace-nowrap not-last:w-fit">{header}</th>}
          </For>
        </tr>
      </thead>
      <tbody>{children}</tbody>
      <tfoot class="bg-table-footer italic text-base whitespace-nowrap">
        <tr>
          <td class="sticky left-0 p-2">{rowCount} rader</td>
        </tr>
      </tfoot>
    </table>
  </div>
);
