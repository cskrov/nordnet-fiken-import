import type { PublicUser } from '@app/components/Account/types';
import { Button, ButtonVariant } from '@app/components/Button';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { format, parseISO } from 'date-fns';
import type { Accessor, VoidComponent } from 'solid-js';
import AccountIcon from '~icons/mdi/account';
import LogoutIcon from '~icons/mdi/logout';

interface ProfileProps {
  user: Accessor<PublicUser>;
}

export const Profile: VoidComponent<ProfileProps> = ({ user }) => (
  <ModalButton text={user().email} icon={AccountIcon}>
    <dl class="mb-8">
      <dt class="font-bold">E-post</dt>
      <dd>{user().email}</dd>
      <dt class="font-bold mt-4">Opprettet</dt>
      <dd>{format(parseISO(user().createdAt), 'dd MMM yyyy')}</dd>
    </dl>

    <Button variant={ButtonVariant.ERROR} icon={LogoutIcon}>
      Logg ut
    </Button>
  </ModalButton>
);
