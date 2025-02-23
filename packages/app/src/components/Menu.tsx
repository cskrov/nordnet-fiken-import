import { CreateAccunt } from '@app/components/Account/Create';
import { Profile } from '@app/components/Account/Profile';
import type { PublicUser } from '@app/components/Account/types';
import { Button } from '@app/components/Button';
import { Show, type VoidComponent, createEffect, createSignal } from 'solid-js';

export const Menu: VoidComponent = () => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [user, setUser] = createSignal<PublicUser | null>(null);

  createEffect(async () => {
    try {
      const res = await fetch('/api/me');

      if (res.ok) {
        setUser(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <nav class="flex flex-row justify-end bg-transparent absolute top-0 right-0 pt-2 pr-2">
      <Show when={!isLoading()} fallback={<Button>Laster...</Button>}>
        <Show when={user()} fallback={<CreateAccunt />}>
          {(user) => <Profile user={user} />}
        </Show>
      </Show>
    </nav>
  );
};
