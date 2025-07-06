import { ButtonSize, ButtonVariant } from '@app/components/Button';
import { Heading, HeadingSize } from '@app/components/Heading';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { NORDNET_TYPES } from '@app/lib/nordnet/types';
import { createSignal, Index, type VoidComponent } from 'solid-js';

export const AppFooter: VoidComponent = () => {
  const [disclaimerShown, setDisclaimerShown] = createSignal(localStorage.getItem('disclaimer-shown') === 'v1');

  const closeDisclaimer = () => {
    setDisclaimerShown(true);
    localStorage.setItem('disclaimer-shown', 'v1');
  };

  return (
    <footer class="flex justify-center items-center flex-row gap-4 p-4 bg-surface-900 text-sm italic">
      <span>Denne tjenesten har ingen relasjon til Fiken eller Nordnet. Bruk på eget ansvar.</span>

      <ModalButton
        buttonText="Mer info"
        size={ButtonSize.SMALL}
        variant={ButtonVariant.PRIMARY}
        defaultOpen={!disclaimerShown()}
        onClose={closeDisclaimer}
      >
        <Heading level={2} size={HeadingSize.SMALL}>
          Støttede Nordnet-transaksjoner
        </Heading>
        <p class="m-0">
          <span>Følgende transaksjonstyper fra Nordnet støttes:</span>
          <span class="inline-flex flex-wrap flex-row gap-1">
            <Index each={NORDNET_TYPES}>
              {(type) => <span class="text-xs bg-gray-700 px-1 py-0.5 rounded-sm font-mono">{type()}</span>}
            </Index>
          </span>
        </p>
        <p class="m-0">
          Om du har eksportert filer fra Nordnet med andre typer enn de nevnt over, meld fra på{' '}
          <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          med de typene som mangler og hva de gjelder. Inkluder gjerne en eksempelfil.
        </p>

        <Heading level={2} size={HeadingSize.SMALL}>
          Databehandling
        </Heading>
        <p class="m-0">Alt prosesseres i nettleseren din. Ingen data sendes til server.</p>
        <p class="m-0">
          Kontonumre lagres på enheten din med <span class="text-gray-300">localStorage</span>.
        </p>
        <p class="m-0">
          Feil kan rapporteres som issues på{' '}
          <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </ModalButton>
    </footer>
  );
};
