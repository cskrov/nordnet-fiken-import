import { CreateButton } from '@app/components/Account/CreateButton';
import { Button, ButtonVariant } from '@app/components/Button';
import { Heading, HeadingSize } from '@app/components/Heading';
import { Input } from '@app/components/Input';
import { InputDropdown } from '@app/components/InputDropdown';
import { ModalButton } from '@app/components/Modal/ModalButton';
import type { Organization } from '@shared/brreg/types';
import { searchOrg } from 'shared/brreg/search';
import { formatFikenEmail } from 'shared/fiken/email';
import { Show, type VoidComponent, createEffect, createResource, createSignal } from 'solid-js';
import CloseIcon from '~icons/mdi/WindowClose';
import CreateAccountIcon from '~icons/mdi/account-add';

export const CreateAccunt: VoidComponent = () => {
  const [name, setName] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [organization, setOrganization] = createSignal<Organization | null>(null);
  const [organizationList] = createResource(name, searchOrg);

  const clear = () => {
    setName('');
    setOrganization(null);
    setPassword('');
    setEmail('');
  };

  let modalRef: HTMLDialogElement;
  let passwordRef: HTMLInputElement;

  return (
    <ModalButton
      variant={ButtonVariant.SECONDARY}
      text="Opprett konto"
      icon={CreateAccountIcon}
      modalClassName="w-256"
      modalRef={(ref) => {
        modalRef = ref;
      }}
      onClose={clear}
      actions={
        <>
          <Show when={organization()}>
            {(org) => <CreateButton organization={org} password={password} email={email} onCreated={() => {}} />}
          </Show>

          <Button
            variant={ButtonVariant.ERROR}
            icon={CloseIcon}
            onClick={() => {
              clear();
              modalRef.close();
            }}
          >
            Avbryt
          </Button>
        </>
      }
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        <section class="flex flex-col gap-4">
          <InputDropdown
            autofocus
            placeholder="Selskapsnavn"
            onSelect={(o) => {
              setName('');
              setOrganization(o);
              createEffect(() => {
                passwordRef.focus();
              });
            }}
            onChange={setName}
            search={name}
            options={() =>
              organizationList.latest?.map((value) => ({
                label: value.navn,
                detail: value.organisasjonsnummer,
                value,
              })) ?? []
            }
          />

          <Show when={organization()}>
            {(org) => (
              <>
                <dl>
                  <dt class="font-bold mb-1">Organisasjonsnummer</dt>
                  <dd>{formatOrgNumber(org().organisasjonsnummer)}</dd>

                  <dt class="font-bold mb-1 mt-2">Navn</dt>
                  <dd>{org().navn}</dd>

                  <dt class="font-bold mb-1 mt-2">Fiken-bilag-e-post</dt>
                  <dd>{formatFikenEmail(org().navn)}</dd>
                </dl>

                <Input
                  minLength={8}
                  type="password"
                  label="Passord"
                  placeholder="Passord"
                  description="Minst 8 tegn."
                  value={password}
                  onChange={setPassword}
                  required
                  aria-describedby="password-requirement"
                  ref={(ref) => {
                    passwordRef = ref;
                  }}
                />

                <Input
                  label="E-post (valgfri)"
                  description="I tilfelle du skulle miste tilgang til Fiken-kontoen din, kan du benytte denne e-postadressen for å tilbakestille passordet."
                  type="email"
                  placeholder="E-post"
                  value={email}
                  onChange={setEmail}
                />
              </>
            )}
          </Show>
        </section>

        <section>
          <Heading level={2} size={HeadingSize.XSMALL} spacing>
            Hvorfor opprette konto?
          </Heading>

          <p>FikNet kan sende konverte CSV-filer rett til Fiken.</p>
        </section>
      </div>
    </ModalButton>
  );
};

const SPLIT_ID_REGEX = /(\d{3})(\d{3})(\d{3})/;
const formatOrgNumber = (id: string) => id.replace(SPLIT_ID_REGEX, '$1 $2 $3');
