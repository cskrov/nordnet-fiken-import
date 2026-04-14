import type { Accessor, JSX, VoidComponent } from 'solid-js';
import { removeLocalStorageAccountNumber, setLocalStorageAccountNumber } from '@/lib/fiken/account-number';
import type { FikenLineInnskudd, FikenLineUttak } from '@/lib/fiken/types';

interface AccountProps {
  account: Accessor<string | null>;
  setAccount: (value: string | null) => void;
  line: Accessor<FikenLineInnskudd | FikenLineUttak>;
}

export const Account: VoidComponent<AccountProps> = (props) => {
  const onInput: JSX.ChangeEventHandler<HTMLInputElement, Event> = ({ target }) => {
    const localAccount = target.value;

    if (localAccount === props.account()) {
      return;
    }

    props.setAccount(localAccount);

    if (localAccount.length === 0) {
      removeLocalStorageAccountNumber(props.line().referanse);
    } else {
      setLocalStorageAccountNumber(props.line().referanse, localAccount.trim());
    }
  };

  return <input class={BASE_CLASSES} type="text" required value={props.account() ?? ''} onInput={onInput} />;
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
