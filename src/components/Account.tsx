import { removeLocalStorageAccountNumber, setLocalStorageAccountNumber } from '@app/lib/fiken/account-number';
import type { FikenLineInnskudd, FikenLineUttak } from '@app/lib/fiken/types';
import type { Accessor, JSX, VoidComponent } from 'solid-js';

interface AccountProps {
  account: Accessor<string | null>;
  setAccount: (value: string | null) => void;
  line: Accessor<FikenLineInnskudd | FikenLineUttak>;
}

export const Account: VoidComponent<AccountProps> = ({ account, setAccount, line }) => {
  const onInput: JSX.ChangeEventHandler<HTMLInputElement, Event> = ({ target }) => {
    const localAccount = target.value;

    if (localAccount === account()) {
      return;
    }

    setAccount(localAccount);

    if (localAccount.length === 0) {
      removeLocalStorageAccountNumber(line().referanse);
    } else {
      setLocalStorageAccountNumber(line().referanse, localAccount.trim());
    }
  };

  return <input class={BASE_CLASSES} type="text" required value={account() ?? ''} onInput={onInput} />;
};

const BASE_CLASSES = `
justify-self-start
w-40
leading-none
text-base
text-text-default
rounded-lg
px-1
py-0.5
border
border-surface-500
bg-surface-700
focus:border-primary-500
invalid:border-error-500
focus:outline-none`;
