import { Input } from '@app/components/Input';
import { removeLocalStorageAccountNumber, setLocalStorageAccountNumber } from '@app/lib/fiken/account-number';
import type { FikenLineInnskudd, FikenLineUttak } from '@app/lib/fiken/types';
import type { Accessor, VoidComponent } from 'solid-js';

interface AccountProps {
  account: Accessor<string | null>;
  setAccount: (value: string | null) => void;
  line: Accessor<FikenLineInnskudd | FikenLineUttak>;
}

export const Account: VoidComponent<AccountProps> = ({ account, setAccount, line }) => {
  const onInput = (localAccount: string) => {
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

  return <Input type="text" className="w-40" required value={() => account() ?? ''} onChange={onInput} />;
};
