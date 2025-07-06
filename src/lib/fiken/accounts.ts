import { attemptToExtractAccountNumber, getLocalStorageAccountNumber } from '@app/lib/fiken/account-number';
import { isNordnetType, type NordnetLine, NordnetType } from '@app/lib/nordnet/types';

interface NordnetKonti {
  readonly fraKonto: string | null;
  readonly tilKonto: string | null;
}

export const getKonti = ({ transaksjonstype, portefølje, transaksjonstekst, beløp, id }: NordnetLine): NordnetKonti => {
  if (isNordnetType(transaksjonstype)) {
    switch (transaksjonstype) {
      case NordnetType.INNSKUDD:
        return {
          fraKonto: getLocalStorageAccountNumber(id) ?? attemptToExtractAccountNumber(transaksjonstekst),
          tilKonto: portefølje,
        };
      case NordnetType.KJØPT:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.SALG:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.SALDO:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.DEBETRENTE:
        return beløp < 0 ? { fraKonto: portefølje, tilKonto: null } : { fraKonto: null, tilKonto: portefølje };
      case NordnetType.OVERBELÅNINGSRENTE:
        return { fraKonto: portefølje, tilKonto: null };
      case NordnetType.PLATTFORMAVGIFT:
        return { fraKonto: portefølje, tilKonto: null };
      case NordnetType.PLATTFORMAVG_KORR:
        return { fraKonto: null, tilKonto: portefølje };
      case NordnetType.TILBAKEBETALING_FOND_AVG:
        return { fraKonto: null, tilKonto: portefølje };
      case NordnetType.UTTAK:
        return {
          fraKonto: portefølje,
          tilKonto: getLocalStorageAccountNumber(id) ?? attemptToExtractAccountNumber(transaksjonstekst),
        };
    }
  }

  return { fraKonto: null, tilKonto: null };
};
