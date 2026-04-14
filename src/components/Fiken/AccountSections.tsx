import { format } from 'date-fns';
import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  type VoidComponent,
} from 'solid-js';
import { Button, ButtonSize, ButtonVariant } from '@/components/Button';
import { FikenSection } from '@/components/Fiken/FikenSection';
import { Heading, HeadingSize } from '@/components/Heading';
import type { CsvFile } from '@/lib/csv';
import { getAccountName, removeAccountName, setAccountName } from '@/lib/nordnet/account-alias';
import { groupNordnetLinesByAccount, toNordnetLines } from '@/lib/nordnet/csv-to-nordnet-lines';
import SaveIcon from '~icons/mdi/check';
import CancelIcon from '~icons/mdi/close';
import EditIcon from '~icons/mdi/pencil';
import AddIcon from '~icons/mdi/plus';
import AccountIcon from '~icons/mdi/wallet';

interface AccountSectionsProps {
  csvFiles: Accessor<CsvFile[]>;
}

export const AccountSections: VoidComponent<AccountSectionsProps> = (props) => {
  const allNordnetLines = createMemo(() => toNordnetLines(props.csvFiles()));
  const accountGroups = createMemo(() =>
    groupNordnetLinesByAccount(allNordnetLines())
      .entries()
      .toArray()
      .toSorted(([a], [b]) => a.localeCompare(b)),
  );

  createEffect(() => {
    const groups = accountGroups();

    if (groups.length > 0) {
      const allLines = groups.flatMap(([, lines]) => lines);
      const dates = allLines.map((line) => line.bokførtDato.getTime());

      umami.track('Accounts detected', {
        accountCount: groups.length,
        earliestDate: format(new Date(Math.min(...dates)), 'yyyy-MM-dd'),
        latestDate: format(new Date(Math.max(...dates)), 'yyyy-MM-dd'),
      });

      for (const [accountNumber, lines] of groups) {
        const savedName = getAccountName(accountNumber);
        const accountDates = lines.map((line) => line.bokførtDato.getTime());

        umami.track('Account loaded', {
          rowCount: lines.length,
          savedName: savedName ?? '',
          nameLength: savedName !== null ? savedName.length : 0,
          earliestDate: format(new Date(Math.min(...accountDates)), 'yyyy-MM-dd'),
          latestDate: format(new Date(Math.max(...accountDates)), 'yyyy-MM-dd'),
        });
      }
    }
  });

  return (
    <Show when={accountGroups().length > 0}>
      <section class="flex flex-col gap-y-8">
        <Heading level={1} size={HeadingSize.SMALL}>
          Fiken
        </Heading>

        <For each={accountGroups()}>
          {([name, lines]) => (
            <section class="rounded-xl border border-surface-600 overflow-hidden bg-surface-800/50">
              <AccountHeading accountNumber={name} headerBand />

              <div class="p-4">
                <FikenSection nordnetLines={() => lines} />
              </div>
            </section>
          )}
        </For>
      </section>
    </Show>
  );
};

interface AccountHeadingProps {
  accountNumber: string;
  headerBand?: boolean;
}

const AccountHeading: VoidComponent<AccountHeadingProps> = (props) => {
  const [name, setName] = createSignal(getAccountName(props.accountNumber) ?? '');
  const [editing, setEditing] = createSignal(false);

  const hasName = () => name().trim().length > 0;

  const saveAndClose = (rawValue: string) => {
    const value = rawValue.trim();

    if (value.length === 0) {
      removeAccountName(props.accountNumber);
      setName('');
      umami.track('Remove account name');
    } else {
      setAccountName(props.accountNumber, value);
      setName(value);
      umami.track('Set account name', { name: value, nameLength: value.length });
    }

    setEditing(false);
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Enter') {
      saveAndClose(event.currentTarget.value);
    } else if (event.key === 'Escape') {
      umami.track('Cancel name edit');
      setEditing(false);
    }
  };

  return (
    <div
      class={`bg-surface-700 px-4 py-2 flex items-center gap-x-3 ${props.headerBand === true ? '' : 'rounded-lg mb-4'}`}
    >
      <AccountIcon class="shrink-0" />

      <Show when={hasName() && !editing()}>
        <button type="button" class="flex items-center gap-x-1 cursor-pointer group" onClick={() => setEditing(true)}>
          <span class="font-bold text-base">{name()}</span>
          <EditIcon class="text-text-default/0 group-hover:text-text-default/50 transition-opacity text-sm" />
        </button>
        <span class="text-text-default/80 text-sm">{props.accountNumber}</span>
      </Show>

      <Show when={!(hasName() || editing())}>
        <span class="font-bold text-base">{props.accountNumber}</span>
        <Button
          variant={ButtonVariant.SECONDARY}
          size={ButtonSize.SMALL}
          icon={<AddIcon />}
          onClick={() => setEditing(true)}
        >
          Legg til navn
        </Button>
      </Show>

      <Show when={editing()}>
        <input
          ref={(el) => setTimeout(() => el.focus())}
          type="text"
          placeholder="Navn"
          value={name()}
          onKeyDown={onKeyDown}
          class="bg-transparent border-0 border-b border-surface-400 focus:border-primary-500 outline-none text-base font-bold text-text-default px-1 h-6"
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          size={ButtonSize.SMALL}
          icon={<SaveIcon />}
          onClick={(e) => {
            const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
            saveAndClose(input.value);
          }}
        >
          Lagre
        </Button>
        <Button
          variant={ButtonVariant.NEUTRAL}
          size={ButtonSize.SMALL}
          icon={<CancelIcon />}
          onClick={() => {
            umami.track('Cancel name edit');
            setEditing(false);
          }}
        />
        <span class="text-text-default/80 text-sm">{props.accountNumber}</span>
      </Show>
    </div>
  );
};
