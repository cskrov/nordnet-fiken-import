import { Account } from '@app/components/Account';
import { ButtonSize, ButtonVariant } from '@app/components/Button';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { DisplayMoney } from '@app/components/Money';
import { isInnskuddLineAccessor, isUttakLineAccessor } from '@app/lib/fiken/guards';
import type { FikenLine } from '@app/lib/fiken/types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { type Accessor, Show, type VoidComponent } from 'solid-js';
import HelpIcon from '~icons/mdi/HelpCircle';

interface FikenRowProps {
  line: Accessor<FikenLine>;
  lineNumber: number;
}

const GENERATED_CLASSES = 'opacity-60 italic';
const NOT_GENERATED_CLASSES = 'opacity-100 normal';

const CELL_CLASSES = 'p-2 whitespace-nowrap';
const IGNORED_CLASSES = 'italic text-gray-500';

export const FikenRow: VoidComponent<FikenRowProps> = ({ line, lineNumber }) => {
  const source = line().source.fileName === null ? null : `${line().source.fileName} (${line().source.rowNumber + 1})`;

  return (
    <tr
      class={`${line().generated ? GENERATED_CLASSES : NOT_GENERATED_CLASSES} odd:bg-table-odd-row even:bg-table-even-row hover:bg-table-hover-row`}
    >
      <td class={CELL_CLASSES}>{lineNumber + 1}</td>
      <td class={CELL_CLASSES}>
        <DateElement date={line().bokførtDato} />
      </td>
      <td class={CELL_CLASSES}>
        <FromAccount line={line} />
      </td>
      <td class={CELL_CLASSES}>
        <ToAccount line={line} />
      </td>
      <td class={CELL_CLASSES}>{line().forklarendeTekst()}</td>
      <td class={CELL_CLASSES}>{line().isin}</td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{line().inngående}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney reversed>{line().ut}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{line().inn}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{line().saldo}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>{line().referanse}</td>
      <td class={CELL_CLASSES}>
        <Show when={line().generated} fallback={<span class="text-gray-500">{source}</span>}>
          <ModalButton
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SMALL}
            icon={<HelpIcon />}
            buttonText="Generert"
          >
            Denne raden er fylt inn for at Fiken skal kunne avstemme måneden.
          </ModalButton>
        </Show>
      </td>
    </tr>
  );
};

interface FromAccountProps {
  line: Accessor<FikenLine>;
}

const FromAccount: VoidComponent<FromAccountProps> = ({ line }) => {
  if (isInnskuddLineAccessor(line)) {
    return <Account account={line().fraKonto} line={line} setAccount={(account) => line().setFraKonto(account)} />;
  }

  if (line().fraKonto() === null) {
    return <span class={IGNORED_CLASSES}>Ikke relevant</span>;
  }

  return <span>{line().fraKonto()}</span>;
};

interface ToAccountProps {
  line: Accessor<FikenLine>;
}

const ToAccount: VoidComponent<ToAccountProps> = ({ line }) => {
  if (isUttakLineAccessor(line)) {
    return <Account account={line().tilKonto} line={line} setAccount={(account) => line().setTilKonto(account)} />;
  }

  if (line().tilKonto === null) {
    return <span class={IGNORED_CLASSES}>Ikke relevant</span>;
  }

  return <span>{line().tilKonto()}</span>;
};

interface DateElementProps {
  date: Date;
}

const DateElement: VoidComponent<DateElementProps> = ({ date }) => (
  <time datetime={format(date, 'yyyy-MM-dd')}>{format(date, 'dd. MMM yyyy', { locale: nb })}</time>
);
