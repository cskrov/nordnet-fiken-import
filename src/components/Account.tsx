import { removeLocalStorageAccountNumber, setLocalStorageAccountNumber } from '@app/lib/fiken/account-number';
import type { FikenLineInnskudd, FikenLineUttak } from '@app/lib/fiken/types';
import type { JSX, VoidComponent } from 'solid-js';
import { styled } from 'solid-styled-components';

interface AccountProps {
  account: string | null;
  setAccount: (value: string | null) => void;
  line: FikenLineInnskudd | FikenLineUttak;
}

export const Account: VoidComponent<AccountProps> = ({ account, setAccount, line }) => {
  const onInput: JSX.ChangeEventHandler<HTMLInputElement, Event> = ({ target }) => {
    const localAccount = target.value;

    if (localAccount === account) {
      return;
    }

    setAccount(localAccount);

    if (localAccount.length === 0) {
      removeLocalStorageAccountNumber(line.referanse);
    } else {
      setLocalStorageAccountNumber(line.referanse, localAccount.trim());
    }
  };

  return <StyledInput type="text" required value={account ?? ''} onInput={onInput} />;
};

const StyledInput = styled.input`
  justify-self: left;
  width: 10em;
  font-size: 1em;
  color: var(--text-color);
  border-radius: var(--border-radius);
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  border-style: solid;
  border-width: 1px;
  background-color: var(--surface-700);
  border-color: var(--surface-500);

  &:invalid {
    border-color: var(--error-500);
  }

  &:focus {
    outline: none;
    border-color: var(--primary-500);
  }
`;
