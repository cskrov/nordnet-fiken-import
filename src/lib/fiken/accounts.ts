import { attemptToExtractAccountNumber, getLocalStorageAccountNumber } from "@app/lib/fiken/account-number";
import type { BaseFikenLine } from "@app/lib/fiken/types";
import { isNordnetType, NordnetType, type NordnetLine } from "@app/lib/nordnet/types";

export const getKonti = ({ transaksjonstype, portefølje, transaksjonstekst, beløp, id }: NordnetLine): Pick<BaseFikenLine, 'fraKonto' | 'tilKonto'> => {
  if (isNordnetType(transaksjonstype)) {
    switch (transaksjonstype) {
      case NordnetType.INNSKUDD:
        return { fraKonto: getLocalStorageAccountNumber(id) ?? attemptToExtractAccountNumber(transaksjonstekst), tilKonto: portefølje };
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
      case NordnetType.UTTAK:
        return { fraKonto: portefølje, tilKonto: getLocalStorageAccountNumber(id) ?? attemptToExtractAccountNumber(transaksjonstekst) };
    }
  }

  return { fraKonto: null, tilKonto: null };
};

