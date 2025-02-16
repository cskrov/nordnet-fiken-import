import { type Accessor, Index, type VoidComponent } from 'solid-js';

interface Props {
  line: Accessor<string[]>;
  lineNumber: number;
}

export const NordnetRow: VoidComponent<Props> = ({ line, lineNumber }) => (
  <tr class="odd:bg-table-odd-row even:bg-table-even-row hover:bg-table-hover-row">
    <td class="p-2 whitespace-nowrap">{lineNumber + 1}</td>
    <Index each={line()}>{(cell) => <td class="p-2 whitespace-nowrap">{cell()}</td>}</Index>
  </tr>
);
