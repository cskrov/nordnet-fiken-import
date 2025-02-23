import type { PublicUser } from '@app/components/Account/types';
import { Button, ButtonVariant } from '@app/components/Button';
import type { Organization } from 'shared/brreg/types';
import { type Accessor, type VoidComponent, createSignal } from 'solid-js';
import CreateAccountIcon from '~icons/mdi/account-add';

interface CreateButtonProps {
  organization: Accessor<Organization>;
  password: Accessor<string>;
  email: Accessor<string>;
  onCreated: (user: PublicUser) => void;
}

export const CreateButton: VoidComponent<CreateButtonProps> = ({ organization, password, email, onCreated }) => {
  const [isLoading, setIsLoading] = createSignal(false);

  return (
    <Button
      loading={isLoading}
      variant={ButtonVariant.PRIMARY}
      icon={CreateAccountIcon}
      onClick={async () => {
        setIsLoading(true);
        const user = await createAccount(organization().organisasjonsnummer, password(), email());
        setIsLoading(false);

        if (user !== null) {
          onCreated(user);
        }
      }}
    >
      Opprett konto
    </Button>
  );
};

const createAccount = async (organizationId: string, password: string, email: string): Promise<PublicUser | null> => {
  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, password, email: email.length === 0 ? undefined : email }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create account: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
