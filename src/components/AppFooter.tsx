import { createSignal, Index, type VoidComponent } from 'solid-js';
import { ButtonSize, ButtonVariant } from '@/components/Button';
import { Heading, HeadingSize } from '@/components/Heading';
import { Link } from '@/components/Link';
import { ModalButton } from '@/components/Modal/ModalButton';
import { Version, VersionSize } from '@/components/Version';
import { NORDNET_TYPES } from '@/lib/nordnet/types';

export const AppFooter: VoidComponent = () => {
  const [disclaimerShown, setDisclaimerShown] = createSignal(localStorage.getItem('disclaimer-shown') === 'v1');

  const closeDisclaimer = () => {
    setDisclaimerShown(true);
    localStorage.setItem('disclaimer-shown', 'v1');
  };

  return (
    <footer class="flex justify-center items-center flex-row gap-4 p-4 bg-surface-900 text-sm">
      <span class="italic">Denne tjenesten har ingen relasjon til Fiken eller Nordnet. Bruk på eget ansvar.</span>

      <ModalButton
        buttonText="Mer info"
        size={ButtonSize.SMALL}
        variant={ButtonVariant.PRIMARY}
        defaultOpen={!disclaimerShown()}
        onClose={closeDisclaimer}
        footerContent={
          <span class="text-xs text-gray-300 italic">
            Versjon <Version size={VersionSize.SMALL} />
          </span>
        }
      >
        <Heading level={2} size={HeadingSize.SMALL}>
          Støttede Nordnet-transaksjoner
        </Heading>
        <p>
          <span>Følgende transaksjonstyper fra Nordnet støttes:</span>
          <span class="inline-flex flex-wrap flex-row gap-1">
            <Index each={NORDNET_TYPES}>
              {(type) => <span class="text-xs bg-gray-700 px-1 py-0.5 rounded-sm font-mono">{type()}</span>}
            </Index>
          </span>
        </p>
        <p>
          Om du har eksportert filer fra Nordnet med andre typer enn de nevnt over, meld fra på{' '}
          <Link href="https://github.com/cskrov/nordnet-fiken-import/issues">GitHub</Link> med de typene som mangler og
          hva de gjelder. Inkluder gjerne en eksempelfil.
        </p>

        <Heading level={2} size={HeadingSize.SMALL}>
          Databehandling
        </Heading>
        <p>Alt prosesseres i nettleseren din. Ingen data sendes til server.</p>
        <p>
          Kontonumre lagres på enheten din med <span class="text-gray-300 font-mono">localStorage</span>.
        </p>
        <p>
          Feil kan rapporteres som issues på{' '}
          <Link href="https://github.com/cskrov/nordnet-fiken-import/issues">GitHub</Link>.
        </p>
        <p>
          <Link href="https://umami.is">Umami</Link> brukes til enkel statistikk over bruk.
        </p>
      </ModalButton>

      <Version size={VersionSize.SMALL} title="Versjon" />
    </footer>
  );
};
