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
import {
  ACCOUNT_TYPE_NAMES,
  ACCOUNT_TYPES,
  AccountType,
  getAccountName,
  setAccountName,
} from '@/lib/nordnet/account-alias';
import { groupNordnetLinesByAccount, toNordnetLines } from '@/lib/nordnet/csv-to-nordnet-lines';
import type { NordnetLine } from '@/lib/nordnet/types';
import { NordnetType } from '@/lib/nordnet/types';
import SaveIcon from '~icons/mdi/check';
import CancelIcon from '~icons/mdi/close';
import AutoDetectIcon from '~icons/mdi/creation';
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

  const initializedAccounts = new Set<string>();

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
        const detectedName = ACCOUNT_TYPE_NAMES[detectAccountType(lines)];

        if (savedName === null && !initializedAccounts.has(accountNumber)) {
          setAccountName(accountNumber, detectedName);
        }

        initializedAccounts.add(accountNumber);

        const effectiveName = savedName ?? detectedName;

        umami.track('Account loaded', {
          rowCount: lines.length,
          name: effectiveName,
          nameLength: effectiveName.length,
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
          {([accountNumber, lines]) => {
            const detectedType = detectAccountType(lines);
            const detectedName = ACCOUNT_TYPE_NAMES[detectedType];
            const [accountAlias, setAccountAlias] = createSignal(getAccountName(accountNumber) ?? detectedName);

            const onNameChange = (newName: string) => {
              setAccountAlias(newName);
            };

            return (
              <section class="rounded-xl border border-surface-600 overflow-hidden bg-surface-800/50">
                <AccountHeading
                  accountNumber={accountNumber}
                  initialName={accountAlias()}
                  detectedType={detectedType}
                  onNameChange={onNameChange}
                  headerBand
                />

                <div class="p-4">
                  <FikenSection nordnetLines={() => lines} accountAlias={accountAlias()} />
                </div>
              </section>
            );
          }}
        </For>
      </section>
    </Show>
  );
};

const INVESTMENT_TRANSACTION_TYPES: ReadonlySet<string> = new Set([
  NordnetType.KJØPT,
  NordnetType.SALG,
  NordnetType.PLATTFORMAVGIFT,
  NordnetType.PLATTFORMAVG_KORR,
  NordnetType.MVA,
  NordnetType.OPPBEVARING_NORDISKE_UNOTERTE,
  NordnetType.DEBETRENTE,
  NordnetType.OVERBELÅNINGSRENTE,
  NordnetType.TILBAKEBETALING_FOND_AVG,
  NordnetType.TILBAKEBETALING,
]);

const detectAccountType = (lines: NordnetLine[]): AccountType => {
  const hasInvestmentType = lines.some((line) => INVESTMENT_TRANSACTION_TYPES.has(line.transaksjonstype));

  return hasInvestmentType ? AccountType.AF : AccountType.SPK;
};

interface AccountHeadingProps {
  accountNumber: string;
  initialName: string;
  detectedType: AccountType;
  onNameChange: (name: string) => void;
  headerBand?: boolean;
}

const UNICODE_WHITESPACE = /\p{Z}+/gu;

const AccountHeading: VoidComponent<AccountHeadingProps> = (props) => {
  const [name, setName] = createSignal(props.initialName);
  const [editing, setEditing] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;

  const hasName = () => name().trim().length > 0;

  const saveAndClose = (rawValue: string) => {
    const value = rawValue.trim().replaceAll(UNICODE_WHITESPACE, ' ');

    if (value.length === 0) {
      setAccountName(props.accountNumber, '');
      setName('');
      umami.track('Clear account name');
    } else {
      setAccountName(props.accountNumber, value);
      setName(value);
      umami.track('Set account name', { name: value, nameLength: value.length });
    }

    props.onNameChange(value);
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

  const dataListId = `suggestions-${props.accountNumber}`;

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
        <div class="flex items-center gap-x-3">
          <input
            ref={(el) => {
              inputRef = el;
              setTimeout(() => el.focus());
            }}
            type="text"
            placeholder="Navn"
            value={name()}
            onKeyDown={onKeyDown}
            list={dataListId}
            class="bg-transparent border-0 border-b border-surface-400 focus:border-primary-500 outline-none text-base font-bold text-text-default px-1 h-6"
          />
          <datalist id={dataListId}>
            <For each={ACCOUNT_TYPES}>{(type) => <option value={ACCOUNT_TYPE_NAMES[type]} />}</For>
          </datalist>

          <button
            type="button"
            class="text-xs px-2 py-0.5 rounded-full bg-primary-600 hover:bg-primary-500 text-text-default cursor-pointer transition-colors inline-flex items-center gap-x-1"
            onClick={() => {
              if (inputRef !== undefined) {
                const detectedName = ACCOUNT_TYPE_NAMES[props.detectedType];
                umami.track('Select account name suggestion', { suggestion: detectedName });
                inputRef.value = detectedName;
                saveAndClose(detectedName);
              }
            }}
          >
            <AutoDetectIcon class="text-xs" />
            {ACCOUNT_TYPE_NAMES[props.detectedType]}
          </button>

          <For each={ACCOUNT_TYPES.filter((s) => s !== props.detectedType)}>
            {(type) => (
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded-full bg-surface-600 hover:bg-surface-500 text-text-default/80 cursor-pointer transition-colors"
                onClick={() => {
                  if (inputRef !== undefined) {
                    const typeName = ACCOUNT_TYPE_NAMES[type];
                    umami.track('Select account name suggestion', { suggestion: typeName });
                    inputRef.value = typeName;
                    saveAndClose(typeName);
                  }
                }}
              >
                {ACCOUNT_TYPE_NAMES[type]}
              </button>
            )}
          </For>

          <Button
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SMALL}
            icon={<SaveIcon />}
            onClick={() => {
              if (inputRef !== undefined) {
                saveAndClose(inputRef.value);
              }
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
        </div>
      </Show>
    </div>
  );
};
