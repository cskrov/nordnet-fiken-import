import { ButtonSize, ButtonVariant } from '@app/components/Button';
import { Heading, HeadingSize } from '@app/components/Heading';
import { ModalButton } from '@app/components/Modal/ModalButton';
import { NORDNET_TYPES } from '@app/lib/nordnet/types';
import { Index, type VoidComponent, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';

export const AppFooter: VoidComponent = () => {
  const [disclaimerShown, setDisclaimerShown] = createSignal(localStorage.getItem('disclaimer-shown') === 'true');

  const closeDisclaimer = () => {
    setDisclaimerShown(true);
    localStorage.setItem('disclaimer-shown', 'true');
  };

  return (
    <StyledFooter>
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
        <StyledParagraph>
          <span>Følgende transaksjonstyper fra Nordnet støttes:</span>
          <Index each={NORDNET_TYPES}>{(type) => <Type>{type()}</Type>}</Index>
        </StyledParagraph>
        <StyledParagraph>
          Om du har eksportert filer fra Nordnet med andre typer enn de nevnt over, meld fra på{' '}
          <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          med de typene som mangler og hva de gjelder. Inkluder gjerne en eksempelfil.
        </StyledParagraph>

        <Heading level={2} size={HeadingSize.SMALL}>
          Databehandling
        </Heading>
        <StyledParagraph>Alt prosesseres i nettleseren din. Ingen data sendes til server.</StyledParagraph>
        <StyledParagraph>Ingen sporing, ingen cookies, ingen annonser.</StyledParagraph>
        <StyledParagraph>
          Kontonumre lagres på enheten din med <Pre>localStorage</Pre>.
        </StyledParagraph>
        <StyledParagraph>
          Feil kan rapporteres som issues på{' '}
          <a href="https://github.com/cskrov/nordnet-fiken-import/issues" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </StyledParagraph>
      </ModalButton>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
  column-gap: 1em;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 16px;
  background-color: var(--surface-900);
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.1);
  font-style: italic;
  font-size: 14px;
`;

const Type = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 0.8em;
  background-color: #444;
  padding: 0.2em 0.4em;
  border-radius: 4px;
`;

const Pre = styled.span`
  font-family: "Roboto Mono", monospace;
  color: darkgrey;
`;

const StyledParagraph = styled.p`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  gap: 4px;
`;
