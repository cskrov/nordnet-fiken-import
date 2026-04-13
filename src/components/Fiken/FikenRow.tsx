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

export const FikenRow: VoidComponent<FikenRowProps> = (props) => {
  const source = () =>
    props.line().source.fileName === null
      ? null
      : `${props.line().source.fileName} (${props.line().source.rowNumber + 1})`;

  return (
    <tr
      class={`${props.line().generated ? GENERATED_CLASSES : NOT_GENERATED_CLASSES} odd:bg-table-odd-row even:bg-table-even-row hover:bg-table-hover-row`}
    >
      <td class={CELL_CLASSES}>{props.lineNumber + 1}</td>
      <td class={CELL_CLASSES}>
        <DateElement date={props.line().bokførtDato} />
      </td>
      <td class={CELL_CLASSES}>
        <FromAccount line={props.line} />
      </td>
      <td class={CELL_CLASSES}>
        <ToAccount line={props.line} />
      </td>
      <td class={CELL_CLASSES}>{props.line().forklarendeTekst()}</td>
      <td class={CELL_CLASSES}>{props.line().isin}</td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{props.line().inngående}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney reversed>{props.line().ut}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{props.line().inn}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>
        <DisplayMoney>{props.line().saldo}</DisplayMoney>
      </td>
      <td class={CELL_CLASSES}>{props.line().referanse}</td>
      <td class={CELL_CLASSES}>
        <Show when={props.line().generated} fallback={<span class="text-gray-500">{source()}</span>}>
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

const FromAccount: VoidComponent<FromAccountProps> = (props) => {
  if (isInnskuddLineAccessor(props.line)) {
    return (
      <Account
        account={props.line().fraKonto}
        line={props.line}
        setAccount={(account) => props.line().setFraKonto(account)}
      />
    );
  }

  if (props.line().fraKonto() === null) {
    return <span class={IGNORED_CLASSES}>Ikke relevant</span>;
  }

  return <span>{props.line().fraKonto()}</span>;
};

interface ToAccountProps {
  line: Accessor<FikenLine>;
}

const ToAccount: VoidComponent<ToAccountProps> = (props) => {
  if (isUttakLineAccessor(props.line)) {
    return (
      <Account
        account={props.line().tilKonto}
        line={props.line}
        setAccount={(account) => props.line().setTilKonto(account)}
      />
    );
  }

  if (props.line().tilKonto === null) {
    return <span class={IGNORED_CLASSES}>Ikke relevant</span>;
  }

  return <span>{props.line().tilKonto()}</span>;
};

interface DateElementProps {
  date: Date;
}

const DateElement: VoidComponent<DateElementProps> = (props) => (
  <time datetime={format(props.date, 'yyyy-MM-dd')}>{format(props.date, 'dd. MMM yyyy', { locale: nb })}</time>
);
