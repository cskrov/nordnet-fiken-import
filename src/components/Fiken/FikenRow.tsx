import { Account } from '@app/components/Account';
import { ButtonSize, ButtonVariant } from '@app/components/Button';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { Money } from '@app/components/Money';
import { isInnskuddLineAccessor, isUttakLineAccessor } from '@app/lib/fiken/guards';
import type { FikenLine } from '@app/lib/fiken/types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { type Accessor, Show, type VoidComponent } from 'solid-js';

import { styled } from 'solid-styled-components';
import HelpIcon from '~icons/mdi/HelpCircle';

interface FikenRowProps {
  line: Accessor<FikenLine>;
  lineNumber: number;
}

export const FikenRow: VoidComponent<FikenRowProps> = ({ line, lineNumber }) => {
  const source = line().source.fileName === null ? null : `${line().source.fileName} (${line().source.rowNumber + 1})`;

  return (
    <Row $isGenerated={line().generated}>
      <Cell>{lineNumber + 1}</Cell>
      <Cell>
        <DateElement date={line().bokførtDato} />
      </Cell>
      <Cell>
        <FromAccount line={line} />
      </Cell>
      <Cell>
        <ToAccount line={line} />
      </Cell>
      <Cell>{line().forklarendeTekst()}</Cell>
      <Cell>{line().isin}</Cell>
      <Cell>
        <Money>{line().inngående}</Money>
      </Cell>
      <Cell>
        <Money reversed>{line().ut}</Money>
      </Cell>
      <Cell>
        <Money>{line().inn}</Money>
      </Cell>
      <Cell>
        <Money>{line().saldo}</Money>
      </Cell>
      <Cell>{line().referanse}</Cell>
      <Cell>
        <Show when={line().generated} fallback={<Source>{source}</Source>}>
          <ModalButton
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SMALL}
            icon={<HelpIcon />}
            buttonText="Generert"
          >
            Denne raden er fylt inn for at Fiken skal kunne avstemme måneden.
          </ModalButton>
        </Show>
      </Cell>
    </Row>
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
    return <Ignored>Ikke relevant</Ignored>;
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
    return <Ignored>Ikke relevant</Ignored>;
  }

  return <span>{line().tilKonto()}</span>;
};

interface DateElementProps {
  date: Date;
}

const DateElement: VoidComponent<DateElementProps> = ({ date }) => (
  <time datetime={format(date, 'yyyy-MM-dd')}>{format(date, 'dd. MMM yyyy', { locale: nb })}</time>
);

interface RowProps {
  $isGenerated: boolean;
}

const Row = styled.tr<RowProps>`
  opacity: ${({ $isGenerated }) => ($isGenerated ? 0.6 : 1)};
  font-style: ${({ $isGenerated }) => ($isGenerated ? 'italic' : 'normal')};

  &:nth-of-type(odd) {
    background-color: var(--table-odd-row);
  }

  &:nth-of-type(even) {
    background-color: var(--table-even-row);
  }

  &:hover {
    background-color: var(--table-hover-row);
  }
`;

const Cell = styled.td`
  padding: 0.5em;
  white-space: nowrap;
`;

const Source = styled.span`
  color: darkgray;
`;

const Ignored = styled.span`
  font-style: italic;
  color: darkgray;
`;
