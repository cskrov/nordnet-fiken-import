import { type NordnetLine, NordnetType } from '@app/lib/nordnet/types';

export const getForklarendeTekst = (
  nordnetLine: NordnetLine,
  fraKonto: string | null,
  tilKonto: string | null,
): string => {
  switch (nordnetLine.transaksjonstype) {
    case NordnetType.KJØPT:
      return `Kjøp av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
    case NordnetType.SALG:
      return `Salg av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
    case NordnetType.DEBETRENTE:
      return 'Debetrente';
    case NordnetType.OVERBELÅNINGSRENTE:
      return 'Overbelåningsrente';
    case NordnetType.UTTAK:
      return tilKonto === null || tilKonto.length === 0 ? nordnetLine.transaksjonstekst : `Uttak til konto ${tilKonto}`;
    case NordnetType.INNSKUDD:
      return fraKonto === null || fraKonto.length === 0
        ? nordnetLine.transaksjonstekst
        : `Innskudd fra konto ${fraKonto}`;
    case NordnetType.MVA:
      return 'MVA';
    case NordnetType.OPPBEVARING_NORDISKE_UNOTERTE:
      return 'Oppbevaring av unoterte verdipapir';
    case NordnetType.TILBAKEBETALING:
      return nordnetLine.verdipapir !== null
        ? `Tilbakebetaling ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`
        : 'Tilbakebetaling';
  }

  return nordnetLine.transaksjonstekst;
};
